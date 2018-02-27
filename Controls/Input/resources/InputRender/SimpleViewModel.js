define('Controls/Input/resources/InputRender/SimpleViewModel',
   [
      'Core/core-simpleExtend'
   ],
   function (
      simpleExtend
   ) {
      'use strict';
      /**
       * Простейшая ViewModel для использования в InputRender когда не требуется производить обработку данных после ввода
       * @class Controls/Input/resources/InputRender/SimpleViewModel
       * @private
       * @author Баранов М.А.
       */

      return simpleExtend.extend({
         /**
          * @param splitValue
          * @returns {{value: (*|String), position: (*|Integer)}}
          */
         prepareData: function (splitValue) {
            return {
               value: splitValue.before + splitValue.insert + splitValue.after,
               position: splitValue.before.length + splitValue.insert.length
            }
         }
      });
   }
);