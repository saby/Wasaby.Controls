define('Controls/Input/Money/ViewModel',
   [
      'Controls/Input/Base/ViewModel',
      'Controls/Input/Money/Formatter',
      'Controls/Input/Number/InputProcessor',
      'Controls/Input/Number/SplitValueHelper'
   ],
   function(BaseViewModel, Formatter, InputProcessor, SplitValueHelper) {

      'use strict';

      var ViewModel = BaseViewModel.extend({
         handleInput: function(splitValue, inputType) {
            var
               result,
               splitValueHelper = new SplitValueHelper(splitValue),
               inputProcessor = new InputProcessor();

            this.options.precision = 2;

            //Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
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

            var dotPosition = result.value.indexOf('.');
            if (dotPosition > -1) {
               result.value += '00'.substring(0, 3 - result.value.length + dotPosition);
            } else {
               result.value += '.00';
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
