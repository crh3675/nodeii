/**
 Routing uses the ExpressJS routing framework conventions
 
 Policies are our custom solution to `before_filter` if you want to 
 inject authentication validation or any other pre-rendering logic like i18n
*/
module.exports = {
   'get *'       : {
      policies : [ 'Access.isAuthenticated', 'Access.isAuthorized', 'Locale.setLanguage' ],
      expires  : 3600,
      
      // Custom before hook for routes
      beforeProcess : function(req, res, next) {        
        req.startTime = (new Date()).getTime(); 
        return next();
      },
      
      // Custom after hook for routes
      afterProcess : function(req, res, next) {
         res.set('X-Execute-Time', (new Date()).getTime() - req.startTime);
         return next();
      }
   },
   'get /'       : '/main',
   'get /login/' : {
      path : '/auth/login',
      cors : false
   }
};