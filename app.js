var express = require('express')
, http = require('http')
, logger = require('morgan')
, app = express()
, port = 3000;

// attach a logger
app.use(logger('combined'));

/*
 * Infrastructure is code that commmunicates with Entity objects.
 * It has been abstracted from an MVC layer to better encapsulate the core
 * or business-related functionality from the UI Component. 
*/
(function boostrap_infrastructure() {
	
	var adapters = require('./infrastructure/config/adapters');
	
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

// get this server up and running
var server = http.createServer(app);
server.setMaxListeners(0);
server.listen(port, function(){
  console.log('Sensei says, listening on port ' + port);
});
