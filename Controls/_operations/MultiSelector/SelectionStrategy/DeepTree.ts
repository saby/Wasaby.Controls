import TreeSelectionStrategy from 'Controls/_operations/MultiSelector/SelectionStrategy/Tree';
import * as SelectionHelper from 'Controls/_operations/MultiSelector/SelectionHelper';

import { relation } from 'Types/entity';
import { Tree as TreeCollection } from 'Controls/display';
import { ViewModel } from 'Controls/treeGrid';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys } from 'Controls/interface/';
import { ISelectionStrategy } from 'Controls/interface';

interface IEntryPath {
   id: String|number|null,
   parent: String|number|null
}

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

export default class DeepTreeSelectionStrategy extends TreeSelectionStrategy implements ISelectionStrategy {
   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, limit: number, hierarchyRelation: relation.Hierarchy): Promise {
      let countItemsSelected: number|null = 0;
      let items: Record = SelectionHelper.getItems(model);
      let rootId: TKey = this._getRoot(model);

      if (!this.isAllSelected(rootId, selectedKeys, excludedKeys, model, hierarchyRelation) || this._isAllRootItemsLoaded(model, hierarchyRelation)) {
         for (let index = 0; index < selectedKeys.length; index++) {
            let itemId: TKey = selectedKeys[index];
            let item: Record = items.getRecordById(itemId);

            if (!item || SelectionHelper.isNode(item, model, hierarchyRelation)) {
               let countItemsSelectedInNode: number|null = SelectionHelper.getSelectedChildrenCount(
                  itemId, selectedKeys, excludedKeys, model, hierarchyRelation);

               if (countItemsSelectedInNode === null) {
                  countItemsSelected = null;
                  break;
               } else {
                  countItemsSelected += countItemsSelectedInNode;
               }
            }

            if (!excludedKeys.includes(itemId)) {
               countItemsSelected++;
            }
         }
      } else if (selectedKeys.length) {
         countItemsSelected = null;
      }

      return new Promise((resolve) => {
         resolve(countItemsSelected);
      });
   }

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, limit: number, keyProperty: string, hierarchyRelation: relation.Hierarchy): Map<TKey, boolean|null> {
      let selectionResult: Map<TKey, boolean|null> = new Map();
      let selectedKeysWithEntryPath: TKeys = this._mergeEntryPath(selectedKeys, SelectionHelper.getItems(model));

      SelectionHelper.getItems(model).forEach((item) => {
         let itemId: TKey = item.getId();
         let parentId: TKey|undefined = SelectionHelper.getParentId(itemId, model, hierarchyRelation);
         let isSelected: boolean|null = !excludedKeys.includes(itemId) && (selectedKeys.includes(itemId) ||
            this.isAllSelected(parentId, selectedKeys, excludedKeys, model, hierarchyRelation));

         if (SelectionHelper.isNode(item, model, hierarchyRelation)) {
            if (isSelected && SelectionHelper.hasChildrenInList(itemId, excludedKeys, model, hierarchyRelation) ||
               !isSelected && (selectedKeysWithEntryPath.includes(itemId) ||
               SelectionHelper.hasChildrenInList(itemId, selectedKeysWithEntryPath, model, hierarchyRelation))) {

               isSelected = null;
            }
         }

         if (isSelected !== false) {
            selectionResult.set(item.getId(), isSelected);
         }
      });

      return selectionResult;
   }

   public isAllSelected(nodeId: TKey, selectedKeys: Tkeys, excludedKeys: Tkeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): boolean {
      return selectedKeys.includes(nodeId) || !excludedKeys.includes(nodeId) &&
         SelectionHelper.hasSelectedParent(nodeId, selectedKeys, excludedKeys, model, hierarchyRelation);
   }

   protected _selectNode(nodeId: Tkey, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): void {
      super._selectNode(...arguments);
      SelectionHelper.removeSelectionChildren(nodeId, selectedKeys, excludedKeys, model, hierarchyRelation);
   }

   protected _unSelectNode(nodeId: Tkey, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): void {
      super._unSelectNode(...arguments);
      SelectionHelper.removeSelectionChildren(nodeId, selectedKeys, excludedKeys, model, hierarchyRelation);
   }

   private _mergeEntryPath(selectedKeys: TKeys, items: RecordSet): void {
      let entryPathObject: Object = {};
      let entryPath: Array<IEntryPath> = items.getMetaData()[FIELD_ENTRY_PATH];
      let selectedKeysWithEntryPath: TKeys = selectedKeys.slice();

      if (entryPath) {
         entryPath.forEach((pathData: IEntryPath) => {
            entryPathObject[pathData.id] = pathData.parent;
         });

         entryPath.forEach((pathData) => {
            if (selectedKeys.includes(pathData.id)) {
               for (let keyItem = pathData.parent; entryPathObject[keyItem]; keyItem = entryPathObject[keyItem]) {
                  if (!selectedKeys.includes(keyItem)) {
                     selectedKeysWithEntryPath.push(keyItem);
                  }
               }

               if (!selectedKeys.includes(keyItem)) {
                  selectedKeysWithEntryPath.push(keyItem);
               }
            }
         });
      }

      return selectedKeysWithEntryPath;
   }
}
