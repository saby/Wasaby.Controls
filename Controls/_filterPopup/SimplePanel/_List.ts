import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/SimplePanel/_List/List');
import {ItemTemplate as defaultItemTemplate} from 'Controls/dropdown';
import emptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import {isEqual} from 'Types/object';
import {DropdownViewModel} from 'Controls/dropdownPopup';

var _private = {
    isNeedUpdateSelectedKeys: function(self, target, item) {
        var clickOnEmptyItem = item.get(self._options.keyProperty) === self._options.emptyKey,
            clickOnCheckBox = target.closest('.controls-DropdownList__row-checkbox'),
            clickOnFolder = item.get(self._options.nodeProperty);
        return self._options.multiSelect && !clickOnEmptyItem && (clickOnCheckBox || self._selectionChanged) && !clickOnFolder;
    },

    updateSelection: function(listModel, item, resetValue) {
        let updatedSelectedKeys = [...listModel.getSelectedKeys()];
        if (updatedSelectedKeys.includes(item.getId())) {
            var index = updatedSelectedKeys.indexOf(item.getId());
            updatedSelectedKeys.splice(index, 1);

            if (!updatedSelectedKeys.length) {
                updatedSelectedKeys = [];
            }
        } else {
            if (isEqual(updatedSelectedKeys, resetValue)) {
                updatedSelectedKeys = [];
            }
            updatedSelectedKeys.push(item.getId());
        }
        listModel.setSelectedKeys(updatedSelectedKeys);
    },

    afterOpenDialogCallback: function(selectedItems) {
        this._notify('moreButtonClick', [selectedItems]);
    }
};

var List = Control.extend({
    _template: template,
    _items: null,
    _defaultItemTemplate: defaultItemTemplate,
    _emptyItemTemplate: emptyItemTemplate,
    _selectionChanged: false,

    _beforeMount: function(options) {
        this._listModel = new DropdownViewModel({
            items: options.items || [],
            selectedKeys: options.selectedKeys,
            keyProperty: options.keyProperty,
            itemTemplateProperty: options.itemTemplateProperty,
            displayProperty: options.displayProperty,
            emptyText: options.emptyText,
            emptyKey: options.emptyKey,
            hasApplyButton: options.hasApplyButton,
            hasClose: true
        });

        this._afterOpenDialogCallback = _private.afterOpenDialogCallback.bind(this);
    },

    _beforeUpdate: function(newOptions) {
        if (newOptions.items && newOptions.items !== this._options.items) {
            this._listModel.setItems(newOptions);
        }
        if (newOptions.selectedKeys !== this._options.selectedKeys) {
            this._listModel.setSelectedKeys(newOptions.selectedKeys);
        }

        if (newOptions.selectionChanged !== this._options.selectionChanged) {
            this._selectionChanged = newOptions.selectionChanged;
        }
    },

    _itemClickHandler: function(event, item) {
        if (_private.isNeedUpdateSelectedKeys(this, event.target, item)) {
            this._selectionChanged = true;
            _private.updateSelection(this._listModel, item, this._options.resetValue);
            let selectedKeys = this._listModel.getSelectedKeys().slice().sort();
            this._notify('checkBoxClick', [selectedKeys]);
        } else {
            this._notify('itemClick', [[item.get(this._options.keyProperty)]]);
        }
    },

    _onItemSwipe: function(event, itemData) {
        if (event.nativeEvent.direction === 'left') {
            this._listModel.setSwipeItem(itemData);
        }
    },

    _itemMouseEnter: function() {
        // Заглушка для обработчика на шаблоне dropdownPopup:For
    }
});

List._theme = ['Controls/filterPopup'];

List._private = _private;

export = List;
