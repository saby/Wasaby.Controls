import ISelectionStrategy from 'Controls/_operations/MultiSelector/SelectionStrategy/ISelectionStrategy';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { getItems } from 'Controls/_operations/MultiSelector/ModelCompability';
import { Map } from 'Types/shim';

import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';
import { ISelectionModel } from 'Controls/list';

const ALL_SELECTION_VALUE = null;

/**
 * Базовая стратегия выбора в плоском списке.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Flat
 * @control
 * @private
 * @author Герасимов А.М.
 */
export default class FlatSelectionStrategy implements ISelectionStrategy {
   select(selection: ISelection, keys: TKeys): void {
      if (this._isAllSelected(selection)) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, keys);
      } else {
         ArraySimpleValuesUtil.addSubArray(selection.selected, keys);
      }
   }

   unselect(selection: ISelection, keys: TKeys): void {
      if (this._isAllSelected(selection)) {
         ArraySimpleValuesUtil.addSubArray(selection.excluded, keys);
      } else {
         ArraySimpleValuesUtil.removeSubArray(selection.selected, keys);
      }
   }

   selectAll(selection: ISelection, model: ISelectionModel, limit: number): void {
      selection.selected = [ALL_SELECTION_VALUE];

      // При выборе "Отметить все" лимит не передается, а предыдущий установленный сбрасывается раньше вызова selectAll,
      // в этом случае массив с исключениями всегда будут очищаться.
      if (!limit) {
         selection.excluded = [];
      }
   }

   /**
    * Remove selection from all items.
    */
   unselectAll(selection: ISelection): void {
      selection.selected = [];
      selection.excluded = [];
   }

   /**
    * Invert selection.
    */
   toggleAll(selection: ISelection, model: ISelectionModel, limit: number): void {
      if (this._isAllSelected(selection)) {
         const excludedKeys: TKeys = selection.excluded.slice();
         this.unselectAll(selection);
         this.select(selection, excludedKeys);
      } else {
         const selectedKeys: TKeys = selection.selected.slice();
         this.selectAll(selection, model, limit);
         this.unselect(selection, selectedKeys);
      }
   }

   /**
    * Delete keys from anywhere.
    * @param selection
    * @param {Array} keys Keys to remove.
    */
   remove(selection: ISelection, keys: TKeys): void {
      selection.excluded = ArraySimpleValuesUtil.removeSubArray(selection.excluded, keys);
      selection.selected = ArraySimpleValuesUtil.removeSubArray(selection.selected, keys);
   }

   getSelectionForModel(selection: ISelection, model: ISelectionModel, limit: number, keyProperty: string): Map<TKey, boolean> {
      const selectionResult: Map<TKey, boolean> = new Map();
      const isAllSelected: boolean = this._isAllSelected(selection);
      let selectedItemsCount: number = 0;

      if (limit > 0) {
         limit -= selection.excluded.length;
      }

      if (selection.selected.length || selection.excluded.length) {
         getItems(model).forEach((item) => {
            const itemId: TKey = item.get(keyProperty);
            const isSelected: boolean = (!limit || selectedItemsCount < limit) &&
                (selection.selected.includes(itemId) || isAllSelected && !selection.excluded.includes(itemId));

            if (isSelected) {
               selectedItemsCount++;
            }
            if (isSelected !== false) {
               selectionResult.set(itemId, isSelected);
            }
         });
      }

      return selectionResult;
   }

   getCount(selection: ISelection, model: ISelectionModel, limit: number): number|null {
      let countItemsSelected: number|null = null;
      const items: RecordSet = getItems(model);
      const itemsCount: number = items.getCount();

      if (this._isAllSelected(selection)) {
         if (!model.getHasMoreData() && (!limit || itemsCount <= limit)) {
            countItemsSelected = itemsCount - selection.excluded.length;
         } else if (limit) {
            countItemsSelected = limit - selection.excluded.length;
         }
      } else {
         countItemsSelected = selection.selected.length;
      }

      return countItemsSelected;
   }

   private _isAllSelected(selection: ISelection): boolean {
      return selection.selected.includes(ALL_SELECTION_VALUE);
   }
}
