export interface PrivacySettings {
  dataRetention: number; // days
  autoDelete: boolean;
  encryptionLevel: 'standard' | 'enhanced' | 'maximum';
  analyticsOptIn: boolean;
  crashReporting: boolean;
  dataExport: boolean;
  dataImport: boolean;
}

export interface DataAuditLog {
  timestamp: number;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';
  dataType: string;
  userId?: string;
  details: string;
}

class PrivacyManager {
  private settings: PrivacySettings = {
    dataRetention: 365, // 1 year default
    autoDelete: true,
    encryptionLevel: 'maximum',
    analyticsOptIn: false,
    crashReporting: false,
    dataExport: true,
    dataImport: true
  };

  private auditLog: DataAuditLog[] = [];
  private isInitialized = false;

  constructor() {
    this.initializePrivacySettings();
  }

  // Initialize privacy settings
  private async initializePrivacySettings(): Promise<void> {
    try {
      const storedSettings = localStorage.getItem('therapy_privacy_settings');
      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize privacy settings:', error);
      this.isInitialized = true; // Continue with defaults
    }
  }

  // Get current privacy settings
  getPrivacySettings(): PrivacySettings {
    return { ...this.settings };
  }

  // Update privacy settings
  async updatePrivacySettings(newSettings: Partial<PrivacySettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    
    try {
      localStorage.setItem('therapy_privacy_settings', JSON.stringify(this.settings));
      this.logAuditEvent('update', 'privacy_settings', 'Privacy settings updated');
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    }
  }

  // Log audit event
  private logAuditEvent(action: DataAuditLog['action'], dataType: string, details: string): void {
    const auditEntry: DataAuditLog = {
      timestamp: Date.now(),
      action,
      dataType,
      details
    };
    
    this.auditLog.push(auditEntry);
    
    // Keep only last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }
  }

  // Get audit log
  getAuditLog(): DataAuditLog[] {
    return [...this.auditLog];
  }

  // Check if data should be retained
  shouldRetainData(timestamp: number): boolean {
    if (!this.settings.autoDelete) return true;
    
    const ageInDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    return ageInDays <= this.settings.dataRetention;
  }

  // Clean up old data
  async cleanupOldData(): Promise<{ deleted: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;

    try {
      // This would integrate with the encrypted storage to clean up old data
      // For now, we'll just log the cleanup attempt
      this.logAuditEvent('delete', 'old_data', `Cleaned up ${deleted} old data entries`);
    } catch (error) {
      const errorMsg = `Failed to cleanup old data: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    return { deleted, errors };
  }

  // Generate privacy report
  generatePrivacyReport(): {
    settings: PrivacySettings;
    dataRetention: {
      totalEntries: number;
      entriesToDelete: number;
      oldestEntry: number;
      newestEntry: number;
    };
    auditLog: {
      totalEvents: number;
      recentEvents: DataAuditLog[];
    };
    compliance: {
      gdprCompliant: boolean;
      ccpaCompliant: boolean;
      hipaaCompliant: boolean;
    };
  } {
    const now = Date.now();
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
    
    return {
      settings: this.settings,
      dataRetention: {
        totalEntries: this.auditLog.length,
        entriesToDelete: this.auditLog.filter(entry => 
          entry.timestamp < oneYearAgo && this.shouldRetainData(entry.timestamp)
        ).length,
        oldestEntry: this.auditLog.length > 0 ? Math.min(...this.auditLog.map(e => e.timestamp)) : 0,
        newestEntry: this.auditLog.length > 0 ? Math.max(...this.auditLog.map(e => e.timestamp)) : 0
      },
      auditLog: {
        totalEvents: this.auditLog.length,
        recentEvents: this.auditLog.slice(-10)
      },
      compliance: {
        gdprCompliant: this.settings.analyticsOptIn === false && this.settings.autoDelete === true,
        ccpaCompliant: this.settings.analyticsOptIn === false,
        hipaaCompliant: this.settings.encryptionLevel === 'maximum' && this.settings.analyticsOptIn === false
      }
    };
  }

  // Export user data
  async exportUserData(): Promise<{
    data: any;
    metadata: {
      exportDate: number;
      dataTypes: string[];
      recordCount: number;
    };
  }> {
    if (!this.settings.dataExport) {
      throw new Error('Data export is disabled in privacy settings');
    }

    try {
      // This would integrate with encrypted storage to export all user data
      const exportData = {
        sessions: [],
        moodEntries: [],
        journalEntries: [],
        preferences: this.settings,
        auditLog: this.auditLog
      };

      this.logAuditEvent('export', 'user_data', 'User data exported');

      return {
        data: exportData,
        metadata: {
          exportDate: Date.now(),
          dataTypes: ['sessions', 'moodEntries', 'journalEntries', 'preferences', 'auditLog'],
          recordCount: Object.values(exportData).flat().length
        }
      };
    } catch (error) {
      this.logAuditEvent('export', 'user_data', `Export failed: ${error}`);
      throw error;
    }
  }

  // Delete all user data
  async deleteAllUserData(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name?.includes('therapy')) {
            indexedDB.deleteDatabase(db.name);
          }
        }
      }

      // Reset settings
      this.settings = {
        dataRetention: 365,
        autoDelete: true,
        encryptionLevel: 'maximum',
        analyticsOptIn: false,
        crashReporting: false,
        dataExport: true,
        dataImport: true
      };

      this.auditLog = [];
      this.logAuditEvent('delete', 'all_data', 'All user data deleted');

      return { success: true, errors };
    } catch (error) {
      const errorMsg = `Failed to delete all data: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
      return { success: false, errors };
    }
  }

  // Check if analytics are allowed
  canCollectAnalytics(): boolean {
    return this.settings.analyticsOptIn;
  }

  // Check if crash reporting is allowed
  canReportCrashes(): boolean {
    return this.settings.crashReporting;
  }

  // Get encryption level
  getEncryptionLevel(): PrivacySettings['encryptionLevel'] {
    return this.settings.encryptionLevel;
  }

  // Validate data before storage
  validateDataForStorage(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for sensitive information that shouldn't be stored
    const sensitivePatterns = [
      /ssn|social security/i,
      /credit card|card number/i,
      /password|passwd/i,
      /bank account|routing number/i
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(dataString)) {
        errors.push(`Sensitive information detected: ${pattern.source}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get privacy policy summary
  getPrivacyPolicySummary(): {
    dataCollection: string[];
    dataUsage: string[];
    dataSharing: string[];
    userRights: string[];
    contactInfo: string;
  } {
    return {
      dataCollection: [
        'All data is stored locally on your device',
        'No personal information is collected or transmitted',
        'Conversations are encrypted and never leave your device',
        'Mood and journal entries are stored locally only'
      ],
      dataUsage: [
        'Data is used only to provide therapy services',
        'No data is shared with third parties',
        'No advertising or marketing based on your data',
        'Data is used to improve your therapy experience'
      ],
      dataSharing: [
        'No data is shared with anyone',
        'No data is transmitted to external servers',
        'No data is sold to third parties',
        'Crisis situations may trigger emergency contacts (with your consent)'
      ],
      userRights: [
        'Right to access your data',
        'Right to delete your data',
        'Right to export your data',
        'Right to modify privacy settings',
        'Right to withdraw consent at any time'
      ],
      contactInfo: 'For privacy questions, contact: privacy@abdalkader.dev'
    };
  }
}

// Create singleton instance
export const privacyManager = new PrivacyManager();
export default privacyManager;