import {assert} from 'chai';
import {RecordSet} from 'Types/collection';
import {TreeGridCollection, TreeGridDataRow, TreeGridGroupDataRow} from 'Controls/treeGridNew';

describe('Controls/treeGrid/display/TreeGridGroup/TreeGridDataRow/NodeTypeProperty', () => {
    const recordSet = new RecordSet({
        rawData: [
            {
                id: 1,
                nodeType: 'group',
                parent: null,
                node: true,
                hasChildren: true
            },
            {
                id: 11,
                nodeType: null,
                parent: 1,
                node: true,
                hasChildren: true
            },
            {
                id: 111,
                nodeType: null,
                parent: 11,
                node: true,
                hasChildren: false
            }
        ],
        keyProperty: 'id'
    });

    it('shouldDisplayExpanderPadding return false when direct parent is TreeGridGroupDataRow', () => {
        const owner = {
            getExpanderIcon: () => 'testIcon',
            getExpanderPosition: () => 'default',
            getExpanderSize: () => undefined,
            getExpanderVisibility: () => 'visible'
        } as undefined as TreeGridCollection<any>;

        const parent = new TreeGridGroupDataRow({
            contents: recordSet.at(0),
            columns: [],
            owner
        });
        const child = new TreeGridDataRow({
            contents: recordSet.at(1),
            columns: [],
            parent,
            owner
        });
        const grandChild = new TreeGridDataRow({
            contents: recordSet.at(2),
            columns: [],
            parent: child,
            owner
        });
        assert.isFalse(child.shouldDisplayExpanderPadding(null, null));
        assert.isTrue(grandChild.shouldDisplayExpanderPadding(null, null));
    });
});
