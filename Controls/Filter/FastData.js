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
      'Core/IoC',
      'WS.Data/Utils',
      'css!Controls/Filter/FastData/FastData'
   ],
   function (Control, DropdownUtils, template, SourceController, Chain, RecordSet, SourceUtil, cInstance, IoC, Utils) {

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

         loadListConfig: function (self, item, index) {
            var sKey = Utils.getItemPropertyValue(item, 'selectedKeys'),
               dSource = Utils.getItemPropertyValue(item, 'source'),
               idProperty = Utils.getItemPropertyValue(item, 'idProperty');

            self._selectedIndexes[index] = Utils.getItemPropertyValue(item, 'selectedIndex') || 0;
            self._configs[index] = {};

            //Проверяем на источник
            var source = SourceUtil.prepareSource(dSource);
            if (!cInstance.instanceOfMixin(source, 'WS.Data/Source/ISource')) {
               IoC.resolve('ILogger').error('FastData', 'Source option is undefined. Can\'t load data');
               return;
            }

            return DropdownUtils._loadItems(self._configs[index], dSource, sKey).addCallback(function (items) {
               self._configs[index]._items = items;
               self._configs[index]._items.setIdProperty(idProperty);
               self._configs[index].selectedKeys = sKey || _private.getElement(self, index, idProperty);
               self._forceUpdate();
            });
         },

         reload: function (self, sourceController) {
            return sourceController.load().addCallback(function (configs) {
               self._listConfig = configs;
               return Chain(configs).map(function (item, index) {
                  _private.loadListConfig(self, item, index);
               }).value();
            });
         },

         getElement: function (self, index, property) {
            return self._configs[index]._items.at(self._selectedIndexes[index]).get(property);
         },

         getFilter: function(self) {
            var filter = {};
            Chain(self._configs).each(function (config, index) {
               if(config._items) {
                  filter[Utils.getItemPropertyValue(self._listConfig.at(index), 'id')] = config.selectedKeys;
               }
            });
            return filter;
         },

         selectItem: function (item) {
            //Устанавливаем индекс выбранного элемента списка
            this._selectedIndexes[this.lastOpenIndex] = this._configs[this.lastOpenIndex]._items.getIndex(item);

            //Получаем ключ выбранного элемента
            var key = item.getId();
            this._configs[this.lastOpenIndex].selectedKeys = key;

            this._notify('selectedKeysChanged', [key]);
         },

         onResult: function (args) {
            var actionName = args[0];
            var data = args[2];
            if (actionName === 'itemClick') {
               _private.selectItem.apply(this, data);

              this._notify('onFilterChange', _private.getFilter(this));
               this._children.DropdownOpener.close();
            }
         }
      };

      var FastData = Control.extend({
         _template: template,
         _configs: null,
         _selectedIndexes: null,
         _listConfig: null,

         constructor: function () {
            FastData.superclass.constructor.apply(this, arguments);

            this._configs = {};
            this._selectedIndexes = {};
            this._listConfig = [];

            this._onResult = _private.onResult.bind(this);
         },

         _beforeMount: function (options) {
            this.sourceController = new SourceController({
               source: options.source
            });
            return _private.reload(this, this.sourceController);
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
               return _private.getElement(this, index, Utils.getItemPropertyValue(item, 'displayProperty'));
            }
         },

         _reset: function (event, item, index) {
            this._selectedIndexes[index] = 0;
            this._configs[index].selectedKeys = _private.getElement(this, index, this._configs[index]._items.getIdProperty());
            this._notify('selectedKeysChanged', [this._configs[index].selectedKeys]);
         }
      });

      FastData._private = _private;
      return FastData;
   }
);