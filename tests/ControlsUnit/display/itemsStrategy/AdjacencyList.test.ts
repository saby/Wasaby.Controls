import { assert } from 'chai';

import IItemsStrategy, {IOptions} from 'Controls/_display/IItemsStrategy';
import AdjacencyList from 'Controls/_display/itemsStrategy/AdjacencyList';

import {
    CollectionItem,
    TreeItem,
    GroupItem
} from 'Controls/display';

describe('Controls/_display/itemsStrategy/AdjacencyList', () => {
    function getDisplay(root: number | object): object {
        return {
            getRoot(): TreeItem<number | object> {
                return this.root || (this.root = new TreeItem({
                    contents: root
                }));
            },

            createItem(options: any): TreeItem<number | object> {
                options.node = options.contents.node;
                options.hasChildren = options.contents.hasChildren;
                return new TreeItem(options);
            }
        };
    }

    function wrapItem<S, T>(item: S): T {
        if (item instanceof CollectionItem) {
            return item as any as T;
        }
        return new TreeItem({
            contents: item
        }) as any as T;
    }

    function getSource<S, T = TreeItem<S>>(items: S[], root?: number | object): IItemsStrategy<S, T> {
        const display = getDisplay(root);

        const options = {
            display,
            items
        };

        const wraps = items.map<T>(wrapItem);

        return {
            '[Controls/_display/IItemsStrategy]': true,
            source: null,
            get options(): IOptions<S, T> {
                return options as any;
            },
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
                items.splice(start, deleteCount, ...added);
                return wraps.splice(start, deleteCount, ...added.map<T>(wrapItem));
            },
            invalidate(): void {
                this.invalidated = true;
            },
            reset(): void {
                wraps.length = 0;
                items.length = 0;
            }
        };
    }

    describe('.items', () => {
        it('should return items translated from source items contents', () => {
            const items = [
                {id: 1},
                {id: 2},
                {id: 3}
            ];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            strategy.items.forEach((item, index) => {
                assert.notEqual(item, source.items[index]);
                assert.strictEqual(item.getContents(), items[index]);
            });

            assert.strictEqual(strategy.items.length, items.length);
        });

        it('should keep groups order', () => {
            const items = [
                new GroupItem({contents: 'a'}),
                {id: 1},
                new GroupItem({contents: 'b'}),
                {id: 2},
                {id: 3}
            ];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expectedInstances = [GroupItem, TreeItem, GroupItem, TreeItem, TreeItem];
            const expectedContents = ['a', items[1], 'b', items[3], items[4]];

            strategy.items.forEach((item, index) => {
                assert.instanceOf(item, expectedInstances[index]);
                assert.strictEqual(item.getContents(), expectedContents[index]);
            });

            assert.strictEqual(strategy.items.length, expectedInstances.length);
        });

        it('should keep groups order on several tree levels', () => {
            const items = [
                new GroupItem({contents: 'a'}),
                {id: 11, pid: 1},
                {id: 1, pid: 0},
                new GroupItem({contents: 'b'}),
                {id: 2, pid: 0}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = ['a', items[2], items[1], 'b', items[4]];

            strategy.items.forEach((item, index) => {
                assert.strictEqual(item.getContents(), expected[index]);
            });

            assert.strictEqual(strategy.items.length, expected.length);
        });

        it('should revert parents\'s group if any child join another group', () => {
            const items = [
                new GroupItem({contents: 'a'}),
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                new GroupItem({contents: 'b'}),
                {id: 11, pid: 1}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = ['a', items[1], 'b', items[4], 'a', items[2]];

            strategy.items.forEach((item, index) => {
                assert.strictEqual(item.getContents(), expected[index]);
            });

            assert.strictEqual(strategy.items.length, expected.length);
        });

        it('shouldn\'t revert parents\'s group if any child joins another group but next parent\'s sibling has his' +
            ' own group', () => {
            const items = [
                new GroupItem({contents: 'a'}),
                {id: 1, pid: 0},
                new GroupItem({contents: 'c'}),
                {id: 2, pid: 0},
                new GroupItem({contents: 'b'}),
                {id: 11, pid: 1}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = ['a', items[1], 'b', items[5], 'c', items[3]];

            strategy.items.forEach((item, index) => {
                assert.strictEqual(item.getContents(), expected[index]);
            });

            assert.strictEqual(strategy.items.length, expected.length);
        });

        it('should set valid parent if node joins another group then it\'s previous sibling', () => {
            const items = [
                new GroupItem({contents: 'a'}),
                {id: 1},
                new GroupItem({contents: 'b'}),
                {id: 2},
                new GroupItem({contents: 'aa'}),
                {id: 11, pid: 1},
                new GroupItem({contents: 'bb'}),
                {id: 22, pid: 2}
            ];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            const givenA = strategy.items.map((item) => {
                return item.getContents();
            });
            assert.deepEqual(givenA, ['a', items[1], 'aa', items[5], 'b', items[3], 'bb', items[7]]);

            const givenB = strategy.items.map((item) => {
                return item instanceof GroupItem ? item.getContents() : item.getParent().getContents();
            });
            assert.deepEqual(givenB, ['a', undefined, 'aa', items[1], 'b', undefined, 'bb', items[3]]);
        });
    });

    describe('.at()', () => {
        let items: Array<{id: number, pid: number}>;
        let source;
        let strategy;

        beforeEach(() => {
            items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 4, pid: 0},
                {id: 11, pid: 1},
                {id: 31, pid: 3},
                {id: 21, pid: 2},
                {id: 41, pid: 4},
                {id: 111, pid: 11}
            ];
            source = getSource(items, 0);
            strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
        });

        afterEach(() => {
            items = undefined;
            strategy = undefined;
        });

        it('should return items in hierarchical order for root as Number', () => {
            const expected = [1, 11, 111, 2, 21, 3, 31, 4, 41];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return items in hierarchical order for root as object', () => {
            const root = {id: 0};
            const source = getSource(items, root);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [1, 11, 111, 2, 21, 3, 31, 4, 41];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return items in hierarchical order for root as null', () => {
            const rootId = null;
            const items = [
                {id: 1, pid: rootId},
                {id: 2, pid: rootId},
                {id: 11, pid: 1},
                {id: 21, pid: 2}
            ];
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [1, 11, 2, 21];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return items in hierarchical order for root as null and children related to undefined', () => {
            const rootId = null;
            const items = [
                {id: 1},
                {id: 2},
                {id: 11, pid: 1},
                {id: 21, pid: 2}
            ];
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [items[0], items[2], items[1], items[3]];
            const expectedParent = [rootId, items[0], rootId, items[1]];

            for (let index = 0; index < expected.length; index++) {
                const item = strategy.at(index);
                assert.strictEqual(item.getContents(), expected[index]);
                assert.strictEqual(item.getParent().getContents(), expectedParent[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return items in hierarchical order for specified root', () => {
            const rootId = 1;
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [11, 111];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should lookup for const ious value types to root', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: '0'},
                {id: 11, pid: 1},
                {id: 12, pid: '1'}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [1, 11, 12, 2];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should work with scalar root wrapped using Object', () => {
            // tslint:disable-next-line:no-construct
            const root = new Number(0);
            const items = [
                {id: 11, pid: 1},
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 21, pid: 2}
            ];
            const source = getSource(items, root);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [1, 11, 2, 21];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return only root items if keyProperty is not injected', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                parentProperty: 'pid'
            });
            const expected = [1, 2, 3, 4];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return different TreeItem instances for repeats and duplicates', () => {
            const rootId = 0;
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 11, pid: 1},
                {id: 111, pid: 11},
                {id: 11, pid: 2}
            ];
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [1, 11, 111, 2, 11, 111];
            const treeItems = [];

            for (let index = 0; index < expected.length; index++) {
                const treeItem = strategy.at(index);
                assert.equal(treeItems.indexOf(treeItem), -1);
                treeItems.push(treeItem);

                assert.strictEqual(treeItem.getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should throw an Error if index is out of bounds', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            assert.throws(() => {
                strategy.at(99);
            });
        });

        it('should return a TreeItem as node', () => {
            const items = [{node: true}];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source
            });

            assert.isTrue(strategy.at(0).isNode());
        });

        it('should return a TreeItem as leaf', () => {
            const items = [{node: false}];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source
            });

            assert.isFalse(strategy.at(0).isNode());
        });

        it('should return a TreeItem with children', () => {
            const items = [{hasChildren: true}];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source
            });

            assert.isTrue(strategy.at(0).isHasChildren());
        });

        it('should return a TreeItem without children', () => {
            const items = [{hasChildren: false}];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source
            });

            assert.isFalse(strategy.at(0).isHasChildren());
        });
    });

    describe('.count', () => {
        let items: Array<{id: number, pid: number}>;
        let source;

        beforeEach(() => {
            items = [
                {id: 1, pid: 0},
                {id: 3, pid: 0},
                {id: 11, pid: 1},
                {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should return valid items count', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            assert.strictEqual(strategy.count, 3);
        });

        it('should return valid items count if keyProperty is not injected', () => {
            const strategy = new AdjacencyList({
                source,
                parentProperty: 'pid'
            });

            assert.strictEqual(strategy.count, 2);
        });

        it('should return 0 if parentProperty is not injected', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id'
            });

            assert.strictEqual(strategy.count, 0);
        });
    });

    describe('.splice()', () => {
        let items: Array<{id: number, pid: number}>;

        beforeEach(() => {
            items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 21, pid: 2}
            ];
        });

        afterEach(() => {
            items = undefined;
        });

        it('should insert an item in valid order', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const newItem = {id: 11, pid: 1};
            const position = 3;
            const expected = [1, 11, 2, 21, 3];
            const result = strategy.splice(position, 0, [newItem]);

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 0);

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should add items in valid order', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const newItems = [
                {id: 11, pid: 1},
                {id: 12, pid: 1},
                {id: 22, pid: 2},
                {id: 4, pid: 0}
            ];
            const itemsCount = items.length;
            const expected = [1, 11, 12, 2, 21, 22, 3, 4];
            const result = strategy.splice(itemsCount, 0, newItems);

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 0);

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should keep old instances after inserting an item in clone', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const newItem = {id: 11, pid: 1};
            const position = 1;
            const expected = [...strategy.items];

            // Reset _sourceItems by cloning
            const strategyClone = (AdjacencyList as any).fromJSON(strategy.toJSON());

            strategyClone.splice(position, 0, [newItem]);
            expected.splice(position, 0, strategyClone.at(position));

            const result = strategyClone.items;
            expected.forEach((item, index) => {
               assert.strictEqual(item, result[index]);
            });
            assert.deepEqual(result.length, expected.length);
        });

        it('should push item after latest source item', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 31, pid: 3}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const newItem = {id: 4, pid: 0};

            strategy.splice(items.length, 0, [newItem]);

            assert.strictEqual(items[items.length - 1], newItem);
        });

        it('should add items duplicates in valid order', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const newItems = [{id: 2, pid: 0}];
            const itemsCount = items.length;
            const expected = [1, 2, 21, 3, 2, 21];
            const displayItems = [];

            const result = strategy.splice(itemsCount, 0, newItems);

            for (let index = 0; index < expected.length; index++) {
                const item = strategy.at(index);
                assert.strictEqual(item.getContents().id, expected[index]);

                assert.equal(displayItems.indexOf(item), -1);
                displayItems.push(item);
            }

            assert.strictEqual(result.length, 0);

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should remove items in valid order', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 21, pid: 2},
                {id: 211, pid: 21},
                {id: 22, pid: 2}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const displayAt = 2;
            const removeAt = 3;
            const expected = [1, 2, 22, 3];

            // Force create item
            assert.strictEqual(strategy.at(displayAt).getContents().id, 21);

            const result = strategy.splice(removeAt, 1, []);

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].getContents().id, 21);

            assert.strictEqual(strategy.count, expected.length);
        });

        it('should return removed items', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 4, pid: 0}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            const expected = [strategy.at(1), strategy.at(2)];
            const result = strategy.splice(1, 2, []);

            assert.deepEqual(result, expected);
        });

        it('should return undefined for item that\'s not created yet', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            const result = strategy.splice(0, 1, []);

            assert.deepEqual(result.length, 1);
            assert.isUndefined(result[0]);
        });

        it('should remove duplicates in valid order', () => {
            const items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 2, pid: 0},
                {id: 21, pid: 2}
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const removeAt = 1;
            const expected = [1, 3, 2, 21];

            //Force create item
            assert.strictEqual(strategy.at(removeAt).getContents().id, 2);

            const result = strategy.splice(removeAt, 1, []);

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].getContents().id, 2);

            assert.strictEqual(strategy.count, expected.length);
        });
    });

    describe('.invalidate', () => {
        let items;
        let source;

        beforeEach(() => {
            items = [];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should call source method', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            assert.isUndefined(source.invalidated);
            strategy.invalidate();
            assert.isTrue(source.invalidated);
        });

        it('should change items order and revert it back', () => {
            const items = [
                {id: 1},
                {id: 2},
                {id: 11, pid: 1},
                {id: 22, pid: 2}
            ];
            const sourceA = getSource(items);
            const strategy = new AdjacencyList({
                source: sourceA,
                keyProperty: 'id',
                parentProperty: 'pid'
            });

            const givenA = strategy.items.map((item) => item.getContents().id);
            const expectedA = [1, 11, 2, 22];
            assert.deepEqual(givenA, expectedA);

            const affectedItemsB = [
                items[1],
                items[3],
                items[0]
            ];
            const sourceB = getSource(affectedItemsB);
            strategy['_opt' + 'ions'].source = sourceB;
            strategy.invalidate();
            const givenB = strategy.items.map((item) => item.getContents().id);
            const expectedB = [2, 22, 1];
            assert.deepEqual(givenB, expectedB);

            const affectedItemsC = items;
            const sourceC = getSource(affectedItemsC);
            strategy['_opt' + 'ions'].source = sourceC;
            strategy.invalidate();
            const givenC = strategy.items.map((item) => item.getContents().id);
            const expectedC = [1, 11, 2, 22];
            assert.deepEqual(givenC, expectedC);
        });
    });

    describe('.getDisplayIndex()', () => {
        let items: Array<{id: number, pid: number}>;
        let source;

        beforeEach(() => {
            items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 11, pid: 1},
                {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should return valid item index', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [0, 2, 4, 1, 3];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.getDisplayIndex(index), expected[index]);
            }
        });

        it('should return index witch source index consideration', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [2, 4, 1, 3];

            source.getDisplayIndex = (index) => index + 1;

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.getDisplayIndex(index), expected[index]);
            }
        });
    });

    describe('.getCollectionIndex()', () => {
        let items: Array<{id: number, pid: number}>;
        let source;

        beforeEach(() => {
            items = [
                {id: 1, pid: 0},
                {id: 2, pid: 0},
                {id: 3, pid: 0},
                {id: 11, pid: 1},
                {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should return valid display index', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [0, 3, 1, 4, 2];

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.getCollectionIndex(index), expected[index]);
            }
        });

        it('should return index witch source index consideration', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            });
            const expected = [3, 1, 4, 2];

            source.getCollectionIndex = (index) => index + 1;

            for (let index = 0; index < expected.length; index++) {
                assert.strictEqual(strategy.getCollectionIndex(index), expected[index]);
            }
        });
    });

    describe('.toJSON()', () => {
        it('should serialize the strategy', () => {
            const source = getSource([1, 2, 3]);
            const options = {
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            };
            const strategy = new AdjacencyList(options);
            const items = strategy.items;
            const json = strategy.toJSON() as any;

            assert.strictEqual(json.state.$options, options);
            assert.strictEqual(json.state._items, items);
            assert.strictEqual(json.state._itemsOrder.length, items.length);
            assert.strictEqual(json.state._parentsMap.length, items.length);
        });
    });

    describe('::fromJSON()', () => {
        it('should clone the strategy', () => {
            const source = getSource([1, 2, 3]);
            const options = {
                source,
                keyProperty: 'id',
                parentProperty: 'pid'
            };
            const strategy = new AdjacencyList(options);
            const items = strategy.items;
            const clone = (AdjacencyList as any).fromJSON(strategy.toJSON());

            assert.deepEqual(clone.items, items);
        });
    });
});
