import {Model} from 'Types/entity';
import {mixin} from 'Types/util';
import {GridGroupCellMixin, IGridRowOptions} from 'Controls/gridNew';
import TreeGridDataCell from 'Controls/_treeGridNew/display/TreeGridDataCell';

export default class TreeGridGroupDataCell<T extends Model>
    extends mixin<TreeGridDataCell<T>, GridGroupCellMixin<any>>(TreeGridDataCell, GridGroupCellMixin) {
    readonly '[Controls/treeGrid:TreeGridGroupDataCell]': boolean;

    constructor(options?: IGridRowOptions<T>) {
        super(options);
        GridGroupCellMixin.call(this, options);
    }

    // region groupItem

    getGroupWrapperClasses(expanderVisible: boolean, theme: string): string {
        return 'controls-ListView__groupContent' +
            (expanderVisible === false ? ' controls-ListView__groupContent_cursor-default' : '');
    }

    // endregion groupItem

    // region Cell

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

    // endregion Cell
}
