import GridCell, {IOptions as IGridCellOptions} from './GridCell';
import GridDataRow from './GridDataRow';

export interface IOptions<T> extends IGridCellOptions<T> {
}

export default class GridDataCell<T, TOwner extends GridDataRow<T>> extends GridCell<T, TOwner> {

    // region Аспект "Маркер"
    shouldDisplayMarker(marker: boolean, markerPosition: 'left' | 'right' = 'left'): boolean {
        if (markerPosition === 'right') {
            return marker !== false && this._$owner.isMarked() && this.isLastColumn();
        } else {
            return marker !== false && this._$owner.isMarked() &&
                this._$owner.getMultiSelectVisibility() === 'hidden' && this.isFirstColumn();
        }
    }
    // region
}

Object.assign(GridDataCell.prototype, {
    '[Controls/_display/GridDataCell]': true,
    _moduleName: 'Controls/display:GridDataCell',
    _instancePrefix: 'grid-data-cell-'
});
