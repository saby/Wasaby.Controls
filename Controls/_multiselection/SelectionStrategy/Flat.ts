import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface';
import { Record } from 'Types/entity';
import { IFlatSelectionStrategyOptions} from '../interface';
import ISelectionStrategy from './ISelectionStrategy';

const ALL_SELECTION_VALUE = null;

/**
 * Базовая стратегия выбора в плоском списке.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Flat
 * @control
 * @private
 * @author Герасимов А.М.
 */
export class FlatSelectionStrategy implements ISelectionStrategy {
   private _items: RecordSet;

   constructor(options: IFlatSelectionStrategyOptions) {
      this._items = options.items;
   }

   update(options: IFlatSelectionStrategyOptions): void {
      this._items = options.items;
   }

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

   selectAll(selection: ISelection): void {
      selection.selected.length = 0;
      selection.excluded.length = 0;
      selection.selected[0] = ALL_SELECTION_VALUE;
      selection.excluded[0] = ALL_SELECTION_VALUE;
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
   toggleAll(selection: ISelection, hasMoreData: boolean): void {
      if (this._isAllSelected(selection)) {
         const excludedKeys: TKeys = selection.excluded.slice();
         this.unselectAll(selection);
         this.select(selection, excludedKeys);
      } else {
         const selectedKeys: TKeys = selection.selected.slice();
         this.selectAll(selection);
         this.unselect(selection, selectedKeys);
      }
   }

   getSelectionForModel(selection: ISelection): Map<boolean|null, Record[]> {
      const selectedItems = new Map([[true, []], [false, []], [null, []]]);
      const isAllSelected: boolean = this._isAllSelected(selection);

      this._items.forEach((item) => {
         const itemId: TKey = item.getId();
         const selected = selection.selected.includes(itemId) || isAllSelected && !selection.excluded.includes(itemId);

         selectedItems.get(selected).push(item);
      });

      return selectedItems;
   }

   getCount(selection: ISelection, hasMoreData: boolean): number|null {
      let countItemsSelected: number|null = null;
      const itemsCount: number = this._items.getCount();

      if (this._isAllSelected(selection)) {
         if (!hasMoreData) {
            countItemsSelected = itemsCount - selection.excluded.length;
         }
      } else {
         countItemsSelected = selection.selected.length;
      }

      return countItemsSelected;
   }

   // TODO что должно вернуться если выбраны все за ислючением одного(скольких-нибудь)
   private _isAllSelected(selection: ISelection): boolean {
      return selection.selected.includes(ALL_SELECTION_VALUE);
   }
}
