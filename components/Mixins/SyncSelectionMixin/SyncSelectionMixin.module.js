/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('js!SBIS3.CONTROLS.SyncSelectionMixin', ['js!SBIS3.CONTROLS.Data.Model'], function(Model) {

   /**
    * Миксин, добавляющий синхронизацию выбранных элементов по следующему правилу:
    * selectedItem всегда смотрит на первый элемент из selectedItems
    * @mixin SBIS3.CONTROLS.SyncSelectionMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }

   var SyncSelectionMixin = /**@lends SBIS3.CONTROLS.SyncSelectionMixin.prototype  */{
      around: {
         setSelectedItem: propertyUpdateWrapper(function(parentFunc, item) {
            /* Когда передали selectedItem, то надо сделать коллекцию selectedItems из этого item'a */
            !item || Object.isEmpty(item.getProperties()) ?
                this.clearSelectedItems() :
                this.setSelectedItems([item]);
            parentFunc.apply(this, arguments);
         }),

         _afterSelectionHandler: function(parentFunc) {
            var self = this;
            /* selectedItem всегда смотрит на первый элемент набора selectedItems */
            this.getSelectedItems(true).addCallback(function(list) {
               var item = list.at(0);
               self._options.selectedItem = item ? item : new Model();
               self._options.selectedKey = item ? item.getId() : null;
               self._notifySelectedItem(self._options.selectedKey);
               return list;
            });
            parentFunc.apply(this, arguments);
         },

         _drawSelectedItem: function(parentFunc, key) {
            this._options.selectedKeys = key === null ? [] : [key];
            this._drawSelectedItems(key === null ? [] : [key]);
         }
      }
   };

   return SyncSelectionMixin;

});