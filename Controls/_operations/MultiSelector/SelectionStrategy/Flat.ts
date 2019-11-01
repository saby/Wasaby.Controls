import {default as ArraySimpleValuesUtil} from 'Controls/Utils/ArraySimpleValuesUtil';

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
      let itemsCount: number|null = null;
      let items = model.getItems();

      if (this.isAllSelected(selectedKeys)) {
         if (this._isAllItemsLoaded(items, limit) && (!limit || items.getCount() <= limit)) {
            itemsCount = items.getCount() - excludedKeys.length;
         } else {
            // Зовем прикладной метод
         }
      } else {
         itemsCount = selectedKeys.length;
      }

      return new Promise((resolve) => {
         resolve(itemsCount);
      });
   }

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model, keyProperty: String, limit: number): Object {
      let
         selectionResult: Object = {},
         selectedItemsCount: number = 0,
         isAllSelected: boolean = this.isAllSelected(selectedKeys);

      if (limit > 0) {
         limit -= excludedKeys.length;
      }

      model.getItems().forEach((item) => {
         let itemId = item.get(keyProperty);
         let isSelected: boolean = (!limit || selectedItemsCount < limit) &&
            (selectedKeys.includes(itemId) || isAllSelected && !excludedKeys.includes(itemId));

         if (isSelected) {
            selectedItemsCount++;
         }
         if (isSelected !== false) {
            selectionResult[itemId] = isSelected;
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
}

export default FlatSelectionStrategy;
