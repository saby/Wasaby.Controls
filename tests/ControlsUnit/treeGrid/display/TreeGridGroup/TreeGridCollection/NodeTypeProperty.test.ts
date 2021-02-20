import {assert} from 'chai';
import {RecordSet} from 'Types/collection';
import {TreeGridCollection, TreeGridDataRow, TreeGridGroupDataRow} from 'Controls/treeGridNew';

describe('Controls/treeGrid/display/TreeGridGroup/TreeGridCollection/NodeTypeProperty', () => {
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

    it('Set nodeTypeProperty using setter', () => {
        collection = new TreeGridCollection({
            columns: [],
            collection: recordSet
        });

        assert.equal(collection.getNodeTypeProperty(), undefined);
        assert.strictEqual(collection.getVersion(), 1);

        collection.setNodeTypeProperty('nodeType');

        assert.equal(collection.getNodeTypeProperty(), 'nodeType');
        assert.strictEqual(collection.getVersion(), 2);
    });

    it('Set nodeTypeProperty via constructor', () => {
        assert.equal(collection.getNodeTypeProperty(), 'nodeType');
    });

    it('createItem with correct nodeTypeProperty', () => {
        assert.instanceOf(collection.getItemBySourceIndex(0), TreeGridGroupDataRow);
    });

    it('createItem with wrong nodeTypeProperty', () => {
        assert.instanceOf(collection.getItemBySourceIndex(1), TreeGridDataRow);
    });

    it('createItem without nodeTypeProperty', () => {
        assert.instanceOf(collection.getItemBySourceIndex(2), TreeGridDataRow);
    });
});
