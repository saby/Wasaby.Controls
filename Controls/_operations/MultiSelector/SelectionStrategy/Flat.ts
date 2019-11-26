import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { getItems, getSelectionCount } from 'Controls/_operations/MultiSelector/SelectionHelper';

import { Collection } from 'Controls/display';
import { ListViewModel } from 'Controls/list';
import { RecordSet, List } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';
import { ISelectionStrategy, ISelectionStrategyOptions, ISelectionConfig } from 'Controls/interface';

const ALL_SELECTION_VALUE = null;

/**
 * Базовая стратегия выбора в плоском списке.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Flat
 * @mixes Controls/_interface/ISelectionStrategy
 * @control
 * @public
 * @author Капустин И.А.
 */
export default class FlatSelectionStrategy implements ISelectionStrategy {
   protected _selectionCountMethodName: string;

   constructor(options: ISelectionStrategyOptions) {
      this._selectionCountMethodName = options.selectionCountMethodName;
   }

   select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection {
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

   unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection {
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

   getCount({selectedKeys, excludedKeys, model, limit, source, filter}: ISelectionConfig): Promise<number|null> {
      let countItemsSelected: number|null = null;
      let items: RecordSet|List = getItems(model);
      let itemsCount: number = items.getCount();

      if (this.isAllSelected(ALL_SELECTION_VALUE, selectedKeys)) {
         if (this._isAllItemsLoaded(items, limit) && (!limit || itemsCount <= limit)) {
            countItemsSelected = itemsCount - excludedKeys.length;
         } else if (limit) {
            countItemsSelected = limit - excludedKeys.length;
         }
      } else {
         countItemsSelected = selectedKeys.length;
      }

      return getSelectionCount(countItemsSelected, source, this._selectionCountMethodName, selectedKeys, excludedKeys, filter);
   }

   getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model: Collection|ListViewModel, limit: number, keyProperty: string): Map<TKey, boolean> {
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

   isAllSelected(roodId: Tkey, selectedKeys: TKeys): boolean {
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
