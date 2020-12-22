import { assert } from 'chai';
import { Model } from 'Types/entity';
import { GridCollection, GridHeaderCell, GridHeaderRow } from 'Controls/display';
import {IColumn} from 'Controls/_grid/interface/IColumn';
import {IHeaderCell} from 'Controls/_grid/interface/IHeaderCell';

describe('Controls/display:HeaderCell', () => {

    describe('columns for getColspanStyles', () => {
        let needMultiSelectColumn: boolean;
        let headerColumnConfig: any;
        let columns: IColumn[];
        let columnIndex: number;

        function getHeaderCell(): GridHeaderCell<Model> {
            return new GridHeaderCell({
                owner: {
                    isFullGridSupport: () => true,
                    getHeaderConfig: () => [headerColumnConfig],
                    getColumnsConfig: () => columns,
                    needMultiSelectColumn: () => needMultiSelectColumn,
                    getColumnIndex: () => columnIndex
                },
                column: headerColumnConfig
            });
        }

        beforeEach(() => {
            needMultiSelectColumn = false;
            headerColumnConfig = {};
            columns = [{ width: '1px'}, { width: '1px'}, { width: '1px'}, { width: '1px'}];
        });

        it('should calculate second column as 2 / 3 when no multiselect', () => {
            columnIndex = 1;
            assert.equal(getHeaderCell().getColspanStyles(), 'grid-column: 2 / 3;');
        });

        it('should calculate second column as 2 / 3 when multiselect', () => {
            needMultiSelectColumn = true;
            columnIndex = 1;
            assert.equal(getHeaderCell().getColspanStyles(), 'grid-column: 2 / 3;');
        });
    });

    describe('align and valign', () => {

        it('should use values from header if it exist', () => {
            const headerColumnConfig = {
                align: 'right',
                valign: 'bottom'
            };
            const cell = new GridHeaderCell({
                owner: {
                    getColumnsConfig: () => [{}],
                    getHeaderConfig: () => [headerColumnConfig],
                    needMultiSelectColumn: () => false
                },
                column: headerColumnConfig,
            });
            assert.equal('right', cell.getAlign());
            assert.equal('bottom', cell.getVAlign());
        });

        it('should use values from columns if values on header not exist', () => {
            const headerColumnConfig = {};
            const cell = new GridHeaderCell({
                owner: {
                    getColumnsConfig: () => [{
                        align: 'right',
                        valign: 'bottom'
                    }],
                    getHeaderConfig: () => [headerColumnConfig],
                    needMultiSelectColumn: () => false
                },
                column: headerColumnConfig,
            });
            assert.equal('right', cell.getAlign());
            assert.equal('bottom', cell.getVAlign());
        });

        it('should set valign center on row spanned cell if value on cell config not exists', () => {
            const headerColumnConfig = {
                startRow: 1,
                endRow: 3
            };
            const cell = new GridHeaderCell({
                owner: {
                    getColumnsConfig: () => [{
                        align: 'right',
                        valign: 'bottom'
                    }],
                    getHeaderConfig: () => [headerColumnConfig],
                    needMultiSelectColumn: () => false
                },
                column: headerColumnConfig,
            });
            assert.equal('right', cell.getAlign());
            assert.equal('center', cell.getVAlign());
        });

        it('should set align center on colspanned cell if value on cell config not exists', () => {
            const headerColumnConfig = {
                startColumn: 1,
                endColumn: 3
            };
            const cell = new GridHeaderCell({
                owner: {
                    getColumnsConfig: () => [{
                        align: 'right',
                        valign: 'bottom'
                    }],
                    getHeaderConfig: () => [headerColumnConfig],
                    needMultiSelectColumn: () => false
                },
                column: headerColumnConfig,
            });
            assert.equal('center', cell.getAlign());
            assert.equal('bottom', cell.getVAlign());
        });
    });

    describe('wrapperClasses with and without columnSeparator class', () => {
        let columns: IColumn[];
        let header: IHeaderCell[];
        let gridHeaderRow: GridHeaderRow<Model>;
        let columnSeparatorSize: 's' | null;

        function getGridCollection(): GridCollection<Model> {
            return new GridCollection({
                collection: [{id: 1, name: 'James', surName: 'Bond', salary: '50000$', position: 'Secret agent'}],
                keyProperty: 'id',
                columnSeparatorSize,
                columns,
                header
            });
        }

        function getHeaderCell(grid: GridCollection<Model>, index: number): GridHeaderCell<Model> {
            gridHeaderRow = grid.getHeader().getRow();
            return gridHeaderRow.getColumns()[index] as GridHeaderCell<Model>;
        }

        beforeEach('', () => {
            columns = [{ width: '1px'}, { width: '1px'}, { width: '1px'}, { width: '1px'}];
            header = [
                {startColumn: 1, startRow: 1, endColumn: 2, endRow: 3},
                {startColumn: 2, startRow: 1, endColumn: 4, endRow: 2},
                {startColumn: 4, startRow: 1, endColumn: 4, endRow: 3},
                {startColumn: 2, startRow: 2, endColumn: 3, endRow: 3},
                {startColumn: 3, startRow: 2, endColumn: 4, endRow: 3}
            ];
        });
        it('should add separatorClass according to default separatorSize', () => {
            columnSeparatorSize = 's';
            const grid = getGridCollection();
            const wrapperClasses = getHeaderCell(grid, 1).getWrapperClasses('default', 'default', 'default');
            assert.include(wrapperClasses, 'controls-Grid__columnSeparator_size-s_theme-default');
        });

        it('should add separatorClass according to the column left columnSeparatorSize config', () => {
            columns[1].columnSeparatorSize = {left: 's', right: null};
            const grid = getGridCollection();
            const wrapperClasses1 = getHeaderCell(grid, 1).getWrapperClasses('default', 'default', 'default');
            assert.include(wrapperClasses1, 'controls-Grid__columnSeparator_size-s_theme-default');
        });

        it('shouldn\'t add separatorClass according to the column left columnSeparatorSize config', () => {
            columns[1].columnSeparatorSize = {left: null, right: 's'};
            const grid = getGridCollection();
            const wrapperClasses2 = getHeaderCell(grid, 1).getWrapperClasses('default', 'default', 'default');
            assert.notInclude(wrapperClasses2, 'controls-Grid__columnSeparator_size-s_theme-default');
        });

        it('should add separatorClass according to the previous column right columnSeparatorSize config', () => {
            columns[1].columnSeparatorSize = {left: null, right: 's'};
            const grid = getGridCollection();
            const wrapperClasses = getHeaderCell(grid, 2).getWrapperClasses('default', 'default', 'default');
            assert.include(wrapperClasses, 'controls-Grid__columnSeparator_size-s_theme-default');
        });
    });
});
