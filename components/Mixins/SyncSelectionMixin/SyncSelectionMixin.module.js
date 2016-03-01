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

   var SyncSelectionMixin = /**@lends SBIS3.CONTROLS.SyncSelectionMixin.prototype  */{
      $constructor: function() {
         this.subscribe('onPropertyChanged', function(e, propName) {
            var propValue, item;

            if(propName === 'selectedItem' || propName === 'selectedItems') {
               propValue =  this.getProperty(propName);

               if(propName === 'selectedItem') {
                  $ws.helpers.instanceOfModule(propValue, 'SBIS3.CONTROLS.Data.Model') ?
                      this.setSelectedItems([propValue]) :
                      this.clearSelectedItems();
               }

               if(propName === 'selectedItems') {
                  item = propValue.at(0);
                  this._options.selectedItem = item ? item : null;
                  this._options.selectedKey = item ? item.getId() : null;
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