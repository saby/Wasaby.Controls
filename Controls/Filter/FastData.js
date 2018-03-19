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
      'WS.Data/Utils',
      'css!Controls/Filter/FastData/FastData'
   ],
   function (Control, DropdownUtils, template, SourceController, Chain, RecordSet, isEmpty, SourceUtil, cInstance, Utils) {
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
            return self._configs[index].at(self._selectedIndexes[index]).get(property);
         },

         _selectItem: function (item) {
            //Устанавливаем индекс выбранного элемента списка
            this._selectedIndexes[this.lastOpenIndex] = this._configs[this.lastOpenIndex].getIndex(item);

            //Получаем ключ выбранного элемента
            var key = item.get(item.getIdProperty());
            this._listConfig.at(this.lastOpenIndex).selectedKeys = key;

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

                     DropdownUtils._loadItems(self._configs[index], dSource, sKey).addCallback(function (result) {
                        self._configs[index] = result;
                        self._configs[index].setIdProperty(idProperty);
                        //В данном случае selectedKeys м.б. задан
                        //Убрать, если не нужен
                        self._listConfig.at(index).selectedKeys = sKey || _private._getElement(self, index, idProperty);
                        self._forceUpdate();
                     });
                  }
                  else {
                     self._configs[index] = new RecordSet({rawData: dSource});
                     self._configs[index].setIdProperty(idProperty);
                     self._listConfig.at(index).selectedKeys = sKey || _private._getElement(self, index, idProperty);
                     self._forceUpdate();
                  }
               });
            });
         },

         _open: function (event, item, index) {
            var config = {
               componentOptions: {
                  items: this._configs[index],
                  keyProperty: this._listConfig.at(index).get('idProperty'), // Utils.getItemPropertyValue(item, 'idProperty'),
                  parentProperty: Utils.getItemPropertyValue(item, 'parentProperty'),
                  nodeProperty: Utils.getItemPropertyValue(item, 'nodeProperty'),
                  itemTemplateProperty: item.itemTemplateProperty,
                  itemTemplate: item.itemTemplate,
                  headTemplate: item.headTemplate,
                  footerTemplate: item.footerTemplate,
                  selectedKeys: item.selectedKeys
               },
               target: event.target.parentElement
            };
            //Сохраняем индекс последнего открытого списка. Чтобы получить список в selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _updateText: function (item, index) {
            if (this._configs[index]) {
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
            this._listConfig.at(index).selectedKeys = _private._getElement(this, index, Utils.getItemPropertyValue(item, 'idProperty'));
            this._notify('selectedKeysChanged', [this._listConfig.at(index).selectedKeys]);
         }
      });

      FastData._private = _private;
      return FastData;
   }
);