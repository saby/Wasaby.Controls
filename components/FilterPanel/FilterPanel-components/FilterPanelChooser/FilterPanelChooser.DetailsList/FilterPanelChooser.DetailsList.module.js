define('js!SBIS3.CONTROLS.FilterPanelChooser.DetailsList', [
   'js!SBIS3.CONTROLS.FilterPanelChooser.BaseList',
   'js!WS.Data/Source/Memory',
   'Core/CommandDispatcher',
   'Core/helpers/collection-helpers',
   'tmpl!SBIS3.CONTROLS.FilterPanelChooser.DetailsList/resources/ItemTpl'
], function(FilterPanelChooserBaseList, Memory, CommandDispatcher, cHelpers, ItemTpl) {

   'use strict';

   /**
    * Класс редактора "Детализация".
    * Применяется для панели фильтрации (см. {@link SBIS3.CONTROLS.FilterPanel/FilterPanelItem.typedef FilterPanelItem}).
    * <br/>
    * Реализует выборку идентификаторов из ListView.
    * <br/>
    * @class SBIS3.CONTROLS.FilterPanelChooser.DetailsList
    * @extends SBIS3.CONTROLS.FilterPanelChooser.BaseList
    * @author Авраменко Алексей Сергеевич
    * @public
    *
    * @demo SBIS3.CONTROLS.Demo.MyFilterView
    */

   var FilterPanelChooserDetailsList = FilterPanelChooserBaseList.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.DetailsList.prototype */ {
      $protected: {
      },

      $constructor: function() {
         CommandDispatcher.declareCommand(this, 'moveItem', this._moveItem);
         CommandDispatcher.declareCommand(this, 'toggleHierarchy', this._toggleHierarchy);
      },

      _moveItem: function(item, at) {
         var
            listView = this._getListView(),
            items = listView.getItems(),
            moveTo = items.at(items.getIndex(item) + (at === 'before' ? -1 : 1)),
            selectedKeys = listView.getSelectedKeys(),
            newItemIndex = Array.indexOf(selectedKeys, moveTo.getId()),
            currentItemIndex = Array.indexOf(selectedKeys, item.getId());
         // При перемещении записи необходимо менять её позицию в рекордсете
         listView.move([item], moveTo, at);
         // и в списке выбранных записей
         selectedKeys[newItemIndex] = item.getId();
         selectedKeys[currentItemIndex] = moveTo.getId();
         // Перед установкой нового порядка выделенных записей - нужно обнулить выделение, иначе обновление массива выделенных ключей не произойдет
         listView.getSelectedItems().clear();
         listView.setSelectedKeys(selectedKeys);
         this._updateValue();
      },

      _toggleHierarchy: function(item) {
         item.set('hierarchy', !item.get('hierarchy'));
         this._updateValue();
      },

      init: function() {
         FilterPanelChooserDetailsList.superclass.init.apply(this, arguments);
         this._getListView().subscribe('onChangeHoveredItem', this._onChangeHoveredItem.bind(this));
      },

      _prepareProperties: function(opts) {
         var
            properties = FilterPanelChooserDetailsList.superclass._prepareProperties.apply(this, arguments);
         properties.itemContentTpl = ItemTpl;
         properties.className = 'controls-FilterPanelChooser__DetailsList';
         properties.itemsActions = [
            {
               name: 'moveDown',
               tooltip: 'Переместить вниз',
               icon: 'icon-16 icon-ArrowDown icon-primary',
               isMainAction: true,
               onActivated: function(element, id, item) {
                  this.sendCommand('moveItem', item, 'after');
               }
            },
            {
               name: 'moveUp',
               tooltip: 'Переместить вверх',
               icon: 'icon-16 icon-ArrowUp icon-primary',
               isMainAction: true,
               onActivated: function(element, id, item) {
                  this.sendCommand('moveItem', item, 'before');
               }
            },
            {
               name: 'enableHierarchy',
               icon: 'icon-16 icon-TreeView icon-primary',
               isMainAction: true,
               tooltip: 'Включить отображение с разделами',
               onActivated: function(element, id, item) {
                  this.sendCommand('toggleHierarchy', item);
               }
            },
            {
               name: 'disableHierarchy',
               icon: 'icon-16 icon-TreeView icon-disabled',
               isMainAction: true,
               tooltip: 'Выключить отображение с разделами',
               onActivated: function(element, id, item) {
                  this.sendCommand('toggleHierarchy', item);
               }
            }
         ];
         properties.dataSource = new Memory({
            data: opts.properties.items.getRawData(),
            idProperty: opts.properties.idProperty
         });
         properties.selectedKeys = [];
         cHelpers.forEach(opts.value, function(item) {
            properties.selectedKeys.push(item['id']);
         });
         return properties;
      },

      _elemClickHandler: function(e, id, item) {
         var
            listView = this._getListView(),
            items = listView.getItems(),
            indexSelectedItem = this._options.value.length ? this._options.value.length - 1 : 0;
         listView.move([item], items.at(indexSelectedItem), this._options.value.length ? 'after' : 'before');
         FilterPanelChooserDetailsList.superclass._elemClickHandler.apply(this, arguments);
         this._updateItemsActions(item);
      },

      _updateValue: function() {
         var
            value = [],
            selectedItems = this._getListView().getSelectedItems();

         selectedItems.each(function(item) {
            value.push({
               id: item.getId(),
               hierarchy: item.get('hierarchy')
            });
         });
         this._setValue(value);
      },

      _updateItemsActions: function(item) {
         var
            items = this._getListView().getItems(),
            selectedKeys = this._getListView().getSelectedKeys(),
            itemInstances = this._getListView().getItemsActions().getItemsInstances(),
            showMoveUp = false,
            showMoveDown = false,
            nextItem, prevItem;

         if (Array.indexOf(selectedKeys, item.getId()) !== -1) {
            prevItem = items.at(items.getIndex(item) - 1);
            nextItem = items.at(items.getIndex(item) + 1);
            if (prevItem && Array.indexOf(selectedKeys, prevItem.getId()) !== -1) {
               showMoveUp = true;
            }
            if (nextItem && Array.indexOf(selectedKeys, nextItem.getId()) !== -1) {
               showMoveDown = true;
            }
         }

         itemInstances['moveUp'].toggle(showMoveUp);
         itemInstances['moveDown'].toggle(showMoveDown);
         itemInstances['enableHierarchy'].toggle(item.get('hierarchy') === false);
         itemInstances['disableHierarchy'].toggle(item.get('hierarchy') === true);
      },

      _onChangeHoveredItem: function(event, hoveredItem) {
         if (hoveredItem.record) {
            this._updateItemsActions(hoveredItem.record);
         }
      }
   });

   return FilterPanelChooserDetailsList;

});