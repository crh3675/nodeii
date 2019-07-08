var assert = require('assert');

// Setup app for testing
before(function() {
   var sensei = require('../../sensei');

   sensei.configure({
      port : 12345,
      cors : true,
      cleanup : function() {

      }
   });
   sensei.begin();

});

after(function() {
   sensei.server.close();
   process.exit(0);
})


describe('sensei', function() {

   it('should be simple', function() {
      assert.equal('simple', 'simple');
   });

});