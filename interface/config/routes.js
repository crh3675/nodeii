/**
 Routing uses the ExpressJS routing framework conventions

*/
module.exports = {
   'get *'       : {
      policies : [ 'Security.isAuthenticated', 'Security.isUser' ],
      expires  : 3600   
   },
	'get /'       : require('../routes/main'),
	'get /login/' : require('../routes/auth/login')
};