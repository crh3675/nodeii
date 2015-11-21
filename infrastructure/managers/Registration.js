module.exports = {
   
   newStudent : function() {
      return new Student._model()   
   },
   
   isOpen : function() {
      return false;   
   }
   
}