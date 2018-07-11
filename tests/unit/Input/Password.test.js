define(
   [
      'Controls/Input/Password',
      'Core/vdom/Synchronizer/resources/SyntheticEvent',
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(Password, SyntheticEvent, BaseViewModel) {

      'use strict';

      var instance;
      var superConstructor = Password.superclass.constructor;

      beforeEach(function() {
         instance = {};
         Password.superclass.constructor = function() {};
      });

      afterEach(function() {
         Password.superclass.constructor = superConstructor;
      });

      describe('Controls.Input.Password', function() {
         describe('Life', function() {
            it('constructor', function() {
               var value = 'password';
               var options = {
                  value: value
               };
               var viewModel = new BaseViewModel({
                  value: value
               });

               Password.prototype.constructor.call(instance, options);
               assert.deepEqual(instance, {
                  _simpleViewModel: viewModel
               });
            });

            it('_beforeUpdate', function() {
               var value = 'drowssap';
               var options = {
                  value: value
               };
               var viewModel = new BaseViewModel({
                  value: value
               });

               viewModel.updateOptions(options);
               instance._simpleViewModel = new BaseViewModel({
                  value: 'password'
               });

               Password.prototype._beforeUpdate.call(instance, options);
               assert.deepEqual(instance, {
                  _simpleViewModel: viewModel
               });
            });

            it('options', function() {
               Password.getOptionTypes();
               Password.getDefaultOptions();
            });
         });

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
