/* global define, describe, it, assert */
define([
   'Types/_display/GroupItem'
], function(
   GroupItem
) {
   'use strict';

   GroupItem = GroupItem.default;

   describe('Types/_display/GroupItem', function() {
      var getOwnerMock = function() {
         return {
            notifyItemChange: function(item, property) {
               this.lastChangedItem = item;
               this.lastChangedProperty = property;
            }
         };
      };

      describe('.isExpanded()', function() {
         it('should return true by default', function() {
            var item = new GroupItem();
            assert.isTrue(item.isExpanded());
         });

         it('should return value passed to the constructor', function() {
            var item = new GroupItem({expanded: false});
            assert.isFalse(item.isExpanded());
         });
      });

      describe('.setExpanded()', function() {
         it('should set the new value', function() {
            var item = new GroupItem();

            item.setExpanded(false);
            assert.isFalse(item.isExpanded());

            item.setExpanded(true);
            assert.isTrue(item.isExpanded());
         });

         it('should notify owner if changed', function() {
            var owner = getOwnerMock(),
               item = new GroupItem({
                  owner: owner
               });

            item.setExpanded(false);

            assert.strictEqual(owner.lastChangedItem, item);
            assert.strictEqual(owner.lastChangedProperty, 'expanded');
         });

         it('should not notify owner if changed in silent mode', function() {
            var owner = getOwnerMock(),
               item = new GroupItem({
                  owner: owner
               });

            item.setExpanded(false, true);

            assert.isUndefined(owner.lastChangedItem);
            assert.isUndefined(owner.lastChangedProperty);
         });
      });

      describe('.toggleExpanded()', function() {
         it('should toggle the value', function() {
            var item = new GroupItem();

            item.toggleExpanded();
            assert.isFalse(item.isExpanded());

            item.toggleExpanded();
            assert.isTrue(item.isExpanded());
         });
      });
   });
});
