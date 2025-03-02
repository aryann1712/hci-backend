// passGen.js

const generatePassword = () => {
    const length = 10;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';

    let password = '';

    // Add at least one character from each category
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));

    // Generate remaining characters
    const remainingLength = length - 4;
    const charset = uppercase + lowercase + numbers + specialCharacters;
    for (let i = 0; i < remainingLength; ++i) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
};

module.exports = generatePassword;