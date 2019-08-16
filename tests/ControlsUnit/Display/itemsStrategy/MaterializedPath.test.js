/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/MaterializedPath',
   'Types/_display/Tree',
   'Types/_display/TreeItem',
   'Types/_collection/List'
], function(
   MaterializedPath,
   TreeDisplay,
   TreeItem
) {
   'use strict';

   MaterializedPath = MaterializedPath.default;
   TreeDisplay = TreeDisplay.default;
   TreeItem = TreeItem.default;

   describe('Types/_display/itemsStrategy/MaterializedPath', function() {
      var getOptions = function(display) {
            return {
               display: display,
               childrenProperty: display.getChildrenProperty(),
               nodeProperty: display.getNodeProperty(),
               root: display.getRoot.bind(display)
            };
         },
         items,
         expandedItems,
         display,
         strategy;

      beforeEach(function() {
         items = [
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
         ];
         expandedItems = [1, 11, 12, 121, 122, 13, 2, 21, 22];
         display = new TreeDisplay({collection: items, childrenProperty: 'children'});
         strategy = new MaterializedPath(getOptions(display));
      });

      afterEach(function() {
         items = undefined;
         expandedItems = undefined;
         display = undefined;
         strategy = undefined;
      });

      describe('.at()', function() {
         it('should return a CollectionItems', function() {
            expandedItems.forEach(function(id, index) {
               assert.instanceOf(strategy.at(index), TreeItem);
               assert.strictEqual(strategy.at(index).getContents().id, id);
            });
         });

         it('should return a CollectionItems in reverse order', function() {
            for (var index = expandedItems.length - 1; index >= 0; index--) {
               assert.strictEqual(strategy.at(index).getContents().id, expandedItems[index]);
            }
         });

         it('should return the same CollectionItem twice', function() {
            expandedItems.forEach(function(id, index) {
               assert.strictEqual(strategy.at(index), strategy.at(index));
            });
         });

         it('should return a CollectionItems with parent', function() {
            var display = new TreeDisplay({
                  collection: items,
                  childrenProperty: 'children',
                  root: {id: 0}
               }),
               strategy = new MaterializedPath(getOptions(display));

            expandedItems.forEach(function(i, index) {
               var item = strategy.at(index),
                  id = item.getContents().id,
                  parentId = Math.floor(id / 10);

               assert.strictEqual(item.getParent().getContents().id, parentId);
            });
         });
         it('should return a TreeItem as node', function() {
            var display = new TreeDisplay({
                  collection: [{node: true}],
                  nodeProperty: 'node'
               }),
               strategy = new MaterializedPath(getOptions(display));

            assert.isTrue(strategy.at(0).isNode());
         });

         it('should return a TreeItem as leaf', function() {
            var display = new TreeDisplay({
                  collection: [{node: false}],
                  nodeProperty: 'node'
               }),
               strategy = new MaterializedPath(getOptions(display));

            assert.isFalse(strategy.at(0).isNode());
         });

         it('should return a TreeItem with children', function() {
            var display = new TreeDisplay({
                  collection: [{hasChildren: true}],
                  hasChildrenProperty: 'hasChildren'
               }),
               strategy = new MaterializedPath(getOptions(display));

            assert.isTrue(strategy.at(0).isHasChildren());
         });

         it('should return a TreeItem without children', function() {
            var display = new TreeDisplay({
                  collection: [{hasChildren: false}],
                  hasChildrenProperty: 'hasChildren'
               }),
               strategy = new MaterializedPath(getOptions(display));

            assert.isFalse(strategy.at(0).isHasChildren());
         });

         it('should return a TreeItem with inverted children having', function() {
            var display = new TreeDisplay({
                  collection: [{hasChildren: true}],
                  hasChildrenProperty: '!hasChildren'
               }),
               strategy = new MaterializedPath(getOptions(display));

            assert.isFalse(strategy.at(0).isHasChildren());
         });
      });

      describe('.count', function() {
         it('should return items count', function() {
            assert.strictEqual(strategy.count, expandedItems.length);
         });
      });

      describe('.items', function() {
         it('should return an items', function() {
            assert.strictEqual(strategy.items.length, expandedItems.length);
            expandedItems.forEach(function(id, index) {
               assert.strictEqual(strategy.items[index].getContents().id, expandedItems[index]);
            });
         });
      });

      describe('.splice()', function() {
         it('should add items', function() {
            var item = {id: 10, children: [
               {id: 100},
               {id: 101}
            ]};
            items[0].children.unshift(item);
            expandedItems.splice(1, 0, 10, 100, 101);
            strategy.splice(0, 0, item);

            assert.strictEqual(strategy.items.length, expandedItems.length);
            expandedItems.forEach(function(id, index) {
               assert.strictEqual(strategy.at(index).getContents().id, id);
            });
         });

         it('should remove items', function() {
            items.splice(0, 1);
            expandedItems.splice(0, 6);
            strategy.splice(0, 1);

            assert.strictEqual(strategy.items.length, expandedItems.length);
            expandedItems.forEach(function(id, index) {
               assert.strictEqual(strategy.at(index).getContents().id, id);
            });
         });
      });

      describe('.reset()', function() {
         it('should re-create items', function() {
            var prevItems = [];
            expandedItems.forEach(function(id, index) {
               prevItems.push(strategy.at(index));
            });

            strategy.reset();
            expandedItems.forEach(function(id, index) {
               assert.notEqual(strategy.at(index), prevItems[index]);
            });
         });
      });

      describe('.getSorters()', function() {
         it('should append a "tree" sorter', function() {
            var sorters = strategy.getSorters();
            assert.strictEqual(sorters[sorters.length - 1].name, 'tree');
         });

         it('should set the sorter options', function() {
            var sorters = strategy.getSorters();
            assert.isFunction(sorters[0].options);
            assert.isArray(sorters[0].options().indexToPath);
         });
      });

      describe('.sortItems()', function() {
         it('should expand all of the direct branches to the array', function() {
            var current = expandedItems.map(function(it, i) {
                  return i;
               }), //[0, 1, 2, 3, 4, 5, 6, 7, 8]
               options = {
                  indexToPath: strategy._indexToPath
               },
               expect = [1, 11, 12, 121, 122, 13, 2, 21, 22],
               items,
               sorted,
               result;

            items = strategy.items;
            sorted = MaterializedPath.sortItems(items, current, options);
            result = sorted.map(function(index) {
               return items[index].getContents().id;
            });

            assert.deepEqual(result, expect);
         });

         it('should expand all of the reversed branches to the array', function() {
            var current = expandedItems.map(function(it, i) {
                  return i;
               }).reverse(), //[8, 7, 6, 5, 4, 3, 2, 1, 0]
               options = {
                  indexToPath: strategy._indexToPath
               },
               expect = [2, 22, 21, 1, 13, 12, 122, 121, 11], //[1, 11, 12, 121, 122, 13, 2, 21, 22] => [2, 22, 21, 1, 13, 12, 122, 121, 11]
               items,
               sorted,
               result;

            items = strategy.items;
            sorted = MaterializedPath.sortItems(items, current, options);
            result = sorted.map(function(index) {
               return items[index].getContents().id;
            });

            assert.deepEqual(result, expect);
         });
      });
   });
});
