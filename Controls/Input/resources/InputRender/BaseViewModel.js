define('Controls/Input/resources/InputRender/BaseViewModel',
   [
      'Core/core-simpleExtend'
   ],
   function(
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
         constructor: function(options) {
            this._options = options || {};
         },

         /**
          * @param splitValue
          * @returns {{value: (*|String), position: (*|Integer)}}
          */
         handleInput: function(splitValue) {
            var
               value = splitValue.before + splitValue.insert + splitValue.after;

            this._options.value = value;

            return {
               value: value,
               position: splitValue.before.length + splitValue.insert.length
            };
         },

         getDisplayValue: function() {
            return this.getValue();
         },

         getValue: function() {
            return this._options.value || '';
         },

         updateOptions: function(options) {
            this._options.value = options.value;
         }
      });
   }
);
