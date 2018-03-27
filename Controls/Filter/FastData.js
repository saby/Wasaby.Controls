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

         getSourceController: function (source) {
            return new SourceController({
               source: source
            }).load();
         },

         getItems: function (self, items) {
            if (!cInstance.instanceOfModule(items, 'WS.Data/Collection/RecordSet')) {
               self._items = new RecordSet({rawData: items});
            } else {
               self._items = items;
            }
         },

         loadListConfig: function (self, item, index) {
            var properties = item.get('properties'),
               dSource = {
                  source: properties.source,
                  idProperty: properties.idProperty
               };

            if (!item.get('value')) {
               self._items.at(index).set({value: item.get('resetValue')});
            }
            self._configs[index] = {};

            if (properties.items) {
               _private.getItems(self._configs[index], properties.items);
            } else if (properties.source) {
               return DropdownUtils.loadItems(self._configs[index], dSource).addCallback(function () {
                  self._configs[index].displayProperty = properties.displayProperty || 'title';
               });
            }
         },

         reload: function (self) {
            var pDef = new pDeferred();
            Chain(self._items).each(function (item, index) {
               var result = _private.loadListConfig(self, item, index);
               if (cInstance.instanceOfModule(result, 'Core/Deferred')) {
                  pDef.push(result);
               }
            });
            return pDef.done().getResult().addCallback(function () {
               self._forceUpdate();
            });
         },

         getFilter: function (self) {
            var filter = {};
            Chain(self._configs).each(function (config, index) {
               if (config._items && self._items.at(index).get('value') !== self._items.at(index).get('resetValue')) {
                  filter[self._items.at(index).get('id')] = self._items.at(index).get('value');
               }
            });
            return filter;
         },

         selectItem: function (item) {
            //Получаем ключ выбранного элемента
            var key = item.getId();
            this._items.at(this.lastOpenIndex).set({value: key});
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
         _items: null,

         constructor: function () {
            FastData.superclass.constructor.apply(this, arguments);

            this._configs = {};
            this._items = [];

            this._onResult = _private.onResult.bind(this);
         },

         _beforeMount: function (options) {
            var self = this,
               resultDef;
            if (options.items) {
               _private.getItems(this, options.items);
               resultDef = _private.reload(this);
            } else if (options.source) {
               resultDef = _private.getSourceController(options.source).addCallback(function (items) {
                  self._items = items;
                  return _private.reload(self);
               });
            }
            return resultDef;
         },

         _open: function (event, item, index) {
            var config = {
               componentOptions: {
                  items: this._configs[index]._items,
                  keyProperty: this._configs[index]._items.getIdProperty(),
                  parentProperty: item.get('parentProperty'),
                  nodeProperty: Utils.getItemPropertyValue(item, 'nodeProperty'),
                  itemTemplateProperty: Utils.getItemPropertyValue(item, 'itemTemplateProperty'),
                  itemTemplate: Utils.getItemPropertyValue(item, 'itemTemplate'),
                  headTemplate: Utils.getItemPropertyValue(item, 'headTemplate'),
                  footerTemplate: Utils.getItemPropertyValue(item, 'footerTemplate'),
                  selectedKeys: this._items.at(index).get('value') || this._items.at(index).get('resetValue')
               },
               target: event.target.parentElement
            };
            //Сохраняем индекс последнего открытого списка. Чтобы получить список в selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _getText: function (item, index) {
            if (this._configs[index]._items) {
               var sKey = this._items.at(index).get('value') || this._items.at(index).get('resetValue');
               return this._configs[index]._items.getRecordById(sKey).get(this._configs[index].displayProperty);
            }
         },

         _reset: function (event, item, index) {
            var newValue = this._items.at(index).get('resetValue');
            this._items.at(index).set({value: newValue});
            this._notify('selectedKeysChanged', [newValue]);
            this._notify('filterChanged', [_private.getFilter(this)], {bubbling: true});
         }
      });

      FastData._private = _private;
      return FastData;
   }
);