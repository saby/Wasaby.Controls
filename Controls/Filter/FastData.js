define('Controls/Filter/FastData',
   [
      'Core/Control',
      'Controls/Dropdown/DropdownUtils',
      'tmpl!Controls/Filter/FastData/FastData',
      'Controls/Controllers/SourceController',
      'WS.Data/Chain',
      'WS.Data/Collection/RecordSet',
      'Core/helpers/Object/isEmpty',
      'SBIS3.CONTROLS/Utils/SourceUtil',
      'Core/core-instance',
      'css!Controls/Filter/FastData/FastData'
   ],
   function (Control, DropdownUtils, template, SourceController, Chain, RecordSet, isEmpty, SourceUtil, cInstance) {
      'use strict';

      /**
       *
       * @class Controls/Filter/FastData
       * @extends Controls/Control
       * @control
       * @public
       * @author Золотова Э.Е.
       */

      var FastData = Control.extend({
         _template: template,

         constructor: function () {
            FastData.superclass.constructor.apply(this, arguments);
            this._onResult = this._onResult.bind(this);
         },

         _beforeMount: function (options) {
            this.loadedItems = {};
            this.selectedIndex = {};
            var self = this;

            //Что представляет собой items?
            //Сейчас только загружаемые данные, без остальных опций

            Chain(options.items).each(function (item, index) {
               self.selectedIndex[index] = item.selectedIndex || 0;
               if (cInstance.instanceOfModule(SourceUtil.prepareSource(item.dataSource), 'WS.Data/Source/Memory')) {
                  DropdownUtils._loadItems(self, item.dataSource, item.selectedKeys).addCallback(function (result) {
                     self.loadedItems[index] = result;
                     //В данном случае selectedKeys м.б. задан
                     //Убрать, если не нужен
                     item.selectedKeys = item.selectedKeys || self._getElement(item, index, item.idProperty);
                     self._forceUpdate();
                  });
               }
               else {
                  self.loadedItems[index] = new RecordSet({rawData: item.dataSource});
                  item.selectedKeys = item.selectedKeys || self._getElement(item, index, item.idProperty);
               }
            });
         },

         _updateText: function (item, index) {
            //По умолчанию первый элемент списка

            if (this.loadedItems[index]) {
               return this._getElement(item, index, item.displayProperty);
            }
         },

         _getElement: function (item, index, property) {
            return this.loadedItems[index].at(this.selectedIndex[index]).get(property);
         },

         _open: function (event, item, index) {
            var config = {
               componentOptions: {
                  items: this.loadedItems[index],
                  keyProperty: item.idProperty,
                  parentProperty: item.parentProperty,
                  nodeProperty: item.nodeProperty,
                  itemTemplateProperty: item.itemTemplateProperty,
                  itemTemplate: item.itemTemplate,
                  headTemplate: item.headTemplate,
                  footerTemplate: item.footerTemplate,
                  selectedKeys: item.selectedKeys || 0
               },
               target: event.target.parentElement
            };
            //Сохраняем индекс последнего открытого списка. Чтобы получить список в selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _onResult: function (args) {
            var actionName = args[0];
            var data = args[2];
            if (actionName === 'itemClick') {
               this._selectItem.apply(this, data);
               this._children.DropdownOpener.close();
            }
         },

         _selectItem: function (item) {
            //Устанавливаем индекс выбранного элемента списка
            this.selectedIndex[this.lastOpenIndex] = this.loadedItems[this.lastOpenIndex].getIndex(item);

            //Получаем ключ выбранного элемента
            var key = item.get(this._options.items[this.lastOpenIndex].idProperty);
            this._options.items[this.lastOpenIndex].selectedKeys = key;

            this._notify('selectedKeysChanged', [key]);
         },

         _reset: function (event, item, index) {
            this.selectedIndex[index] = 0;
            item.selectedKeys = this._getElement(item, index, item.idProperty);
            this._notify('selectedKeysChanged', [item.selectedKeys]);
         }
      });

      return FastData;
   }
);