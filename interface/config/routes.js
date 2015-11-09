/**
 Routing uses the ExpressJS routing framework conventions

*/
module.exports = {
   'get *'       : {
      policies : [ 'auth.isAuthenticated', 'auth.isUser' ],
      expires  : 3600   
   },
	'get /'       : require('../routes/main'),
	'get /login/' : require('../routes/auth/login')
};