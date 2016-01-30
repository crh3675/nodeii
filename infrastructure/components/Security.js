var crypto = require('crypto');

module.exports = {

  defaultAlgorithm: 'sha512',
  defaultFormat: 'hex',

  /**
    * Hash the specified plain-text string.
    *
    * @param {String} value The plain-text value to hash.
    * @param {String|null} salt A salt value to increase security.
    *
    * @return {String} Returns the hash string.
    */
  hash: function(value, salt, algorithm, format)
  {
    var salt = salt || this.generateSalt();
    var algorithm = algorithm || this.defaultAlgorithm;
    var format = format || this.defaultFormat;

    // Get the hash value
    var hash = crypto.createHmac(algorithm, salt).update(value).digest(format);

    return (hash +':'+ salt +':'+ algorithm +':'+ format);
  },

  /**
    * Checks if the specified plain-text value matches
    * the specified hash value.
    *
    * @param {String} plaintext
    * @param {String} hash
    *
    * @return {Boolean} Returns true if they match, false is they do not match.
    */
  matches: function(plaintext, hash)
  {
    // Make sure both the plaintext and hash values are non-empty
    if (plaintext && hash) {

        // Split the hash value into parts
        var parts = hash.split(':');

        if (parts.length == 4) {
            return (hash == this.hash(plaintext, parts[1], parts[2], parts[3]));
        }
    }

    return false;
  },

  /**
    * Generate a random salt value.
    *
    * @param {Integer} length The length of the generated salt string.
    */
  generateSalt: function(length)
  {
    var length = length || 20;
    return crypto.randomBytes(length).toString('hex');
  }
}; 
