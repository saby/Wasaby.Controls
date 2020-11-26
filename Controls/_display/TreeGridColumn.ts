import GridColumn from './GridColumn';
import TreeGridCollectionItem from 'Controls/_display/TreeGridCollectionItem';
import GridItemMixin from 'Controls/_display/GridItemMixin';

export default class TreeGridColumn<T> extends GridColumn<T> {
    readonly '[Controls/_display/TreeGridColumn]': boolean;

    protected _$owner: TreeGridCollectionItem<T>;

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

Object.assign(GridItemMixin.prototype, {
    '[Controls/_display/TreeGridColumn]': true
});
