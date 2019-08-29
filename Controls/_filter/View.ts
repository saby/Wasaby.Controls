import Control = require('Core/Control');
import template = require('wml!Controls/_filter/View/View');
import CoreClone = require('Core/core-clone');
import Merge = require('Core/core-merge');
import ParallelDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import converterFilterItems = require('Controls/_filter/converterFilterItems');
import getFormattedDateRange = require('Core/helpers/Date/getFormattedDateRange');
import {isEqual} from 'Types/object';
import {Controller as SourceController} from 'Controls/source';
import {dropdownHistoryUtils as historyUtils} from 'Controls/dropdown';
import {object} from 'Types/util';
import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';
import {getItemsWithHistory, isHistorySource} from 'Controls/_filter/HistoryUtils';

/**
 * Контрол для фильтрации данных. Состоит из иконки-кнопки, строкового представления выбранного фильтра и параметров быстрого фильтра.
 * При клике на иконку-кнопку или строку представления открывается панель фильтров. {@link Controls/filterPopup:DetailPanel}
 * Клик на параметры быстрого фильтра открывает простую панель. {@link Controls/filterPopup:SimplePanel}
 * <a href="/materials/demo-ws4-filter-view">Демо-пример</a>.
 *
 * @class Controls/_filter/View
 * @extends Core/Control
 * @mixes Controls/_filter/interface/IFilterView
 * @control
 * @public
 * @author Золотова Э.Е.
 */

