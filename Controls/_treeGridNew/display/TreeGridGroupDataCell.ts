import {Model} from 'Types/entity';
import {mixin} from 'Types/util';
import {GridDataCell, GridGroupCellMixin} from 'Controls/gridNew';
import TreeGridDataCell from 'Controls/_treeGridNew/display/TreeGridDataCell';
import {IOptions} from "Controls/_gridNew/display/Row";

export default class TreeGridGroupDataCell<T extends Model>
    extends mixin<TreeGridDataCell<T>, GridGroupCellMixin<any>>(GridDataCell, GridGroupCellMixin) {
    readonly '[Controls/treeGrid:TreeGridGroupDataCell]': boolean;

    constructor(options?: IOptions<T>) {
        super(options);
        GridGroupCellMixin.call(this, options);
    }
}
