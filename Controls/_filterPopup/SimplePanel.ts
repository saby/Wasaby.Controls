import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/SimplePanel/SimplePanel');

import {factory} from 'Types/chain'
import isEqual = require('Core/helpers/Object/isEqual');
import coreMerge = require('Core/core-merge');
import CoreClone = require('Core/core-clone');

/**
 * Control dropdown list for filter:View (@link {@link Controls/_filter/Button/View}.
 *
 * @class Controls/_filterPopup/SimplePanel
 * @extends Core/Control
 * @mixes Controls/_filterPopup/SimplePanel/SimplePanelStyles
 * @control
 * @public
 * @author Золотова Э.Е.
 *
 */

var _private = {
    getItems: function(self, initItems) {
        var items = [];
        factory(initItems).each(function(item, index) {
            var curItem = item.getRawData();
            curItem.initSelectedKeys = self._items ? self._items[index].initSelectedKeys : CoreClone(item.get('selectedKeys'));
            items.push(curItem);
        });
        return items;
    },

    isEqualKeys: function(oldKeys, newKeys) {
        if (oldKeys[0] === null && !newKeys.length) {
            return false;
        }
        return isEqual(newKeys, oldKeys);
    },

    needShowApplyButton: function(items) {
        var isNeedShowApplyButton = false;
        factory(items).each(function(item) {
            if (!_private.isEqualKeys(item.initSelectedKeys, item.selectedKeys)) {
                isNeedShowApplyButton = true;
            }
        });
        return isNeedShowApplyButton;
    },

    getResult: function(self, event, action) {
        var result = {
            action: action,
            event: event,
            selectedKeys: {}
        };
        factory(self._items).each(function(item) {
            result.selectedKeys[item.id] = item.selectedKeys;
        });
        return result;
    }
};

var Panel = Control.extend({
    _template: template,
    _items: null,

    _beforeMount: function(options) {
        this._items = _private.getItems(this, options.items);
    },

    _beforeUpdate: function(newOptions) {
        var itemsChanged = newOptions.items !== this._options.items;
        if (itemsChanged) {
            this._items = _private.getItems(this, newOptions.items);
            this._needShowApplyButton = _private.needShowApplyButton(this._items);
        }
    },

    _itemClickHandler: function(event, item, keys) {
        var result = {
            action: 'itemClick',
            event: event,
            selectedKeys: keys,
            id: item.id
        };
        this._notify('sendResult', [result]);
    },

    _checkBoxClickHandler: function(event, index, keys) {
        this._items[index].selectedKeys = keys;
        this._needShowApplyButton = _private.needShowApplyButton(this._items);
        this._notify('selectedKeysChangedIntent', [index, keys]);
    },

    _closeClick: function() {
        this._notify('close');
    },

    _applySelection: function(event) {
        var result = _private.getResult(this, event, 'applyClick');
        this._notify('sendResult', [result]);
    },

    _selectorResultHandler: function(event, item, result) {
        result.id = item.id;
        this._notify('sendResult', [result]);
    }
});

Panel._theme = ['Controls/filterPopup', 'Controls/dropdownPopup'];

Panel._private = _private;

export = Panel;
