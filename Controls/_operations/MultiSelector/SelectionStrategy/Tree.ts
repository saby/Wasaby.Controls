import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { getItems, isNode, getSelectedChildrenCount, getParentId, getChildren } from 'Controls/_operations/MultiSelector/SelectionHelper';

import { relation } from 'Types/entity';
import { Tree as TreeCollection } from 'Controls/display';
import { ViewModel } from 'Controls/treeGrid';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';
import { ISelectionStrategy } from 'Controls/interface';

export default class TreeSelectionStrategy implements ISelectionStrategy {
   public select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      keys.forEach((key) => {
         let item: Record = getItems(model).getRecordById(key);

         if (!item || isNode(item, model, hierarchyRelation)) {
            this._selectNode(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         } else {
            this._selectLeaf(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         }
      });

      return {
         selected: selectedKeys,
         excluded: excludedKeys
      };
   }

   public unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): ISelection {
      selectedKeys = selectedKeys.slice();
      excludedKeys = excludedKeys.slice();

      keys.forEach((key) => {
         let item: Record = getItems(model).getRecordById(key);

         if (!item || isNode(item, model, hierarchyRelation)) {
            this._unSelectNode(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         } else {
            this._unSelectLeaf(key, selectedKeys, excludedKeys, model, hierarchyRelation);
         }
      });

      return {
         selected: selectedKeys,
         excluded: excludedKeys
      };
   }

   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, limit: number, hierarchyRelation: relation.Hierarchy): Promise {
      let countItemsSelected: number|null = 0;
      let rootId: TKey = this._getRoot(model);
      let selectedNodes: TKeys;

      if (!this.isAllSelected(rootId, selectedKeys, excludedKeys) || this._isAllRootItemsLoaded(model, hierarchyRelation)) {
         selectedNodes = ArraySimpleValuesUtil.getIntersection(selectedKeys, excludedKeys);
         countItemsSelected = selectedKeys.length - selectedNodes.length;

         for (let index = 0; index < selectedNodes.length; index++) {
            let nodeKey: TKey = selectedNodes[index];
            let countItemsSelectedInNode: number|null = getSelectedChildrenCount(
               nodeKey, selectedKeys, excludedKeys, model, hierarchyRelation, false);

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

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, limit: number, keyProperty: string, hierarchyRelation: relation.Hierarchy): Map<TKey, boolean> {
      let selectionResult: Map<TKey, boolean> = new Map();

      getItems(model).forEach((item) => {
         let itemId: TKey = item.getId();
         let parentId: TKey|undefined = getParentId(itemId, model, hierarchyRelation);
         let isSelected: boolean = !excludedKeys.includes(itemId) && (selectedKeys.includes(itemId) ||
            this.isAllSelected(parentId, selectedKeys, excludedKeys, model, hierarchyRelation));

         if (isSelected !== false) {
            selectionResult.set(item.getId(), isSelected);
         }
      });

      return selectionResult;
   }

   public isAllSelected(nodeId: Tkey, selectedKeys: TKeys, excludedKeys: TKeys): boolean {
      return selectedKeys.includes(nodeId) && excludedKeys.includes(nodeId);
   }

   protected _selectNode(): void {
      this._selectLeaf(...arguments);
   }

   protected _unSelectNode(): void {
      this._unSelectLeaf(...arguments);
   }

   private _selectLeaf(leafId: string|number, selectedKeys: TKeys, excludedKeys: TKeys): void {
      if (excludedKeys.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(excludedKeys, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selectedKeys, [leafId]);
      }
   }

   private _unSelectLeaf(leafId: TKey, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): void {
      let parentId: TKey|undefined = getParentId(leafId, model, hierarchyRelation);

      ArraySimpleValuesUtil.removeSubArray(selectedKeys, [leafId]);
      if (this.isAllSelected(parentId, selectedKeys, excludedKeys, model, hierarchyRelation)) {
         ArraySimpleValuesUtil.addSubArray(excludedKeys, [leafId]);
      }
   }

   private _getRoot(model: TreeCollection|ViewModel): TKey {
      return model.getRoot().getContents();
   }

   private _isAllRootItemsLoaded(model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): boolean {
      let hasMore: boolean = true;
      let items: RecordSet = getItems(model);
      let more: number|boolean|undefined = items.getMetaData().more;

      if (typeof more === 'number') {
         let rootId: string|number|null = this._getRoot(model);
         let itemsCountRoot: number = getChildren(rootId, model, hierarchyRelation).length;

         hasMore = more !== itemsCountRoot;
      } else {
         hasMore = more !== false;
      }

      return !hasMore;
   }
}
