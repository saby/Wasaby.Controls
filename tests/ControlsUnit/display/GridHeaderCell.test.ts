import { assert } from 'chai';
import { Model } from 'Types/entity';
import { GridHeaderCell } from 'Controls/display';

describe('Controls/display:HeaderCell', () => {

    describe('columns for getColspanStyles', () => {
        let needMultiSelectColumn: boolean;
        let headerColumnConfig: any;
        let columnIndex: number;

        function getHeaderCell(): GridHeaderCell<Model> {
            return new GridHeaderCell({
                owner: {
                    isFullGridSupport: () => true,
                    getHeaderConfig: () => [headerColumnConfig],
                    needMultiSelectColumn: () => needMultiSelectColumn,
                    getColumnIndex: () => columnIndex
                },
                column: headerColumnConfig
            });
        }

        beforeEach(() => {
            needMultiSelectColumn = false;
            headerColumnConfig = {};
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

});
