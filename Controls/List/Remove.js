define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred'
], function (Control, template, Deferred) {

   var Remove = Control.extend( {
      _template: template,

      beforeItemsRemove: function(items) {
         var beforeItemsRemoveResult = this._notify('beforeItemsRemove', [items]);
         return beforeItemsRemoveResult instanceof Deferred ? beforeItemsRemoveResult : Deferred.success(beforeItemsRemoveResult);
      },

      afterItemsRemove: function(items, result) {
         this._notify('afterItemsRemove', [items, result]);
      }
   });

   return Remove;
});