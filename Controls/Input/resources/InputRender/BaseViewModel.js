define('Controls/Input/resources/InputRender/BaseViewModel',
   [
      'Core/core-simpleExtend'
   ],
   function (
      simpleExtend
   ) {
      'use strict';
      /**
       * Базовый класс ViewModel для InputRender
       * @class Controls/Input/resources/InputRender/BaseViewModel
       * @private
       * @author Баранов М.А.
       */

      return simpleExtend.extend({
         /**
          * @param splitValue
          * @returns {{value: (*|String), position: (*|Integer)}}
          */
         inputHandler: function (splitValue) {
            return {
               value: splitValue.before + splitValue.insert + splitValue.after,
               position: splitValue.before.length + splitValue.insert.length
            }
         },

         getValueForRender: function(value) {
            return value;
         },

         getValueForNotify: function(value) {
            return value;
         }
      });
   }
);