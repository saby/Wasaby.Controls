import { assert } from 'chai';
import { Model } from 'Types/entity';

import { GridCell, GridRow } from 'Controls/display';

describe('Controls/display/GridCell', () => {

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

    // endregion
});
