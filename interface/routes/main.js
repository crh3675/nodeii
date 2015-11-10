module.exports = function(req, res, buf) {
   
   Student.create({ name : 'Kid' } ).exec(function(err) {
      
      if(err) {
         console.error(err);
      }
      
      Student.findOne({name: 'Kid'}).exec(function(err, result) {
         
         var isOpen = Registration.isOpen();
         
         res.render('main.ejs', { name : result.name, isOpen : isOpen } );
         
      });
   });
}