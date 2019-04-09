define('Controls/Filter/Fast',
   [
      'Core/Control',
      'wml!Controls/Filter/Fast/Fast',
      'Controls/Controllers/SourceController',
      'Types/chain',
      'Types/collection',
      'Core/core-instance',
      'Core/core-clone',
      'Core/ParallelDeferred',
      'Core/Deferred',
      'Types/util',
      'Core/helpers/Object/isEqual',
      'Core/core-merge',
      'Controls/History/dropdownHistoryUtils',
      'css!theme?Controls/Filter/Fast/Fast',
      'css!theme?Controls/Input/Dropdown/Dropdown'

   ],
   function(Control, template, SourceController, chain, collection, cInstance, clone, pDeferred, Deferred, Utils, isEqual, Merge, historyUtils) {
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
            return itemConfig;
         },

         loadItemsFromSource: function(instance, source, keyProperty, filter, navigation, dataLoadCallback) {
            var sourceController = new SourceController({
               source: source,
               navigation: navigation,
               idProperty: keyProperty
            });

            // As the data source can be history source, then you need to merge the filter
            return sourceController.load(historyUtils.getSourceFilter(filter, source)).addCallback(function(items) {
               instance._items = items;
               if (dataLoadCallback) {
                  dataLoadCallback(items);
               }
            });
         },

         loadItems: function(self, item, index) {
            var properties = getPropValue(item, 'properties');

            self._configs[index] = _private.getItemPopupConfig(properties);

            if (properties.items) {
               _private.prepareItems(self._configs[index], properties.items);
               return Deferred.success(self._configs[index]._items);
            } if (properties.source) {
               return _private.loadItemsFromSource(self._configs[index], properties.source, properties.keyProperty, properties.filter, properties.navigation, properties.dataLoadCallback);
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

            // Get the key of the selected item
            chain.factory(items).each(function(item) {
               var key = getPropValue(item, self._configs[self.lastOpenIndex].keyProperty);
               selectedKeys.push(key);
            });

            _private.setValue(this, selectedKeys);

            this._setText();
         },

         onResult: function(event, result) {
            if (result.action === 'itemClick') {
               _private.selectItems.call(this, result.data);
               _private.notifyChanges(this, this._items);
               this._children.DropdownOpener.close();
            }
            if (result.action === 'applyClick') {
               _private.setValue(this, result.selectedKeys);
               this._setText();
               _private.notifyChanges(this, this._items);
               this._children.DropdownOpener.close();
            }
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
         }
      };

      var Fast = Control.extend(/** @lends Controls/Filter/Fast.prototype */{
         _template: template,
         _configs: null,
         _items: null,

         _beforeMount: function(options, context, receivedState) {
            this._configs = {};
            this._onResult = _private.onResult.bind(this);

            var self = this,
               resultDef;

            if (receivedState) {
               this._configs = receivedState.configs;
               this._items = receivedState.items;
            } else if (options.items) {
               _private.prepareItems(this, options.items);
               resultDef = _private.reload(this);
            } else if (options.source) {
               resultDef = _private.loadItemsFromSource(self, options.source).addCallback(function() {
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
                  this._setText();
               }
            } else if (newOptions.source && !isEqual(newOptions.source, this._options.source)) {
               resultDef = _private.loadItemsFromSource(self, newOptions.source).addCallback(function() {
                  return _private.reload(self);
               });
            }
            return resultDef;
         },

         _open: function(event, item, index) {
            if (this._options.readOnly) {
               return;
            }
            var templateOptions = {
               items: this._configs[index]._items,
               selectedKeys: getPropValue(this._items.at(index), 'value')
            };
            var config = {
               templateOptions: Merge(_private.getItemPopupConfig(this._configs[index]), templateOptions),

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
         },

         _needShowCross: function(item) {
            // Для совместимости dropdown на панели фильтров и быстрого фильтра.
            // Dropdown возвращает массив ключей, а быстрый фильтр только один ключ, добавляем на это проверку
            // TODO: Удалить после решения https://online.sbis.ru/opendoc.html?guid=883581df-f415-48d7-b407-97b7b02db8b9
            if (!(getPropValue(item, 'value') instanceof Array) && getPropValue(item, 'resetValue') instanceof Array) {
               return !this._options.readOnly && getPropValue(item, 'resetValue') !== undefined &&
                  !isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')[0]);
            }
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
      return Fast;
   });
