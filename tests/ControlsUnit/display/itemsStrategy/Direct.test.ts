import Direct from 'Controls/_display/itemsStrategy/Direct';

import {
    Collection as CollectionDisplay,
    CollectionItem
} from 'Controls/display';

import {
    List,
    Enum
} from 'Types/collection';

describe('Controls/_display/itemsStrategy/Direct', () => {
    function getStrategy<T>(display: CollectionDisplay<T>): Direct<T> {
        return new Direct({
            display
        });
    }

    let items;
    let list;
    let display;
    let strategy;

    beforeEach(() => {
        items = [1, 2, 3];
        list = new List({items});
        display = new CollectionDisplay({collection: list});
        strategy = getStrategy(display);
    });

    afterEach(() => {
        items = undefined;
        list = undefined;
        display = undefined;
        strategy = undefined;
    });

    describe('.at()', () => {
        it('should return a CollectionItem', () => {
            items.forEach((item, index) => {
                assert.instanceOf(strategy.at(index), CollectionItem);
                assert.strictEqual(strategy.at(index).getContents(), item);
            });
        });

        it('should return the same CollectionItem twice', () => {
            items.forEach((item, index) => {
                assert.strictEqual(strategy.at(index), strategy.at(index));
            });
        });
    });

    describe('.count', () => {
        it('should return items count for List', () => {
            assert.strictEqual(strategy.count, items.length);
        });

        it('should return items count for Enumerable', () => {
            const list = new Enum({dictionary: items});
            const display = new CollectionDisplay({collection: list});
            const strategy = getStrategy(display);

            assert.strictEqual(strategy.count, items.length);
        });

        it('should return intitial items count if List count changed', () => {
            const expect = list.getCount();
            assert.strictEqual(strategy.count, expect);
            list.removeAt(0);
            assert.strictEqual(strategy.count, expect);
        });
    });

    describe('.items', () => {
        it('should return an items', () => {
            assert.strictEqual(strategy.items.length, items.length);
            items.forEach((item, index) => {
                assert.strictEqual(strategy.items[index].getContents(), items[index]);
            });
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            assert.strictEqual(strategy.items.length, items.length);

            items.splice(0, 0, 4, 5);
            strategy.splice(0, 0, items.slice(0, 2));
            assert.strictEqual(strategy.items.length, items.length);
            assert.strictEqual(strategy.items[0].getContents(), items[0]);
            assert.strictEqual(strategy.items[1].getContents(), items[1]);
        });

        it('should remove items', () => {
            strategy.splice(0, 2);
            assert.strictEqual(strategy.items.length, items.length - 2);
        });
    });

    describe('.reset()', () => {
        it('should re-create items', () => {
            const prevItems = [];
            items.forEach((item, index) => {
                prevItems.push(strategy.at(index));
            });

            strategy.reset();
            items.forEach((item, index) => {
                assert.notEqual(strategy.at(index), prevItems[index]);
            });
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return equal indices', () => {
            items.forEach((item, index) => {
                assert.strictEqual(strategy.getDisplayIndex(index), index);
            });
        });

        it('should return shifted indices in unique mode if source has repeats', () => {
            const items = [
                {id: 1},
                {id: 1},
                {id: 2}
            ];
            const list = new List({items});
            const display = new CollectionDisplay({collection: list});
            const strategy = new Direct({
                display,
                keyProperty: 'id',
                unique: true
            });
            const expected = [0, 2, 1];

            items.forEach((item, index) => {
                assert.strictEqual(strategy.getDisplayIndex(index), expected[index]);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return equal indices', () => {
            items.forEach((item, index) => {
                assert.strictEqual(strategy.getCollectionIndex(index), index);
            });
        });

        it('should return shifted indices in unique mode if source has repeats', () => {
            const items = [
                {id: 1},
                {id: 1},
                {id: 2}
            ];
            const list = new List({items});
            const display = new CollectionDisplay({collection: list});
            const strategy = new Direct({
                display,
                keyProperty: 'id',
                unique: true
            });
            const expected = [0, 2, -1];

            items.forEach((item, index) => {
                assert.strictEqual(strategy.getCollectionIndex(index), expected[index]);
            });
        });
    });

    describe('::sortItems()', () => {
        it('should return original order by default', () => {
            const items = [{}, {}, {}];
            const expected = [0, 1, 2];
            const given = Direct.sortItems(items, {});

            assert.deepEqual(given, expected);
        });

        it('should return items with unique ids', () => {
            const items = [
                new CollectionItem({contents: {id: 1}}),
                new CollectionItem({contents: {id: 2}}),
                new CollectionItem({contents: {id: 1}}),
                new CollectionItem({contents: {id: 3}})
            ];
            const options = {
                unique: true,
                keyProperty: 'id'
            };
            const expected = [0, 1, 3];
            const given = Direct.sortItems(items, options);

            assert.deepEqual(given, expected);
        });
    });
});
