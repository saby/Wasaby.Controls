define('Controls/Utils/tmplNotify', [], function() {

   'use strict';

   return function(event, eventName) {
      var args = Array.prototype.slice.call(arguments, 2);

      if (args) {
         this._notify(eventName, Array.prototype.slice.call(arguments, 2));
      } else {
         this._notify(eventName);
      }
   };
});
