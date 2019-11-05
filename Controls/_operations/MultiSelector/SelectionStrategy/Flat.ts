import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { Collection } from 'Controls/display';

type TKeys = number[] | string[];

interface ISelection {
   selectedKeys: TKeys,
   excludedKeys: TKeys
}

const ALL_SELECTION_VALUE = null;

class FlatSelectionStrategy {
   public select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      if (this.isAllSelected(selectedKeys)) {
         ArraySimpleValuesUtil.removeSubArray(excludedKeys, keys);
      } else {
         ArraySimpleValuesUtil.addSubArray(selectedKeys, keys);
      }

      return {
         selectedKeys: selectedKeys,
         excludedKeys: excludedKeys
      };
   }

   public unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      if (this.isAllSelected(selectedKeys)) {
         ArraySimpleValuesUtil.addSubArray(excludedKeys, keys);
      } else {
         ArraySimpleValuesUtil.removeSubArray(selectedKeys, keys);
      }

      return {
         selectedKeys: selectedKeys,
         excludedKeys: excludedKeys
      };
   }

   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, model, limit: number): Promise {
      let itemsSelectedCount: number|null = null;
      let items = this._getItems(model);
      let itemsCount: number = items.getCount();

      if (this.isAllSelected(selectedKeys)) {
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

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model, keyProperty: String, limit: number): Map {
      let
         selectionResult: Map = new Map(),
         selectedItemsCount: number = 0,
         isAllSelected: boolean = this.isAllSelected(selectedKeys);

      if (limit > 0) {
         limit -= excludedKeys.length;
      }

      this._getItems(model).forEach((item) => {
         let itemId = item.get(keyProperty);
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

   public isAllSelected(selectedKeys: TKeys) {
      return selectedKeys.includes(ALL_SELECTION_VALUE);
   }

   private _isAllItemsLoaded(items, limit: number): boolean {
      let
         itemsCount = items.getCount(),
         more = items.getMetaData().more,
         hasMore = typeof more === 'number' ? more > itemsCount : more;

      return !hasMore || (limit && itemsCount >= limit);
   }

   private _getItems(model) {
      if (model instanceof Collection) {
         return model.getCollection();
      } else {
         return model.getItems();
      }
   }
}

export default FlatSelectionStrategy;
