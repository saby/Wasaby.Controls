define(
   [
      'Core/core-instance',
      'Controls/Input/Number',
      'tests/resources/ProxyCall',
      'Vdom/Vdom'
   ],
   function(instance, NumberInput, ProxyCall, Vdom) {
      'use strict';

      describe('Controls.Input.Number', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new NumberInput();

            var beforeMount = ctrl._beforeMount;

            ctrl._beforeMount = function() {
               beforeMount.apply(this, arguments);

               ctrl._children[this._fieldName] = {
                  setSelectionRange: function(start, end) {
                     this.selectionStart = start;
                     this.selectionEnd = end;
                  }
               };
            };
            ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);
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
         describe('User input.', function() {
            beforeEach(function() {
               ctrl._getActiveElement = function() {
                  return ctrl._getField();
               };
            });
            it('The display value divided into triads is correctly converted to a value.', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getField().value = '1111';
               ctrl._getField().selectionStart = 4;
               ctrl._getField().selectionEnd = 4;
               ctrl._inputHandler(new Vdom.SyntheticEvent({}));

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['valueChanged', [1111, '1 111.0']]
               }]);
            });
         });
      });
   }
);
