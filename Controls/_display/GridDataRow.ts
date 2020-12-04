import GridRow, {IOptions as IGridRowOptions} from './GridRow';
import GridDataCell from './GridDataCell';
import IMarkable from './interface/IMarkable';

export interface IOptions<T> extends IGridRowOptions<T> {
}

export default class GridDataRow<T> extends GridRow<T> implements IMarkable {
    protected _$columnItems: Array<GridDataCell<T, this>>;

    readonly '[Controls/_display/IEditableCollectionItem]': boolean = true;
    readonly Markable: boolean = true;

    constructor(options?: IOptions<T>) {
        super(options);
    }
}

Object.assign(GridRow.prototype, {
    '[Controls/_display/GridDataRow]': true,
    _moduleName: 'Controls/display:GridDataRow',
    _cellModule: 'Controls/display:GridDataCell',
    _instancePrefix: 'grid-data-row-'
});
