import Control = require('Core/Control');
import template = require('wml!Controls/_filter/View/View');

import isEqual = require('Core/helpers/Object/isEqual');
import CoreClone = require('Core/core-clone');
import cInstance = require('Core/core-instance');
import ParallelDeferred = require('Core/ParallelDeferred');
import SourceController = require('Controls/Controllers/SourceController');
import historyUtils = require('Controls/History/dropdownHistoryUtils');

import {object} from 'Types/util';
import {factory} from 'Types/chain';
import {List} from 'Types/collection';
import {RecordSet} from 'Types/collection';

var _private = {
    prepareItems: function(self, items) {
        if (!cInstance.instanceOfModule(items, 'Types/collection:List')) {
            // TODO need to support serialization of History/Source, will be done on the task https://online.sbis.ru/opendoc.html?guid=60a7e58e-44ff-4d82-857f-356e7c9007c9
            self._items = new List({
                items: CoreClone(items)
            });
        } else {
            self._items = object.clone(items);
        }
    },

    calculateStateSourceControllers: function(configs, items) {
        factory(configs).each(function(config, index) {
            _private.getSourceController(config, object.getPropertyValue(items.at(index), 'options').source,
                object.getPropertyValue(items.at(index), 'options').navigation).calculateState(config.items);
        });
    },

    getSourceController: function(self, source, navigation) {
        if (!self._sourceController) {
            self._sourceController = new SourceController({
                source: source,
                navigation: navigation
            });
        }
        return self._sourceController;
    },

    setPopupConfig: function(self, configs, items) {
        factory(configs).each(function(config, index) {
            var item = items.at(index);
            config.emptyText = item.emptyText;
            config.selectedKeys = (item.value instanceof Array) ? item.value : [item.value];
            config.hasMoreButton = _private.getSourceController(config, item.options.source, item.options.navigation).hasMoreData('down');
        });
    },

    getItemConfig: function(properties) {
        var itemConfig = {};

        itemConfig.keyProperty = properties.keyProperty;
        itemConfig.displayProperty = properties.displayProperty;
        itemConfig.itemTemplate = properties.itemTemplate;
        itemConfig.itemTemplateProperty = properties.itemTemplateProperty;
        itemConfig.headerTemplate = properties.headerTemplate;
        itemConfig.footerTemplate = properties.footerTemplate;
        itemConfig.multiSelect = properties.multiSelect;
        itemConfig.selectorTemplate = properties.selectorTemplate;
        return itemConfig;
    },

    setText: function(self, displayText, items, configs) {
        factory(configs).each(function(config, index) {
            displayText[index] = {};
            if (!isEqual(items.at(index).value, items.at(index).resetValue)) {
                var sKey = items.at(index).value,
                    text = [];
                if (!(sKey instanceof Array)) {
                    sKey = [sKey];
                }
                if (sKey[0] === null && config.emptyText) {
                    text.push(config.emptyText);
                } else {
                    factory(config.items).each(function (item) {
                        if (sKey.indexOf(object.getPropertyValue(item, config.keyProperty)) !== -1) {
                            text.push(object.getPropertyValue(item, config.displayProperty));
                        }
                    });
                }
                displayText[index].text = text[0];
                displayText[index].title = text.join(', ');
                if (text.length > 1) {
                    displayText[index].hasMoreText = ', ' + rk('еще ') + (text.length - 1);
                } else {
                    displayText[index].hasMoreText = '';
                }
                items.at(index).textValue = displayText[index].text + displayText[index].hasMoreText;
            }
        });
        self._forceUpdate();
    },

    loadItemsFromSource: function(instance, source, keyProperty, filter, navigation, dataLoadCallback) {
        // As the data source can be history source, then you need to merge the filter
        instance._filter = historyUtils.getSourceFilter(filter, source);
        return _private.getSourceController(instance, source, navigation).load(instance._filter).addCallback(function(items) {
            instance.items = items;
            if (dataLoadCallback) {
                dataLoadCallback(items);
            }
        });
    },

    loadItems: function(self, item, index) {
        // TODO: Поддержать, если item.options - массив
        var options = item.options;

        self._configs[index] = _private.getItemConfig(options);

        if (options.source) {
            return _private.loadItemsFromSource(self._configs[index], options.source, options.keyProperty, options.filter, options.navigation, options.dataLoadCallback);
        }
    },

    notifyChanges: function(self, items) {
        self._notify('filterChanged', [_private.getFilter(items)]);
        self._notify('itemsChanged', [items]);
    },

    getFilter: function(items) {
        var filter = {};
        factory(items).each(function(item) {
            if (!isEqual(object.getPropertyValue(item, 'value'), object.getPropertyValue(item, 'resetValue'))) {
                filter[object.getPropertyValue(item, 'id')] = object.getPropertyValue(item, 'value');
            }
        });
        return filter;
    },

    reload: function(self) {
        var pDef = new ParallelDeferred();
        factory(self._items).each(function(item, index) {
            if (item.options) {
                var result = _private.loadItems(self, item, index);
                pDef.push(result);
            }
        });

        // At first, we will load all the lists in order not to cause blinking of the interface and many redraws.
        return pDef.done().getResult().addCallback(function() {
            _private.setText(self, self._displayText, self._items, self._configs);
            return {
                configs: self._configs,
                items: self._items
            };
        });
    },

    setValue: function(self, selectedKeys, index) {
        if (!selectedKeys.length) {
            var resetValue = object.getPropertyValue(self._items.at(index), 'resetValue');
            object.setPropertyValue(self._items.at(index), 'value', resetValue);
        } else if (self._configs[index].multiSelect) {
            object.setPropertyValue(self._items.at(index), 'value', selectedKeys);
        } else {
            object.setPropertyValue(self._items.at(index), 'value', selectedKeys[0]);
        }
    },

    selectItems: function(self, items) {
        factory(items).each(function(selectedKeys, index) {
            if (selectedKeys) {
                _private.setValue(self, selectedKeys, index);
            }
        });

        _private.setText(self, self._displayText, self._items, self._configs);
    },

    getNewItems: function(self, selectedItems, config) {
        var newItems = [],
            curItems = config.items,
            keyProperty = config.keyProperty;

        factory(selectedItems).each(function(item) {
            if (!curItems.getRecordById(object.getPropertyValue(item, keyProperty))) {
                newItems.push(item);
            }
        });
        return newItems;
    },

    getSelectedKeys: function(items, properties) {
        var selectedKeys = [];
        factory(items).each(function(item) {
            selectedKeys.push(object.getPropertyValue(item, properties.keyProperty));
        });
        return selectedKeys;
    }
};

