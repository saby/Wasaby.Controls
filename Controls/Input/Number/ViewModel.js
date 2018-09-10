define('Controls/Input/Number/ViewModel',
   [
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Controls/Input/Number/SplitValueHelper',
      'Controls/Input/Number/InputProcessor'
   ],
   function(
      BaseViewModel,
      SplitValueHelper,
      InputProcessor
   ) {
      'use strict';

      /**
       * @class Controls/Input/Number/ViewModel
       * @private
       * @author Журавлев М.С.
       */

      var NumberViewModel = BaseViewModel.extend({

         /**
             * Валидирует и подготавливает новое значение по splitValue
             * @param splitValue
             * @param inputType
             * @returns {{value: (*|String), position: (*|Integer)}}
             */
         handleInput: function(splitValue, inputType) {
            var
               result,
               splitValueHelper = new SplitValueHelper(splitValue),
               inputProcessor = new InputProcessor();

            //Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
            splitValue.insert = splitValue.insert.toLowerCase().replace(/,|б|ю/, '.');

            switch (inputType) {
               case 'insert':
                  result = inputProcessor.processInsert(splitValue, this._options, splitValueHelper);
                  break;
               case 'delete':
                  result = inputProcessor.processDelete(splitValue, this._options, splitValueHelper);
                  break;
               case 'deleteForward':
                  result = inputProcessor.processDeleteForward(splitValue, this._options, splitValueHelper);
                  break;
               case 'deleteBackward':
                  result = inputProcessor.processDeleteBackward(splitValue, this._options, splitValueHelper);
                  break;
            }

            this._options.value = result.value.replace(/ /g, '');
            this._nextVersion();

            //Запишет значение в input и поставит курсор в указанное место
            return result;
         },

         getDisplayValue: function() {
            return InputProcessor.getValueWithDelimiters({
               before: '',
               insert: this._options.value,
               after: ''
            });
         },

         getValue: function() {
            return this._options.value;
         },

         updateOptions: function(options) {
            this._options.onlyPositive = options.onlyPositive;
            this._options.integersLength = options.integersLength;
            this._options.precision = options.precision;
            this._options.showEmptyDecimals = options.showEmptyDecimals;
            if (String(parseFloat(this._options.value)) !== options.value) {
               this._options.value = options.value;
            }
            this._nextVersion();
         },

         updateValue: function(value) {
            this._options.value = value;
            this._nextVersion();
            return value;
         }
      });

      return NumberViewModel;
   }
);
