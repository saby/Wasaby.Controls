import {default as TreeSelectionStrategy} from 'Controls/_operations/MultiSelector/SelectionStrategy/Tree';
import {default as SelectionHelper} from 'Controls/_operations/MultiSelector/SelectionHelper';

type TKeys = number[] | string[];
interface IEntryPath {
   id: String|number,
   parent: String|number
}

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

class DeepTreeSelectionStrategy extends TreeSelectionStrategy {
   public getCount(selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): Promise {
      let countItemsSelected: number|null = 0;
      let items = model.getItems();

      if (!this.isAllSelected(selectedKeys, excludedKeys, model, hierarchyRelation) || this._isAllRootItemsLoaded(model, hierarchyRelation)) {
         for (let index = 0; index < selectedKeys.length; index++) {
            let itemId: string|number|null = selectedKeys[index];
            let item =items.getRecordById(itemId);

            if (!item || SelectionHelper.isNode(item, hierarchyRelation)) {
               let countItemsSelectedInNode: number|null = SelectionHelper.getSelectedChildrenCount(
                  itemId, selectedKeys, excludedKeys, items, hierarchyRelation);

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

   public getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model): Object {
      this._selectedKeysWithEntryPath = this._mergeEntryPath(selectedKeys, model.getItems());
      return super.getSelectionForModel(...arguments);
   }

   public isAllSelected(selectedKeys, excludedKeys, model, hierarchyRelation): boolean {
      let rootId = this._getRoot(model);

      return selectedKeys.includes(rootId) || !excludedKeys.includes(rootId) &&
         this._isParentSelectedWithChild(rootId, selectedKeys, excludedKeys, model, hierarchyRelation);
   }

   protected _selectNode(nodeId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): void {
      super._selectNode(...arguments);
      SelectionHelper.removeSelectionChildren(nodeId, selectedKeys, excludedKeys, model.getItems(), hierarchyRelation);
   }

   protected _unSelectNode(nodeId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): void {
      super._unSelectNode(...arguments);
      SelectionHelper.removeSelectionChildren(nodeId, selectedKeys, excludedKeys, model.getItems(), hierarchyRelation);
   }

   protected _isSelected(item, selectedKeys, excludedKeys, model, hierarchyRelation): boolean|null {
      let itemId = item.getId();
      let items = model.getItems();
      let isSelected: boolean|null = super._isSelected(...arguments);

      if (SelectionHelper.isNode(item, hierarchyRelation)) {
         if (isSelected && this._hasChildrenInList(itemId, excludedKeys, items, hierarchyRelation) ||
            !isSelected && (this._selectedKeysWithEntryPath.includes(itemId) || this._hasChildrenInList(itemId, this._selectedKeysWithEntryPath, items, hierarchyRelation))) {

            isSelected = null;
         }
      }

      return isSelected;
   }

   private _mergeEntryPath(selectedKeys: TKeys, items): void {
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

   protected _isParentSelectedWithChild(itemId: string|number, selectedKeys: TKeys, excludedKeys: TKeys, model, hierarchyRelation): boolean {
      return SelectionHelper.hasSelectedParent(itemId, selectedKeys, excludedKeys, hierarchyRelation, model.getItems());
   }

   private _hasChildrenInList(nodeId, listKeys, items, hierarchyRelation) {
      let hasChildrenInList: boolean = false;
      let children: [] = hierarchyRelation.getChildren(nodeId, items);

      for (let index = 0; index < children.length; index++) {
         let child = children[index];
         let childrenId = child.getId();

         if (listKeys.includes(childrenId) || SelectionHelper.isNode(child, hierarchyRelation) &&
            this._hasChildrenInList(childrenId, listKeys, items, hierarchyRelation)) {

            hasChildrenInList = true;
            break;
         }
      }

      return hasChildrenInList;
   }
}

export default DeepTreeSelectionStrategy;
