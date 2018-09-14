define('Controls/Input/Mask/ViewModel',
   [
      'Controls/Input/Mask/FormatBuilder',
      'Controls/Input/Mask/InputProcessor',
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(FormatBuilder, InputProcessor, BaseViewModel) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев М.С.
       */
      var ViewModel = BaseViewModel.extend({
         constructor: function(options) {
            this._options = {
               value: options.value
            };
            this._replacer = options.replacer;
            this._format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);
         },

         /**
          * Обновить опции.
          * @param newOptions Новые опции(replacer, mask).
          */
         updateOptions: function(newOptions) {
            this._options.value = newOptions.value;
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

            this._options.value = result.value;
            this._nextVersion();

            return result;
         }
      });

      return ViewModel;
   }
);
