var express = require('express')
, bodyParser = require('body-parser')
, http = require('http')
, logger = require('morgan')
, fs = require('fs')
, path = require('path')
, app = express()
, waterline = require('waterline')
, orm = new waterline()
, port = 3000;

app.use(logger('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
var _models = {};

/*
 * Infrastructure is code that commmunicates with Entity objects.
 * It has been abstracted from an MVC layer to better encapsulate the core
 * or business-related functionality from the UI Component. 
*/
(function boostrap_infrastructure() {
	
	var entities = fs.readdirSync('./infrastructure/entities');

	entities.forEach(function(entity) {
	   var klass = entity.replace(/\.js$/i,'');
	   var schema = require('./infrastructure/entities/' + entity);
	   var def = _models[klass.toLowerCase()] = { id : klass };
	   
	   if(!schema.hasOwnProperty('tableName')) {
	      schema.tableName = klass;
      }
	   
	   def.model = waterline.Collection.extend( schema );	
	   orm.loadCollection(def.model);
   });	

})();

/*
 * Interface is code that communicates directly with the User of the application.
 * It has been abstracted from an MVC layer to better encapsulate UX/User Interaction
 * principles that should not care about the underlying architecture
*/
(function bootstrap_interface() {
	
	// ejs rendering engine for templates
	app.set('view engine', 'ejs');
	app.set('views', './interface/routes');
	
	// for layout control, relative to views path
	app.use(require('express-ejs-layouts'));
	app.set('layout', '../layouts/default');
	
	// static asset loader
	app.use(express.static(__dirname + '/interface/assets'));

	// custom router
	var routes = require('./interface/config/routes');
	app.use(function(req, res, next) {

		for(var r in routes) {

			if(r.match(/^get/i)) {
				app.get(r.replace(/^get\s+/i,''), routes[r]);
			}

			if(r.match(/^post/i)) {
				app.post(r.replace(/^post\s+/i,''), routes[r]);
			}

			if(r.match(/^put/i)) {
				app.put(r.replace(/^put\s+/i,''), routes[r]);
			}
			
			/*
			I have never liked DELETE, it just sounds bad no matter 
			how secure you think your app is. But if you are determined, just 
			uncomment the lines below.
			*/
			/*
			if(r.match(/^delete/i)) {
				app.delete(r.replace(/^delete\s+/i,''), routes[r]);
			}
			*/
		}	
		next();	
	});
})();

var server = http.createServer(app);
var config = require('./infrastructure/config/adapters');

// get this server up and running
orm.initialize(config, function(err, models) {

   // push entities to global scope based on file name
   if(models.collections) {
      for(var name in models.collections) {
         global[ _models[name].id ] = models.collections[name];
      }
   }
      
   server.setMaxListeners(0);
   server.listen(port, function(){
     console.log('Sensei says, listening on port ' + port);
   });
});
