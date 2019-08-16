/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/Direct',
   'Types/_display/Collection',
   'Types/_display/CollectionItem',
   'Types/_display/GroupItem',
   'Types/_collection/List',
   'Types/_collection/Enum'
], function(
   Direct,
   CollectionDisplay,
   CollectionItem,
   GroupItem,
   List,
   Enum
) {
   'use strict';

   Direct = Direct.default;
   CollectionDisplay = CollectionDisplay.default;
   CollectionItem = CollectionItem.default;
   List = List.default;
   Enum = Enum.default;

   describe('Types/_display/itemsStrategy/Direct', function() {
      var getStrategy = function(display) {
            return new Direct({
               display: display
            });
         },
         items,
         list,
         display,
         strategy;

      beforeEach(function() {
         items = [1, 2, 3];
         list = new List({items: items});
         display = new CollectionDisplay({collection: list});
         strategy = getStrategy(display);
      });

      afterEach(function() {
         items = undefined;
         list = undefined;
         display = undefined;
         strategy = undefined;
      });

      describe('.at()', function() {
         it('should return a CollectionItem', function() {
            items.forEach(function(item, index) {
               assert.instanceOf(strategy.at(index), CollectionItem);
               assert.strictEqual(strategy.at(index).getContents(), item);
            });
         });

         it('should return the same CollectionItem twice', function() {
            items.forEach(function(item, index) {
               assert.strictEqual(strategy.at(index), strategy.at(index));
            });
         });
      });

      describe('.count', function() {
         it('should return items count for List', function() {
            assert.strictEqual(strategy.count, items.length);
         });

         it('should return items count for Enumerable', function() {
            var list = new Enum({dictionary: items}),
               display = new CollectionDisplay({collection: list}),
               strategy = getStrategy(display);

            assert.strictEqual(strategy.count, items.length);
         });

         it('should return intitial items count if List count changed', function() {
            var expect = list.getCount();
            assert.strictEqual(strategy.count, expect);
            list.removeAt(0);
            assert.strictEqual(strategy.count, expect);
         });
      });

      describe('.items', function() {
         it('should return an items', function() {
            assert.strictEqual(strategy.items.length, items.length);
            items.forEach(function(item, index) {
               assert.strictEqual(strategy.items[index].getContents(), items[index]);
            });
         });
      });

      describe('.splice()', function() {
         it('should add items', function() {
            assert.strictEqual(strategy.items.length, items.length);

            items.splice(0, 0, 4, 5);
            strategy.splice(0, 0, items.slice(0, 2));
            assert.strictEqual(strategy.items.length, items.length);
            assert.strictEqual(strategy.items[0].getContents(), items[0]);
            assert.strictEqual(strategy.items[1].getContents(), items[1]);
         });

         it('should remove items', function() {
            strategy.splice(0, 2);
            assert.strictEqual(strategy.items.length, items.length - 2);
         });
      });

      describe('.reset()', function() {
         it('should re-create items', function() {
            var prevItems = [];
            items.forEach(function(item, index) {
               prevItems.push(strategy.at(index));
            });

            strategy.reset();
            items.forEach(function(item, index) {
               assert.notEqual(strategy.at(index), prevItems[index]);
            });
         });
      });

      describe('.getDisplayIndex()', function() {
         it('should return equal indices', function() {
            items.forEach(function(item, index) {
               assert.strictEqual(strategy.getDisplayIndex(index), index);
            });
         });

         it('should return shifted indices in unique mode if source has repeats', function() {
            var items = [
                  {id: 1},
                  {id: 1},
                  {id: 2}
               ],
               list = new List({items: items}),
               display = new CollectionDisplay({collection: list}),
               strategy = new Direct({
                  display: display,
                  idProperty: 'id',
                  unique: true
               }),
               expected = [0, 2, 1];

            items.forEach(function(item, index) {
               assert.strictEqual(strategy.getDisplayIndex(index), expected[index]);
            });
         });
      });

      describe('.getCollectionIndex()', function() {
         it('should return equal indices', function() {
            items.forEach(function(item, index) {
               assert.strictEqual(strategy.getCollectionIndex(index), index);
            });
         });

         it('should return shifted indices in unique mode if source has repeats', function() {
            var items = [
                  {id: 1},
                  {id: 1},
                  {id: 2}
               ],
               list = new List({items: items}),
               display = new CollectionDisplay({collection: list}),
               strategy = new Direct({
                  display: display,
                  idProperty: 'id',
                  unique: true
               }),
               expected = [0, 2, -1];

            items.forEach(function(item, index) {
               assert.strictEqual(strategy.getCollectionIndex(index), expected[index]);
            });
         });
      });

      describe('::sortItems()', function() {
         it('should return original order by default', function() {
            var items = [{}, {}, {}],
               options = {},
               expected = [0, 1, 2],
               given = Direct.sortItems(items, options);

            assert.deepEqual(given, expected);
         });

         it('should return items with unique ids', function() {
            var items = [
                  new CollectionItem({contents: {id: 1}}),
                  new CollectionItem({contents: {id: 2}}),
                  new CollectionItem({contents: {id: 1}}),
                  new CollectionItem({contents: {id: 3}})
               ],
               options = {
                  unique: true,
                  idProperty: 'id'
               },
               expected = [0, 1, 3],
               given = Direct.sortItems(items, options);

            assert.deepEqual(given, expected);
         });
      });
   });
});
