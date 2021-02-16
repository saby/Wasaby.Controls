import { GridFooterRow } from 'Controls/gridNew';
import TreeGridFooterCell from "Controls/_treeGridNew/display/TreeGridFooterCell";

export default class TreeGridFooterRow<S> extends GridFooterRow<S> {
   /**
    * Признак, означающий что в списке есть узел с детьми
    */
   protected _$hasNodeWithChildes: boolean;

   getExpanderSize(): string {
      return this.getOwner().getExpanderSize();
   }

   // region HasNodeWithChildes

   setHasNodeWithChildes(hasNodeWithChildes: boolean): void {
      if (this._$hasNodeWithChildes !== hasNodeWithChildes) {
         this._$hasNodeWithChildes = hasNodeWithChildes;

         this._updateColumnsHasNodeWithChildes(hasNodeWithChildes);

         this._nextVersion();
      }
   }

   protected _updateColumnsHasNodeWithChildes(hasNodeWithChildes: boolean): void {
      this._$columnItems.forEach((cell: TreeGridFooterCell<S>) => {
         cell.setHasNodeWithChildes(hasNodeWithChildes);
      });
   }

   // endregion HasNodeWithChildes
}

Object.assign(TreeGridFooterRow.prototype, {
   '[Controls/treeGrid:TreeGridFooterRow]': true,
   _moduleName: 'Controls/treeGrid:TreeGridFooterRow',
   _instancePrefix: 'tree-grid-footer-row-',
   _cellModule: 'Controls/treeGrid:TreeGridFooterCell',
   _$hasNodeWithChildes: true
});
