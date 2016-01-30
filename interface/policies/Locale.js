module.exports = {
   
   setLanguage : function(req, res, next) {      
      req.session.lang = req.lang = new Language();
      next();
   }
   
}