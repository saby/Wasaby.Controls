define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred'
], function (Control, template, Deferred) {
   var _private = {
      removeFromSource: function(self, items) {
         return self._sourceController.remove(items);
      },

      removeFromModel: function(self, items) {
         self._listModel.removeItems(items);
      },

      beforeItemsRemove: function(self, items) {
         var beforeItemsRemoveResult = self._notify('beforeItemsRemove', [items]);
         return beforeItemsRemoveResult instanceof Deferred ? beforeItemsRemoveResult : Deferred.success(beforeItemsRemoveResult);
      },

      afterItemsRemove: function(self, items, result) {
         self._notify('afterItemsRemove', [items, result]);
      }
   };

   var Remove = Control.extend( {
      _template: template,
      _listModel: undefined,
      _sourceController: undefined,

      _beforeMount: function(newOptions){
         this._updateOptions(newOptions);
      },

      _beforeUpdate: function(newOptions){
         this._updateOptions(newOptions);
      },

      _updateOptions: function(newOptions) {
         if (newOptions.listModel && (this._listModel !== newOptions.listModel)) {
            this._listModel = newOptions.listModel;
         }
         if (newOptions.sourceController && (this._sourceController !== newOptions.sourceController)) {
            this._sourceController = newOptions.sourceController;
         }
      },

      removeItems: function(items) {
         var self = this;
         _private.beforeItemsRemove(this, items).addCallback(function(result) {
            if (result !== false) {
               self._notify('showIndicator', [], { bubbling: true });
               _private.removeFromSource(self, items).addCallback(function(result) {
                  _private.removeFromModel(self, items);
                  return result;
               }).addBoth(function(result) {
                  self._notify('hideIndicator', [], { bubbling: true });
                  _private.afterItemsRemove(self, items, result);
               });
            }
         });
      }
   });

   return Remove;
});