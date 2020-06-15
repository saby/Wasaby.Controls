import { assert } from 'chai';
import { GridViewModel } from 'Controls/grid';
import { generateFlatData, generateFlatSimpleColumns } from '../_utils/lists';
import { RecordSet } from 'Types/collection';

describe('Controls/grid_clean/GridViewModel', () => {
    describe('getItemDataByItem && searchValue', () => {
        const itemsCount = 3;
        let items: RecordSet;

        beforeEach(() => {
            items = new RecordSet({
                rawData: generateFlatData(itemsCount, false),
                keyProperty: 'key'
            });
        });

        afterEach(() => {
            items = undefined;
        });

        it('Without searchValue.', () => {
            const gridViewModel = new GridViewModel({
                items,
                keyProperty: 'key',
                columns: generateFlatSimpleColumns(),
                multiSelectVisibility: 'hidden'
            });
            const currentRow = gridViewModel.getCurrent();
            let currentColumn = currentRow.getCurrentColumn();
            assert.strictEqual(currentColumn.searchValue, undefined);
            assert.strictEqual(currentColumn.column.needSearchHighlight, false);

            currentRow.goToNextColumn();
            currentColumn = currentRow.getCurrentColumn();
            assert.strictEqual(currentColumn.searchValue, undefined);
            assert.strictEqual(currentColumn.column.needSearchHighlight, false);
        });

        it('With searchValue.', () => {
            const gridViewModel = new GridViewModel({
                items,
                keyProperty: 'key',
                columns: generateFlatSimpleColumns(),
                searchValue: 'item',
                multiSelectVisibility: 'hidden'
            });
            const currentRow = gridViewModel.getCurrent();
            let currentColumn = currentRow.getCurrentColumn();
            assert.strictEqual(currentColumn.searchValue, 'item');
            assert.strictEqual(currentColumn.column.needSearchHighlight, false);

            currentRow.goToNextColumn();
            currentColumn = currentRow.getCurrentColumn();
            assert.strictEqual(currentColumn.searchValue, 'item');
            assert.strictEqual(currentColumn.column.needSearchHighlight, true);
        });
    });
});
