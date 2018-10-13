define('Controls/Input/RichArea/plugins/handlers', [
   'Controls/Input/RichArea/plugins/handlers/key',
   'Controls/Input/RichArea/plugins/handlers/paste'
], function() {

   /**
    * Модуль для привязки обработчиков всех типов(вставки, работы с текстом и прочими) к БТР
    */

   var handlerPlugins = [];

   for (var key in arguments) {
      handlerPlugins.push(arguments[key]);
   }

   var CallBacksPlugin = {
      saveContext: function(self) {
         self._handlers = {};

         handlerPlugins.forEach(function(plugin) {
            for (var handler in plugin) {
               self._handlers[handler] = plugin[handler].bind(self);
            }
         }, self);
      }
   };

   return CallBacksPlugin;
});
