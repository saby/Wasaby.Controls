import GridHeader, {IOptions as IGridHeaderOptions} from './GridHeader';

export default class GridTableHeader<T> extends GridHeader<T> {
    getBodyClasses(theme: string = 'default'): string {
        return `controls-Grid__header controls-Grid__header_theme-${theme}`;
    }
}

Object.assign(GridTableHeader.prototype, {
    _moduleName: 'Controls/display:GridTableHeader',
    _instancePrefix: 'grid-table-header-',
    _rowModule: 'Controls/display:GridTableHeaderRow',
});
