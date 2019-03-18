import FormatBuilder = require('Controls/_input/Mask/FormatBuilder');
import Formatter = require('Controls/_input/Mask/Formatter');
import InputProcessor = require('Controls/_input/Mask/InputProcessor');
import BaseViewModel = require('Controls/_input/Base/ViewModel');

      

      /**
       * @class Controls/_input/Text/ViewModel
       * @private
       * @author Миронов А.Ю.
       */
      var _private = {
         updateFormatMaskChars: function(self, formatMaskChars) {
            if (self._formatMaskChars === formatMaskChars) {
               return;
            }
            self._formatMaskChars = formatMaskChars;
            self.formatMaskCharsRegExp = new RegExp('[' + Object.keys(formatMaskChars).join('') + ']', 'g');
         },

         prepareSplitValue: function(result) {
            var position = result.position;
            var before = result.value.substring(0, position);
            var after = result.value.substring(position, result.value.length);

            return {
               before: before,
               after: after,
               insert: '',
               delete: ''
            };
         }
      };

      var ViewModel = BaseViewModel.extend({
         _convertToValue: function(displayValue) {
            var value = Formatter.getClearData(this._format, displayValue).value;
            return value;
         },
         _convertToDisplayValue: function(value) {
            this._format = FormatBuilder.getFormat(this.options.mask, this.options.formatMaskChars, this.options.replacer);
            var fDate = Formatter.getFormatterData(this._format, { value: value, position: 0 });
            _private.updateFormatMaskChars(this, this.options.formatMaskChars);
            if (fDate && fDate.value) {
               return fDate.value;
            }
            if (this.options.replacer) {
               return this._options.mask.replace(this.formatMaskCharsRegExp, this.options.replacer);
            }
            return '';
         },
         handleInput: function(splitValue, inputType) {
            this._format = FormatBuilder.getFormat(this.options.mask, this.options.formatMaskChars, this.options.replacer);
            _private.updateFormatMaskChars(this, this.options.formatMaskChars);
            var result = InputProcessor.input(splitValue, inputType, this.options.replacer, this._format, this._format);
            return ViewModel.superclass.handleInput.call(this, _private.prepareSplitValue(result));
         }
      });

      export = ViewModel;
   
