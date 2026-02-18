/**
 * Tests for validation utility functions
 */
import {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  sanitizeInput,
  isRequired,
  minLength,
  maxLength,
  isStrongPassword,
  isValidCreditCard,
  validateForm,
  validationRules,
} from '@/lib/validation';

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user name@domain.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=1')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('invalid')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('://example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('returns true for valid phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('+1 234 567 8901')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('+44 20 7946 0958')).toBe(true);
    });

    it('returns false for invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('123')).toBe(false); // Too short
      expect(isValidPhone('abcdefghij')).toBe(false);
      expect(isValidPhone('123-abc-7890')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('removes angle brackets', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('removes javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    });

    it('removes event handlers', () => {
      expect(sanitizeInput('onclick=doSomething()')).toBe('doSomething()');
      expect(sanitizeInput('onmouseover = hack()')).toBe(' hack()');
    });

    it('handles normal text unchanged', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
    });
  });

  describe('isRequired', () => {
    it('returns true for non-empty strings', () => {
      expect(isRequired('hello')).toBe(true);
      expect(isRequired('  hello  ')).toBe(true);
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });

    it('returns false for null and undefined', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('minLength', () => {
    it('returns true when string meets minimum length', () => {
      expect(minLength('hello', 3)).toBe(true);
      expect(minLength('hello', 5)).toBe(true);
    });

    it('returns false when string is too short', () => {
      expect(minLength('hi', 3)).toBe(false);
      expect(minLength('', 1)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('returns true when string is within maximum length', () => {
      expect(maxLength('hi', 5)).toBe(true);
      expect(maxLength('hello', 5)).toBe(true);
    });

    it('returns false when string exceeds maximum length', () => {
      expect(maxLength('hello world', 5)).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('returns true for strong passwords', () => {
      expect(isStrongPassword('Password1!')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true);
      expect(isStrongPassword('Str0ng!Pass')).toBe(true);
    });

    it('returns false for weak passwords', () => {
      expect(isStrongPassword('password')).toBe(false); // No uppercase, number, special
      expect(isStrongPassword('PASSWORD1!')).toBe(false); // No lowercase
      expect(isStrongPassword('Password!')).toBe(false); // No number
      expect(isStrongPassword('Password1')).toBe(false); // No special character
      expect(isStrongPassword('Pas1!')).toBe(false); // Too short
    });
  });

  describe('isValidCreditCard', () => {
    it('returns true for valid credit card numbers (Luhn algorithm)', () => {
      // Test cards from various providers
      expect(isValidCreditCard('4532015112830366')).toBe(true); // Visa
      expect(isValidCreditCard('4539578763621486')).toBe(true); // Visa
      expect(isValidCreditCard('5425233430109903')).toBe(true); // Mastercard
    });

    it('returns false for invalid credit card numbers', () => {
      expect(isValidCreditCard('1234567890123456')).toBe(false);
      expect(isValidCreditCard('0000000000000000')).toBe(true); // Valid per Luhn
      expect(isValidCreditCard('123')).toBe(false); // Too short
      expect(isValidCreditCard('12345678901234567890')).toBe(false); // Too long
    });

    it('handles formatted card numbers with spaces/dashes', () => {
      expect(isValidCreditCard('4532 0151 1283 0366')).toBe(true);
      expect(isValidCreditCard('4532-0151-1283-0366')).toBe(true);
    });
  });

  describe('validateForm', () => {
    it('returns valid when all rules pass', () => {
      const data = {
        email: 'test@example.com',
        name: 'John Doe',
      };

      const rules = {
        email: [(value: unknown) => isValidEmail(value as string) || 'Invalid email'],
        name: [(value: unknown) => isRequired(value as string) || 'Name is required'],
      };

      const result = validateForm(data, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns errors when rules fail', () => {
      const data = {
        email: 'invalid-email',
        name: '',
      };

      const rules = {
        email: [(value: unknown) => isValidEmail(value as string) || 'Invalid email'],
        name: [(value: unknown) => isRequired(value as string) || 'Name is required'],
      };

      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Invalid email');
      expect(result.errors.name).toBe('Name is required');
    });

    it('stops at first error for each field', () => {
      const data = {
        password: '',
      };

      const rules = {
        password: [
          (value: unknown) => isRequired(value as string) || 'Password is required',
          (value: unknown) => minLength(value as string, 8) || 'Minimum 8 characters',
        ],
      };

      const result = validateForm(data, rules);
      expect(result.errors.password).toBe('Password is required');
    });
  });

  describe('validationRules', () => {
    it('required rule works correctly', () => {
      expect(validationRules.required('hello')).toBe(true);
      expect(validationRules.required('')).toBe('This field is required');
    });

    it('email rule works correctly', () => {
      expect(validationRules.email('test@example.com')).toBe(true);
      expect(validationRules.email('invalid')).toBe('Invalid email address');
    });

    it('minLength rule works correctly', () => {
      const rule = validationRules.minLength(5);
      expect(rule('hello')).toBe(true);
      expect(rule('hi')).toBe('Minimum length is 5 characters');
    });

    it('maxLength rule works correctly', () => {
      const rule = validationRules.maxLength(5);
      expect(rule('hello')).toBe(true);
      expect(rule('hello world')).toBe('Maximum length is 5 characters');
    });
  });
});
