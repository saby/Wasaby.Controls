define('Controls/Input/Mask/ViewModel',
   [
      'Core/core-simpleExtend',
      'Controls/Input/resources/MaskDataHelper',
      'Controls/Input/resources/MaskInputHelper'
   ],
   function(simpleExtend, MaskDataHelper, MaskInputHelper) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев Максим Сергеевич
       */
      var ViewModel = simpleExtend.extend({
         constructor: function(options) {
            this._replacer = options.replacer;
            this._maskData = MaskDataHelper.getMaskData(options.mask, options.formatMaskChars, options.replacer);
         },

         /**
          * Обновить опции.
          * @param newOptions Новые опции(replacer, mask).
          */
         updateOptions: function(newOptions) {
            this._replacer = newOptions.replacer;
            this._maskData = MaskDataHelper.getMaskData(newOptions.mask, newOptions.formatMaskChars, newOptions.replacer);
         },

         /**
          * Подготовить данные.
          * @param splitValue значение разбитое на части before, insert, after, delete.
          * @param inputType тип ввода.
          * @returns {{value: (String), position: (Integer)}}
          */
         prepareData: function(splitValue, inputType) {
            return MaskInputHelper.input(splitValue, inputType, this._replacer, this._maskData);
         }
      });

      return ViewModel;
   }
);