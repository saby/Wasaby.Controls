define('Controls/Filter/Fast',
   [
      'Core/Control',
      'wml!Controls/Filter/Fast/Fast',
      'Controls/Controllers/SourceController',
      'WS.Data/Chain',
      'WS.Data/Collection/List',
      'Core/core-instance',
      'Core/ParallelDeferred',
      'Core/Deferred',
      'WS.Data/Utils',
      'Core/helpers/Object/isEqual',
      'css!Controls/Filter/Fast/Fast',
      'css!Controls/Input/Dropdown/Dropdown'

   ],
   function(Control, template, SourceController, Chain, List, cInstance, pDeferred, Deferred, Utils, isEqual) {

      'use strict';

      /**
       * Control "Fast Filter".
       * Use dropDown lists for filter data.
       *
       * Here you can see a <a href="/materials/demo-ws4-filter-search-new">demo</a>.
       *
       * @class Controls/Filter/Fast
       * @extends Core/Control
       * @mixes Controls/interface/IFastFilter
       * @mixes Controls/Filter/Fast/FastStyles
       * @control
       * @public
       * @author Герасимов А.М.
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

         loadItemsFromSource: function(instance, source, keyProperty, filter) {
            var sourceController = new SourceController({
               source: source,
               idProperty: keyProperty
            });
            return sourceController.load(filter).addCallback(function(items) {
               instance._items = items;
            });
         },

         loadItems: function(self, item, index) {
            var properties = getPropValue(item, 'properties');

            self._configs[index] = {};
            self._configs[index].keyProperty = properties.keyProperty;
            self._configs[index].displayProperty = properties.displayProperty;

            if (properties.items) {
               _private.prepareItems(self._configs[index], properties.items);
               return Deferred.success(self._configs[index]._items);
            } else if (properties.source) {
               return _private.loadItemsFromSource(self._configs[index], properties.source, properties.keyProperty, properties.filter);
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
               self._setText();
               self._forceUpdate();
            });
         },

         getFilter: function(items) {
            var filter = {};
            Chain(items).each(function(item) {
               if (!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue'))) {
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
            this._setText();
         },

         onResult: function(result) {
            var data = result.data;
            _private.selectItem.apply(this, data);
            this._notify('filterChanged', [_private.getFilter(this._items)]);
            this._children.DropdownOpener.close();
         }
      };

      var Fast = Control.extend(/** @lends Controls/Filter/Fast.prototype */{
         _template: template,
         _configs: null,
         _items: null,

         constructor: function() {
            Fast.superclass.constructor.apply(this, arguments);

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

         _setText: function() {
            var self = this;
            Chain(this._configs).each(function(config, index) {
               var sKey = getPropValue(self._items.at(index), 'value');
               if (sKey instanceof Array) {
                  sKey = sKey[0];
               }
               Chain(config._items).each(function(item) {
                  if (getPropValue(item, config.keyProperty) === sKey) {
                     config.text = getPropValue(item, config.displayProperty);
                  }
               });
            });
         },

         _reset: function(event, item, index) {
            var newValue = getPropValue(this._items.at(index), 'resetValue');
            setPropValue(this._items.at(index), 'value', newValue);
            this._notify('selectedKeysChanged', [newValue]);
            this._notify('filterChanged', [_private.getFilter(this._items)]);
            this._setText();
         },
         
         _beforeUpdate: function(newOptions) {
            if (this._options.items !== newOptions.items) {
               _private.prepareItems(this, newOptions.items);
               this._setText();
            }
         }
      });
   
      Fast._private = _private;
      return Fast;
   }
);
