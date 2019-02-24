define('Controls/StickyHeader/Utils', [
   'Env/Env'
], function(Env) {

   'use strict';

   var lastId = 0;

   return {

      /**
       * The position property with sticky value is not supported in ie and edge lower version 16.
       * https://developer.mozilla.org/ru/docs/Web/CSS/position
       */
      isStickySupport: function() {
         return !Env.detection.isIE || Env.detection.IEVersion > 15;
      },

      getNextId: function() {
         return lastId++;
      },

      get _lastId() {
         return lastId - 1;
      }
   };
});
