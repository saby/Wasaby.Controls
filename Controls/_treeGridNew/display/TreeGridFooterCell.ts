import { GridFooterCell } from 'Controls/gridNew';

export default class TreeGridFooterCell<S> extends GridFooterCell<S> {
   getWrapperClasses(
      theme: string,
      backgroundColorStyle: string,
      style: string = 'default',
      templateHighlightOnHover: boolean
   ): string {
      let classes = super.getWrapperClasses(theme, backgroundColorStyle, style, templateHighlightOnHover);

      const isFirstColumnWithCorrectingForCheckbox = this._$owner.hasMultiSelectColumn() ?
          this.getColumnIndex() === 1 : this.isFirstColumn();

      // todo shouldDrawExpanderPadding https://online.sbis.ru/opendoc.html?guid=c407c670-f342-4388-9466-1389ff5b1848
      if (isFirstColumnWithCorrectingForCheckbox) {
         const expanderSize = this.getOwner().getExpanderSize() || 'default';
         classes += ` controls-TreeGridView__footer__expanderPadding-${expanderSize}_theme-${theme}`;
      }
      return classes;
   }
}

Object.assign(TreeGridFooterCell.prototype, {
   '[Controls/treeGrid:TreeGridFooterCell]': true,
   _moduleName: 'Controls/treeGrid:TreeGridFooterCell',
   _instancePrefix: 'tree-grid-footer-cell-'
});
