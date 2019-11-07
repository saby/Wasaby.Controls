import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { getItems } from 'Controls/_operations/MultiSelector/SelectionHelper';

import { Collection } from 'Controls/display';
import { ListViewModel } from 'Controls/list';
import { RecordSet, List } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';
import { ISelectionStrategy } from 'Controls/interface';

const ALL_SELECTION_VALUE = null;

export default class FlatSelectionStrategy implements ISelectionStrategy {
   public select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      if (this.isAllSelected(ALL_SELECTION_VALUE, selectedKeys)) {
         ArraySimpleValuesUtil.removeSubArray(excludedKeys, keys);
      } else {
         ArraySimpleValuesUtil.addSubArray(selectedKeys, keys);
      }

      return {
         selected: selectedKeys,
         excluded: excludedKeys
      };
   }

   public unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      if (this.isAllSelected(ALL_SELECTION_VALUE, selectedKeys)) {
         ArraySimpleValuesUtil.addSubArray(excludedKeys, keys);
      } else {
         ArraySimpleValuesUtil.removeSubArray(selectedKeys, keys);
      }

      return {
         selected: selectedKeys,
         excluded: excludedKeys
      };
   }

   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, model: Collection|ListViewModel, limit: number): Promise {
      let itemsSelectedCount: number|null = null;
      let items: RecordSet|List = getItems(model);
      let itemsCount: number = items.getCount();

      if (this.isAllSelected(ALL_SELECTION_VALUE, selectedKeys)) {
         if (this._isAllItemsLoaded(items, limit) && (!limit || itemsCount <= limit)) {
            itemsSelectedCount = itemsCount - excludedKeys.length;
         } else if (limit) {
            itemsSelectedCount = limit - excludedKeys.length;
         } else {
            // Зовем прикладной метод
         }
      } else {
         itemsSelectedCount = selectedKeys.length;
      }

      return new Promise((resolve) => {
         resolve(itemsSelectedCount);
      });
   }

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model: Collection|ListViewModel, limit: number, keyProperty: string): Map<TKey, boolean> {
      let
         selectionResult: Map<TKey, boolean> = new Map(),
         selectedItemsCount: number = 0,
         isAllSelected: boolean = this.isAllSelected(ALL_SELECTION_VALUE, selectedKeys);

      if (limit > 0) {
         limit -= excludedKeys.length;
      }

      getItems(model).forEach((item) => {
         let itemId: TKey = item.get(keyProperty);
         let isSelected: boolean = (!limit || selectedItemsCount < limit) &&
            (selectedKeys.includes(itemId) || isAllSelected && !excludedKeys.includes(itemId));

         if (isSelected) {
            selectedItemsCount++;
         }
         if (isSelected !== false) {
            selectionResult.set(itemId, isSelected);
         }
      });

      return selectionResult;
   }

   public isAllSelected(roodId: Tkey, selectedKeys: TKeys): boolean {
      return selectedKeys.includes(roodId);
   }

   private _isAllItemsLoaded(items: RecordSet|List, limit: number): boolean {
      let
         itemsCount: number = items.getCount(),
         more: number|boolean|undefined = items.getMetaData().more,
         hasMore: boolean|undefined = typeof more === 'number' ? more > itemsCount : more;

      return !hasMore || (limit && itemsCount >= limit);
   }
}
