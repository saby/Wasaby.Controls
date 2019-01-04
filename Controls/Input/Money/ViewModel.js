define('Controls/Input/Money/ViewModel',
   [
      'Controls/Input/Base/ViewModel',
      'Controls/Input/Number/InputProcessor',
      'Controls/Input/Number/SplitValueHelper'
   ],
   function(BaseViewModel, InputProcessor, SplitValueHelper) {
      'use strict';

      var _private = {
         prepareData: function(result) {
            var position = result.position;
            return {
               before: result.value.substring(0, position),
               after: result.value.substring(position, result.value.length),
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

            return ViewModel.superclass.handleInput.call(this, _private.prepareData(result), inputType);
         }
      });

      return ViewModel;
   });
