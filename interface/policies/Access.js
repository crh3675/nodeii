module.exports = {
   
   isAuthenticated : function(req, res, next) {

      console.log('isAuthenticated');
      
      //return res.status(401).send('not auth');
      
      return next();   
   },
   
   isAuthorized : function(req, res, next) {

      console.log('isAuthorized');
      
      //return res.status(401).send('not auth');
      
      return next();   
   }
}