define('Controls/Utils/keysHandler', [], function() {

   'use strict';

   /**
    * This used in control to handle keyDown events.
    */
   return function(event, keys, handlerSet, scope) {
      for (var action in keys) {
         if (keys.hasOwnProperty(action)) {
            if (event.nativeEvent.keyCode === keys[action]) {
               handlerSet[action](scope);
               event.stopImmediatePropagation();
               event.preventDefault();
               return;
            }
         }
      }
   };
});
