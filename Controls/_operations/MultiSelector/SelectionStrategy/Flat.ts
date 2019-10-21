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

      if (this._isAllSelection(selectedKeys)) {
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

      if (this._isAllSelection(selectedKeys)) {
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

      if (this._isAllSelection(selectedKeys)) {
         if (this._isAllItemsLoaded(items, limit) && (!limit || items.getCount() <= limit)) {
            itemsCount = items.getCount() - excludedKeys.length;
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

      return selectedKeys.includes(itemId) || this._isAllSelection(selectedKeys) && !excludedKeys.includes(itemId);
   }

   private _isAllSelection(selectedKeys: TKeys) {
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
