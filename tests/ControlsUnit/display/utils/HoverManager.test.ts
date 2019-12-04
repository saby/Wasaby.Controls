import { assert } from 'chai';

import HoverManager from 'Controls/_display/utils/HoverManager';
import { TileCollectionItem } from 'Controls/display';

describe('Controls/_display/utils/HoverManager', () => {
    let collection;
    let manager: HoverManager;

    beforeEach(() => {
        collection = {};
        manager = new HoverManager(collection);
    });

    describe('.setHoveredItem()', () => {
        it('has no hovered item currently', () => {
            const item = new TileCollectionItem();

            manager.setHoveredItem(item);

            assert.isTrue(item.isHovered());
        });

        it('has hovered item currently', () => {
            const item = new TileCollectionItem();
            manager.setHoveredItem(item);

            const newItem = new TileCollectionItem();
            manager.setHoveredItem(newItem);

            assert.isTrue(newItem.isHovered());
            assert.isFalse(item.isHovered());
        });
    });

    it('.getHoveredItem()', () => {
        assert.isNotOk(manager.getHoveredItem());

        const item = new TileCollectionItem();
        manager.setHoveredItem(item);

        assert.strictEqual(manager.getHoveredItem(), item);

        const newItem = new TileCollectionItem();
        manager.setHoveredItem(newItem);

        assert.strictEqual(manager.getHoveredItem(), newItem);
    });
});
