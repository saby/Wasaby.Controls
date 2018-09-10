define('Controls/Input/Phone/ViewModel',
   [
      'Controls/Input/Phone/MaskBuilder',
      'Controls/Input/Mask/Formatter',
      'Controls/Input/Mask/FormatBuilder',
      'Controls/Input/Mask/InputProcessor',
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(MaskBuilder, Formatter, FormatBuilder, InputProcessor, BaseViewModel) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев М.С.
       */
      var
         replacer = '',
         formatMaskChars = {
            'd': '[0-9]',
            '+': '[+]'
         };

      var ViewModel = BaseViewModel.extend({
         constructor: function(options) {
            ViewModel.superclass.constructor.call(this, options);

            this._format = FormatBuilder.getFormat(MaskBuilder.getMask(options.value), formatMaskChars, replacer);
         },

         updateOptions: function(newOptions) {
            ViewModel.superclass.updateOptions.call(this, newOptions);

            this._format = FormatBuilder.getFormat(MaskBuilder.getMask(newOptions.value), formatMaskChars, replacer);
         },

         handleInput: function(splitValue, inputType) {
            var newMask = MaskBuilder.getMask(splitValue.before + splitValue.insert + splitValue.after);
            var newFormat = FormatBuilder.getFormat(newMask, formatMaskChars, replacer);
            var result = InputProcessor.input(splitValue, inputType, replacer, this._format, newFormat);

            this._options.value = Formatter.getClearData(result.format, result.value).value;
            this._format = result.format;
            this._nextVersion();

            return result;
         },

         getDisplayValue: function() {
            return Formatter.getFormatterData(this._format, {
               value: this._options.value,
               position: 0
            }).value;
         }
      });

      return ViewModel;
   }
);
