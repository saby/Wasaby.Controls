import Control = require('Core/Control');
import template = require('wml!Controls/_filter/View/View');

import {isEqual} from 'Types/object';
import CoreClone = require('Core/core-clone');
import Merge = require('Core/core-merge');
import ParallelDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import {Controller as SourceController} from 'Controls/source';
import {dropdownHistoryUtils as historyUtils} from 'Controls/dropdown';
import converterFilterItems = require('Controls/_filter/converterFilterItems');
import {object} from 'Types/util';
import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';

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

const DELAY_OPEN = 100;

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
        self._source = object.clone(items);
    },

    calculateStateSourceControllers: function(configs, source) {
        factory(source).each(function(item) {
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

    getDateRangeItem: function(items) {
        let dateRangeItem;
        factory(items).each((item) => {
           if (item.editorName === 'dateRange') {
               dateRangeItem = item;
           }
        });
        return dateRangeItem;
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
            if (item.viewMode !== 'frequent' && (item.viewMode !== 'extended' || item.visibility === true) && _private.isItemChanged(item)) {
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
        factory(self._source).each(function(item) {
            if (item.editorOptions) {
                var result = _private.loadItems(self, item);
                pDef.push(result);
            }
        });

        // At first, we will load all the lists in order not to cause blinking of the interface and many redraws.
        return pDef.done().getResult().addCallback(function() {
            _private.updateText(self, self._source, self._configs);
            return {
                configs: self._configs
            };
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
            newItems = _private.getNewItems(this, result.data, curConfig);
        curConfig.items.prepend(newItems);
        _private.setValue(this, _private.getSelectedKeys(result.data, curConfig), result.id);
        _private.updateText(this, this._source, this._configs);
    },

    moreButtonClick: function(result) {
        this._idOpenSelector = result.id;
    }
};

var Filter = Control.extend({
    _template: template,
    _displayText: null,
    _configs: null,
    _source: null,
    _idOpenSelector: null,
    _delayOpenTimeout: null,
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
            _private.prepareItems(this, newOptions.source);
            return _private.reload(this).addCallback(function() {
                self._hasSelectorTemplate = _private.hasSelectorTemplate(self._configs);
            });
        }
    },

    _startTimer: function(event, item) {
        if (!this._delayOpenTimeout) {
            this._delayOpenTimeout = setTimeout(function () {
                this._openPanel(event, item);
            }.bind(this), DELAY_OPEN);
        }
    },

    _restartTimer: function(event, item) {
        this._resetTimer();
        this._startTimer(event, item);
    },

    _resetTimer: function() {
        clearTimeout(this._delayOpenTimeout);
        this._delayOpenTimeout = null;
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
            this._open(panelItems, popupOptions);
        } else {
            this._openPanel();
        }
    },

    _openPanel: function(event, fastItem) {
        if (this._options.panelTemplateName) {
            let items = new RecordSet({
                rawData: _private.setPopupConfig(this, this._configs, this._source)
            });
            let popupOptions = {
                template: this._options.panelTemplateName,
                actionOnScroll: 'close',
                className: 'controls-FilterView-SimplePanel-popup'
            };
            if (fastItem) {
                popupOptions.target = this._children[fastItem.name];
            }
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
                theme: this._options.theme
            },
            _vdomOnOldPage: true,
            target: this._container[0] || this._container
        };
        this._children.DropdownOpener.open(Merge(popupOptions, panelPopupOptions), this);
    },

    _rangeChangedHandler: function(event, start, end) {
        _private.getDateRangeItem(this._source).value = [start, end];
        _private.notifyChanges(this, this._source);
        this._dateRangeItem = object.clone(_private.getDateRangeItem(this._source));
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
            this._children.DropdownOpener.close();
        }
    },

    _onSelectorTemplateResult: function(event, items) {
        this._resultHandler(event, {action: 'selectorResult', id: this._idOpenSelector, data: items});
    },

    _isFastReseted: function() {
        var isReseted = true;
        factory(this._source).each(function(item) {
            if (item.viewMode === 'frequent' && _private.isItemChanged(item)) {
                isReseted = false;
            }
        });
        return isReseted;
    },

    _reset: function(event, item) {
        if (this._children.DropdownOpener.isOpened()) {
            this._children.DropdownOpener.close();
        }
        var newValue = object.getPropertyValue(item, 'resetValue');
        object.setPropertyValue(item, 'value', newValue);
        _private.notifyChanges(this, this._source);
        _private.updateText(this, this._source, this._configs);
    },

    _resetFilterText: function() {
        if (this._children.DropdownOpener.isOpened()) {
            this._children.DropdownOpener.close();
        }
        factory(this._source).each(function(item) {
            // Fast filters could not be reset from the filter button.
            if (item.viewMode !== 'frequent') {
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
