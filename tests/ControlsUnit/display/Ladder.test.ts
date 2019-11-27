import { assert } from 'chai';

import {
    Ladder,
    Collection
} from 'Controls/display';

import {
    IObservable as IBindCollection,
    ObservableList
} from 'Types/collection';

import {
    Record,
    Model
} from 'Types/entity';

interface IItem {
    id: number;
    LastName: string;
    FirstName?: string;
}

describe('Controls/_display/Ladder', () => {
    function getItems(): IItem[] {
        return [{
            id: 1,
            LastName: 'Lennon',
            FirstName: 'John'
        }, {
            id: 2,
            LastName: 'Bowring',
            FirstName: 'John'
        }, {
            id: 3,
            LastName: 'Smith',
            FirstName: 'Adam'
        }, {
            id: 4,
            LastName: 'Smith',
            FirstName: 'Ted'
        }, {
            id: 5,
            LastName: 'Smith',
            FirstName: 'Ted'
        }, {
            id: 6,
            LastName: 'Bowring',
            FirstName: 'John'
        }, {
            id: 7,
            LastName: 'Bowring',
            FirstName: 'John'
        }];
    }

    function checkItem(idx: number, column: string, primary?: boolean, msg?: string): void {
        const item = collection.at(idx);
        const value = item.getContents()[column];

        assert.strictEqual(
            ladder.get(item.getContents(), column),
            primary ? value : '',
            msg || `Error idx: ${idx}, column: ${column}`
        );
    }

    let items: IItem[];
    let list: ObservableList<IItem>;
    let collection: Collection<IItem>;
    let ladder: Ladder<IItem>;

    beforeEach(() => {
        items = getItems();

        list = new ObservableList({
            items
        });

        collection = new Collection({
            collection: list
        });

        ladder = new Ladder(collection);
    });

    afterEach(() => {
        ladder.destroy();
        ladder = undefined;

        collection.destroy();
        collection = undefined;

        list.destroy();
        list = undefined;

        items = undefined;
    });

    describe('.constructor()', () => {
        it('should use collection from first argument', () => {
            const ladder = new Ladder(collection);
            assert.strictEqual(ladder.getCollection(), collection);
        });
    });

    describe('.setCollection()', () => {
        it('should set the collection', () => {
            const ladder = new Ladder();
            ladder.setCollection(collection);
            assert.strictEqual(ladder.getCollection(), collection);
        });

        it('should do nothing with the same collection', () => {
            ladder.isPrimary(list.at(0), 'LastName');
            ladder.setCollection(collection);
            assert.strictEqual(ladder.getCollection(), collection);
            assert.isTrue(ladder['_column' + 'Names'].length > 0);
        });

        it('should move self handler to the end', () => {
            const items = [
                {id: 1, title: 'foo'},
                {id: 2, title: 'bar'}
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);
            const expected = [IBindCollection.ACTION_ADD];
            const given = [];
            const handler = (event, action, newItems) => {
                if (action === IBindCollection.ACTION_ADD) {
                    newItems.forEach((item) => {
                        ladder.isPrimary(item.getContents(), 'title');
                    });
                }

                given.push(action);
            };

            ladder.isPrimary(list.at(0), 'title');
            ladder.isPrimary(list.at(1), 'title');

            collection.subscribe('onCollectionChange', handler);
            ladder.setCollection(collection);
            list.append([{id: 3, title: 'bar'}]);

            assert.deepEqual(given, expected);
        });

        it('should update data', () => {
            const itemsA = [
                {id: 1, title: 'foo'},
                {id: 2, title: 'bar'},
                {id: 3, title: 'bar'}
            ];
            const listA = new ObservableList({
                items: itemsA
            });
            const collectionA = new Collection({
                collection: listA
            });

            const ladder = new Ladder(collectionA);
            assert.isTrue(ladder.isPrimary(itemsA[0], 'title'));
            assert.isTrue(ladder.isPrimary(itemsA[1], 'title'));
            assert.isFalse(ladder.isPrimary(itemsA[2], 'title'));

            const itemsB = [
                {id: 1, title: 'foo'},
                {id: 2, title: 'foo'},
                {id: 3, title: 'bar'}
            ];
            const listB = new ObservableList({
                items: itemsB
            });
            const collectionB = new Collection({
                collection: listB
            });

            ladder.setCollection(collectionB);
            assert.isTrue(ladder.isPrimary(itemsB[0], 'title'));
            assert.isFalse(ladder.isPrimary(itemsB[1], 'title'));
            assert.isTrue(ladder.isPrimary(itemsB[2], 'title'));
        });

        it('should set null', () => {
            const ladder = new Ladder();
            ladder.setCollection(null);
            assert.isNull(ladder.getCollection());
        });

        it('should throw TypeError on invalid argument type', () => {
            assert.throws(() => {
                ladder.setCollection({} as any);
            }, TypeError);
            assert.throws(() => {
                ladder.setCollection('a' as any);
            }, TypeError);
            assert.throws(() => {
                ladder.setCollection(1 as any);
            }, TypeError);
            assert.throws(() => {
                ladder.setCollection(undefined);
            }, TypeError);
        });
    });

    describe('.setOffset()', () => {
        it('should make item at offset primary', () => {
            checkItem(0, 'FirstName', true);
            checkItem(1, 'FirstName', false);
            checkItem(2, 'FirstName', true);

            ladder.setOffset(1);
            checkItem(0, 'FirstName', true);
            checkItem(1, 'FirstName', true);
            checkItem(2, 'FirstName', true);

            ladder.setOffset(0);
            checkItem(0, 'FirstName', true);
            checkItem(1, 'FirstName', false);
            checkItem(2, 'FirstName', true);
        });

        it('should make previous offset secondary', () => {
            const list = new ObservableList({
                items: [
                    {id: 1, name: 'foo'},
                    {id: 2, name: 'bar'},
                    {id: 3, name: 'bar'},
                    {id: 4, name: 'bar'},
                    {id: 5, name: 'bar'}
                ]
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            ladder.setOffset(2);
            assert.isTrue(ladder.isPrimary(collection.at(1).getContents(), 'name'));
            assert.isTrue(ladder.isPrimary(collection.at(2).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(3).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(4).getContents(), 'name'));

            ladder.setOffset(4);
            assert.isTrue(ladder.isPrimary(collection.at(1).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(2).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(3).getContents(), 'name'));
            assert.isTrue(ladder.isPrimary(collection.at(4).getContents(), 'name'));

            ladder.setOffset(0);
            assert.isTrue(ladder.isPrimary(collection.at(1).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(2).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(3).getContents(), 'name'));
            assert.isFalse(ladder.isPrimary(collection.at(4).getContents(), 'name'));
        });
    });

    describe('.isLadderColumn()', () => {
        it('should recognize ladder column', () => {
            ladder.get(collection.at(0), 'LastName');
            assert.strictEqual(ladder.isLadderColumn('LastName'), true);

            ladder.get(collection.at(0), 'FirstName');
            assert.strictEqual(ladder.isLadderColumn('FirstName'), true);
        });

        it('should not recognize not ladder column', () => {
            assert.strictEqual(ladder.isLadderColumn('id'), false);
            assert.strictEqual(ladder.isLadderColumn('SurName'), false);
        });

        it('should not throw if there are no columns', () => {
            ladder = new Ladder(collection);
            assert.doesNotThrow(() => {
                assert.strictEqual(ladder.isLadderColumn('LastName'), false);
            });
        });
    });

    describe('.isPrimary()', () => {
        function checkPrimary(idx: number, column: string, primary: boolean): void {
            assert.strictEqual(
                ladder.isPrimary(collection.at(idx).getContents(), column),
                primary,
                `'Error idx: ${idx}, column: ${column}`
            );
        }

        it('should build ladder for column "LastName"', () => {
            checkPrimary(0, 'LastName', true);
            checkPrimary(1, 'LastName', true);
            checkPrimary(2, 'LastName', true);
            checkPrimary(3, 'LastName', false);
            checkPrimary(4, 'LastName', false);
            checkPrimary(5, 'LastName', true);
            checkPrimary(6, 'LastName', false);
        });

        it('should build ladder for column "FirstName"', () => {
            checkPrimary(0, 'FirstName', true);
            checkPrimary(1, 'FirstName', false);
            checkPrimary(2, 'FirstName', true);
            checkPrimary(3, 'FirstName', true);
            checkPrimary(4, 'FirstName', false);
            checkPrimary(5, 'FirstName', true);
            checkPrimary(6, 'FirstName', false);
        });

        it('should build ladder for several columns', () => {
            checkPrimary(0, 'LastName', true);
            checkPrimary(1, 'LastName', true);
            checkPrimary(3, 'LastName', false);

            checkPrimary(0, 'FirstName', true);
            checkPrimary(1, 'FirstName', false);
        });

        it('should compare objects', () => {
            const now = new Date();
            const notNow = new Date(Date.now() + 1000);
            const items = [
                {id: 1, date: now},
                {id: 2, date: now},
                {id: 3, date: new Date(now.getTime())},
                {id: 4, date: notNow}
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(items[0], 'date'));
            assert.isFalse(ladder.isPrimary(items[1], 'date'));
            assert.isFalse(ladder.isPrimary(items[2], 'date'));
            assert.isTrue(ladder.isPrimary(items[3], 'date'));
        });

        it('should ignore items without unique id', () => {
            const items = [
                {id: 1, title: 'foo'},
                'foo',
                {id: 3, title: 'foo'},
                {id: 4, title: 'foo'}
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(items[0], 'title'));
            assert.isTrue(ladder.isPrimary(items[1], 'title'));
            assert.isTrue(ladder.isPrimary(items[2], 'title'));
            assert.isFalse(ladder.isPrimary(items[3], 'title'));
        });

        it('should return true if collection is not assigned', () => {
            ladder = new Ladder(null);
            assert.isTrue(ladder.isPrimary({}, 'foo'));
        });

        it('should return chages after collection replace that displays as move up', () => {
            const items = [
                {id: 1, pos: 1, title: 'a'},
                {id: 2, pos: 2, title: 'b'},
                {id: 3, pos: 3, title: 'a'},
                {id: 4, pos: 4, title: 'a'}
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list,
                sort: (a, b) => a.item.getContents().pos - b.item.getContents().pos
            });
            const ladder = new Ladder(collection);
            const expected = [true, false, true, true];
            const given = [];

            // Replace {id: 4, pos: 4, title: 'a'} to {id: 4, pos: 0, title: 'a'} as move from position 3 to position 0
            list.replace({id: 4, pos: 0, title: 'a'}, 3);

            collection.each((item) => {
                given.push(ladder.isPrimary(item.getContents(), 'title'));
            });

            assert.deepEqual(given, expected);
        });

        it('should return valid value after unfreeze the collection without changes analysis', () => {
            const list = new ObservableList({
                items: [
                    {id: 1, title: 'a'},
                    {id: 2, title: 'b'},
                    {id: 3, title: 'a'},
                    {id: 4, title: 'b'}
                ]
            });
            const collection = new Collection({
                collection: list,
                filter: (item) => item.title === 'a'
            });
            const ladder = new Ladder(collection);

            let collectionItems = (ladder as any)._collectionItems;
            assert.equal(collectionItems.length, collection.getCount());
            assert.notEqual(collectionItems.length, list.getCount());

            collection.setEventRaising(false);
            collection.setFilter(() => {
                return true;
            });
            collection.setEventRaising(true);

            collectionItems = (ladder as any)._collectionItems;
            assert.equal(collectionItems.length, collection.getCount());
            assert.equal(collectionItems.length, list.getCount());
        });
    });

    describe('.get()', () => {
        it('should hide repeating ladder columns', () => {
            checkItem(3, 'LastName', false);
            checkItem(4, 'LastName', false);
            checkItem(6, 'LastName', false);

            checkItem(1, 'FirstName', false);
            checkItem(4, 'FirstName', false);
            checkItem(6, 'FirstName', false);
        });

        it('should not hide first ladder columns', () => {
            checkItem(2, 'LastName', true);
            checkItem(5, 'LastName', true);

            checkItem(0, 'FirstName', true);
            checkItem(3, 'FirstName', true);
            checkItem(5, 'FirstName', true);
        });

        it('should not hide unique ladder columns', () => {
            checkItem(0, 'LastName', true);
            checkItem(1, 'LastName', true);

            checkItem(2, 'FirstName', true);
        });

        it('should change ladder after collection insert', () => {
            const at = 3;

            checkItem(at - 1, 'FirstName', true); // Adam
            checkItem(at, 'FirstName', true); // Ted

            checkItem(at - 1, 'LastName', true); // Smith
            checkItem(at, 'LastName', false); // Smith

            list.add({
                id: 8,
                LastName: 'Lennon',
                FirstName: 'Ted'
            }, at);

            checkItem(at - 1, 'FirstName', true); // Adam
            checkItem(at, 'FirstName', true); // Ted
            checkItem(at + 1, 'FirstName', false); // Ted

            checkItem(at - 1, 'LastName', true); // Smith
            checkItem(at, 'LastName', true); // Lennon
            checkItem(at + 1, 'LastName', true); // Smith
        });

        it('should change ladder after collection append', () => {
            checkItem(0, 'FirstName', true);
            checkItem(0, 'LastName', true);

            list.add({
                id: 8,
                LastName: 'McCartney',
                FirstName: 'John'
            });

            list.add({
                id: 9,
                LastName: 'McCartney',
                FirstName: 'Paul'
            });

            const at = list.getCount() - 1;

            checkItem(at - 3, 'FirstName', true); // John
            checkItem(at - 2, 'FirstName', false); // John
            checkItem(at - 1, 'FirstName', false); //John
            checkItem(at, 'FirstName', true); // Paul

            checkItem(at - 3, 'LastName', true); // Bowring
            checkItem(at - 2, 'LastName', false); // Bowring
            checkItem(at - 1, 'LastName', true); // McCartney
            checkItem(at, 'LastName', false); // McCartney
        });

        it('should change ladder after collection remove', () => {
            const at = 3; // Ted Smith

            checkItem(at - 1, 'FirstName', true); // Adam
            checkItem(at, 'FirstName', true); // Ted
            checkItem(at + 1, 'FirstName', false); // Ted

            checkItem(at - 1, 'LastName', true); // Smith
            checkItem(at, 'LastName', false); // Smith
            checkItem(at + 1, 'LastName', false); // Smith

            list.removeAt(at);

            checkItem(at - 1, 'FirstName', true); // Adam
            checkItem(at, 'FirstName', true); // Ted

            checkItem(at - 1, 'LastName', true); // Smith
            checkItem(at, 'LastName', false); // Smith
        });

        it('should dont trigger "onCollectionChange" with CHANGE action after add removed item if isPrimary() ' +
            'has been called', () => {
            const at = 3;
            let called = [];
            let ladder;
            const handler = (e, action, newItems, newItemsIndex) => {
                switch (action) {
                    case IBindCollection.ACTION_ADD:
                        ladder.isPrimary(list.at(newItemsIndex), 'FirstName');
                        called = [];
                        break;
                    case IBindCollection.ACTION_CHANGE:
                        called[newItemsIndex] = true;
                        break;
                }
            };

            collection.subscribe('onCollectionChange', handler);
            ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(list.at(at - 1), 'FirstName')); // Adam
            assert.isTrue(ladder.isPrimary(list.at(at), 'FirstName')); // Ted
            assert.isFalse(ladder.isPrimary(list.at(at + 1), 'FirstName')); // Ted

            const removed = list.at(at);
            list.removeAt(at);
            list.add(removed, at);

            assert.isUndefined(called[at]);
            assert.isTrue(called[at + 1]);
        });

        it('should change ladder after collection replace', () => {
            list.replace({
                id: 4,
                LastName: 'Smiths',
                FirstName: 'Афина'
            }, 3);

            checkItem(2, 'FirstName', true); // Adam
            checkItem(3, 'FirstName', true); // Афина
            checkItem(4, 'FirstName', true); // Ted

            checkItem(2, 'LastName', true); // Smith
            checkItem(3, 'LastName', true); // Smiths
            checkItem(4, 'LastName', true); // Smith
        });

        it('should change ladder after collection move down', () => {
            const from = 3;
            const to = 5;

            checkItem(from - 1, 'FirstName', true); // Adam
            checkItem(from, 'FirstName', true); // Ted
            checkItem(from + 1, 'FirstName', false); // Ted

            checkItem(from - 1, 'LastName', true); // Smith
            checkItem(from, 'LastName', false); // Smith
            checkItem(from + 1, 'LastName', false); // Smith

            checkItem(to - 1, 'FirstName', false); // Ted
            checkItem(to, 'FirstName', true); // John
            checkItem(to + 1, 'FirstName', false); // John

            checkItem(to - 1, 'LastName', false); // Smith
            checkItem(to, 'LastName', true); // Bowring
            checkItem(to + 1, 'LastName', false); // Bowring

            list.setEventRaising(false, true);
            const item = list.removeAt(from); // Ted Smith
            list.add(item, to);
            list.setEventRaising(true, true);

            checkItem(from - 1, 'FirstName', true); // Adam
            checkItem(from, 'FirstName', true); // Ted

            checkItem(from - 1, 'LastName', true); // Smith
            checkItem(from, 'LastName', false); // Smith

            checkItem(to - 1, 'FirstName', true); // John
            checkItem(to, 'FirstName', true); // Ted
            checkItem(to + 1, 'FirstName', true); // John

            checkItem(to - 1, 'LastName', true); // Bowring
            checkItem(to, 'LastName', true); // Smith
            checkItem(to + 1, 'LastName', true); // Bowring
        });

        it('should change ladder after collection move up', () => {
            const from = 3;
            const to = 2;

            checkItem(from - 1, 'FirstName', true); // Adam
            checkItem(from, 'FirstName', true); // Ted
            checkItem(from + 1, 'FirstName', false); // Ted

            checkItem(from - 1, 'LastName', true); // Smith
            checkItem(from, 'LastName', false); // Smith
            checkItem(from + 1, 'LastName', false); // Smith

            checkItem(to - 1, 'FirstName', false); // John
            checkItem(to, 'FirstName', true); // Adam
            checkItem(to + 1, 'FirstName', true); // Ted

            checkItem(to - 1, 'LastName', true); // Bowring
            checkItem(to, 'LastName', true); // Smith
            checkItem(to + 1, 'LastName', false); // Smith

            list.setEventRaising(false, true);
            const item = list.removeAt(from); // Ted Smith
            list.add(item, to);
            list.setEventRaising(true, true);

            checkItem(from - 1, 'FirstName', true); // Adam
            checkItem(from, 'FirstName', true); // Ted

            checkItem(from - 1, 'LastName', true); // Smith
            checkItem(from, 'LastName', false); // Smith

            checkItem(to - 1, 'FirstName', false); // John
            checkItem(to, 'FirstName', true); // Ted
            checkItem(to + 1, 'FirstName', true); // Adam

            checkItem(to - 1, 'LastName', true); // Bowring
            checkItem(to, 'LastName', true); // Smith
            checkItem(to + 1, 'LastName', false); // Smith
        });

        // TODO Usually a reset event is fired on assign, however we've
        // disabled it in favour of the complete recreation of the collection.
        // Decide if this test is still applicable.
        it.skip('should change ladder after collection reset', () => {
            list.assign([{
                id: 1,
                LastName: 'Lennon'
            }, {
                id: 2,
                LastName: 'Bowring'
            }, {
                id: 3,
                LastName: 'Smith'
            }, {
                id: 4,
                LastName: 'Smith'
            }, {
                id: 5,
                LastName: 'Smith'
            }, {
                id: 6,
                LastName: 'Bowring'
            }, {
                id: 7,
                LastName: 'Bowring'
            }]);

            checkItem(0, 'LastName', true);
            checkItem(1, 'LastName', true);
            checkItem(2, 'LastName', true);
            checkItem(3, 'LastName', false);
            checkItem(4, 'LastName', false);
            checkItem(5, 'LastName', true);
            checkItem(6, 'LastName', false);
        });

        it('should change ladder after Record change', () => {
            const items = [
                new Record({
                    rawData: {id: 1, name: 'one'}
                }),
                new Record({
                    rawData: {id: 2, name: 'one'}
                }),
                new Record({
                    rawData: {id: 3, name: 'two'}
                })
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            list.at(1).set('name', 'two');

            assert.equal(ladder.get(list.at(0), 'name'), 'one');
            assert.equal(ladder.get(list.at(1), 'name'), 'two');
            assert.equal(ladder.get(list.at(2), 'name'), '');
        });

        it('should change ladder after Model change', () => {
            const items = [
                new Model({
                    rawData: {uid: 1, name: 'one'},
                    keyProperty: 'uid'
                }),
                new Model({
                    rawData: {uid: 2, name: 'one'},
                    keyProperty: 'uid'
                }),
                new Model({
                    rawData: {uid: 3, name: 'two'},
                    keyProperty: 'uid'
                })
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            list.at(1).set('name', 'two');

            assert.equal(ladder.get(list.at(0), 'name'), 'one');
            assert.equal(ladder.get(list.at(1), 'name'), 'two');
            assert.equal(ladder.get(list.at(2), 'name'), '');
        });

        it('should change ladder after move', () => {
            const items = [
                new Model({
                    rawData: {uid: 2, name: 'two'},
                    keyProperty: 'uid'
                }),
                new Model({
                    rawData: {uid: 1, name: 'one'},
                    keyProperty: 'uid'
                }),
                new Model({
                    rawData: {uid: 3, name: 'two'},
                    keyProperty: 'uid'
                }),
                new Model({
                    rawData: {uid: 4, name: 'two'},
                    keyProperty: 'uid'
                })
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            list.each((item) => {
                ladder.get(item, 'name');
            });
            list.setEventRaising(false, true);
            const model = list.at(1);
            list.remove(model);
            list.add(model, 0);
            list.setEventRaising(true, true);

            assert.equal(ladder.get(list.at(2), 'name'), '');
        });
    });

    describe('.setConverter()', () => {
        it('should receive requested item and previous item', () => {
            const items = [
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4}
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);
            let index = 0;

            ladder.setConverter('id', (val, item) => {
                assert.strictEqual(val, item.id);
                index++;
                return val;
            });

            assert.isTrue(ladder.isPrimary(items[1], 'id'));
            assert.equal(index, 2);
        });

        it('should change ladder sequence', () => {
            const items = [
                {id: 1, date: '11.10.2016 08:00'},
                {id: 2, date: '11.10.2016 09:00'},
                {id: 3, date: '12.10.2016 07:00'},
                {id: 4, date: '13.10.2016 08:00'}
            ];
            const list = new ObservableList({
                items
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            ladder.setConverter('date', (val) => val.split(' ')[0]);

            assert.isTrue(ladder.isPrimary(items[0], 'date'));
            assert.isFalse(ladder.isPrimary(items[1], 'date'));
            assert.isTrue(ladder.isPrimary(items[2], 'date'));
            assert.isTrue(ladder.isPrimary(items[3], 'date'));
        });
    });

    describe('.subscribe()', () => {
        const subscribeCollectionChange = (collection, given) => {
            const handler = (event, action, newItems, newItemsIndex) => {
                given.push({
                    action,
                    item: newItems,
                    index: newItemsIndex
                });
            };

            collection.subscribe('onCollectionChange', handler);
            return () => {
                collection.unsubscribe('onCollectionChange', handler);
            };
        };

        it('should trigger "onCollectionChange" if offset has changed', () => {
            const expect = [{
                action: IBindCollection.ACTION_CHANGE,
                newItems: [collection.at(1)],
                newItemsIndex: 1,
                oldItems: [collection.at(1)],
                oldItemsIndex: 1
            }];
            const given = [];
            const handler = (e, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex
                });
            };

            collection.each((item) => {
                ladder.get(item.getContents(), 'FirstName');
            });

            collection.subscribe('onCollectionChange', handler);
            ladder.setOffset(1);
            collection.unsubscribe('onCollectionChange', handler);

            assert.equal(given.length, expect.length);
            for (let i = 0; i < given.length; i++) {
                assert.strictEqual(given[i].action, expect[i].action, `at change #${i}`);

                assert.strictEqual(given[i].newItems.length, expect[i].newItems.length, `at change #${i}`);
                assert.strictEqual(given[i].newItemsIndex, expect[i].newItemsIndex, `at change #${i}`);
                for (let j = 0; j < given[i].newItems.length; j++) {
                    assert.strictEqual(given[i].newItems[j], expect[i].newItems[j], `at change #${i}`);
                }

                assert.strictEqual(given[i].oldItems.length, expect[i].oldItems.length, `at change #${i}`);
                assert.strictEqual(given[i].oldItemsIndex, expect[i].oldItemsIndex, `at change #${i}`);
                for (let j = 0; j < given[i].oldItems.length; j++) {
                    assert.strictEqual(given[i].oldItems[j], expect[i].oldItems[j], `at change #${i}`);
                }
            }
        });

        it('should trigger "onCollectionChange" if item has been moved', () => {
            const from = 5;
            const to = 1;
            const given = [];
            const handler = (e, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                if (action === IBindCollection.ACTION_MOVE && newItemsIndex === to) {
                    given.push({
                        action,
                        newItems,
                        newItemsIndex,
                        oldItems,
                        oldItemsIndex
                    });
                }
            };

            checkItem(5, 'FirstName', true);
            list.setEventRaising(false, true);
            const item = list.removeAt(from); // Ted Smith
            list.add(item, to);

            collection.subscribe('onCollectionChange', handler);
            list.setEventRaising(true, true);
            collection.unsubscribe('onCollectionChange', handler);

            assert.equal(given.length, 1);
            checkItem(given[0].newItemsIndex, 'FirstName', false);
        });

        it('should trigger "onCollectionChange" for neighbors after collection add', () => {
            const given = [];
            const expect = {};
            const unsubscribe = subscribeCollectionChange(collection, given);

            ladder.get(list.at(0), 'LastName');
            ladder.get(list.at(0), 'FirstName');

            list.add({
                id: 8,
                LastName: 'Bowring',
                FirstName: 'Peter'
            }, 1);
            unsubscribe();

            expect[2] = false;
            assert.isTrue(given.length > 0);
            for (let i = 0; i < given.length; i++) {
                if (expect.hasOwnProperty(given[i].index)) {
                    expect[given[i].index] = true;
                }
            }

            for (const i in expect) {
                if (expect.hasOwnProperty(i)) {
                    assert.isTrue(expect[i], `Item at ${i} should be changed`);
                }
            }
        });

        it('should don\'t trigger extra events after reset if collection items have been moved', () => {
            const list = new ObservableList({
                items: [
                    {id: 1, name: 'foo'},
                    {id: 2, name: 'foo'},
                    {id: 3, name: 'bar'}
                ]
            });
            const collection = new Collection({
                collection: list,
                filter: (item) => item.name === 'foo'
            });

            let ladder;
            let hasChanges = false;
            collection.subscribe('onCollectionChange', (event, action) => {
                if (action === IBindCollection.ACTION_RESET) {
                    collection.each((item) => {
                        ladder.isPrimary(item.getContents(), 'name');
                    });
                }
                if (action === IBindCollection.ACTION_CHANGE) {
                    hasChanges = true;
                }
            });

            ladder = new Ladder(collection);

            list.each((item) => {
                ladder.isPrimary(item, 'name');
            });

            list.assign([
                {id: 2, name: 'foo'},
                {id: 1, name: 'foo'},
                {id: 3, name: 'bar'}
            ]);

            assert.isFalse(hasChanges);
        });

        it('should renew ladder after reset', () => {
            const list = new ObservableList({
                items: [
                    {id: 1, name: 'foo'},
                    {id: 2, name: 'foo'},
                    {id: 3, name: 'bar'}
                ]
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(list.at(0), 'name'));
            assert.isFalse(ladder.isPrimary(list.at(1), 'name'));
            assert.isTrue(ladder.isPrimary(list.at(2), 'name'));

            ladder.reset();

            let changed = false;
            collection.subscribe('onCollectionChange', (event, action) => {
                changed = action === IBindCollection.ACTION_CHANGE;
            });

            list.removeAt(0);

            assert.isTrue(changed);
        });

        it('should don\'t trigger extra events with unaffected items after reset and then push to collection', () => {
            const list = new ObservableList({
                items: [
                    {id: 1, name: 'foo'},
                    {id: 2, name: 'foo'}
                ]
            });
            const collection = new Collection({
                collection: list
            });
            const ladder = new Ladder(collection);
            const newItems = [
                {id: 10, name: 'bar'},
                {id: 11, name: 'bar'}
            ];
            const moreItem = {id: 12, name: 'baz'};

            ladder.isPrimary(list.at(0), 'name');
            ladder.isPrimary(list.at(1), 'name');

            list.assign(newItems);

            let lastAction = null;
            collection.subscribe('onCollectionChange', (event, action, newItems) => {
                if (action === IBindCollection.ACTION_ADD) {
                    return;
                }
                if (newItems[0] && newItems[0].getContents() === moreItem) {
                    return;
                }
                lastAction = action;
            });
            list.add(moreItem);

            assert.isNull(lastAction);
        });
    });

    describe('.toJSON()', () => {
        it('should save collection as options', () => {
            const collection = new Collection({
                collection: []
            });
            const ladder = new Ladder(collection);
            const data = ladder.toJSON();

            assert.equal(data.state.$options, collection);
        });

        it('should don\'t save none collection as options', () => {
            const ladder = new Ladder();
            const data = ladder.toJSON();

            assert.isUndefined(data.state.$options);
        });

        it('should save offset', () => {
            const collection = new Collection({
                collection: []
            });
            const ladder = new Ladder(collection);
            const offset = 1;

            ladder.setOffset(offset);
            const data = ladder.toJSON();
            assert.equal((data.state as any)._offset, offset);
        });

        it('should save columnNames', () => {
            const items = [{id: 1}, {id: 2}];
            const collection = new Collection({
                collection: items
            });
            const ladder = new Ladder(collection);

            ladder.isPrimary(items[0], 'id');
            const data = ladder.toJSON();
            assert.deepEqual((data.state as any)._columnNames, ['id']);
        });
    });

    describe('::fromJSON()', () => {
        it('should restore collection', () => {
            const collection = new Collection({
                collection: []
            });
            const ladder = new Ladder(collection);
            const clone = (Ladder as any).fromJSON(ladder.toJSON());

            assert.equal(clone.getCollection(), collection);
        });

        it('should don\'t restore collection', () => {
            const ladder = new Ladder();
            const clone = (Ladder as any).fromJSON(ladder.toJSON());

            assert.isNull(clone.getCollection());
        });

        it('should restore offset', () => {
            const collection = new Collection({
                collection: []
            });
            const ladder = new Ladder(collection);
            const offset = 1;

            ladder.setOffset(offset);
            const clone = (Ladder as any).fromJSON(ladder.toJSON());

            assert.equal(clone._offset, offset);
        });

        it('should save columnNames', () => {
            const items = [{id: 1}, {id: 2}];
            const collection = new Collection({
                collection: items
            });
            const ladder = new Ladder(collection);

            ladder.isPrimary(items[0], 'id');
            const clone = (Ladder as any).fromJSON(ladder.toJSON());

            assert.deepEqual(clone._columnNames, ['id']);
        });

        it('should don\'t trigger extra events with unaffected items after push to collection', () => {
            const items = new ObservableList({
                items: [
                    {id: 1, name: 'a'},
                    {id: 2, name: 'a'}
                ]
            });
            const collection = new Collection({
                collection: items
            });
            const ladder = new Ladder(collection);
            const addItem = {id: 3, name: 'b'};

            ladder.isPrimary(items.at(0), 'name'); // force serialize _columnNames
            (Ladder as any).fromJSON(ladder.toJSON());
            ladder.destroy(); // unsubscribe

            let lastAction = null;
            collection.subscribe('onCollectionChange', (event, action, newItems) => {
                if (action === IBindCollection.ACTION_ADD) {
                    return;
                }
                if (newItems[0] && newItems[0].getContents() === addItem) {
                    return;
                }
                lastAction = action;
            });
            items.add(addItem);

            assert.isNull(lastAction);
        });
    });
});
