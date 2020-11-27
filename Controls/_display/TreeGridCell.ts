import TreeGridRow from 'Controls/_display/TreeGridRow';
import GridRowMixin from 'Controls/_display/GridRowMixin';
import GridDataCell from './GridDataCell';
import GridDataRow from './GridDataRow';

// TODO нужно выделить архитектуру строк и ячеек как в Grid(dataRow, footerRow).
//  Наверное придется переписать на миксины все. Т.к. не понятно как нследоваться в следующем случае:
//  TreeGridCell <- GridCell; GridDataCell < GridCell; TreeGridDataCell <- ???.
//  TreeGridDataCell должен унаследовать TreeGridCell и GridDataCell
export default class TreeGridCell<T> extends GridDataCell<T, GridDataRow<T>> {
    readonly '[Controls/_display/TreeGridCell]': boolean;

    protected _$owner: TreeGridRow<T>;

    protected _getWrapperBaseClasses(theme: string, style: string, templateHighlightOnHover: boolean): string {
        let classes = super._getWrapperBaseClasses(theme, style, templateHighlightOnHover);
        classes += ` controls-TreeGrid__row-cell_theme-${theme} controls-TreeGrid__row-cell_${style || 'default'}_theme-${theme}`;

        if (this._$owner.isNode()) {
            classes += ` controls-TreeGrid__row-cell__node_theme-${theme}`;
        } else if (this._$owner.isNode() === false) {
            classes += ` controls-TreeGrid__row-cell__hiddenNode_theme-${theme}`;
        } else {
            classes += ` controls-TreeGrid__row-cell__item_theme-${theme}`;
        }

        return classes;
    }

    protected _getContentPaddingClasses(theme: string): string {
        let classes = super._getContentPaddingClasses(theme);

        // если текущая колонка первая и для нее не задан мультиселект, то убираем левый отступ
        if (this.isFirstColumn() && this._$owner.getMultiSelectVisibility() === 'hidden') {
            classes += ' controls-TreeGrid__row-cell__firstColumn__contentSpacing_null';
        }

        return classes;
    }
}

Object.assign(GridRowMixin.prototype, {
    '[Controls/_display/TreeGridCell]': true
});
