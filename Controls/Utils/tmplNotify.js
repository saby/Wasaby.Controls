define('Controls/Utils/tmplNotify', [], function() {

   'use strict';

   /**
    * A handler to use in templates to proxy events to the logic parent.
    */
   return function(event, eventName) {
      var args = Array.prototype.slice.call(arguments, 2);

      this._notify(eventName, args);
   };
});
