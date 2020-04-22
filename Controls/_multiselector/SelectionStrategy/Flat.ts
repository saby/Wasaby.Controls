import ISelectionStrategy from 'Controls/_multiselector/SelectionStrategy/ISelectionStrategy';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { Map } from 'Types/shim';
import { IFlatSelectionStrategyOptions, ISelectionModel } from '../interface';
import { getItems } from '../Utils/utils';

const ALL_SELECTION_VALUE = null;

/**
 * Базовая стратегия выбора в плоском списке.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Flat
 * @control
 * @private
 * @author Герасимов А.М.
 */
export class FlatSelectionStrategy implements ISelectionStrategy {
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

   selectAll(selection: ISelection, model: ISelectionModel): void {
      selection.selected.length = 0;
      selection.selected[0] = ALL_SELECTION_VALUE;
   }

   /**
    * Remove selection from all items.
    */
   unselectAll(selection: ISelection): void {
      selection.selected.length = 0;
      selection.excluded.length = 0;
   }

   /**
    * Invert selection.
    */
   toggleAll(selection: ISelection, model: ISelectionModel): void {
      if (this._isAllSelected(selection)) {
         const excludedKeys: TKeys = selection.excluded.slice();
         this.unselectAll(selection);
         this.select(selection, excludedKeys);
      } else {
         const selectedKeys: TKeys = selection.selected.slice();
         this.selectAll(selection, model);
         this.unselect(selection, selectedKeys);
      }
   }

   getSelectionForModel(selection: ISelection, model: ISelectionModel): Map<boolean, Array<CollectionItem<Model>>> {
      const selectedItems = new Map([[true, []], [false, []], [null, []]]);
      const isAllSelected: boolean = this._isAllSelected(selection);

      getItems(model).forEach((item) => {
         const itemId: TKey = item.getId();
         const isSelected = selection.selected.includes(itemId) || isAllSelected && !selection.excluded.includes(itemId);

         selectedItems.get(isSelected).push(item);
      });

      return selectedItems;
   }

   getCount(selection: ISelection, model: ISelectionModel): number|null {
      let countItemsSelected: number|null = null;
      const items: RecordSet = getItems(model);
      const itemsCount: number = items.getCount();

      if (this._isAllSelected(selection)) {
         if (!model.getHasMoreData()) {
            countItemsSelected = itemsCount - selection.excluded.length;
         }
      } else {
         countItemsSelected = selection.selected.length;
      }

      return countItemsSelected;
   }

   update(options: IFlatSelectionStrategyOptions): void {
      // nothing update
   }

   private _isAllSelected(selection: ISelection): boolean {
      return selection.selected.includes(ALL_SELECTION_VALUE);
   }
}
