/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Types/_display/Ladder',
   'Types/_display/Collection',
   'Types/_collection/IObservable',
   'Types/_collection/ObservableList',
   'Types/_entity/Record',
   'Types/_entity/Model'
], function(
   Ladder,
   Collection,
   IBindCollection,
   ObservableList,
   Record,
   Model
) {
   'use strict';

   Ladder = Ladder.default;
   Collection = Collection.default;
   IBindCollection = IBindCollection.default;
   ObservableList = ObservableList.default;
   Record = Record.default;
   Model = Model.default;

   describe('Types/_display/Ladder', function() {
      var getItems = function() {
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
         },
         items,
         list,
         collection,
         ladder;

      beforeEach(function() {
         items = getItems();

         list = new ObservableList({
            items: items
         });

         collection = new Collection({
            collection: list
         });

         ladder = new Ladder(collection);
      });

      afterEach(function() {
         ladder.destroy();
         ladder = undefined;

         collection.destroy();
         collection = undefined;

         list.destroy();
         list = undefined;

         items = undefined;
      });

      function checkItem(idx, column, primary, msg) {
         var item = collection.at(idx),
            value = item.getContents()[column];

         assert.strictEqual(
            ladder.get(item.getContents(), column),
            primary ? value : '',
            msg || 'Error idx: ' + idx + ', column: ' + column
         );
      }

      describe('.constructor()', function() {
         it('should use collection from first argument', function() {
            var ladder = new Ladder(collection);
            assert.strictEqual(ladder.getCollection(), collection);
         });
      });

      describe('.setCollection()', function() {
         it('should set the collection', function() {
            var ladder = new Ladder();
            ladder.setCollection(collection);
            assert.strictEqual(ladder.getCollection(), collection);
         });

         it('should do nothing with the same collection', function() {
            ladder.isPrimary(list.at(0), 'LastName');
            ladder.setCollection(collection);
            assert.strictEqual(ladder.getCollection(), collection);
            assert.isTrue(ladder._columnNames.length > 0);
         });

         it('should move self handler to the end', function() {
            var items = [
                  {id: 1, title: 'foo'},
                  {id: 2, title: 'bar'}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection),
               expected = [IBindCollection.ACTION_ADD],
               given = [],
               handler = function(event, action, newItems) {
                  if (action === IBindCollection.ACTION_ADD) {
                     newItems.forEach(function(item) {
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

         it('should update data', function() {
            var items = [
                  {id: 1, title: 'foo'},
                  {id: 2, title: 'bar'},
                  {id: 3, title: 'bar'}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(items[0], 'title'));
            assert.isTrue(ladder.isPrimary(items[1], 'title'));
            assert.isFalse(ladder.isPrimary(items[2], 'title'));

            items = [
               {id: 1, title: 'foo'},
               {id: 2, title: 'foo'},
               {id: 3, title: 'bar'}
            ];
            list = new ObservableList({
               items: items
            });
            collection = new Collection({
               collection: list
            });
            ladder.setCollection(collection);

            assert.isTrue(ladder.isPrimary(items[0], 'title'));
            assert.isFalse(ladder.isPrimary(items[1], 'title'));
            assert.isTrue(ladder.isPrimary(items[2], 'title'));
         });

         it('should set null', function() {
            var ladder = new Ladder();
            ladder.setCollection(null);
            assert.isNull(ladder.getCollection());
         });

         it('should throw TypeError on invalid argument type', function() {
            assert.throws(function() {
               ladder.setCollection({});
            }, TypeError);
            assert.throws(function() {
               ladder.setCollection('a');
            }, TypeError);
            assert.throws(function() {
               ladder.setCollection(1);
            }, TypeError);
            assert.throws(function() {
               ladder.setCollection();
            }, TypeError);
         });
      });

      describe('.setOffset()', function() {
         it('should make item at offset primary', function() {
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

         it('should make previous offset secondary', function() {
            var list = new ObservableList({
                  items: [
                     {id: 1, name: 'foo'},
                     {id: 2, name: 'bar'},
                     {id: 3, name: 'bar'},
                     {id: 4, name: 'bar'},
                     {id: 5, name: 'bar'}
                  ]
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

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

      describe('.isLadderColumn()', function() {
         it('should recognize ladder column', function() {
            ladder.get(collection.at(0), 'LastName');
            assert.strictEqual(ladder.isLadderColumn('LastName'), true);

            ladder.get(collection.at(0), 'FirstName');
            assert.strictEqual(ladder.isLadderColumn('FirstName'), true);
         });

         it('should not recognize not ladder column', function() {
            assert.strictEqual(ladder.isLadderColumn('id'), false);
            assert.strictEqual(ladder.isLadderColumn('SurName'), false);
         });

         it('should not throw if there are no columns', function() {
            ladder = new Ladder(collection);
            assert.doesNotThrow(function() {
               assert.strictEqual(ladder.isLadderColumn('LastName'), false);
            });
         });
      });

      describe('.isPrimary()', function() {
         function checkPrimary(idx, column, primary) {
            assert.strictEqual(
               ladder.isPrimary(collection.at(idx).getContents(), column),
               primary,
               'Error idx: ' + idx + ', column: ' + column
            );
         }

         it('should build ladder for column "LastName"', function() {
            checkPrimary(0, 'LastName', true);
            checkPrimary(1, 'LastName', true);
            checkPrimary(2, 'LastName', true);
            checkPrimary(3, 'LastName', false);
            checkPrimary(4, 'LastName', false);
            checkPrimary(5, 'LastName', true);
            checkPrimary(6, 'LastName', false);
         });

         it('should build ladder for column "FirstName"', function() {
            checkPrimary(0, 'FirstName', true);
            checkPrimary(1, 'FirstName', false);
            checkPrimary(2, 'FirstName', true);
            checkPrimary(3, 'FirstName', true);
            checkPrimary(4, 'FirstName', false);
            checkPrimary(5, 'FirstName', true);
            checkPrimary(6, 'FirstName', false);
         });

         it('should build ladder for several columns', function() {
            checkPrimary(0, 'LastName', true);
            checkPrimary(1, 'LastName', true);
            checkPrimary(3, 'LastName', false);

            checkPrimary(0, 'FirstName', true);
            checkPrimary(1, 'FirstName', false);
         });

         it('should compare objects', function() {
            var now = new Date(),
               notNow = new Date(Date.now() + 1000),
               items = [
                  {id: 1, date: now},
                  {id: 2, date: now},
                  {id: 3, date: new Date(now.getTime())},
                  {id: 4, date: notNow}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(items[0], 'date'));
            assert.isFalse(ladder.isPrimary(items[1], 'date'));
            assert.isFalse(ladder.isPrimary(items[2], 'date'));
            assert.isTrue(ladder.isPrimary(items[3], 'date'));
         });

         it('should ignore items without unique id', function() {
            var items = [
                  {id: 1, title: 'foo'},
                  'foo',
                  {id: 3, title: 'foo'},
                  {id: 4, title: 'foo'}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(items[0], 'title'));
            assert.isTrue(ladder.isPrimary(items[1], 'title'));
            assert.isTrue(ladder.isPrimary(items[2], 'title'));
            assert.isFalse(ladder.isPrimary(items[3], 'title'));
         });

         it('should return true if collection is not assigned', function() {
            ladder = new Ladder(null);
            assert.isTrue(ladder.isPrimary({}, 'foo'));
         });

         it('should return chages after collection replace that displays as move up', function() {
            var items = [
                  {id: 1, pos: 1, title: 'a'},
                  {id: 2, pos: 2, title: 'b'},
                  {id: 3, pos: 3, title: 'a'},
                  {id: 4, pos: 4, title: 'a'}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list,
                  sort: function(a, b) {
                     return a.item.getContents().pos - b.item.getContents().pos;
                  }
               }),
               ladder = new Ladder(collection),
               expected = [true, false, true, true],
               given = [];

            //Replace {id: 4, pos: 4, title: 'a'} to {id: 4, pos: 0, title: 'a'} as move from position 3 to position 0
            list.replace({id: 4, pos: 0, title: 'a'}, 3);

            collection.each(function(item) {
               given.push(ladder.isPrimary(item.getContents(), 'title'));
            });

            assert.deepEqual(given, expected);
         });

         it('should return valid value after unfreeze the collection without changes analysis', function() {
            var list = new ObservableList({
                  items: [
                     {id: 1, title: 'a'},
                     {id: 2, title: 'b'},
                     {id: 3, title: 'a'},
                     {id: 4, title: 'b'}
                  ]
               }),
               collection = new Collection({
                  collection: list,
                  filter: function(item) {
                     return item.title === 'a';
                  }
               }),
               ladder = new Ladder(collection);

            assert.equal(ladder._collectionItems.length, collection.getCount());
            assert.notEqual(ladder._collectionItems.length, list.getCount());

            collection.setEventRaising(false);
            collection.setFilter(function() {
               return true;
            });
            collection.setEventRaising(true);

            assert.equal(ladder._collectionItems.length, collection.getCount());
            assert.equal(ladder._collectionItems.length, list.getCount());
         });
      });

      describe('.get()', function() {
         it('should hide repeating ladder columns', function() {
            checkItem(3, 'LastName', false);
            checkItem(4, 'LastName', false);
            checkItem(6, 'LastName', false);

            checkItem(1, 'FirstName', false);
            checkItem(4, 'FirstName', false);
            checkItem(6, 'FirstName', false);
         });

         it('should not hide first ladder columns', function() {
            checkItem(2, 'LastName', true);
            checkItem(5, 'LastName', true);

            checkItem(0, 'FirstName', true);
            checkItem(3, 'FirstName', true);
            checkItem(5, 'FirstName', true);
         });

         it('should not hide unique ladder columns', function() {
            checkItem(0, 'LastName', true);
            checkItem(1, 'LastName', true);

            checkItem(2, 'FirstName', true);
         });

         it('should change ladder after collection insert', function() {
            var at = 3;

            checkItem(at - 1, 'FirstName', true);//Adam
            checkItem(at, 'FirstName', true);//Ted

            checkItem(at - 1, 'LastName', true);//Smith
            checkItem(at, 'LastName', false);//Smith

            list.add({
               'id': 8,
               'LastName': 'Lennon',
               'FirstName': 'Ted'
            }, at);

            checkItem(at - 1, 'FirstName', true);//Adam
            checkItem(at, 'FirstName', true);//Ted
            checkItem(at + 1, 'FirstName', false);//Ted

            checkItem(at - 1, 'LastName', true);//Smith
            checkItem(at, 'LastName', true);//Lennon
            checkItem(at + 1, 'LastName', true);//Smith
         });

         it('should change ladder after collection append', function() {
            checkItem(0, 'FirstName', true);
            checkItem(0, 'LastName', true);

            list.add({
               'id': 8,
               'LastName': 'McCartney',
               'FirstName': 'John'
            });

            list.add({
               'id': 9,
               'LastName': 'McCartney',
               'FirstName': 'Paul'
            });

            var at = list.getCount() - 1;

            checkItem(at - 3, 'FirstName', true);//John
            checkItem(at - 2, 'FirstName', false);//John
            checkItem(at - 1, 'FirstName', false);//John
            checkItem(at, 'FirstName', true);//Paul

            checkItem(at - 3, 'LastName', true);//Bowring
            checkItem(at - 2, 'LastName', false);//Bowring
            checkItem(at - 1, 'LastName', true);//McCartney
            checkItem(at, 'LastName', false);//McCartney
         });

         it('should change ladder after collection remove', function() {
            var at = 3;//Ted Smith

            checkItem(at - 1, 'FirstName', true);//Adam
            checkItem(at, 'FirstName', true);//Ted
            checkItem(at + 1, 'FirstName', false);//Ted

            checkItem(at - 1, 'LastName', true);//Smith
            checkItem(at, 'LastName', false);//Smith
            checkItem(at + 1, 'LastName', false);//Smith

            list.removeAt(at);

            checkItem(at - 1, 'FirstName', true);//Adam
            checkItem(at, 'FirstName', true);//Ted

            checkItem(at - 1, 'LastName', true);//Smith
            checkItem(at, 'LastName', false);//Smith
         });

         it('should dont trigger "onCollectionChange" with CHANGE action after add removed item if isPrimary() has been called', function() {
            var at = 3,
               called = [],
               ladder,
               handler = function(e, action, newItems, newItemsIndex) {
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

            assert.isTrue(ladder.isPrimary(list.at(at - 1), 'FirstName'));//Adam
            assert.isTrue(ladder.isPrimary(list.at(at), 'FirstName'));//Ted
            assert.isFalse(ladder.isPrimary(list.at(at + 1), 'FirstName'));//Ted

            var removed = list.at(at);
            list.removeAt(at);
            list.add(removed, at);

            assert.isUndefined(called[at]);
            assert.isTrue(called[at + 1]);
         });

         it('should change ladder after collection replace', function() {
            list.replace({
               'id': 4,
               'LastName': 'Smiths',
               'FirstName': 'Афина'
            }, 3);

            checkItem(2, 'FirstName', true);//Adam
            checkItem(3, 'FirstName', true);//Афина
            checkItem(4, 'FirstName', true);//Ted

            checkItem(2, 'LastName', true);//Smith
            checkItem(3, 'LastName', true);//Smiths
            checkItem(4, 'LastName', true);//Smith
         });

         it('should change ladder after collection move down', function() {
            var from = 3,
               to = 5;

            checkItem(from - 1, 'FirstName', true);//Adam
            checkItem(from, 'FirstName', true);//Ted
            checkItem(from + 1, 'FirstName', false);//Ted

            checkItem(from - 1, 'LastName', true);//Smith
            checkItem(from, 'LastName', false);//Smith
            checkItem(from + 1, 'LastName', false);//Smith

            checkItem(to - 1, 'FirstName', false);//Ted
            checkItem(to, 'FirstName', true);//John
            checkItem(to + 1, 'FirstName', false);//John

            checkItem(to - 1, 'LastName', false);//Smith
            checkItem(to, 'LastName', true);//Bowring
            checkItem(to + 1, 'LastName', false);//Bowring

            list.setEventRaising(false, true);
            var item = list.removeAt(from);//Ted Smith
            list.add(item, to);
            list.setEventRaising(true, true);

            checkItem(from - 1, 'FirstName', true);//Adam
            checkItem(from, 'FirstName', true);//Ted

            checkItem(from - 1, 'LastName', true);//Smith
            checkItem(from, 'LastName', false);//Smith

            checkItem(to - 1, 'FirstName', true);//John
            checkItem(to, 'FirstName', true);//Ted
            checkItem(to + 1, 'FirstName', true);//John

            checkItem(to - 1, 'LastName', true);//Bowring
            checkItem(to, 'LastName', true);//Smith
            checkItem(to + 1, 'LastName', true);//Bowring
         });

         it('should change ladder after collection move up', function() {
            var from = 3,
               to = 2;

            checkItem(from - 1, 'FirstName', true);//Adam
            checkItem(from, 'FirstName', true);//Ted
            checkItem(from + 1, 'FirstName', false);//Ted

            checkItem(from - 1, 'LastName', true);//Smith
            checkItem(from, 'LastName', false);//Smith
            checkItem(from + 1, 'LastName', false);//Smith

            checkItem(to - 1, 'FirstName', false);//John
            checkItem(to, 'FirstName', true);//Adam
            checkItem(to + 1, 'FirstName', true);//Ted

            checkItem(to - 1, 'LastName', true);//Bowring
            checkItem(to, 'LastName', true);//Smith
            checkItem(to + 1, 'LastName', false);//Smith

            list.setEventRaising(false, true);
            var item = list.removeAt(from);//Ted Smith
            list.add(item, to);
            list.setEventRaising(true, true);

            checkItem(from - 1, 'FirstName', true);//Adam
            checkItem(from, 'FirstName', true);//Ted

            checkItem(from - 1, 'LastName', true);//Smith
            checkItem(from, 'LastName', false);//Smith

            checkItem(to - 1, 'FirstName', false);//John
            checkItem(to, 'FirstName', true);//Ted
            checkItem(to + 1, 'FirstName', true);//Adam

            checkItem(to - 1, 'LastName', true);//Bowring
            checkItem(to, 'LastName', true);//Smith
            checkItem(to + 1, 'LastName', false);//Smith
         });

         it('should change ladder after collection reset', function() {
            list.assign([{
               'id': 1,
               'LastName': 'Lennon'
            }, {
               'id': 2,
               'LastName': 'Bowring'
            }, {
               'id': 3,
               'LastName': 'Smith'
            }, {
               'id': 4,
               'LastName': 'Smith'
            }, {
               'id': 5,
               'LastName': 'Smith'
            }, {
               'id': 6,
               'LastName': 'Bowring'
            }, {
               'id': 7,
               'LastName': 'Bowring'
            }]);

            checkItem(0, 'LastName', true);
            checkItem(1, 'LastName', true);
            checkItem(2, 'LastName', true);
            checkItem(3, 'LastName', false);
            checkItem(4, 'LastName', false);
            checkItem(5, 'LastName', true);
            checkItem(6, 'LastName', false);
         });

         it('should change ladder after Record change', function() {
            var items = [
                  new Record({
                     rawData: {id: 1, name: 'one'}
                  }),
                  new Record({
                     rawData: {id: 2, name: 'one'}
                  }),
                  new Record({
                     rawData: {id: 3, name: 'two'}
                  })
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            list.at(1).set('name', 'two');

            assert.equal(ladder.get(list.at(0), 'name'), 'one');
            assert.equal(ladder.get(list.at(1), 'name'), 'two');
            assert.equal(ladder.get(list.at(2), 'name'), '');
         });

         it('should change ladder after Model change', function() {
            var items = [
                  new Model({
                     rawData: {uid: 1, name: 'one'},
                     idProperty: 'uid'
                  }),
                  new Model({
                     rawData: {uid: 2, name: 'one'},
                     idProperty: 'uid'
                  }),
                  new Model({
                     rawData: {uid: 3, name: 'two'},
                     idProperty: 'uid'
                  })
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            list.at(1).set('name', 'two');

            assert.equal(ladder.get(list.at(0), 'name'), 'one');
            assert.equal(ladder.get(list.at(1), 'name'), 'two');
            assert.equal(ladder.get(list.at(2), 'name'), '');
         });

         it('should change ladder after move', function() {
            var items = [
                  new Model({
                     rawData: {uid: 2, name: 'two'},
                     idProperty: 'uid'
                  }),
                  new Model({
                     rawData: {uid: 1, name: 'one'},
                     idProperty: 'uid'
                  }),
                  new Model({
                     rawData: {uid: 3, name: 'two'},
                     idProperty: 'uid'
                  }),
                  new Model({
                     rawData: {uid: 4, name: 'two'},
                     idProperty: 'uid'
                  })
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);
            list.each(function(item) {
               ladder.get(item, 'name');
            });
            list.setEventRaising(false, true);
            var model = list.at(1);
            list.remove(model);
            list.add(model, 0);
            list.setEventRaising(true, true);

            assert.equal(ladder.get(list.at(2), 'name'), '');
         });
      });

      describe('.setConverter()', function() {
         it('should receive requested item and previous item', function() {
            var items = [
                  {id: 1},
                  {id: 2},
                  {id: 3},
                  {id: 4}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection),
               index = 0;

            ladder.setConverter('id', function(val, item) {
               assert.strictEqual(val, item.id);
               index++;
               return val;
            });

            assert.isTrue(ladder.isPrimary(items[1], 'id'));
            assert.equal(index, 2);
         });

         it('should change ladder sequence', function() {
            var items = [
                  {id: 1, date: '11.10.2016 08:00'},
                  {id: 2, date: '11.10.2016 09:00'},
                  {id: 3, date: '12.10.2016 07:00'},
                  {id: 4, date: '13.10.2016 08:00'}
               ],
               list = new ObservableList({
                  items: items
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            ladder.setConverter('date', function(val) {
               return val.split(' ')[0];
            });

            assert.isTrue(ladder.isPrimary(items[0], 'date'));
            assert.isFalse(ladder.isPrimary(items[1], 'date'));
            assert.isTrue(ladder.isPrimary(items[2], 'date'));
            assert.isTrue(ladder.isPrimary(items[3], 'date'));
         });
      });

      describe('.subscribe()', function() {
         var subscribeCollectionChange = function(collection, given) {
            var handler = function(event, action, newItems, newItemsIndex) {
               given.push({
                  action: action,
                  item: newItems,
                  index: newItemsIndex
               });
            };

            collection.subscribe('onCollectionChange', handler);
            return function() {
               collection.unsubscribe('onCollectionChange', handler);
            };
         };

         it('should trigger "onCollectionChange" if offset has changed', function() {
            var expect = [{
                  action: IBindCollection.ACTION_CHANGE,
                  newItems: [collection.at(1)],
                  newItemsIndex: 1,
                  oldItems: [collection.at(1)],
                  oldItemsIndex: 1
               }],
               given = [],
               i,
               j,
               handler = function(e, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                  given.push({
                     action: action,
                     newItems: newItems,
                     newItemsIndex: newItemsIndex,
                     oldItems: oldItems,
                     oldItemsIndex: oldItemsIndex
                  });
               };

            collection.each(function(item) {
               ladder.get(item.getContents(), 'FirstName');
            });

            collection.subscribe('onCollectionChange', handler);
            ladder.setOffset(1);
            collection.unsubscribe('onCollectionChange', handler);

            assert.equal(given.length, expect.length);
            for (i = 0; i < given.length; i++) {
               assert.strictEqual(given[i].action, expect[i].action, 'at change #' + i);

               assert.strictEqual(given[i].newItems.length, expect[i].newItems.length, 'at change #' + i);
               assert.strictEqual(given[i].newItemsIndex, expect[i].newItemsIndex, 'at change #' + i);
               for (j = 0; j < given[i].newItems.length; j++) {
                  assert.strictEqual(given[i].newItems[j], expect[i].newItems[j], 'at change #' + i);
               }

               assert.strictEqual(given[i].oldItems.length, expect[i].oldItems.length, 'at change #' + i);
               assert.strictEqual(given[i].oldItemsIndex, expect[i].oldItemsIndex, 'at change #' + i);
               for (j = 0; j < given[i].oldItems.length; j++) {
                  assert.strictEqual(given[i].oldItems[j], expect[i].oldItems[j], 'at change #' + i);
               }
            }
         });

         it('should trigger "onCollectionChange" if item has been moved', function() {
            var from = 5,
               to = 1,
               given = [],
               handler = function(e, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                  if (action === IBindCollection.ACTION_MOVE && newItemsIndex === to) {
                     given.push({
                        action: action,
                        newItems: newItems,
                        newItemsIndex: newItemsIndex,
                        oldItems: oldItems,
                        oldItemsIndex: oldItemsIndex
                     });
                  }
               };

            checkItem(5, 'FirstName', true);
            list.setEventRaising(false, true);
            var item = list.removeAt(from);//Ted Smith
            list.add(item, to);

            collection.subscribe('onCollectionChange', handler);
            list.setEventRaising(true, true);
            collection.unsubscribe('onCollectionChange', handler);

            assert.equal(given.length, 1);
            checkItem(given[0].newItemsIndex, 'FirstName', false);
         });

         it('should trigger "onCollectionChange" for neighbors after collection add', function() {
            var given = [],
               expect = {},
               unsubscribe = subscribeCollectionChange(collection, given),
               i;

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
            for (i = 0; i < given.length; i++) {
               if (expect.hasOwnProperty(given[i].index)) {
                  expect[given[i].index] = true;
               }
            }

            for (i in expect) {
               if (expect.hasOwnProperty(i)) {
                  assert.isTrue(expect[i], 'Item at ' + i + ' should be changed');
               }
            }
         });

         it('should don\'t trigger extra events after reset if collection items have been moved', function() {
            var list = new ObservableList({
                  items: [
                     {id: 1, name: 'foo'},
                     {id: 2, name: 'foo'},
                     {id: 3, name: 'bar'}
                  ]
               }),
               collection = new Collection({
                  collection: list,
                  filter: function(item) {
                     return item.name === 'foo';
                  }
               }),
               ladder,
               hasChanges = false;

            collection.subscribe('onCollectionChange', function(event, action) {
               if (action === IBindCollection.ACTION_RESET) {
                  collection.each(function(item) {
                     ladder.isPrimary(item.getContents(), 'name');
                  });
               }
               if (action === IBindCollection.ACTION_CHANGE) {
                  hasChanges = true;
               }
            });

            ladder = new Ladder(collection);

            list.each(function(item) {
               ladder.isPrimary(item, 'name');
            });

            list.assign([
               {id: 2, name: 'foo'},
               {id: 1, name: 'foo'},
               {id: 3, name: 'bar'}
            ]);

            assert.isFalse(hasChanges);
         });

         it('should renew ladder after reset', function() {
            var list = new ObservableList({
                  items: [
                     {id: 1, name: 'foo'},
                     {id: 2, name: 'foo'},
                     {id: 3, name: 'bar'}
                  ]
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection);

            assert.isTrue(ladder.isPrimary(list.at(0), 'name'));
            assert.isFalse(ladder.isPrimary(list.at(1), 'name'));
            assert.isTrue(ladder.isPrimary(list.at(2), 'name'));

            ladder.reset();

            var changed = false;
            collection.subscribe('onCollectionChange', function(event, action) {
               changed = action === IBindCollection.ACTION_CHANGE;
            });

            list.removeAt(0);

            assert.isTrue(changed);
         });

         it('should don\'t trigger extra events with unaffected items after reset and then push to collection', function() {
            var list = new ObservableList({
                  items: [
                     {id: 1, name: 'foo'},
                     {id: 2, name: 'foo'}
                  ]
               }),
               collection = new Collection({
                  collection: list
               }),
               ladder = new Ladder(collection),
               newItems = [
                  {id: 10, name: 'bar'},
                  {id: 11, name: 'bar'}
               ],
               moreItem = {id: 12, name: 'baz'},
               lastAction;

            ladder.isPrimary(list.at(0), 'name');
            ladder.isPrimary(list.at(1), 'name');

            list.assign(newItems);

            lastAction = null;
            collection.subscribe('onCollectionChange', function(event, action, newItems) {
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

      describe('.toJSON()', function() {
         it('should save collection as options', function() {
            var collection = new Collection({
                  collection: []
               }),
               ladder = new Ladder(collection),
               data = ladder.toJSON();

            assert.equal(data.state.$options, collection);
         });

         it('should don\'t save none collection as options', function() {
            var ladder = new Ladder(),
               data = ladder.toJSON();

            assert.isUndefined(data.state.$options);
         });

         it('should save offset', function() {
            var collection = new Collection({
                  collection: []
               }),
               ladder = new Ladder(collection),
               offset = 1,
               data;

            ladder.setOffset(offset);
            data = ladder.toJSON();

            assert.equal(data.state._offset, offset);
         });

         it('should save columnNames', function() {
            var items = [{id: 1}, {id: 2}],
               collection = new Collection({
                  collection: items
               }),
               ladder = new Ladder(collection),
               data;

            ladder.isPrimary(items[0], 'id');
            data = ladder.toJSON();

            assert.deepEqual(data.state._columnNames, ['id']);
         });
      });

      describe('::fromJSON()', function() {
         it('should restore collection', function() {
            var collection = new Collection({
                  collection: []
               }),
               ladder = new Ladder(collection),
               clone;

            clone = Ladder.fromJSON(ladder.toJSON());

            assert.equal(clone.getCollection(), collection);
         });

         it('should don\'t restore collection', function() {
            var ladder = new Ladder(),
               clone;

            clone = Ladder.fromJSON(ladder.toJSON());

            assert.isNull(clone.getCollection());
         });

         it('should restore offset', function() {
            var collection = new Collection({
                  collection: []
               }),
               ladder = new Ladder(collection),
               clone,
               offset = 1;

            ladder.setOffset(offset);
            clone = Ladder.fromJSON(ladder.toJSON());

            assert.equal(clone._offset, offset);
         });

         it('should save columnNames', function() {
            var items = [{id: 1}, {id: 2}],
               collection = new Collection({
                  collection: items
               }),
               ladder = new Ladder(collection),
               clone;

            ladder.isPrimary(items[0], 'id');
            clone = Ladder.fromJSON(ladder.toJSON());

            assert.deepEqual(clone._columnNames, ['id']);
         });

         it('should don\'t trigger extra events with unaffected items after push to collection', function() {
            var items = new ObservableList({
                  items: [
                     {id: 1, name: 'a'},
                     {id: 2, name: 'a'}
                  ]
               }),
               collection = new Collection({
                  collection: items
               }),
               ladder = new Ladder(collection),
               addItem = {id: 3, name: 'b'},
               lastAction;

            ladder.isPrimary(items.at(0), 'name');//force serialize _columnNames
            Ladder.fromJSON(ladder.toJSON());
            ladder.destroy();//unsubscribe

            lastAction = null;
            collection.subscribe('onCollectionChange', function(event, action, newItems) {
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
});
