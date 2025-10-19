export interface StoredData {
  sessions: any[];
  moodEntries: any[];
  journalEntries: any[];
  preferences: any;
  lastSync: number;
}

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
}

class EncryptedStorage {
  private dbName: string = 'therapy_encrypted_db';
  private version: number = 1;
  private db: IDBDatabase | null = null;
  private encryptionKey: CryptoKey | null = null;
  private config: EncryptionConfig = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12
  };

  constructor() {
    this.initializeDatabase();
  }

  // Initialize IndexedDB
  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.initializeEncryptionKey().then(resolve).catch(reject);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('moodEntries')) {
          db.createObjectStore('moodEntries', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('journalEntries')) {
          db.createObjectStore('journalEntries', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('encryptedData')) {
          db.createObjectStore('encryptedData', { keyPath: 'key' });
        }
      };
    });
  }

  // Initialize encryption key
  private async initializeEncryptionKey(): Promise<void> {
    try {
      // Try to get existing key from localStorage
      const storedKey = localStorage.getItem('therapy_encryption_key');
      
      if (storedKey) {
        // Import existing key
        const keyData = JSON.parse(storedKey);
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          new Uint8Array(keyData),
          { name: this.config.algorithm },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        // Generate new key
        this.encryptionKey = await crypto.subtle.generateKey(
          {
            name: this.config.algorithm,
            length: this.config.keyLength
          },
          true,
          ['encrypt', 'decrypt']
        );

        // Export and store key
        const exportedKey = await crypto.subtle.exportKey('raw', this.encryptionKey);
        localStorage.setItem('therapy_encryption_key', JSON.stringify(Array.from(new Uint8Array(exportedKey))));
      }
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Encryption initialization failed');
    }
  }

  // Encrypt data
  private async encrypt(data: any): Promise<{ encrypted: Uint8Array; iv: Uint8Array }> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const dataString = JSON.stringify(data);
    const dataBuffer = new TextEncoder().encode(dataString);
    const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.config.algorithm,
        iv: iv
      },
      this.encryptionKey,
      dataBuffer
    );

    return {
      encrypted: new Uint8Array(encrypted),
      iv: iv
    };
  }

  // Decrypt data
  private async decrypt(encrypted: Uint8Array, iv: Uint8Array): Promise<any> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.config.algorithm,
        iv: iv
      },
      this.encryptionKey,
      encrypted
    );

    const decryptedString = new TextDecoder().decode(decrypted);
    return JSON.parse(decryptedString);
  }

  // Store encrypted data
  async storeEncrypted(key: string, data: any): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const { encrypted, iv } = await this.encrypt(data);
      
      const transaction = this.db.transaction(['encryptedData'], 'readwrite');
      const store = transaction.objectStore('encryptedData');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put({
          key,
          encrypted: Array.from(encrypted),
          iv: Array.from(iv),
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      throw error;
    }
  }

  // Retrieve and decrypt data
  async getEncrypted(key: string): Promise<any | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const transaction = this.db.transaction(['encryptedData'], 'readonly');
      const store = transaction.objectStore('encryptedData');
      
      const result = await new Promise<any>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!result) return null;

      const encrypted = new Uint8Array(result.encrypted);
      const iv = new Uint8Array(result.iv);
      
      return await this.decrypt(encrypted, iv);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  }

  // Store therapy session
  async storeSession(session: any): Promise<void> {
    await this.storeEncrypted(`session_${session.id}`, session);
  }

  // Get therapy session
  async getSession(sessionId: string): Promise<any | null> {
    return await this.getEncrypted(`session_${sessionId}`);
  }

  // Get all sessions
  async getAllSessions(): Promise<any[]> {
    if (!this.db) return [];

    try {
      const transaction = this.db.transaction(['encryptedData'], 'readonly');
      const store = transaction.objectStore('encryptedData');
      
      const sessions = await new Promise<any[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result
            .filter(item => item.key.startsWith('session_'))
            .map(item => ({
              key: item.key,
              timestamp: item.timestamp
            }));
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });

      // Decrypt all sessions
      const decryptedSessions = [];
      for (const session of sessions) {
        const decrypted = await this.getEncrypted(session.key);
        if (decrypted) {
          decryptedSessions.push(decrypted);
        }
      }

      return decryptedSessions.sort((a, b) => b.startTime - a.startTime);
    } catch (error) {
      console.error('Failed to get all sessions:', error);
      return [];
    }
  }

  // Store mood entry
  async storeMoodEntry(entry: any): Promise<void> {
    await this.storeEncrypted(`mood_${entry.id}`, entry);
  }

  // Get mood entries
  async getMoodEntries(): Promise<any[]> {
    if (!this.db) return [];

    try {
      const transaction = this.db.transaction(['encryptedData'], 'readonly');
      const store = transaction.objectStore('encryptedData');
      
      const entries = await new Promise<any[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result
            .filter(item => item.key.startsWith('mood_'))
            .map(item => ({
              key: item.key,
              timestamp: item.timestamp
            }));
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });

      // Decrypt all entries
      const decryptedEntries = [];
      for (const entry of entries) {
        const decrypted = await this.getEncrypted(entry.key);
        if (decrypted) {
          decryptedEntries.push(decrypted);
        }
      }

      return decryptedEntries.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get mood entries:', error);
      return [];
    }
  }

  // Store journal entry
  async storeJournalEntry(entry: any): Promise<void> {
    await this.storeEncrypted(`journal_${entry.id}`, entry);
  }

  // Get journal entries
  async getJournalEntries(): Promise<any[]> {
    if (!this.db) return [];

    try {
      const transaction = this.db.transaction(['encryptedData'], 'readonly');
      const store = transaction.objectStore('encryptedData');
      
      const entries = await new Promise<any[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result
            .filter(item => item.key.startsWith('journal_'))
            .map(item => ({
              key: item.key,
              timestamp: item.timestamp
            }));
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });

      // Decrypt all entries
      const decryptedEntries = [];
      for (const entry of entries) {
        const decrypted = await this.getEncrypted(entry.key);
        if (decrypted) {
          decryptedEntries.push(decrypted);
        }
      }

      return decryptedEntries.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get journal entries:', error);
      return [];
    }
  }

  // Store preferences
  async storePreferences(preferences: any): Promise<void> {
    await this.storeEncrypted('preferences', preferences);
  }

  // Get preferences
  async getPreferences(): Promise<any | null> {
    return await this.getEncrypted('preferences');
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['encryptedData'], 'readwrite');
      const store = transaction.objectStore('encryptedData');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Clear encryption key
      localStorage.removeItem('therapy_encryption_key');
      this.encryptionKey = null;
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  // Export data (for backup)
  async exportData(): Promise<StoredData> {
    const sessions = await this.getAllSessions();
    const moodEntries = await this.getMoodEntries();
    const journalEntries = await this.getJournalEntries();
    const preferences = await this.getPreferences();

    return {
      sessions,
      moodEntries,
      journalEntries,
      preferences: preferences || {},
      lastSync: Date.now()
    };
  }

  // Import data (for restore)
  async importData(data: StoredData): Promise<void> {
    try {
      // Clear existing data
      await this.clearAllData();
      
      // Reinitialize
      await this.initializeDatabase();

      // Import sessions
      for (const session of data.sessions) {
        await this.storeSession(session);
      }

      // Import mood entries
      for (const entry of data.moodEntries) {
        await this.storeMoodEntry(entry);
      }

      // Import journal entries
      for (const entry of data.journalEntries) {
        await this.storeJournalEntry(entry);
      }

      // Import preferences
      if (data.preferences) {
        await this.storePreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const encryptedStorage = new EncryptedStorage();
export default encryptedStorage;