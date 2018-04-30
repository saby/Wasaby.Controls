define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred'
], function(Control, template, Deferred) {
   var _private = {
      removeFromSource: function(self, items) {
         return self._options.sourceController.remove(items);
      },

      removeFromModel: function(self, items) {
         self._options.listModel.removeItems(items);
      },

      beforeItemsRemove: function(self, items) {
         var beforeItemsRemoveResult = self._notify('beforeItemsRemove', [items]);
         return beforeItemsRemoveResult instanceof Deferred ? beforeItemsRemoveResult : Deferred.success(beforeItemsRemoveResult);
      },

      afterItemsRemove: function(self, items, result) {
         self._notify('afterItemsRemove', [items, result]);
      }
   };

   /**
   * Control for deleting instances from collection of list
   * @class Controls/Remove
   * @extends Core/Control
   * @mixes Controls/interface/IRemovable
   * @control
   * @author Sukhoruchkin A.S.
   * @public
   * @category List
   */
    
   return Control.extend({
      _template: template,

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
});
