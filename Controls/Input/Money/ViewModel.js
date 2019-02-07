define('Controls/Input/Money/ViewModel',
   [
      'Controls/Input/Base/ViewModel',
      'Controls/Input/Number/InputProcessor',
      'Controls/Input/Number/SplitValueHelper'
   ],
   function(BaseViewModel, InputProcessor, SplitValueHelper) {
      'use strict';

      var _private = {
         prepareData: function(result, precision) {
            var value = result.value;
            var lengthDecimalPath = value.length - value.indexOf('.') - 1;
            var countOfMissingZeros = value.length && precision - lengthDecimalPath;

            if (countOfMissingZeros) {
               value = value + '0'.repeat(countOfMissingZeros);
            }

            var position = result.position;

            return {
               before: value.substring(0, position),
               after: value.substring(position, value.length),
               insert: '',
               delete: ''
            };
         }
      };

      var ViewModel = BaseViewModel.extend({
         handleInput: function(splitValue, inputType) {
            var
               result,
               splitValueHelper = new SplitValueHelper(splitValue),
               inputProcessor = new InputProcessor();

            /**
             * If by mistake instead of a point entered a ',' or "b" or "Yu", then perform the replacement.
             */
            splitValue.insert = splitValue.insert.toLowerCase().replace(/,|б|ю/, '.');

            switch (inputType) {
               case 'insert':
                  result = inputProcessor.processInsert(splitValue, this.options, splitValueHelper);
                  break;
               case 'delete':
                  result = inputProcessor.processDelete(splitValue, this.options, splitValueHelper);
                  break;
               case 'deleteForward':
                  result = inputProcessor.processDeleteForward(splitValue, this.options, splitValueHelper);
                  break;
               case 'deleteBackward':
                  result = inputProcessor.processDeleteBackward(splitValue, this.options, splitValueHelper);
                  break;
            }

            var data = _private.prepareData(result, this._options.precision);

            return ViewModel.superclass.handleInput.call(this, data, inputType);
         }
      });

      return ViewModel;
   });
