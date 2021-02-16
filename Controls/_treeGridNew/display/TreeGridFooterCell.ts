import { GridFooterCell } from 'Controls/gridNew';

export default class TreeGridFooterCell<S> extends GridFooterCell<S> {
   /**
    * Признак, означающий что в списке есть узел с детьми
    */
   protected _$hasNodeWithChildes: boolean;

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

   // region HasNodeWithChildes

   setHasNodeWithChildes(hasNodeWithChildes: boolean): void {
      if (this._$hasNodeWithChildes !== hasNodeWithChildes) {
         this._$hasNodeWithChildes = hasNodeWithChildes;
         this._nextVersion();
      }
   }

   // endregion HasNodeWithChildes

   private _shouldDrawExpanderPadding(): boolean {
      const isFirstColumnWithCorrectingForCheckbox = this._$owner.hasMultiSelectColumn() ?
          this.getColumnIndex() === 1 : this.isFirstColumn();
      return isFirstColumnWithCorrectingForCheckbox && this._$hasNodeWithChildes;
   }
}

Object.assign(TreeGridFooterCell.prototype, {
   '[Controls/treeGrid:TreeGridFooterCell]': true,
   _moduleName: 'Controls/treeGrid:TreeGridFooterCell',
   _instancePrefix: 'tree-grid-footer-cell-',
   _$hasNodeWithChildes: true
});
