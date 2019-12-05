import { assert } from 'chai';

import MarkerManager from 'Controls/_display/utils/MarkerManager';
import { CollectionItem } from 'Controls/display';

describe('Controls/_display/utils/MarkerManager', () => {
    let collection;
    let manager: MarkerManager;

    beforeEach(() => {
        collection = {};
        manager = new MarkerManager(collection);
    });

    describe('.markItem()', () => {
        it('has no marked item currently', () => {
            const item = new CollectionItem();

            manager.markItem(item);

            assert.isTrue(item.isMarked());
        });

        it('has marked item currently', () => {
            const item = new CollectionItem();
            manager.markItem(item);

            const newItem = new CollectionItem();
            manager.markItem(newItem);

            assert.isTrue(newItem.isMarked());
            assert.isFalse(item.isMarked());
        });
    });

    it('.getMarkedItem()', () => {
        assert.isNotOk(manager.getMarkedItem());

        const item = new CollectionItem();
        manager.markItem(item);

        assert.strictEqual(manager.getMarkedItem(), item);

        const newItem = new CollectionItem();
        manager.markItem(newItem);

        assert.strictEqual(manager.getMarkedItem(), newItem);
    });
});
