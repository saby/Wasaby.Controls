/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Projection.Tree',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Projection.TreeItem',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection'
], function (Tree, List, ObservableList, TreeItem, IBindCollectionProjection) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Projection.Tree', function() {
         var firstNodeItemIndex = 6,
            getData = function() {
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
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node'
               });
            },
            getObservableTree = function(items) {
               return new Tree({
                  collection: items || getObservableItems(),
                  root: 0,
                  idProperty: 'id',
                  parentProperty: 'pid',
                  nodeProperty: 'node'
               });
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

         describe('$constructor', function() {
            it('should throw an error if option idProperty is not defined', function() {
               assert.throw(function() {
                  var tree = new Tree({
                     collection: items
                  });
               });
               assert.throw(function() {
                  var tree = new Tree();
               });
            });
         });

         describe('.getByHash()', function() {
            it('should return an item by hash', function() {
               tree.moveToNext();
               var item = tree.getCurrent();
               assert.strictEqual(tree.getByHash(item.getHash()), item);
            });
         });

         describe('.getIndexByHash()', function() {
            it('should return an index by hash', function() {
               tree.moveToNext();
               var item = tree.getCurrent();
               assert.strictEqual(tree.getIndexByHash(item.getHash()), tree.getIndex(item));
            });
         });

         describe('.getEnumerator()', function() {
            it('should traverse items in hierarchical order', function() {
               var enumerator = tree.getEnumerator(),
                  expect = ['A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC', 'B', 'BA', 'BAA', 'BAAA', 'C', 'D'],
                  index = 0,
                  item;
               while ((item = enumerator.getNext())) {
                  assert.strictEqual(item.getContents().title, expect[index]);
                  index++;
               }
            });
            it('should traverse all items', function() {
               var enumerator = tree.getEnumerator(),
                  index = 0;
               while (enumerator.getNext()) {
                  index++;
               }
               assert.strictEqual(tree.getCount(), index);
               assert.strictEqual(tree.getCollection().getCount(), index);
            });
         });

         describe('.getIdProperty()', function() {
            it('should return given value', function() {
               assert.equal(tree.getIdProperty(), 'id');
            });
         });

         describe('.getParentProperty()', function() {
            it('should return given value', function() {
               assert.equal(tree.getParentProperty(), 'pid');
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
         });

         describe('.getChildren()', function() {
            it('should return children of a root', function() {
               var children = tree.getChildren(tree.getRoot()),
                  expect = ['A', 'B', 'C', 'D'];
               children.each(function(child, index) {
                  assert.strictEqual(child.getContents().title, expect[index]);
               });
            });
            it('should return children of the first node', function() {
               var children = tree.getChildren(tree.at(0)),
                  expect = ['AA', 'AB', 'AC'];
               children.each(function(child, index) {
                  assert.strictEqual(child.getContents().title, expect[index]);
               });
            });
            it('should cache previous result', function() {
               var childrenA = tree.getChildren(tree.at(0)),
                  childrenB = tree.getChildren(tree.at(0));
               assert.strictEqual(childrenA, childrenB);
            });
            it('should throw an error for invalid node', function() {
               assert.throw(function() {
                  tree.getChildren();
               });
               assert.throw(function() {
                  tree.getChildren({});
               });
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

         describe('[onCollectionChange]', function() {
            it('should fire with all of children add a node', function(done) {
               var tree = getObservableTree(),
                  expect = ['D', 'DA', 'DB', 'DBA', 'DC'],
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_ADD, 'Invalid action');

                        assert.strictEqual(newItems.length, expect.length, 'Invalid newItems length');
                        for (var i = 0; i < newItems.length; i++) {
                           assert.strictEqual(newItems[i].getContents().title, expect[i], 'Invalid newItems[' + i + ']');
                        }
                        assert.strictEqual(newItemsIndex, 0, 'Invalid newItemsIndex');

                        assert.strictEqual(oldItems.length, 0, 'Invalid oldItems length');
                        assert.strictEqual(oldItemsIndex, 0, 'Invalid oldItemsIndex');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };
               tree.getCollection().append([{
                  id: 51,
                  pid: 5,
                  title: 'EA'
               }, {
                  id: 52,
                  pid: 5,
                  title: 'EB'
               }, {
                  id: 521,
                  pid: 52,
                  title: 'EBA'
               }, {
                  id: 53,
                  pid: 5,
                  title: 'EC'
               }]);
               tree.subscribe('onCollectionChange', handler);
               tree.getCollection().add({
                  id: 5,
                  pid: 0,
                  title: 'E'
               });
               tree.unsubscribe('onCollectionChange', handler);
            });
            it('should fire with all of children after remove a node', function(done) {
               var tree = getObservableTree(),
                  expect = ['A', 'AA', 'AB', 'AC', 'ACA', 'ACB', 'ACC'],
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_REMOVE, 'Invalid action');

                        assert.strictEqual(newItems.length, 0, 'Invalid newItems length');
                        assert.strictEqual(newItemsIndex, 0, 'Invalid newItemsIndex');

                        assert.strictEqual(oldItems.length, expect.length, 'Invalid oldItems length');
                        for (var i = 0; i < oldItems.length; i++) {
                           assert.strictEqual(oldItems[i].getContents().title, expect[i], 'Invalid oldItems[' + i + ']');
                        }
                        assert.strictEqual(oldItemsIndex, 0, 'Invalid oldItemsIndex');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };
               tree.subscribe('onCollectionChange', handler);
               tree.getCollection().removeAt(firstNodeItemIndex);
               tree.unsubscribe('onCollectionChange', handler);
            });
         });
      });
   }
);
