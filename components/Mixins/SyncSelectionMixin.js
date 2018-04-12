/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('SBIS3.CONTROLS/Mixins/SyncSelectionMixin', [
   'WS.Data/Entity/Model',
   'WS.Data/Collection/List',
   'Core/core-instance',
   'SBIS3.CONTROLS/Utils/ArraySimpleValuesUtil',
   'SBIS3.CONTROLS/Utils/ItemsSelectionUtil'
], function(Model, List, cInstace, ArraySimpleValuesUtil, ItemsSelectionUtil) {

   /**
    * Миксин, добавляющий синхронизацию выбранных элементов
    * @remark
    * selectedItem всегда смотрит на первый элемент из selectedItems
    * selectedKey всегда смотрит на перывй элемент из selectedKeys
    * @mixin SBIS3.CONTROLS/Mixins/SyncSelectionMixin
    * @public
    * @author Крайнов Д.О.
    */

   var PROPS_TO_SYNC = {
      selectedItem: true,
      selectedItems: true,
      selectedKeys: true,
      selectedKey: true
   };

   var SyncSelectionMixin = /**@lends SBIS3.CONTROLS/Mixins/SyncSelectionMixin.prototype  */{
      after: {
         _modifyOptions: function (options) {
            /* Если уже в конструкторе есть selectedItem, то синхронизируем с selectedItems */
            if (options.selectedItem instanceof Model) {
               options.selectedItems = new List();
               options.selectedItems.assign([options.selectedItem]);
               options.selectedKeys = options._convertToKeys(options.selectedItems, options.idProperty);
            }

            /* Если уже в конструкторе есть selectedKey, то синхронизируем с selectedKeys */
            var hasSelectedKeys = options.selectedKeys && options.selectedKeys.length;
            if (options.selectedKey && !hasSelectedKeys) {
               options.selectedKeys = [options.selectedKey];
            } else if (hasSelectedKeys) {
               options.selectedKey = options.selectedKeys[0];
            }
         }
      },
      $constructor: function() {
         /* Почему событие onPropertyChanged: если изменить св-во контрола в событии onPropertyChanged,
            то корректно произойдёт синхронизация с контекстом  */
         this.subscribe('onPropertyChanged', function(e, propName) {
            var propValue, item, key;

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

                  ВАЖНО: При изменении selectedItems и selectedKeys св-ва selectedItem и selectedKey устанавливаются напрямую,
                  иначе будет зацикливание, поэтому для корректной отрисовки надо переопределять метод drawSelectedItems, а не
                  drawSelectedItem.
                */
               switch (propName) {
                  case 'selectedItem':
                      /* При синхронизации selectedItem -> selectedItems, так же проверяем наличие ключевых поле у selectedItem */
                     if(cInstace.instanceOfModule(propValue, 'WS.Data/Entity/Model') &&
                        !ItemsSelectionUtil.isEmptyItem(propValue, this._options.displayProperty, this._options.idProperty)) {
                        this.setSelectedItems([propValue]);
                     } else {
                        this.clearSelectedItems();
                     }
                     break;
                  case 'selectedKey':
                     if(propValue === null) {
                        this.clearSelectedItems();
                     } else {
                        this.setSelectedKeys([propValue]);
                     }
                     break;
                  case 'selectedItems':
                     item = propValue && propValue.at(0);
                     key = this.getSelectedKey();

                     if (item) {
                        this._options.selectedItem = item;
                        this._options.selectedKey = item.get(this._options.idProperty);
                     } else {
                        this._options.selectedItem = null;
                        this._options.selectedKey = null;
                     }

                     if(!ArraySimpleValuesUtil.hasInArray([this._options.selectedKey], key)) {
                        this._notify('onSelectedItemChange', this._options.selectedKey, this._options.selectedIndex);
                     }
                     break;
                  case 'selectedKeys':
                     key = propValue.length ? propValue[0] : null;

                     if(!ArraySimpleValuesUtil.hasInArray([this._options.selectedKey], key)) {
                        this._options.selectedKey = key;
                        this._notify('onSelectedItemChange', this._options.selectedKey, this._options.selectedIndex);
                     }
                     break;
               }
            }
         });
      },

      around: {
         setSelectedItem: function (parentFunc, item) {
            /* Вызываем родительский метод, если:
             1) передали запись с обязательными полями
             2) передали null
             3) передали запись без ключевых полей, но у нас есть выделенные ключи,
             такое может произойти, когда запись сбрасывается через контекст */
            if(ItemsSelectionUtil.checkItemForSelect(
                  item, this._options.selectedItem,
                  this._options.idProperty,
                  this._options.displayProperty,
                  this._isEmptySelection())
            ) {
               parentFunc.call(this, item);
            }
         }
      }
   };

   return SyncSelectionMixin;

});