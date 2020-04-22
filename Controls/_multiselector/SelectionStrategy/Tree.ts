import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { relation, Record, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface';
import { Controller as SourceController } from 'Controls/source';
import ISelectionStrategy from './ISelectionStrategy';
import { IEntryPath, ISelectionModel, ITreeSelectionStrategyOptions } from '../interface';
import { getChildren, getItems, getParentProperty, isNode } from '../Utils/utils';
import getChildrenIds from '../Utils/getChildrenIds';
import getSelectedChildrenCount from '../Utils/getSelectedChildrenCount';
import removeSelectionChildren from '../Utils/removeSelectionChildren';

/**
 * Стратегия выбора для иерархического списка, для работы с ним как с плоским.
 * Записи не зависимы между собой, выбор родительских узлов никак не отражается на их детей.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Tree
 * @control
 * @private
 * @author Герасимов А.М.
 */

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

export class TreeSelectionStrategy implements ISelectionStrategy {
   private _hierarchyRelation: relation.Hierarchy;
   private _selectAncestors: boolean;
   private _selectDescendants: boolean;
   private _nodesSourceControllers: Map<string, SourceController>;

   constructor(options: ITreeSelectionStrategyOptions) {
      this._hierarchyRelation = options.hierarchyRelation;
      this._selectAncestors = options.selectAncestors;
      this._selectDescendants = options.selectDescendants;
      this._nodesSourceControllers = options.nodesSourceControllers;
   }

   select(selection: ISelection, keys: TKeys, model: ISelectionModel): void {
      keys.forEach((key) => {
         const item: Record = getItems(model).getRecordById(key);

         if (!item || isNode(item, model, this._hierarchyRelation)) {
            this._selectNode(selection, key, model);
         } else {
            this._selectLeaf(selection, key);
         }
      });
   }

   unselect(selection: ISelection, keys: TKeys, model: ISelectionModel): void {
      keys.forEach((key) => {
         const item = getItems(model).getRecordById(key);
         const isRoot = key === this._getRoot(model);
         if (!item || isNode(item, model, this._hierarchyRelation)) {
            this._unSelectNode(selection, key, model);
         } else {
            this._unSelectLeaf(selection, key, model);
         }
         if (!isRoot && item && this._selectAncestors) {
            const parentId = this._getParentId(item.getId(), model);
            this._unSelectParentNodes(selection, parentId, model);
         }
      });
   }

   selectAll(selection: ISelection, model: ISelectionModel): void {
      const rootId: TKey = this._getRoot(model);

      this.select(selection, [rootId], model);
      this._removeChildrenIdsFromSelection(selection, rootId, model);

      if (!selection.excluded.includes(rootId)) {
         selection.excluded = ArraySimpleValuesUtil.addSubArray(selection.excluded, [rootId]);
      }
   }

   unselectAll(selection: ISelection, model: ISelectionModel): void {
      if (this._withEntryPath(model)) {
         this._unselectAllInRoot(selection, model);
      } else {
         selection.selected.length = 0;
         selection.excluded.length = 0;
      }
   }

   toggleAll(selection: ISelection, model: ISelectionModel): void {
      const rootId: TKey = this._getRoot(model);
      const childrenIdsInRoot = getChildrenIds(rootId, model, this._hierarchyRelation);
      const rootExcluded = selection.excluded.includes(rootId);
      const oldExcludedKeys = selection.excluded.slice();
      const oldSelectedKeys = selection.selected.slice();

      if (this._isAllSelected(selection, rootId, model)) {
         this._unselectAllInRoot(selection, model);

         const intersectionKeys = ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys);
         this.select(selection, intersectionKeys, model);
      } else {
         this.selectAll(selection, model);

         if (model.getHasMoreData()) {
            this.unselect(selection, oldSelectedKeys, model);
         }
      }

      ArraySimpleValuesUtil.addSubArray(selection.excluded, ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldSelectedKeys));
      ArraySimpleValuesUtil.addSubArray(selection.selected, ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys));

      if (rootExcluded) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [rootId]);
      }
   }

   getCount(selection: ISelection, model: ISelectionModel): number|null {
      let countItemsSelected: number|null = 0;
      const rootId: TKey = this._getRoot(model);
      let selectedNodes: TKeys = [];

      if (!this._isAllSelected(selection, rootId, model) || !model.getHasMoreData()) {
         if (this._selectDescendants) {
            const items: RecordSet = getItems(model);

            for (let index = 0; index < selection.selected.length; index++) {
               const itemId: TKey = selection.selected[index];
               const item: Record = items.getRecordById(itemId);

               if (!item || isNode(item, model, this._hierarchyRelation)) {
                  selectedNodes.push(itemId);
               }

               if (!selection.excluded.includes(itemId)) {
                  countItemsSelected++;
               }
            }
         } else {
            selectedNodes = ArraySimpleValuesUtil.getIntersection(selection.selected, selection.excluded);
            countItemsSelected = selection.selected.length - selectedNodes.length;
         }

         for (let index = 0; index < selectedNodes.length; index++) {
            const nodeKey: TKey = selectedNodes[index];
            const countItemsSelectedInNode: number|null = getSelectedChildrenCount(nodeKey, selection, model, this._hierarchyRelation, this._selectDescendants);

            if (countItemsSelectedInNode === null) {
               countItemsSelected = null;
               break;
            } else {
               countItemsSelected += countItemsSelectedInNode;
            }
         }
      } else if (selection.selected.length) {
         countItemsSelected = null;
      }

      return countItemsSelected;
   }

   getSelectionForModel(selection: ISelection, model: ISelectionModel): Map<boolean, Model[]> {
      const selectedItems = new Map([[true, []], [false, []], [null, []]]);
      const selectedKeysWithEntryPath = this._mergeEntryPath(selection.selected, getItems(model));

      getItems(model).forEach((item) => {
         const itemId: TKey = item.getId();
         const parentId = this._getParentId(itemId, model);
         let isSelected = !selection.excluded.includes(itemId) && (selection.selected.includes(itemId) ||
             this._isAllSelected(selection, parentId, model));

         if (this._selectAncestors && isNode(item, model, this._hierarchyRelation)) {
            isSelected = this._getStateNode(itemId, isSelected, {
               selected: selectedKeysWithEntryPath,
               excluded: selection.excluded
            }, model);

            if (!isSelected && (selectedKeysWithEntryPath.includes(itemId))) {
               isSelected = null;
            }
         }

         selectedItems.get(isSelected).push(item);
      });

      return selectedItems;
   }

   update(options: ITreeSelectionStrategyOptions): void {
      this._hierarchyRelation = options.hierarchyRelation;
      this._selectAncestors = options.selectAncestors;
      this._selectDescendants = options.selectDescendants;
      this._nodesSourceControllers = options.nodesSourceControllers;
   }

   private _unSelectParentNodes(selection: ISelection, parentId: TKey, model: ISelectionModel): void {
      let allChildrenExcluded = this._isAllChildrenExcluded(selection, parentId, model);
      let currentParentId = parentId;
      while (currentParentId !== this._getRoot(model) && allChildrenExcluded) {
         const item = getItems(model).getRecordById(currentParentId);
         this._unSelectNode(selection, currentParentId, model);
         currentParentId = this._getParentId(item.getId(), model);
         allChildrenExcluded = this._isAllChildrenExcluded(selection, currentParentId, model);
      }
   }

   private _isAllSelectedInRoot(selection: ISelection, model: ISelectionModel): boolean {
      const root: number | string = this._getRoot(model);
      return selection.selected.includes(root) && selection.excluded.includes(root);
   }

   private _unselectAllInRoot(selection: ISelection, model: ISelectionModel): void {
      const rootId: TKey = this._getRoot(model);
      const rootInExcluded = selection.excluded.includes(rootId);

      this.unselect(selection, [rootId], model);
      this._removeChildrenIdsFromSelection(selection, rootId, model);

      if (rootInExcluded) {
         selection.excluded = ArraySimpleValuesUtil.removeSubArray(selection.excluded, [rootId]);
      }
   }

   private _withEntryPath(model: ISelectionModel): boolean {
      return FIELD_ENTRY_PATH in getItems(model).getMetaData();
   }

   private _isAllSelected(selection: ISelection, nodeId: TKey, model: ISelectionModel): boolean {
      if (this._selectDescendants || this._isAllSelectedInRoot(selection, model)) {
         return selection.selected.includes(nodeId) || !selection.excluded.includes(nodeId) &&
            this._hasSelectedParent(nodeId, selection, model);
      } else {
         return selection.selected.includes(nodeId) && selection.excluded.includes(nodeId);
      }
   }

   private _selectNode(selection: ISelection, nodeId: TKey, model: ISelectionModel): void {
      this._selectLeaf(selection, nodeId);

      if (this._selectDescendants) {
         removeSelectionChildren(selection, nodeId, model, this._hierarchyRelation);
      }
   }

   private _unSelectNode(selection: ISelection, nodeId: TKey, model: ISelectionModel): void {
      this._unSelectLeaf(selection, nodeId, model);

      if (this._selectDescendants) {
         removeSelectionChildren(selection, nodeId, model, this._hierarchyRelation);
      }
   }

   private _selectLeaf(selection: ISelection, leafId: string|number): void {
      if (selection.excluded.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selection.selected, [leafId]);
      }
   }

   private _unSelectLeaf(selection: ISelection, leafId: string|number, model: ISelectionModel): void {
      const parentId = this._getParentId(leafId, model);

      ArraySimpleValuesUtil.removeSubArray(selection.selected, [leafId]);
      if (this._isAllSelected(selection, parentId, model)) {
         ArraySimpleValuesUtil.addSubArray(selection.excluded, [leafId]);
      }

      if (this._isAllChildrenExcluded(selection, parentId, model) &&
          this._selectAncestors) {
         ArraySimpleValuesUtil.removeSubArray(selection.selected, [parentId]);
      }
   }

   private _getRoot(model: ISelectionModel): TKey {
      return model.getRoot().getContents();
   }

   private _getParentId(itemId: string|number, model: ISelectionModel): TKey|undefined {
      const parentProperty: string = getParentProperty(model, this._hierarchyRelation);
      const item: Record|undefined = getItems(model).getRecordById(itemId);
      return item && item.get(parentProperty);
   }

   private _mergeEntryPath(selectedKeys: TKeys, items: RecordSet): TKeys {
      const entryPathObject: Object = {};
      const entryPath: IEntryPath[] = items.getMetaData()[FIELD_ENTRY_PATH];
      const selectedKeysWithEntryPath: TKeys = selectedKeys.slice();

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
            }
         });
      }

      return selectedKeysWithEntryPath;
   }

   private _hasSelectedParent(key: TKey, selection: ISelection, model: ISelectionModel): boolean {
      let hasSelectedParent: boolean = false;
      let hasExcludedParent: boolean = false;
      let currentParentId: TKey|undefined = this._getParentId(key, model);

      for (; currentParentId !== null && currentParentId !== undefined; currentParentId = this._getParentId(currentParentId, model)) {
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

   private _getStateNode(itemId: TKey, initialState: boolean, selection: ISelection, model: ISelectionModel): boolean|null {
      let stateNode: boolean|null = initialState;
      const sourceController = this._nodesSourceControllers.get(itemId);
      const hasMoreData: boolean|void = sourceController ? sourceController.hasMoreData('down') : true;
      const children: Record[] = getChildren(itemId, model, this._hierarchyRelation);
      const listKeys = initialState ? selection.excluded : selection.selected;
      let countChildrenInList: boolean|number|null = 0;

      for (let index = 0; index < children.length; index++) {
         const child: Record = children[index];
         const childId: TKey = child.getId();
         const childInList = listKeys.includes(childId);

         if (isNode(child, model, this._hierarchyRelation)) {
            const stateChildNode = this._getStateNode(childId, childInList ? !initialState : initialState, selection, model);

            if (stateChildNode === null) {
               stateNode = null;
               break;
            } else if (stateChildNode !== initialState) {
               countChildrenInList++;
            }
         } else if (childInList) {
            countChildrenInList++;
         }
      }

      if (countChildrenInList > 0) {
         if (countChildrenInList === children.length && !hasMoreData) {
            stateNode = !stateNode;
         } else {
            stateNode = null;
         }
      }

      return stateNode;
   }

   private _isAllChildrenExcluded(selection: ISelection, nodeId: TKey, model: ISelectionModel): boolean {
      const children = getChildren(nodeId, model, this._hierarchyRelation);
      return !children.some((item): boolean => !selection.excluded.includes(item.getId()));
   }

   private _removeChildrenIdsFromSelection(selection: ISelection, nodeId: TKey, model: ISelectionModel): void {
      removeSelectionChildren(selection, nodeId, model, this._hierarchyRelation);
   }
}
