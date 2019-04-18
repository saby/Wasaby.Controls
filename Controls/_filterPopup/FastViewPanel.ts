import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/FastViewPanel/FastViewPanel');

import {factory} from 'Types/chain'
import isEqual = require('Core/helpers/Object/isEqual');
import coreMerge = require('Core/core-merge');
import CoreClone = require('Core/core-clone');

var _private = {
    isEqualKeys: function(oldKeys, newKeys) {
        if (oldKeys[0] === null && !newKeys.length) {
            return false;
        }
        return !isEqual(newKeys, oldKeys);
    },

    needShowApplyButton: function(items) {
        var isNeedShowApplyButton = false;
        items.forEach(function(item) {
            if (_private.isEqualKeys(item.initSelectedKeys, item.selectedKeys)) {
                isNeedShowApplyButton = true;
            }
        });
        return isNeedShowApplyButton;
    },

    getResult: function(self, event, action) {
        var result = {
            action: action,
            event: event,
            selectedKeys: []
        };
        factory(self._items).each(function(item, index) {
            result.selectedKeys[index] = item.selectedKeys;
        });
        return result;
    },

    isNeedUpdateSelectedKeys: function(self, target, item, index) {
        var clickOnEmptyItem = item.get(self._items[index].keyProperty) === null,
            clickOnCheckBox = target.closest('.controls-DropdownList__row-checkbox'),
            hasSelection = self._items[index].listModel.getSelectedKeys().length && self._items[index].listModel.getSelectedKeys()[0] !== null;
        return self._items[index].multiSelect && !clickOnEmptyItem && (hasSelection || clickOnCheckBox);
    }
};

var Panel = Control.extend({
    _template: template,
    _items: null,

    _beforeMount: function(options) {
        var self = this;
        this._items = [];
        options.items.forEach(function(item) {
            var currentItems = item.getRawData();
            currentItems.initSelectedKeys = CoreClone(item.get('selectedKeys'));
            self._items.push(currentItems);
        });
    },

    _beforeUpdate: function(newOptions) {
        var itemsChanged = newOptions.items !== this._options.items;
    },

    _itemClickHandler: function(event, index, keys) {
        var result = {
            action: 'itemClick',
            event: event,
            selectedKeys: keys,
            index: index
        };
        this._notify('sendResult', [result]);
    },

    _checkBoxClickHandler: function(event, index, keys) {
        this._items[index].selectedKeys = keys;
        this._needShowApplyButton = _private.needShowApplyButton(this._items);
    },

    _closeClick: function() {
        this._notify('close');
    },

    _applySelection: function(event) {
        var result = _private.getResult(this, event, 'applyClick');
        this._notify('sendResult', [result]);
    },

    _selectorResultHandler: function(event, index, result) {
        result.index = index;
        this._notify('sendResult', [result]);
    }
});

Panel._theme = ['Controls/_filterPopup/FastViewPanel/FastViewPanel', 'Controls/_dropdownPopup/DropdownList'];

Panel._private = _private;

export = Panel;
