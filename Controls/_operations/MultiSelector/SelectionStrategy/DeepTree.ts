import {default as TreeSelectionStrategy} from 'Controls/_operations/MultiSelector/SelectionStrategy/Tree';
import {default as SelectionHelper} from 'Controls/_operations/MultiSelector/SelectionHelper';

type TKeys = number[] | string[];

class DeepTreeSelectionStrategy extends TreeSelectionStrategy {
   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): Promise {
      let countItemsSelected: number|null = 0;

      for (let index = 0; index < selectedKeys.length; index++) {
         let itemId: string|number|null = selectedKeys[index];
         let item = configSelection.items.getRecordById(itemId);

         if (!item || SelectionHelper.isNode(item, hierarchyRelation)) {
            let itemsSelectedInFolder: number|null = SelectionHelper.getSelectedChildrenCount(itemId, selectedKeys, excludedKeys, configSelection.items, configSelection.hierarchyRelation);

            if (itemsSelectedInFolder === null) {
               countItemsSelected = null;
               break;
            } else {
               countItemsSelected += itemsSelectedInFolder;
            }
         }

         if (!excludedKeys.includes(itemId)) {
            countItemsSelected++;
         }
      }

      return new Promise((resolve) => {
         resolve(countItemsSelected);
      });
   }

   public isSelected(item, selectedKeys, excludedKeys, configSelection): boolean|null {
      let itemId = item.getId();
      let isSelected: boolean|null = super.isSelected(...arguments);

      // Надо так же учесть ENTRY_PATH в метаданных
      if (SelectionHelper.isNode(item, hierarchyRelation)) {
         if (isSelected && this._hasChildrenInList(itemId, excludedKeys, items, hierarchyRelation) ||
            !isSelected && this._hasChildrenInList(itemId, selectedKeys, items, hierarchyRelation)) {

            isSelected = null;
         }
      }

      return isSelected;
   }

   public isAllSelected(selectedKeys, excludedKeys, configSelection): boolean {
      let rootId = this._getRoot(configSelection.model);

      return selectedKeys.includes(rootId) || !excludedKeys.includes(rootId) &&
         this._isParentSelectedWithChild(rootId, selectedKeys, excludedKeys, configSelection);
   }

   private _hasChildrenInList(itemId, listKeys, items, hierarchyRelation) {
      let hasChildrenInList: boolean = false;
      let children: [] = hierarchyRelation.getChildren(itemId, items);

      for (let index = 0; index < children.length; index++) {
         let childrenId = children.getId();

         if (listKeys.includes(childrenId) || SelectionHelper.isNode(children, hierarchyRelation) &&
            this._hasChildrenInList(childrenId, listKeys, items, hierarchyRelation)) {

            hasChildrenInList = true;
            break;
         }
      }

      return hasChildrenInList;
   }

   protected _selectNode(nodeId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): void {
      super._selectNode(...arguments);
      SelectionHelper.removeSelectionChildren(nodeId, selectedKeys, excludedKeys, configSelection.items, configSelection.hierarchyRelation);
   }

   protected _unSelectNode(nodeId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): void {
      super._unSelectNode(...arguments);
      SelectionHelper.removeSelectionChildren(nodeId, selectedKeys, excludedKeys, configSelection.items, configSelection.hierarchyRelation);
   }

   protected _isParentSelectedWithChild(itemId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, configSelection: Object): boolean {
      return SelectionHelper.getSelectedParent(
         configSelection.hierarchyRelation, itemId, selectedKeys, excludedKeys, configSelection.items) !== undefined;
   }
}

export default DeepTreeSelectionStrategy;
