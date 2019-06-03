import {Control, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_toggle/CheckboxGroup/CheckboxGroup');
import groupTemplate = require('wml!Controls/_toggle/CheckboxGroup/GroupTemplate');
import 'css!theme?Controls/_toggle/CheckboxGroup/CheckboxGroup';
import {Controller as SourceController} from "../source";
import isEqual from 'Types/_object/isEqual';

class CheckboxGroup extends Control<IControlOptions> {
    protected _template: Function = template;
    protected _groupTemplate: Function = groupTemplate;
    protected _items: any;
    protected _sourceController: any;
    protected _selectedKeys: number[]|string[];
    protected _triStateKeys: number[]|string[];
    protected _groups: object;

    protected _beforeMount(options, context, receivedState) {
        this._isSelected = this._isSelected.bind(this);
        if (receivedState) {
            this._items = receivedState;
        } else {
            this._initItems(options.source);
        }
    }

    protected _beforeUpdate(newOptions) {
        var self = this;
        if (newOptions.source && newOptions.source !== this._options.source) {
            return this._initItems(newOptions.source).addCallback(function(items) {
                self._forceUpdate();
            });
        }
        if (newOptions.selectedKeys && !isEqual(this._selectedKeys, newOptions.selectedKeys)) {
            this._prepareSelected(newOptions);
        }
    }

    private _initItems(source) {
        let self = this;
        self._sourceController = new SourceController({
            source: source
        });
        return self._sourceController.load().addCallback(function(items) {
            self._items = items;
            self.sortGroup(self, items);
            if (self._options.parentProperty) {
                self._prepareSelected(self._options);
            }
            return items;
        });
    }

    private sortGroup(self, items) {
        self._groups = {};
        items.each((item) => {
            let parentProperty = self._options.parentProperty;
            let parent = parentProperty ? item.get(parentProperty) : null;
            if (!self._groups[parent]) {
                self._groups[parent] = [];
            }
            self._groups[parent].push(item);
        });
    }

    private _prepareSelected(options) {
        this._selectedKeys = options.selectedKeys ? [...options.selectedKeys] : [];
        this._triStateKeys = [];
        if (this._options.parentProperty) {
            this._items.each((item) => {
                this._setItemsSelection(item);
            });
            if (!isEqual(this._selectedKeys, options.selectedKeys || [])) {
                this._notifySelectedKeys();
            }
        }
    }

    private _isSelected(item) {
        if (this._selectedKeys.indexOf(this._getItemKey(item)) > -1) {
            return true;
        }
        if (this._triStateKeys.indexOf(this._getItemKey(item)) > -1) {
            return null;
        }
        return false;
    }

    private _addKey(key) {
        this._removeTriStateKey(key);
        if (this._selectedKeys.indexOf(key) < 0) {
            this._selectedKeys.push(key);
            this._updateItemChildSelection(key, true);
        }
    }

    private _addTriStateKey(key) {
        if (this._triStateKeys.indexOf(key) < 0) {
            this._triStateKeys.push(key);
        }
    }
    private _removeTriStateKey(key) {
        let index = this._triStateKeys.indexOf(key);
        if (index > -1) {
            this._triStateKeys.splice(index, 1);
        }
    }

    private _removeKey(key) {
        this._removeTriStateKey(key);
        let index = this._selectedKeys.indexOf(key);
        if (index > -1) {
            this._selectedKeys.splice(index, 1);
        }
    }

    private _updateItemChildSelection(itemKey, value) {
        let child = this._groups[itemKey];
        if (child) {
            child.map((childItem) => {
                let childKey = childItem.get(this._options.keyProperty);
                if (value) {
                    this._addKey(childKey);
                } else {
                    this._removeKey(childKey);
                    this._updateItemChildSelection(childKey, false);
                }
            });
        }
        let item = this._items.getRecordById(itemKey);
        let parentId = item.get(this._options.parentProperty);
        if (parentId) {
            let parent = this._items.getRecordById(parentId);
            this._removeKey(parentId);
            this._setItemsSelection(parent);

        }
    }

    private _setItemsSelection(item) {
        let itemKey = this._getItemKey(item);
        let isItemInSelectedKeys = this._selectedKeys.indexOf(itemKey) > -1;
        if (isItemInSelectedKeys) {
            return true;
        }
        let parentId = item.get(this._options.parentProperty);
        if (parentId) {
            let parent = this._items.getRecordById(parentId);
            let isParentSelected = this._selectedKeys.indexOf(this._getItemKey(parent)) > -1;
            if (isParentSelected) {
                this._addKey(itemKey);
                return true;
            }
        }

        if (item.get(this._options.nodeProperty)) {
            let hasSelectedChild = null;
            let hasUnselectedChild = null;
            let child = this._groups[this._getItemKey(item)];
            child.map((childItem) => {
                if (this._setItemsSelection(childItem)) {
                    hasSelectedChild = true;
                } else {
                    hasUnselectedChild = true;
                }
            });
            if (hasSelectedChild && hasUnselectedChild === null) {
                this._addKey(itemKey);
                if (parentId) {
                    let parent = this._items.getRecordById(parentId);
                    this._setItemsSelection(parent);
                }
                return true;
            }
            if (hasSelectedChild && hasUnselectedChild) {
                this._addTriStateKey(itemKey);
                return null;
            }
        }
        return false;
    }

    private _getItemKey(item) {
        return item.get(this._options.keyProperty);
    }

    private _valueChangedHandler(e, item, value) {
        let key = this._getItemKey(item);
        if (value) {
            this._addKey(key);
        } else {
            this._removeKey(key);
            this._updateItemChildSelection(key, false);
        }
        this._notifySelectedKeys();
    }

    private _notifySelectedKeys() {
        this._notify('selectedKeysChanged', [this._selectedKeys]);
    }

    static getDefaultOptions(): object {
        return {
        };
    }
    static getOptionTypes(): object {
        return {
        };
    }
}

export default CheckboxGroup;

