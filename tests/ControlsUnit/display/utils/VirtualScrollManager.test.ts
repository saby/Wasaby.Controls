import { assert } from 'chai';

import VirtualScrollManager from 'Controls/_display/utils/VirtualScrollManager';

import { Collection, CollectionItem } from 'Controls/display';
import { List } from 'Types/collection';

interface IListItem {
    id: number;
    visits: number;
}

describe('Controls/_display/utils/VirtualScrollManager', () => {
    let list: List<IListItem>;
    let collection: Collection<IListItem>;
    let manager: VirtualScrollManager;

    beforeEach(() => {
        list = new List({
            items: [
                { id: 1, visits: 0 },
                { id: 2, visits: 0 },
                { id: 3, visits: 0 },
                { id: 4, visits: 0 },
                { id: 5, visits: 0 }
            ]
        });
        collection = new Collection({
            collection: list
        });
        manager = new VirtualScrollManager(collection);
    });

    afterEach(() => {
        collection.destroy();
        list.destroy();
    });

    describe('.each()', () => {
        it('iterates over each item once with correct indices', () => {
            manager.each((item, index) => {
                const contents = (item as CollectionItem<IListItem>).getContents();
                assert.strictEqual(
                    contents,
                    list.at(index),
                    `indices do not match. original list: ${list.getIndex(contents)}, collection: ${index}`
                );
                contents.visits++;
            });

            list.each((item, index) => {
                assert.strictEqual(item.visits, 1, `item at position ${index} was visited ${item.visits} times`);
            });
        });

        it('goes from start index to stop index', () => {
            collection.setViewIndices(1, 3);

            manager.each((item) => {
                (item as CollectionItem<IListItem>).getContents().visits++;
            });

            list.each((item, index) => {
                if (index >= 1 && index < 3) {
                    assert.strictEqual(item.visits, 1, `item at position ${index} was not visited`);
                } else {
                    assert.strictEqual(item.visits, 0, `item at position ${index} was visited`);
                }
            });
        });
    });
});
