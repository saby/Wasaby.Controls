define(
   [
      'Controls/Input/Password/ViewModel'
   ],
   function(ViewModel) {

      'use strict';

      var ctrl;

      beforeEach(function() {
         ctrl = new ViewModel({
            value: '',
            autoComplete: false,
            passwordVisible: false
         });
      });

      describe('Controls.Input.Password.ViewModel', function() {
         describe('getDisplayValue', function() {
            it('Test1', function() {
               ctrl.updateOptions({
                  value: 'test',
                  autoComplete: true,
                  passwordVisible: false
               });

               assert.deepEqual(ctrl.getDisplayValue(), 'test');
            });

            it('Test2', function() {
               ctrl.updateOptions({
                  value: 'test',
                  autoComplete: false,
                  passwordVisible: false
               });

               assert.deepEqual(ctrl.getDisplayValue(), '••••');
            });

            it('Test3', function() {
               ctrl.updateOptions({
                  value: 'test',
                  autoComplete: false,
                  passwordVisible: true
               });

               assert.deepEqual(ctrl.getDisplayValue(), 'test');
            });
         });
      });
   }
);
