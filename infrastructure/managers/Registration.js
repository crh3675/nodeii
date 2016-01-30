module.exports = {
   
   newStudent : function() {
      return new Student._model()   
   },
   
   isOpen : function() {
      return false;   
   },
   
   openRegistration : function(next) {
    
      return next();   
   },
   
   closeRegistration : function(next) {
    
      return next();   
   }
   
}