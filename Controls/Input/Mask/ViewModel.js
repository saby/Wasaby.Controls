define('Controls/Input/Mask/ViewModel',
   [
      'Controls/Input/Mask/FormatBuilder',
      'Controls/Input/Mask/Formatter',
      'Controls/Input/Mask/InputProcessor',
      'Controls/Input/Base/ViewModel'
   ],
   function(FormatBuilder, Formatter, InputProcessor, BaseViewModel) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
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
         constructor: function(options) {
            this._options = {
               value: options.value
            };
            this._mask = options.mask;
            this._replacer = options.replacer;
            this._format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);
            _private.updateFormatMaskChars(this, options.formatMaskChars);
            return ViewModel.superclass.constructor.apply(this, arguments);
         },

         _convertToValue: function(displayValue) {
            var value = Formatter.getClearData(this._format, displayValue).value;
            return value;
         },
         _convertToDisplayValue: function() {
            var fDate = Formatter.getFormatterData(this._format, { value: this._options.value, position: 0 });
            this._replacer = this.options.replacer;
            this._mask = this.options.mask;
            this._format = FormatBuilder.getFormat(this._mask, this.options.formatMaskChars, this._replacer);
            _private.updateFormatMaskChars(this, this.options.formatMaskChars);
            if (fDate && fDate.value) {
               return fDate.value;
            }
            if (this._options.replacer) {
               return this._options.mask.replace(this.formatMaskCharsRegExp, this._options.replacer);
            }
            return '';
         },
         handleInput: function(splitValue, inputType) {
            this._replacer = this.options.replacer;
            this._mask = this.options.mask;
            this._newFormat = FormatBuilder.getFormat(this._mask, this.options.formatMaskChars, this._replacer);
            _private.updateFormatMaskChars(this, this.options.formatMaskChars);
            var result = InputProcessor.input(splitValue, inputType, this._replacer, this._format, this._newFormat);
            return ViewModel.superclass.handleInput.call(this, _private.prepareSplitValue(result));
         }
      });

      return ViewModel;
   }
);
