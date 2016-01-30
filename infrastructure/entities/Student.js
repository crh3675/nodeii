/**
 * Entities are Waterline ORM objects
 */

const EMAIL_REQUIRED    = 'emailRequired';
const PASSWORD_REQUIRED = 'passwordRequired';
const STUDENT_NOT_FOUND = 'studentNotFound';
 
// Use security component.  It is also in the global scope but this
// demonstrates how to load specifically if not global
var Security = sensei.components.Security; 
 
module.exports = {
   
   /*
    * Allow update of values after validation
    * @param {Object} values
    * @param {Function} next callback
    */
   afterValidate : function(values, next) {   
      
      if(values.password) {
         values.password = Security.hash(values.password);
      }
      next();      
   },
   
   /*
    * Validate email and password match student
    * @param {String} email
    * @param {String} password
    * @param {Function} next callback
    */
   validateLogin : function(email, password, next) {
      
      if(!email) {
         return next( EMAIL_REQUIRED );   
      }
      
      if(!password) {
         return next( PASSWORD_REQUIRED );   
      }
      
      // Locate a student by email
      Student.findOneByEmail(email).exec(function(err, student) {
         
         if(err) {
            return next(err);   
         }
         
         if(!student) {
            return next( STUDENT_NOT_FOUND );   
         }
         
         if(Security.matches(password, student.password)) {
            return next();   
         }
      });
   },
   
   attributes : {
      id : 'integer',
      name : {
         type : 'string',
         required : true
      },
      email : {
         type : 'string',
         required : true   
      },
      password : {
         type : 'string',
         required : true
      }
   }
}