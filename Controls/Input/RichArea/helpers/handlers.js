define('Controls/Input/RichArea/helpers/handlers', [
   'Controls/Input/RichArea/helpers/handlers/input',
   'Controls/Input/RichArea/helpers/handlers/paste',
   'Controls/Input/RichArea/helpers/handlers/editor'
], function() {
   /**
    *  Module for binding event handlers with TinyMCE instance
    */

   var handlerPlugins = [];

   for (var key in arguments) {
      handlerPlugins.push(arguments[key]);
   }

   var CallBacksPlugin = {
      saveContext: function(self) {
         self._handlers = {};

         handlerPlugins.forEach(function(helper) {
            for (var handler in helper) {
               self._handlers[handler] = helper[handler].bind(self);
            }
         }, self);
      }
   };

   return CallBacksPlugin;
});
