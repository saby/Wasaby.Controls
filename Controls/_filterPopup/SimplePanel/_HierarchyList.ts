import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/HierarchyList');
import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';
import emptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import clone = require('Core/core-clone');
import {DropdownViewModel} from 'Controls/dropdownPopup';
import {ItemTemplate as defaultItemTemplate} from 'Controls/dropdown';

var _private = {

    getFolders: function(items, nodeProperty) {
        return factory(items).filter((item) => { return item.get(nodeProperty); }).value();
    },

    getItemsByFolder: function(items, folderId, parentProperty) {
        return factory(items).filter((item) => {
           return item.get(parentProperty) === folderId;
        }).value();
    },

    getViewModelSelectedKeys: function(selectedKeys) {
        let result = [];
        factory(selectedKeys).each((key) => {
           if (!key.includes(null)) {
               result = result.concat(key);
           }
        });
        return result;
    },

    afterOpenDialogCallback: function(selectedItems) {
        this._notify('moreButtonClick', [selectedItems]);
    },

    getSelectedKeys: function(selectedKeys, folders) {
        let clonedKeys = clone(selectedKeys);
        factory(folders).each((folder, index) => {
            if (!clonedKeys[index]) {
                clonedKeys[index] = [];
            }
        });
        return clonedKeys;
    },

    getNodeItems: function(folders, {items, keyProperty, parentProperty}) {
        let nodeItems = [];
        factory(folders).each((folder) => {
            const records = new RecordSet({idProperty: keyProperty});
            records.add(folder);
            records.append(_private.getItemsByFolder(items, folder.get(keyProperty), parentProperty));
            nodeItems.push(records);
        });
        return nodeItems;
    }
};

var HierarchyList = Control.extend({
    _template: template,
    _folders: null,
    _selectedKeys: null,
    _defaultItemTemplate: defaultItemTemplate,
    _emptyItemTemplate: emptyItemTemplate,

    _beforeMount: function(options) {
        this._folders = _private.getFolders(options.items, options.nodeProperty);
        this._selectedKeys = _private.getSelectedKeys(options.selectedKeys, this._folders);
        this._nodeItems = _private.getNodeItems(this._folders, options);

        this._listModel = new DropdownViewModel({
            items: options.items,
            selectedKeys: _private.getViewModelSelectedKeys(this._selectedKeys),
            keyProperty: options.keyProperty,
            itemTemplateProperty: options.itemTemplateProperty,
            displayProperty: options.displayProperty,
            emptyText: options.emptyText
        });

        this._afterOpenDialogCallback = _private.afterOpenDialogCallback.bind(this);
    },

    _hasMoreButton: function(folder) {
        return this._options.sourceController.hasMoreData('down', folder.get(this._options.keyProperty));
    },

    _itemClickHandler: function(event, index, key) {
        if (_private.getViewModelSelectedKeys(this._selectedKeys).length) {
            this._checkBoxClickHandler(event, index, key);
        } else {
            this._selectedKeys[index] = key;
            this._notify('itemClick', [this._selectedKeys]);
        }
    },

    _emptyItemClickHandler: function() {
        this._selectedKeys = this._options.resetValue;
        this._notify('itemClick', [this._selectedKeys]);
    },

    _checkBoxClickHandler: function(event, index, keys) {
        if (keys === undefined) {
            this._selectedKeys[index] = [];
        } else {
            this._selectedKeys[index] = keys;
        }
        this._listModel.setSelectedKeys(_private.getViewModelSelectedKeys(this._selectedKeys));
        this._notify('checkBoxClick', [this._selectedKeys]);
    },

    _moreButtonClick: function() {
        this._notify('moreButtonClick');
    }
});

HierarchyList._theme = ['Controls/filterPopup'];

HierarchyList._private = _private;

export = HierarchyList;
