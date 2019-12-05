import TreeSelectionStrategy from 'Controls/_operations/MultiSelector/SelectionStrategy/Tree';
import getSelectedChildrenCount from 'Controls/_operations/MultiSelector/getSelectedChildrenCount';
import removeSelectionChildren from 'Controls/_operations/MultiSelector/removeSelectionChildren';
import { isNode, getItems, getChildren } from 'Controls/_operations/MultiSelector/ModelCompability';

import { IQueryParams } from 'Controls/_operations/MultiSelector/SelectionStrategy/Base';
import { relation } from 'Types/entity';
import { Tree as TreeCollection } from 'Controls/display';
import { ViewModel } from 'Controls/treeGrid';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject } from 'Controls/interface/';


interface IEntryPath {
   id: String|number|null,
   parent: String|number|null
}

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

/**
 * Базовая стратегия выбора в иерархическогом списке.
 * При выборе родительского узла, так же в выборку попадают все его дети.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/DeepTree
 * @extends Controls/_operations/MultiSelector/SelectionStrategy/Tree
 * @control
 * @public
 * @author Капустин И.А.
 */
export default class DeepTreeSelectionStrategy extends TreeSelectionStrategy {
   protected _recursive: boolean = true;

   protected _getCount(selection: ISelection, model: TreeCollection|ViewModel, queryParams: IQueryParams, hierarchyRelation: relation.Hierarchy): number|null {
      let countItemsSelected: number|null = 0;
      let items: Record = getItems(model);
      let rootId: TKey = this._getRoot(model);

      if (!this.isAllSelected(selection, rootId, model, hierarchyRelation) || this._isAllRootItemsLoaded(model, hierarchyRelation)) {
         for (let index = 0; index < selection.selected.length; index++) {
            let itemId: TKey = selection.selected[index];
            let item: Record = items.getRecordById(itemId);

            if (!item || isNode(item, model, hierarchyRelation)) {
               let countItemsSelectedInNode: number|null = getSelectedChildrenCount(
                  itemId, selection, model, hierarchyRelation);

               if (countItemsSelectedInNode === null) {
                  countItemsSelected = null;
                  break;
               } else {
                  countItemsSelected += countItemsSelectedInNode;
               }
            }

            if (!selection.excluded.includes(itemId)) {
               countItemsSelected++;
            }
         }
      } else if (selection.selected.length) {
         countItemsSelected = null;
      }

      return countItemsSelected;
   }

   getSelectionForModel(selection: ISelection, model: TreeCollection|ViewModel, limit: number, keyProperty: string, hierarchyRelation: relation.Hierarchy): Map<TKey, boolean|null> {
      let selectionResult: Map<TKey, boolean|null> = new Map();
      let selectedKeysWithEntryPath: TKeys = this._mergeEntryPath(selection.selected, getItems(model));

      getItems(model).forEach((item) => {
         let itemId: TKey = item.getId();
         let parentId: TKey|undefined = this._getParentId(itemId, model, hierarchyRelation);
         let isSelected: boolean|null = !selection.excluded.includes(itemId) && (selection.selected.includes(itemId) ||
            this.isAllSelected(selection, parentId, model, hierarchyRelation));

         if (isNode(item, model, hierarchyRelation)) {
            if (isSelected && this._hasChildrenInList(itemId, selection.excluded, model, hierarchyRelation) ||
               !isSelected && (selectedKeysWithEntryPath.includes(itemId) ||
               this._hasChildrenInList(itemId, selectedKeysWithEntryPath, model, hierarchyRelation))) {

               isSelected = null;
            }
         }

         if (isSelected !== false) {
            selectionResult.set(item.getId(), isSelected);
         }
      });

      return selectionResult;
   }

   isAllSelected(selection: ISelection, nodeId: TKey, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): boolean {
      return selection.selected.includes(nodeId) || !selection.excluded.includes(nodeId) &&
         this._hasSelectedParent(nodeId, selection, model, hierarchyRelation);
   }

   protected _selectNode(selection: ISelection, nodeId: Tkey, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): void {
      super._selectNode(...arguments);
      removeSelectionChildren(selection, nodeId, model, hierarchyRelation);
   }

   protected _unSelectNode(selection: ISelection, nodeId: Tkey, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): void {
      super._unSelectNode(...arguments);
      removeSelectionChildren(selection, nodeId, model, hierarchyRelation);
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

   private _hasSelectedParent(key: Tkey, selection: ISelection, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): boolean {
      let
         hasSelectedParent: boolean = false,
         hasExcludedParent: boolean = false,
         currentParentId: Tkey|undefined = this._getParentId(key, model, hierarchyRelation);

      for (;currentParentId !== null && currentParentId !== undefined; currentParentId = this._getParentId(currentParentId, model, hierarchyRelation)) {
         if (selection.selected.includes(currentParentId)) {
            hasSelectedParent = true;
            break;
         } else if (selection.excluded.includes(currentParentId)) {
            hasExcludedParent = true;
            break;
         }
      }

      if (!hasExcludedParent && !currentParentId && selection.selected.includes(null)) {
         hasSelectedParent = true;
      }

      return hasSelectedParent;
   }

   private _hasChildrenInList(itemId: Tkey, listKeys: Tkeys, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): boolean {
      let hasChildren: boolean = false;
      let children: Array<Record> = getChildren(itemId, model, hierarchyRelation);

      for (let index = 0; index < children.length; index++) {
         let child: Record = children[index];
         let childrenId: Tkey = child.getId();

         if (listKeys.includes(childrenId) || isNode(child, model, hierarchyRelation) &&
            this._hasChildrenInList(childrenId, listKeys, model, hierarchyRelation)) {

            hasChildren = true;
            break;
         }
      }

      return hasChildren;
   }
}
