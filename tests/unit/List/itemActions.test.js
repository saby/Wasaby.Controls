/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/ItemActions/ItemActionsControl',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/List/ListViewModel',
   'Core/core-instance'
], function(ItemActionsControl, MemorySource, RecordSet, ListViewModel, cInstance) {

   describe('Controls.List.ItemActions', function() {
      var data, source, listViewModel, rs, actions, cfg;
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
         source = new MemorySource({
            idProperty: 'id',
            data: data
         });
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
               id: 5,
               title: 'прочитано',
               additional: true,
               handler: function() {
                  console.log('action read Click');
               }
            },
            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               main: true,
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase icon-error',
               title: 'delete pls',
               additional: true,
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
         ctrl._beforeMount(cfg);
         assert.equal(listViewModel._actions.length, data.length);//число соответствий равно числу айтемов
         listViewModel._notify('onListChange');
         assert.equal(listViewModel._actions.length, data.length);//число соответствий равно числу айтемов
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
         ctrl._beforeUpdate(cfg);
         assert.equal(listViewModel._actions[1].all.length, actions.length - 2);// для item`a  с id = 2 фильтруется два экшена
      });

      //todo: private
      /*it('_needActionsMenu', function() {
         var instance = new ItemActionsControl();
         var mainActions = [
            {
               main: true
            },
            {
               main: true
            }
         ];
         var additionalActions = [
            {
               additional: true
            },
            {
               additional: true
            }
         ];
         assert.equal(instance._private.needActionsMenu(actions), true);
         assert.equal(instance._private._needActionsMenu([]), false);
         assert.equal(instance._private._needActionsMenu(mainActions), false);
         assert.equal(instance._private._needActionsMenu(additionalActions), false);

      });*/
      it('_onActionClick', function() {
         var instance = new ItemActionsControl();
         var action = {
            handler: function(item) {
               assert.isTrue(item);
            }
         };
         instance._notify = function(eventName, args) {
            assert.isTrue(args[1]);
            assert.equal(args[0], action);
         };
         instance._onActionClick({stopPropagation: function() {}}, action, {item: true});

      });

      /* it('showActionsMenu context', function() {
         var
            cfg = {
               listModel: listViewModel,
               itemActions: actions
            },
            instance = new ItemActionsControl(cfg),
            fakeEvent = {
               type: 'itemcontextmenu',
               nativeEvent: {
                  preventDefault: function() {
                     assert.isTrue(true); //make preventDefault
                  }
               },
               stopImmediatePropagation: function(){
                  assert.isTrue(true); //make stopImmediatePropagation
               }
            },
            itemData = {
               itemActions: {all: actions}
            };
         instance._children = {
            itemActionsOpener: {
               open: function(args) {
                  assert.isFalse(args.target);
                  assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'WS.Data/Collection/RecordSet'));
               }
            }
         };

         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         instance._showActionsMenu(fakeEvent, itemData);
         assert.equal(itemData, listViewModel._activeItem);
         assert.isTrue(itemData.contextEvent);

      });*/

      /* it('showActionsMenu no context', function() {
         var
            cfg = {
               listModel: listViewModel,
               itemActions: actions
            },
            target = 123,
            instance = new ItemActionsControl(cfg),
            fakeEvent = {
               target: target,
               type: 'click',
               nativeEvent: {
                  preventDefault: function() {
                     assert.isTrue(true); //make preventDefault
                  }
               },
               stopImmediatePropagation: function(){
                  assert.isTrue(true); //make stopImmediatePropagation
               }
            },
            itemData = {
               itemActions:  {all:actions}
            };
         instance._children = {
            itemActionsOpener: {
               open: function(args) {
                  assert.equal(target, args.target);
                  assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'WS.Data/Collection/RecordSet'));
               }
            }
         };

         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         instance._showActionsMenu(fakeEvent, itemData);
         assert.equal(itemData, listViewModel._activeItem);
         assert.isFalse(itemData.contextEvent);

      });
*/
      /*  it('closeActionsMenu', function() {
         var
            cfg = {
               listModel: listViewModel,
               itemActions: actions
            },
            target = 123,
            instance = new ItemActionsControl(cfg),
            fakeEvent = {
               target: target,
               type: 'click',
               stopPropagation: function() {
                  assert.isTrue(true); //make stopPropagation
               },
               nativeEvent: {
                  preventDefault: function() {
                     assert.isTrue(true); //make preventDefault
                  }
               },
               stopImmediatePropagation: function(){
                  assert.isTrue(true); //make stopImmediatePropagation
               }
            },
            itemData = {
               itemActions: actions
            };
         instance._children = {
            itemActionsOpener: {
               close: function() {
                  assert.isTrue(true); //make preventDefault
               }
            }
         };
         listViewModel._activeItem = {
            item: true
         };

         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         instance._closeActionsMenu(['itemClick', fakeEvent, [{
            getRawData: function() {
               assert.isTrue(true); //make getRawData
               return {
                  handler: function() {
                     assert.isTrue(true); //make action handler;
                  }
               };
            }
         }]]);
         assert.isFalse(listViewModel._activeItem);

      });*/

   });
});
