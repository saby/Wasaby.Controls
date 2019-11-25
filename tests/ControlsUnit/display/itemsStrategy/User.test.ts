import User from 'Controls/_display/itemsStrategy/User';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';
import {SortFunction} from 'Controls/_display/Collection';
import { CollectionItem } from 'Controls/display';

describe('Controls/_display/itemsStrategy/User', () => {
    function wrapItem<S, T>(item: S): T {
        return new CollectionItem({
            contents: item
        }) as any as T;
    }

    function getSource<S, T = CollectionItem<S>>(items: S[]): IItemsStrategy<S, T> {
        const wraps = items.map<T>(wrapItem);

        return {
            '[Controls/_display/IItemsStrategy]': true,
            options: {},
            source: null,
            get count(): number {
                return wraps.length;
            },
            get items(): T[] {
                return wraps.slice();
            },
            at(index: number): T {
                return wraps[index];
            },
            getDisplayIndex(index: number): number {
                return index;
            },
            getCollectionIndex(index: number): number {
                return index;
            },
            splice(start: number, deleteCount: number, added?: S[]): T[] {
                added = added || [];
                items.splice(start, deleteCount, ...added);
                return wraps.splice(start, deleteCount, ...added.map<T>(wrapItem));
            },
            invalidate(): void {
                // always up to date
            },
            reset(): void {
                items.length = 0;
                wraps.length = 0;
            }
        };
    }

    function getStrategy<S, T extends CollectionItem<S> = CollectionItem<S>>(
        source: IItemsStrategy<S, T>,
        handlers: Array<SortFunction<S, T>>
    ): User<S, T> {
        return new User({
            source,
            handlers
        });
    }

    let source: IItemsStrategy<string, CollectionItem<string>>;
    let strategy: User<string>;

    beforeEach(() => {
        source = getSource(['one', 'two', 'three']);
        strategy = getStrategy(source, []);
    });

    afterEach(() => {
        source = undefined;
        strategy = undefined;
    });

    describe('.options', () => {
        it('should return the source options', () => {
            assert.strictEqual(strategy.options, source.options);
        });
    });

    describe('.at()', () => {
        it('should return every item', () => {
            source.items.forEach((item, index) => {
                assert.strictEqual(strategy.at(index), item);
            });
        });

        it('should return direct items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => a.item.getContents() - b.item.getContents()]
            );
            const expected = [1, 2, 3];

            expected.forEach((item, index) => {
                assert.strictEqual(strategy.at(index).getContents(), item);
            });
        });

        it('should return reversed items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => b.item.getContents() - a.item.getContents()]
            );
            const expected = [3, 2, 1];

            expected.forEach((item, index) => {
                assert.strictEqual(strategy.at(index).getContents(), item);
            });
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            assert.strictEqual(strategy.count, source.items.length);
        });
    });

    describe('.items', () => {
        it('should return an items', () => {
            assert.deepEqual(strategy.items, source.items);
        });

        it('should return direct items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => a.item.getContents() - b.item.getContents()]
            );
            const items = strategy.items;
            const expected = [1, 2, 3];

            items.forEach((item, index) => {
                assert.strictEqual(item.getContents(), expected[index]);
            });
            assert.equal(items.length, expected.length);
        });

        it('should return direct items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => b.item.getContents() - a.item.getContents()]
            );
            const items = strategy.items;
            const expected = [3, 2, 1];

            items.forEach((item, index) => {
                assert.strictEqual(item.getContents(), expected[index]);
            });
            assert.equal(items.length, expected.length);
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const items = ['1', '2'];
            const count = strategy.count;
            strategy.splice(0, 0, items);
            assert.strictEqual(strategy.count, items.length + count);
        });

        it('should push item after latest source item', () => {
            const items = [1, 2, 3];
            const source = getSource(items);
            const strategy = getStrategy(source, []);
            const newItem = 4;

            strategy.splice(strategy.count, 0, [newItem]);

            assert.strictEqual(items[items.length - 1], newItem);
        });

        it('should remove items', () => {
            strategy.splice(1, 2);
            assert.strictEqual(strategy.at(0), source.items[0]);
            assert.strictEqual(strategy.at(1), source.items[2]);
        });
    });

    describe('.reset()', () => {
        it('should reset items', () => {
            strategy.reset();
            assert.strictEqual(strategy.items.length, 0);
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return equal indices', () => {
            source.items.forEach((item, index) => {
                assert.strictEqual(strategy.getDisplayIndex(index), index);
            });
        });

        it('should return direct index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => a.item.getContents() - b.item.getContents()]
            );
            const expected = [0, 1, 2];

            expected.forEach((strategyIndex, collectionIndex) => {
                assert.strictEqual(strategy.getDisplayIndex(collectionIndex), strategyIndex);
            });
        });

        it('should return reversed index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => b.item.getContents() - a.item.getContents()]
            );
            const expected = [2, 1, 0];

            expected.forEach((strategyIndex, collectionIndex) => {
                assert.strictEqual(strategy.getDisplayIndex(collectionIndex), strategyIndex);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return equal indices', () => {
            source.items.forEach((item, index) => {
                assert.strictEqual(strategy.getCollectionIndex(index), index);
            });
        });

        it('should return direct index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => a.item.getContents() - b.item.getContents()]
            );
            const expected = [0, 1, 2];

            expected.forEach((collectionIndex, strategyIndex) => {
                assert.strictEqual(strategy.getCollectionIndex(collectionIndex), strategyIndex);
            });
        });

        it('should return reversed index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(
                source,
                [(a, b) => b.item.getContents() - a.item.getContents()]
            );
            const expected = [2, 1, 0];

            expected.forEach((collectionIndex, strategyIndex) => {
                assert.strictEqual(strategy.getCollectionIndex(collectionIndex), strategyIndex);
            });
        });
    });

    describe('.toJSON()', () => {
        it('should serialize the strategy', () => {
            const source = getSource([1, 2, 3]);
            const handlers = [];
            const strategy = getStrategy(source, handlers);
            const items = strategy.items;
            const json = strategy.toJSON() as any;

            assert.strictEqual(json.state.$options.source, source);
            assert.strictEqual(json.state.$options.handlers, handlers);
            assert.strictEqual(json.state._itemsOrder.length, items.length);
        });

        it('should serialize itemsOrder if handlers is defined', () => {
            const source = getSource([1, 2, 3]);
            const handlers = [() => 0];
            const strategy = getStrategy(source, handlers);
            const json = strategy.toJSON() as any;

            assert.strictEqual(json.state._itemsOrder.length, source.count);
        });
    });

    describe('::fromJSON()', () => {
        it('should clone the strategy', () => {
            const source = getSource([1, 2, 3]);
            const handlers = [];
            const strategy = getStrategy(source, handlers);
            const items = strategy.items;
            const clone = (User as any).fromJSON(strategy.toJSON());

            assert.deepEqual(clone.items, items);
        });
    });
});
