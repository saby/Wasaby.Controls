import BaseSelectionStrategy from 'Controls/_operations/MultiSelector/SelectionStrategy/Base';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import getSelectedChildrenCount from 'Controls/_operations/MultiSelector/getSelectedChildrenCount';
import { isNode, getParentProperty, getItems, getChildren } from 'Controls/_operations/MultiSelector/ModelCompability';
import clone = require('Core/core-clone');

import { relation, Record } from 'Types/entity';
import { Tree as TreeCollection } from 'Controls/display';
import { ViewModel } from 'Controls/treeGrid';
import { RecordSet } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection,
   ISelectionStrategy, ISelectionStrategyOptions, ISelectionQuery as IQueryParams } from 'Controls/interface/';

/**
 * Стратегия выбора для иерархического списка, для работы с ним как с плоским.
 * Записи не зависимы между собой, выбор родительских узлов никак не отражается на их детей.
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Tree
 * @mixes Controls/_interface/ISelectionStrategy
 * @control
 * @public
 * @author Капустин И.А.
 */
export default class TreeSelectionStrategy extends BaseSelectionStrategy {
   select(selection: ISelection, keys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): ISelection {
      selection = clone(selection);

      keys.forEach((key) => {
         let item: Record = getItems(model).getRecordById(key);

         if (!item || isNode(item, model, hierarchyRelation)) {
            this._selectNode(selection, key, model, hierarchyRelation);
         } else {
            this._selectLeaf(selection, key, model, hierarchyRelation);
         }
      });

      return selection;
   }

   unSelect(selection: ISelection, keys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): ISelection {
      selection = clone(selection);

      keys.forEach((key) => {
         let item: Record = getItems(model).getRecordById(key);

         if (!item || isNode(item, model, hierarchyRelation)) {
            this._unSelectNode(selection, key, model, hierarchyRelation);
         } else {
            this._unSelectLeaf(selection, key, model, hierarchyRelation);
         }
      });

      return selection;
   }

   protected _getCount(selection: ISelection, model: TreeCollection|ViewModel, queryParams: IQueryParams, hierarchyRelation: relation.Hierarchy): number|null {
      let countItemsSelected: number|null = 0;
      let rootId: TKey = this._getRoot(model);
      let selectedNodes: TKeys;

      if (!this.isAllSelected(selection, rootId, model, hierarchyRelation) || this._isAllRootItemsLoaded(model, hierarchyRelation)) {
         selectedNodes = ArraySimpleValuesUtil.getIntersection(selection.selected, selection.excluded);
         countItemsSelected = selection.selected.length - selectedNodes.length;

         for (let index = 0; index < selectedNodes.length; index++) {
            let nodeKey: TKey = selectedNodes[index];
            let countItemsSelectedInNode: number|null = getSelectedChildrenCount(
               nodeKey, selection, model, hierarchyRelation, false);

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

   getSelectionForModel(selection: ISelection, model: TreeCollection|ViewModel, limit: number, keyProperty: string, hierarchyRelation: relation.Hierarchy): Map<TKey, boolean> {
      let selectionResult: Map<TKey, boolean> = new Map();

      getItems(model).forEach((item) => {
         let itemId: TKey = item.getId();
         let parentId: TKey|undefined = this._getParentId(itemId, model, hierarchyRelation);
         let isSelected: boolean = !selection.excluded.includes(itemId) && (selection.selected.includes(itemId) ||
            this.isAllSelected(selection, parentId, model, hierarchyRelation));

         if (isSelected !== false) {
            selectionResult.set(item.getId(), isSelected);
         }
      });

      return selectionResult;
   }

   isAllSelected(selection: ISelection, nodeId: Tkey): boolean {
      return selection.selected.includes(nodeId) && selection.excluded.includes(nodeId);
   }

   protected _selectNode(): void {
      this._selectLeaf(...arguments);
   }

   protected _unSelectNode(): void {
      this._unSelectLeaf(...arguments);
   }

   private _selectLeaf(selection: ISelection, leafId: string|number): void {
      if (selection.excluded.includes(leafId)) {
         ArraySimpleValuesUtil.removeSubArray(selection.excluded, [leafId]);
      } else {
         ArraySimpleValuesUtil.addSubArray(selection.selected, [leafId]);
      }
   }

   private _unSelectLeaf(selection: ISelection, leafId: string|number, model: TreeCollection|ViewModel, hierarchyRelation: relation.Hierarchy): void {
      let parentId: TKey|undefined = this._getParentId(leafId, model, hierarchyRelation);

      ArraySimpleValuesUtil.removeSubArray(selection.selected, [leafId]);
      if (this.isAllSelected(selection, parentId, model, hierarchyRelation)) {
         ArraySimpleValuesUtil.addSubArray(selection.excluded, [leafId]);
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

   private _getParentId(itemId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): TKey|undefined {
      let parentProperty: string = getParentProperty(model, hierarchyRelation);
      let item: Record|undefined = getItems(model).getRecordById(itemId);

      return item && item.get(parentProperty);
   };
}
