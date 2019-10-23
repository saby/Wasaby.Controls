import {default as ArraySimpleValuesUtil} from 'Controls/Utils/ArraySimpleValuesUtil';
import {default as SelectionHelper} from 'Controls/_operations/MultiSelector/SelectionHelper';

type TKeys = number[] | string[];

interface ISelection {
   selectedKeys: TKeys,
   excludedKeys: TKeys
}

class TreeSelectionStrategy {
   public select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      keys.forEach((key) => {
         let item = configSelection.items.getRecordById(key);

         if (SelectionHelper.isNode(item, configSelection.hierarchyRelation)) {
            this._selectNode(key, selectedKeys, excludedKeys, configSelection);
         } else {
            this._selectLeaf(key, selectedKeys, excludedKeys, configSelection);
         }
      });

      return {
         selectedKeys: selectedKeys,
         excludedKeys: excludedKeys
      };
   }

   public unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      keys.forEach((key) => {
         let item = configSelection.items.getRecordById(key);

         if (SelectionHelper.isNode(item, configSelection.hierarchyRelation)) {
            this._unSelectNode(key, selectedKeys, excludedKeys, configSelection);
         } else {
            this._unSelectLeaf(key, selectedKeys, excludedKeys, configSelection);
         }
      });
   }

   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): Promise {
      let countItemsSelected: number|null = null;
      let selectedFolders: [];

      if (!this.isAllSelected() || this._isAllRootItemsLoaded()) {
         selectedFolders = ArraySimpleValuesUtil.getIntersection(selectedKeys, excludedKeys);
         countItemsSelected = selectedKeys.length - selectedFolders.length;

         for (let index = 0; index < selectedFolders.length; index++) {
            let folderKey = selectedFolders[index];
            let itemsSelectedInFolder = SelectionHelper.getSelectedChildrenCount(folderKey, selectedKeys, excludedKeys, configSelection.items, configSelection.hierarchyRelation);

            if (itemsSelectedInFolder === null) {
               countItemsSelected = null;
               break;
            } else {
               countItemsSelected += itemsSelectedInFolder;
            }
         }
      }

      return new Promise((resolve) => {
         resolve(countItemsSelected);
      });
   }

   public isSelected(item, selectedKeys, excludedKeys, configSelection): boolean {
      let itemId = item.getId();

      return selectedKeys.includes(itemId) || !excludedKeys.includes(itemId) &&
         this._isParentSelectedWithChild(itemId, selectedKeys, excludedKeys, configSelection);
   }

   public isAllSelected(selectedKeys, excludedKeys, configSelection): boolean {
      let rootId = this._getRoot(configSelection.model);

      return selectedKeys.includes(rootId) && excludedKeys.includes(rootId) || !excludedKeys.includes(rootId) &&
         this._isParentSelectedWithChild(rootId, selectedKeys, excludedKeys, configSelection);
   }

   private _selectLeaf(leafId: string|number, selectedKeys: TKeys, excludedKeys: TKeys): void {
      if (excludedKeys.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(excludedKeys, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selectedKeys, [leafId]);
      }
   }

   private _unSelectLeaf(leafId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): void {
      ArraySimpleValuesUtil.removeSubArray(selectedKeys, [leafId]);

      if (this._isParentSelectedWithChild(leafId, selectedKeys, excludedKeys, configSelection)) {
         ArraySimpleValuesUtil.addSubArray(excludedKeys, [leafId]);
      }
   }

   protected _selectNode(): void {
      this._selectLeaf(...arguments);
   }

   protected _unSelectNode(): void {
      this._unSelectLeaf(...arguments);
   }

   protected _isParentSelectedWithChild(itemId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): boolean {
      let parentSelected = SelectionHelper.getSelectedParent(
         configSelection.hierarchyRelation, itemId, selectedKeys, excludedKeys, configSelection.items);

      // Если выбранный родитель также находится в исключениях, то он был выбран через selectAll, значит и дети выбраны
      return parentSelected !== undefined && excludedKeys.includes(parentSelected);
   }

   private _getRoot(model): string|number|null {
      return model.getRoot().getContents();
   }

   private _isAllRootItemsLoaded(items) {
      let itemsCount = items.getCount();
      let more = items.getMetaData().more;

      return typeof more === 'number' ? more === itemsCount : !more;
   }
}

export default TreeSelectionStrategy;
