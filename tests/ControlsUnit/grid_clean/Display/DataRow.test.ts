import { assert } from 'chai';
import { GridDataRow, GridCollection } from 'Controls/display';
import { Record } from 'Types/entity';

const rawData = [{ key: 1, firstStickyProperty: 'first', secondStickyProperty: 'second', caption: 'item_1' }];
const columns = [{
    stickyProperty: ['firstStickyProperty', 'secondStickyProperty']
}, {
    displayProperty: 'caption'
}];

const mockedCollection = {
    getStickyColumnsCount: () => 2,
    hasMultiSelectColumn: () => false,
    hasItemActionsSeparatedCell: () => false,
    getColumnsConfig: () => columns,
    getIndex: () => 0
} as GridCollection<Record>;

describe('Controls/grid_clean/Display/DataRow', () => {
    let record: Record;

    beforeEach(() => {
        record = new Record({
            rawData: rawData
        });
    });

    afterEach(() => {
        record = undefined;
    });

    it('Initialize with ladder', () => {
        const initialLadder = {
            ladder: [{
                firstStickyProperty: {
                    ladderLength: 5
                },
                secondStickyProperty: {
                    ladderLength: 2
                }
            }],
            stickyLadder: [{
                firstStickyProperty: {
                    ladderLength: 5,
                    headingStyle: 'grid-row: span 5'
                },
                secondStickyProperty: {
                    ladderLength: 2,
                    headingStyle: 'grid-row: span 2'
                },
            }]
        };

        const secondLadder = {
            ladder: [{
                firstStickyProperty: {
                    ladderLength: 3
                },
                secondStickyProperty: {
                    ladderLength: 1
                }
            }],
            stickyLadder: [{
                firstStickyProperty: {
                    ladderLength: 3,
                    headingStyle: 'grid-row: span 3'
                },
                secondStickyProperty: {
                    ladderLength: 1,
                    headingStyle: 'grid-row: span 1'
                },
            }]
        };

        const gridRow = new GridDataRow({
            owner: mockedCollection,
            columns,
            contents: record
        });

        gridRow.setLadder(initialLadder);

        let columnsItems = gridRow.getColumns();
        assert.strictEqual(columnsItems.length, 4);
        assert.strictEqual(gridRow.getVersion(), 0, 'The row version after initialize must be equals "0". No other variants!');

        gridRow.setLadder(initialLadder);
        columnsItems = gridRow.getColumns();
        assert.strictEqual(columnsItems.length, 4);
        assert.strictEqual(gridRow.getVersion(), 0, 'The row version after setLadder(currentLadder) must be equals "0". No other variants!');

        gridRow.setLadder(secondLadder);
        columnsItems = gridRow.getColumns();
        assert.strictEqual(columnsItems.length, 4);
        assert.strictEqual(gridRow.getVersion(), 1, 'The row version after setLadder(newLadder) must be equals "1". No other variants!');
    });

});
