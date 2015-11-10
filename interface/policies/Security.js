module.exports = {
   
   isAuthenticated : function(req, res, next) {

      console.log('isAuthenticated');
      
      //return res.status(401).send('not auth');
      
      return next();   
   },
   
   isUser : function(req, res, next) {
      
      console.log('isUser');
      
      return next();
   }
}