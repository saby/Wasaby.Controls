/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Projection.Tree',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Projection.TreeEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection.TreeItem'
], function (Tree, List, TreeEnumerator, TreeItem) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Projection.Tree', function() {
         var items,
            tree;

         beforeEach(function() {
            items = new List({
               items: [{
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
               }]
            });

            tree = new Tree({
               collection: items,
               root: 0,
               idProperty: 'id',
               parentProperty: 'pid',
               nodeProperty: 'node'
            });
         });

         afterEach(function() {
            tree.destroy();
            tree = undefined;
            items = undefined;
         });

         describe('$constructor', function() {
            it('should throw an error if option idProperty is not defined', function() {
               assert.throw(function() {
                  new Tree({
                     collection: items
                  });
               });
               assert.throw(function() {
                  new Tree();
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
            it('should return a tree enumerator', function() {
               assert.instanceOf(tree.getEnumerator(), TreeEnumerator);
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
            it('should return given root id from string', function() {
               assert.strictEqual(tree.getRoot().getContents().id, 0);
            });
            it('should return given root id from object', function() {
               var tree = new Tree({
                  collection: items,
                  root: {id: 1, title: 'Root'},
                  idProperty: 'id'
               });
               assert.strictEqual(tree.getRoot().getContents().id, 1);
               assert.strictEqual(tree.getRoot().getContents().title, 'Root');
            });
            it('should return given root as ICollectionItem', function() {
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
               assert.isUndefined(tree.getCurrent());

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'A');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'B');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'C');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'D');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'D');
            });
            it('should move current through direct children of the given node', function() {
               tree.setCurrentPosition(1);

               assert.strictEqual(tree.getCurrent().getContents().title, 'AA');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'AB');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'AC');

               tree.moveToNext();
               assert.strictEqual(tree.getCurrent().getContents().title, 'AC');
            });
         });

         describe('.moveToPrevious()', function() {
            it('should move current through direct children of the root', function() {
               assert.isUndefined(tree.getCurrent());

               tree.setCurrentPosition(tree.getCount() - 1);
               assert.strictEqual(tree.getCurrent().getContents().title, 'D');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'C');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'B');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'A');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'A');
            });
            it('should move current through direct children of the given node', function() {
               tree.setCurrentPosition(3);

               assert.strictEqual(tree.getCurrent().getContents().title, 'AC');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'AB');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'AA');

               tree.moveToPrevious();
               assert.strictEqual(tree.getCurrent().getContents().title, 'AA');
            });
         });

         describe('.moveToAbove()', function() {
            it('should move current to the parent', function() {
               tree.moveToNext();
               tree.moveToNext();
            });
         });
      });
   }
);
