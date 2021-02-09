import { assert } from 'chai';
import { GridCollection, GridResultsRow } from 'Controls/gridNew';

const getMockedOwner = (extendedProps = {}): GridCollection<unknown> => {
    return {
        getStickyColumnsCount: () => 0,
        hasMultiSelectColumn: () => false,
        hasItemActionsSeparatedCell: () => false,
        ...extendedProps
    } as GridCollection<unknown>;
};

describe('Controls/grid_clean/Display/Ladder/ResultsRow', () => {

    describe('no grid support', () => {
        it('should not add sticky columns in table layout', () => {
            const columns = [{ title: 'firstColumn' }, { title: 'secondColumn' }];
            const resultsRow = new GridResultsRow({
                owner: getMockedOwner({
                    isFullGridSupport: () => false,
                    getStickyLadder: () => ({
                        first: {ladderLength: 2},
                        second: {ladderLength: 1}
                    }),
                    getColumnsConfig: () => columns,
                    getStickyLadderProperties: () => ['first', 'second']
                }),
                columns
            });

            assert.isArray(resultsRow.getColumns());
            assert.equal(resultsRow.getColumns().length, 2);
            assert.deepEqual(resultsRow.getColumns()[0].getColumnConfig(), { title: 'firstColumn' });
            assert.deepEqual(resultsRow.getColumns()[1].getColumnConfig(), { title: 'secondColumn' });
        });
    });
});
