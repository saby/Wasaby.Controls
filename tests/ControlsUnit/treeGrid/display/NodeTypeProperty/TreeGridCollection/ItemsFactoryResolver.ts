import {assert} from 'chai';
import {RecordSet} from 'Types/collection';
import {TreeGridCollection, TreeGridDataRow, TreeGridGroupDataRow} from 'Controls/treeGridNew';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridCollection/ItemsFactoryResolver', () => {
    let collection: TreeGridCollection<any>;
    const recordSet = new RecordSet({
        rawData: [
            {
                id: 1,
                nodeType: 'group',
                parent: null,
                node: true,
                hasChildren: false
            },
            {
                id: 2,
                nodeType: 'wrong',
                parent: null,
                node: true,
                hasChildren: false
            },
            {
                id: 3,
                parent: null,
                node: true,
                hasChildren: false
            }
        ],
        keyProperty: 'id'
    });

    beforeEach(() => {
        collection = new TreeGridCollection({
            nodeTypeProperty: 'nodeType',
            columns: [],
            collection: recordSet
        });
    });

    describe('.items', () => {
        it('should not add itemModule property', () => {
            assert.instanceOf(collection.at(0), TreeGridGroupDataRow);
        });

        it('should not add itemModule property', () => {
            assert.instanceOf(collection.at(0), TreeGridDataRow);
        });

        it('should add itemModule property', () => {
            assert.instanceOf(collection.at(0), TreeGridDataRow);
        });
    });
});
