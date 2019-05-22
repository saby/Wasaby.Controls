import Control = require('Core/Control');
import template = require('wml!Controls/_filter/Fast/Fast');
import {Controller as SourceController} from 'Controls/source';
import chain = require('Types/chain');
import collection = require('Types/collection');
import cInstance = require('Core/core-instance');
import clone = require('Core/core-clone');
import pDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import Utils = require('Types/util');
import isEqual = require('Core/helpers/Object/isEqual');
import Merge = require('Core/core-merge');
import {dropdownHistoryUtils as historyUtils} from 'Controls/dropdown';

      /**
       * Control "Fast Filter".
       * Use dropDown lists for filter data.
       *
       * Here you can see a <a href="/materials/demo-ws4-filter-search-new">demo</a>.
       *
       * @class Controls/_filter/Fast
       * @extends Core/Control
       * @mixes Controls/interface/IFastFilter
       * @mixes Controls/_filter/Fast/FastStyles
       * @demo Controls-demo/FastFilter/fastPG
       * @control
       * @public
       * @author Герасимов А.М.
       */


      var getPropValue = Utils.object.getPropertyValue.bind(Utils);
      var setPropValue = Utils.object.setPropertyValue.bind(Utils);

      var _private = {

         prepareItems: function(self, items) {
            if (!cInstance.instanceOfModule(items, 'Types/collection:List')) {
               // TODO need to support serialization of History/Source, will be done on the task https://online.sbis.ru/opendoc.html?guid=60a7e58e-44ff-4d82-857f-356e7c9007c9
               self._items = new collection.List({
                  items: clone(items)
               });
            } else {
               self._items = Utils.object.clone(items);
            }
         },

         getSourceController: function(self, {source, navigation, keyProperty}) {
            if (!self._sourceController) {
               self._sourceController = new SourceController({
                  source: source,
                  navigation: navigation,
                  keyProperty: keyProperty
               });
            }
            return self._sourceController;
         },

         getItemPopupConfig: function(properties) {
            var itemConfig = {};
            itemConfig.keyProperty = properties.keyProperty;
            itemConfig.displayProperty = properties.displayProperty;
            itemConfig.itemTemplate = properties.itemTemplate;
            itemConfig.itemTemplateProperty = properties.itemTemplateProperty;
            itemConfig.headerTemplate = properties.headerTemplate;
            itemConfig.footerTemplate = properties.footerTemplate;
            itemConfig.multiSelect = properties.multiSelect;
            itemConfig.emptyText = properties.emptyText;
            itemConfig.selectorTemplate = properties.selectorTemplate;
            return itemConfig;
         },

         loadItemsFromSource: function(instance, {source, keyProperty filter, navigation, dataLoadCallback}) {
            // As the data source can be history source, then you need to merge the filter
            return _private.getSourceController(instance, {source, navigation, keyProperty}).load(historyUtils.getSourceFilter(filter, source)).addCallback(function(items) {
               instance._items = items;
               if (dataLoadCallback) {
                  dataLoadCallback(items);
               }
               return items
            });
         },

         loadItems: function(self, item, index) {
            var properties = getPropValue(item, 'properties');

            self._configs[index] = _private.getItemPopupConfig(properties);

            if (properties.items) {
               _private.prepareItems(self._configs[index], properties.items);
               return Deferred.success(self._configs[index]._items);
            } if (properties.source) {
               self._configs[index]._sourceController = null;
               return _private.loadItemsFromSource(self._configs[index], properties);
            }
         },

         reload: function(self) {
            var pDef = new pDeferred();
            chain.factory(self._items).each(function(item, index) {
               var result = _private.loadItems(self, item, index);
               pDef.push(result);
            });

            // At first, we will load all the lists in order not to cause blinking of the interface and many redraws.
            return pDef.done().getResult().addCallback(function() {
               self._setText();
               self._forceUpdate();

               return {
                  configs: self._configs,
                  items: self._items
               };
            });
         },

         notifyChanges: function(self, items) {
            self._notify('filterChanged', [_private.getFilter(items)]);
            self._notify('itemsChanged', [items]);
         },

         getFilter: function(items) {
            var filter = {};
            chain.factory(items).each(function(item) {
               if (!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue'))) {
                  filter[getPropValue(item, 'id')] = getPropValue(item, 'value');
               }
            });
            return filter;
         },

         setValue: function(self, selectedKeys) {
            if (!selectedKeys.length) {
               var resetValue = getPropValue(self._items.at(self.lastOpenIndex), 'resetValue');
               setPropValue(self._items.at(self.lastOpenIndex), 'value', resetValue);
            } else if (self._configs[self.lastOpenIndex].multiSelect) {
               setPropValue(self._items.at(self.lastOpenIndex), 'value', selectedKeys);
            } else {
               setPropValue(self._items.at(self.lastOpenIndex), 'value', selectedKeys[0]);
            }
         },

         selectItems: function(items) {
            var self = this,
               selectedKeys = [];

            // Get keys of selected items
            chain.factory(items).each(function(item) {
               var key = getPropValue(item, self._configs[self.lastOpenIndex].keyProperty);
               selectedKeys.push(key);
            });

            _private.setValue(this, selectedKeys);

            this._setText();
         },

         getNewItems: function(self, selectedItems) {
            var newItems = [],
               curItems = self._configs[self.lastOpenIndex]._items,
               keyProperty = self._configs[self.lastOpenIndex].keyProperty;

            chain.factory(selectedItems).each(function(item) {
               if (!curItems.getRecordById(item.get(keyProperty))) {
                  newItems.push(item);
               }
            });
            return newItems;
         },

         onResult: function(event, result) {
            if (result.action === 'selectorResult') {
               this._configs[this.lastOpenIndex]._items.prepend(_private.getNewItems(this, result.data));
            }
            if (result.data) {
               _private.selectItems.call(this, result.data);
               _private.notifyChanges(this, this._items);
            }
            this._children.DropdownOpener.close();
         },

         setTextValue: function(item, textValue) {
            if (getPropValue(item, 'textValue') !== undefined) {
               setPropValue(item, 'textValue', textValue);
            }
         },

         isNeedReload: function(oldItems, newItems) {
            var isChanged = false;

            if (newItems.length !== oldItems.length) {
               isChanged = true;
            } else {
               chain.factory(newItems).each(function(item, index) {
                  if (!isEqual(item.properties.source, oldItems[index].properties.source) ||
                     !isEqual(item.properties.filter, oldItems[index].properties.filter) ||
                     !isEqual(item.properties.navigation, oldItems[index].properties.navigation)) {
                     isChanged = true;
                  }
               });
            }

            return isChanged;
         },

         // TODO: DropdownList can not work with source.
         // Remove after execution: https://online.sbis.ru/opendoc.html?guid=96f11250-4bbd-419f-87dc-3a446ffa20ed
         calculateStateSourceControllers: function(configs, items) {
            chain.factory(configs).each(function(config, index) {
               _private.getSourceController(config, getPropValue(items.at(index), 'properties')).calculateState(config._items);
            });
         },

         getKeysLoad: function(items, keys) {
            let result = [];
            chain.factory(keys).each(function(key) {
               if (!items.getRecordById(key)) {
                  result.push(key);
               }
            });
           return result;
         },

         loadNewItems: function(items, configs) {
            let pDef = new pDeferred();
            chain.factory(items).each(function(item, index) {
               let keys = _private.getKeysLoad(configs[index]._items, item.value instanceof Array ? item.value: [item.value]);
               if (keys.length) {
                  let properties = {...getPropValue(item, 'properties')};
                  properties.filter = properties.filter || {};
                  properties.filter[properties.keyProperty] = keys;
                  let result = _private.loadItemsFromSource({}, properties).addCallback(function(items) {
                     configs[index]._items.prepend(items);
                  });
                  pDef.push(result);
               } else {
                  pDef.push(Deferred.success());
               }
            });
            return pDef.done().getResult();
         }
      };

      var Fast = Control.extend(/** @lends Controls/_filter/Fast.prototype */{
         _template: template,
         _configs: null,
         _items: null,

         _beforeMount: function(options, context, receivedState) {
            this._configs = [];
            this._onResult = _private.onResult.bind(this);

            var self = this,
               resultDef;

            if (receivedState) {
               this._configs = receivedState.configs;
               this._items = receivedState.items;
               if (options.items) {
                  _private.prepareItems(this, options.items);
                  _private.calculateStateSourceControllers(this._configs, this._items);
               }
            } else if (options.items) {
               _private.prepareItems(this, options.items);
               resultDef = _private.reload(this);
            } else if (options.source) {
               resultDef = _private.loadItemsFromSource(self, options).addCallback(function() {
                  return _private.reload(self);
               });
            }
            return resultDef;
         },

         _beforeUpdate: function(newOptions) {
            var self = this,
               resultDef;
            if (newOptions.items && (newOptions.items !== this._options.items)) {
               _private.prepareItems(this, newOptions.items);
               if (_private.isNeedReload(this._options.items, newOptions.items)) {
                  resultDef = _private.reload(this);
               } else {
                  resultDef = _private.loadNewItems(newOptions.items, this._configs).addCallback(function() {
                     self._setText();
                  });
               }
            } else if (newOptions.source && !isEqual(newOptions.source, this._options.source)) {
               this._sourceController = null;
               resultDef = _private.loadItemsFromSource(self, newOptions).addCallback(function() {
                  return _private.reload(self);
               });
            }
            return resultDef;
         },

         _open: function(event, item, index) {
            if (this._options.readOnly) {
               return;
            }
            var selectedKeys = getPropValue(this._items.at(index), 'value');
            var templateOptions = {
               items: this._configs[index]._items,
               selectedKeys: selectedKeys instanceof Array ? selectedKeys : [selectedKeys],
               isCompoundTemplate: getPropValue(this._items.at(index), 'properties').isCompoundTemplate,
               hasMoreButton: _private.getSourceController(this._configs[index],
                  getPropValue(this._items.at(index), 'properties')).hasMoreData('down')
            };
            var config = {
               templateOptions: Merge(_private.getItemPopupConfig(this._configs[index]), templateOptions),
               className: (this._configs[index].multiSelect ? 'controls-FastFilter_multiSelect-popup' : 'controls-FastFilter-popup') + '_theme_' + this._options.theme,

               // FIXME: this._container - jQuery element in old controls envirmoment https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
               target: (this._container[0] || this._container).children[index]
            };

            // Save the index of the last open list. To get the list in method selectItem
            this.lastOpenIndex = index;
            this._children.DropdownOpener.open(config, this);
         },

         _setText: function() {
            var self = this;
            chain.factory(this._configs).each(function(config, index) {
               var sKey = getPropValue(self._items.at(index), 'value'),
                  text = [];
               if (!(sKey instanceof Array)) {
                  sKey = [sKey];
               }
               if (sKey[0] === null && config.emptyText) {
                  text.push(config.emptyText);
               } else {
                  chain.factory(config._items).each(function(item) {
                     if (sKey.indexOf(getPropValue(item, config.keyProperty)) !== -1) {
                        text.push(getPropValue(item, config.displayProperty));
                     }
                  });
               }
               config.text = text[0];
               config.title = text.join(', ');
               if (text.length > 1) {
                  config.hasMoreText = ', ' + rk('еще ') + (text.length - 1);
               } else {
                  config.hasMoreText = '';
               }
               _private.setTextValue(self._items.at(index), config.title);
            });
            this._forceUpdate();
         },

         _needShowCross: function(item) {
            return !this._options.readOnly && getPropValue(item, 'resetValue') !== undefined && !isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue'));
         },

         _reset: function(event, item, index) {
            var newValue = getPropValue(this._items.at(index), 'resetValue');
            setPropValue(this._items.at(index), 'value', newValue);
            _private.setTextValue(this._items.at(index), '');
            _private.notifyChanges(this, this._items);
            this._setText();
         }
      });

      Fast._private = _private;
      Fast._theme = ['Controls/filter'];
      export = Fast;

