import { assert } from 'chai';

import SwipeManager from 'Controls/_display/utils/SwipeManager';
import { CollectionItem } from 'Controls/display';

describe('Controls/_display/utils/SwipeManager', () => {
    let collection;
    let manager: SwipeManager;

    beforeEach(() => {
        collection = {};
        manager = new SwipeManager(collection);
    });

    describe('.setSwipeItem()', () => {
        it('has no swiped item currently', () => {
            const item = new CollectionItem();

            manager.setSwipeItem(item);

            assert.isTrue(item.isSwiped());
        });

        it('has swiped item currently', () => {
            const item = new CollectionItem();
            manager.setSwipeItem(item);

            const newItem = new CollectionItem();
            manager.setSwipeItem(newItem);

            assert.isTrue(newItem.isSwiped());
            assert.isFalse(item.isSwiped());
        });
    });

    it('.getSwipeItem()', () => {
        assert.isNotOk(manager.getSwipeItem());

        const item = new CollectionItem();
        manager.setSwipeItem(item);

        assert.strictEqual(manager.getSwipeItem(), item);

        const newItem = new CollectionItem();
        manager.setSwipeItem(newItem);

        assert.strictEqual(manager.getSwipeItem(), newItem);
    });
});
