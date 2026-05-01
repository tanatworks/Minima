/**
 * Minimal password validation.
 * Rule: At least 8 characters and at least 1 number.
 */
function checkPassword(inputPassword) {
    const isLongEnough = inputPassword.length >= 8;
    const hasNumber = /\d/.test(inputPassword);
    return isLongEnough && hasNumber;
}

// Export for use in server.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = checkPassword;
}

// Run tests if file is executed directly (e.g., npm test)
if (require.main === module) {
    console.log("Running Password Validation Tests...");
    const testPasswords = [
        { pwd: "Password123", expected: true, reason: "Valid password" },
        { pwd: "pass1", expected: false, reason: "Too short" },
        { pwd: "passwordonly", expected: false, reason: "No numbers" },
        { pwd: "12345678", expected: true, reason: "Numbers only but long enough" }
    ];

    let failed = false;
    testPasswords.forEach(({ pwd, expected, reason }) => {
        const result = checkPassword(pwd);
        const passed = result === expected;
        console.log(`[${passed ? 'PASS' : 'FAIL'}] Input: "${pwd}" | Reason: ${reason}`);
        if (!passed) failed = true;
    });

    if (failed) {
        console.error("Tests failed!");
        process.exit(1);
    } else {
        console.log("All tests passed!");
    }
}

