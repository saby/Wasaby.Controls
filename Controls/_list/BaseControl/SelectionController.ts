import Control = require('Core/Control');
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import collection = require('Types/collection');
import {isEqual} from 'Types/object';
import { ListViewModel } from 'Controls/list';
import { Collection, SelectionController as Selection } from "Controls/display";
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';
import {ISelectionStrategy, FlatSelectionStrategy, TreeSelectionStrategy} from 'Controls/operations';
import { relation } from 'Types/entity';
import cInstance = require('Core/core-instance');

/**
 * @class Controls/_list/BaseControl/SelectionController
 * @extends Core/Control
 * @control
 * @author Авраменко А.С.
 * @private
 */

type TChangeSelectionType = 'selectAll'|'unselectAll'|'toggleAll';

export interface ISelectionControllerOptions {
    listModel: Collection|ListViewModel;
    keyProperty: string;
    selectedKeys?: TKeys;
    excludedKeys?: TKeys;
    filter: object;
    root: object;
}

export class SelectionController {
    private _resetSelection: boolean = false;
    private _model: Collection|ListViewModel;
    private _keyProperty: string;
    private _selectedKeys: TKeys = [];
    private _excludedKeys: TKeys = [];
    private _limit: number = 0;
    private _multiselection: ISelectionStrategy;
    private _filter: object;
    private _root: object;

    constructor(options: ISelectionControllerOptions) {
        this._model = options.listModel;
        this._keyProperty = options.keyProperty;
        this._selectedKeys = options.selectedKeys.slice();
        this._excludedKeys = options.excludedKeys.slice();

        this._multiselection = this._getMultiselection(options);
        this._updateSelectionForRender();
        // TODO
        // this._notify('register', ['selectedTypeChanged', this, _private.selectedTypeChangedHandler], {bubbling: true});
        this._notifySelectedCountChangedEvent(options.selectedKeys, options.excludedKeys);

        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._model.getItems().subscribe('onCollectionChange', this._onCollectionChange);
    }

    toggleItem(key: string, status: boolean): void {
        let selection;
        if (status === true || status === null) {
            selection = this._multiselection.unSelect(this._getSelection(), [key], this._model);
        } else {
            selection = this._multiselection.select(this._getSelection(), [key], this._model);
        }
        this._notifyAndUpdateSelection(selection);
    }

    update(options: ISelectionControllerOptions): void {
        const itemsChanged = options.listModel.getItems() !== this._model.getItems();
        const modelChanged = options.listModel !== this._model;
        const selectionChanged = this._isSelectionChanged(options.selectedKeys, options.excludedKeys);

        if (this._keyProperty !== options.keyProperty) {
            this._keyProperty = options.keyProperty;
        }

        if (modelChanged) {
            this._model = options.listModel;
        }

        if (itemsChanged) {
            this._model.getItems().unsubscribe('onCollectionChange', this._onCollectionChange);
            options.listModel.getItems().subscribe('onCollectionChange', this._onCollectionChange);
        }

        if (this._shouldResetSelection(options.filter, options.root)) {
            this._resetSelection = true;
        } else if (selectionChanged) {
            this._selectedKeys = options.selectedKeys;
            this._excludedKeys = options.excludedKeys;
            this._notifyAndUpdateSelection(this._getSelection());
        } else if (itemsChanged || modelChanged) {
            this._updateSelectionForRender();
        }
    }

    clear(): void {
        this._clearSelection();
        // this._notify('listSelectedKeysCountChanged', [0], {bubbling: true});
        this._multiselection = null;
        this._model.getItems().unsubscribe('onCollectionChange', this._onCollectionChange);
        this._onCollectionChange = null;
        // this._notify('unregister', ['selectedTypeChanged', this], {bubbling: true});
    }

    private _getMultiselection(options: any): ISelectionStrategy {
        if (options.parentProperty) {
            return new TreeSelectionStrategy({
                nodesSourceControllers: options.nodesSourceControllers,
                selectDescendants: options.selectDescendants,
                selectAncestors: options.selectAncestors,
                hierarchyRelation: new relation.Hierarchy({
                    keyProperty: options.keyProperty || 'id',
                    parentProperty: options.parentProperty || 'Раздел',
                    nodeProperty: options.nodeProperty || 'Раздел@',
                    declaredChildrenProperty: options.hasChildrenProperty || 'Раздел$'
                })
            });
        } else {
            return new FlatSelectionStrategy();
        }
    }

    private _clearSelection(): void {
        this._selectedKeys = [];
        this._excludedKeys = [];

        if (this._model.getCount()) {
            this._updateSelectionForRender();
        }
    }

    private _updateSelection(selection: ISelection): void {
        this._selectedKeys = selection.selected;
        this._excludedKeys = selection.excluded;
    }

    private _remove(keys: TKeys): void {
        this._excludedKeys = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
        this._selectedKeys = ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
    }

    private _getSelection(): ISelection {
        return {
            selected: this._selectedKeys,
            excluded: this._excludedKeys
        };
    }

    private _getRoot(): object|null {
        return this._model.getRoot && this._model.getRoot()
           ? this._model.getRoot().getContents()
           : null;
    }

    private _getCount(selection?: ISelection): number|null {
        return this._multiselection.getCount(selection || this._getSelection(), this._model, this._limit);
    }

    private _getItemsKeys(items: TKeys): TKeys {
        const keys = [];
        items.forEach((item) => {
            keys.push(item.getId());
        });
        return keys;
    }

