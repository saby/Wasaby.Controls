define('Controls/Input/RichArea/RichAreaModel',
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

         getValue: function() {
            return this._options.value || '';
         },

         updateOptions: function(options) {
            this._options.value = options.value;
         }
      });
   });
