define('Controls/Filter/Fast',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Fast/Fast',
      'Controls/Controllers/SourceController',
      'WS.Data/Chain',
      'WS.Data/Collection/List',
      'Core/core-instance',
      'Core/ParallelDeferred',
      'Core/Deferred',
      'WS.Data/Utils',
      'css!Controls/Filter/Fast/Fast',
      'css!Controls/Input/Dropdown/Dropdown'

   ],
   function(Control, template, SourceController, Chain, List, cInstance, pDeferred, Deferred, Utils) {

      'use strict';

      /**
       * Control "Fast Filter"
       * @class Controls/Filter/FastFilter
       * @extends Core/Control
       * @control
       * @public
       * @author Золотова Э.Е.
       */

      /**
       * @event Controls/Filter/FastFilter#filterChanged Occurs when the filter changes.
       */

      /**
       * @name Controls/Filter/FastFilter#source
       * @cfg {WS.Data/Source/ISource} Sets the source of data set to use in the mapping. If 'items' is specified, 'source' will be ignored.
       */

      /**
       * @name Controls/Filter/FastFilter#items
       * @cfg {WS.Data/Collection/IList} Sets a set of initial data to build the mapping.
       */

      var getPropValue = Utils.getItemPropertyValue.bind(Utils);
      var setPropValue = Utils.setItemPropertyValue.bind(Utils);

      var _private = {

         prepareItems: function(self, items) {
            if (!cInstance.instanceOfMixin(items, 'WS.Data/Collection/IList')) {
               self._items = new List({
                  items: items
               });
            } else {
               self._items = items;
            }
         },

         loadItemsFromSource: function(instance, source, keyProperty) {
            var sourceController = new SourceController({
               source: source,
               idProperty: keyProperty
            });
            return sourceController.load().addCallback(function(items) {
               instance._items = items;
            });
         },

         loadItems: function(self, item, index) {
            var properties = getPropValue(item, 'properties');

            self._configs[index] = {};
            self._configs[index].keyProperty = properties.keyProperty;
            self._configs[index].displayProperty = properties.displayProperty;

            if (properties.items) {
               _private.prepareItems(self._configs[index], properties.items, properties.keyProperty);
               return Deferred.success(self._configs[index]._items);
            } else if (properties.source) {
               return _private.loadItemsFromSource(self._configs[index], properties.source, properties.keyProperty);
            }
         },

         reload: function(self) {
            var pDef = new pDeferred();
            Chain(self._items).each(function(item, index) {
               var result = _private.loadItems(self, item, index);
               pDef.push(result);
            });

            //Сначала загрузим все списки, чтобы не вызывать морганий интерфейса и множества перерисовок
            return pDef.done().getResult().addCallback(function() {
               self._forceUpdate();
            });
         },

         getFilter: function(items) {
            var filter = {};
            Chain(items).each(function(item) {
               if (getPropValue(item, 'value') !== getPropValue(item, 'resetValue')) {
                  filter[getPropValue(item, 'id')] = getPropValue(item, 'value');
               }
            });
            return filter;
         },

         selectItem: function(item) {
            //Получаем ключ выбранного элемента
            var key = getPropValue(item, this._configs[this.lastOpenIndex].keyProperty);
            setPropValue(this._items.at(this.lastOpenIndex), 'value', key);
            this._notify('selectedKeysChanged', [key]);
         },

         onResult: function(result) {
            var data = result.data;
            _private.selectItem.apply(this, data);
            this._notify('filterChanged', [_private.getFilter(this._items)]);
            this._children.DropdownOpener.close();
         },

         resize: function(self, fastFilter) {

            self._notify('sizeChanged', fastFilter.width);
         }
      };

      var FastData = Control.extend({
         _template: template,
         _configs: null,
         _items: null,

         constructor: function() {
            FastData.superclass.constructor.apply(this, arguments);

            this._configs = {};
            this._items = [];

            this._onResult = _private.onResult.bind(this);
         },

         _beforeMount: function(options) {
            var self = this,
               resultDef;
            if (options.items) {
               _private.prepareItems(this, options.items);
               resultDef = _private.reload(this);
            } else if (options.source) {
               resultDef = _private.loadItemsFromSource(self, options.source).addCallback(function() {
                  return _private.reload(self);
               });
            }
            return resultDef;
         },

         _open: function(event, item, index) {
            var config = {
               templateOptions: {
                  items: this._configs[index]._items,
                  keyProperty: this._configs[index].keyProperty,
                  parentProperty: getPropValue(item, 'parentProperty'),
                  nodeProperty: getPropValue(item, 'nodeProperty'),
                  itemTemplateProperty: getPropValue(item, 'itemTemplateProperty'),
                  itemTemplate: getPropValue(item, 'itemTemplate'),
                  headTemplate: getPropValue(item, 'headTemplate'),
                  footerTemplate: getPropValue(item, 'footerTemplate'),
                  selectedKeys: getPropValue(this._items.at(index), 'value')
               },
               target: this._container.children[index]
            };

            //Сохраняем индекс последнего открытого списка. Чтобы получить список в selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _getText: function(item, index) {
            if (this._configs[index]._items) {
               var sKey = getPropValue(this._items.at(index), 'value');
               return getPropValue(this._configs[index]._items.getRecordById(sKey), this._configs[index].displayProperty);
            }
         },

         _reset: function(event, item, index) {
            var newValue = getPropValue(this._items.at(index), 'resetValue');
            setPropValue(this._items.at(index), 'value', newValue);
            this._notify('selectedKeysChanged', [newValue]);
            this._notify('filterChanged', [_private.getFilter(this._items)]);
            _private.resize(this, this._children.fastFilter);
         }
      });

      FastData._private = _private;
      return FastData;
   }
);
