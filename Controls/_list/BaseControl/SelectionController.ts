import Control = require('Core/Control');
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import collection = require('Types/collection');
import { isEqual } from 'Types/object';
import { SelectionController as Selection } from 'Controls/display';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';
import { ISelectionStrategy, ITreeSelectionStrategyOptions } from 'Controls/operations';
import { getItems } from 'Controls/_operations/MultiSelector/ModelCompability';
import cInstance = require('Core/core-instance');
import clone = require('Core/core-clone');

/**
 * @class Controls/_list/BaseControl/SelectionController
 * @extends Core/Control
 * @control
 * @author Авраменко А.С.
 * @private
 */

type TChangeSelectionType = 'selectAll' | 'unselectAll' | 'toggleAll';

export interface ISelectionModel extends Selection.ISelectionCollection {
   getHasMoreData(): boolean;

   getCount(): number;

   getRoot(): any;

   getItems(): collection.RecordSet;

   updateSelection(selection: Map<number, boolean>|[number]): void;
}

export interface ISelectionControllerOptions {
   model: ISelectionModel;
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   strategy?: ISelectionStrategy;
   strategyOptions?: ITreeSelectionStrategyOptions;
   keyProperty: string;
   filter: object;
   root: object;

   // callbacks
   notifySelectionKeysChanged: Function;
   notifySelectedKeysCountChanged: Function;
}

export class SelectionController {
   private _resetSelection: boolean = false;
   private _model: ISelectionModel;
   private _keyProperty: string;
   private _selectedKeys: TKeys = [];
   private _excludedKeys: TKeys = [];
   private _strategy: ISelectionStrategy;
   private _filter: object;
   private _root: object;

   private _notifySelectionKeysChanged: Function;
   private _notifySelectedKeysCountChanged: Function;

   private get _selection(): ISelection {
      return {
         selected: this._selectedKeys,
         excluded: this._excludedKeys
      };
   }

   constructor(options: ISelectionControllerOptions) {
      this._model = options.model;
      this._keyProperty = options.keyProperty;
      this._selectedKeys = options.selectedKeys.slice();
      this._excludedKeys = options.excludedKeys.slice();
      this._strategy = options.strategy;

      this._notifySelectionKeysChanged = options.notifySelectionKeysChanged;
      this._notifySelectedKeysCountChanged = options.notifySelectedKeysCountChanged;

      this._updateSelectionForRender();
      this._notifySelectedCountChangedEvent(options.selectedKeys, options.excludedKeys);
   }

   toggleItem(key: TKey): void {
      const oldSelection = clone(this._selection);
      const status = this._getItemStatus(key);
      if (status === true || status === null) {
         this._unselect([key]);
      } else {
         this._select([key]);
      }
      this._notifyAndUpdateSelection(oldSelection, this._selection);
   }

   update(options: ISelectionControllerOptions): void {
      const itemsChanged = getItems(options.model) !== getItems(this._model);
      const modelChanged = options.model !== this._model;
      const selectionChanged = this._isSelectionChanged(options.selectedKeys, options.excludedKeys);
      this._keyProperty = options.keyProperty;
      this._strategy.update(options.strategyOptions);

      if (modelChanged) {
         this._model = options.model;
      }

      if (this._shouldResetSelection(options.filter, options.root)) {
         this._resetSelection = true;
      } else if (selectionChanged) {
         const oldSelection = clone(this._selection);
         this._selectedKeys = options.selectedKeys;
         this._excludedKeys = options.excludedKeys;
         this._notifyAndUpdateSelection(oldSelection, this._selection);
      } else if (itemsChanged || modelChanged) {
         this._updateSelectionForRender();
      }
   }

   selectAll(): void {
      const items = getItems(this._model);
      if (this._selectedKeys.length && this._excludedKeys.length && items.getCount()) {
         const oldSelection = clone(this._selection);
         this._strategy.selectAll(this._selection, this._model);
         this._notifyAndUpdateSelection(oldSelection, this._selection);
      }
   }

   toggleAll(): void {
      const oldSelection = clone(this._selection);
      this._strategy.toggleAll(this._selection, this._model);
      this._notifyAndUpdateSelection(oldSelection, this._selection);
   }

   unselectAll(): void {
      const oldSelection = clone(this._selection);
      this._strategy.unselectAll(this._selection, this._model);
      this._notifyAndUpdateSelection(oldSelection, this._selection);
   }

   removeKeys(removedItems: []): void {
      // Можем попасть сюда в холостую, когда старая модель очистилась, а новая еще не пришла
      // выписана задача https://online.sbis.ru/opendoc.html?guid=2ccba240-9d41-4a11-8e05-e45bd922c3ac
      if (getItems(this._model)) {
         const oldSelection = clone(this._selection);
         this._remove(this._getItemsKeys(removedItems));
         this._notifyAndUpdateSelection(oldSelection, this._selection);
      }
   }

