define('Controls/StickyHeader/Utils', [
   'Core/detection'
], function(detection) {

   'use strict';

   var lastId = 0;

   return {

      /**
       * The position property with sticky value is not supported in ie and edge lower version 16.
       * https://developer.mozilla.org/ru/docs/Web/CSS/position
       */
      isStickySupport: function() {
         return !detection.isIE || detection.IEVersion > 15;
      },

      getNextId: function() {
         return lastId++;
      },

      get _lastId() {
         return lastId - 1;
      }
   };
});
