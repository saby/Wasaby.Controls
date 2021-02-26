import { GridFooterCell } from 'Controls/gridNew';

export default class TreeGridFooterCell<S> extends GridFooterCell<S> {
   /**
    * Признак, означающий что в списке есть узел с детьми
    */
   protected _$hasNodeWithChildren: boolean;

   getWrapperClasses(
      theme: string,
      backgroundColorStyle: string,
      style: string = 'default',
      templateHighlightOnHover: boolean
   ): string {
      let classes = super.getWrapperClasses(theme, backgroundColorStyle, style, templateHighlightOnHover);

      if (this._shouldDrawExpanderPadding()) {
         const expanderSize = this.getOwner().getExpanderSize() || 'default';
         classes += ` controls-TreeGridView__footer__expanderPadding-${expanderSize}_theme-${theme}`;
      }

      return classes;
   }

   // region HasNodeWithChildren

   setHasNodeWithChildren(hasNodeWithChildren: boolean): void {
      if (this._$hasNodeWithChildren !== hasNodeWithChildren) {
         this._$hasNodeWithChildren = hasNodeWithChildren;
         this._nextVersion();
      }
   }

   // endregion HasNodeWithChildren

   private _shouldDrawExpanderPadding(): boolean {
      const isFirstColumnWithCorrectingForCheckbox = this._$owner.hasMultiSelectColumn() ?
          this.getColumnIndex() === 1 : this.isFirstColumn();
      return isFirstColumnWithCorrectingForCheckbox && this._$hasNodeWithChildren;
   }
}

Object.assign(TreeGridFooterCell.prototype, {
   '[Controls/treeGrid:TreeGridFooterCell]': true,
   _moduleName: 'Controls/treeGrid:TreeGridFooterCell',
   _instancePrefix: 'tree-grid-footer-cell-',
   _$hasNodeWithChildren: true
});
