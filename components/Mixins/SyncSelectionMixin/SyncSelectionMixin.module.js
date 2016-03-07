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
         /* Почему событие onPropertyChanged: если изменить св-во контрола в событии onPropertyChanged,
            то корректно произойдёт синхронизация с контекстом  */
         this.subscribe('onPropertyChanged', function(e, propName) {
            var propValue, item;

            if (PROPS_TO_SYNC[propName]) {
               propValue = this.getProperty(propName);

               /* При изменении свойств
                     1) selectedItem
                     2) selectedKey
                  надо установить новый набор selectedItems, selectedKeys по правилу:
                  selectedItem === selectedItems.at(0), selectedKey === selectedKeys[0]

                     3)selectedItems
                     4)selectedKeys
                  надо установить новые selectedItem, selectedKey по правилу:
                  selectedItems.at(0) === selectedItem, selectedKeys[0] === selectedKey
                */
               switch (propName) {
                  case 'selectedItem':
                     $ws.helpers.instanceOfModule(propValue, 'SBIS3.CONTROLS.Data.Model') ?
                         this.setSelectedItems([propValue]) :
                         this.clearSelectedItems();
                     break;
                  case 'selectedKey':
                     propValue === null ?
                        this.clearSelectedItems() :
                        this.setSelectedKeys([propValue]);
                     break;
                  case 'selectedItems':
                     item = propValue.at(0);
                     this._options.selectedItem = item ? item : null;
                     this._options.selectedKey = item ? item.getId() : null;
                     break;
                  case 'selectedKeys':
                     this._options.selectedKey = propValue.length ? propValue[0] : null;
                     break;
               }
            }
         });
      },

      around: {
         /* Заглушка для отрисовки selectedKey,
            вся отрисовка идёт через selectedKeys */
         _drawSelectedItem: $ws.helpers.nop
      }
   };

   return SyncSelectionMixin;

});