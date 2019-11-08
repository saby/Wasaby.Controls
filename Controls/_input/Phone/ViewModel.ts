import BaseViewModel = require('Controls/_input/Base/ViewModel');
import Formatter = require('Controls/_input/Mask/Formatter');
import MaskBuilder = require('Controls/_input/Phone/MaskBuilder');
import FormatBuilder = require('Controls/_input/Mask/FormatBuilder');
import InputProcessor = require('Controls/_input/Mask/InputProcessor');
      

      /**
       * @class Controls/_input/Text/ViewModel
       * @private
       * @author Красильников А.С.
       */

      var _private = {
         REPLACER: '',

         FORMAT_MASK_CHARS: {
            'd': '[0-9]',
            '+': '[+]'
         },

         NOT_PHONE_NUMBER_SYMBOLS_REGEXP: /[^0-9+]/g,

         updateFormat: function(self, value) {
            var mask = MaskBuilder.getMask(value);

            self._format = FormatBuilder.getFormat(mask, _private.FORMAT_MASK_CHARS, _private.REPLACER);
            self._nextVersion();
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
         _format: null,

         _convertToValue: function(displayValue) {
            _private.updateFormat(this, displayValue);

            return Formatter.getClearData(this._format, displayValue).value;
         },

         _convertToDisplayValue: function(value) {
            var stringValue = value === null ? '' : value;

            _private.updateFormat(this, stringValue);

            return Formatter.getFormatterData(this._format, {
               value: stringValue,
               position: 0
            }).value;
         },

         handleInput: function(splitValue, inputType) {
            // Let the user past phone numbers from buffer in any format. Clear data from unnecessary characters.
            splitValue.insert = splitValue.insert.replace(_private.NOT_PHONE_NUMBER_SYMBOLS_REGEXP, '');
            /**
             * Если был удален разделитель через backspace или delete, то нужно удалить цифру стоящую
             * после него или перед соответственно. Для этого нужно очистить splitValue от разделителей, а
             * потом удалить цифру, в зависимости от способа(backspace или delete).
             */
            const clearSplitValue = InputProcessor.getClearSplitValue(
                splitValue,
                Formatter.getClearData(this._format, this._displayValue)
            );
            if (!clearSplitValue.delete) {
               switch (inputType) {
                  case 'deleteForward':
                     clearSplitValue.after = clearSplitValue.after.substring(1);
                     break;
                  case 'deleteBackward':
                     clearSplitValue.before = clearSplitValue.before.slice(0, -1);
                     break;
                  default:
                     break;
               }
            }

            const newMask = MaskBuilder.getMask(clearSplitValue.before + clearSplitValue.insert + clearSplitValue.after);
            const newFormat = FormatBuilder.getFormat(newMask, _private.FORMAT_MASK_CHARS, _private.REPLACER);
            const result = InputProcessor.input(splitValue, inputType, _private.REPLACER, this._format, newFormat);

            return ViewModel.superclass.handleInput.call(this, _private.prepareData(result), inputType);
         },

         isFilled: function() {
            var value = this._value === null ? '' : this._value;
            var mask = MaskBuilder.getMask(value);
            var keysRegExp = new RegExp('[' + Object.keys(_private.FORMAT_MASK_CHARS).join('|') + ']', 'g');
            var maskOfKeys = mask.match(keysRegExp);

            return value.length === maskOfKeys.length;
         },

         moveCarriageToEnd: function() {
            this.selection = this.displayValue.length;
            this._nextVersion();
            this._shouldBeChanged = true;
         }
      });

      export = ViewModel;
   