   reset(): void {
      // Можем попасть сюда в холостую, когда старая модель очистилась, а новая еще не пришла
      // выписана задача https://online.sbis.ru/opendoc.html?guid=2ccba240-9d41-4a11-8e05-e45bd922c3ac
      if (getItems(this._model)) {
         const oldSelection = clone(this._selection);
         const countItems = getItems(this._model).getCount();

         // Выделение надо сбросить только после вставки новых данных в модель
         // Это необходимо, чтобы чекбоксы сбросились только после отрисовки новых данных,
         // Иначе при проваливании в узел или при смене фильтрации сначала сбросятся чекбоксы,
         // а данные отрисуются только после загрузки
         if (this._resetSelection || !countItems) {
            this._resetSelection = false;
            this._clearSelection();
         }
         this._notifyAndUpdateSelection(oldSelection, this._selection);
      }
   }

   private _select(keys: TKeys): void {
      this._strategy.select(this._selection, keys, this._model);
   }

   private _unselect(keys: TKeys): void {
      this._strategy.unselect(this._selection, keys, this._model);
   }

   private _clearSelection(): void {
      this._selectedKeys = [];
      this._excludedKeys = [];
   }

   private _remove(keys: TKeys): void {
      this._excludedKeys = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
      this._selectedKeys = ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
   }

   private _getItemStatus(key: TKey): boolean {
      return this._selectedKeys.includes(key) && !this._excludedKeys.includes(key);
   }

   private _getRoot(): object | null {
      return this._model.getRoot && this._model.getRoot()
         ? this._model.getRoot().getContents()
         : null;
   }

   private _getCount(selection?: ISelection): number | null {
      return this._strategy.getCount(selection || this._selection, this._model);
   }

   private _getItemsKeys(items: TKeys): TKeys {
      const keys = [];
      items.forEach((item) => {
         keys.push(item.getId());
      });
      return keys;
   }

   private _getSelectionForModel(): Map<TKey, boolean> {
      return this._strategy.getSelectionForModel(this._selection, this._model, this._keyProperty);
   }

   /**
    * Transforms selection to single array of selectedKeys and set it to model. Used for rendering checkboxes in lists.
    */
   private _updateSelectionForRender(): void {
      const selectionForModel: Map<TKey, boolean> = this._getSelectionForModel();

      if (cInstance.instanceOfModule(this._model, 'Controls/display:Collection')) {
         Selection.selectItems(this._model, selectionForModel);
      } else {
         const selectionForOldModel = {};

         selectionForModel.forEach((stateSelection, itemId) => {
            selectionForOldModel[itemId] = stateSelection;
         });
         this._model.updateSelection(selectionForOldModel);
      }
   }

   private _isAllSelectedInRoot(root: object): boolean {
      return this._selectedKeys.includes(root) && this._excludedKeys.includes(root);
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

   private _notifyAndUpdateSelection(oldSelection: ISelection, newSelection: ISelection): void {
      const
         selectionCount = this._getCount(newSelection),
         oldSelectedKeys = oldSelection.selected,
         oldExcludedKeys = oldSelection.excluded,
         // selectionCount будет равен нулю, если в списке не отмечено ни одного элемента
         // или после выделения всех записей через "отметить всё", пользователь руками снял чекбоксы со всех записей
         newSelectedKeys = selectionCount === 0 ? [] : newSelection.selected,
         newExcludedKeys = selectionCount === 0 ? [] : newSelection.excluded,
         selectedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(oldSelectedKeys, newSelectedKeys),
         excludedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(oldExcludedKeys, newExcludedKeys);

      if (selectedKeysDiff.added.length || selectedKeysDiff.removed.length) {
         this._notifySelectionKeysChanged('selectedKeysChanged', newSelectedKeys, selectedKeysDiff.added, selectedKeysDiff.removed);
      }

      if (excludedKeysDiff.added.length || excludedKeysDiff.removed.length) {
         this._notifySelectionKeysChanged('excludedKeysChanged', newExcludedKeys, excludedKeysDiff.added, excludedKeysDiff.removed);
      }

      this._updateSelectionForRender();
   }

   private _notifySelectedCountChangedEvent(selectedKeys: TKeys, excludedKeys: TKeys): void {
      const count = this._getCount();
      const isAllSelected = this._isAllSelected(selectedKeys, excludedKeys);
      this._notifySelectedKeysCountChanged(count, isAllSelected);
   }
}
