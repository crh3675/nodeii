var path = require('path');
   fs      = require('fs')
   configs = path.join(__dirname, '..', '..', 'config', 'interface', 'langs');
   langs   = fs.readdirSync(configs);

/*
 * Setup an instance of a new language
 * @param {String} locale
 * @returns {Function}( {String} ) key to retrieve
 */
var Language = function ( locale ) {
   
   var self = this;   
   self.locale  = locale || 'en-US';
   
   return function(key) {
      return Language.locales[ self.locale ][ key ] || key;      
   };
}

Language.locales = {};

// Preload languages for quick access
langs.forEach(function(lang) {
   if(!lang.match(/^\./)) {
      Language.locales[ lang ] = require( path.join(configs, lang) ) 
   }
});

module.exports = Language;
