/* global define, describe, it, assert */
define([
   'Types/_display/BreadcrumbsItem',
   'Types/_display/TreeItem'
], function(
   BreadcrumbsItem,
   TreeItem
) {
   'use strict';

   BreadcrumbsItem = BreadcrumbsItem.default;
   TreeItem = TreeItem.default;

   describe('Types/_display/BreadcrumbsItem', function() {
      describe('.getContents()', function() {
         it('should return tree branch', function() {
            var items = [];
            items[0] = new TreeItem({
               contents: 'a'
            });
            items[1] = new TreeItem({
               parent: items[0],
               contents: 'b'
            });
            items[2] = new TreeItem({
               parent: items[1],
               contents: 'c'
            });
            var expected = [['a'], ['a', 'b'], ['a', 'b', 'c']];

            items.forEach(function(item, index) {
               var bcItem = new BreadcrumbsItem({
                  last: item
               });
               assert.deepEqual(bcItem.getContents(), expected[index]);
            });
         });

         it('should return tree branch with root', function() {
            var root = new TreeItem({
               contents: 'root'
            });
            var owner = {
               getRoot: function() {
                  return null;
               }
            };
            var item = new TreeItem({
               parent: root,
               contents: 'a'
            });
            var bcItem = new BreadcrumbsItem({
               owner: owner,
               last: item
            });
            assert.deepEqual(bcItem.getContents(), ['root', 'a']);
         });

         it('should return tree branch without root', function() {
            var root = new TreeItem({
               contents: 'root'
            });
            var owner = {
               getRoot: function() {
                  return root;
               }
            };
            var item = new TreeItem({
               parent: root,
               contents: 'a'
            });
            var bcItem = new BreadcrumbsItem({
               owner: owner,
               last: item
            });
            assert.deepEqual(bcItem.getContents(), ['a']);
         });
      });

      describe('.getLevel()', function() {
         it('should return 0 by default', function() {
            var item = new BreadcrumbsItem();
            assert.strictEqual(item.getLevel(), 0);
         });

         it('should return 1 if owner contains enumerable root', function() {
            var root = new TreeItem({
               contents: 'root'
            });
            var owner = {
               getRoot: function() {
                  return root;
               },
               isRootEnumerable: function() {
                  return true;
               }
            };
            var last = new TreeItem({
               owner: owner,
               contents: 'last'
            });
            var item = new BreadcrumbsItem({
               owner: owner,
               last: last
            });
            assert.strictEqual(item.getLevel(), 1);
         });
      });
   });
});
