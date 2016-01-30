/**
 * Entities are Waterline ORM objects
 */
 
var Cryptography = sensei.components.Cryptography; 
 
module.exports = {
   
   afterValidate : function(values, next) {   
      if(values.password) {
         values.password = Cryptography.hash(values.password);
      }
      next();      
   },
   
   attributes : {
      id : 'integer',
      name : {
         type : 'string',
         required : true
      },
      password : {
         type : 'string',
         required : true
      }
   }
}