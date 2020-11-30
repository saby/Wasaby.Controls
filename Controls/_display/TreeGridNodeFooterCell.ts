import TreeGridCell from 'Controls/_display/TreeGridCell';

export default class TreeGridNodeFooterCell<T> extends TreeGridCell<T> {
    readonly '[Controls/_display/TreeGridCell]': boolean;

    getContentClasses(
        theme: string,
        backgroundColorStyle: string,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean = true
    ): string {
        // TODO
        const rowSeparatorSize = null;

        let classes =
            'controls-TreeGrid__nodeFooterContent ' +
            `controls-TreeGrid__nodeFooterContent_theme-${theme} ` +
            `controls-TreeGrid__nodeFooterContent_rowSeparatorSize-${rowSeparatorSize}_theme-${theme}`;

        if (this._$owner.getColumns().length === 1) {
            /*if (!this.isFirstColumn()) {
                classes += ` controls-TreeGrid__nodeFooterCell_columnSeparator-size_${current.getSeparatorForColumn(columns, index, current.columnSeparatorSize)}_theme-${theme}`;
            }*/
            if (this._$owner.getMultiSelectVisibility() === 'hidden' && this.isFirstColumn()) {
                classes += ` controls-TreeGrid__nodeFooterContent_spacingLeft-${this._$owner.getLeftPadding()}_theme-${theme}`;
            }

            if (this.isLastColumn()) {
                classes += ` controls-TreeGrid__nodeFooterContent_spacingRight-${this._$owner.getRightPadding()}_theme-${theme}`;
            }
        } else {
            if (this._$owner.getMultiSelectVisibility() === 'hidden') {
                classes += ` controls-TreeGrid__nodeFooterContent_spacingLeft-${this._$owner.getLeftPadding()}_theme-${theme}`;
            }
            classes += ` controls-TreeGrid__nodeFooterContent_spacingRight-${this._$owner.getRightPadding()}_theme-${theme}`;
            // classes += ` ${COLUMN_SCROLL_JS_SELECTORS.FIXED_ELEMENT} ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
        }

        return classes;
    }

    getColspanStyles(): string {
        return 'grid-column: 1 / ' + (this._$owner.getColumns().length + 1);
    }
}

Object.assign(TreeGridNodeFooterCell.prototype, {
    '[Controls/_display/TreeGridNodeFooterCell]': true,
    _moduleName: 'Controls/display:TreeGridNodeFooterCell',
    _instancePrefix: 'tree-grid-node-footer-cell'
});
