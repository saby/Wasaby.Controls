/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
   'Types/_display/Tree',
   'Types/_collection/List',
   'Types/_collection/ObservableList',
   'Types/_display/TreeItem',
   'Types/_collection/IObservable',
   'Types/_collection/RecordSet',
   'Core/Serializer',
   'Types/display'
], function(
   Tree,
   List,
   ObservableList,
   TreeItem,
   IBindCollectionDisplay,
   RecordSet,
   Serializer
) {
   'use strict';

   Tree = Tree.default;
   List = List.default;
   ObservableList = ObservableList.default;
   TreeItem = TreeItem.default;
   IBindCollectionDisplay = IBindCollectionDisplay.default;
   RecordSet = RecordSet.default;

   describe('Types/_display/Tree', function() {
      var getData = function() {
            return [{
               id: 10,
               pid: 1,
               node: true,
               title: 'AA'
            }, {
               id: 11,
               pid: 1,
               node: true,
               title: 'AB'
            }, {
               id: 12,
               pid: 1,
               node: true,
               title: 'AC'
            }, {
               id: 121,
               pid: 12,
               node: true,
               title: 'ACA'
            }, {
               id: 122,
               pid: 12,
               node: false,
               title: 'ACB'
            }, {
               id: 123,
               pid: 12,
               node: false,
               title: 'ACC'
            }, {
               id: 1,
               pid: 0,
               node: true,
               title: 'A'
            }, {
               id: 2,
               pid: 0,
               node: true,
               title: 'B'
            }, {
               id: 20,
               pid: 2,
               node: true,
               title: 'BA'
            }, {
               id: 200,
               pid: 20,
               node: true,
               title: 'BAA'
            }, {
               id: 2000,
               pid: 200,
               title: 'BAAA'
            }, {
               id: 3,
               pid: 0,
               node: false,
               title: 'C'
            }, {
               id: 4,
               pid: 0,
               title: 'D'
            }];
         },
         getItems = function() {
            return new List({
               items: getData()
            });
         },
         getObservableItems = function() {
            return new ObservableList({
               items: getData()
            });
         },
         getTree = function(items) {
            return new Tree({
               collection: items || getItems(),
               root: {
                  id: 0,
                  title: 'Root'
               },
               idProperty: 'id',
               parentProperty: 'pid',
               nodeProperty: 'node'
            });
         },
         getObservableTree = function(items) {
            return new Tree({
               collection: items || getObservableItems(),
               root: {
                  id: 0,
                  title: 'Root'
               },
               idProperty: 'id',
               parentProperty: 'pid',
               nodeProperty: 'node'
            });
         },
         getRecordSetTree = function() {
            var rs = new RecordSet({
               rawData: getData(),
               idProperty: 'id'
            });
            return getObservableTree(rs);
         },
         items,
         tree;

      beforeEach(function() {
         items = getItems();
         tree = getTree(items);
      });

      afterEach(function() {
         tree.destroy();
         tree = undefined;
         items = undefined;
      });

      describe('.getEnumerator()', function() {
         it('should traverse items in hierarchical order use AdjacencyList strategy', function() {
            var enumerator = tree.getEnumerator(),
               expect = ['A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC', 'B', 'BA', 'BAA', 'BAAA', 'C', 'D'],
               index = 0,
               item;

            while (enumerator.moveNext()) {
               item = enumerator.getCurrent();
               assert.strictEqual(item.getContents().title, expect[index]);
               index++;
            }
         });

         it('should traverse items in hierarchical order use MaterializedPath strategy', function() {
            var items = [
                  {id: 1, children: [
                     {id: 11, children: []},
                     {id: 12, children: [
                        {id: 121, children: []},
                        {id: 122}
                     ]},
                     {id: 13, children: []}
                  ]},
                  {id: 2, children: [
                     {id: 21},
                     {id: 22}
                  ]}
               ],
               tree = new Tree({
                  collection: items,
                  root: {
                     id: 0,
                     title: 'Root'
                  },
                  childrenProperty: 'children'
               }),
               enumerator = tree.getEnumerator(),
               expect = [1, 11, 12, 121, 122, 13, 2, 21, 22],
               index = 0,
               item;

            while (enumerator.moveNext()) {
               item = enumerator.getCurrent();
               assert.strictEqual(item.getContents().id, expect[index]);
               index++;
            }
         });

         it('should traverse all items', function() {
            var enumerator = tree.getEnumerator(),
               index = 0;
            while (enumerator.moveNext()) {
               index++;
            }
            assert.strictEqual(tree.getCount(), index);
            assert.strictEqual(tree.getCollection().getCount(), index);
         });

         it('should traverse all items as flat list if no options specified', function() {
            var tree = new Tree({
                  collection: items
               }),
               enumerator = tree.getEnumerator(),
               index = 0,
               item;
            while (enumerator.moveNext()) {
               item = enumerator.getCurrent();
               assert.strictEqual(item.getContents(), items.at(index));
               index++;
            }
            assert.strictEqual(tree.getCount(), index);
            assert.strictEqual(tree.getCollection().getCount(), index);
         });

         it('should traverse root if "rootEnumerable" option is true', function() {
            var tree = new Tree({
                  collection: items,
                  root: {
                     id: 0,
                     title: 'Root'
                  },
                  rootEnumerable: true,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node'
               }),
               enumerator = tree.getEnumerator(),
               expect = ['Root', 'A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC', 'B', 'BA', 'BAA', 'BAAA', 'C', 'D'],
               index = 0,
               item;
            while (enumerator.moveNext()) {
               item = enumerator.getCurrent();
               assert.strictEqual(item.getContents().title, expect[index]);
               index++;
            }
            assert.strictEqual(tree.getCount(), index);
            assert.strictEqual(tree.getCollection().getCount(), index - 1);
         });
      });

      describe('.each()', function() {
         it('should update the display after move grouped item out of the root', function() {
            var rs = new RecordSet({
                  rawData: [
                     {id: 1, pid: 1, group: 'a'},
                     {id: 2, pid: 1, group: 'a'},
                     {id: 3, pid: 1, group: 'a'}
                  ]
               }),
               tree = new Tree({
                  collection: rs,
                  root: 1,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  group: function(item) {
                     return item.get('group');
                  }
               }),
               model = rs.at(1),
               expectedBefore = ['a', rs.at(0), rs.at(1), rs.at(2)],
               expectedAfter = ['a', rs.at(0), rs.at(2)];

            tree.each(function(item, i) {
               assert.equal(expectedBefore[i], item.getContents());
            });

            model.set('pid', 0);
            tree.each(function(item, i) {
               assert.equal(expectedAfter[i], item.getContents());
            });
         });
      });

      describe('.getItemBySourceItem()', function() {
         it('should return projection item if it collection item have been changed', function() {
            var tree = getRecordSetTree(),
               collection = tree.getCollection(),
               item = collection.getRecordById(10);

            tree.setFilter(function(collItem) {
               return (collItem.get('pid') === 0) ? true : false;
            });
            item.set('pid', 0);
            assert.isDefined(tree.getItemBySourceItem(item));
         });
      });

      describe('.getParentProperty()', function() {
         it('should return given value', function() {
            assert.equal(tree.getParentProperty(), 'pid');
         });
      });

      describe('.setParentProperty()', function() {
         it('should change the value', function() {
            tree.setParentProperty('uid');
            assert.equal(tree.getParentProperty(), 'uid');
         });
         it('should bring all items to the root', function() {
            tree.setRoot(null);
            tree.setParentProperty('');
            var count = 0;
            tree.each(function(item) {
               assert.equal(item.getContents(), tree.getCollection().at(count));
               count++;

            });
            assert.strictEqual(count, tree.getCollection().getCount());
            assert.strictEqual(tree.getCount(), tree.getCollection().getCount());
         });
      });

      describe('.getNodeProperty()', function() {
         it('should return given value', function() {
            assert.equal(tree.getNodeProperty(), 'node');
         });
      });

      describe('.getChildrenProperty()', function() {
         it('should return given value', function() {
            assert.strictEqual(tree.getChildrenProperty(), '');
         });
      });

      describe('.getRoot()', function() {
         it('should return given root from a number', function() {
            var tree = new Tree({
               collection: items,
               root: 0,
               idProperty: 'id'
            });
            assert.strictEqual(tree.getRoot().getContents(), 0);
         });

         it('should return given root from a string', function() {
            var tree = new Tree({
               collection: items,
               root: '',
               idProperty: 'id'
            });
            assert.strictEqual(tree.getRoot().getContents(), '');
         });

         it('should return given root from an object', function() {
            var tree = new Tree({
               collection: items,
               root: {id: 1, title: 'Root'},
               idProperty: 'id'
            });
            assert.strictEqual(tree.getRoot().getContents().id, 1);
            assert.strictEqual(tree.getRoot().getContents().title, 'Root');
         });

         it('should return given root from a TreeItem', function() {
            var root = new TreeItem({contents: {
                  id: null,
                  title: 'Root'
               }}),
               tree = new Tree({
                  collection: items,
                  root: root,
                  idProperty: 'id'
               });
            assert.strictEqual(tree.getRoot(), root);
         });

         it('should return a valid enumerable root if it have children without link by contents', function() {
            var tree = new Tree({
                  collection: items,
                  root: null,
                  rootEnumerable: true,
                  idProperty: 'id'
               }),
               root = tree.getRoot();

            assert.isNull(root.getContents());
            assert.isTrue(root.isRoot());
            assert.isUndefined(root.getParent());
         });

         it('should return a root without trigger property change event', function() {
            var triggered = false,
               tree = new Tree({
                  collection: items,
                  root: 0,
                  idProperty: 'id'
               }),
               handler = function() {
                  triggered = true;
               };

            tree.subscribe('onCollectionChange', handler);
            tree.getRoot();
            tree.unsubscribe('onCollectionChange', handler);

            assert.isFalse(triggered);
         });
      });

      describe('.setRoot()', function() {
         it('should set root as scalar', function() {
            tree.setRoot(1);
            assert.strictEqual(tree.getRoot().getContents(), 1);
         });

         it('should set root as object', function() {
            var root = {id: 1};
            tree.setRoot(root);
            assert.strictEqual(tree.getRoot().getContents(), root);
         });

         it('should set root as tree item', function() {
            var root = new TreeItem({contents: {
               id: null,
               title: 'Root'
            }});
            tree.setRoot(root);
            assert.strictEqual(tree.getRoot(), root);
         });

         it('should update count', function() {
            assert.notEqual(tree.getCount(), 6);
            tree.setRoot(1);
            assert.strictEqual(tree.getCount(), 6);
         });

         it('should keep old instances', function() {
            var oldItems = [],
               newItems = [];

            tree.each(function(item) {
               oldItems.push(item);
            });

            tree.setRoot(1);
            tree.each(function(item) {
               newItems.push(item);
            });

            assert.deepEqual(oldItems.slice(1, 7), newItems);
         });

         it('should change items and then the revert it back', function() {
            var before = [];
            tree.each(function(item) {
               before.push(item.getContents());
            });
            assert.notEqual(before.length, 6);

            //Change items
            tree.setRoot(1);
            var after = [];
            tree.each(function(item) {
               after.push(item.getContents());
            });
            assert.strictEqual(after.length, 6);

            //Revert back
            tree.setRoot(0);
            var revert = [];
            tree.each(function(item) {
               revert.push(item.getContents());
            });
            assert.deepEqual(revert, before);
         });

         it('should set root if grouping has used', function() {
            var items = [
                  {id: 1, pid: 0, g: 0},
                  {id: 2, pid: 0, g: 1},
                  {id: 11, pid: 1, g: 0}
               ],
               list = new List({
                  items: items
               }),
               tree = new Tree({
                  collection: list,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  group: function(item) {
                     return item.g;
                  }
               });

            tree.setRoot(1);
            assert.strictEqual(tree.getCount(), 2);
         });
      });

      describe('.isRootEnumerable()', function() {
         it('should return false by default', function() {
            assert.isFalse(tree.isRootEnumerable());
         });
      });

      describe('.setRootEnumerable()', function() {
         it('should change root to enumerable', function() {
            tree.setRootEnumerable(true);
            assert.isTrue(tree.isRootEnumerable());
         });

         it('should not change root to enumerable', function() {
            tree.setRootEnumerable(false);
            assert.isFalse(tree.isRootEnumerable());
         });

         it('should traverse root after change to true', function() {
            tree.setRootEnumerable(true);

            var expect = ['Root', 'A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC', 'B', 'BA', 'BAA', 'BAAA', 'C', 'D'],
               index = 0;
            tree.each(function(item) {
               assert.strictEqual(item.getContents().title, expect[index]);
               index++;
            });
            assert.strictEqual(tree.getCount(), index);
            assert.strictEqual(tree.getCollection().getCount(), index - 1);
         });

         it('should not traverse root after change to false', function() {
            tree.setRootEnumerable(true);
            tree.setRootEnumerable(false);

            var expect = ['A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC', 'B', 'BA', 'BAA', 'BAAA', 'C', 'D'],
               index = 0;
            tree.each(function(item) {
               assert.strictEqual(item.getContents().title, expect[index]);
               index++;
            });
            assert.strictEqual(tree.getCount(), index);
            assert.strictEqual(tree.getCollection().getCount(), index);
         });
      });

      describe('.getChildren()', function() {
         it('should return children of a root', function() {
            var children = tree.getChildren(tree.getRoot()),
               expect = ['A', 'B', 'C', 'D'];

            assert.equal(children.getCount(), expect.length);
            children.each(function(child, index) {
               assert.strictEqual(child.getContents().title, expect[index]);
            });
         });

         it('should return children of the first node', function() {
            var children = tree.getChildren(tree.at(0)),
               expect = ['AA', 'AB', 'AC'];

            assert.equal(children.getCount(), expect.length);
            children.each(function(child, index) {
               assert.strictEqual(child.getContents().title, expect[index]);
            });
         });

         it('should return children hidden by the filter', function() {
            var children,
               expect = ['AA', 'AB', 'AC'];

            tree.setFilter(function(item) {
               return item.title !== 'AB';
            });

            assert.equal(
               tree.getChildren(tree.at(0), true).getCount(),
               expect.length - 1
            );

            children = tree.getChildren(tree.at(0), false);

            assert.equal(
               children.getCount(),
               expect.length
            );
            children.each(function(child, index) {
               assert.strictEqual(child.getContents().title, expect[index]);
            });
         });

         it('should throw an error for invalid node', function() {
            assert.throws(function() {
               tree.getChildren();
            });
            assert.throws(function() {
               tree.getChildren({});
            });
         });
      });

      describe('.getItemUid()', function() {
         it('should return path from item to the root', function() {
            var data = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 1},
                  {id: 3, pid: 2}
               ],
               items = new List({
                  items: data
               }),
               tree = getTree(items),
               expect = ['1', '2:1', '3:2:1'],
               index = 0;

            tree.each(function(item) {
               assert.strictEqual(tree.getItemUid(item), expect[index]);
               index++;
            });
            assert.equal(index, expect.length);
         });

         it('should return path for items with duplicated ids', function() {
            var data = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 1},
                  {id: 3, pid: 2},
                  {id: 2, pid: 1}
               ],
               items = new List({
                  items: data
               }),
               tree = getTree(items),
               expect = ['1', '2:1', '3:2:1', '2:1-1', '3:2:1-1'],
               index = 0;

            tree.each(function(item) {
               assert.strictEqual(tree.getItemUid(item), expect[index]);
               index++;
            });
            assert.equal(index, expect.length);
         });
      });

      describe('.getIndexBySourceItem()', function() {
         it('should return 0 for root contents if root is enumerable', function() {
            var tree = new Tree({
               collection: items,
               root: items[1],
               rootEnumerable: true,
               idProperty: 'id'
            });

            assert.strictEqual(tree.getIndexBySourceItem(items[1]), 0);
         });
      });

      describe('.getIndexBySourceIndex()', function() {
         it('should return valid tree index if root is enumerable', function() {
            var index,
               i;

            tree.setRootEnumerable(true);
            for (i = 0; i < items.getCount(); i++) {
               index = tree.getIndexBySourceIndex(i);
               assert.strictEqual(
                  items.at(i),
                  tree.at(index).getContents()
               );
            }
         });
      });

      describe('.getSourceIndexByIndex()', function() {
         it('should return valid source collection index if root is enumerable', function() {
            var index,
               i;

            tree.setRootEnumerable(true);
            for (i = 0; i < tree.getCount(); i++) {
               index = tree.getSourceIndexByIndex(i);
               if (index === -1) {
                  assert.strictEqual(
                     tree.at(i),
                     tree.getRoot()
                  );
               } else {
                  assert.strictEqual(
                     tree.at(i).getContents(),
                     items.at(index)
                  );
               }
            }
         });
      });

      describe('.getNext()', function() {
         it('should return next item', function() {
            var item = tree.getNext(tree.at(0));
            assert.equal(item.getContents().id, 2);
         });

         it('should skip groups', function() {
            var items = [
                  {id: 1, pid: 0, g: 0},
                  {id: 2, pid: 0, g: 1},
                  {id: 11, pid: 1, g: 0},
                  {id: 12, pid: 1, g: 0},
                  {id: 22, pid: 2, g: 2}
               ],
               list = new List({
                  items: items
               }),
               display = new Tree({
                  collection: list,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  group: function(item) {
                     return item.g;
                  }
               }),
               item;

            item = display.at(1);//id = 1
            assert.strictEqual(display.getNext(item).getContents().id, 2);

            item = display.at(2);//id = 11
            assert.strictEqual(display.getNext(item).getContents().id, 12);
         });
      });

      describe('.getPrevious()', function() {
         it('should return previous item', function() {
            var item = tree.getPrevious(tree.at(2));
            assert.equal(item.getContents().id, 10);
         });

         it('should skip groups', function() {
            var items = [
                  {id: 1, pid: 0, g: 0},
                  {id: 2, pid: 0, g: 1},
                  {id: 11, pid: 1, g: 0},
                  {id: 12, pid: 1, g: 0},
                  {id: 22, pid: 2, g: 2}
               ],
               list = new List({
                  items: items
               }),
               display = new Tree({
                  collection: list,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  group: function(item) {
                     return item.g;
                  }
               }),
               item;

            item = display.at(5);//id = 2
            assert.strictEqual(display.getPrevious(item).getContents().id, 1);

            item = display.at(1);//id = 1
            assert.isUndefined(display.getPrevious(item));
         });
      });

      describe('.moveToNext()', function() {
         it('should move current through direct children of the root', function() {
            assert.isTrue(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'A');

            assert.isTrue(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'B');

            assert.isTrue(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'C');

            assert.isTrue(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'D');

            assert.isFalse(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'D');
         });

         it('should move current through direct children of the given node', function() {
            tree.setCurrentPosition(1);

            assert.strictEqual(tree.getCurrent().getContents().title, 'AA');

            assert.isTrue(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AB');

            assert.isTrue(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AC');

            assert.isFalse(tree.moveToNext());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AC');
         });

         it('should notify onCurrentChange', function() {
            var fired = false;
            tree.subscribe('onCurrentChange', function() {
               fired = true;
            });
            tree.moveToNext();

            assert.isTrue(fired);
         });
      });

      describe('.moveToPrevious()', function() {
         it('should move current through direct children of the root', function() {
            tree.setCurrentPosition(tree.getCount() - 1);
            assert.strictEqual(tree.getCurrent().getContents().title, 'D');

            assert.isTrue(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'C');

            assert.isTrue(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'B');

            assert.isTrue(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'A');

            assert.isFalse(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'A');
         });

         it('should move current through direct children of the given node', function() {
            tree.setCurrentPosition(3);

            assert.strictEqual(tree.getCurrent().getContents().title, 'AC');

            assert.isTrue(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AB');

            assert.isTrue(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AA');

            assert.isFalse(tree.moveToPrevious());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AA');
         });

         it('should notify onCurrentChange', function() {
            var fired = false;

            tree.setCurrentPosition(3);
            tree.subscribe('onCurrentChange', function() {
               fired = true;
            });
            tree.moveToPrevious();

            assert.isTrue(fired);
         });
      });

      describe('.moveToAbove()', function() {
         it('should keep current undefined', function() {
            assert.isFalse(tree.moveToAbove());
            assert.isUndefined(tree.getCurrent());
         });

         it('should not move if parent is the root', function() {
            tree.moveToNext();
            var current = tree.getCurrent();
            assert.isFalse(tree.moveToAbove());
            assert.strictEqual(tree.getCurrent(), current);
         });

         it('should move to the parent', function() {
            tree.setCurrentPosition(4);

            assert.isTrue(tree.moveToAbove());
            assert.strictEqual(tree.getCurrent().getContents().title, 'AC');

            assert.isTrue(tree.moveToAbove());
            assert.strictEqual(tree.getCurrent().getContents().title, 'A');

            assert.isFalse(tree.moveToAbove());
            assert.strictEqual(tree.getCurrent().getContents().title, 'A');
         });
      });

      describe('.moveToBelow()', function() {
         it('should keep current undefined', function() {
            assert.isFalse(tree.moveToBelow());
            assert.isUndefined(tree.getCurrent());
         });

         it('should not move if current is not a node', function() {
            tree.setCurrentPosition(tree.getCount() - 1);
            var current = tree.getCurrent();
            assert.isFalse(current.isNode());
            assert.isFalse(tree.moveToBelow());
            assert.strictEqual(tree.getCurrent(), current);
         });

         it('should not move if current has no children', function() {
            tree.setCurrentPosition(11);
            assert.strictEqual(tree.getCurrent().getContents().title, 'C');

            var current = tree.getCurrent();
            assert.strictEqual(tree.getChildren(current).getCount(), 0);
            assert.isFalse(tree.moveToBelow());
            assert.strictEqual(tree.getCurrent(), current);
         });

         it('should move to the first child', function() {
            tree.setCurrentPosition(7);
            assert.strictEqual(tree.getCurrent().getContents().title, 'B');

            assert.isTrue(tree.moveToBelow());
            assert.strictEqual(tree.getCurrent().getContents().title, 'BA');

            assert.isTrue(tree.moveToBelow());
            assert.strictEqual(tree.getCurrent().getContents().title, 'BAA');

            assert.isTrue(tree.moveToBelow());
            assert.strictEqual(tree.getCurrent().getContents().title, 'BAAA');

            assert.isFalse(tree.moveToBelow());
            assert.strictEqual(tree.getCurrent().getContents().title, 'BAAA');
         });
      });

      describe('.setSort', function() {
         it('should sort put folders before leafs', function() {
            var items = [
                  {id: 1, pid: 0, node: false},
                  {id: 2, pid: 0, node: false},
                  {id: 3, pid: 0, node: true},
                  {id: 4, pid: 0, node: true}
               ],
               collection = new List({
                  items: items
               }),
               display = new Tree({
                  collection: collection,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node'
               }),
               exected = [
                  items[2],
                  items[3],
                  items[0],
                  items[1]
               ],
               given = [];

            display.setSort(function(a, b) {
               var
                  isNodeA = a.item.isNode(),
                  isNodeB = b.item.isNode();
               if (isNodeA === isNodeB) {
                  return 0;
               } else {
                  return isNodeA ? -1 : 1;
               }
            });

            display.each(function(item) {
               given.push(item.getContents());
            });

            assert.deepEqual(given, exected);
         });
      });

      describe('.setGroup()', function() {
         it('should place nodes before leafs', function() {
            var items = [
                  {id: 1, node: false, group: 'a'},
                  {id: 2, node: false, group: 'b'},
                  {id: 3, node: true, group: 'a'},
                  {id: 4, node: true, group: 'b'},
                  {id: 5, node: false, group: 'a'}
               ],
               list = new List({
                  items: items
               }),
               display = new Tree({
                  collection: list,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node'
               }),
               expected = [
                  'a',
                  items[0],
                  items[2],
                  items[4],
                  'b',
                  items[1],
                  items[3]
               ],
               given = [];

            display.setGroup(function(item) {
               return item.group;
            });
            display.each(function(item) {
               given.push(item.getContents());
            });

            assert.deepEqual(given, expected);
         });

         it('should place groups inside nodes', function() {
            var items = [
                  {id: 1, pid: 0, node: true, group: 'a'},
                  {id: 2, pid: 0, node: true, group: 'a'},
                  {id: 3, pid: 0, node: false, group: 'a'},
                  {id: 11, pid: 1, node: false, group: 'b'},
                  {id: 12, pid: 1, node: false, group: 'b'},
                  {id: 13, pid: 1, node: false, group: 'c'}
               ],
               list = new List({
                  items: items
               }),
               display = new Tree({
                  collection: list,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node'
               }),
               expected,
               given;

            expected = [
               items[0],
               items[3],
               items[4],
               items[5],
               items[1],
               items[2]
            ];
            given = [];
            display.each(function(item) {
               given.push(item.getContents());
            });
            assert.deepEqual(given, expected);

            display.setGroup(function(item) {
               return item.group;
            });
            expected = [
               'a',
               items[0],
               'b',
               items[3],
               items[4],
               'c',
               items[5],
               'a',
               items[1],
               items[2]
            ];
            given = [];
            display.each(function(item) {
               given.push(item.getContents());
            });
            assert.deepEqual(given, expected);
         });

         it('should leave groups inside nodes after add items', function() {
            var items = [
                  {id: 1, pid: 0, node: true, group: 'a'},
                  {id: 2, pid: 0, node: false, group: 'b'},
               ],
               addItems = [
                  {id: 11, pid: 1, node: false, group: 'c'},
               ],
               list = new ObservableList({
                  items: items
               }),
               display = new Tree({
                  collection: list,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node',
                  group: function(item) {
                     return item.group;
                  }
               }),
               expected = [
                  'a',
                  items[0],
                  'c',
                  addItems[0],
                  'b',
                  items[1]
               ],
               given = [];

            list.append(addItems);
            display.each(function(item) {
               given.push(item.getContents());
            });
            assert.deepEqual(given, expected);
         });
      });

      describe('.setEventRaising()', function() {
         it('should save expanded when unfreeze collection', function() {
            var tree = getObservableTree(),
               item = tree.getNext(tree.at(0));
            item.setExpanded(true);
            tree.getCollection().setEventRaising(false);
            tree.getCollection().setEventRaising(true);
            assert.isTrue(item.isExpanded());
         });
      });

      describe('.subscribe()', function() {
         var getCollectionChangeHandler = function(given, itemsMapper) {
            return function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
               given.push({
                  action: action,
                  newItems: itemsMapper ? newItems.map(itemsMapper) : newItems,
                  newItemsIndex: newItemsIndex,
                  oldItems: itemsMapper ? oldItems.map(itemsMapper) : oldItems,
                  oldItemsIndex: oldItemsIndex
               });
            };
         };

         context('onCollectionChange', function() {
            it('should fire with all of children if add a node', function() {
               var tree = getObservableTree(),
                  list = tree.getCollection(),
                  newItems = [
                     {id: 51,  pid: 5,  title: 'EA'},
                     {id: 52,  pid: 5,  title: 'EB'},
                     {id: 521, pid: 52, title: 'EBA'},
                     {id: 53,  pid: 5,  title: 'EC'}
                  ],
                  newNode = {id: 5, pid: 0, title: 'E'},
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_ADD,
                     newItems: ['E', 'EA', 'EB', 'EBA', 'EC'],
                     newItemsIndex: list.getCount(),
                     oldItems: [],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().title;
                  });

               tree.subscribe('onCollectionChange', handler);
               list.append(newItems);
               list.add(newNode);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire with all of children after remove a node', function() {
               var tree = getObservableTree(),
                  firstNodeItemIndex = 6,
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_REMOVE,
                     newItems: [],
                     newItemsIndex: 0,
                     oldItems: ['A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC'],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().title;
                  });

               tree.subscribe('onCollectionChange', handler);
               tree.getCollection().removeAt(firstNodeItemIndex);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire with only removed node if filter used', function() {
               var data = [
                  {id: 1, pid: 0},
                  {id: 11, pid: 1},
                  {id: 2, pid: 0},
                  {id: 3, pid: 0},
               ];
               var list = new ObservableList({
                  items: data
               });
               var tree = new Tree({
                  collection: list,
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  filter: function(item) {
                     return item.pid === 0;
                  }
               });
               var given = [];
               var handler = getCollectionChangeHandler(given);

               var expected = [{
                  action: IBindCollectionDisplay.ACTION_REMOVE,
                  newItems: [],
                  newItemsIndex: 0,
                  oldItems: [tree.at(0)],
                  oldItemsIndex: 0
               }];

               tree.subscribe('onCollectionChange', handler);
               tree.getCollection().removeAt(0);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire on move a node down', function() {
               var items = [
                     {id: 1, pid: 0},
                     {id: 2, pid: 0},
                     {id: 3, pid: 0}
                  ],
                  list = new ObservableList({
                     items: items
                  }),
                  tree = new Tree({
                     collection: list,
                     root: 0,
                     idProperty: 'id',
                     parentProperty: 'pid'
                  }),
                  moveFrom = 1,
                  moveTo = 2,
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_MOVE,
                     newItems: [items[moveTo]],
                     newItemsIndex: moveFrom,
                     oldItems: [items[moveTo]],
                     oldItemsIndex: moveTo
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents();
                  });

               tree.subscribe('onCollectionChange', handler);
               list.move(moveFrom, moveTo);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire on move a node up', function() {
               var items = [
                     {id: 1, pid: 0},
                     {id: 2, pid: 0},
                     {id: 3, pid: 0}
                  ],
                  list = new ObservableList({
                     items: items
                  }),
                  tree = new Tree({
                     collection: list,
                     root: 0,
                     idProperty: 'id',
                     parentProperty: 'pid'
                  }),
                  moveFrom = 2,
                  moveTo = 0,
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_MOVE,
                     newItems: [items[moveFrom]],
                     newItemsIndex: moveTo,
                     oldItems: [items[moveFrom]],
                     oldItemsIndex: moveFrom
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents();
                  });

               tree.subscribe('onCollectionChange', handler);
               list.move(moveFrom, moveTo);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('shouldn\'t fire on move a node in sorted tree', function() {
               var sort = function(a, b) {
                     var
                        isNodeA = a.item.isNode(),
                        isNodeB = b.item.isNode();
                     if (isNodeA === isNodeB) {
                        return a.index > b.index ? 1 : -1;
                     } else {
                        return isNodeA ? -1 : 1;
                     }
                  },
                  list = new ObservableList({
                     items: [
                        {id: 1, pid: 0, node: true},
                        {id: 2, pid: 0, node: true},
                        {id: 3, pid: 0, node: false},
                        {id: 4, pid: 1, node: false},
                        {id: 5, pid: 1, node: false},
                        {id: 6, pid: 0, node: true}
                     ]
                  }),
                  tree = new Tree({
                     collection: list,
                     root: 0,
                     idProperty: 'id',
                     parentProperty: 'pid',
                     nodeProperty: 'node',
                     sort: sort
                  }),
                  moveFrom = 5,
                  moveTo = 2,
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents();
                  });

               tree.subscribe('onCollectionChange', handler);
               list.move(moveFrom, moveTo);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, []);
            });

            it('should fire properly with duplicates', function() {
               var list = new ObservableList({
                     items: [
                        {id: 'a',   pid: 0},
                        {id: 'aa',  pid: 'a'},
                        {id: 'aaa', pid: 'aa'},
                        {id: 'b',   pid: 0},
                        {id: 'ba',  pid: 'b'},
                        {id: 'bb',  pid: 'b'}
                     ]
                  }),
                  tree = getObservableTree(list),

                  /*
                     0  +-a
                     1  | +-aa
                     2  |   +-aaa
                     3  +-b
                     4    +-ba
                     5      +-bb
                     =>
                     0  +-a
                     1  | +-aa
                     2  |   +-aaa
                     3  |     +-aa1  1st event
                     4  +-b
                     5  | +-ba
                     6  |   +-bb
                     7  +-a          2nd event
                     8    +-aa       2nd event
                     9      +-aaa    2nd event
                     10       +-aa1  2nd event
                     */
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_ADD,
                     newItems: ['aa1'],
                     newItemsIndex: 3,
                     oldItems: [],
                     oldItemsIndex: 0
                  }, {
                     action: IBindCollectionDisplay.ACTION_ADD,
                     newItems: ['a', 'aa', 'aaa', 'aa1'],
                     newItemsIndex: 7,
                     oldItems: [],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().id;
                  });

               tree.subscribe('onCollectionChange', handler);
               list.append([
                  {id: 'a',   pid: 0},
                  {id: 'aa1', pid: 'a'}
               ]);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire after call setRootEnumerable with change to true', function() {
               var expected,
                  given = [],
                  handler = getCollectionChangeHandler(given);

               tree.subscribe('onCollectionChange', handler);
               tree.setRootEnumerable(true);
               tree.unsubscribe('onCollectionChange', handler);

               expected = [{
                  action: IBindCollectionDisplay.ACTION_ADD,
                  newItems: [tree.at(0)],
                  newItemsIndex: 0,
                  oldItems: [],
                  oldItemsIndex: 0
               }];

               assert.deepEqual(given, expected);
            });

            it('should fire after call setRootEnumerable with change to false', function() {
               var expected,
                  given = [],
                  handler = getCollectionChangeHandler(given);

               tree.setRootEnumerable(true);
               expected = [{
                  action: IBindCollectionDisplay.ACTION_REMOVE,
                  newItems: [],
                  newItemsIndex: 0,
                  oldItems: [tree.at(0)],
                  oldItemsIndex: 0
               }];

               tree.subscribe('onCollectionChange', handler);
               tree.setRootEnumerable(false);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire with valid newItemsIndex if root is enumerable', function() {
               var tree = getObservableTree(),
                  collection = tree.getCollection(),
                  newItem = {id: 'new', pid: 0, title: 'New'},
                  index = 1,

                  //add New into root will affect: add New, change root
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_ADD,
                     newItems: ['new'],
                     newItemsIndex: 1,
                     oldItems: [],
                     oldItemsIndex: 0
                  }, {
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: [0],
                     newItemsIndex: 0,
                     oldItems: [0],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().id;
                  });

               tree.at(0);
               tree.setRootEnumerable(true);
               tree.subscribe('onCollectionChange', handler);
               collection.add(newItem, index);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire with valid oldItemsIndex if root is enumerable', function() {
               var tree = getObservableTree(),
                  collection = tree.getCollection(),
                  index = 1,
                  item = collection.at(index),

                  //remove AB from A will affect: remove AB, change A
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_REMOVE,
                     newItems: [],
                     newItemsIndex: 0,
                     oldItems: [item.title],
                     oldItemsIndex: 3
                  }, {
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: ['A'],
                     newItemsIndex: 1,
                     oldItems: ['A'],
                     oldItemsIndex: 1
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().title;
                  });

               tree.setRootEnumerable(true);
               tree.subscribe('onCollectionChange', handler);
               collection.removeAt(index);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire with updated hierarchy level', function() {
               var tree = getRecordSetTree(),
                  collection = tree.getCollection(),
                  index = collection.getIndexByValue('id', 4),
                  item = collection.at(index),
                  treeItem = tree.getItemBySourceItem(item),
                  oldLevel = treeItem.getLevel(),
                  level;

               tree.subscribe('onCollectionChange', function(e, action, newItems) {
                  if (newItems[0].getContents() === item) {
                     level = newItems[0].getLevel();
                  }
               });
               item.set('pid', 1);
               assert.strictEqual(oldLevel + 1, level);
            });

            it('should fire with updated hierarchy level if grouped', function() {
               var tree = getRecordSetTree(),
                  collection = tree.getCollection(),
                  index = collection.getIndexByValue('id', 4),
                  item = collection.at(index),
                  treeItem = tree.getItemBySourceItem(item),
                  oldLevel = treeItem.getLevel(),
                  level;

               tree.setGroup(function() {
                  return 'foo';
               });

               tree.subscribe('onCollectionChange', function(e, action, newItems) {
                  if (newItems[0].getContents() === item) {
                     level = newItems[0].getLevel();
                  }
               });
               item.set('pid', 1);
               assert.strictEqual(oldLevel + 1, level);
            });

            it('should fire with an item that changed the level with the parent', function() {
               var data = [
                     {id: 1, pid: 0},
                     {id: 11, pid: 1},
                     {id: 111, pid: 11},
                     {id: 1111, pid: 111}
                  ],
                  items = new RecordSet({
                     rawData: data,
                     idProperty: 'id'
                  }),
                  tree = new Tree({
                     collection: items,
                     root: 0,
                     idProperty: 'id',
                     parentProperty: 'pid'
                  }),
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: [1, 11, 111, 1111],
                     newItemsIndex: 0,
                     oldItems: [1, 11, 111, 1111],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().get('id');
                  }),
                  record = items.at(2);

               tree.subscribe('onCollectionChange', handler);
               record.set('pid', 1);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire on changed node if item has been moved to one', function() {
               var tree = getRecordSetTree(),
                  collection = tree.getCollection(),
                  positionD = collection.getIndexByValue('title', 'D'),
                  itemD = collection.at(positionD),

                  //move D into AC will affect: move D, change AC
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_MOVE,
                     newItems: [itemD.get('title')],
                     newItemsIndex: 7,
                     oldItems: [itemD.get('title')],
                     oldItemsIndex: 12
                  }, {
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: ['AC'],
                     newItemsIndex: 3,
                     oldItems: ['AC'],
                     oldItemsIndex: 3
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().get('title');
                  });

               tree.subscribe('onCollectionChange', handler);
               itemD.set('pid', 12);//Root -> AC
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire on changed node if it\'s item has been moved to another node', function() {
               var tree = getRecordSetTree(),
                  collection = tree.getCollection(),
                  item = collection.getRecordById(200),

                  //move BAA into AC will affect: move BAA, move BAAA, change BAA, change AC, change BA
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_MOVE,
                     newItems: ['BAA', 'BAAA'],
                     newItemsIndex: 7,
                     oldItems: ['BAA', 'BAAA'],
                     oldItemsIndex: 9
                  }, {
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: ['AC'],
                     newItemsIndex: 3,
                     oldItems: ['AC'],
                     oldItemsIndex: 3
                  }, {
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: ['BA'],
                     newItemsIndex: 10,
                     oldItems: ['BA'],
                     oldItemsIndex: 10
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().get('title');
                  });

               tree.subscribe('onCollectionChange', handler);
               item.set('pid', 12);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire on parent node if item has been added to it but filtered', function() {
               var tree = getRecordSetTree(),
                  collection = tree.getCollection(),
                  itemId = 2000,
                  parentId = 1,
                  item = collection.getRecordById(itemId),

                  //add BAAA (2000) into A (1) as hidden will affect: change A
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: ['A'],
                     newItemsIndex: 0,
                     oldItems: ['A'],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().get('title');
                  });

               collection.remove(item);
               tree.setFilter(function(item) {
                  return item.get('pid') !== parentId;
               });
               tree.subscribe('onCollectionChange', handler);
               item.set('pid', parentId);
               collection.add(item);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire with inherited "expanded" property after replace an item', function() {
               var tree = getObservableTree(),
                  itemIndex = 1,
                  item = tree.at(itemIndex),
                  sourceIndex = tree.getCollection().getIndex(item.getContents()),
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_REMOVE,
                     newItems: [],
                     newItemsIndex: 0,
                     oldItems: [true],
                     oldItemsIndex: 1
                  }, {
                     action: IBindCollectionDisplay.ACTION_ADD,
                     newItems: [true],
                     newItemsIndex: 1,
                     oldItems: [],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.isExpanded();
                  });

               var newItem = Object.create(item.getContents());
               item.setExpanded(true);

               tree.subscribe('onCollectionChange', handler);
               tree.getCollection().replace(newItem, sourceIndex);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should dont with inherited "expanded" property after replace an item which no longer presented in the tree', function() {
               var tree = getObservableTree(),
                  itemIndex = 1,
                  item = tree.at(itemIndex),
                  sourceIndex = tree.getCollection().getIndex(item.getContents()),
                  expected = [{
                     action: IBindCollectionDisplay.ACTION_REMOVE,
                     newItems: [],
                     newItemsIndex: 0,
                     oldItems: [true],
                     oldItemsIndex: 1
                  }, {
                     action: IBindCollectionDisplay.ACTION_CHANGE,
                     newItems: [false],
                     newItemsIndex: 0,
                     oldItems: [false],
                     oldItemsIndex: 0
                  }],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.isExpanded();
                  });

               var newItem = Object.create(item.getContents());
               newItem.pid = -1;
               item.setExpanded(true);

               tree.subscribe('onCollectionChange', handler);
               tree.getCollection().replace(newItem, sourceIndex);
               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });

            it('should fire after remove-collapse-add-expand a node if filter used', function() {
               var items = [
                     {id: 'a', 'pid': null},
                     {id: 'b', 'pid': null},
                     {id: 'c', 'pid': 'a'}
                  ],
                  hidden = [],
                  list = new ObservableList({
                     items: items
                  }),
                  tree = new Tree({
                     idProperty: 'id',
                     parentProperty: 'pid',
                     root: null,
                     collection: list,
                     filter: function(item) {
                        return hidden.indexOf(item.id) === -1;
                     }
                  }),
                  expected = [],
                  given = [],
                  handler = getCollectionChangeHandler(given, function(item) {
                     return item.getContents().id;
                  }),
                  removedItem,
                  nodeA = tree.at(0);

               nodeA.setExpanded(true);

               tree.subscribe('onCollectionChange', handler);

               removedItem = nodeA.getContents();
               list.remove(removedItem);
               expected.push({
                  action: IBindCollectionDisplay.ACTION_REMOVE,
                  newItems: [],
                  newItemsIndex: 0,
                  oldItems: ['a', 'c'],
                  oldItemsIndex: 0
               });

               hidden = ['c'];
               nodeA.setExpanded(false);
               expected.push({
                  action: IBindCollectionDisplay.ACTION_CHANGE,
                  newItems: ['a'],
                  newItemsIndex: -1,
                  oldItems: ['a'],
                  oldItemsIndex: -1
               });

               list.add(removedItem);
               nodeA = tree.at(1);
               expected.push({
                  action: IBindCollectionDisplay.ACTION_ADD,
                  newItems: ['a'],
                  newItemsIndex: 1,
                  oldItems: [],
                  oldItemsIndex: 0
               });

               hidden = [];
               nodeA.setExpanded(true);
               expected.push({
                  action: IBindCollectionDisplay.ACTION_ADD,
                  newItems: ['c'],
                  newItemsIndex: 2,
                  oldItems: [],
                  oldItemsIndex: 0
               });
               expected.push({
                  action: IBindCollectionDisplay.ACTION_CHANGE,
                  newItems: ['a'],
                  newItemsIndex: 1,
                  oldItems: ['a'],
                  oldItemsIndex: 1
               });

               tree.unsubscribe('onCollectionChange', handler);

               assert.deepEqual(given, expected);
            });
         });
      });

      describe('.toJSON()', function() {
         it('should clone the tree', function() {
            var serializer = new Serializer(),
               json = JSON.stringify(tree, serializer.serialize),
               clone = JSON.parse(json, serializer.deserialize),
               items = tree.getItems(),
               cloneItems = clone.getItems(),
               parent,
               cloneParent,
               i;

            for (i = 0; i < items.length; i++) {
               assert.strictEqual(
                  items[i].getInstanceId(),
                  cloneItems[i].getInstanceId(),
                  'at ' + i
               );

               parent = items[i].getParent();
               cloneParent = cloneItems[i].getParent();
               assert.strictEqual(
                  parent.getInstanceId(),
                  cloneParent.getInstanceId(),
                  'at parent for ' + i
               );
            }
         });

         it('should keep relation between a tree item contents and the source collection', function() {
            var serializer = new Serializer(),
               json = JSON.stringify(tree, serializer.serialize),
               clone = JSON.parse(json, serializer.deserialize);

            clone.each(function(item) {
               assert.notEqual(clone.getCollection().getIndex(item.getContents()), -1);
            });

         });
      });
   });
});
