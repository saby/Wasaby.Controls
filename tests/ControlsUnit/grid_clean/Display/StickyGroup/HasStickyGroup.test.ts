import { assert } from 'chai';
import { RecordSet } from 'Types/collection';
import { GridCollection } from 'Controls/gridNew';

const rawData = [
    { key: 1, col1: 'c1-1', col2: 'с2-1', group: 'g1' },
    { key: 2, col1: 'c1-2', col2: 'с2-2', group: 'g1' },
    { key: 3, col1: 'c1-3', col2: 'с2-3', group: 'g2' },
    { key: 4, col1: 'c1-4', col2: 'с2-4', group: 'с2' }
];
const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' }
];

describe('Controls/grid_clean/Display/StickyGroup/HasStickyGroup', () => {
    let collection: RecordSet;

    beforeEach(() => {
        collection = new RecordSet({
            rawData,
            keyProperty: 'key'
        });
    });

    afterEach(() => {
        collection = undefined;
    });

    it('Initialize with stickyHeader and groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            groupProperty: 'group',
            stickyHeader: true,
            columns
        });
        assert.isTrue(gridCollection.hasStickyGroup());
    });
    it('Initialize without stickyHeader and with groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            groupProperty: 'group',
            columns
        });
        assert.isFalse(gridCollection.hasStickyGroup());
    });
    it('Initialize with stickyHeader and without groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            stickyHeader: true,
            columns
        });
        assert.isFalse(gridCollection.hasStickyGroup());
    });
    it('Initialize without stickyHeader and groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns
        });
        assert.isFalse(gridCollection.hasStickyGroup());
    });
});
