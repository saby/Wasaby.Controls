import {Model} from 'Types/entity';
import {mixin} from 'Types/util';
import {GridDataCell, GridGroupCellMixin, IGridRowOptions} from 'Controls/gridNew';
import TreeGridDataCell from 'Controls/_treeGridNew/display/TreeGridDataCell';

export default class TreeGridGroupDataCell<T extends Model>
    extends mixin<TreeGridDataCell<T>, GridGroupCellMixin<any>>(GridDataCell, GridGroupCellMixin) {
    readonly '[Controls/treeGrid:TreeGridGroupDataCell]': boolean;

    constructor(options?: IGridRowOptions<T>) {
        super(options);
        GridGroupCellMixin.call(this, options);
    }
}
