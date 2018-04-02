define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred'
], function (Control, template, Deferred) {

   var Remove = Control.extend( {
      _template: template,

      itemsRemove: function(items) {
         var itemsRemoveResult = this._notify('itemsRemove', [items]);
         return itemsRemoveResult instanceof Deferred ? itemsRemoveResult : Deferred.success(itemsRemoveResult);
      },

      afterItemsRemove: function(items, result) {
         this._notify('afterItemsRemove', [items, result]);
      }
   });

   return Remove;
});