import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import SelectionHelper from 'Controls/_operations/MultiSelector/SelectionHelper';
import { Collection } from 'Controls/display';

type TKeys = number[] | string[];

interface ISelection {
   selectedKeys: TKeys,
   excludedKeys: TKeys
}

class TreeSelectionStrategy {
   public select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      keys.forEach((key) => {
         let item = this._getItems(model).getRecordById(key);

         if (!item || SelectionHelper.isNode(item, hierarchyRelation)) {
            this._selectNode(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         } else {
            this._selectLeaf(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         }
      });

      return {
         selectedKeys: selectedKeys,
         excludedKeys: excludedKeys
      };
   }

   public unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      keys.forEach((key) => {
         let item = this._getItems(model).getRecordById(key);

         if (!item || SelectionHelper.isNode(item, hierarchyRelation)) {
            this._unSelectNode(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         } else {
            this._unSelectLeaf(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         }
      });

      return {
         selectedKeys: selectedKeys,
         excludedKeys: excludedKeys
      };
   }

   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): Promise {
      let countItemsSelected: number|null = 0;
      let selectedNodes: [];

      if (!this.isAllSelected(selectedKeys, excludedKeys, model) || this._isAllRootItemsLoaded(model, hierarchyRelation)) {
         selectedNodes = ArraySimpleValuesUtil.getIntersection(selectedKeys, excludedKeys);
         countItemsSelected = selectedKeys.length - selectedNodes.length;

         for (let index = 0; index < selectedNodes.length; index++) {
            let nodeKey = selectedNodes[index];
            let countItemsSelectedInNode = SelectionHelper.getSelectedChildrenCount(
               nodeKey, selectedKeys, excludedKeys, this._getItems(model), hierarchyRelation, false);

            if (countItemsSelectedInNode === null) {
               countItemsSelected = null;
               break;
            } else {
               countItemsSelected += countItemsSelectedInNode;
            }
         }
      } else if (selectedKeys.length) {
         countItemsSelected = null;
      }

      return new Promise((resolve) => {
         resolve(countItemsSelected);
      });
   }

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): Map {
      let selectionResult: Map = new Map();

      this._getItems(model).forEach((item) => {
         let isSelected: boolean = this._isSelected(item, selectedKeys, excludedKeys, model, hierarchyRelation);

         if (isSelected !== false) {
            selectionResult.set(item.getId(), isSelected);
         }
      });

      return selectionResult;
   }

   public isAllSelected(selectedKeys, excludedKeys, model): boolean {
      let rootId = this._getRoot(model);

      return selectedKeys.includes(rootId) && excludedKeys.includes(rootId);
   }

   private _selectLeaf(leafId: string|number, selectedKeys: TKeys, excludedKeys: TKeys): void {
      if (excludedKeys.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(excludedKeys, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selectedKeys, [leafId]);
      }
   }

   private _unSelectLeaf(leafId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): void {
      ArraySimpleValuesUtil.removeSubArray(selectedKeys, [leafId]);

      if (this._isParentSelectedWithChild(leafId, selectedKeys, excludedKeys, model, hierarchyRelation)) {
         ArraySimpleValuesUtil.addSubArray(excludedKeys, [leafId]);
      }
   }

   protected _selectNode(): void {
      this._selectLeaf(...arguments);
   }

   protected _unSelectNode(): void {
      this._unSelectLeaf(...arguments);
   }

   protected _isSelected(item, selectedKeys, excludedKeys, model, hierarchyRelation): boolean {
      let itemId = item.getId();

      return !excludedKeys.includes(itemId) && (selectedKeys.includes(itemId) ||
         this._isParentSelectedWithChild(itemId, selectedKeys, excludedKeys, model, hierarchyRelation));
   }

   protected _isParentSelectedWithChild(itemId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): boolean {
      let parentId = SelectionHelper.getParentId(itemId, this._getItems(model), hierarchyRelation.getParentProperty());

      return selectedKeys.includes(parentId) && excludedKeys.includes(parentId);
   }

   private _getRoot(model): string|number|null {
      return model.getRoot().getContents();
   }

   private _isAllRootItemsLoaded(model, hierarchyRelation) {
      let hasMore: boolean = true;
      let items = this._getItems(model);
      let more = items.getMetaData().more;

      if (typeof more === 'number') {
         let rootId = this._getRoot(model);
         let itemsCountRoot = hierarchyRelation.getChildren(rootId, items).length;

         hasMore = more !== itemsCountRoot;
      } else {
         hasMore = more !== false;
      }

      return !hasMore;
   }

   private _getItems(model) {
      if (model instanceof Collection) {
         return model.getCollection();
      } else {
         return model.getItems();
      }
   }
}

export default TreeSelectionStrategy;
