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

   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, items, limit: number): Promise {
      let itemsCount: number|null = null;

      if (this.isAllSelected(selectedKeys)) {
         if (this._isAllItemsLoaded(items, limit) && (!limit || items.getCount() <= limit)) {
            itemsCount = items.getCount() - excludedKeys.length;
         } else {
            // Зовем прикладной метод
         }
      } else {
         itemsCount = this.selectedKeys.length;
      }

      return new Promise((resolve) => {
         resolve(itemsCount);
      });
   }

   public isSelected(item, selectedKeys: TKeys, excludedKeys: TKeys, keyProperty: string): boolean {
      let itemId = item.get(keyProperty);

      return selectedKeys.includes(itemId) || this.isAllSelected(selectedKeys) && !excludedKeys.includes(itemId);
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
