define('js!SBIS3.CONTROLS.FilterPanelChooser.DetailsList', [
   'js!SBIS3.CONTROLS.FilterPanelChooser.BaseList',
   'js!SBIS3.CONTROLS.ItemsMoveController',
   'WS.Data/Source/Memory',
   'Core/CommandDispatcher',
   'tmpl!SBIS3.CONTROLS.FilterPanelChooser.DetailsList/resources/ItemTpl',
   'css!SBIS3.CONTROLS.FilterPanelChooser.DetailsList'
], function(FilterPanelChooserBaseList, ItemsMoveController, Memory, CommandDispatcher, ItemTpl) {

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
         _itemsMoveController: null
      },

      $constructor: function() {
         CommandDispatcher.declareCommand(this, 'toggleHierarchy', this._toggleHierarchy);
      },

      _toggleHierarchy: function(item, value) {
         var
            view = this._getListView(),
            itemId = item.getId();
         item.set('hierarchy', value);
         // Согласно стандарту, при включении иерархии запись должна автоматически отмечаться
         if (value && view.getSelectedKeys().indexOf(itemId) === -1) {
            view.addItemsSelection([itemId]);
            view.redrawItem(view.getItems().getRecordById(itemId));
         }
         this._updateValue();
      },

	  _elemClickHandler: function(e, id) {
		 var
			view = this._getListView();
		 FilterPanelChooserDetailsList.superclass._elemClickHandler.apply(this, arguments);
		 view.redrawItem(view.getItems().getRecordById(id));
	  },
	  
      init: function() {
         var
            self = this;
         FilterPanelChooserDetailsList.superclass.init.apply(this, arguments);
         this._itemsMoveController = new ItemsMoveController({
            linkedView: this._getListView(),
            handlers: {
               onItemMove: function() {
                  self._updateValue();
               }
            }
         });
         this._getListView().subscribe('onChangeHoveredItem', this._onChangeHoveredItem.bind(this));
      },

      _prepareProperties: function(opts) {
         var
            properties = FilterPanelChooserDetailsList.superclass._prepareProperties.apply(this, arguments);
         properties.itemContentTpl = ItemTpl;
         properties.className = 'controls-FilterPanelChooser__DetailsList';
         properties.itemsActions = [
            {
               name: 'enableHierarchy',
               icon: 'icon-16 icon-TreeView icon-primary',
               isMainAction: true,
               tooltip: 'Включить отображение с разделами',
               onActivated: function(element, id, item) {
                  this.sendCommand('toggleHierarchy', item, true);
               }
            },
            {
               name: 'disableHierarchy',
               icon: 'icon-16 icon-TreeView icon-disabled',
               isMainAction: true,
               tooltip: 'Выключить отображение с разделами',
               onActivated: function(element, id, item) {
                  this.sendCommand('toggleHierarchy', item, false);
               }
            }
         ];
         opts.value.forEach(function(value) {
            opts.properties.items.getRecordById(value.id).set('hierarchy', value.hierarchy);
         });
         properties.dataSource = new Memory({
            data: opts.properties.items.getRawData(),
            idProperty: opts.properties.idProperty,
            adapter: opts.properties.items.getAdapter()
         });
         properties.selectedKeys = this._prepareSelectedKeys(opts.value);
         return properties;
      },

      _prepareSelectedKeys: function(items) {
         var
            result = [];
         items.forEach(function(item) {
            result.push(item['id']);
         });
         return result;
      },

      _updateView: function(value) {
         var
            view = this._getListView();
         view.setSelectedKeys(this._prepareSelectedKeys(value));
         // Т.к. отображение записи зависит от её выбранности, то после установки отмеченных записей вызываем перерисовку
         // https://online.sbis.ru/opendoc.html?guid=7b111c84-0994-4675-a1b6-68ca91a7aa21
         view.redraw();
      },

      _updateValue: function() {
         var
            value = [],
            selectedItems = this._getListView().getSelectedItems(),
            items = this._getListView().getItems();

         selectedItems.each(function(item) {
            value.push({
               id: item.getId(),
               hierarchy: item.get('hierarchy')
            });
         });
         // MultiSelectableMixin отдает записи, неупорядоченные, а в DetailsList важен именно порядок выбранных записей,
         // т.к. на его основе формируется иерархия в представлении данных
         value.sort(function(item1, item2) {
            return items.getIndex(items.getRecordById(item1.id)) - items.getIndex(items.getRecordById(item2.id));
         });
         this._setValue(value);
      },

      _updateTextValue: function(value) {
         // MultiSelectableMixin отдает записи, неупорядоченные, а в DetailsList важен именно порядок выбранных записей,
         // т.к. на его основе формируется иерархия в представлении данных.
         // Текстовое представление нужно тоже формировать согласно порядку выбранных записей.
         var
            textValues = [],
            item,
            items = this._getListView().getItems();
         value.forEach(function(elem) {
            item = items.getRecordById(elem.id);
            if (item) {
               textValues.push(item.get('title'));
            }
         });
         this.setTextValue(textValues.join(', '));
      },

      _onChangeHoveredItem: function(event, hoveredItem) {
         var
            itemsInstances,
            item = hoveredItem.record,
            isItemSelected;
         if (item) {
            itemsInstances = this._getListView().getItemsActions().getItemsInstances();
            isItemSelected = this._getListView().getSelectedKeys().indexOf(item.getId()) !== -1;
            // Согласно стандарту, отображаем иконку включения иерархии если иерархия отключена или иерархия включена, но запись не отмечена
            itemsInstances['enableHierarchy'].toggle(item.get('hierarchy') === false || (item.get('hierarchy') === true && !isItemSelected));
            // Согласно стандарту, отображаем иконку выключения иерархии если иерархия включена и запись отмечена
            itemsInstances['disableHierarchy'].toggle(item.get('hierarchy') === true && isItemSelected);
         }
      },

      destroy: function() {
         this._itemsMoveController.destroy();
         FilterPanelChooserDetailsList.superclass.destroy.apply(this, arguments);
      }
   });

   return FilterPanelChooserDetailsList;

});
