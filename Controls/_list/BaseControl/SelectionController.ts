import Control = require('Core/Control');
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import collection = require('Types/collection');
import { isEqual } from 'Types/object';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface';
import { ISelectionStrategy, ITreeSelectionStrategyOptions } from 'Controls/operations';
import { getItems } from 'Controls/_operations/MultiSelector/ModelCompability';
import clone = require('Core/core-clone');
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

/**
 * @class Controls/_list/BaseControl/SelectionController
 * @extends Core/Control
 * @control
 * @author Авраменко А.С.
 * @private
 */

export interface ISelectionModel {
   getHasMoreData(): boolean;

   getCount(): number;

   getRoot(): any;

   getItems(): collection.RecordSet;

   setSelectedItems(items: Array<CollectionItem<Model>>, selected: boolean): void;

   getItemBySourceKey(key: string | number): CollectionItem<Model>;
}

export interface ISelectionControllerOptions {
   model: ISelectionModel;
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   strategy?: ISelectionStrategy;
   strategyOptions?: ITreeSelectionStrategyOptions;
   filter: object;

   // callbacks
   notifySelectionKeysChanged: Function;
   notifySelectedKeysCountChanged: Function;
}

export class SelectionController {
   private _resetSelection: boolean = false;
   private _model: ISelectionModel;
   private _selectedKeys: TKeys = [];
   private _excludedKeys: TKeys = [];
   private _strategy: ISelectionStrategy;
   private _filter: object;

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
      this._selectedKeys = options.selectedKeys.slice();
      this._excludedKeys = options.excludedKeys.slice();
      this._strategy = options.strategy;
      this._filter = options.filter;

      this._notifySelectionKeysChanged = options.notifySelectionKeysChanged;
      this._notifySelectedKeysCountChanged = options.notifySelectedKeysCountChanged;

      this._updateSelectionForRender();
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
      const filterChanged = options.filter !== this._filter;
      const selectionChanged = this._isSelectionChanged(options.selectedKeys, options.excludedKeys);
      this._strategy.update(options.strategyOptions);

      if (modelChanged) {
         this._model = options.model;
      }

      if (filterChanged) {
         this._filter = options.filter;
      }

      if (this._shouldResetSelection(options.filter)) {
         this._resetSelection = true;
      } else if (selectionChanged) {
         const oldSelection = clone(this._selection);
         this._selectedKeys = options.selectedKeys;
         this._excludedKeys = options.excludedKeys;
         this._notifyAndUpdateSelection(oldSelection, this._selection);
      } else if (itemsChanged || modelChanged || filterChanged) {
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

   updateSelectedItems(): void {
      this._notifyAndUpdateSelection(this._selection, this._selection);
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
      return this._model.getItemBySourceKey(key).isSelected();
   }

   private _getRoot(): object | null {
      return this._model.getRoot
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

   private _updateSelectionForRender(unselectedItems?: Array<CollectionItem<Model>>): void {
      const items = this._strategy.getSelectedItems(this._selection, this._model);
      this._model.setSelectedItems(items, true);

      if (unselectedItems) {
         this._model.setSelectedItems(unselectedItems, false);
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

   private _shouldResetSelection(filter: object): boolean {
      const listFilterChanged = !isEqual(this._filter, filter);
      const isAllSelected = this._isAllSelectedInRoot(this._getRoot());

      return isAllSelected && listFilterChanged;
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

      // выбираем элементы, с которых сняли выбор
      const unselectedItems = this._strategy.getSelectedItems(
         {
            selected: selectedKeysDiff.removed,
            excluded: newSelection.excluded
         }, this._model);
         // добавляем невыбранные элементы, добавленные в excluded
      ArraySimpleValuesUtil.addSubArray(
         unselectedItems,
         this._strategy.getSelectedItems(
         {
            selected: newSelection.excluded,
            excluded: []
         }, this._model)
      );

      this._updateSelectionForRender(unselectedItems);
   }

   private _notifySelectedCountChangedEvent(selectedKeys: TKeys, excludedKeys: TKeys): void {
      const count = this._getCount();
      const isAllSelected = this._isAllSelected(selectedKeys, excludedKeys);
      this._notifySelectedKeysCountChanged(count, isAllSelected);
   }
}
