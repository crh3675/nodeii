module.exports = function(req, res, next) {
   
   /*
    * Read the Waterline documentation for ORM methods
    * https://github.com/balderdashy/waterline
    */
   
   Student.create({ name : 'Kid' } ).exec(function(err) {
      
      if(err) {
         console.error(err);
      }
      
      console.log('Created student');
      
      Student.findOne({name: 'Kid'}).exec(function(err, result) {
         
         if(err) {
            console.error(err);
         }
         
         if(result) {
            console.log('Found student');   
         }
         
         var isOpen = Registration.isOpen();
         
         res.render('main.ejs', { name : result.name, isOpen : isOpen } );
         
      });
   });
}