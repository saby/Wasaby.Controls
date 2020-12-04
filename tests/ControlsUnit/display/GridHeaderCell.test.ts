import { assert } from 'chai';

import { GridHeaderCell, GridHeaderRow } from 'Controls/display';

describe('Controls/display/HeaderRow', () => {


    describe('tag', () => {

        const getOwnerMock = () => ({
            isMultiline: () => false,
            isFullGridSupport: () => true,
            getColumnIndex: () => 0
        });

        it('should ', function () {
            const cell = new GridHeaderCell({
                owner: getOwnerMock(),
                column: {
                    startRow: 1,
                    endRow: 4,
                    startColumn: 1,
                    endColumn: 3
                }
            });

            assert.equal(cell.getColspanStyles(), 'grid-column: 1 / 3;');
        });
    });

});
