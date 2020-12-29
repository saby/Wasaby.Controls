import { assert } from 'chai';

import { GridCell, GridCollection, GridRow } from 'Controls/display';
import { Model } from 'Types/entity';

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
        const gridCell = new GridCell({owner: gridRow, column: {}});
        gridRow._$columnItems = [gridCell];

        assert.isTrue(gridCell.isMultiSelectColumn());

        gridRow.getColumns().unshift(new GridCell({owner: gridRow, column: {}}));
        assert.isFalse(gridCell.isMultiSelectColumn());

        gridRow.getColumns().shift(new GridCell({owner: gridRow, column: {}}));
        grid.setMultiSelectVisibility('hidden');
        assert.isFalse(gridCell.isMultiSelectColumn());

        gridRow.setMultiSelectVisibility('visible');
        grid.setMultiSelectPosition('custom');
        assert.isFalse(gridCell.isMultiSelectColumn());
    });
});
