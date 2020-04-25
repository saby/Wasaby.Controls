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
   private _items: RecordSet;

   constructor(options: ITreeSelectionStrategyOptions) {
      this._hierarchyRelation = options.hierarchyRelation;
      this._selectAncestors = options.selectAncestors;
      this._selectDescendants = options.selectDescendants;
      this._nodesSourceControllers = options.nodesSourceControllers;
      this._rootId = options.rootId;
      this._items = options.items;
   }

   update(options: ITreeSelectionStrategyOptions): void {
      this._hierarchyRelation = options.hierarchyRelation;
      this._selectAncestors = options.selectAncestors;
      this._selectDescendants = options.selectDescendants;
      this._nodesSourceControllers = options.nodesSourceControllers;
      this._rootId = options.rootId;
      this._items = options.items;
   }

   select(selection: ISelection, keys: TKeys): void {
      keys.forEach((key) => {
         const item: Record = this._items.getRecordById(key);

         if (!item || this._hierarchyRelation.isNode(item)) {
            this._selectNode(selection, key);
         } else {
            this._selectLeaf(selection, key);
         }
      });
   }

   unselect(selection: ISelection, keys: TKeys): void {
      keys.forEach((key) => {
         const item = this._items.getRecordById(key);
         const isRoot = key === this._rootId;
         if (!item || this._hierarchyRelation.isNode(item)) {
            this._unSelectNode(selection, key);
         } else {
            this._unSelectLeaf(selection, key);
         }
         if (!isRoot && item && this._selectAncestors) {
            const parentId = this._getParentId(item.getId());
            this._unSelectParentNodes(selection, parentId);
         }
      });
   }

   selectAll(selection: ISelection): void {
      this.select(selection, [this._rootId]);
      this._removeChildrenIdsFromSelection(selection, this._rootId);

      if (!selection.excluded.includes(this._rootId)) {
         selection.excluded = ArraySimpleValuesUtil.addSubArray(selection.excluded, [this._rootId]);
      }
   }

   unselectAll(selection: ISelection): void {
      if (this._withEntryPath()) {
         this._unselectAllInRoot(selection);
      } else {
         selection.selected.length = 0;
         selection.excluded.length = 0;
      }
   }

   toggleAll(selection: ISelection, hasMoreData: boolean): void {
      const childrenIdsInRoot = getChildrenIds(this._rootId, this._items, this._hierarchyRelation);
      const rootExcluded = selection.excluded.includes(this._rootId);
      const oldExcludedKeys = selection.excluded.slice();
      const oldSelectedKeys = selection.selected.slice();

      if (this._isAllSelected(selection, this._rootId)) {
         this._unselectAllInRoot(selection);

         const intersectionKeys = ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys);
         this.select(selection, intersectionKeys);
      } else {
         this.selectAll(selection);

         if (hasMoreData) {
            this.unselect(selection, oldSelectedKeys);
         }
      }

      ArraySimpleValuesUtil.addSubArray(selection.excluded, ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldSelectedKeys));
      ArraySimpleValuesUtil.addSubArray(selection.selected, ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys));

      if (rootExcluded) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [this._rootId]);
      }
   }

   getSelectionForModel(selection: ISelection): Map<boolean|null, Record[]> {
      const selectedItems = new Map([[true, []], [false, []], [null, []]]);
      const selectedKeysWithEntryPath = this._mergeEntryPath(selection.selected);

      this._items.forEach((item) => {
         const itemId: TKey = item.getId();
         const parentId = this._getParentId(itemId);
         let isSelected = !selection.excluded.includes(itemId) && (selection.selected.includes(itemId) ||
            this._isAllSelected(selection, parentId));

         if (this._selectAncestors && this._hierarchyRelation.isNode(item)) {
            isSelected = this._getStateNode(itemId, isSelected, {
               selected: selectedKeysWithEntryPath,
               excluded: selection.excluded
            });

            if (!isSelected && (selectedKeysWithEntryPath.includes(itemId))) {
               isSelected = null;
            }
         }

         selectedItems.get(isSelected).push(item);
      });

      return selectedItems;
   }

   getCount(selection: ISelection, hasMoreData: boolean): number|null {
      let countItemsSelected: number|null = 0;
      let selectedNodes: TKeys = [];

      if (!this._isAllSelected(selection, this._rootId) || !hasMoreData) {
         if (this._selectDescendants) {
            for (let index = 0; index < selection.selected.length; index++) {
               const itemId: TKey = selection.selected[index];
               const item: Record = this._items.getRecordById(itemId);

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
            const countItemsSelectedInNode: number|null = getSelectedChildrenCount(nodeKey, selection, this._items, this._hierarchyRelation, this._selectDescendants);

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

   isAllSelected(selection: ISelection): boolean {
      return selection.selected.includes(ALL_SELECTION_VALUE) && selection.excluded.includes(ALL_SELECTION_VALUE) && selection.excluded.length === 1;
   }

   private _unSelectParentNodes(selection: ISelection, parentId: TKey): void {
      let allChildrenExcluded = this._isAllChildrenExcluded(selection, parentId);
      let currentParentId = parentId;
      while (currentParentId !== this._rootId && allChildrenExcluded) {
         const item = this._items.getRecordById(currentParentId);
         this._unSelectNode(selection, currentParentId);
         currentParentId = this._getParentId(item.getId());
         allChildrenExcluded = this._isAllChildrenExcluded(selection, currentParentId);
      }
   }

   private _isAllSelectedInRoot(selection: ISelection): boolean {
      return selection.selected.includes(this._rootId) && selection.excluded.includes(this._rootId);
   }

   private _unselectAllInRoot(selection: ISelection): void {
      const rootInExcluded = selection.excluded.includes(this._rootId);

      this.unselect(selection, [this._rootId]);
      this._removeChildrenIdsFromSelection(selection, this._rootId);

      if (rootInExcluded) {
         selection.excluded = ArraySimpleValuesUtil.removeSubArray(selection.excluded, [this._rootId]);
      }
   }

   private _withEntryPath(): boolean {
      return FIELD_ENTRY_PATH in this._items.getMetaData();
   }

   private _isAllSelected(selection: ISelection, nodeId: TKey): boolean {
      if (this._selectDescendants || this._isAllSelectedInRoot(selection)) {
         return selection.selected.includes(nodeId) || !selection.excluded.includes(nodeId) &&
            this._hasSelectedParent(nodeId, selection);
      } else {
         return selection.selected.includes(nodeId) && selection.excluded.includes(nodeId);
      }
   }

   private _selectNode(selection: ISelection, nodeId: TKey): void {
      this._selectLeaf(selection, nodeId);

      if (this._selectDescendants) {
         removeSelectionChildren(selection, nodeId, this._items, this._hierarchyRelation);
      }
   }

   private _unSelectNode(selection: ISelection, nodeId: TKey): void {
      this._unSelectLeaf(selection, nodeId);

      if (this._selectDescendants) {
         removeSelectionChildren(selection, nodeId, this._items, this._hierarchyRelation);
      }
   }

   private _selectLeaf(selection: ISelection, leafId: string|number): void {
      if (selection.excluded.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selection.selected, [leafId]);
      }
   }

   private _unSelectLeaf(selection: ISelection, leafId: string|number): void {
      const parentId = this._getParentId(leafId);

      ArraySimpleValuesUtil.removeSubArray(selection.selected, [leafId]);
      if (this._isAllSelected(selection, parentId)) {
         ArraySimpleValuesUtil.addSubArray(selection.excluded, [leafId]);
      }

      if (this._isAllChildrenExcluded(selection, parentId) &&
          this._selectAncestors) {
         ArraySimpleValuesUtil.removeSubArray(selection.selected, [parentId]);
      }
   }

   private _getParentId(itemId: string|number): TKey|undefined {
      const parentProperty: string = this._hierarchyRelation.getParentProperty();
      const item: Record|undefined = this._items.getRecordById(itemId);
      return item && item.get(parentProperty);
   }

   private _mergeEntryPath(selectedKeys: TKeys): TKeys {
      const entryPathObject: Object = {};
      const entryPath: IEntryPath[] = this._items.getMetaData()[FIELD_ENTRY_PATH];
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

   private _hasSelectedParent(key: TKey, selection: ISelection): boolean {
      let hasSelectedParent: boolean = false;
      let hasExcludedParent: boolean = false;
      let currentParentId: TKey|undefined = this._getParentId(key);

      while (currentParentId !== null && currentParentId !== undefined) {
         if (selection.selected.includes(currentParentId)) {
            hasSelectedParent = true;
            break;
         } else if (selection.excluded.includes(currentParentId)) {
            hasExcludedParent = true;
            break;
         }

         currentParentId = this._getParentId(currentParentId);
      }

      if (!hasExcludedParent && !currentParentId && selection.selected.includes(null)) {
         hasSelectedParent = true;
      }

      return hasSelectedParent;
   }

   private _getStateNode(itemId: TKey, initialState: boolean, selection: ISelection): boolean|null {
      let stateNode: boolean|null = initialState;
      const sourceController = this._nodesSourceControllers.get(itemId);
      const hasMoreData: boolean|void = sourceController ? sourceController.hasMoreData('down') : true;
      const children: Record[] = getChildren(itemId, this._items, this._hierarchyRelation);
      const listKeys = initialState ? selection.excluded : selection.selected;
      let countChildrenInList: boolean|number|null = 0;

      for (let index = 0; index < children.length; index++) {
         const child: Record = children[index];
         const childId: TKey = child.getId();
         const childInList = listKeys.includes(childId);

         if (this._hierarchyRelation.isNode(child)) {
            const stateChildNode = this._getStateNode(childId, childInList ? !initialState : initialState, selection);

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

   private _isAllChildrenExcluded(selection: ISelection, nodeId: TKey): boolean {
      const children = getChildren(nodeId, this._items, this._hierarchyRelation);
      return !children.some((item): boolean => !selection.excluded.includes(item.getId()));
   }

   private _removeChildrenIdsFromSelection(selection: ISelection, nodeId: TKey): void {
      removeSelectionChildren(selection, nodeId, this._items, this._hierarchyRelation);
   }
}
