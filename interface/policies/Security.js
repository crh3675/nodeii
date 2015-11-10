module.exports = {
   
   isAuthenticated : function(req, res, next) {

      console.log('isAuth');
      
      return next();   
   },
   
   isUser : function(req, res, next) {
      
      console.log('isUser');
      
      return res.status(401).send('not auth');
   }
}