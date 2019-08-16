/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Controls/_display/utils/MarkerManager',
   'Controls/_display/CollectionItem'
], function(
   MarkerManager,
   CollectionItem
) {
   'use strict';

   MarkerManager = MarkerManager.default;
   CollectionItem = CollectionItem.default;

   describe('Controls/_display/utils/MarkerManager', function() {
      var manager;

      function makeItem() {
         return new CollectionItem({});
      }

      beforeEach(function() {
         manager = new MarkerManager();
      });

      describe('.markItem()', function() {
         it('sets item as marked', function() {
            const item = makeItem();

            manager.markItem(item);

            assert.isTrue(item.isMarked());
         });

         it('unmarks the previously marked item', function() {
            const
               item1 = makeItem(),
               item2 = makeItem();

            manager.markItem(item1);
            manager.markItem(item2);

            assert.isTrue(item2.isMarked());
            assert.isFalse(item1.isMarked());
         });

         it('does not change state of an already marked item', function() {
            const item = makeItem();

            manager.markItem(item);
            manager.markItem(item);

            assert.isTrue(item.isMarked());
         });
      });
   });
});
