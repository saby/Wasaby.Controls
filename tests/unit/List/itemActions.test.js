/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/list',
   'Types/source',
   'Types/entity',
   'Types/collection',
   'Types/display',
   'Controls/List/ItemActions/Utils/Actions',
   'Controls/Utils/Toolbar'
], function(lists, source, entity, collection, display, aUtil, tUtil) {
   describe('Controls.List.ItemActions', function() {
      var data, listViewModel, rs, actions, sandbox;
      beforeEach(function() {
         data = [
            {
               id: 0,
               title: 'Первый',
               type: 1
            },
            {
               id: 1,
               title: 'Второй',
               type: 2
            },
            {
               id: 2,
               title: 'Третий',
               type: 2
            },
            {
               id: 3,
               title: 'Четвертый',
               type: 1
            },
            {
               id: 4,
               title: 'Пятый',
               type: 2
            },
            {
               id: 5,
               title: 'Шестой',
               type: 2
            }
         ];
         rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });
         listViewModel = new lists.ListViewModel({
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
         sandbox = sinon.createSandbox();
      });

      afterEach(function() {
         sandbox.restore();
      });


      it('fillItemsActions', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: actions
         };
         var ctrl = new lists.ItemActionsControl(cfg);
         ctrl._beforeMount(cfg, {isTouch: {isTouch: false}});
         if (typeof window === 'undefined') {
            //Это нужно переписать, тест должен тестировать логику внутри _beforeUpdate
            //под нодой это не тестируем
            assert.isTrue(true);
         } else {
            assert.equal(Object.keys(listViewModel._actions).length, data.length);//число соответствий равно числу айтемов
            listViewModel._notify('onListChange');
            assert.equal(Object.keys(listViewModel._actions).length, data.length);//число соответствий равно числу айтемов
            assert.equal(listViewModel._actions[0].all.length, actions.length);
            assert.equal(listViewModel._actions[0].showed.length, 4 + 1); // 3-showType.TOOLBAR 1-showType.MENU_TOOLBAR 1 -само menu
         }
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
         var ctrl = new lists.ItemActionsControl(cfg);
         ctrl._options.listModel = {
            unsubscribe: function() {

            }};
         ctrl._beforeUpdate(cfg, {isTouch: {isTouch: false}});
         assert.equal(listViewModel._actions[2].all.length, actions.length - 2);// для item`a  с id = 2 фильтруется два экшена
      });

      it('itemActionsProperty', function() {
         var
            data = [
               {
                  id: 0,
                  title: 'Первый',
                  type: 1,
                  test: [
                     {
                        id: 0,
                        title: 'прочитано',
                        showType: tUtil.showType.TOOLBAR
                     }
                  ]
               },
               {
                  id: 1,
                  title: 'Второй',
                  type: 2,
                  test: [
                     {
                        id: 0,
                        title: 'прочитано',
                        showType: tUtil.showType.TOOLBAR
                     },
                     {
                        id: 1,
                        icon: 'icon-primary icon-PhoneNull',
                        title: 'phone',
                        showType: tUtil.showType.MENU
                     }
                  ]
               }
            ],
            rs = new collection.RecordSet({
               idProperty: 'id',
               rawData: data
            }),
            listViewModel = new lists.ListViewModel({
               items: rs,
               keyProperty: 'id'
            }),
            cfg = {
               listModel: listViewModel,
               itemActions: [],
               itemActionsProperty: 'test'
            };
         var ctrl = new lists.ItemActionsControl(cfg);
         ctrl._options.listModel = {
            unsubscribe: function() {
            }
         };
         ctrl._beforeUpdate(cfg, { isTouch: { isTouch: false } });
         assert.deepEqual(data[0].test, listViewModel._actions[0].all);
         assert.deepEqual(data[1].test, listViewModel._actions[1].all);
      });

      it('unsubscribe old model', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: actions
         };
         var eHandler = function() {};
         var ctrl = new lists.ItemActionsControl(cfg);
         ctrl._onCollectionChangeFn = eHandler;
         listViewModel.subscribe('onListChange', eHandler);
         ctrl._options.listModel = listViewModel;

         assert.isTrue(listViewModel.hasEventHandlers('onListChange'));

         ctrl._beforeUpdate({
            listModel: new lists.ListViewModel({
               items: rs,
               keyProperty: 'id'
            })
         });

         assert.isFalse(listViewModel.hasEventHandlers('onListChange'));
      });

      it('getChildren', function() {
         const
            actionsWithHierarchy = [
               {
                  id: 1,
                  icon: 'icon-PhoneNull',
                  title: 'phone'
               },
               {
                  id: 2,
                  title: 'Добавить',
                  parent: null,
                  'parent@': true
               },
               {
                  id: 3,
                  title: 'Компанию',
                  parent: 2,
                  'parent@': null
               },
               {
                  id: 6,
                  title: 'ИП',
                  parent: 2,
                  'parent@': null
               }
            ],
            cfg = {
               listModel: listViewModel,
               itemActions: actionsWithHierarchy
            },
            ctrl = new lists.ItemActionsControl(cfg);
         assert.deepEqual(actionsWithHierarchy.slice(-2), ctrl.getChildren(actionsWithHierarchy[1], actionsWithHierarchy));
      });

      describe('_onCollectionChange', function() {
         it('items should not update if the type is neither collectionChanged nor indexesChanged', function() {
            var
               cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               ctrl = new lists.ItemActionsControl(cfg),
               spy = sandbox.spy(listViewModel, 'nextModelVersion');
            ctrl.saveOptions(cfg);
            ctrl._onCollectionChange({}, 'test');

            assert.isFalse(spy.called);
         });

         it('items should update once if the type is collectionChanged', function() {
            var
               cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               ctrl = new lists.ItemActionsControl(cfg),
               spy = sandbox.spy(listViewModel, 'nextModelVersion');
            ctrl.saveOptions(cfg);
            ctrl._onCollectionChange({}, 'collectionChanged');

            assert.isTrue(spy.calledOnce);
            assert.isTrue(spy.firstCall.args[0]);
         });

         it('items should update once if the type is indexesChanged', function() {
            var
               cfg = {
                  listModel: listViewModel,
                  itemActions: actions
               },
               ctrl = new lists.ItemActionsControl(cfg),
               spy = sandbox.spy(listViewModel, 'nextModelVersion');
            ctrl.saveOptions(cfg);
            ctrl._onCollectionChange({}, 'indexesChanged');

            assert.isTrue(spy.calledOnce);
            assert.isFalse(spy.firstCall.args[0]);
         });
      });

      it('_onItemActionClick', function() {
         var cfg = {
            listModel: listViewModel,
            itemActions: actions
         };
         var instance = new lists.ItemActionsControl(cfg);
         instance.saveOptions(cfg);
         var fakeItemData = {
            item: {},
            index: 0,
            key: 2
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
         const fakeEvent = {
            stopPropagation: function() {}
         };
         const action = {
            handler: sandbox.stub()
         };
         const notifyStub = sandbox.stub(instance, '_notify');

         instance._onItemActionsClick(fakeEvent, action, fakeItemData);
         assert.isTrue(notifyStub.withArgs('actionClick', [action, fakeItemData.item, fakeHTMLElement]).calledOnce);
         assert.isTrue(action.handler.withArgs(fakeItemData.item).calledOnce);
         assert.equal(instance._options.listModel.getMarkedKey(), fakeItemData.key);
      });

      it('getDefaultOptions ', function() {
         var defOpts = lists.ItemActionsControl.getDefaultOptions();
         assert.equal(defOpts.itemActionsPosition, 'inside');
      });

      it('updateItemActions should update the version of the list exactly once', function() {
         var
            cfg = {
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
            },
            ctrl = new lists.ItemActionsControl(cfg),
            oldVersion = listViewModel.getVersion();
         ctrl.saveOptions(cfg);
         ctrl.updateItemActions(listViewModel.getCurrent().item);
         assert.equal(listViewModel.getVersion() - oldVersion, 1);
      });

      it('updateItemActions', function() {
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
         var ctrl = new lists.ItemActionsControl(cfg);
         ctrl._beforeMount(cfg);
         ctrl.saveOptions(cfg);

         listViewModel.reset();
         ctrl.updateItemActions(listViewModel.getCurrent().item);
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
   });

   describe('Controls.List.Utils.Actions', function() {
      var sandbox;
      beforeEach(function() {
         sandbox = sinon.createSandbox();
      });
      afterEach(function() {
         sandbox.restore();
      });
      it('itemActionClick action with menu', function() {
         var
            stopPropagationCalled = false,
            notifyCalled = false,
            fakeEvent = {
               stopPropagation: function() {
                  stopPropagationCalled = true;
               }
            },
            action = {
               'parent@': true
            },
            itemData = {
               item: 'test'
            },
            instance = {
               _notify: function(eventName, args) {
                  notifyCalled = true;
                  assert.equal(args[0], itemData);
                  assert.equal(args[1], fakeEvent);
                  assert.equal(args[2], action);
                  assert.equal(eventName, 'menuActionClick');
               }
            };
         aUtil.itemActionsClick(instance, fakeEvent, action, itemData);
         assert.isTrue(stopPropagationCalled);
         assert.isTrue(notifyCalled);
      });

      it('itemActionClick menu', function() {
         var
            fakeEvent = {
               stopPropagation: sandbox.stub()
            },
            action = {
               _isMenu: true
            },
            itemData = {
               item: 'test'
            },
            instance = {
               _notify: sandbox.stub()
            };

         aUtil.itemActionsClick(instance, fakeEvent, action, itemData, {}, false);
         assert.isTrue(instance._notify.withArgs('menuActionsClick', [itemData, fakeEvent, false]).calledOnce);
         assert.isTrue(fakeEvent.stopPropagation.calledOnce);
      });
      it('itemActionsClick', function() {
         var
            fakeNativeEvent = {},
            fakeHTMLElement = {
               className: 'controls-ListView__itemV'
            },
            fakeEvent = {
               stopPropagation: sandbox.stub(),
               nativeEvent: fakeNativeEvent
            },
            action = {},
            itemData = {
               item: 'test',
               index: 1
            },
            instance = {
               _notify: sandbox.stub(),
               _container: {
                  querySelector: sandbox.stub().withArgs('.controls-ListView__itemV').returns({
                     parentNode: {
                        children: [fakeHTMLElement]
                     }
                  })
               }
            };
         var fakeListModel = {
            getStartIndex: function() {
               return 1;
            }
         };

         aUtil.itemActionsClick(instance, fakeEvent, action, itemData, fakeListModel, false);
         assert.isTrue(instance._notify.withArgs('actionClick', [action, itemData.item, fakeHTMLElement]).calledOnce);
         assert.isTrue(fakeEvent.stopPropagation.calledOnce);
      });
   });
});