var Filter = Control.extend({
    _template: template,
    _displayText: null,
    _configs: null,
    _items: null,

    _beforeMount: function(options, context, receivedState) {
        this._configs = [];
        this._displayText = [];

        if (receivedState) {
            this._configs = receivedState.configs;
            this._items = receivedState.items;
            _private.calculateStateSourceControllers(this._configs, this._items);
            _private.setText(this, this._displayText, this._items, this._configs);
        } else if (options.source) {
            _private.prepareItems(this, options.source);
            return _private.reload(this);
        }
    },

    _open: function() {
        if (this._children.DropdownOpener.isOpened()) {
            return;
        }
        _private.setPopupConfig(this, this._configs, this._items);
        var popupOptions = {
            templateOptions: {
                items: new RecordSet({
                    rawData: this._configs
                })
            },
            target: (this._container[0] || this._container)
        };
        this._children.DropdownOpener.open(popupOptions, this);
    },

    _resultHandler: function(event, result) {
        if (result.action === 'itemClick') {
            _private.setValue(this, result.selectedKeys, result.index);
            _private.setText(this, this._displayText, this._items, this._configs);
        }
        if (result.action === 'applyClick') {
            _private.selectItems(this, result.selectedKeys);
        }
        if (result.action === 'selectorResult') {
            var curConfig = this._configs[result.index],
                newItems = _private.getNewItems(this, result.data, curConfig);
            curConfig.items.prepend(newItems);
            _private.setValue(this, _private.getSelectedKeys(result.data, curConfig), result.index);
            _private.setText(this, this._displayText, this._items, this._configs);
        }
        _private.notifyChanges(this, this._items);
        this._children.DropdownOpener.close();
    },

    _isReseted: function() {
        var isReseted = true;
        factory(this._items).each(function(item) {
            if (!isEqual(object.getPropertyValue(item, 'value'), object.getPropertyValue(item, 'resetValue'))) {
                isReseted = false;
            }
        });
        return isReseted;
    },

    _reset: function(event, item, index) {
        if (this._children.DropdownOpener.isOpened()) {
            return;
        }
        var newValue = object.getPropertyValue(this._items.at(index), 'resetValue');
        object.setPropertyValue(this._items.at(index), 'value', newValue);
        _private.notifyChanges(this, this._items);
        _private.setText(this, this._displayText, this._items, this._configs);
    }
});

Filter.getDefaultOptions = function() {
    return {
        itemsSpacing: 'medium'
    };
};

Filter._theme = ['Controls/_filter/View/View'];

Filter._private = _private;

export = Filter;
