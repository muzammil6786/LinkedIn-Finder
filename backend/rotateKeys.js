// backend/rotateKeys.js
const keys = process.env.Api_Key.split(',');
let currentIndex = 0;

function getNextApiKey() {
    const key = keys[currentIndex];
    currentIndex = (currentIndex + 1) % keys.length;
    return key;
}

module.exports = getNextApiKey;
