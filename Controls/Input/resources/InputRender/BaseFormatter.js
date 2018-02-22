define('Controls/Input/resources/InputRender/BaseFormatter',
   [
      'Core/core-simpleExtend'
   ],
   function (
      simpleExtend
   ) {
      'use strict';
      /**
       * Базовый класс formatter для InputRender
       * @class Controls/Input/resources/InputRender/BaseFormatter
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