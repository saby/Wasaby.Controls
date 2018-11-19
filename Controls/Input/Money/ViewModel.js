define('Controls/Input/Money/ViewModel',
   [
      'Controls/Input/Base/ViewModel',
      'Controls/Input/Number/InputProcessor',
      'Controls/Input/Number/SplitValueHelper'
   ],
   function(BaseViewModel, InputProcessor, SplitValueHelper) {

      'use strict';

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

            this._value = result.value;
            this._selection.start = result.position;
            this._selection.end = result.position;

            this._shouldBeChanged = true;

            return true;
         }
      });

      return ViewModel;
   }
);
