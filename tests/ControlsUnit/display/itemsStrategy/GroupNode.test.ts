import {assert} from 'chai';
import {RecordSet} from 'Types/collection';
import {Collection, itemsStrategy} from 'Controls/display';

describe('Controls/_display/itemsStrategy/GroupNode', () => {
    let recordSet;
    let collection;

    function createStrategy(): itemsStrategy.GroupNode {
        return new itemsStrategy.GroupNode({
            display: collection,
            nodeTypeProperty: 'nodeType',
            groupNodeItemModule: 'Controls/treeGrid:TreeGridGroupDataRow'
        });
    }

    beforeEach(() => {
        collection = {
            createItem: (options) => options,
            getCollectionCount: () => 1,
            getCollection: () => recordSet
        } as undefined as Collection;
    });

    describe('.items', () => {
        it('should not add itemModule property', () => {
            recordSet = new RecordSet({
                rawData: [{ id: 1, nodeType: null }],
                keyProperty: 'id'
            });
            const strategy = createStrategy();
            assert.equal(strategy.items[0].itemModule, undefined);
        });

        it('should not add itemModule property', () => {
            recordSet = new RecordSet({
                rawData: [{ id: 1, nodeType: 'fake' }],
                keyProperty: 'id'
            });
            const strategy = createStrategy();
            assert.equal(strategy.items[0].itemModule, undefined);
        });

        it('should add itemModule property', () => {
            recordSet = new RecordSet({
                rawData: [{ id: 1, nodeType: 'group' }],
                keyProperty: 'id'
            });
            const strategy = createStrategy();
            assert.equal(strategy.items[0].itemModule, 'Controls/treeGrid:TreeGridGroupDataRow');
        });
    });
});
