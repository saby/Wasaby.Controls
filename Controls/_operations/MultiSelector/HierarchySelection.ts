import Selection from 'Controls/_operations/MultiSelector/Selection';
import {relation} from 'Types/entity';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import {default as SelectionHelper} from 'Controls/_operations/MultiSelector/SelectionHelper';
import {default as TreeSelectionStrategy} from 'Controls/_operations/MultiSelector/SelectionStrategy/Tree';

type TKeys = number[] | string[];

interface ISelection {
   selectedKeys: TKeys,
   excludedKeys: TKeys
}
/**
 * @class Controls/_operations/MultiSelector/HierarchySelection
 * @extends Controls/_operations/MultiSelector/Selection
 * @author Авраменко А.С.
 * @private
 */

/**
 * @name Controls/_operations/MultiSelector/HierarchySelection#nodeProperty
 * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
 */

/**
 * @name Controls/_operations/MultiSelector/HierarchySelection#parentProperty
 * @cfg {String} Name of the field that contains information about parent node.
 */

const ALL_SELECTION_VALUE = null;
const FIELD_ENTRY_PATH = 'ENTRY_PATH';

class HierarchySelection extends Selection {
   protected _selectionStrategy: TreeSelectionStrategy;
   protected _hierarchyRelation: relation.Hierarchy;

   constructor(options: Object): void {
      super(options);

      this._hierarchyRelation = new relation.Hierarchy({
         keyProperty: options.keyProperty || 'id',
         parentProperty: options.parentProperty || 'Раздел',
         nodeProperty: options.nodeProperty || 'Раздел@',
         declaredChildrenProperty: options.hasChildrenProperty || 'Раздел$'
      });
   }

   public select(keys: TKeys): void {
      let selection: ISelection = this._selectionStrategy.select(keys, this._selectedKeys, this._excludedKeys, this._listModel, this._hierarchyRelation);

      this._selectedKeys = selection.selectedKeys;
      this._excludedKeys = selection.excludedKeys;
   }

   public unselect(keys: TKeys): void {
      let selection: ISelection = this._selectionStrategy.unSelect(keys, this._selectedKeys, this._excludedKeys, this._listModel, this._hierarchyRelation);

      this._selectedKeys = selection.selectedKeys;
      this._excludedKeys = selection.excludedKeys;
   }

   public selectAll(): void {
      let rootId = this._getRoot();

      if (rootId === ALL_SELECTION_VALUE) {
         super.selectAll();
      } else {
         this.select([rootId]);
         this._removeSelectionChildren(rootId);
      }

      this._excludedKeys = ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [this._getRoot()]);
   }

    /* toDo Когда пытаются снять выделение, надо его снимать полностью для всех разделов
    Иначе сейчас люди в окнах выбора не могут снять выделение. Запись может быть выделена глубоко в иерархии
    Поправится после задачи https://online.sbis.ru/opendoc.html?guid=d48b9e94-5236-429c-b124-d3b3909886c9

   public unselectAll(): void {
      let rootId: string|number|null = this._getRoot();

      if (this._listModel.getItems().getMetaData()[FIELD_ENTRY_PATH]) {
         this.unselect([rootId]);
         this._removeSelectionChildren(rootId);
         this._excludedKeys = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, [rootId]);
      } else {
         super.unselectAll();
      }
   } */

   public toggleAll(): void {
      let
         rootId = this._getRoot(),
         oldSelectedKeys = this._selectedKeys.slice(),
         oldExcludedKeys = this._excludedKeys.slice(),
         childrenIdsRoot = SelectionHelper.getChildrenIds(rootId, this._listModel.getItems(), this._hierarchyRelation);

      if (this._selectionStrategy.isAllSelected(this._selectedKeys, this._excludedKeys, this._listModel, this._hierarchyRelation)) {
         // toDO после решения https://online.sbis.ru/opendoc.html?guid=d48b9e94-5236-429c-b124-d3b3909886c9 перейти на unselectAll
         this.unselect([rootId]);
         this._removeSelectionChildren(rootId);
         this._excludedKeys = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, [rootId]);
         this.select(ArraySimpleValuesUtil.getIntersection(childrenIdsRoot, oldExcludedKeys));
      } else {
         this.selectAll([rootId]);
         // toDO Надо делать через getIntersection, если пришел ENTRY_PATH
         this.unselect(oldSelectedKeys);
      }
   }

   public getCount(): Promise {
      return this._selectionStrategy.getCount(this._selectedKeys, this._excludedKeys, this._listModel, this._hierarchyRelation);
   }

   public updateSelectionForRender(): void {
      this._listModel.updateSelection(this._selectionStrategy.getSelectionForModel(
         this._selectedKeys, this._excludedKeys, this._listModel, this._hierarchyRelation));
   }

   private _getRoot(): string|number|null {
      return this._listModel.getRoot().getContents();
   }

   private _removeSelectionChildren(nodeId) {
      SelectionHelper.removeSelectionChildren(nodeId, this._selectedKeys, this._excludedKeys, this._listModel.getItems(), this._hierarchyRelation);
   }
}

export default HierarchySelection;
