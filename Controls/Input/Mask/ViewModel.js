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
       * @author Водолазских А.А.
       */
      var _private = {
         updateFormatMaskChars: function(self, formatMaskChars) {
            if (self._formatMaskChars === formatMaskChars) {
               return;
            }
            self._formatMaskChars = formatMaskChars;
            self.formatMaskCharsRegExp = new RegExp('[' + Object.keys(formatMaskChars).join('') + ']', 'g');
         },

         prepareData: function(options) {
            this._options = {
               value: options.value
            };
            _private.updateFormatMaskChars(this, options.formatMaskChars);
            this._mask = options.mask;
            this._replacer = options.replacer;
            this._format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);
            return this;
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
            var format = _private.prepareData(this._options)._format;
            var value = Formatter.getClearData(format, displayValue).value;
            return value;
         },
         _convertToDisplayValue: function(value) {
            var displayValue = value === null ? '' : value.toString();
            var format = _private.prepareData(this._options)._format;
            var fDate = Formatter.getFormatterData(format, { value: this._options.value, position: 0 });
            if (fDate && fDate.value) {
               return fDate.value;
            }
            if (this._options.replacer) {
               return this._options.mask.replace(_private.prepareData(this._options).formatMaskCharsRegExp, this._options.replacer);
            }
            return '';
         },
         handleInput: function(splitValue, inputType) {
            var preparedDate = _private.prepareData(this.options);
            var result = InputProcessor.input(splitValue, inputType, preparedDate._replacer, preparedDate._format, preparedDate._format);
            return ViewModel.superclass.handleInput.call(this, _private.prepareSplitValue(result));
         }

      });

      return ViewModel;
   }
);
