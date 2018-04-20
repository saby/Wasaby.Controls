define('Controls/Input/RichTextArea/RichAreaModel',
   [
      'Core/core-simpleExtend'
   ],
   function(
      simpleExtend
   ) {
      'use strict';

      return simpleExtend.extend({
         constructor: function(options) {
            this._options = options || {};
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
