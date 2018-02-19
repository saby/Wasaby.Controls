define('Controls/Input/Mask/ViewModel',
   [
      'Core/core-simpleExtend',
      'Controls/Input/resources/MaskHelper'
   ],
   function(simpleExtend, MaskHelper) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев Максим Сергеевич
       */
      var ViewModel = simpleExtend.extend({
         constructor: function(options) {
            this._replacer = options.replacer;
            this._formatMaskChars = options.formatMaskChars;
            this._maskData = MaskHelper.getMaskData(options.mask, options.formatMaskChars, options.replacer);
         },

         /**
          * Обновить опции.
          * @param newOptions Новые опции(replacer, mask).
          */
         updateOptions: function(newOptions) {
            this._replacer = newOptions.replacer;
            this._maskData = MaskHelper.getMaskData(newOptions.mask, this._formatMaskChars, newOptions.replacer);
         },

         /**
          * Подготовить данные.
          * @param splitValue значение разбитое на части before, insert, after, delete.
          * @param inputType тип ввода.
          * @returns {{value: (String), position: (Integer)}}
          */
         prepareData: function(splitValue, inputType) {
            var
               value = splitValue.before + splitValue.delete + splitValue.after,
               clearData = MaskHelper.getClearData(this._maskData, value),
               clearSplitValue = MaskHelper.getClearSplitValue(splitValue, clearData), result;

            switch(inputType) {
               case 'insert':
                  result = MaskHelper.insert(this._maskData, clearSplitValue, this._replacer);
                  break;
               case 'delete':
                  result = MaskHelper.delete(this._maskData, clearSplitValue, this._replacer);
                  break;
               case 'deleteForward':
                  result = MaskHelper.deleteForward(this._maskData, clearSplitValue, this._replacer);
                  break;
               case 'deleteBackward':
                  result = MaskHelper.deleteBackward(this._maskData, clearSplitValue, this._replacer);
                  break;
            }

            // Берем старое значение, если не смогли получить результат.
            return result || {
                  value: value,
                  position: splitValue.before.length + splitValue.delete.length
               };
         }
      });

      return ViewModel;
   }
);