define(
   [
      'Core/core-instance',
      'Controls/Input/Number',
      'tests/resources/ProxyCall'
   ],
   function(instance, NumberInput, ProxyCall) {
      'use strict';

      describe('Controls.Input.Number', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new NumberInput();
            ctrl._children.input = {
               setSelectionRange: function(start, end) {
                  this.selectionStart = start;
                  this.selectionEnd = end;
               }
            };
         });

         it('getDefault', function() {
            NumberInput.getOptionTypes();
            NumberInput.getDefaultOptions();
         });
         it('The model belongs to the "Controls/Input/Number/ViewModel" class.', function() {
            ctrl._beforeMount({
               value: 0
            });

            assert.isTrue(instance.instanceOfModule(ctrl._viewModel, 'Controls/Input/Number/ViewModel'));
         });
         describe('Change event', function() {
            beforeEach(function() {
               ctrl._beforeMount({
                  value: 0
               });
               ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);
               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['displayValue'], calls);
            });
            it('ShowEmptyDecimals option equal true. Trailing zeros are not trimmed.', function() {
               ctrl._options.showEmptyDecimals = true;

               ctrl._changeHandler();

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['inputCompleted', [0, '0']]
               }]);
            });
         });
      });
   }
);
