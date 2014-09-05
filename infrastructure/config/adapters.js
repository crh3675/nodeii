var diskAdapter = require('sails-disk');

module.exports = {
   adapters : {
      'default' : diskAdapter,
      'disk' : diskAdapter
   },
   connections : {
      localDisk : {
         adapter : 'disk'
      }
	},
	defaults : {
	   migrate : 'alter'
	}	
}