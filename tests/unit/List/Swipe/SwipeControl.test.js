define([
   'Controls/List/Swipe/SwipeControl',
   'Controls/List/ItemActions/Utils/Actions'
], function(
   SwipeControl,
   actionsUtil
) {
   describe('Controls.List.Swipe.SwipeControl', function() {
      var instance;

      function mockListModel(swipeItem) {
         return {
            swipeItem: swipeItem,
            activeItem: swipeItem,
            itemActions: null,
            version: 0,
            getSwipeItem: function() {
               return this.swipeItem;
            },
            setSwipeItem: function(item) {
               this.swipeItem = item;
            },
            setActiveItem: function(item) {
               this.activeItem = item;
            },
            _nextVersion: function() {
               this.version++;
            },
            _nextModelVersion: function() {
               this.version++;
            },
            setItemActions: function(item, itemActions) {
               item.itemActions = itemActions;
            }
         };
      }

      beforeEach(function() {
         instance = new SwipeControl();
      });

      afterEach(function() {
         instance = null;
      });

      it('_needShowTitle', function() {
         instance._measurer = {
            needShowTitle: function(action, type, hasIcon) {
               assert.equal(action, 1);
               assert.equal(type, 1);
               assert.isTrue(hasIcon);
            }
         };
         instance._needShowTitle(1, 1, true);
      });

      it('_needShowIcon', function() {
         instance._measurer = {
            needShowIcon: function(action, direction, hasShowedItemActionWithIcon) {
               assert.equal(action, 1);
               assert.equal(direction, 'row');
               assert.isTrue(hasShowedItemActionWithIcon);
            }
         };
         instance._needShowIcon(1, 'row', true);
      });

      it('_needShowSeparator', function() {
         var itemActions = [1, 2, 3];
         instance._measurer = {
            needShowSeparator: function(action, actions, type) {
               assert.equal(action, 1);
               assert.equal(actions, itemActions);
               assert.equal(type, 1);
            }
         };
         instance._needShowSeparator(1, itemActions, 1);
      });

      it('_onItemActionsClick', function() {
         var
            oldItemActionsClick = actionsUtil.itemActionsClick,
            eventObj = {},
            dataObj = {};
         actionsUtil.itemActionsClick = function(self, event, action, itemData, showAll) {
            assert.equal(self, instance);
            assert.equal(event, eventObj);
            assert.equal(action, 1);
            assert.equal(itemData, dataObj);
            assert.isTrue(showAll);
         };
         instance._onItemActionsClick(eventObj, 1, dataObj);
         actionsUtil.itemActionsClick = oldItemActionsClick;
      });

      describe('_listDeactivated', function() {
         it('_animationState: open', function() {
            var swipeItem = {};
            instance._animationState = 'open';
            instance._swipeConfig = {};
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function(eventName, eventArgs) {
               assert.equal(eventName, 'closeSwipe');
               assert.equal(eventArgs[0], swipeItem);
            };
            instance._listDeactivated();
            assert.isNull(instance._swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.isNull(instance._options.listModel.swipeItem);
            assert.isNull(instance._options.listModel.activeItem);
            assert.equal(instance._options.listModel.version, 0);
         });

         it('_animationState: close', function() {
            var
               swipeItem = {},
               swipeConfig = {};
            instance._animationState = 'close';
            instance._swipeConfig = swipeConfig;
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function() {
               throw new Error('_notify shouldn\'t be called if swipe is closed.');
            };
            instance._listDeactivated();
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.swipeItem, swipeItem);
            assert.equal(instance._options.listModel.activeItem, swipeItem);
            assert.equal(instance._options.listModel.version, 0);
         });
      });

      describe('_listClick', function() {
         it('_animationState: open', function() {
            var swipeItem = {};
            instance._animationState = 'open';
            instance._swipeConfig = {};
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function(eventName, eventArgs) {
               assert.equal(eventName, 'closeSwipe');
               assert.equal(eventArgs[0], swipeItem);
            };
            instance._listClick();
            assert.isNull(instance._swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.isNull(instance._options.listModel.swipeItem);
            assert.isNull(instance._options.listModel.activeItem);
            assert.equal(instance._options.listModel.version, 0);
         });

         it('_animationState: close', function() {
            var
               swipeItem = {},
               swipeConfig = {};
            instance._animationState = 'close';
            instance._swipeConfig = swipeConfig;
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function() {
               throw new Error('_notify shouldn\'t be called if swipe is closed.');
            };
            instance._listClick();
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.swipeItem, swipeItem);
            assert.equal(instance._options.listModel.activeItem, swipeItem);
            assert.equal(instance._options.listModel.version, 0);
         });
      });

      describe('closeSwipe', function() {
         it('_animationState: open', function() {
            var swipeItem = {};
            instance._animationState = 'open';
            instance._swipeConfig = {};
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function(eventName, eventArgs) {
               assert.equal(eventName, 'closeSwipe');
               assert.equal(eventArgs[0], swipeItem);
            };
            instance.closeSwipe();
            assert.isNull(instance._swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.isNull(instance._options.listModel.swipeItem);
            assert.isNull(instance._options.listModel.activeItem);
            assert.equal(instance._options.listModel.version, 0);
         });

         it('_animationState: close', function() {
            var
               swipeItem = {},
               swipeConfig = {};
            instance._animationState = 'close';
            instance._swipeConfig = swipeConfig;
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function() {
               throw new Error('_notify shouldn\'t be called if swipe is closed.');
            };
            instance.closeSwipe();
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.swipeItem, swipeItem);
            assert.equal(instance._options.listModel.activeItem, swipeItem);
            assert.equal(instance._options.listModel.version, 0);
         });
      });

      describe('_onAnimationEnd', function() {
         it('_animationState: open', function() {
            var
               swipeItem = {},
               swipeConfig = {};
            instance._animationState = 'open';
            instance._swipeConfig = swipeConfig;
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function() {
               throw new Error('_notify shouldn\'t be called if swipe is open.');
            };
            instance._onAnimationEnd();
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(instance._animationState, 'open');
            assert.equal(instance._options.listModel.swipeItem, swipeItem);
            assert.equal(instance._options.listModel.activeItem, swipeItem);
            assert.equal(instance._options.listModel.version, 0);
         });

         it('_animationState: close', function() {
            var swipeItem = {};
            instance._animationState = 'close';
            instance._swipeConfig = {};
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._notify = function(eventName, eventArgs) {
               assert.equal(eventName, 'closeSwipe');
               assert.equal(eventArgs[0], swipeItem);
            };
            instance._onAnimationEnd();
            assert.isNull(instance._swipeConfig);
            assert.equal(instance._animationState, 'close');
            assert.isNull(instance._options.listModel.swipeItem);
            assert.isNull(instance._options.listModel.activeItem);
            assert.equal(instance._options.listModel.version, 0);
         });
      });

      describe('_listSwipe', function() {
         function mockChildEvent(direction) {
            return {
               nativeEvent: {
                  direction: direction
               },
               target: {
                  closest: function(selector) {
                     if (selector === '.js-controls-SwipeControl__actionsContainer') {
                        return {
                           clientHeight: 1000
                        };
                     }
                  }
               }
            };
         }
         var itemData;
         beforeEach(function() {
            itemData = {
               itemActions: [1, 2, 3, 4, 5],
               item: {}
            };
         });
         it('direction: right, _animationState: open', function() {
            var swipeItem = {};
            instance._animationState = 'open';
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._listSwipe({}, itemData, mockChildEvent('right'));
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.version, 1);
         });

         it('direction: right, _animationState: close', function() {
            var swipeItem = {};
            instance._animationState = 'close';
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._listSwipe({}, itemData, mockChildEvent('right'));
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.version, 0);
         });

         it('direction: left, _animationState: open, item withoutActions', function() {
            var swipeItem = {};
            instance._animationState = 'open';
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._listSwipe({}, {}, mockChildEvent('left'));
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.version, 1);
         });

         it('direction: left, _animationState: close, item withoutActions', function() {
            var
               swipeItem = {};
            instance._animationState = 'close';
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._listSwipe({}, {}, mockChildEvent('left'));
            assert.equal(instance._animationState, 'close');
            assert.equal(instance._options.listModel.version, 0);
         });

         it('direction: left', function() {
            var
               swipeItem = {},
               swipeConfig = {
                  type: 1
               };
            instance._animationState = 'close';
            instance._swipeConfig = {};
            instance.saveOptions({
               listModel: mockListModel(swipeItem)
            });
            instance._measurer = {
               getSwipeConfig: function(itemActions, actionsHeight) {
                  assert.equal(itemActions, itemData.itemActions);
                  assert.equal(actionsHeight, 1000);
                  return swipeConfig;
               },
               initItemsForSwipe: function(itemActions, actionsHeight, swipeType) {
                  assert.equal(itemActions, itemData.itemActions);
                  assert.equal(actionsHeight, 1000);
                  assert.equal(swipeType, 1);
                  return itemActions;
               }
            };
            instance._listSwipe({}, itemData, mockChildEvent('left'));
            assert.equal(instance._options.listModel.swipeItem, itemData);
            assert.equal(instance._options.listModel.activeItem, itemData);
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(itemData.item.itemActions, itemData.itemActions);
            assert.equal(instance._animationState, 'open');
         });

         it('direction: left,itemActionsPosition: outside', function() {
            var
               swipeItem = {};
            instance._animationState = 'close';
            instance._swipeConfig = null;
            instance.saveOptions({
               listModel: mockListModel(swipeItem),
               itemActionsPosition: 'outside'
            });
            instance._measurer = {
               getSwipeConfig: function() {
                  throw new Error('getSwipeConfig shouldn\'t be called if itemActionsPosition === outside');
               },
               initItemsForSwipe: function() {
                  throw new Error('initItemsForSwipe shouldn\'t be called if itemActionsPosition === outside');
               }
            };
            instance._listSwipe({}, itemData, mockChildEvent('left'));
            assert.equal(instance._options.listModel.swipeItem, itemData);
            assert.equal(instance._options.listModel.activeItem, itemData);
            assert.isNull(instance._swipeConfig);
            assert.equal(instance._animationState, 'open');
         });
      });
   });
});
