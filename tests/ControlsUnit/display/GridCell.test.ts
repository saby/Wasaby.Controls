import { assert } from 'chai';

import { GridCell, GridCollection, GridRow } from 'Controls/display';
import { Model } from 'Types/entity';
import {IColumn} from 'Controls/grid';

describe('Controls/display:Cell', () => {

    // region Аспект "Кнопка редактирования"

    describe('editArrow', () => {
        let cell: GridCell<Model, GridRow<Model>>;

        beforeEach(() => {
            cell = new GridCell();
        });

        it('shouldDisplayEditArrow', () => {
            assert.isFalse(cell.shouldDisplayEditArrow());
        });
    });

    describe('isMultiSelectColumn', () => {
        const grid = new GridCollection({collection: [{id: 1}], keyProperty: 'id', multiSelectVisibility: 'visible', multiSelectPosition: 'default' });
        const gridRow = new GridRow({owner: grid});
        const gridCell = new GridCell({owner: gridRow});
        gridRow._$columnItems = [gridCell];

        assert.isTrue(gridCell.isMultiSelectColumn());

        gridRow.getColumns().unshift({});
        assert.isFalse(gridCell.isMultiSelectColumn());

        gridRow.getColumns().shift({});
        grid.setMultiSelectVisibility('hidden');
        assert.isFalse(gridCell.isMultiSelectColumn());

        gridRow.setMultiSelectVisibility('visible');
        grid.setMultiSelectPosition('custom');
        assert.isFalse(gridCell.isMultiSelectColumn());
    });

    describe('wrapperClasses with and without columnSeparator class', () => {
        let columns: IColumn[];
        let gridRow: GridRow<Model>;
        let columnSeparatorSize: 's' | null;

        function getGridCollection(): GridCollection<Model> {
            return new GridCollection({
                collection: [{id: 1, name: 'James', surName: 'Bond', salary: '50000$', position: 'Secret agent'}],
                keyProperty: 'id',
                columnSeparatorSize,
                columns
            });
        }

        function getCell(grid: GridCollection<Model>, index: number): GridCell<Model, GridRow<Model>> {
            gridRow = grid.at(0) as GridRow<Model>;
            return gridRow.getColumns()[index] as GridCell<Model, GridRow<Model>>;
        }

        beforeEach('', () => {
            columns = [{ width: '1px'}, { width: '1px'}, { width: '1px'}, { width: '1px'}];
        });

        it('should add separatorClass according to default separatorSize', () => {
            columnSeparatorSize = 's';
            const grid = getGridCollection();
            const wrapperClasses = getCell(grid, 1).getWrapperClasses('default', 'default', 'default', true);
            assert.include(wrapperClasses, 'controls-Grid__columnSeparator_size-s_theme-default');
        });

        it('should add separatorClass according to the column left columnSeparatorSize config', () => {
            columns[1].columnSeparatorSize = {left: 's', right: null};
            const grid = getGridCollection();
            const wrapperClasses1 = getCell(grid, 1).getWrapperClasses('default', 'default', 'default', true);
            assert.include(wrapperClasses1, 'controls-Grid__columnSeparator_size-s_theme-default');
        });

        it('shouldn\'t add separatorClass according to the column left columnSeparatorSize config', () => {
            columns[1].columnSeparatorSize = {left: null, right: 's'};
            const grid = getGridCollection();
            const wrapperClasses2 = getCell(grid, 1).getWrapperClasses('default', 'default', 'default', true);
            assert.notInclude(wrapperClasses2, 'controls-Grid__columnSeparator_size-s_theme-default');
        });

        it('should add separatorClass according to the previous column right columnSeparatorSize config', () => {
            columns[1].columnSeparatorSize = {left: null, right: 's'};
            const grid = getGridCollection();
            const wrapperClasses = getCell(grid, 2).getWrapperClasses('default', 'default', 'default', true);
            assert.include(wrapperClasses, 'controls-Grid__columnSeparator_size-s_theme-default');
        });
    });
});
