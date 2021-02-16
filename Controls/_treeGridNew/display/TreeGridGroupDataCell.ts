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

    getGroupWrapperClasses(expanderVisible: boolean, theme: string): string {
        return 'controls-ListView__groupContent' +
            (expanderVisible === false ? ' controls-ListView__groupContent_cursor-default' : '');
    }

    protected _getWrapperBaseClasses(theme: string, style: string, templateHighlightOnHover: boolean): string {
        let classes = '';
        const preparedStyle = style;

        classes += ` controls-Grid__row-cell controls-Grid__cell_${preparedStyle}`;
        classes += ` controls-Grid__row-cell_${preparedStyle}_theme-${theme}`;
        classes += ` controls-Grid__row-cell_small_min_height-theme-${theme} `;

        return classes;
    }

    protected _getVerticalPaddingClasses(theme: string): string {
        return '';
    }
}
