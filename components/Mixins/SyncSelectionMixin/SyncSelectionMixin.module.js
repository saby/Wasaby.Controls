/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('js!SBIS3.CONTROLS.SyncSelectionMixin', ['js!SBIS3.CONTROLS.Data.Model'], function(Model) {

   /**
    * Миксин, добавляющий синхронизацию выбранных элементов
    * @remark
    * selectedItem всегда смотрит на первый элемент из selectedItems
    * selectedKey всегда смотрит на перывй элемент из selectedKeys
    * @mixin SBIS3.CONTROLS.SyncSelectionMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var PROPS_TO_SYNC = {
      selectedItem: true,
      selectedItems: true,
      selectedKeys: true,
      selectedKey: true
   };

   var SyncSelectionMixin = /**@lends SBIS3.CONTROLS.SyncSelectionMixin.prototype  */{
      $constructor: function() {
         this.subscribe('onPropertyChanged', function(e, propName) {
            var propValue, item;

            if (PROPS_TO_SYNC[propName]) {
               propValue = this.getProperty(propName);

               switch (propName) {
                  case 'selectedItem':
                     $ws.helpers.instanceOfModule(propValue, 'SBIS3.CONTROLS.Data.Model') ?
                         this.setSelectedItems([propValue]) :
                         this.clearSelectedItems();
                     break;
                  case 'selectedItems':
                     item = propValue.at(0);
                     this._options.selectedItem = item ? item : null;
                     this._options.selectedKey = item ? item.getId() : null;
                     break;
                  case 'selectedKeys':
                     this._options.selectedKey = propValue.length ? propValue[0] : null;
                     break;
                  case 'selectedKey':
                     this._options.selectedKeys = propValue === null ? [] : [propValue];
                     break;
               }
            }
         });
      },

      around: {
         _drawSelectedItem: function(parentFunc, key) {
            this._options.selectedKeys = key === null ? [] : [key];
            this._drawSelectedItems(key === null ? [] : [key]);
         }
      }
   };

   return SyncSelectionMixin;

});