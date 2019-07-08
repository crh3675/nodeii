var diskAdapter = require('sails-disk');

module.exports = {
   adapters : {
      'default' : diskAdapter,
      'disk' : diskAdapter
   },
   datastores: {
      default: {
         adapter: 'disk'
      }
   }
}