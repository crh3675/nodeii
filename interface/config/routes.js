/**
 Routing uses the ExpressJS routing framework conventions

*/
module.exports = {
   'get *'       : {
      policies : [ 'Security.isAuthenticated', 'Security.isUser' ],
      expires  : 3600   
   },
	'get /'       : require('../views/main'),
	'get /login/' : require('../views/auth/login')
};