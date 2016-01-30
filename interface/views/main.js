module.exports = function(req, res, next) {
   
   /*
    * Read the Waterline documentation for ORM methods
    * https://github.com/balderdashy/waterline
    */
   
   Student.create({ name : 'Kid', password : 'ChangeMENow!' } ).exec(function(err) {
      
      var errors = [];
      
      if(err) {
         console.error(err);
         errors.push(err);
      }
      
      console.log('Created student');
      
      Student.findOne({name: 'Kid'}).exec(function(err, result) {
         
         if(err) {
            console.error(err);
            errors.push(err);
         }
         
         if(result) {
            console.log('Found student');   
         }
         
         var isOpen = Registration.isOpen();
         
         res.render('main.ejs', { name : result.name, isOpen : isOpen, errors : errors } );
         
      });
   });
}