define('Controls/Filter/FastData',
   [
      'Core/Control',
      'Controls/Dropdown/DropdownUtils',
      'tmpl!Controls/Filter/FastData/FastData',
      'Controls/Controllers/SourceController',
      'WS.Data/Chain',
      'WS.Data/Collection/RecordSet',
      'SBIS3.CONTROLS/Utils/SourceUtil',
      'Core/core-instance',
      'WS.Data/Utils',
      'css!Controls/Filter/FastData/FastData'
   ],
   function (Control, DropdownUtils, template, SourceController, Chain, RecordSet, SourceUtil, cInstance, Utils) {

      'use strict';

      /**
       *
       * @class Controls/Filter/FastData
       * @extends Controls/Control
       * @control
       * @public
       * @author Золотова Э.Е.
       */
      var _private = {

         _getElement: function (self, index, property) {
            return self._configs[index]._items.at(self._selectedIndexes[index]).get(property);
         },

         _selectItem: function (item) {
            //Устанавливаем индекс выбранного элемента списка
            this._selectedIndexes[this.lastOpenIndex] = this._configs[this.lastOpenIndex]._items.getIndex(item);

            //Получаем ключ выбранного элемента
            var key = item.get(item.getIdProperty());
            this._configs[this.lastOpenIndex].selectedKeys = key;

            this._notify('selectedKeysChanged', [key]);
         }
      };

      var FastData = Control.extend({
         _template: template,
         _configs: {},
         _selectedIndexes: {},

         _listConfig: [],

         constructor: function () {
            FastData.superclass.constructor.apply(this, arguments);
            this._onResult = this._onResult.bind(this);
         },

         _beforeMount: function (options) {
            var self = this;

            //Что представляет собой items?
            //Сейчас только загружаемые данные, без остальных опций
            var sourceController = new SourceController({
               source: options.source
            });
            sourceController.load().addCallback(function (configs) {
               self._listConfig = configs;

               Chain(configs).each(function (item, index) {
                  var sKey = Utils.getItemPropertyValue(item, 'selectedKeys'),
                     dSource = Utils.getItemPropertyValue(item, 'dataSource'),
                     idProperty = Utils.getItemPropertyValue(item, 'idProperty');

                  self._selectedIndexes[index] = Utils.getItemPropertyValue(item, 'selectedIndex') || 0;

                  self._configs[index] = {};

                  if (cInstance.instanceOfModule(SourceUtil.prepareSource(dSource, 'WS.Data/Source/Memory'))) {

                     DropdownUtils._loadItems(self._configs[index], dSource, sKey).addCallback(function () {
                        self._configs[index]._items.setIdProperty(idProperty);
                        self._configs[index].selectedKeys = sKey || _private._getElement(self, index, idProperty);
                        self._forceUpdate();
                     });

                  } else {
                     self._configs[index]._items = new RecordSet({rawData: dSource, idProperty: idProperty});
                     self._configs[index].selectedKeys = sKey || _private._getElement(self, index, idProperty);
                     self._forceUpdate();
                  }
               });
            });
         },

         _open: function (event, item, index) {
            var config = {
               componentOptions: {
                  items: this._configs[index]._items,
                  keyProperty: this._configs[index]._items.getIdProperty(),
                  parentProperty: Utils.getItemPropertyValue(item, 'parentProperty'),
                  nodeProperty: Utils.getItemPropertyValue(item, 'nodeProperty'),
                  itemTemplateProperty: Utils.getItemPropertyValue(item, 'itemTemplateProperty'),
                  itemTemplate: Utils.getItemPropertyValue(item, 'itemTemplate'),
                  headTemplate: Utils.getItemPropertyValue(item, 'headTemplate'),
                  footerTemplate: Utils.getItemPropertyValue(item, 'footerTemplate'),
                  selectedKeys: this._configs[index].selectedKeys
               },
               target: event.target.parentElement
            };
            //Сохраняем индекс последнего открытого списка. Чтобы получить список в selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _updateText: function (item, index) {
            if (this._configs[index]._items) {
               return _private._getElement(this, index, Utils.getItemPropertyValue(item, 'displayProperty'));
            }
         },

         _onResult: function (args) {
            var actionName = args[0];
            var data = args[2];
            if (actionName === 'itemClick') {
               _private._selectItem.apply(this, data);
               this._children.DropdownOpener.close();
            }
         },

         _reset: function (event, item, index) {
            this._selectedIndexes[index] = 0;
            this._configs[index].selectedKeys = _private._getElement(this, index, this._configs[index]._items.getIdProperty());
            this._notify('selectedKeysChanged', [this._configs[index].selectedKeys]);
         }
      });

      FastData._private = _private;
      return FastData;
   }
);