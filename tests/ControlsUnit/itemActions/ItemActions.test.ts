import { assert } from 'chai';

import {ItemActionsController} from 'Controls/_itemActions/ItemActionsController';
import {showType} from 'Controls/Utils/Toolbar';

describe('Controls/_itemActions/ItemActionsController', () => {
    let itemActionsController: ItemActionsController;

    function makeActionsItem() {
        const item = {
            _$swiped: false,
            isSwiped: () => item._$swiped,
            setSwiped: (swiped) => item._$swiped = swiped,

            _$active: false,
            isActive: () => item._$active,
            setActive: (active) => item._$active = active,

            _$actions: null,
            getActions: () => item._$actions,
            setActions: (actions) => item._$actions = actions
        };
        return item;
    }

    function makeCollection() {
        const collection = {
            _version: 0,
            getVersion: () => collection._version,
            nextVersion: () => collection._version++,

            find: () => null,
            getItemBySourceKey: () => null,

            getSwipeConfig: () => ({}),
            setSwipeConfig: () => null,
            getActionsTemplateConfig: () => ({}),
            setActionsTemplateConfig: () => null,
            setActionsMenuConfig: (config) => ({});
        };
        return collection;
    }

    beforeEach(() => {
        itemActionsController = new ItemActionsController();
    });

    describe('assignActions()', () => {
        it('uses visibility callback');
        it('fixes actions icon');
        it('adds menu button when needed');
        it('does not add menu button when not needed');
    });

    describe('resetActionsAssignment()', () => {
        it('resets actions assignment flag');
    });

    // TODO INEXISTS
    describe('setActionsToItem()', () => {
        it('sets actions');
        describe('checks difference between old and new actions', () => {
            it('detects no difference');
            it('detects count increase');
            it('detects count decrease');
            it('detects id difference');
            it('detects icon difference');
            it('detects showed difference');
        });
    });

    describe('calculateActionsTemplateConfig()', () => {
        it('sets item actions size depending on edit in place');
    });

    describe('setActiveItem()', () => {
        it('deactivates old active item');
        it('activates new active item');
    });

    describe('getActiveItem()', () => {
        it('returns currently active item');
    });

    describe('getMenuActions()', () => {
        it('returns actions with showType of MENU and MENU_TOOLBAR');
    });

    describe('getChildActions()', () => {
        it('returns an empty array if actions are not set');
        it('returns an empty array if there are no child actions');
        it('returns child actions');
    });

    describe('processActionClick()', () => {
        it('opens submenu if action has subactions');
        it('executes handler');
    });

    // todo incorrect
    // describe('prepareActionsMenuConfig()', () => {
    //     it('prepares actions menu config', () => {
    //         const actionsItem = makeActionsItem();
    //         actionsItem.setActions({
    //             all: [
    //                 { id: 1, showType: showType.MENU },
    //                 { id: 1, showType: showType.MENU_TOOLBAR }
    //             ]
    //         });
    //
    //         const collection = makeCollection();
    //         collection.getItemBySourceKey = () => actionsItem;
    //
    //         let actionsMenuConfig = null;
    //         collection.setActionsMenuConfig = (config) => actionsMenuConfig = config;
    //
    //         // Mock Sticky.opener
    //         // itemActionsController.prepareActionsMenuConfig(
    //         //     'test',
    //         //     {
    //         //         preventDefault: () => null,
    //         //         target: {
    //         //             getBoundingClientRect: () => {
    //         //                 return {};
    //         //             }
    //         //         }
    //         //     },
    //         //     null,
    //         //     '' // Mock HTML El or Control
    //         // );
    //
    //         assert.isTrue(actionsItem.isActive());
    //         assert.isOk(actionsMenuConfig);
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    // });

    // TODO TypeError: Cannot read property 'find' of undefined
    //     at ItemActionsController._getSwipeItem (Controls/_itemActions/ItemActionsController.js:257:37)
    // describe('activateSwipe()', () => {
    //     it('sets swipe and activity on the swiped item', () => {
    //         const item = makeActionsItem();
    //
    //         const collection = makeCollection();
    //         collection.getItemBySourceKey = () => item;
    //
    //         itemActionsController.activateSwipe(collection, 'test', 0);
    //
    //         assert.isTrue(item.isSwiped());
    //         assert.isTrue(item.isActive());
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    // });
    //
    // describe('deactivateSwipe()', () => {
    //     it('unsets swipe and activity on swipe item', () => {
    //         const item = makeActionsItem();
    //         item.setSwiped(true);
    //         item.setActive(true);
    //
    //         const collection = makeCollection();
    //         collection.find = () => item;
    //
    //         itemActionsController.deactivateSwipe(collection);
    //
    //         assert.isFalse(item.isSwiped());
    //         assert.isFalse(item.isActive());
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    // });

    // todo setSwipeItem is private now
    // describe('setSwipeItem()', () => {
    //     it('unsets swipe from old swipe item', () => {
    //         const item = makeActionsItem();
    //         item.setSwiped(true);
    //
    //         const collection = makeCollection();
    //         collection.find = () => item;
    //
    //         itemActionsController._setSwipeItem(collection, null);
    //
    //         assert.isFalse(item.isSwiped());
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    //     it('sets swipe to new swipe item', () => {
    //         const item = makeActionsItem();
    //
    //         const collection = makeCollection();
    //         collection.getItemBySourceKey = () => item;
    //
    //         itemActionsController._setSwipeItem(collection, 'test');
    //
    //         assert.isTrue(item.isSwiped());
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    // });

    // todo getSwipeItem is private now
    // describe('getSwipeItem()', () => {
    //     it('returns current swipe item', () => {
    //         const item = makeActionsItem();
    //
    //         const collection = makeCollection();
    //
    //         assert.isNull(itemActionsController._getSwipeItem(collection));
    //
    //         collection.find = () => item;
    //         assert.strictEqual(
    //             itemActionsController._getSwipeItem(collection),
    //             item
    //         );
    //     });
    // });
});
