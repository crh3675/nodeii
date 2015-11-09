var express = require('express')
, expressLayouts = require('express-ejs-layouts')
, expressSession = require('express-session')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, waterline = require('waterline')
, logger = require('morgan')
, fs = require('fs')
, path = require('path')
, orm = new waterline();

// Setup global app
global.sensei = {}
sensei.app = express();

module.exports = {
   
   defaults : null,
   
   /*
    * Configure the application by applying options
    * @param {Object} options, mapping to overwrite defaults
    * @return void
    */
   configure : function( options ) {
      
      // Setup defaults
      var defaults = {
         globals  : [],
         paths : {},
         cors : true,
         ssl : {
            key  : null,
            cert : null,
            ca   : null
         }
      }
      
      // Merge options
      if(options) {
         for(k in options) {
            defaults[ k ] = options[ k ];
         }   
      }

      // Configure all defaults
      sensei.paths          = {}
      sensei.managers       = {};
      sensei.entities       = {};
      sensei.services       = {};
      sensei.paths.root     = defaults.paths.root     || __dirname;
      sensei.paths.views    = defaults.paths.views    || path.join(sensei.paths.root, 'interface', 'routes');
      sensei.paths.assets   = defaults.paths.assets   || path.join(sensei.paths.root, 'interface', 'assets');
      sensei.paths.entities = defaults.paths.entities || path.join(sensei.paths.root, 'infrastructure', 'entities');
      sensei.paths.layout   = defaults.paths.layout   || path.join(sensei.paths.views, '..', 'layouts', 'default');
      sensei.paths.managers = defaults.paths.manager  || path.join(sensei.paths.root, 'infrastructure', 'managers');
      sensei.paths.services = defaults.paths.servies  ||path.join(sensei.paths.root, 'interface', 'services');
      sensei.routes         = defaults.routes         || path.join(sensei.paths.root, 'interface', 'config', 'routes');
      sensei.adapters       = defaults.adapters       || path.join(sensei.paths.root, 'infrastructure','config','adapters');
      sensei.cors           = typeof defaults.cors == 'undefined' ? true : defaults.cors;
      sensei.ssl            = defaults.ssl || null;
      sensei.cleanup        = defaults.cleanup || function noop() {};
      sensei.port           = defaults.port || 3000;
      
      // Configure express app server
      sensei.app.use(logger('combined'));
      sensei.app.use(cookieParser());
      sensei.app.use(expressSession({ name : 'senseid', secret : '7cdfb2ba6f5f67e8ce99c96c567d612f', resave: false, saveUninitialized: false }));
      sensei.app.use(bodyParser.urlencoded({ extended : false }));
      sensei.app.use(bodyParser.json());
      sensei.app.use(bodyParser.raw());
      
      this.defaults = defaults;
   },
   

   /*
    * Bootstrap all components in sequence and start the server
    * @param none
    * @return void
    */
   begin  : function(){
      
      var self = this;
      
      if(!self.defaults) {
         throw new Error('Sensei requires configure() before start()');   
      }      

      // Create proxy var to store models, managers and services
      var _entities = {}, _managers = {}, _services = {};

      /*
       * Infrastructure is code that commmunicates with Entity objects.
       * It has been abstracted from an MVC layer to better encapsulate the core
       * or business-related functionality from the UI Component. 
      */
      (function boostrap_infrastructure() {

      	var entities = fs.readdirSync(sensei.paths.entities);	

      	entities.forEach(function(entity) {
      	   var klass = entity.replace(/\.js$/i,'');
      	   var schema = require(path.join(sensei.paths.entities, entity));
      	   var def = _entities[klass.toLowerCase()] = { id : klass };

      	   if(!schema.hasOwnProperty('tableName')) {
      	      schema.tableName = klass;
      	   }

      	   schema.connection = 'default' || def.connection;

      	   def.model = waterline.Collection.extend( schema );	
      	   orm.loadCollection(def.model);
         });	

         /*
          * Managers are infrastructure components that contain complex business
          * logic.  Most likely used when agregating data from multiple entities
          */
         (function bootstrap_managers() {

            var managers = fs.readdirSync(sensei.paths.managers);

         	managers.forEach(function(manager) {
         	   var klass = manager.replace(/\.js$/i,'');
         	   _managers[klass] = require(path.join(sensei.paths.managers, manager));
            });

            sensei.app.managers = _managers;
         })();

      })();

      /*
       * Interface is code that communicates directly with the User of the application.
       * It has been abstracted from an MVC layer to better encapsulate UX/User Interaction
       * principles that should not care about the underlying architecture
      */
      (function bootstrap_interface() {

      	// ejs rendering engine for templates
      	sensei.app.set('view engine', 'ejs');
      	sensei.app.set('views', sensei.paths.views);

      	// for layout control, relative to views path
      	sensei.app.set('layout', sensei.paths.layout);
      	sensei.app.use(expressLayouts)
      	sensei.app.set('layout extractScripts', true);

      	// static asset loader
      	sensei.app.use(express.static(sensei.paths.assets));

      	// cors control
      	if(sensei.app.cors === true) {

      	   (function bootstrap_cors(){

         	   sensei.app.use(function(req, res, next) {

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
         	})();
      	}

      	/*
      	 * Routes use a simple structure to interface with the ExpresJS server
      	 */
      	(function bootstrap_routes() {

         	var routes = require(sensei.routes);

         	sensei.app.use(function(req, res, next) {

               // 
         	   var regex = /^(get|post|put|delete|patch|head)/i;

         		for(var r in routes) {

         			if(m = r.match(regex)) {
         			   var method = m[0].toLowerCase();			   
         			   var route = r.replace(new RegExp('^' + method + '\\s+','i'),'')
         			   sensei.app[ method ](route, routes[r]);
         			} else {
         			   console.warn('Invalid route detected ' + routes[r]);
         			   res.status(400).end('Invalid Request for ' + routes[r]);
         		   }
         		}	
         		next();	
         	});
         })();

      	(function bootstrap_services() {

            var services = fs.readdirSync(sensei.paths.services);

         	services.forEach(function(service) {
         	   var klass = service.replace(/\.js$/i,'');
         	   _services[klass] = require(path.join(sensei.paths.services, service));
            });

            sensei.app.services = _services;
         })();

      })();
   
      var adapters = require(sensei.adapters);
      
      if(sensei.ssl && sensei.ssl.key && sensei.ssl.cert) {
         sensei.server = require('https').createServer(sensei.ssl, sensei.app);   
      } else {
         sensei.server = require('http').createServer(sensei.app);
      }
   
      // get this server up and running
      orm.initialize(adapters, function(err, models) {

         // push entities to global scope based on file name
         if(models.collections) {              
            for(var name in models.collections) {
               
               sensei.entities[ _entities[name].id ] = models.collections[name];
               
               if(self.defaults.globals.length == 0 || self.defaults.globals.indexOf('entities') > -1) { 
                  global[ _entities[name].id ] = sensei.entities[ _entities[name].id ];
               }               
            }
         }         
   
         // push managers to global scope based on file name
         if(self.defaults.globals.length == 0 || self.defaults.globals.indexOf('managers') > -1) { 
            if(Object.keys(sensei.app.managers).length) {
               for(var name in _managers) {
                  global[ name ] = _managers[ name ];         
               }
            }
         }
   
         // push services to global scope based on file name
         if(self.defaults.globals.length == 0 || self.defaults.globals.indexOf('services') > -1) { 
            if(Object.keys(sensei.app.services).length) {
               for(var name in _services) {
                  global[ name ] = _services[ name ];         
               }
            }
         }
      
         sensei.server.setMaxListeners(0);
         sensei.server.listen(sensei.port, function(){
           console.log('Sensei says, listening on port ' + sensei.port);
         });
      });
      
      function bootstrap_cleanup(callback) {

         // attach user callback to the process event emitter
         // if no callback, it will still exit gracefully on Ctrl-C
         callback = callback || noOp;
         process.on('cleanup', callback);

         // do app specific cleaning before exiting
         process.on('exit', function () {
           process.emit('cleanup');
         });

         // catch ctrl+c event and exit normally
         process.on('SIGINT', function () {
           console.log('Ctrl-C...');
           process.exit(2);
         });

         // catch uncaught exceptions, trace, then exit normally
         process.on('uncaughtException', function(e) {
           console.log('Uncaught Exception...');
           console.log(e.stack);
           process.exit(99);
         });
      };

      bootstrap_cleanup(function(){         
         if(sensei.cleanup && typeof sensei.cleanup == 'function') {
            console.log('Sensei says cleanup time');
            sensei.cleanup();   
         }
      });
   }
};
