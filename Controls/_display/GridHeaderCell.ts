import { IHeaderCell } from "../_grid/interface/IHeaderCell";
import GridHeader from "./GridHeader";

export interface IOptions<T> {
    owner: GridHeader<T>;
    headerCell: IHeaderCell;
}

export default class GridHeaderCell<T> {
    protected _$owner: GridHeader<T>;
}

Object.assign(GridHeaderCell.prototype, {
    _moduleName: 'Controls/display:GridHeaderCell',
    _instancePrefix: 'grid-header-cell-',
    _$owner: null
});
