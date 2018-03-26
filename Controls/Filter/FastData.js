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
      'Core/ParallelDeferred',
      'css!Controls/Filter/FastData/FastData',
      'css!Controls/Input/Dropdown/Dropdown'

   ],
   function (Control, DropdownUtils, template, SourceController, Chain, RecordSet, SourceUtil, cInstance, IoC, Utils, pDeferred) {

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
            var value = Utils.getItemPropertyValue(item, 'value'),
               dSource = Utils.getItemPropertyValue(item, 'source'),
               idProperty = Utils.getItemPropertyValue(item, 'idProperty'),
               resetValue = Utils.getItemPropertyValue(item, 'resetValue');

            self._configs[index] = {};

            //Проверяем на источник
            var source = SourceUtil.prepareSource(dSource);
            if (!cInstance.instanceOfMixin(source, 'WS.Data/Source/ISource')) {
               IoC.resolve('ILogger').error('FastData', 'Source option is undefined. Can\'t load data');
               return;
            }

            return DropdownUtils._loadItems(self._configs[index], dSource, value).addCallback(function (items) {
               self._configs[index]._items = items;
               self._configs[index]._items.setIdProperty(idProperty);
               self._configs[index].value = value;
               self._configs[index].resetValue = resetValue;
               self._configs[index].idProperty = idProperty;

               self._selectedIndexes[index] = items.getIndexByValue(idProperty, self._configs[index].value);


            });
         },

         reload: function (self) {
            var pDef = new pDeferred();
            Chain(self._listConfig).map(function (item, index) {
               pDef.push(_private.loadListConfig(self, item, index));


            }).value();
            return pDef.done().getResult().addCallback(function () {
               self._forceUpdate();
            });
         },

         getFilter: function (self) {
            var filter = {};
            Chain(self._configs).each(function (config, index) {
               if (config._items && config.value) {
                  filter[Utils.getItemPropertyValue(self._listConfig.at(index), 'id')] = config.value;
               }
            });
            return filter;
         },

         selectItem: function (item) {
            //Устанавливаем индекс выбранного элемента списка
            this._selectedIndexes[this.lastOpenIndex] = this._configs[this.lastOpenIndex]._items.getIndex(item);

            //Получаем ключ выбранного элемента
            var key = item.getId();
            if (key !== this._configs[this.lastOpenIndex].resetValue) {
               this._configs[this.lastOpenIndex].value = key;
            } else {
               this._configs[this.lastOpenIndex].value = null;
            }
            this._notify('selectedKeysChanged', [key]);
         },

         onResult: function (args) {
            var actionName = args[0];
            var data = args[2];
            if (actionName === 'itemClick') {
               _private.selectItem.apply(this, data);
               this._notify('filterChanged', [_private.getFilter(this)], {bubbling: true});
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
            if (options.items) {
               this._listConfig = new RecordSet({rawData: options.items});
               return _private.reload(this);
            }

            var self = this;
            this.sourceController = new SourceController({
               source: options.source
            });
            return this.sourceController.load().addCallback(function (configs) {
               self._listConfig = configs;
               return _private.reload(self);
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
                  selectedKeys: this._configs[index].value || this._configs[index].resetValue
               },
               target: event.target.parentElement
            };
            //Сохраняем индекс последнего открытого списка. Чтобы получить список в selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _updateText: function (item, index) {
            if (this._configs[index]._items) {
               var sKey = this._configs[index].value || this._configs[index].resetValue;
               return this._configs[index]._items.getRecordById(sKey).get(Utils.getItemPropertyValue(item, 'displayProperty'));
            }
         },

         _reset: function (event, item, index) {
            var id = Utils.getItemPropertyValue(item, 'idProperty');
            this._selectedIndexes[index] = this._configs[index]._items.getIndexByValue(id, this._configs[index].resetValue);
            this._configs[index].value = null;
            this._notify('selectedKeysChanged', [this._configs[index].value]);
            this._notify('filterChanged', [_private.getFilter(this)], {bubbling: true});
         }
      });

      FastData._private = _private;
      return FastData;
   }
);