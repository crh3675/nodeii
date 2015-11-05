var diskAdapter = require('sails-disk');

module.exports = {
   adapters : {
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