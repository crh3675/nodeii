module.exports = function(req, res) {
   
 req.session.this = 'that'; 
 
 res.render('auth/login.ejs');
   
}