define('Controls/Input/Mask/ViewModel',
   [
      'Controls/Input/Mask/FormatBuilder',
      'Controls/Input/Mask/Formatter',
      'Controls/Input/Mask/InputProcessor',
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(FormatBuilder, Formatter, InputProcessor, BaseViewModel) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев М.С.
       */
      var _private = {
         updateFormatMaskChars: function(self, formatMaskChars) {
            if (self._formatMaskChars === formatMaskChars) {
               return;
            }
            self._formatMaskChars = formatMaskChars;
            self.formatMaskCharsRegExp = new RegExp('[' + Object.keys(formatMaskChars).join('') + ']', 'g');
         }
      };

      var ViewModel = BaseViewModel.extend({
         constructor: function(options) {
            this._options = {
               value: options.value
            };
            _private.updateFormatMaskChars(this, options.formatMaskChars);
            this._mask = options.mask;
            this._replacer = options.replacer;
            this._format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);
         },

         /**
          * Обновить опции.
          * @param newOptions Новые опции(replacer, mask).
          */
         updateOptions: function(newOptions) {
            this._options.value = newOptions.value;
            _private.updateFormatMaskChars(this, newOptions.formatMaskChars);
            this._mask = newOptions.mask;
            this._replacer = newOptions.replacer;
            this._format = FormatBuilder.getFormat(newOptions.mask, newOptions.formatMaskChars, newOptions.replacer);
            this._nextVersion();
         },

         /**
          * Подготовить данные.
          * @param splitValue значение разбитое на части before, insert, after, delete.
          * @param inputType тип ввода.
          * @returns {{value: (String), position: (Integer)}}
          */
         handleInput: function(splitValue, inputType) {
            var result = InputProcessor.input(splitValue, inputType, this._replacer, this._format, this._format);

            this._options.value = Formatter.getClearData(this._format, result.value).value;
            this._nextVersion();

            return result;
         },

         getDisplayValue: function() {
            var fData;

            fData = Formatter.getFormatterData(this._format, { value: this.getValue(), position: 0 });

            if (fData && fData.value) {
               return fData.value;
            }
            if (this._replacer) {
               return this._mask.replace(this.formatMaskCharsRegExp, this._replacer);
            }
            return '';
         }
      });

      return ViewModel;
   }
);
