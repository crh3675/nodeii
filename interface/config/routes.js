/**
 Routing uses the ExpressJS routing framework conventions

*/
module.exports = {
	'get /'       : require('../routes/main'),
	'get /login/' : require('../routes/auth/login'),
	'post /'      : require('../routes/main')
};