    private _getSelectionForModel(): Map<TKey, boolean> {
        return this._multiselection.getSelectionForModel(this._getSelection(), this._model, this._limit, this._keyProperty);
    }

    /**
     * Transforms selection to single array of selectedKeys and set it to model. Used for rendering checkboxes in lists.
     */
    private _updateSelectionForRender(): void {
        const selectionForModel: Map<TKey, boolean> = this._getSelectionForModel();

        if (cInstance.instanceOfModule(this._model, 'Controls/display:Collection')) {
            Selection.selectItems(this._model, selectionForModel);
        } else {
            const selectionForOldModel: Object = {};

            selectionForModel.forEach((stateSelection, itemId) => {
                selectionForOldModel[itemId] = stateSelection;
            });
            this._model.updateSelection(selectionForOldModel);
        }
    }

    private _isAllSelectedInRoot(root: object): boolean {
        const isAllSelected = this._isAllSelected(this._selectedKeys, this._excludedKeys);
        return isAllSelected && this._selectedKeys.includes(root);
    }

    private _isAllSelected(selectedKeys: TKeys, excludedKeys: TKeys): boolean {
        const selectedCount = this._getCount();
        const selectionCountEqualsItemsCount = !this._model.getHasMoreData() && selectedCount && selectedCount === this._model.getCount();
        const root = this._getRoot();

        return !this._model.getHasMoreData() && selectionCountEqualsItemsCount || selectedKeys.includes(root)
           && (excludedKeys.length === 0 || excludedKeys.length === 1 && excludedKeys[0] === root);
    }

    private _isSelectionChanged(selectedKeys: TKeys, excludedKeys: TKeys): boolean {
        return !isEqual(selectedKeys, this._selectedKeys) || !isEqual(excludedKeys, this._excludedKeys);
    }

    private _shouldResetSelection(filter: object, root: object): boolean {
        const listFilterChanged = !isEqual(this._filter, filter);
        const rootChanged = this._root !== root;
        const isAllSelected = this._isAllSelectedInRoot(this._getRoot());

        return isAllSelected && (rootChanged || listFilterChanged);
    }

    private _notifyAndUpdateSelection(newSelection: ISelection): void {
        const
           selectionCount = this._getCount(),
           oldSelectedKeys = this._selectedKeys,
           oldExcludedKeys = this._excludedKeys,
           // selectionCount будет равен нулю, если в списке не отмечено ни одного элемента
           // или после выделения всех записей через "отметить всё", пользователь руками снял чекбоксы со всех записей
           newSelectedKeys = selectionCount === 0 ? [] : newSelection.selected,
           newExcludedKeys = selectionCount === 0 ? [] : newSelection.excluded,
           selectedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(oldSelectedKeys, newSelectedKeys),
           excludedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(oldExcludedKeys, newExcludedKeys);

        if (selectedKeysDiff.added.length || selectedKeysDiff.removed.length) {
            // TODO
            // self._notify('selectedKeysChanged', [newSelectedKeys, selectedKeysDiff.added, selectedKeysDiff.removed]);
        }

        if (excludedKeysDiff.added.length || excludedKeysDiff.removed.length) {
            // TODO
            // self._notify('excludedKeysChanged', [newExcludedKeys, excludedKeysDiff.added, excludedKeysDiff.removed]);
        }

        this._updateSelection(newSelection);
        this._updateSelectionForRender();
    }

    private _notifySelectedCountChangedEvent(selectedKeys: TKeys, excludedKeys: TKeys): void {
        const count = this._getCount();
        const isAllSelected = this._isAllSelected(selectedKeys, excludedKeys);
        // TODO
        // self._notify('listSelectedKeysCountChanged', [count, isAllSelected], {bubbling: true});
    }

    private _onCollectionChange(action: string, newItems: [], newItemsIndex: number, removedItems: []): void {
        // Можем попасть сюда в холостую, когда старая модель очистилась, а новая еще не пришла
        // выписана задача https://online.sbis.ru/opendoc.html?guid=2ccba240-9d41-4a11-8e05-e45bd922c3ac
        if (this._model.getItems()) {
            const countItems = this._model.getItems().getCount();
            if (action === collection.IObservable.ACTION_REMOVE) {
                this._remove(this._getItemsKeys(removedItems));
            }
            // Выделение надо сбросить только после вставки новых данных в модель
            // Это необходимо, чтобы чекбоксы сбросились только после отрисовки новых данных,
            // Иначе при проваливании в узел или при смене фильтрации сначала сбросятся чекбоксы,
            // а данные отрисуются только после загрузки
            if (this._resetSelection && action === collection.IObservable.ACTION_RESET || !countItems) {
                this._resetSelection = false;
                this._selectedKeys = [];
                this._excludedKeys = [];
            }
            this._notifyAndUpdateSelection(this._getSelection());
        }
    }

    private _selectedTypeChangedHandler(typeName: TChangeSelectionType, limit?: number): void {
        const items = this._model.getItems();
        let needChangeSelection = true;

        if (typeName === 'selectAll' && !this._selectedKeys.length && !this._excludedKeys.length && !items.getCount()) {
            needChangeSelection = false;
        }

        if (needChangeSelection) {
            this._limit = limit;
            this._multiselection[typeName]();
            this._notifyAndUpdateSelection(this._getSelection());
        }
    }
}
