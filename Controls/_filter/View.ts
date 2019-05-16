import Control = require('Core/Control');
import template = require('wml!Controls/_filter/View/View');

import isEqual = require('Core/helpers/Object/isEqual');
import CoreClone = require('Core/core-clone');
import Merge = require('Core/core-merge');
import cInstance = require('Core/core-instance');
import ParallelDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import SourceController = require('Controls/Controllers/SourceController');
import historyUtils = require('Controls/History/dropdownHistoryUtils');
import converterFilterItems = require('Controls/_filter/converterFilterItems');

import {object} from 'Types/util';
import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';

/**
 * Control for data filtering. Consists of an icon-button, a string representation of the selected filter and fast filter parameters.
 * Clicking on a icon-button or a string opens the detail panel. {@link Controls/_filterPopup/DetailPanel}
 * Clicking on fast filter parameters opens the simple panel. {@link Controls/_filterPopup/SimplePanel}
 *
 * @class Controls/_filter/View
 * @extends Core/Control
 * @control
 * @public
 * @author Золотова Э.Е.
 */

var _private = {
    getItemByName: function(items, name) {
        var result;
        factory(items).each(function(item) {
            if (item.name === name) {
                result = item;
            }
        });
        return result;
    },

    prepareItems: function(self, items) {
        self._filterSource = object.clone(items);
    },

    calculateStateSourceControllers: function(configs, filterSource) {
        factory(filterSource).each(function(item) {
            if (item.viewMode === 'frequent') {
                var sourceController = _private.getSourceController(configs[item.name], item.editorOptions.source,
                     item.editorOptions.navigation);
                sourceController.calculateState(configs[item.name].items);
            }
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
        var popupItems = [];
        factory(items).each(function(item) {
            if (item.viewMode === 'frequent') {
                var popupItem = configs[item.name];
                popupItem.id = item.name;
                popupItem.selectedKeys = configs[item.name].multiSelect ? item.value : [item.value];
                if (item.editorOptions.source) {
                    popupItem.hasMoreButton = _private.getSourceController(configs[item.name], item.editorOptions.source, item.editorOptions.navigation).hasMoreData('down');
                }
                popupItems.push(popupItem);
            }
        });
        return popupItems;
    },

    getFastText: function(config, selectedKeys) {
        var textArr = [];
        if (selectedKeys[0] === null && config.emptyText) {
            textArr.push(config.emptyText);
        } else if (config.items) {
            factory(config.items).each(function (item) {
                if (selectedKeys.indexOf(object.getPropertyValue(item, config.keyProperty)) !== -1) {
                    textArr.push(object.getPropertyValue(item, config.displayProperty));
                }
            });
        }
        return {
            text: textArr[0] || '',
            title: textArr.join(', '),
            hasMoreText: textArr.length > 1 ? ', ' + rk('еще ') + (textArr.length - 1) : ''
        };
    },

    getFilterButtonText: function(self, items) {
        var textArr = [];
        factory(items).each(function(item) {
            if (item.viewMode !== 'frequent' && item.viewMode !== 'extended' && _private.isItemChanged(item)) {
                var textValue = item.textValue;
                if (textValue) {
                    textArr.push(textValue);
                }
            }
        });
        return textArr.join(', ');
    },

    updateText: function(self, items, configs) {
        factory(items).each(function(item) {
            if (configs[item.name]) {
                self._displayText[item.name] = {};
                if (_private.isItemChanged(item)) {
                    var sKey = configs[item.name].multiSelect ? item.value : [item.value];
                    self._displayText[item.name] = _private.getFastText(configs[item.name], sKey);
                    if (item.textValue !== undefined) {
                        item.textValue = self._displayText[item.name].text + self._displayText[item.name].hasMoreText;
                    }
                }
            }
        });
        self._filterText = _private.getFilterButtonText(self, items);
        self._forceUpdate();
    },

    isItemChanged: function(item) {
        return !isEqual(object.getPropertyValue(item, 'value'), object.getPropertyValue(item, 'resetValue'));
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

    loadItems: function(self, item) {
        var options = item.editorOptions;

        self._configs[item.name] = CoreClone(options);
        self._configs[item.name].emptyText = item.emptyText;

        if (options.source) {
            return _private.loadItemsFromSource(self._configs[item.name], options.source, options.keyProperty, options.filter, options.navigation, options.dataLoadCallback);
        } else {
            return Deferred.success();
        }
    },

    notifyChanges: function(self, items) {
        self._notify('filterChanged', [_private.getFilter(items)]);
        self._notify('itemsChanged', [items]);
    },

    getFilter: function(items) {
        var filter = {};
        factory(items).each(function(item) {
            if (_private.isItemChanged(item)) {
                filter[item.name] = item.value;
            }
        });
        return filter;
    },

    reload: function(self) {
        var pDef = new ParallelDeferred();
        factory(self._filterSource).each(function(item) {
            if (item.editorOptions) {
                var result = _private.loadItems(self, item);
                pDef.push(result);
            }
        });

        // At first, we will load all the lists in order not to cause blinking of the interface and many redraws.
        return pDef.done().getResult().addCallback(function() {
            _private.updateText(self, self._filterSource, self._configs);
            return {
                configs: self._configs
            };
        });
    },

    setValue: function(self, selectedKeys, name) {
        var item = _private.getItemByName(self._filterSource, name);
        if (!selectedKeys.length) {
            var resetValue = object.getPropertyValue(item, 'resetValue');
            object.setPropertyValue(item, 'value', resetValue);
        } else if (self._configs[name].multiSelect) {
            object.setPropertyValue(item, 'value', selectedKeys);
        } else {
            object.setPropertyValue(item, 'value', selectedKeys[0]);
        }
    },

    selectItems: function(self, selectedKeys) {
        factory(selectedKeys).each(function(sKey, index) {
            if (sKey) {
                _private.setValue(self, sKey, index);
            }
        });

        _private.updateText(self, self._filterSource, self._configs);
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

    getSelectedKeys: function(items, config) {
        var selectedKeys = [];
        factory(items).each(function(item) {
            selectedKeys.push(object.getPropertyValue(item, config.keyProperty));
        });
        return selectedKeys;
    }
};

var Filter = Control.extend({
    _template: template,
    _displayText: null,
    _configs: null,
    _filterSource: null,

    _beforeMount: function(options, context, receivedState) {
        this._configs = {};
        this._displayText = {};

        if (receivedState) {
            this._configs = receivedState.configs;
            _private.prepareItems(this, options.filterSource);
            _private.calculateStateSourceControllers(this._configs, this._filterSource);
            _private.updateText(this, this._filterSource, this._configs);
        } else if (options.filterSource) {
            _private.prepareItems(this, options.filterSource);
            return _private.reload(this);
        }
    },

    _beforeUpdate: function(newOptions) {
        if (newOptions.filterSource && newOptions.filterSource !== this._options.filterSource) {
            _private.prepareItems(this, newOptions.filterSource);
            return _private.reload(this);
        }
    },

    _openDetailPanel: function() {
        if (this._options.detailPanelTemplateName) {
            var panelItems = converterFilterItems.convertToDetailPanelItems(this._filterSource);
            var className = 'controls-FilterButton-popup-orientation-' + (this._options.alignment === 'right' ? 'left' : 'right');
            this._open(panelItems, this._options.detailPanelTemplateName, className);
        } else {
            this._openPanel();
        }
    },

    _openPanel: function() {
        if (this._options.panelTemplateName) {
            var items = new RecordSet({
                rawData: _private.setPopupConfig(this, this._configs, this._filterSource)
            });
            this._open(items, this._options.panelTemplateName, 'controls-FilterView-SimplePanel-popup');
        }
    },

    _open: function(items, template, className) {
        if (this._children.DropdownOpener.isOpened()) {
            return;
        }

        var popupPosition = {};
        if (this._options.alignment === 'right') {
            popupPosition.corner = {
                vertical: 'top',
                horizontal: 'right'
            };
            popupPosition.horizontalAlign = {
                side: 'left'
            };
        }
        var popupOptions = {
            templateOptions: {
                items: items,
                theme: this._options.theme
            },
            template: template,
            className: className,
            target: this._container[0] || this._container
        };
        this._children.DropdownOpener.open(Merge(popupOptions, popupPosition), this);
    },

    _resultHandler: function(event, result) {
        if (!result.action) {
            var filterSource = converterFilterItems.convertToFilterSource(result.items);
            _private.prepareItems(this, filterSource);
            _private.updateText(this, filterSource, this._configs);
        }
        if (result.action === 'itemClick') {
            _private.setValue(this, result.selectedKeys, result.id);
            _private.updateText(this, this._filterSource, this._configs);
        }
        if (result.action === 'applyClick') {
            _private.selectItems(this, result.selectedKeys);
        }
        if (result.action === 'selectorResult') {
            var curConfig = this._configs[result.id],
                newItems = _private.getNewItems(this, result.data, curConfig);
            curConfig.items.prepend(newItems);
            _private.setValue(this, _private.getSelectedKeys(result.data, curConfig), result.id);
            _private.updateText(this, this._filterSource, this._configs);
        }
        _private.notifyChanges(this, this._filterSource);
        this._children.DropdownOpener.close();
    },

    _isFastReseted: function() {
        var isReseted = true;
        factory(this._filterSource).each(function(item) {
            if (item.viewMode === 'frequent' && _private.isItemChanged(item)) {
                isReseted = false;
            }
        });
        return isReseted;
    },

    _reset: function(event, item) {
        if (this._children.DropdownOpener.isOpened()) {
            return;
        }
        var newValue = object.getPropertyValue(item, 'resetValue');
        object.setPropertyValue(item, 'value', newValue);
        _private.notifyChanges(this, this._filterSource);
        _private.updateText(this, this._filterSource, this._configs);
    },

    _resetFilterText: function() {
        factory(this._filterSource).each(function(item) {
            // Fast filters could not be reset from the filter button.
            if (item.viewMode !== 'frequent') {
                item.value = item.resetValue;
                if (object.getPropertyValue(item, 'visibility') !== undefined) {
                    object.setPropertyValue(item, 'visibility', false);
                }
            }
        });
        _private.notifyChanges(this, this._filterSource);
        _private.updateText(this, this._filterSource, this._configs);
    }
});

Filter.getDefaultOptions = function() {
    return {
        alignment: 'right'
    };
};

Filter._theme = ['Controls/filter'];

Filter._private = _private;

export = Filter;
