/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/ItemActions/ItemActionsControl',
   'WS.Data/Source/Memory',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/RecordSet',
   'Controls/List/ListViewModel',
   'Controls/List/ItemActions/Utils/Actions',
   'Controls/Utils/Toolbar',
   'Controls/List/Swipe/SwipeControl'
], function(ItemActionsControl, MemorySource, Model, RecordSet, ListViewModel, aUtil, tUtil, SwipeControl) {


   var createItem = function() {
      return new Model();
   };

   describe('Controls.List.ItemActions', function() {
      var data, listViewModel, rs, actions;
      beforeEach(function() {
         data = [
            {
               id: 1,
               title: 'Первый',
               type: 1
            },
            {
               id: 2,
               title: 'Второй',
               type: 2
            },
            {
               id: 3,
               title: 'Третий',
               type: 2
            },
            {
               id: 4,
               title: 'Четвертый',
               type: 1
            },
            {
               id: 5,
               title: 'Пятый',
               type: 2
            },
            {
               id: 6,
               title: 'Шестой',
               type: 2
            }
         ];
         rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });
         listViewModel = new ListViewModel({
            items: rs,
            keyProperty: 'id'
         });

         actions = [
            {
               id: 0,
               title: 'прочитано',
               showType: tUtil.showType.TOOLBAR,
               handler: function() {
                  console.log('action read Click');
               }
            },
            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               showType: tUtil.showType.MENU,
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               showType: tUtil.showType.MENU,
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               showType: tUtil.showType.MENU_TOOLBAR,
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase icon-error',
               title: 'delete pls',
               showType: tUtil.showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            },
            {
               id: 5,
               icon: 'icon-done icon-Admin',
               title: 'delete pls',
               showType: tUtil.showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }
         ];
      });


      it('fillItemsActions', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: actions
         };
         var ctrl = new ItemActionsControl(cfg);
         ctrl._beforeMount(cfg, {isTouch: {isTouch: false}});
         assert.equal(listViewModel._actions.length, data.length);//число соответствий равно числу айтемов
         listViewModel._notify('onListChange');
         assert.equal(listViewModel._actions.length, data.length);//число соответствий равно числу айтемов
         assert.equal(listViewModel._actions[0].all.length, actions.length);
         assert.equal(listViewModel._actions[0].showed.length, 4 + 1); // 3-showType.TOOLBAR 1-showType.MENU_TOOLBAR 1 -само menu
      });

      it('updateItemActions editingItem showToolbar', function() {
         var callBackCount = 0;
         var cfg = {
            listModel: listViewModel,
            itemActions: actions,
            showToolbar: true,
            itemActionsPosition: 'outside'
         };
         var ctrl = new ItemActionsControl(cfg);
         ctrl._beforeMount(cfg, {isTouch: {isTouch: false}});
         ctrl._saveContextObject({isTouch: {isTouch: false}});
         ctrl.saveOptions(cfg);

         ctrl._notify = function(eventName) {
            if (eventName === 'commitActionClick' || eventName === 'cancelActionClick') {
               callBackCount++;
            }
         };

         listViewModel.reset();
         ctrl.updateItemActions(listViewModel.getCurrent().item, true);
         assert.equal(listViewModel._actions[0].showed.length, actions.length + 2); // 2 - edititplace

         assert.equal(callBackCount, 0);
         listViewModel._actions[0].showed[actions.length].handler(); //applyEdit
         listViewModel._actions[0].showed[actions.length + 1].handler();//cancelEdit
         assert.equal(callBackCount, 2);
      });

      it('itemActionVisibilityCallback', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: actions,
            itemActionVisibilityCallback: function(action, item) {
               if (item.get('id') === 2 && (action.id === 2 || action.title === 'phone')) {
                  return false;
               }
               return true;
            }
         };
         var ctrl = new ItemActionsControl(cfg);
         ctrl._beforeUpdate(cfg, {isTouch: {isTouch: false}});
         assert.equal(listViewModel._actions[1].all.length, actions.length - 2);// для item`a  с id = 2 фильтруется два экшена
      });

      it('_onItemActionClick', function() {
         var callBackCount = 0;
         var instance = new ItemActionsControl();
         var action = {
            handler: function(item) {
               callBackCount++;
               assert.isTrue(item);
            }
         };
         instance._notify = function(eventName, args) {
            callBackCount++;
            assert.isTrue(args[1]);
            assert.equal(args[0], action);
         };
         instance._onItemActionsClick({stopPropagation: function() {}}, action, {item: true});
         assert.equal(callBackCount, 2);
      });

      it('getDefaultOptions ', function() {
         var defOpts = ItemActionsControl.getDefaultOptions();
         assert.equal(defOpts.itemActionsPosition, 'inside');
         assert.isTrue(defOpts.itemActionVisibilityCallback());
      });

      it('updateItemActions, isTouch: false', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: [{
               id: 0,
               title: 'first',
               showType: tUtil.showType.MENU
            },
            {
               id: 1,
               title: 'second',
               showType: tUtil.showType.TOOLBAR
            }],
            itemActionsPosition: 'outside'
         };
         var ctrl = new ItemActionsControl(cfg);
         ctrl._beforeMount(cfg, {isTouch: {isTouch: false}});
         ctrl._saveContextObject({isTouch: {isTouch: false}});
         ctrl.saveOptions(cfg);

         listViewModel.reset();
         ctrl.updateItemActions(listViewModel.getCurrent().item, true);
         assert.deepEqual([{
            id: 0,
            title: 'first',
            showType: tUtil.showType.MENU
         },
         {
            id: 1,
            title: 'second',
            showType: tUtil.showType.TOOLBAR
         }], listViewModel._actions[0].showed);
      });

      it('updateItemActions, isTouch: true', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: [{
               id: 0,
               title: 'first',
               showType: tUtil.showType.MENU
            },
            {
               id: 1,
               title: 'second',
               showType: tUtil.showType.TOOLBAR
            }],
            itemActionsPosition: 'outside'
         };
         var ctrl = new ItemActionsControl(cfg);
         ctrl._beforeMount(cfg, {isTouch: {isTouch: true}});
         ctrl._saveContextObject({isTouch: {isTouch: true}});
         ctrl.saveOptions(cfg);

         listViewModel.reset();
         ctrl.updateItemActions(listViewModel.getCurrent().item, true);
         assert.deepEqual([{
            id: 1,
            title: 'second',
            showType: tUtil.showType.TOOLBAR
         }, {
            id: 0,
            title: 'first',
            showType: tUtil.showType.MENU
         }], listViewModel._actions[0].showed);
      });

      describe('Controls.List.Swipe.SwipeControl', function() {
         it('_listSwipe right', function() {
            var
               instance = new SwipeControl(),
               childEvent = {
                  nativeEvent: {
                     direction: 'right'
                  }
               };

            instance._listSwipe({}, {}, childEvent);
         });
         it('_listSwipe 37', function() {
            var cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               instance = new SwipeControl(cfg),
               childEvent = {
                  nativeEvent: {
                     direction: 'left'
                  },
                  currentTarget: {
                     clientHeight: 37
                  }
               },
               itemData =  {
                  itemActions: {all: actions},
                  item: createItem()
               };
            instance._beforeMount(cfg, {isTouch: {isTouch: true}});
            instance.saveOptions(cfg);
            instance._listSwipe({}, itemData, childEvent);
            assert.equal(instance._swipeConfig.type, 1);
            assert.equal(instance._swipeConfig.direction, 'row');
            assert.equal(instance._swipeConfig.isFull, false);
            assert.equal(instance._swipeConfig.separatorType, 'vertical');
            assert.equal(instance._swipeConfig.bigTitle, false);
            instance._beforeUpdate({itemActions: []}, {isTouch: {isTouch: false}});
         });

         it('_listSwipe 73', function() {
            var cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               instance = new SwipeControl(cfg),
               childEvent = {
                  nativeEvent: {
                     direction: 'left'
                  },
                  currentTarget: {
                     clientHeight: 73
                  }
               },
               itemData =  {
                  itemActions: {all: actions},
                  item: createItem()
               };
            instance._beforeMount(cfg, {isTouch: {isTouch: true}});
            instance.saveOptions(cfg);
            instance._listSwipe({}, itemData, childEvent);
            assert.equal(instance._swipeConfig.type, 13);
            assert.equal(instance._swipeConfig.direction, 'column');
            assert.equal(instance._swipeConfig.isFull, true);
            assert.equal(instance._swipeConfig.separatorType, 'horizontal');
            assert.equal(instance._swipeConfig.bigTitle, true);
         });

         it('_listSwipe 110', function() {
            var cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               instance = new SwipeControl(cfg),
               childEvent = {
                  nativeEvent: {
                     direction: 'left'
                  },
                  currentTarget: {
                     clientHeight: 110
                  }
               },
               itemData =  {
                  itemActions: {all: actions},
                  item: createItem()
               };
            instance._beforeMount(cfg, {isTouch: {isTouch: true}});
            instance.saveOptions(cfg);
            instance._listSwipe({}, itemData, childEvent);
            assert.equal(instance._swipeConfig.type, 9);
            assert.equal(instance._swipeConfig.direction, 'column');
            assert.equal(instance._swipeConfig.isFull, false);
            assert.equal(instance._swipeConfig.separatorType, 'horizontal');
            assert.equal(instance._swipeConfig.bigTitle, false);
         });
         it('_listSwipe 184', function() {
            var cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               instance = new SwipeControl(cfg),
               childEvent = {
                  nativeEvent: {
                     direction: 'left'
                  },
                  currentTarget: {
                     clientHeight: 250
                  }
               },
               itemData =  {
                  itemActions: {all: actions},
                  item: createItem()
               };
            instance._beforeMount(cfg, {isTouch: {isTouch: true}});
            instance.saveOptions(cfg);
            instance._listSwipe({}, itemData, childEvent);
            assert.equal(instance._swipeConfig.type, 5);
            assert.equal(instance._swipeConfig.direction, 'column');
            assert.equal(instance._swipeConfig.isFull, true);
            assert.equal(instance._swipeConfig.separatorType, 'horizontal');
            assert.equal(instance._swipeConfig.bigTitle, false);
         });
         it('_private initSwipeType', function() {
            assert.equal(SwipeControl._private.initSwipeType(37, 5), 1);
            assert.equal(SwipeControl._private.initSwipeType(44, 5), 2);
            assert.equal(SwipeControl._private.initSwipeType(52, 5), 3);
            assert.equal(SwipeControl._private.initSwipeType(55, 5), 4);
            assert.equal(SwipeControl._private.initSwipeType(72, 5), 4);
            assert.equal(SwipeControl._private.initSwipeType(73, 5), 13);
            assert.equal(SwipeControl._private.initSwipeType(109, 5), 13);
            assert.equal(SwipeControl._private.initSwipeType(110, 5), 9);
            assert.equal(SwipeControl._private.initSwipeType(133, 5), 9);
            assert.equal(SwipeControl._private.initSwipeType(134, 5), 10);
            assert.equal(SwipeControl._private.initSwipeType(157, 5), 10);
            assert.equal(SwipeControl._private.initSwipeType(158, 5), 11);
            assert.equal(SwipeControl._private.initSwipeType(181, 5), 11);
            assert.equal(SwipeControl._private.initSwipeType(182, 5), 12);
            assert.equal(SwipeControl._private.initSwipeType(183, 5), 12);
            assert.equal(SwipeControl._private.initSwipeType(184, 5), 5);
            assert.equal(SwipeControl._private.initSwipeType(223, 5), 5);
            assert.equal(SwipeControl._private.initSwipeType(224, 5), 6);
            assert.equal(SwipeControl._private.initSwipeType(263, 5), 6);
            assert.equal(SwipeControl._private.initSwipeType(264, 5), 7);
            assert.equal(SwipeControl._private.initSwipeType(303, 5), 7);
            assert.equal(SwipeControl._private.initSwipeType(304, 5), 8);
            assert.equal(SwipeControl._private.initSwipeType(604, 5), 8);
         });
         it('_private getNumberInterval', function() {
            assert.equal(SwipeControl._private.getNumberInterval(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 12, 13, 15, 16]), 1);
            assert.equal(SwipeControl._private.getNumberInterval(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 12, 13, 15, 16]), 9);
         });
         it('_private initSwipeDirection', function() {
            assert.equal(SwipeControl._private.initSwipeDirection(3), 'row');
            assert.equal(SwipeControl._private.initSwipeDirection(4), 'row');
            assert.equal(SwipeControl._private.initSwipeDirection(10), 'column');
            assert.equal(SwipeControl._private.initSwipeDirection(7), 'column');
         });
         it('_private swipeIsFull', function() {
            assert.equal(SwipeControl._private.swipeIsFull(7), true);
            assert.equal(SwipeControl._private.swipeIsFull(13), true);
            assert.equal(SwipeControl._private.swipeIsFull(8), true);
            assert.equal(SwipeControl._private.swipeIsFull(5), true);
            assert.equal(SwipeControl._private.swipeIsFull(3), false);
            assert.equal(SwipeControl._private.swipeIsFull(1), false);
            assert.equal(SwipeControl._private.swipeIsFull(9), false);
            assert.equal(SwipeControl._private.swipeIsFull(11), false);
         });
         it('_private getActionDefaultHeight', function() {
            assert.equal(SwipeControl._private.getActionDefaultHeight(1), 36);
            assert.equal(SwipeControl._private.getActionDefaultHeight(2), 44);
            assert.equal(SwipeControl._private.getActionDefaultHeight(3), 52);
            assert.equal(SwipeControl._private.getActionDefaultHeight(4), 60);
         });
         it('_private initSeparatorType', function() {
            assert.equal(SwipeControl._private.initSeparatorType('row'), 'vertical');
            assert.equal(SwipeControl._private.initSeparatorType('abrakadabra'), 'horizontal');
         });
         it('_private needShowTitle', function() {
            assert.equal(SwipeControl._private.needShowTitle(false, 3), true);
            assert.equal(SwipeControl._private.needShowTitle(false, 4), true);
            assert.equal(SwipeControl._private.needShowTitle(false, 7), true);
            assert.equal(SwipeControl._private.needShowTitle(false, 8), true);
            assert.equal(SwipeControl._private.needShowTitle(false, 11), true);
            assert.equal(SwipeControl._private.needShowTitle(false, 12), true);
            assert.equal(SwipeControl._private.needShowTitle({title: true}, 5), true);
            assert.equal(SwipeControl._private.needShowTitle({title: true, icon: true}, 9), false);
            assert.equal(SwipeControl._private.needShowTitle({title: true, icon: true}, 10), false);
         });
         it('_private needShowIcon', function() {
            assert.isTrue(SwipeControl._private.needShowIcon({icon: 'icon-16 icon-Alert icon-primary'}, 'row', true),
               'Incorrect result needShowIcon({icon: "icon"}, "row", true).');
            assert.isTrue(SwipeControl._private.needShowIcon({icon: 'icon-16 icon-Alert icon-primary'}, 'column', true),
               'Incorrect result needShowIcon({icon: "icon"}, "column", true).');
            assert.isTrue(SwipeControl._private.needShowIcon({}, 'row', true),
               'Incorrect result needShowIcon({}, "row", true).');
            assert.isFalse(SwipeControl._private.needShowIcon({}, 'row', false),
               'Incorrect result needShowIcon({}, "row", false).');
            assert.isFalse(SwipeControl._private.needShowIcon({}, 'column', true),
               'Incorrect result needShowIcon({}, "column", true).');
            assert.isFalse(SwipeControl._private.needShowIcon({}, 'column', false),
               'Incorrect result needShowIcon({}, "column", false).');
         });
         it('_private needShowSeparator', function() {
            var
               itemData = {
                  itemActions: {
                     all: [1, 2, 3, 4, 5, 6, 7, 8]
                  }
               };
            assert.equal(SwipeControl._private.needShowSeparator({_visibleItemsCount: 2}, 1, itemData, 1), true);
            assert.equal(SwipeControl._private.needShowSeparator({}, 0, itemData, false), false);
            assert.equal(SwipeControl._private.needShowSeparator({_visibleItemsCount: 2}, 2, itemData, 1), false);
            assert.equal(SwipeControl._private.needShowSeparator({_visibleItemsCount: 4}, 2, itemData, 9), false);
            assert.equal(SwipeControl._private.needShowSeparator({_visibleItemsCount: 4}, {isMenu: true}, itemData, 9), false);
            assert.equal(SwipeControl._private.needShowSeparator({_visibleItemsCount: 4}, {isMenu: true}, itemData, 6), false);
            assert.equal(SwipeControl._private.needShowSeparator({_visibleItemsCount: 4}, 3, itemData, 9), true);
         });

         it('_listDeactivated _listClick', function() {
            SwipeControl.contextTypes();
            var cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               instance = new SwipeControl(cfg);
            instance._beforeMount(cfg, {isTouch: {isTouch: true}});
            instance.saveOptions(cfg);
            instance._listDeactivated();
            instance._listClick();
         });
      });
   });

   describe('Controls.List.Utils.Actions', function() {

      it('itemActionClick menu', function() {
         var
            callBackCount = 0,
            fakeEvent = {
               stopPropagation: function() {
                  callBackCount++;
               }
            },
            action = {
               isMenu: true
            },
            itemData = {
               item: 'test'
            },
            instance = {
               _notify: function(eventName, args) {
                  callBackCount++;
                  assert.equal(args[0], itemData);
                  assert.equal(args[1], fakeEvent);
                  assert.equal(args[2], false);
                  assert.equal(eventName, 'menuActionsClick');
               }
            };
         aUtil.itemActionsClick(instance, fakeEvent, action, itemData, false);
         assert.equal(callBackCount, 2);
      });


   });
});
