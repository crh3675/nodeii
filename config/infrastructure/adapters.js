var diskAdapter = require('sails-disk');

module.exports = {
   datastores : {
      'default' : diskAdapter,
      'disk' : diskAdapter
   },
   connections : {
      'default' : {
         adapter : 'disk'
      }
   },
   defaults : {
      migrate : 'alter'
   }
}