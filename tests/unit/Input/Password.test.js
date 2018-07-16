define(
   [
      'Controls/Input/Password',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function(Password, SyntheticEvent) {

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

         describe('_valueChangedHandler', function() {
            it('The value has changed', function() {
               var value = 'password';
               var inputEvent = new SyntheticEvent('input');
               var notify = function(eventName, args) {
                  this._eventName = eventName;
                  this._args = args;
               };

               instance._notify = notify;

               Password.prototype._valueChangedHandler.call(instance, inputEvent, value);
               assert.deepEqual(instance, {
                  _eventName: 'valueChanged',
                  _args: [value],
                  _notify: notify
               });
            });
         });
      });
   }
);
