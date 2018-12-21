define('Controls/List/Remover', [
   'Core/Control',
   'Core/Deferred',
   'Controls/Container/Data/ContextOptions'
], function(Control, Deferred, dataOptions) {
   var _private = {
      removeFromSource: function(self, items) {
         return self._source.destroy(items);
      },

      removeFromItems: function(self, items) {
         var item;
         self._items.setEventRaising(false, true);
         for (var i = 0; i < items.length; i++) {
            item = self._items.getRecordById(items[i]);
            if (item) {
               self._items.remove(item);
            }
         }
         self._items.setEventRaising(true, true);
      },

      beforeItemsRemove: function(self, items) {
         var beforeItemsRemoveResult = self._notify('beforeItemsRemove', [items]);
         return beforeItemsRemoveResult instanceof Deferred ? beforeItemsRemoveResult : Deferred.success(beforeItemsRemoveResult);
      },

      afterItemsRemove: function(self, items, result) {
         self._notify('afterItemsRemove', [items, result]);
      },

      updateDataOptions: function(self, dataOptions) {
         if (dataOptions) {
            self._items = dataOptions.items;
            self._source = dataOptions.source;
         }
      }
   };

   /**
   * Сontrol to remove the list items in recordSet and dataSource.
   * Сontrol must be in one Controls.Container.Data with a list.
   * <a href="/materials/demo/demo-ws4-operations-panel">Demo examples.</a>.
   * @class Controls/List/Remover
   * @extends Core/Control
   * @mixes Controls/interface/IRemovable
   * @control
   * @public
   * @author Авраменко А.С.
   * @category List
   */
    
   var Remover = Control.extend({
      _beforeMount: function(options, context) {
         _private.updateDataOptions(this, context.dataOptions);
      },

      _beforeUpdate: function(options, context) {
         _private.updateDataOptions(this, context.dataOptions);
      },

      removeItems: function(items) {
         var self = this;
         _private.beforeItemsRemove(this, items).addCallback(function(result) {
            if (result !== false) {
               //TODO: показать индикатор
               _private.removeFromSource(self, items).addCallback(function(result) {
                  _private.removeFromItems(self, items);
                  return result;
               }).addBoth(function(result) {
                  //TODO: скрыть индикатор
                  _private.afterItemsRemove(self, items, result);
               });
            }
         });
      }
   });

   Remover.contextTypes = function() {
      return {
         dataOptions: dataOptions
      };
   };

   return Remover;
});
