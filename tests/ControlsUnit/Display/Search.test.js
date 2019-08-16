/* global define, describe, it, assert */
define([
   'Types/_display/Search',
   'Types/_display/BreadcrumbsItem'
], function(
   Search,
   BreadcrumbsItem
) {
   'use strict';

   Search = Search.default;
   BreadcrumbsItem = BreadcrumbsItem.default;

   describe('Types/_display/Search', function() {
      describe('.each()', function() {
         it('should group breadcumbs in one item', function() {
            var items = [{
               id: 'A',
               pid: '+',
               node: true
            }, {
               id: 'AA',
               pid: 'A',
               node: true
            }, {
               id: 'AAa',
               pid: 'AA',
               node: false
            }, {
               id: 'AB',
               pid: 'A',
               node: true
            }, {
               id: 'ABa',
               pid: 'AB',
               node: false
            }, {
               id: 'AC',
               pid: 'A',
               node: true
            }, {
               id: 'B',
               pid: '+',
               node: true
            }, {
               id: 'Ba',
               pid: 'B',
               node: false
            }, {
               id: 'C',
               pid: '+',
               node: true
            }];
            var search = new Search({
               collection: items,
               root: {id: '+'},
               idProperty: 'id',
               parentProperty: 'pid',
               nodeProperty: 'node'
            });
            var expected = [['A', 'AA'], 'AAa', ['A', 'AB'], 'ABa', ['A', 'AC'], ['B'], 'Ba', ['C']];

            assert.equal(search.getCount(), expected.length);

            search.each(function(item, index) {
               if (item instanceof BreadcrumbsItem) {
                  assert.deepEqual(item.getContents().map(function(i) {
                     return i.id;
                  }), expected[index], 'at ' + index);
               } else {
                  assert.equal(item.getContents().id, expected[index], 'at ' + index);
               }
            });
         });

         it('should build full path for breadcrumbs in unique mode', function() {
            var items = [{
               id: 'A',
               pid: '+',
               node: true
            }, {
               id: 'AA',
               pid: 'A',
               node: true
            }, {
               id: 'AAA',
               pid: 'AA',
               node: true
            }, {
               id: 'AAAa',
               pid: 'AAA'
            }, {
               id: 'AA',
               pid: 'A',
               node: true
            }, {
               id: 'AAB',
               pid: 'AA',
               node: true
            }, {
               id: 'AABa',
               pid: 'AAB'
            }];
            var search = new Search({
               collection: items,
               root: {id: '+'},
               unique: true,
               idProperty: 'id',
               parentProperty: 'pid',
               nodeProperty: 'node'
            });
            var expected = [['A', 'AA', 'AAA'], 'AAAa', ['A', 'AA', 'AAB'], 'AABa'];

            assert.equal(search.getCount(), expected.length);

            search.each(function(item, index) {
               if (item instanceof BreadcrumbsItem) {
                  assert.deepEqual(item.getContents().map(function(i) {
                     return i.id;
                  }), expected[index], 'at ' + index);
               } else {
                  assert.equal(item.getContents().id, expected[index], 'at ' + index);
               }
            });
         });
      });
   });
});
