import GridCell, {IOptions as IGridCellOptions} from './GridCell';
import GridDataRow from './GridDataRow';

export interface IOptions<T> extends IGridCellOptions<T> {
}

export default class GridDataCell<T, TOwner extends GridDataRow<T>> extends GridCell<T, TOwner> {
}

Object.assign(GridDataCell.prototype, {
    '[Controls/_display/GridDataCell]': true,
    _moduleName: 'Controls/display:GridDataCell',
    _instancePrefix: 'grid-data-cell-'
});
