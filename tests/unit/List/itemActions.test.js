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
   'Controls/Utils/Toolbar'
], function(ItemActionsControl, MemorySource, Model, RecordSet, ListViewModel, aUtil, tUtil) {

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

      it('updateItemActions editingItem toolbarVisibility', function() {
         var callBackCount = 0;
         var cfg = {
            listModel: listViewModel,
            itemActions: actions,
            toolbarVisibility: true,
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
         var fakeItemData = {
            item: {},
            index: 0
         };
         var fakeHTMLElement = {
            className: 'controls-ListView__itemV'
         };
         instance._container = {
            querySelector: function(selector) {
               if (selector === '.controls-ListView__itemV') {
                  return {
                     parentNode: {
                        children: [fakeHTMLElement]
                     }
                  };
               }
            }
         };
         var action = {
            handler: function(item) {
               callBackCount++;
               assert.equal(item, fakeItemData.item);
            }
         };
         instance._notify = function(eventName, args) {
            callBackCount++;
            assert.equal(args[0], action);
            assert.equal(args[1], fakeItemData.item);
            assert.equal(args[2], fakeHTMLElement);
         };
         instance._onItemActionsClick({ stopPropagation: function() {} }, action, fakeItemData);
         assert.equal(callBackCount, 2);
      });

      it('getDefaultOptions ', function() {
         var defOpts = ItemActionsControl.getDefaultOptions();
         assert.equal(defOpts.itemActionsPosition, 'inside');
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
            iconStyle: 'secondary',
            style: 'secondary',
            showType: tUtil.showType.MENU
         },
         {
            id: 1,
            title: 'second',
            iconStyle: 'secondary',
            style: 'secondary',
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
            iconStyle: 'secondary',
            style: 'secondary',
            showType: tUtil.showType.TOOLBAR
         }, {
            id: 0,
            title: 'first',
            iconStyle: 'secondary',
            style: 'secondary',
            showType: tUtil.showType.MENU
         }], listViewModel._actions[0].showed);
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
      it('itemActionsClick', function() {
         var
            callBackCount = 0,
            fakeNativeEvent = {},
            fakeHTMLElement = {
               className: 'controls-ListView__itemV'
            },
            fakeEvent = {
               stopPropagation: function() {
                  callBackCount++;
               },
               nativeEvent: fakeNativeEvent
            },
            action = {},
            itemData = {
               item: 'test',
               index: 0
            },
            instance = {
               _notify: function(eventName, args) {
                  callBackCount++;
                  assert.equal(args[0], action);
                  assert.equal(args[1], itemData.item);
                  assert.equal(args[2], fakeHTMLElement);
                  assert.equal(eventName, 'itemActionsClick');
               },
               _container: {
                  querySelector: function(selector) {
                     if (selector === '.controls-ListView__itemV') {
                        return {
                           parentNode: {
                              children: [fakeHTMLElement]
                           }
                        };
                     }
                  }
               }
            };
         aUtil.itemActionsClick(instance, fakeEvent, action, itemData, false);
         assert.equal(callBackCount, 2);
      });
   });
});
