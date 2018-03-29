define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred'
], function (Control, template, Deferred) {

   var Remove = Control.extend( {
      _template: template,

      beginRemove: function(items) {
         var beginRemoveResult;

         beginRemoveResult = this._notify('beginRemove', [items], { bubbling: true });
         return beginRemoveResult instanceof Deferred ? beginRemoveResult : Deferred.success(beginRemoveResult);
      },

      endRemove: function(items, result) {
         this._notify('endRemove', [items, result], { bubbling: true });
      }
   });

   return Remove;
});