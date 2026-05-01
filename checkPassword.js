/**
 * Minimal password validation.
 * Rule: At least 8 characters and at least 1 number.
 */
function checkPassword(inputPassword) {
    const isLongEnough = inputPassword.length >= 8;
    const hasNumber = /\d/.test(inputPassword);
    return isLongEnough && hasNumber;
}

module.exports = checkPassword;
