define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred'
], function (Control, template, Deferred) {

   var Remove = Control.extend( {
      _template: template,

      constructor: function (cfg) {
         Remove.superclass.constructor.apply(this, arguments);
         this._publish(['onBeginRemove', 'onEndRemove']);
      },

      beginRemove: function(items) {
         var
            self = this,
            beginRemoveResult;

         beginRemoveResult = self._notify('onBeginRemove', [items], { bubbling: true });
         return beginRemoveResult instanceof Deferred ? beginRemoveResult : Deferred.success(beginRemoveResult);
      },

      endRemove: function(items, result) {
         this._notify('onEndRemove', [items, result], { bubbling: true });
      }
   });

   return Remove;
});