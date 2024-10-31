
const crypto = require('crypto');


/**
 A function that capitalizes each word in a string.
 * @param {string} str - The String to be capitalized.
 * @returns {Object} Returns the capitalized string.
 */
module.exports.capitalizeEachWord = function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
  }

/**
 *  A function that generates a session token.
 * @param {string} userId - The user ID.
 * @returns {Object} Returns the session token.
*/

 module.exports.generateSessionToken = function generateSessionToken(userId) {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now().toString();
    const data = `${userId}-${randomBytes}-${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }