import {Model} from 'Types/entity';
import {mixin} from 'Types/util';
import {GridGroupCellMixin, IGridRowOptions} from 'Controls/gridNew';
import TreeGridDataCell from 'Controls/_treeGridNew/display/TreeGridDataCell';

export default class TreeGridGroupDataCell<T extends Model>
    extends mixin<TreeGridDataCell<T>, GridGroupCellMixin<any>>(TreeGridDataCell, GridGroupCellMixin) {
    readonly '[Controls/treeGrid:TreeGridGroupDataCell]': boolean;

    readonly _$isExpanded: boolean;

    constructor(options?: IGridRowOptions<T>) {
        super(options);
        GridGroupCellMixin.call(this, options);
    }

    // region overrides

    protected _getWrapperSeparatorClasses(theme: string): string {
        let classes = '';
        classes += ' controls-Grid__no-rowSeparator';
        classes += ' controls-Grid__row-cell_withRowSeparator_size-null';
        return classes;
    }

    protected _getWrapperBaseClasses(theme: string, style: string, templateHighlightOnHover: boolean): string {
        let classes = '';
        classes += ` controls-Grid__row-cell controls-Grid__cell_${style}`;
        classes += ` controls-Grid__row-cell_${style}_theme-${theme}`;
        classes += ` controls-Grid__row-cell_small_min_height-theme-${theme} `;

        return classes;
    }

    protected _getVerticalPaddingClasses(theme: string): string {
        return '';
    }

    // endregion overrides

    // region Аспект "Ячейка группы"

    isExpanded(): boolean {
        return this._$isExpanded;
    }

    // endregion Аспект "Ячейка группы"
}

Object.assign(TreeGridGroupDataCell.prototype, {
    '[Controls/treeGrid:TreeGridGroupDataCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridGroupDataCell',
    _instancePrefix: 'tree-grid-group-data-cell-',
    _$isExpanded: null
});
