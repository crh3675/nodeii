var express = require('express')
, expressLayouts = require('express-ejs-layouts')
, expressSession = require('express-session')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, waterline = require('waterline')
, logger = require('morgan')
, async = require('async')
, lodash = require('lodash')
, fs = require('fs')
, path = require('path')
, orm = new waterline();

// Setup global app
global.sensei = {}
global._ = lodash;
sensei.app = express();

module.exports = {
   
   // Base defaults are null until `configure` is called
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
         },
         session : { 
            name : 'senseid', 
            secret : '7cdfb2ba6f5f67e8ce99c96c567d612f', 
            resave: false, 
            saveUninitialized: false 
         }
      }
      
      // Recursive merge of options upon defaults
      _.merge(defaults, options);

      // Configure application using defaults
      sensei.paths          = {}
      sensei.managers       = {};
      sensei.entities       = {};
      sensei.services       = {};
      sensei.policies       = {};
      sensei.paths.root     = defaults.paths.root     || __dirname;
      sensei.paths.views    = defaults.paths.views    || path.join(sensei.paths.root, 'interface', 'routes');
      sensei.paths.assets   = defaults.paths.assets   || path.join(sensei.paths.root, 'interface', 'assets');
      sensei.paths.policies = defaults.paths.policies || path.join(sensei.paths.root, 'interface', 'policies');
      sensei.paths.entities = defaults.paths.entities || path.join(sensei.paths.root, 'infrastructure', 'entities');
      sensei.paths.layout   = defaults.paths.layout   || path.join(sensei.paths.views, '..', 'layouts', 'default');
      sensei.paths.managers = defaults.paths.manager  || path.join(sensei.paths.root, 'infrastructure', 'managers');
      sensei.paths.services = defaults.paths.servies  ||path.join(sensei.paths.root, 'interface', 'services');
      sensei.routes         = defaults.routes         || path.join(sensei.paths.root, 'interface', 'config', 'routes');
      sensei.adapters       = defaults.adapters       || path.join(sensei.paths.root, 'infrastructure','config','adapters');
      sensei.cors           = typeof defaults.cors == 'undefined' ? true : defaults.cors;
      sensei.ssl            = defaults.ssl || null;
      sensei.session        = defaults.session;
      sensei.cleanup        = defaults.cleanup || function noop() {};
      sensei.port           = defaults.port || 3000;
      
      // Configure express app server
      sensei.app.use(logger('combined'));
      sensei.app.use(cookieParser());
      sensei.app.use(expressSession(sensei.session));
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
      var _entities = {}, _managers = {}, _services = {}, _policies = {};

      /*
       * Infrastructure is code that commmunicates with Entity objects.
       * It has been abstracted from an MVC layer to better encapsulate the core
       * or business-related functionality from the UI Component. 
       *
       * - infrastructure/entities/*.js
      */
      (function boostrap_infrastructure() {

         var entities = fs.readdirSync(sensei.paths.entities);   

         entities.forEach(function(entity) {
            var klass = entity.replace(/\.js$/i,'');
            var schema = require(path.join(sensei.paths.entities, entity));
            var def = _entities[klass.toLowerCase()] = { id : klass };

            // Use custom tableName if available
            if(false == schema.hasOwnProperty('tableName')) {
               schema.tableName = klass;
            }

            // Connection will use `default` unless otherwise specified
            // - infrastructure/config/adapters.js:connection.default
            schema.connection = 'default' || def.connection;

            def.model = waterline.Collection.extend( schema );   
            orm.loadCollection(def.model);
         });   

      })();
      
       /*
        * Managers are infrastructure components that contain complex business
        * logic.  Most likely used when aggregating data from multiple entities
        *
        * - infrastructure/managers/*.js
        */
      (function bootstrap_managers() {

         var managers = fs.readdirSync(sensei.paths.managers);

         managers.forEach(function(manager) {
            var klass = manager.replace(/\.js$/i,'');
            _managers[klass] = require(path.join(sensei.paths.managers, manager));
         });

         sensei.managers = _managers;
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
         };
         
         /*
          * Policies are before-filters than run prior to routes being honored
          */
         (function bootstrap_policies() {

            var policies = fs.readdirSync(sensei.paths.policies);

            policies.forEach(function(policy) {
               var klass = policy.replace(/\.js$/i,'');
               _policies[klass] = require(path.join(sensei.paths.policies, policy));
            });

            sensei.policies = _policies;
         })();

         /*
          * Routes use a simple structure to interface with the ExpresJS server
          */
         (function bootstrap_routes() {

            var routes = require(sensei.routes);

            sensei.app.use(function(req, res, next) {

               var regex = /^(get|post|put|delete|patch|head)/i;

               for(var r in routes) {

                  // Match start of route with: get, post, put, delete, patch
                  if(m = r.match(regex)) {
                     
                     // Extract the method and route
                     var method = m[0].toLowerCase();            
                     var route = r.replace(new RegExp('^' + method + '\\s+','i'),'');
                     
                     // Create a proxy object to store temp params
                     var proxy = { route : routes[r], policies : [], expires : 0 };
                     
                     // If the configured route is an object, extract params: expires, route, policies
                     if(Object.prototype.toString.call(routes[r]) == '[object Object]') {
                        
                        // Found: expires, honor configuration
                        if(routes[r].expires) {  
                           proxy.expires = routes[r].expires;                         
                           res.set('Last-Modified',  (new Date()).toUTCString());
                           res.set('Cache-Control', 'private, proxy-revalidate, must-revalidate, max-age=' + routes[r].expires + ', s-max-age=' + routes[r].expires);
                           res.set('Surrogate-Control', 'must-revalidate, max-age=' + routes[r].expires);
                           res.set('Expires', new Date((new Date().getTime()) + (routes[r].expires * 1000)).toUTCString());                              
                        }
                        
                        // Found: route, honor route
                        if(routes[r].route) {
                           proxy.route = routes[r].route;
                        }
                        
                        // Found: policies
                        // Policies must be an array.  Values must match: interface/policies/`Policy.name`
                        if(routes[r].policies && Object.prototype.toString.call(routes[r].policies) == '[object Array]') {

                           var asyncs = [];
                           proxy.policies = routes[r].policies;

                           proxy.policies.forEach(function(policy) {
                              var parts = policy.split('.');
                              var policy = null;
                              
                              if(parts.length == 1) {
                                 throw new Error('Binding a policy to a route requires a method: Policy.method');
                              }
                              
                              // Ensure policy exists
                              if(false == sensei.policies.hasOwnProperty( parts[0] )) {
                                 throw new Error('Cannot bind non-existent policy ' + parts[0]);
                              }
                              
                              policy = sensei.policies[ parts[0] ];
                              
                              // Ensure policy has method
                              if(false == policy.hasOwnProperty( parts[1] )) {
                                 throw new Error('Cannot bind non-existent policy method ' + parts[0] + '.' + parts[1] );
                              }
                              
                              // We made it, bind the policy to the route
                              sensei.app[ method ](route, policy[ parts[1] ]);
                           });
                        }
                        
                     } else {
                        
                        // Assign route with method and route handler
                        sensei.app[ method ](route, proxy.route);
                     }
                     
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

            sensei.services = _services;
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
            if(Object.keys(sensei.managers).length) {
               for(var name in _managers) {
                  global[ name ] = _managers[ name ];         
               }
            }
         }
   
         // push services to global scope based on file name
         if(self.defaults.globals.length == 0 || self.defaults.globals.indexOf('services') > -1) { 
            if(Object.keys(sensei.services).length) {
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
