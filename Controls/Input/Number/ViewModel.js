define('Controls/Input/Number/ViewModel',
   [
      'Controls/Input/Base/ViewModel',
      'Controls/Utils/splitIntoTriads',
      'Controls/Input/Number/SplitValueHelper',
      'Controls/Input/Number/InputProcessor'
   ],
   function(
      BaseViewModel,
      splitIntoTriads,
      SplitValueHelper,
      InputProcessor
   ) {
      'use strict';

      /**
       * @class Controls/Input/Number/ViewModel
       * @private
       * @author Журавлев М.С.
       */

      var _private = {
         valueWithoutTrailingZerosRegExp: /-?[0-9 ]*(\.[0-9]([1-9]|0(?!0*$))*)?/,

         integerPartRegExp: /-?[0-9]+/,

         onlyIntegerPart: function(value) {
            return _private.integerPartRegExp.test(value);
         },

         isDecimalPartEqualZero: function(value) {
            return !!value && value.indexOf('.0') === value.length - 2;
         },

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

         /**
          * @param {String} displayValue
          * @return {Number}
          * @protected
          */
         _convertToValue: function(displayValue) {
            return parseFloat(displayValue);
         },

         /**
          * @param {Number} value
          * @return {String}
          * @protected
          */
         _convertToDisplayValue: function(value) {
            var displayValue = Number.isNaN(value) ? '' : value.toString();

            return splitIntoTriads(displayValue);
         },

         handleInput: function(splitValue, inputType) {
            var
               result,
               splitValueHelper = new SplitValueHelper(splitValue),
               inputProcessor = new InputProcessor();

            // Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
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

            return ViewModel.superclass.handleInput.call(this, _private.prepareData(result), inputType);
         },

         trimTrailingZeros: function() {
            var valueWithoutTrailingZeros = this._displayValue.match(_private.valueWithoutTrailingZerosRegExp)[0];

            if (this._displayValue !== valueWithoutTrailingZeros) {
               this._displayValue = valueWithoutTrailingZeros;

               return true;
            }

            return false;
         },

         reactOnFocusIn: function() {
            if (this._options.precision !== 0 && _private.onlyIntegerPart(this._displayValue)) {
               this._displayValue += '.0';
               this._shouldBeChanged = true;
            }
         },

         reactOnFocusOut: function() {
            if (_private.isDecimalPartEqualZero(this._displayValue)) {
               this._displayValue = this._displayValue.substring(0, this._displayValue.length - 2);
               this._shouldBeChanged = true;
            }
         }
      });

      return ViewModel;
   });
