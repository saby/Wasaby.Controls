import GridRow, {IOptions as IGridRowOptions} from './GridRow';
import GridDataCell from './GridDataCell';

export interface IOptions<T> extends IGridRowOptions<T> {
}

export default class GridDataRow<T> extends GridRow<T> {
    protected _$columnItems: Array<GridDataCell<T, this>>;

    readonly '[Controls/_display/IEditableCollectionItem]': boolean = true;

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
