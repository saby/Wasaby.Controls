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
            self._nextVersion();
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
         },
      };

      class ViewModel extends BaseViewModel {
         constructor(...args: any[]) {
            super(...args);
            this.setCarriageDefaultPosition();
         }

         _convertToValue(displayValue) {
            this._format = FormatBuilder.getFormat(this.options.mask, this.options.formatMaskChars, this.options.replacer);
            const value = Formatter.getClearData(this._format, displayValue).value;
            return value;
         }
         _convertToDisplayValue(value) {
            this._format = FormatBuilder.getFormat(this.options.mask, this.options.formatMaskChars, this.options.replacer);
            this._nextVersion();
            const fDate = Formatter.getFormatterData(this._format, { value: value, position: 0 });
            _private.updateFormatMaskChars(this, this.options.formatMaskChars);
            if (fDate && fDate.value) {
               return fDate.value;
            }
            if (this.options.replacer) {
               return this._options.mask.replace(this.formatMaskCharsRegExp, this.options.replacer);
            }
            return '';
         }
         handleInput(splitValue, inputType) {
            this._format = FormatBuilder.getFormat(this.options.mask, this.options.formatMaskChars, this.options.replacer);
            this._nextVersion();
            _private.updateFormatMaskChars(this, this.options.formatMaskChars);
            const result = InputProcessor.input(splitValue, inputType, this.options.replacer, this._format, this._format);
            return super.handleInput.call(this, _private.prepareSplitValue(result));
         }

         setCarriageDefaultPosition() {
             this.selection = this.getDefaultCarriagePosition();
             this._nextVersion();
             this._shouldBeChanged = true;
         }

         private getDefaultCarriagePosition() {
            let position;

            if (this.options.replacer) {
               position = this.displayValue.indexOf(this.options.replacer);
               return position === -1 ? this.displayValue.length : position;
            }
            return this.displayValue.length;
         }
      }

export = ViewModel;
