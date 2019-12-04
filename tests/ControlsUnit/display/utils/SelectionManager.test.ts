import { assert } from 'chai';

import SelectionManager from 'Controls/_display/utils/SelectionManager';
import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';

interface IListItem {
    id: string;
}

describe('Controls/_display/utils/SelectionManager', () => {
    it('.setSelection()', () => {
        const items: IListItem[] = [
            { id: 'default' },
            { id: 'selected' },
            { id: 'not-selected' },
            { id: 'null-selected' }
        ];
        const list = new RecordSet({
            rawData: items,
            keyProperty: 'id'
        });
        const collection = new Collection<Record>({
            collection: list,
            keyProperty: 'id'
        });
        const manager = new SelectionManager(collection);

        const testMap = new Map<string, boolean|null>([
            ['selected', true],
            ['not-selected', false],
            ['null-selected', null]
        ]);
        manager.setSelection(testMap);

        assert.isFalse(collection.getItemBySourceId('default').isSelected());
        assert.isTrue(collection.getItemBySourceId('selected').isSelected());
        assert.isFalse(collection.getItemBySourceId('not-selected').isSelected());
        assert.isNull(collection.getItemBySourceId('null-selected').isSelected())
    });
});
