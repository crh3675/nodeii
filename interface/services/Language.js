var path = require('path');
   fs      = require('fs')
   configs = path.join(__dirname, '../', 'config/langs/');
   langs   = fs.readdirSync(configs);

var Language = function ( locale ) {
   
   var self = this;   
   self.locale  = locale || 'en-US';
   
   return function(key) {
      return Language.locales[ self.locale ][ key ] || key;      
   };
}

Language.locales = {};

langs.forEach(function(lang) {
   if(!lang.match(/^\./)) {
      Language.locales[ lang ]  = require( path.join(configs, lang) ) 
   }
});

module.exports = Language;