/*
 * Control for data filtering. Consists of an icon-button, a string representation of the selected filter and fast filter parameters.
 * Clicking on a icon-button or a string opens the detail panel. {@link Controls/filterPopup:DetailPanel}
 * Clicking on fast filter parameters opens the simple panel. {@link Controls/filterPopup:SimplePanel}
 * Here you can see <a href="/materials/demo-ws4-filter-view">demo-example</a>.
 *
 * @class Controls/_filter/View
 * @extends Core/Control
 * @mixes Controls/_filter/interface/IFilterView
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

    isFrequentItem: function(item) {
      return item.viewMode === 'frequent';
    },

    prepareItems: function(self, items) {
        // When serializing the Date, "_serializeMode" field is deleted, so object.clone can't be used
        self._source = CoreClone(items);
    },

    calculateStateSourceControllers: function(configs, source) {
        factory(source).each(function(item) {
            if (_private.isFrequentItem(item)) {
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

    getDateRangeItem: function(items) {
        let dateRangeItem;
        factory(items).each((item) => {
           if (item.type === 'dateRange') {
               dateRangeItem = item;
           }
        });
        return dateRangeItem;
    },

    setPopupConfig: function(self, configs, items) {
        var popupItems = [];
        factory(items).each(function(item) {
            if (_private.isFrequentItem(item)) {
                var popupItem = configs[item.name];
                popupItem.id = item.name;
                popupItem.selectedKeys = configs[item.name].multiSelect ? item.value : [item.value];
                popupItem.resetValue = (item.resetValue instanceof Array) ? item.resetValue : [item.resetValue];
                if (item.editorOptions.source) {
                    popupItem.hasMoreButton = _private.getSourceController(configs[item.name], item.editorOptions.source, item.editorOptions.navigation).hasMoreData('down');
                    popupItem.selectorOpener = self._children.selectorOpener;
                    popupItem.selectorDialogResult = self._onSelectorTemplateResult.bind(self);
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
            if (!_private.isFrequentItem(item) && item.type !== 'dateRange' && (item.viewMode !== 'extended' || item.visibility === true) && _private.isItemChanged(item)) {
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
        self._dateRangeItem = _private.getDateRangeItem(items);
        self._displayText = {...self._displayText};
    },

    isItemChanged: function(item) {
        return !isEqual(object.getPropertyValue(item, 'value'), object.getPropertyValue(item, 'resetValue'));
    },

    getLoadKeys: function(config, value) {
        let selectedKeys = value instanceof Array ? value : [value];
        return factory(selectedKeys).filter((key) => {
            if (key !== undefined && !config.items.getRecordById(key) && !(key === null && config.emptyText)) {
                return key;
            }
        }).value();
    },

    loadSelectedItems: function(items, configs) {
        let pDef = new ParallelDeferred();
        factory(items).each(function(item) {
            if (_private.isFrequentItem(item)) {
                const config = configs[item.name];
                let keys = _private.getLoadKeys(config, item.value);
                if (keys.length) {
                    let editorOpts = {source: item.editorOptions.source};
                    editorOpts.filter = config.filter || {};

                    const keyProperty = config.keyProperty;
                    editorOpts.filter[keyProperty] = keys;
                    let result = _private.loadItemsFromSource({}, editorOpts.source, editorOpts.filter).addCallback((newItems) => {
                        configs[item.name].items = getItemsWithHistory(configs[item.name].items, newItems,
                            configs[item.name]._sourceController, item.editorOptions.source, configs[item.name].keyProperty);
                    });
                    pDef.push(result);
                }
            }
        });
        return pDef.done().getResult();
    },

    loadItemsFromSource: function(instance, source, filter, navigation?, dataLoadCallback?) {
        // As the data source can be history source, then you need to merge the filter
        instance._filter = historyUtils.getSourceFilter(filter, source);
        return _private.getSourceController(instance, source, navigation).load(instance._filter).addCallback(function(items) {
            instance.items = items;
            if (dataLoadCallback) {
                dataLoadCallback(items);
            }
            return items;
        });
    },

    loadItems: function(self, item) {
        var options = item.editorOptions;

        self._configs[item.name] = CoreClone(options);
        self._configs[item.name].emptyText = item.emptyText;
        self._configs[item.name].emptyKey = item.emptyKey;

        if (options.source) {
            return _private.loadItemsFromSource(self._configs[item.name], options.source, options.filter, options.navigation, options.dataLoadCallback);
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
        factory(self._source).each(function(item) {
            if (_private.isFrequentItem(item)) {
                var result = _private.loadItems(self, item);
                pDef.push(result);
            }
        });

        // At first, we will load all the lists in order not to cause blinking of the interface and many redraws.
        return pDef.done().getResult().addCallback(function() {
            return _private.loadSelectedItems(self._source, self._configs).addCallback(() => {
                _private.updateText(self, self._source, self._configs);
                return {
                    configs: self._configs
                };
            });
        });
    },

    setValue: function(self, selectedKeys, name) {
        const item = _private.getItemByName(self._source, name);
        let value;
        if (!selectedKeys.length || (item.emptyText && selectedKeys.includes(null))) {
            value = object.getPropertyValue(item, 'resetValue');
        } else if (self._configs[name].multiSelect) {
            value = selectedKeys;
        } else {
            value = selectedKeys[0];
        }
        object.setPropertyValue(item, 'value', value);
    },

    selectItems: function(self, selectedKeys) {
        factory(selectedKeys).each(function(sKey, index) {
            if (sKey) {
                _private.setValue(self, sKey, index);
            }
        });

        _private.updateText(self, self._source, self._configs);
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
    },

    hasSelectorTemplate: function(configs) {
        let hasSelectorTemplate;
        factory(configs).each((config) => {
            if (config.selectorTemplate) {
                hasSelectorTemplate = true;
            }
        });
        return !!hasSelectorTemplate;
    },

    itemClick: function(result) {
        _private.setValue(this, result.selectedKeys, result.id);
        _private.updateText(this, this._source, this._configs);
    },

    applyClick: function(result) {
        _private.selectItems(this, result.selectedKeys);
    },

    selectorResult: function(result) {
        var curConfig = this._configs[result.id],
            curItem = _private.getItemByName(this._source, result.id),
            newItems = _private.getNewItems(this, result.data, curConfig);
        if (isHistorySource(curItem.editorOptions.source)) {
            if (newItems.length) {
                curConfig._sourceController = null;
            }
            _private.updateHistory(curConfig, factory(result.data).toArray(), curItem.editorOptions.source);
            _private.setValue(this, _private.getSelectedKeys(result.data, curConfig), result.id);
        } else {
            curConfig.items.prepend(newItems);
            _private.setValue(this, _private.getSelectedKeys(result.data, curConfig), result.id);
            _private.updateText(this, this._source, this._configs);
        }
    },

    moreButtonClick: function(result) {
        this._idOpenSelector = result.id;
        this._configs[result.id].initSelectorItems = result.selectedItems;
    },

    isNeedReload: function(oldItems, newItems) {
        let result = false;
        factory(oldItems).each((oldItem) => {
            const newItem = _private.getItemByName(newItems, oldItem.name);
           if (newItem && _private.isFrequentItem(oldItem) &&
               (!isEqual(oldItem.editorOptions.source, newItem.editorOptions.source) ||
               !isEqual(oldItem.editorOptions.filter, newItem.editorOptions.filter) ||
               !isEqual(oldItem.editorOptions.navigation, newItem.editorOptions.navigation))) {
               result = true;
           }
        });
        return result;
    },

    updateHistory: function(currentFilter, items, source) {
        if (isHistorySource(source)) {
            source.update(items, historyUtils.getMetaHistory());

            if (currentFilter._sourceController && source.getItems) {
                currentFilter.items = source.getItems();
            }
        }
    },

    isNeedHistoryReload: function(configs) {
        let needReload = false;
        factory(configs).each((config) => {
            if (!config._sourceController) {
                needReload = true;
            }
        });
        return needReload;
    }
};

var Filter = Control.extend({
    _template: template,
    _displayText: null,
    _configs: null,
    _source: null,
    _idOpenSelector: null,
    _dateRangeItem: null,

    _beforeMount: function(options, context, receivedState) {
        this._configs = {};
        this._displayText = {};

        let resultDef;

        if (receivedState) {
            this._configs = receivedState.configs;
            _private.prepareItems(this, options.source);
            _private.calculateStateSourceControllers(this._configs, this._source);
            _private.updateText(this, this._source, this._configs);
        } else if (options.source) {
            _private.prepareItems(this, options.source);
            resultDef = _private.reload(this);
        }
        this._hasSelectorTemplate = _private.hasSelectorTemplate(this._configs);
        return resultDef;
    },

    _beforeUpdate: function(newOptions) {
        if (newOptions.source && newOptions.source !== this._options.source) {
            const self = this;
            let resultDef;
            _private.prepareItems(this, newOptions.source);
            if (_private.isNeedReload(this._options.source, newOptions.source) || _private.isNeedHistoryReload(this._configs)) {
                resultDef = _private.reload(this).addCallback(() => {
                    self._hasSelectorTemplate = _private.hasSelectorTemplate(self._configs);
                });
            } else if (_private.isNeedHistoryReload(this._configs)) {
                resultDef = _private.reload(this);
            } else {
                resultDef = _private.loadSelectedItems(this._source, this._configs).addCallback(() => {
                    _private.updateText(self, self._source, self._configs);
                });
            }
            return resultDef;
        }
    },

    _openDetailPanel: function() {
        if (this._options.detailPanelTemplateName) {
            let panelItems = converterFilterItems.convertToDetailPanelItems(this._source);
            let popupOptions =  {};
            if (this._options.alignment === 'right') {
                popupOptions.targetPoint = {
                    vertical: 'top',
                    horizontal: 'right'
                };
                popupOptions.horizontalAlign = {
                    side: 'left'
                };
            }
            popupOptions.template = this._options.detailPanelTemplateName;
            popupOptions.className = 'controls-FilterButton-popup-orientation-' + (this._options.alignment === 'right' ? 'left' : 'right');
            popupOptions.templateOptions = this._options.detailPanelTemplateOptions || {};
            this._open(panelItems, popupOptions);
        } else {
            this._openPanel();
        }
    },

    _openPanel: function(event, name) {
        if (this._options.panelTemplateName) {
            let items = new RecordSet({
                rawData: _private.setPopupConfig(this, this._configs, this._source)
            });
            let popupOptions = {
                template: this._options.panelTemplateName,
                actionOnScroll: 'close',
                className: 'controls-FilterView-SimplePanel-popup'
            };
            if (name) {
                popupOptions.target = this._children[name];
            }
            popupOptions.templateOptions = this._options.panelTemplateOptions || {};
            this._open(items, popupOptions);
        }
    },

    _open: function(items, panelPopupOptions) {
        if (this._options.readOnly) {
            return;
        }
        var popupOptions = {
            templateOptions: {
                items: items,
                historyId: this._options.historyId,
                theme: this._options.theme
            },
            target: this._container[0] || this._container
        };
        this._children.StickyOpener.open(Merge(popupOptions, panelPopupOptions), this);
    },

    _rangeChangedHandler: function(event, start, end) {
        let dateRangeItem = _private.getDateRangeItem(this._source);
        dateRangeItem.value = [start, end];
        dateRangeItem.textValue = getFormattedDateRange(start, end);
        _private.notifyChanges(this, this._source);
        this._dateRangeItem = object.clone(dateRangeItem);
    },

    _resultHandler: function(event, result) {
        if (!result.action) {
            var filterSource = converterFilterItems.convertToFilterSource(result.items);
            _private.prepareItems(this, filterSource);
            _private.updateText(this, this._source, this._configs);
        } else {
            _private[result.action].call(this, result);
        }
        if (result.action !== 'moreButtonClick') {
            _private.notifyChanges(this, this._source);
            this._children.StickyOpener.close();
        }
    },

    _onSelectorTemplateResult: function(event, items) {
        let resultSelectedItems = this._notify('selectorCallback', [this._configs[this._idOpenSelector].initSelectorItems, items, this._idOpenSelector]) || items;
        this._resultHandler(event, {action: 'selectorResult', id: this._idOpenSelector, data: resultSelectedItems});
        this._children.StickyOpener.close();
    },

    _isFastReseted: function() {
        var isReseted = true;
        factory(this._source).each(function(item) {
            if (_private.isFrequentItem(item) && _private.isItemChanged(item)) {
                isReseted = false;
            }
        });
        return isReseted;
    },

    _reset: function(event, item) {
        if (this._children.StickyOpener.isOpened()) {
            this._children.StickyOpener.close();
        }
        var newValue = object.getPropertyValue(item, 'resetValue');
        object.setPropertyValue(item, 'value', newValue);
        _private.notifyChanges(this, this._source);
        _private.updateText(this, this._source, this._configs);
    },

    _resetFilterText: function() {
        if (this._children.StickyOpener.isOpened()) {
            this._children.StickyOpener.close();
        }
        factory(this._source).each(function(item) {
            // Fast filters could not be reset from the filter button.
            if (!_private.isFrequentItem(item) && item.type !== 'dateRange') {
                item.value = item.resetValue;
                if (object.getPropertyValue(item, 'visibility') !== undefined) {
                    object.setPropertyValue(item, 'visibility', false);
                }
            }
        });
        _private.notifyChanges(this, this._source);
        _private.updateText(this, this._source, this._configs);
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
