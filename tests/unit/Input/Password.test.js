define(
   [
      'Controls/Input/Password'
   ],
   function(Password) {

      'use strict';

      var instance;

      beforeEach(function() {
         instance = {};
      });

      describe('Controls.Input.Password', function() {
         describe('_toggleVisibilityHandler', function() {
            it('The password is visible', function() {
               instance._passwordVisible = false;

               Password.prototype._toggleVisibilityHandler.call(instance);
               assert.deepEqual(instance, {
                  _passwordVisible: true
               });
            });

            it('The password is invisible', function() {
               instance._passwordVisible = true;

               Password.prototype._toggleVisibilityHandler.call(instance);
               assert.deepEqual(instance, {
                  _passwordVisible: false
               });
            });
         });
      });
   }
);
