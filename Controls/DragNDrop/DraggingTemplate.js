define('Controls/DragNDrop/DraggingTemplate', [
   'Core/Control',
   'tmpl!Controls/DragNDrop/DraggingTemplate/DraggingTemplate',
   'css!?Controls/DragNDrop/DraggingTemplate/DraggingTemplate'
], function(Control, template) {

   var MAX_ITEMS_COUNT = 999;

   var _private = {
      getCounterText: function(itemsCount) {
         var result;
         if (itemsCount > MAX_ITEMS_COUNT) {
            result = MAX_ITEMS_COUNT + '+';
         } else if (itemsCount > 1) {
            result = itemsCount;
         }
         return result;
      }
   };

   return Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._itemsCount = _private.getCounterText(options.entity.getItems().length);
      }
   });
});
