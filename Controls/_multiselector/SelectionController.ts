import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { isEqual } from 'Types/object';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface';
import clone = require('Core/core-clone');
import { Model } from 'Types/entity';
import { CollectionItem } from 'Controls/display';
import { default as ISelectionStrategy } from './SelectionStrategy/ISelectionStrategy';
import {
   ISelectionControllerOptions,
   ISelectionControllerResult,
   ISelectionDifference,
   ISelectionModel
} from './interface';

/**
 * @class Controls/_multiselector/SelectionController
 * @author Авраменко А.С.
 * @private
 */

export class SelectionController {
   private _model: ISelectionModel;
   private _selectedKeys: TKeys = [];
   private _excludedKeys: TKeys = [];
   private _strategy: ISelectionStrategy;

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

      this._updateModel();
   }

   toggleItem(key: TKey): ISelectionControllerResult {
      const oldSelection = clone(this._selection);
      const status = this._getItemStatus(key);
      if (status === true || status === null) {
         this._unselect([key]);
      } else {
         this._select([key]);
      }

      this._updateModel();
      return this._getResult(oldSelection, this._selection);
   }

   update(options: ISelectionControllerOptions): ISelectionControllerResult {
      const modelChanged = options.model !== this._model;
      const itemsChanged = modelChanged ? true : options.model.getCollection() !== this._model.getCollection();
      const selectionChanged = this._isSelectionChanged(options.selectedKeys, options.excludedKeys);
      this._strategy.update(options.strategyOptions);

      if (modelChanged) {
         this._model = options.model;
      }

      const oldSelection = clone(this._selection);
      if (selectionChanged) {
         this._selectedKeys = options.selectedKeys;
         this._excludedKeys = options.excludedKeys;
         this._updateModel();
      } else if (itemsChanged || modelChanged) {
         this._updateModel();
      }
      return this._getResult(oldSelection, this._selection);
   }

   selectAll(): ISelectionControllerResult {
      const oldSelection = clone(this._selection);
      this._strategy.selectAll(this._selection, this._model);
      this._updateModel();
      return this._getResult(oldSelection, this._selection);
   }

   toggleAll(): ISelectionControllerResult {
      const oldSelection = clone(this._selection);
      this._strategy.toggleAll(this._selection, this._model);

      this._updateModel();
      return this._getResult(oldSelection, this._selection);
   }

   unselectAll(): ISelectionControllerResult {
      const oldSelection = clone(this._selection);
      this._strategy.unselectAll(this._selection, this._model);

      this._updateModel();
      return this._getResult(oldSelection, this._selection);
   }

   handleAddItems(addedItems: Model[]): ISelectionControllerResult {
      this._updateModel();
      return {
         selectedKeysDiff: { newKeys: [], added: [], removed: [] },
         excludedKeysDiff: { newKeys: [], added: [], removed: [] },
         selectedCount: this._getCount(this._selection),
         isAllSelected: this._strategy.isAllSelected(this._selection, this._model)
      };
   }

   handleRemoveItems(removedItems: Model[]): ISelectionControllerResult {
      const oldSelection = clone(this._selection);
      this._remove(this._getItemsKeys(removedItems));

      this._updateModel();
      return this._getResult(oldSelection, this._selection);
   }

   handleReset(newItems: Model[]): ISelectionControllerResult {
      const oldSelection = clone(this._selection);

      if (!newItems.length) {
         this._clearSelection();
      }

      this._updateModel();
      return this._getResult(oldSelection, this._selection);
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

   private _getCount(selection?: ISelection): number | null {
      return this._strategy.getCount(selection || this._selection, this._model);
   }

   private _getItemsKeys(items: Array<CollectionItem<Model>>): TKeys {
      return items.map((item) => item.getContents().getId());
   }

   private _isSelectionChanged(selectedKeys: TKeys, excludedKeys: TKeys): boolean {
      return !isEqual(selectedKeys, this._selectedKeys) || !isEqual(excludedKeys, this._excludedKeys);
   }

   private _getResult(oldSelection: ISelection, newSelection: ISelection): ISelectionControllerResult {
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

      const selectedDifference: ISelectionDifference = {
         newKeys: newSelectedKeys,
         added: selectedKeysDiff.added,
         removed: selectedKeysDiff.removed
      };

      const excludedDifference: ISelectionDifference = {
         newKeys: newExcludedKeys,
         added: excludedKeysDiff.added,
         removed: excludedKeysDiff.removed
      };

      return {
         selectedKeysDiff: selectedDifference,
         excludedKeysDiff: excludedDifference,
         selectedCount: this._getCount(newSelection),
         isAllSelected: this._strategy.isAllSelected(newSelection, this._model)
      };
   }

   private _updateModel(): void {
      const selectionForModel = this._strategy.getSelectionForModel(this._selection, this._model);
      this._model.setSelectedItems(selectionForModel.get(true), true);
      this._model.setSelectedItems(selectionForModel.get(false), false);
      this._model.setSelectedItems(selectionForModel.get(null), null);
   }
}
