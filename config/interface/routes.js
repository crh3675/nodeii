/**
 Routing uses the ExpressJS routing framework conventions
 
 Policies are our custom solution to `before_filter` if you want to 
 inject authentication validation or any other pre-rendering logic like i18n
*/
module.exports = {
   'get *'       : {
      policies : [ 'Access.isAuthenticated', 'Access.isAuthorized', 'Locale.setLanguage' ],
      expires  : 3600
   },
   'get /'       : '/main',
   'get /login/' : '/auth/login'
};