module.exports = function(req, res, buf) {
   
   chicken.create({ name : 'Rooster' } ).exec(function(err) {
      
      if(err) {
         console.error(err);
      }
      
      chicken.findOne({name: 'Rooster'}).exec(function(err, result) {
         
         res.render('main.ejs', { name : result.name } );
         
      });
   });
}