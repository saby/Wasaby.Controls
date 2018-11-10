define(
   [
      'Controls/Input/Password',

      'Controls/Input/Password/PasswordStyles'
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

         describe('_calculateType', function() {
            var ctrl;
            beforeEach(function() {
               ctrl = new Password({});
            });
            it('Test1', function() {
               ctrl._options.autocomplete = false;

               assert.equal(ctrl._calculateType(), 'text');
            });
            it('Test2', function() {
               ctrl._options.autocomplete = false;
               ctrl._toggleVisibilityHandler();

               assert.equal(ctrl._calculateType(), 'text');
            });
            it('Test3', function() {
               ctrl._options.autocomplete = true;

               assert.equal(ctrl._calculateType(), 'password');
            });
            it('Test4', function() {
               ctrl._options.autocomplete = true;
               ctrl._toggleVisibilityHandler();

               assert.equal(ctrl._calculateType(), 'text');
            });
         });
      });
   }
);
