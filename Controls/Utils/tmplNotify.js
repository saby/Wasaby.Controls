define('Controls/Utils/tmplNotify', [], function() {

   'use strict';

   /**
    * A handler to use in the template to carry out event forwarding up.
    */
   return function(event, eventName) {
      var args = Array.prototype.slice.call(arguments, 2);

      this._notify(eventName, args);
   };
});
