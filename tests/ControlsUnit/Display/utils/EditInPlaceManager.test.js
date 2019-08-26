/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Controls/_display/utils/EditInPlaceManager',
   'Controls/_display/CollectionItem'
], function(
   EditInPlaceManager,
   CollectionItem
) {
   'use strict';

   EditInPlaceManager = EditInPlaceManager.default;
   CollectionItem = CollectionItem.default;

   describe('Controls/_display/utils/EditInPlaceManager', function() {
      var manager;

      function makeItem() {
         return new CollectionItem({});
      }

      beforeEach(function() {
         manager = new EditInPlaceManager();
      });

      describe('.beginEdit()', function() {
         it('sets item as editing', function() {
            const item = makeItem();

            manager.beginEdit(item);

            assert.isTrue(item.isEditing());
         });

         it('unmarks the previously edited item', function() {
            const
               item1 = makeItem(),
               item2 = makeItem();

            manager.beginEdit(item1);
            manager.beginEdit(item2);

            assert.isTrue(item2.isEditing());
            assert.isFalse(item1.isEditing());
         });

         it('does not change state of an already editing item', function() {
            const item = makeItem();

            manager.beginEdit(item);
            manager.beginEdit(item);

            assert.isTrue(item.isEditing());
         });
      });
   });
});
