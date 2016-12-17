/*
 * NodeII Sensei Loader
 *
 * This is a basic loader that allows you to have access and configure whatever you need.  
 * The sensei.js is merely abstracted to make this
 * base file easier to read for configuration and startup.
 *
 * If you use a build agent, perhaps Bamboo or Jenkins, you can symlink (*nix systems) this file with
 * your custom config file in the 'config/env' folder per environment
 *
 * Example for OSX/*nix:
 * ln -s env/config/local.js app.js
 *
 * Paths
 * =======================
 * All paths can be overridden by passing to the base configure in a 'paths' param:
 *
 * { paths : { views : 'path_to_views_dir' }
 *
 * Available keys for paths are: root, views, assets, routes, adapters, entities, layout, managers, services
 *
 * Globals
 * =======================
 * By default, entities, services and managers are available in the global scope.
 * For instance, if you have an entity file "Animal.js", you can access using the global
 * variable "Animal".  You can disable globals for entities, services and managers by
 * passing a 'globals' param as an array:
 *
 * { globals : [ 'entities', 'managers', 'services', 'components' ] }
 *
 * An empty array desingates that all are global.
 *
 * CORS
 * =======================
 * By default, we have a loose CORS configuration which enables 'Access-Control-Allow*' headers
 * The only option in this file is 'true' or 'false'.  For custom configuration, you will need to
 * make changes to sensei.js
 *
 * Cleanup
 * =======================
 * Many Node apps don't handle cleanup very efficiently.  Therefore, we have an optional config param
 * for 'cleanup'.  This is fired prior to the app shutting down, whether by fatal error or CTRL+C.
 * Pass a function to this param to execute anything you want before exit.
 *
 * Sessions
 * =======================
 * In order to keep this concept slim, we only support sessions using 
 * express-session (https://github.com/expressjs/session).  
 * To customize session support, you will need to make changes in sensei.js and possibly NPM install 
 * additional modules.
 *
 * ORM
 * =======================
 * We include a slim file-based ORM called sails-disk (https://github.com/balderdashy/sails-disk) 
 * which works with waterline (https://github.com/balderdashy/waterline).  Waterline accepts many 
 * other ORM adapters but you must configure yourself in sensei.js.
 * 
 */
var sensei = require('./sensei');
var config = require('./config');

sensei.configure( config );
sensei.begin();
