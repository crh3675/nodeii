var express = require('express')
, expressLayouts = require('express-ejs-layouts')
, expressSession = require('express-session')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, waterline = require('waterline')
, logger = require('morgan')
, http = require('http')
, fs = require('fs')
, path = require('path')
, orm = new waterline()
, port = 3000;

// Setup global app
global.app = express();

// Configure paths for application
app.root     = __dirname;
app.views    = path.join(app.root, 'interface', 'routes');
app.assets   = path.join(app.root, 'interface', 'assets');
app.routes   = path.join(app.root, 'interface', 'config', 'routes');
app.adapters = path.join(app.root, 'infrastructure','config','adapters');
app.entities = path.join(app.root, 'infrastructure', 'entities');
app.layout   = path.join(app.views, '..', 'layouts', 'default');
app.cors     = true;

// Configure express app server
app.use(logger('combined'));
app.use(cookieParser());
app.use(expressSession({ secret : '7cdfb2ba6f5f67e8ce99c96c567d612f' }));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Create proxy var to store models
var _models = {};

/*
 * Infrastructure is code that commmunicates with Entity objects.
 * It has been abstracted from an MVC layer to better encapsulate the core
 * or business-related functionality from the UI Component. 
*/
(function boostrap_infrastructure() {
	
	var entities = fs.readdirSync(app.entities);

	entities.forEach(function(entity) {
	   var klass = entity.replace(/\.js$/i,'');
	   var schema = require(path.join(app.entities, entity));
	   var def = _models[klass.toLowerCase()] = { id : klass };
	   
	   if(!schema.hasOwnProperty('tableName')) {
	      schema.tableName = klass;
	   }
      
      schema.connection = 'default' || def.connection;
	   
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
	app.set('views', app.views);
	
	// for layout control, relative to views path
	app.set('layout', app.layout);
	app.use(expressLayouts)
	app.set('layout extractScripts', true);
	
	// static asset loader
	app.use(express.static(app.assets));

	// cors control
	if(app.cors === true) {
      app.use(function(req, res, next) {

         res.set('Access-Control-Max-Age', 60 * 60 * 24 * 365);
         res.set('Access-Control-Allow-Origin', '*');
         res.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
         res.set('Access-Control-Allow-Headers', 'Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,X-CSRF-Token');   

          // Intercept OPTIONS method
         if (req.method == 'OPTIONS') {
            return res.sendStatus(200);
         } else {        
           next();
         }
      });
   }
   
	// simple router
	var routes = require(app.routes);
	
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
var config = require(app.adapters);

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
