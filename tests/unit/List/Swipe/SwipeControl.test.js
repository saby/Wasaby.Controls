define([
   'Controls/_lists/Swipe/SwipeControl',
   'Controls/_lists/ItemActions/Utils/Actions',
   'Controls/_lists/Swipe/HorizontalMeasurer',
   'Controls/_lists/Swipe/VerticalMeasurer'
], function(
   SwipeControl,
   actionsUtil,
   HorizontalMeasurer,
   VerticalMeasurer
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
            nextModelVersion: function() {
               this.version++;
            },
            _nextModelVersion: function() {
               this.version++;
            },
            setItemActions: function(item, itemActions) {
               item.itemActions = itemActions;
            },
            subscribe: function() {

            }
         };
      }

      beforeEach(function() {
         instance = new SwipeControl.default();
      });

      afterEach(function() {
         instance = null;
      });

      it('_needTitle', function() {
         var testAction = {
            id: 1,
            icon: 'icon-PhoneNull',
            title: 'Прочитано'
         };
         instance._measurer = {
            needTitle: function(action, titlePosition) {
               assert.equal(testAction, action);
               assert.equal('right', titlePosition);
            }
         };
         instance._needTitle(testAction, 'right');
      });

      it('_needIcon', function() {
         var testAction = {
            id: 1,
            icon: 'icon-PhoneNull',
            title: 'Прочитано'
         };
         instance._measurer = {
            needIcon: function(action, hasShowedItemActionWithIcon) {
               assert.equal(testAction, action);
               assert.isTrue(hasShowedItemActionWithIcon);
            }
         };
         instance._needIcon(testAction, true);
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

      describe('_beforeMount', function() {
         it('should load HorizontalMeasurer', async function() {
            await instance._beforeMount({
               swipeDirection: 'row',
               listModel: mockListModel({})
            });

            assert.equal(instance._measurer, HorizontalMeasurer.default);
         });

         it('should load VerticalMeasurer', async function() {
            await instance._beforeMount({
               swipeDirection: 'column',
               listModel: mockListModel({})
            });

            assert.equal(instance._measurer, VerticalMeasurer.default);
         });
      });

      describe('_listSwipe', function() {
         function mockChildEvent(direction, isActionsContainer) {
            return {
               nativeEvent: {
                  direction: direction
               },
               target: {
                  closest: function(selector) {
                     if (selector === '.controls-ListView__itemV') {
                        return {
                           clientHeight: 2000,
                           classList: {
                              contains: function() {
                                 return isActionsContainer;
                              }
                           },
                           querySelector: function(selector) {
                              if (selector === '.js-controls-SwipeControl__actionsContainer') {
                                 return {
                                    clientHeight: 1000
                                 };
                              }
                           }
                        };
                     }
                  }
               }
            };
         }
         var itemData;
         beforeEach(function() {
            itemData = {
               itemActions: {
                  all: [1, 2, 3, 4, 5]
               },
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
                  itemActions: itemData.itemActions
               };
            instance.saveOptions({
               listModel: mockListModel(swipeItem),
               itemActionsPosition: 'inside',
               titlePosition: 'none'
            });
            instance._measurer = {
               getSwipeConfig: function(itemActions, rowHeight, titlePosition) {
                  assert.equal(itemActions, itemData.itemActions.all);
                  assert.equal(rowHeight, 1000);
                  assert.equal(titlePosition, 'none');
                  return swipeConfig;
               }
            };
            instance._listSwipe({}, itemData, mockChildEvent('left'));
            assert.equal(instance._options.listModel.swipeItem, itemData);
            assert.equal(instance._options.listModel.activeItem, itemData);
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(itemData.item.itemActions, itemData.itemActions);
            assert.equal(instance._animationState, 'open');
         });

         it('direction: left', function() {
            var
               swipeItem = {},
               swipeConfig = {
                  itemActions: itemData.itemActions
               };
            instance.saveOptions({
               listModel: mockListModel(swipeItem),
               itemActionsPosition: 'inside',
               titlePosition: 'none'
            });
            instance._measurer = {
               getSwipeConfig: function(itemActions, rowHeight, titlePosition) {
                  assert.equal(itemActions, itemData.itemActions.all);
                  assert.equal(rowHeight, 2000);
                  assert.equal(titlePosition, 'none');
                  return swipeConfig;
               }
            };
            instance._listSwipe({}, itemData, mockChildEvent('left', true));
            assert.equal(instance._options.listModel.swipeItem, itemData);
            assert.equal(instance._options.listModel.activeItem, itemData);
            assert.equal(instance._swipeConfig, swipeConfig);
            assert.equal(itemData.item.itemActions, itemData.itemActions);
            assert.equal(instance._animationState, 'open');
         });

         it('direction: left,itemActionsPosition: outside', function() {
            var
               swipeItem = {};
            instance.saveOptions({
               listModel: mockListModel(swipeItem),
               itemActionsPosition: 'outside'
            });
            instance._measurer = {
               getSwipeConfig: function() {
                  throw new Error('getSwipeConfig shouldn\'t be called if itemActionsPosition === outside');
               }
            };
            instance._listSwipe({}, itemData, mockChildEvent('left'));
            assert.equal(instance._options.listModel.swipeItem, itemData);
            assert.equal(instance._options.listModel.activeItem, itemData);
            assert.isNotOk(instance._swipeConfig);
            assert.equal(instance._animationState, 'open');
         });
      });
   });
});
