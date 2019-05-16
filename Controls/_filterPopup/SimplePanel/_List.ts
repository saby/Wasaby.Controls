import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/SimplePanel/_List/List');
import defaultItemTemplate = require('wml!Controls/_dropdown/itemTemplate');
import emptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');

import DropdownViewModel = require('Controls/_dropdownPopup/DropdownViewModel');

var _private = {
    isNeedUpdateSelectedKeys: function(self, target, item,) {
        var clickOnEmptyItem = item.get(self._options.keyProperty) === null,
            clickOnCheckBox = target.closest('.controls-DropdownList__row-checkbox'),
            hasSelection = self._listModel.getSelectedKeys().length && self._listModel.getSelectedKeys()[0] !== null;
        return self._options.multiSelect && !clickOnEmptyItem && (hasSelection || clickOnCheckBox);
    }
};

var List = Control.extend({
    _template: template,
    _items: null,
    _defaultItemTemplate: defaultItemTemplate,
    _emptyItemTemplate: emptyItemTemplate,

    _beforeMount: function(options) {
        this._listModel = new DropdownViewModel({
            items: options.items || [],
            selectedKeys: options.selectedKeys,
            keyProperty: options.keyProperty,
            itemTemplateProperty: options.itemTemplateProperty,
            displayProperty: options.displayProperty,
            emptyText: options.emptyText
        });
    },

    _beforeUpdate: function(newOptions) {
        if (newOptions.items && newOptions.items !== this._options.items) {
            this._listModel.setItems(newOptions);
        }
        if (newOptions.selectedKeys !== this._options.selectedKeys) {
            this._listModel.setSelectedKeys(newOptions.selectedKeys);
        }
    },

    _itemClickHandler: function(event, item) {
        if (_private.isNeedUpdateSelectedKeys(this, event.target, item)) {
            this._listModel.updateSelection(item);
            this._notify('checkBoxClick', [this._listModel.getSelectedKeys()]);
        } else {
            this._notify('itemClick', [[item.get(this._options.keyProperty)]]);
        }
    },

    _selectorDialogResult: function(event, result) {
        this._notify('selectorResult', [result]);
    },

    _itemMouseEnter: function() {
        // Заглушка для обработчика на шаблоне dropdownPopup:For
    }
});

List._theme = ['Controls/filterPopup'];

List._private = _private;

export = List;
