/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/Search',
   'Types/_display/BreadcrumbsItem',
   'Types/_display/TreeItem'
], function(
   Search,
   BreadcrumbsItem,
   TreeItem
) {
   'use strict';

   Search = Search.default;
   BreadcrumbsItem = BreadcrumbsItem.default;
   TreeItem = TreeItem.default;

   describe('Types/_display/itemsStrategy/Search', function() {
      var getSource = function(items) {
            return {
               options: {foo: 'bar'},
               get count() {
                  return items.length;
               },
               get items() {
                  return items.slice();
               },
               at: function(index) {
                  return items[index];
               },
               getDisplayIndex: function(index) {
                  return index;
               },
               getCollectionIndex: function(index) {
                  return index;
               },
               splice: function(start, deleteCount, added) {
                  return Array.prototype.splice.apply(
                     items,
                     [start, deleteCount].concat(added)
                  );
               },
               reset: function() {
                  items.length = 0;
               },
               getSorters: function() {
                  return [];
               }
            };
         },
         items,
         source,
         strategy;

      beforeEach(function() {
         items = [];
         items[0] = new TreeItem({
            contents: 'A',
            node: true
         });
         items[1] = new TreeItem({
            parent: items[0],
            contents: 'AA',
            node: true
         });
         items[2] = new TreeItem({
            parent: items[1],
            contents: 'AAA',
            node: true
         });
         items[3] = new TreeItem({
            parent: items[2],
            contents: 'AAAa'
         });
         items[4] = new TreeItem({
            parent: items[2],
            contents: 'AAAb'
         });
         items[5] = new TreeItem({
            parent: items[1],
            contents: 'AAB',
            node: true
         });
         items[6] = new TreeItem({
            parent: items[1],
            contents: 'AAC',
            node: true
         });
         items[7] = new TreeItem({
            parent: items[6],
            contents: 'AACa'
         });
         items[8] = new TreeItem({
            parent: items[1],
            contents: 'AAD',
            node: true
         });
         items[9] = new TreeItem({
            contents: 'B',
            node: true
         });
         items[10] = new TreeItem({
            contents: 'C',
            node: true
         });
         items[11] = new TreeItem({
            contents: 'd'
         });
         items[12] = new TreeItem({
            contents: 'e'
         });

         source = getSource(items);
         strategy = new Search({
            source: source
         });
      });

      afterEach(function() {
         items = undefined;
         source = undefined;
         strategy = undefined;
      });

      describe('.options', function() {
         it('should return the source options', function() {
            assert.strictEqual(strategy.options, source.options);
         });
      });

      describe('.items', function() {
         it('should group breadcrumbs nodes', function() {
            var expected = ['#A,AA,AAA', 'AAAa', 'AAAb', '#A,AA,AAB', '#A,AA,AAC', 'AACa', '#A,AA,AAD', '#B', '#C', 'd', 'e'];

            strategy.items.forEach(function(item, index) {
               var contents = item.getContents();
               assert.equal(
                  item instanceof BreadcrumbsItem ? '#' + contents.join(',') : contents,
                  expected[index],
                  'at ' + index
               );
            });

            assert.strictEqual(strategy.items.length, expected.length);
         });

         it('should group only breadcrumbs nodes', function() {
            var items = [];
            items[0] = new TreeItem({
               contents: 'A',
               node: true
            });
            items[1] = new TreeItem({
               parent: items[0],
               contents: 'AA',
               node: true
            });
            items[2] = new TreeItem({
               parent: items[1],
               contents: 'AAA',
               node: true
            });

            var source = getSource(items);
            var strategy = new Search({
               source: source
            });

            var result = strategy.items.map(function(item) {
               var contents = item.getContents();
               return item instanceof BreadcrumbsItem ? '#' + contents.join(',') : contents;
            });

            assert.deepEqual(result, ['#A,AA,AAA']);
         });

         it('should return valid items level for first item after breadcrumbs', function() {
            var items = [];
            items[0] = new TreeItem({
               contents: 'A',
               node: true
            });
            items[1] = new TreeItem({
               parent: items[0],
               contents: 'AA',
               node: true
            });
            items[2] = new TreeItem({
               parent: items[1],
               contents: 'AAa',
               node: false
            });
            items[3] = new TreeItem({
               contents: 'b',
               node: false
            });

            var source = getSource(items);
            var strategy = new Search({
               source: source
            });

            var result = strategy.items.map(function(item) {
               var contents = item.getContents();
               return (item instanceof BreadcrumbsItem ? '#' + contents.join(',') : contents) + ':' + item.getLevel();
            });

            assert.deepEqual(result, ['#A,AA:0', 'AAa:1', 'b:0']);
         });

         it('return breadcrumbs as 1st level parent for leaves', function() {
            var parents = [];
            parents[1] = BreadcrumbsItem;
            parents[2] = BreadcrumbsItem;
            parents[3] = BreadcrumbsItem;
            parents[4] = BreadcrumbsItem;
            parents[5] = BreadcrumbsItem;
            parents[6] = BreadcrumbsItem;
            parents[7] = BreadcrumbsItem;
            parents[8] = BreadcrumbsItem;
            parents[9] = undefined;
            parents[10] = undefined;
            parents[11] = undefined;
            parents[12] = undefined;

            var levels = [];
            levels[1] = 1;
            levels[2] = 1;
            levels[3] = 1;
            levels[4] = 1;
            levels[5] = 1;
            levels[6] = 1;
            levels[7] = 1;
            levels[8] = 1;
            levels[9] = 0;
            levels[10] = 0;
            levels[11] = 0;
            levels[12] = 0;

            strategy.items.forEach(function(item, index) {
               if (item instanceof TreeItem) {
                  if (typeof parents[index] === 'function') {
                     assert.instanceOf(
                        item.getParent(),
                        parents[index],
                        'at ' + index
                     );
                  } else {
                     assert.strictEqual(
                        item.getParent(),
                        parents[index],
                        'at ' + index
                     );
                  }

                  assert.equal(
                     item.getLevel(),
                     levels[index],
                     'at ' + index
                  );
               }
            });
         });

         it('should return the same instances for second call', function() {
            var items = strategy.items.slice();

            strategy.items.forEach(function(item, index) {
               assert.strictEqual(items[index], item);
            });

            assert.equal(items.length, strategy.items.length);
         });
      });

      describe('.count', function() {
         it('should return items count', function() {
            assert.equal(strategy.count, 11);
         });
      });

      describe('.getDisplayIndex()', function() {
         it('should return index in projection', function() {
            var next = strategy.count;
            var expected = [next, next, next, 1, 2, next, next, 5, next, next, next, 9, 10];
            items.forEach(function(item, index) {
               assert.equal(strategy.getDisplayIndex(index), expected[index], 'at ' + index);
            });
         });
      });

      describe('.getCollectionIndex()', function() {
         it('should return index in collection', function() {
            var expected = [-1, 3, 4, -1, -1, 7, -1, -1, -1, 11, 12];
            strategy.items.forEach(function(item, index) {
               assert.equal(strategy.getCollectionIndex(index), expected[index], 'at ' + index);
            });
         });
      });

      describe('.splice()', function() {
         it('should add items', function() {
            var newItems = [new TreeItem({
               parent: items[2],
               contents: 'AAAc'
            })];
            var at = 3;
            var expected = ['#A,AA,AAA', 'AAAc', 'AAAa', 'AAAb', '#A,AA,AAB', '#A,AA,AAC', 'AACa', '#A,AA,AAD', '#B', '#C', 'd', 'e'];

            strategy.splice(at, 0, newItems);

            strategy.items.forEach(function(item, index) {
               var contents = item.getContents();
               assert.equal(
                  item instanceof BreadcrumbsItem ? '#' + contents.join(',') : contents,
                  expected[index],
                  'at ' + index
               );
            });

            assert.strictEqual(strategy.items.length, expected.length);
         });

         it('should remove items', function() {
            // AA
            var at = 1;

            // AA + AAA
            var removeCount = 2;
            var count = source.items.length;
            var expected = ['#A', 'AAAa', 'AAAb', '#A,AA,AAB', '#A,AA,AAC', 'AACa', '#A,AA,AAD', '#B', '#C', 'd', 'e'];

            strategy.splice(at, removeCount, []);

            assert.strictEqual(strategy.count, count - removeCount);
            assert.strictEqual(strategy.count, expected.length);
            strategy.items.forEach(function(item, index) {
               var contents = item.getContents();
               assert.equal(
                  item instanceof BreadcrumbsItem ? '#' + contents.join(',') : contents,
                  expected[index],
                  'at ' + index
               );
            });
         });
      });

      describe('.reset()', function() {
         it('should reset items', function() {
            strategy.reset();
            assert.strictEqual(strategy.items.length, 0);
         });
      });
   });
});
