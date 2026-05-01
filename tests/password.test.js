const checkPassword = require('../checkPassword');

describe('Password Validation Logic', () => {
    test('should accept valid passwords (8+ chars and 1+ number)', () => {
        expect(checkPassword('Password123')).toBe(true);
        expect(checkPassword('12345678')).toBe(true);
        expect(checkPassword('a1b2c3d4')).toBe(true);
        expect(checkPassword('!@#$%^78')).toBe(true);
    });

    test('should reject passwords shorter than 8 characters', () => {
        expect(checkPassword('Pass1')).toBe(false);
        expect(checkPassword('1234567')).toBe(false);
        expect(checkPassword('')).toBe(false);
    });

    test('should reject passwords with no numbers', () => {
        expect(checkPassword('password')).toBe(false);
        expect(checkPassword('LongPasswordNoNum')).toBe(false);
        expect(checkPassword('!!!!!!!!')).toBe(false);
    });

    test('should handle edge cases', () => {
        expect(checkPassword('        1')).toBe(true); // Whitespace counts as chars
        expect(checkPassword('1abcdefg')).toBe(true); // Number at start
    });
});
