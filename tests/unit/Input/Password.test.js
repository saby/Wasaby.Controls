define(
   [
      'Controls/Input/Password'
   ],
   function(Password) {
      describe('password', function() {

         it('click on show/hide icon', function() {
            var passw = new Password({});
            passw._toggleVisibilityHandler();
            assert.isTrue(passw._passwordVisible);
         });
      });
   });