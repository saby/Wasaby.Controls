define('Controls/Input/Phone/ViewModel',
   [
      'Core/core-simpleExtend',
      'Controls/Input/resources/MaskHelper',
      'Controls/Input/Phone/PhoneHelper'
   ],
   function(simpleExtend, MaskHelper, PhoneHelper) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев Максим Сергеевич
       */
      var
         replacer = '',
         formatMaskChars = {
            'd': '[0-9]'
         };

      var ViewModel = simpleExtend.extend({
         constructor: function(options) {
            this._value = options.value;
            this._maskData = MaskHelper.getMaskData(PhoneHelper.getMask(options.value), formatMaskChars, replacer);
         },

         updateOptions: function(newOptions) {
            this._value = newOptions.value;
            this._maskData = MaskHelper.getMaskData(PhoneHelper.getMask(newOptions.value), formatMaskChars, replacer);
         },

         /**
          * Подготавливает новое значение.
          * @param splitValue
          * @param inputType
          * @returns {{value: (String), position: (Integer)}}
          */
         prepareData: function(splitValue, inputType) {
            var
               clearData = MaskHelper.getClearData(this._maskData, this._value),
               clearSplitValue = MaskHelper.getClearSplitValue(splitValue, clearData),
               mask = PhoneHelper.getMask(splitValue.before + splitValue.insert + splitValue.after),
               result;

            this._maskData = MaskHelper.getMaskData(mask, formatMaskChars, replacer);

            switch(inputType) {
               case 'insert':
                  result = MaskHelper.insert(this._maskData, clearSplitValue, replacer);
                  break;
               case 'delete':
                  result = MaskHelper.delete(this._maskData, clearSplitValue, replacer);
                  break;
               case 'deleteForward':
                  result = MaskHelper.deleteForward(this._maskData, clearSplitValue, replacer);
                  break;
               case 'deleteBackward':
                  result = MaskHelper.deleteBackward(this._maskData, clearSplitValue, replacer);
                  break;
            }

            /**
             * Если не смогли получить результат после работы пользователя,
             * то вернем старое значение, чтобы визуально ничего не поменялось.
             */
            if (result) {
               this._value = result.value;
            } else {
               result = {
                  value: this._value,
                  position: splitValue.before.length + splitValue.delete.length
               };
            }

            return result;
         }
      });

      return ViewModel;
   }
);