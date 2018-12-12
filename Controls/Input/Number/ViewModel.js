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
         valueWithoutTrailingZerosRegExp: /-?[0-9 ]*(([1-9]|([0.])(?!0*$))*)?/,

         valueWithOneTrailingZerosRegExp: /-?[0-9 ]*(\.[0-9]([1-9]|0(?!0*$))*)?/,

         integerPartRegExp: /^-?[0-9]+$/,

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
            /**
             * The displayed value can be separated by spaces into triads.
             * You need to remove these gaps to parseFloat processed value completely.
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
             */
            var value = parseFloat(displayValue.replace(/ /g, ''));

            return Number.isNaN(value) ? null : value;
         },

         /**
          * @param {Number} value
          * @return {String}
          * @protected
          */
         _convertToDisplayValue: function(value) {
            var displayValue = value === null ? '' : value.toString();

            return splitIntoTriads(displayValue);
         },

         handleInput: function(splitValue, inputType) {
            var
               result,
               splitValueHelper = new SplitValueHelper(splitValue),
               inputProcessor = new InputProcessor();

            /**
             * If by mistake instead of a point entered a comma or "b" or "Yu", then perform the replacement
             */
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

         trimTrailingZeros: function(leaveOneZero) {
            if (this._options.showEmptyDecimals) {
               return false;
            }

            var regExp = leaveOneZero
               ? _private.valueWithOneTrailingZerosRegExp
               : _private.valueWithoutTrailingZerosRegExp;
            var trimmedValue = this._displayValue.match(regExp)[0];

            if (this._displayValue !== trimmedValue) {
               this._displayValue = trimmedValue;
               this._shouldBeChanged = true;

               return true;
            }

            return false;
         },

         addTrailingZero: function() {
            if (this._options.precision !== 0 && _private.onlyIntegerPart(this._displayValue)) {
               this._displayValue += '.0';
               this._shouldBeChanged = true;

               return true;
            }

            return false;
         }
      });

      return ViewModel;
   });
