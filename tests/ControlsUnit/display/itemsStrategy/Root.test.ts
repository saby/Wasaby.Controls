import { assert } from 'chai';

import Root from 'Controls/_display/itemsStrategy/Root';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';

describe('Controls/_display/itemsStrategy/Root', () => {
    function getSource<S>(items: S[]): IItemsStrategy<S, S> {
        return {
            '[Controls/_display/IItemsStrategy]': true,
            options: {},
            source: null,
            get count(): number {
                return items.length;
            },
            get items(): S[] {
                return items.slice();
            },
            at(index: number): S {
                return items[index];
            },
            getDisplayIndex(index: number): number {
                return index;
            },
            getCollectionIndex(index: number): number {
                return index;
            },
            splice(start: number, deleteCount: number, added?: S[]): S[] {
                return items.splice(start, deleteCount, ...(added || []));
            },
            invalidate(): void {
                // always up to date
            },
            reset(): void {
                items.length = 0;
            }
        };
    }

    const root = () => {
        return 'root';
    };

    let items: string[];
    let source: IItemsStrategy<string, string>;
    let strategy: Root<string, string>;

    beforeEach(() => {
        items = ['one', 'two', 'three'];
        source = getSource(items);
        strategy = new Root({
            source,
            root
        });
    });

    afterEach(() => {
        items = undefined;
        source = undefined;
        strategy = undefined;
    });

    describe('.getOptions()', () => {
        it('should return the source options', () => {
            assert.strictEqual(strategy.options, source.options);
        });
    });

    describe('.at()', () => {
        it('should return root at 0', () => {
            assert.strictEqual(strategy.at(0), root());
        });

        it('should return item with offset', () => {
            source.items.forEach((item, index) => {
                assert.strictEqual(strategy.at(1 + index), item);
            });
        });
    });

    describe('.count', () => {
        it('should return items count with root', () => {
            assert.strictEqual(strategy.count, 1 + source.items.length);
        });
    });

    describe('.items', () => {
        it('should return an items with root', () => {
            assert.deepEqual(strategy.items, [root()].concat(source.items));
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return an index with offset', () => {
            assert.strictEqual(strategy.getDisplayIndex(0), 1);
            assert.strictEqual(strategy.getDisplayIndex(1), 2);
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return an index with offset', () => {
            assert.strictEqual(strategy.getCollectionIndex(1), 0);
            assert.strictEqual(strategy.getCollectionIndex(2), 1);
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const items = ['a', 'b'];
            const count = strategy.count;
            strategy.splice(0, 0, items);
            assert.strictEqual(strategy.count, items.length + count);
        });
    });

    describe('.reset()', () => {
        it('should reset items', () => {
            strategy.reset();
            assert.strictEqual(strategy.items.length, 1);
        });
    });
});
