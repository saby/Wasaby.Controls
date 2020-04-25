import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { relation, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface';
import { Controller as SourceController } from 'Controls/source';
import ISelectionStrategy from './ISelectionStrategy';
import { IEntryPath, ITreeSelectionStrategyOptions } from '../interface';
import { getChildren } from '../Utils/utils';
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
const ALL_SELECTION_VALUE = null;

export class TreeSelectionStrategy implements ISelectionStrategy {
   private _hierarchyRelation: relation.Hierarchy;
   private _selectAncestors: boolean;
   private _selectDescendants: boolean;
   private _nodesSourceControllers: Map<string, SourceController>;
   private _rootId: TKey;

   constructor(options: ITreeSelectionStrategyOptions) {
      this._hierarchyRelation = options.hierarchyRelation;
      this._selectAncestors = options.selectAncestors;
      this._selectDescendants = options.selectDescendants;
      this._nodesSourceControllers = options.nodesSourceControllers;
      this._rootId = options.rootId;
   }

   update(options: ITreeSelectionStrategyOptions): void {
      this._hierarchyRelation = options.hierarchyRelation;
      this._selectAncestors = options.selectAncestors;
      this._selectDescendants = options.selectDescendants;
      this._nodesSourceControllers = options.nodesSourceControllers;
      this._rootId = options.rootId;
   }

   select(selection: ISelection, keys: TKeys, items: RecordSet): void {
      keys.forEach((key) => {
         const item: Record = items.getRecordById(key);

         if (!item || this._hierarchyRelation.isNode(item)) {
            this._selectNode(selection, key, items);
         } else {
            this._selectLeaf(selection, key);
         }
      });
   }

   unselect(selection: ISelection, keys: TKeys, items: RecordSet): void {
      keys.forEach((key) => {
         const item = items.getRecordById(key);
         const isRoot = key === this._rootId;
         if (!item || this._hierarchyRelation.isNode(item)) {
            this._unSelectNode(selection, key, items);
         } else {
            this._unSelectLeaf(selection, key, items);
         }
         if (!isRoot && item && this._selectAncestors) {
            const parentId = this._getParentId(item.getId(), items);
            this._unSelectParentNodes(selection, parentId, items);
         }
      });
   }

   selectAll(selection: ISelection, items: RecordSet): void {
      this.select(selection, [this._rootId], items);
      this._removeChildrenIdsFromSelection(selection, this._rootId, items);

      if (!selection.excluded.includes(this._rootId)) {
         selection.excluded = ArraySimpleValuesUtil.addSubArray(selection.excluded, [this._rootId]);
      }
   }

   unselectAll(selection: ISelection, items: RecordSet): void {
      if (this._withEntryPath(items)) {
         this._unselectAllInRoot(selection, items);
      } else {
         selection.selected.length = 0;
         selection.excluded.length = 0;
      }
   }

   toggleAll(selection: ISelection, items: RecordSet, hasMoreData: boolean): void {
      const childrenIdsInRoot = getChildrenIds(this._rootId, items, this._hierarchyRelation);
      const rootExcluded = selection.excluded.includes(this._rootId);
      const oldExcludedKeys = selection.excluded.slice();
      const oldSelectedKeys = selection.selected.slice();

      if (this._isAllSelected(selection, this._rootId, items)) {
         this._unselectAllInRoot(selection, items);

         const intersectionKeys = ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys);
         this.select(selection, intersectionKeys, items);
      } else {
         this.selectAll(selection, items);

         if (hasMoreData) {
            this.unselect(selection, oldSelectedKeys, items);
         }
      }

      ArraySimpleValuesUtil.addSubArray(selection.excluded, ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldSelectedKeys));
      ArraySimpleValuesUtil.addSubArray(selection.selected, ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys));

      if (rootExcluded) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [this._rootId]);
      }
   }

   isAllSelected(selection: ISelection): boolean {
      return selection.selected.includes(ALL_SELECTION_VALUE) && selection.excluded.includes(ALL_SELECTION_VALUE) && selection.excluded.length === 1;
   }

   getCount(selection: ISelection, items: RecordSet, hasMoreData: boolean): number|null {
      let countItemsSelected: number|null = 0;
      let selectedNodes: TKeys = [];

      if (!this._isAllSelected(selection, this._rootId, items) || !hasMoreData) {
         if (this._selectDescendants) {
            for (let index = 0; index < selection.selected.length; index++) {
               const itemId: TKey = selection.selected[index];
               const item: Record = items.getRecordById(itemId);

               if (!item || this._hierarchyRelation.isNode(item)) {
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
            const countItemsSelectedInNode: number|null = getSelectedChildrenCount(nodeKey, selection, items, this._hierarchyRelation, this._selectDescendants);

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

   getSelectionForModel(selection: ISelection, items: RecordSet): Map<boolean|null, Record[]> {
      const selectedItems = new Map([[true, []], [false, []], [null, []]]);
      const selectedKeysWithEntryPath = this._mergeEntryPath(selection.selected, items);

      items.forEach((item) => {
         const itemId: TKey = item.getId();
         const parentId = this._getParentId(itemId, items);
         let isSelected = !selection.excluded.includes(itemId) && (selection.selected.includes(itemId) ||
             this._isAllSelected(selection, parentId, items));

         if (this._selectAncestors && this._hierarchyRelation.isNode(item)) {
            isSelected = this._getStateNode(itemId, isSelected, {
               selected: selectedKeysWithEntryPath,
               excluded: selection.excluded
            }, items);

            if (!isSelected && (selectedKeysWithEntryPath.includes(itemId))) {
               isSelected = null;
            }
         }

         selectedItems.get(isSelected).push(item);
      });

      return selectedItems;
   }

   private _unSelectParentNodes(selection: ISelection, parentId: TKey, items: RecordSet): void {
      let allChildrenExcluded = this._isAllChildrenExcluded(selection, parentId, items);
      let currentParentId = parentId;
      while (currentParentId !== this._rootId && allChildrenExcluded) {
         const item = items.getRecordById(currentParentId);
         this._unSelectNode(selection, currentParentId, items);
         currentParentId = this._getParentId(item.getId(), items);
         allChildrenExcluded = this._isAllChildrenExcluded(selection, currentParentId, items);
      }
   }

   private _isAllSelectedInRoot(selection: ISelection): boolean {
      return selection.selected.includes(this._rootId) && selection.excluded.includes(this._rootId);
   }

   private _unselectAllInRoot(selection: ISelection, items: RecordSet): void {
      const rootInExcluded = selection.excluded.includes(this._rootId);

      this.unselect(selection, [this._rootId], items);
      this._removeChildrenIdsFromSelection(selection, this._rootId, items);

      if (rootInExcluded) {
         selection.excluded = ArraySimpleValuesUtil.removeSubArray(selection.excluded, [this._rootId]);
      }
   }

   private _withEntryPath(items: RecordSet): boolean {
      return FIELD_ENTRY_PATH in items.getMetaData();
   }

   private _isAllSelected(selection: ISelection, nodeId: TKey, items: RecordSet): boolean {
      if (this._selectDescendants || this._isAllSelectedInRoot(selection)) {
         return selection.selected.includes(nodeId) || !selection.excluded.includes(nodeId) &&
            this._hasSelectedParent(nodeId, selection, items);
      } else {
         return selection.selected.includes(nodeId) && selection.excluded.includes(nodeId);
      }
   }

   private _selectNode(selection: ISelection, nodeId: TKey, items: RecordSet): void {
      this._selectLeaf(selection, nodeId);

      if (this._selectDescendants) {
         removeSelectionChildren(selection, nodeId, items, this._hierarchyRelation);
      }
   }

   private _unSelectNode(selection: ISelection, nodeId: TKey, items: RecordSet): void {
      this._unSelectLeaf(selection, nodeId, items);

      if (this._selectDescendants) {
         removeSelectionChildren(selection, nodeId, items, this._hierarchyRelation);
      }
   }

   private _selectLeaf(selection: ISelection, leafId: string|number): void {
      if (selection.excluded.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selection.selected, [leafId]);
      }
   }

   private _unSelectLeaf(selection: ISelection, leafId: string|number, items: RecordSet): void {
      const parentId = this._getParentId(leafId, items);

      ArraySimpleValuesUtil.removeSubArray(selection.selected, [leafId]);
      if (this._isAllSelected(selection, parentId, items)) {
         ArraySimpleValuesUtil.addSubArray(selection.excluded, [leafId]);
      }

      if (this._isAllChildrenExcluded(selection, parentId, items) &&
          this._selectAncestors) {
         ArraySimpleValuesUtil.removeSubArray(selection.selected, [parentId]);
      }
   }

   private _getParentId(itemId: string|number, items: RecordSet): TKey|undefined {
      const parentProperty: string = this._hierarchyRelation.getParentProperty();
      const item: Record|undefined = items.getRecordById(itemId);
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

   private _hasSelectedParent(key: TKey, selection: ISelection, items: RecordSet): boolean {
      let hasSelectedParent: boolean = false;
      let hasExcludedParent: boolean = false;
      let currentParentId: TKey|undefined = this._getParentId(key, items);

      for (; currentParentId !== null && currentParentId !== undefined; currentParentId = this._getParentId(currentParentId, items)) {
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

   private _getStateNode(itemId: TKey, initialState: boolean, selection: ISelection, items: RecordSet): boolean|null {
      let stateNode: boolean|null = initialState;
      const sourceController = this._nodesSourceControllers.get(itemId);
      const hasMoreData: boolean|void = sourceController ? sourceController.hasMoreData('down') : true;
      const children: Record[] = getChildren(itemId, items, this._hierarchyRelation);
      const listKeys = initialState ? selection.excluded : selection.selected;
      let countChildrenInList: boolean|number|null = 0;

      for (let index = 0; index < children.length; index++) {
         const child: Record = children[index];
         const childId: TKey = child.getId();
         const childInList = listKeys.includes(childId);

         if (this._hierarchyRelation.isNode(child)) {
            const stateChildNode = this._getStateNode(childId, childInList ? !initialState : initialState, selection, items);

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

   private _isAllChildrenExcluded(selection: ISelection, nodeId: TKey, items: RecordSet): boolean {
      const children = getChildren(nodeId, items, this._hierarchyRelation);
      return !children.some((item): boolean => !selection.excluded.includes(item.getId()));
   }

   private _removeChildrenIdsFromSelection(selection: ISelection, nodeId: TKey, items: RecordSet): void {
      removeSelectionChildren(selection, nodeId, items, this._hierarchyRelation);
   }
}
