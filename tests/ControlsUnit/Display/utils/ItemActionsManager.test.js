/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Controls/_display/utils/ItemActionsManager',
   'Controls/_display/CollectionItem'
], function(
   ItemActionsManager,
   CollectionItem
) {
   'use strict';

   ItemActionsManager = ItemActionsManager.default;
   CollectionItem = CollectionItem.default;

   describe('Controls/_display/utils/ItemActionsManager', function() {
      var manager;

      function makeItem() {
         return new CollectionItem({});
      }

      beforeEach(function() {
         manager = new ItemActionsManager();
      });

      describe('.setItemActions()', () => {
         const action = {
            id: 1,
            icon: 'icon-PhoneNull controls-itemActionsV__action_icon  icon-size',
            title: 'phone',
            style: 'success',
            iconStyle: 'success',
            showType: 0
        };
         const actions = {
            all: [action],
            showed: [action]
         };

         it('adds and removes item actions', () => {
            const item = makeItem();

            manager.setItemActions(item, actions);
            assert.strictEqual(item.getActions(), actions);

            manager.setItemActions(item, null);
            assert.isNotOk(item.getActions());
         });

         it('sets and removes visible item actions', () => {
            const item = makeItem();

            manager.setItemActions(item, actions);
            assert.isOk(item.hasVisibleActions());

            manager.setItemActions(item, { all: [action] });
            assert.isNotOk(item.hasVisibleActions());
         });
      });
   });
});
