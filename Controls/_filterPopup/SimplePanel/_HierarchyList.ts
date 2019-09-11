import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/HierarchyList');
import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';
import emptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import clone = require('Core/core-clone');
import {DropdownViewModel} from 'Controls/dropdownPopup';
import hierarchyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate');
import * as defaultItemTemplate from "wml!*";

var _private = {

    getFolders: function(items, nodeProperty) {
        return factory(items).filter((item) => { return item.get(nodeProperty); }).value();
    },

    getItemsByFolder: function(items, folderId, parentProperty) {
        return factory(items).filter((item) => {
           return item.get(parentProperty) === folderId;
        }).value();
    },

    getViewModelSelectedKeys: function(selectedKeys, emptyKey) {
        let result = [];
        factory(selectedKeys).each((key) => {
           if (!key.includes(emptyKey)) {
               result = result.concat(key);
           }
        });
        return result;
    },

    isFolderClick: function(folders, key, keyProperty) {
        return folders.find((folder) => {
            return key === folder.get(keyProperty);
        });
    },

    deleteSelectedFolders: function(self, keyProperty) {
        self._folders.forEach((folder) => {
            self._selectedKeys = self._selectedKeys.map((keys) => {
                if (keys.includes(folder.get(keyProperty))) {
                    return [];
                }
                return keys;
            });
        });
    },

    getSelectedKeys: function(selectedKeys, folders, emptyKey) {
        let clonedKeys = clone(selectedKeys);
        factory(folders).each((folder, index) => {
            if (clonedKeys[index] === undefined || clonedKeys[index] === emptyKey) {
                clonedKeys[index] = [];
            }
        });
        return clonedKeys;
    },

    getNodeItems: function(folders, {items, keyProperty, parentProperty}) {
        let nodeItems = [];
        factory(folders).each((folder) => {
            const records = new RecordSet({
                idProperty: keyProperty,
                adapter: items.getAdapter()
            });
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
    _emptyItemTemplate: emptyItemTemplate,

    _beforeMount: function(options) {
        this._folders = _private.getFolders(options.items, options.nodeProperty);
        this._selectedKeys = _private.getSelectedKeys(options.selectedKeys, this._folders, options.emptyKey);
        this._nodeItems = _private.getNodeItems(this._folders, options);

        this._listModel = new DropdownViewModel({
            items: options.items,
            selectedKeys: _private.getViewModelSelectedKeys(this._selectedKeys, options.emptyKey),
            keyProperty: options.keyProperty,
            itemTemplateProperty: options.itemTemplateProperty,
            displayProperty: options.displayProperty,
            emptyText: options.emptyText,
            emptyKey: options.emptyKey
        });
    },

    _hasMoreButton: function(folder) {
        return this._options.sourceController.hasMoreData('down', folder.get(this._options.keyProperty));
    },

    _itemClickHandler: function(event, index, key) {
        if (_private.getViewModelSelectedKeys(this._selectedKeys, this._options.emptyKey).length) {
            this._checkBoxClickHandler(event, index, key);
        } else {
            this._selectedKeys[index] = key;
            this._notify('itemClick', [this._selectedKeys]);
        }
    },

    _emptyItemClickHandler: function() {
        this._selectedKeys = [this._options.emptyKey];
        this._notify('itemClick', [this._selectedKeys]);
    },

    _checkBoxClickHandler: function(event, index, keys) {
        let setKeys = () => {
            if (keys === undefined) {
                this._selectedKeys[index] = [];
            } else {
                this._selectedKeys[index] = keys;
            }
        };

        if (_private.isFolderClick(this._folders, keys[0], this._options.keyProperty)) {
            _private.deleteSelectedFolders(this, this._options.keyProperty);
            setKeys();
            this._notify('itemClick', [this._selectedKeys]);
        } else {
            const currentFolderKey = this._folders[index].get(this._options.keyProperty);
            if (this._selectedKeys[index].includes(currentFolderKey) && keys.length > 1) {
                keys.splice(keys.indexOf(currentFolderKey), 1);
            }
            setKeys();
            this._notify('checkBoxClick', [this._selectedKeys]);
        }
        this._listModel.setSelectedKeys(_private.getViewModelSelectedKeys(this._selectedKeys, this._options.emptyKey));
    },

    _moreButtonClick: function() {
        this._notify('moreButtonClick');
    }
});

HierarchyList.getDefaultOptions = (): object => {
    return {
        itemTemplate: hierarchyItemTemplate
    };
};

HierarchyList._theme = ['Controls/filterPopup'];

HierarchyList._private = _private;

export = HierarchyList;
