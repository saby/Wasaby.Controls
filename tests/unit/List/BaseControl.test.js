/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/BaseControl',
   'Controls/List/resources/utils/ItemsUtil',
   'Types/source',
   'Types/collection',
   'Controls/list',
   'Controls/List/Tree/TreeViewModel',
   'Controls/Utils/Toolbar',
   'Core/Deferred',
   'Core/core-instance',
   'Env/Env',
   'Core/core-clone',
   'Types/entity',
   'Core/polyfill/PromiseAPIDeferred'
], function(BaseControl, ItemsUtil, sourceLib, collection, lists, TreeViewModel, tUtil, cDeferred, cInstance, Env, clone, entity) {
   describe('Controls.List.BaseControl', function() {
      var data, result, source, rs, sandbox;
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
               type: 2,
               'parent@': true
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
         source = new sourceLib.Memory({
            idProperty: 'id',
            data: data,
            filter: function (item, filter) {
               var result = true;

               if (filter['id'] && filter['id'] instanceof Array) {
                  result = filter['id'].indexOf(item.get('id')) !== -1;
               }

               return result;
            }

         });
         rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });
         sandbox = sinon.createSandbox();
      });
      afterEach(function() {
         sandbox.restore();
      });
      it('life cycle', function(done) {
         var dataLoadFired = false;
         var filter = {
            1: 1,
            2: 2
         };
         var cfg = {
            viewName: 'Controls/List/ListView',
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            source: source,
            filter: filter
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         var mountResult = ctrl._beforeMount(cfg);
         assert.isTrue(!!mountResult.addCallback, '_beforeMount doesn\'t return deferred');

         assert.isTrue(!!ctrl._sourceController, '_dataSourceController wasn\'t created before mounting');
         assert.deepEqual(filter, ctrl._options.filter, 'incorrect filter before mounting');

         // received state 3'rd argument
         mountResult = ctrl._beforeMount(cfg, {}, rs);
         assert.isTrue(!!mountResult.addCallback, '_beforeMount doesn\'t return deferred');

         assert.isTrue(!!ctrl._sourceController, '_dataSourceController wasn\'t created before mounting');
         assert.deepEqual(filter, ctrl._options.filter, 'incorrect filter before mounting');

         // создаем новый сорс
         var oldSourceCtrl = ctrl._sourceController;

         source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var filter2 = { 3: 3 };
         cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            dataLoadCallback: function() {
               dataLoadFired = true;
            },
            viewModelConstructor: TreeViewModel,
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            filter: filter2
         };

         // сорс грузит асинхронно
         setTimeout(function() {
            assert.equal(ctrl._items, ctrl.getViewModel().getItems());
            ctrl._beforeUpdate(cfg);

            // check saving loaded items after new viewModelConstructor
            // https://online.sbis.ru/opendoc.html?guid=72ff25df-ff7a-4f3d-8ce6-f19a666cbe98
            assert.equal(ctrl._items, ctrl.getViewModel().getItems());
            assert.isTrue(ctrl._sourceController !== oldSourceCtrl, '_dataSourceController wasn\'t changed before updating');
            assert.deepEqual(filter, ctrl._options.filter, 'incorrect filter before updating');
            ctrl.saveOptions(cfg);
            assert.deepEqual(filter2, ctrl._options.filter, 'incorrect filter after updating');
            assert.equal(ctrl._viewModelConstructor, TreeViewModel);
            assert.isTrue(cInstance.instanceOfModule(ctrl._listViewModel, 'Controls/_treeGrid/Tree/TreeViewModel'));
            setTimeout(function() {
               assert.isTrue(dataLoadFired, 'dataLoadCallback is not fired');
               ctrl._children.listView = {
                  getItemsContainer: function () {
                     return {
                        children: []
                     }
                  }
               };
               ctrl._afterUpdate({});
               ctrl._beforeUnmount();
               done();
            }, 100);
         }, 1);
      });

      it('should set itemsContainer in VS if null', function () {
         var cfg = {
            viewName: 'Controls/List/ListView',
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            navigation: {
               view: 'infinity'
            },
            virtualScrolling: true,
            viewModelConstructor: lists.ListViewModel,
            source: source
         };
         var itemsContainer = {
            qwe: 123
         },
             ctrl = new BaseControl(cfg);

         assert.isUndefined(ctrl._virtualScroll);
         ctrl._beforeMount(cfg);
         assert.isTrue(!!ctrl._virtualScroll);

         ctrl._virtualScroll.updateItemsSizes = function(){};
         ctrl._children.listView = {
            getItemsContainer: function() {
               return itemsContainer;
            }
         };

         assert.isUndefined(ctrl._virtualScroll.ItemsContainer);
         ctrl._viewResize();
         assert.equal(ctrl._virtualScroll.ItemsContainer, itemsContainer);
      });

      it('beforeMount: right indexes with virtual scroll and receivedState', function () {
         var cfg = {
            viewName: 'Controls/List/ListView',
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            navigation: {
               view: 'infinity'
            },
            virtualScrolling: true,
            viewModelConstructor: lists.ListViewModel,
            source: source
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         return new Promise(function (resolve, reject) {
            ctrl._beforeMount(cfg,null, [{id:1, title: 'qwe'}]);
            setTimeout(function () {
               assert.equal(ctrl.getViewModel().getStartIndex(), 0);
               // assert.equal(ctrl.getViewModel().getStopIndex(), 1);
               resolve();
            }, 10);
         });
      });

      it('_private::getSortingOnChange', function() {
         var getEmptySorting = function() {
            return [];
         };
         var getSortingASC = function() {
            return [{test: 'ASC'}];
         };
         var getSortingDESC = function() {
            return [{test: 'DESC'}];
         };
         var getMultiSorting = function() {
            return [{test: 'DESC'}, {test2: 'DESC'}];
         };

         assert.deepEqual(BaseControl._private.getSortingOnChange(getEmptySorting(), 'test'), getSortingDESC());
         assert.deepEqual(BaseControl._private.getSortingOnChange(getSortingDESC(), 'test'), getSortingASC());
         assert.deepEqual(BaseControl._private.getSortingOnChange(getSortingASC(), 'test'), getEmptySorting());
         assert.deepEqual(BaseControl._private.getSortingOnChange(getMultiSorting(), 'test', 'single'), getSortingDESC());
      });


      it('errback to callback', function(done) {
         var source = new sourceLib.Memory({
            data: [{
               id: 11,
               key: 1,
               val: 'first'
            }, {
               id: 22,
               key: 2,
               val: 'second'
            }]
         });

         var cfg = {
            keyProperty: 'key',
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'key'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'key'
            },
            viewModelConstructor: lists.ListViewModel
         };

         var ctrl = new BaseControl(cfg);


         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // waiting for first load
         setTimeout(function() {
            assert.equal(ctrl._items.getIdProperty(), cfg.keyProperty);

            // emulate loading error
            ctrl._sourceController.load = function() {
               var def = new cDeferred();
               def.errback();
               return def;
            };

            BaseControl._private.reload(ctrl, ctrl._options).addCallback(function() {
               done();
            }).addErrback(function() {
               assert.isTrue(false, 'reload() returns errback');
               done();
            });
         }, 100);
      });


      it('_needScrollCalculation', function(done) {
         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var dataLoadFired = false;

         var cfg = {
            viewName: 'Controls/List/ListView',
            dataLoadCallback: function() {
               dataLoadFired = true;
            },
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {}
         };

         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);
         assert.isFalse(ctrl._needScrollCalculation, 'Wrong _needScrollCalculation value after mounting');

         cfg = {
            viewName: 'Controls/List/ListView',
            dataLoadCallback: function() {
               dataLoadFired = true;
            },
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               view: 'infinity'
            }
         };
         setTimeout(function() {
            ctrl._beforeUpdate(cfg);
            assert.isTrue(ctrl._needScrollCalculation, 'Wrong _needScrollCalculation value after updating');
            done();
         }, 1);

         ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);
         assert.isTrue(ctrl._needScrollCalculation, 'Wrong _needScrollCalculation value after mounting');
      });

      it('loadToDirection down', function(done) {
         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var dataLoadFired = false;

         var beforeLoadToDirectionCalled = false;

         var cfg = {
            viewName: 'Controls/List/ListView',
            dataLoadCallback: function() {
               dataLoadFired = true;
            },
            beforeLoadToDirectionCallback: function() {
               beforeLoadToDirectionCalled = true;
            },
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            }
         };

         var ctrl = new BaseControl(cfg);


         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         setTimeout(function() {
            BaseControl._private.loadToDirection(ctrl, 'down');
            setTimeout(function() {
               assert.equal(6, BaseControl._private.getItemsCount(ctrl), 'Items wasn\'t load');
               assert.isTrue(dataLoadFired, 'dataLoadCallback is not fired');
               assert.isTrue(beforeLoadToDirectionCalled, 'beforeLoadToDirectionCallback is not called.');
               done();
            }, 100);
         }, 100);
      });

      it('Navigation demand', function(done) {
         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var dataLoadFired = false;

         var cfg = {
            viewName: 'Controls/List/ListView',
            dataLoadCallback: function() {
               dataLoadFired = true;
            },
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               view: 'demand',
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            }
         };

         var ctrl = new BaseControl(cfg);


         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         setTimeout(function() {
            assert.isTrue(ctrl._shouldDrawFooter, 'Failed draw footer on first load.');
            assert.equal(ctrl._loadMoreCaption, 3, 'Failed draw footer on first load.');

            BaseControl._private.loadToDirection(ctrl, 'down');
            setTimeout(function() {
               assert.isFalse(ctrl._shouldDrawFooter, 'Failed draw footer on second load.');

               assert.equal(6, BaseControl._private.getItemsCount(ctrl), 'Items wasn\'t load');
               assert.isTrue(dataLoadFired, 'dataLoadCallback is not fired');
               done();
            }, 100);
         }, 100);
      });

      it('Navigation position', function() {
         return new Promise(function(resolve, reject) {
            var
               ctrl,
               source = new sourceLib.Memory({
                  idProperty: 'id',
                  data: data,
                  filter: function() {
                     return true;
                  }
               }),
               cfg = {
                  viewName: 'Controls/List/ListView',
                  itemsReadyCallback: function(items) {
                     setTimeout(function() {
                        var
                           newItem = items.at(items.getCount() - 1).clone();
                        newItem.set('id', 777);
                        items.add(newItem);
                        try {
                           assert.deepEqual(ctrl._sourceController._queryParamsController._afterPosition, [777]);
                           resolve();
                        } catch (e) {
                           reject(e);
                        }
                     });
                  },
                  source: source,
                  viewConfig: {
                     keyProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     keyProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  navigation: {
                     source: 'position',
                     sourceConfig: {
                        field: 'id',
                        position: 0,
                        direction: 'after',
                        limit: 20
                     }
                  }
               };

            ctrl = new BaseControl(cfg);
            ctrl.saveOptions(cfg);
            ctrl._beforeMount(cfg);
         });
      });

      it('prepareFooter', function() {
         var
            tests = [
               {
                  data: [
                     {},
                     undefined,
                     {}
                  ],
                  result: {
                     _shouldDrawFooter: false
                  }
               },
               {
                  data: [
                     {},
                     {},
                     {}
                  ],
                  result: {
                     _shouldDrawFooter: false
                  }
               },
               {
                  data: [
                     {},
                     { view: 'page' },
                     {}
                  ],
                  result: {
                     _shouldDrawFooter: false
                  }
               },
               {
                  data: [
                     {},
                     { view: 'demand' },
                     {
                        hasMoreData: function() {
                           return false;
                        }
                     }
                  ],
                  result: {
                     _shouldDrawFooter: false
                  }
               },
               {
                  data: [
                     {},
                     { view: 'demand' },
                     {
                        hasMoreData: function() {
                           return true;
                        },
                        getLoadedDataCount: function() {
                        },
                        getAllDataCount: function() {
                           return true;
                        }
                     }
                  ],
                  result: {
                     _shouldDrawFooter: true,
                     _loadMoreCaption: '...'
                  }
               },
               {
                  data: [
                     {},
                     { view: 'demand' },
                     {
                        hasMoreData: function() {
                           return true;
                        },
                        getLoadedDataCount: function() {
                           return 5;
                        },
                        getAllDataCount: function() {
                           return true;
                        }
                     }
                  ],
                  result: {
                     _shouldDrawFooter: true,
                     _loadMoreCaption: '...'
                  }
               },
               {
                  data: [
                     {},
                     { view: 'demand' },
                     {
                        hasMoreData: function() {
                           return true;
                        },
                        getLoadedDataCount: function() {
                           return 5;
                        },
                        getAllDataCount: function() {
                           return 10;
                        }
                     }
                  ],
                  result: {
                     _shouldDrawFooter: true,
                     _loadMoreCaption: 5
                  }
               }
            ];
         tests.forEach(function(test, index) {
            BaseControl._private.prepareFooter.apply(null, test.data);
            assert.deepEqual(test.data[0], test.result, 'Invalid prepare footer on step #' + index);
         });
      });

      it('virtualScrollCalculation on list change', function() {
         var callBackCount = 0;
         var cfg = {
                viewName: 'Controls/List/ListView',
                viewConfig: {
                   idProperty: 'id'
                },
                virtualScrolling: true,
                viewModelConfig: {
                   items: [],
                   idProperty: 'id'
                },
                viewModelConstructor: lists.ListViewModel,
                markedKey: 0,
                source: source,
                navigation: {
                   view: 'infinity'
                }
             },
             instance = new BaseControl(cfg),
             itemData = {
                key: 1
             };

         instance.saveOptions(cfg);
         instance._beforeMount(cfg);

         var vm = instance.getViewModel();
         vm.getCount = function() {
            return 2;
         };
         assert.equal(0, instance.getVirtualScroll()._itemsHeights.length);

         vm._notify('onListChange', 'collectionChanged', collection.IObservable.ACTION_ADD, [1,2], 0, [], null);
         assert.equal(2, instance.getVirtualScroll()._itemsHeights.length);
         assert.equal(0, instance.getVirtualScroll().ItemsIndexes.start);
         assert.equal(2, instance.getVirtualScroll().ItemsIndexes.stop);

         vm.getCount = function() {
            return 1;
         };
         vm._notify('onListChange', 'collectionChanged', collection.IObservable.ACTION_REMOVE, [], null, [1], 1);
         assert.equal(1, instance.getVirtualScroll()._itemsHeights.length);
         assert.equal(0, instance.getVirtualScroll().ItemsIndexes.start);
         assert.equal(1, instance.getVirtualScroll().ItemsIndexes.stop);

         vm.getCount = function() {
            return 5;
         };
         vm._notify('onListChange', 'collectionChanged', collection.IObservable.ACTION_RESET, [1,2,3,4,5], 0, [1], 0);
         assert.equal(0, instance.getVirtualScroll()._itemsHeights.length);
         assert.equal(0, instance.getViewModel()._startIndex);
         assert.equal(5, instance.getViewModel()._stopIndex);
      });

      it('enterHandler', function () {
        var notified = false;

         // Without marker
         BaseControl._private.enterHandler({
            getViewModel: function () {
               return {
                  getMarkedItem: function () {
                     return null;
                  }
               }
            },
            _notify: function (e, item, options) {
               notified = true;
            }
         });
         assert.isFalse(notified);

         var myMarkedItem = {qwe: 123};
         // With marker
         BaseControl._private.enterHandler({
            getViewModel: function () {
               return {
                  getMarkedItem: function () {
                     return {
                        getContents: function () {
                           return myMarkedItem;
                        }
                     };
                  }
               }
            },
            _notify: function (e, item, options) {
               notified = true;
               assert.equal(e, 'itemClick');
               assert.deepEqual(item, [myMarkedItem]);
               assert.deepEqual(options, { bubbling: true });
            }
         });
         assert.isTrue(notified);
      });

      it('loadToDirection up', function(done) {
         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 1,
                  hasMore: false
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         setTimeout(function() {
            BaseControl._private.loadToDirection(ctrl, 'up');
            setTimeout(function() {
               assert.equal(6, BaseControl._private.getItemsCount(ctrl), 'Items wasn\'t load');
               done();
            }, 100);
         }, 100);
      });

      it('items should get loaded when a user scrolls to the bottom edge of the list', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               view: 'infinity',
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
         setTimeout(function() {
            /**
             * _beforeMount will load some items, so _loadedItems will get set. Normally, it will reset in _afterUpdate, but since we don't have lifecycle in tests,
             * we'll reset it here manually.
             */
            ctrl._loadedItems = null;

            BaseControl._private.onScrollLoadEdge(ctrl, 'down');
            setTimeout(function() {
               assert.equal(6, ctrl._listViewModel.getCount(), 'Items weren\\\'t loaded');
               done();
            }, 100);
         }, 100);
      });

      it('scrollLoadStarted MODE', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               view: 'infinity',
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
         setTimeout(function() {
            /**
             * _beforeMount will load some items, so _loadedItems will get set. Normally, it will reset in _afterUpdate, but since we don't have lifecycle in tests,
             * we'll reset it here manually.
             */
            ctrl._loadedItems = null;

            BaseControl._private.onScrollLoadEdgeStart(ctrl, 'down');
            BaseControl._private.checkLoadToDirectionCapability(ctrl);
            setTimeout(function() {
               //TODO remove after https://online.sbis.ru/opendoc.html?guid=006711c6-917b-4028-8484-369361546446
               try {
                  assert.equal(6, ctrl._listViewModel.getCount(), 'Items wasn\'t load with started "scrollloadmode"');
                  BaseControl._private.onScrollLoadEdgeStop(ctrl, 'down');
                  BaseControl._private.checkLoadToDirectionCapability(ctrl);

                  setTimeout(function() {
                     try {
                        assert.equal(6, ctrl._listViewModel.getCount(), 'Items was load without started "scrollloadmode"');
                     }
                     catch(e) {
                        done(e);
                     }

                     done();
                  }, 100);
               }
               catch (e) {
                  done(e);
               }

            }, 100);
         }, 100);
      });
      /*
      it('processLoadError', function() {
         var cfg = {};
         var ctrl = new BaseControl(cfg);
         var error = { message: 'error' };

         result = false;
         var userErrback = function(error) {
            result = error;
         };
         BaseControl._private.processLoadError(ctrl, error, userErrback);

         assert.equal(error, result, 'UserErrback doesn\'t return instance of Error');
      });
      */

      it('indicator', function() {
         var cfg = {};
         var ctrl = new BaseControl(cfg);

         BaseControl._private.showIndicator(ctrl);
         assert.equal(ctrl._loadingState, 'all', 'Wrong loading state');
         assert.equal(ctrl._loadingIndicatorState, 'all', 'Wrong loading state');
         assert.isTrue(!!ctrl._loadingIndicatorTimer, 'all', 'Loading timer should created');

         // картинка должен появляться через 2000 мс, проверим, что её нет сразу
         assert.isFalse(!!ctrl._showLoadingIndicatorImage, 'Wrong loading indicator image state');

         // искуственно покажем картинку
         ctrl._showLoadingIndicatorImage = true;

         BaseControl._private.showIndicator(ctrl);
         assert.isTrue(ctrl._loadingIndicatorTimer === ctrl._loadingIndicatorTimer, 'all', 'Loading timer created one more tile');

         // и вызовем скрытие
         BaseControl._private.hideIndicator(ctrl);
         assert.equal(ctrl._loadingState, null, 'Wrong loading state');
         assert.equal(ctrl._loadingIndicatorState, null, 'Wrong loading indicator state');
         assert.isFalse(!!ctrl._showLoadingIndicatorImage, 'Wrong loading indicator image state');
         assert.isFalse(!!ctrl._loadingIndicatorTimer);
      });

      it('scrollToEdge_load', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);


         // два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
         setTimeout(function() {
            BaseControl._private.scrollToEdge(ctrl, 'down');
            setTimeout(function() {
               assert.equal(3, ctrl._listViewModel.getCount(), 'Items wasn\'t load');
               done();
            }, 100);
         }, 100);
      });

      it('ScrollPagingController', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               view: 'infinity',
               source: 'page',
               viewConfig: {
                  pagingMode: 'direct'
               },
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            },
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // эмулируем появление скролла
         BaseControl._private.onScrollShow(ctrl);

         // скроллпэйджиг контроллер создается асинхронном
         setTimeout(function() {
            assert.isTrue(!!ctrl._scrollPagingCtr, 'ScrollPagingController wasn\'t created');


            // прокручиваем к низу, проверяем состояние пэйджинга
            BaseControl._private.handleListScroll(ctrl, 300, 'down');
            assert.deepEqual({
               stateBegin: 'normal',
               statePrev: 'normal',
               stateNext: 'normal',
               stateEnd: 'normal'
            }, ctrl._pagingCfg, 'Wrong state of paging arrows after scroll to bottom');

            BaseControl._private.handleListScroll(ctrl, 200, 'middle');
            assert.deepEqual({
               stateBegin: 'normal',
               statePrev: 'normal',
               stateNext: 'normal',
               stateEnd: 'normal'
            }, ctrl._pagingCfg, 'Wrong state of paging arrows after scroll');

            BaseControl._private.onScrollHide(ctrl);
            assert.deepEqual({stateBegin: 'normal', statePrev: 'normal', stateNext: 'normal', stateEnd: 'normal'}, ctrl._pagingCfg, 'Wrong state of paging after scrollHide');
            assert.isFalse(ctrl._pagingVisible, 'Wrong state _pagingVisible after scrollHide');

            BaseControl._private.handleListScroll(ctrl, 200, 'middle');

            setTimeout(function() {
               assert.isFalse(ctrl._pagingVisible);
               done();
            }, 100);

         }, 100);
      });

      it('scrollHide/scrollShow base control state', function() {
         var cfg = {
            navigation: {
               view: 'infinity',
               source: 'page',
               viewConfig: {
                  pagingMode: 'direct'
               },
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  hasMore: false
               }
            }
         };
         var baseControl = new BaseControl(cfg);
         baseControl.saveOptions(cfg);

         BaseControl._private.onScrollHide(baseControl);
         assert.equal(baseControl._loadOffset, 0);
         assert.isFalse(baseControl._isScrollShown);

         BaseControl._private.onScrollShow(baseControl);
         assert.equal(baseControl._loadOffset, 100);
         assert.isTrue(baseControl._isScrollShown);
      });

      it('scrollToEdge without load', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  hasMore: false
               },
               view: 'infinity',
               viewConfig: {
                  pagingMode: 'direct'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // дождемся загрузки списка
         setTimeout(function() {
            result = false;
            ctrl._notify = function(event, dir) {
               result = dir;
            };

            // прокручиваем к низу, проверяем состояние пэйджинга
            BaseControl._private.scrollToEdge(ctrl, 'down');
            assert.equal(result, 'bottom', 'List wasn\'t scrolled to bottom');

            BaseControl._private.scrollToEdge(ctrl, 'up');
            assert.equal(result, 'top', 'List wasn\'t scrolled to top');

            done();
         }, 100);
      });

      it('__onPagingArrowClick', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  hasMore: false
               },
               view: 'infinity',
               viewConfig: {
                  pagingMode: 'direct'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // эмулируем появление скролла
         BaseControl._private.onScrollShow(ctrl);

         // скроллпэйджиг контроллер создается асинхронном
         setTimeout(function() {
            ctrl._notify = function(eventName, type) {
               result = type;
            };

            // прокручиваем к низу, проверяем состояние пэйджинга
            result = false;
            ctrl.__onPagingArrowClick({}, 'End');
            assert.equal('bottom', result[0], 'Wrong state of scroll after clicking to End');

            // прокручиваем к верху, проверяем состояние пэйджинга
            ctrl.__onPagingArrowClick({}, 'Begin');
            assert.equal('top', result[0], 'Wrong state of scroll after clicking to Begin');

            // прокручиваем страницу вверх и вниз, проверяем состояние пэйджинга
            ctrl.__onPagingArrowClick({}, 'Next');
            assert.equal('pageDown', result[0], 'Wrong state of scroll after clicking to Next');

            ctrl.__onPagingArrowClick({}, 'Prev');
            assert.equal('pageUp', result[0], 'Wrong state of scroll after clicking to Prev');

            done();
         }, 100);
      });

      it('__onEmitScroll', function(done) {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  hasMore: false
               },
               view: 'infinity',
               viewConfig: {
                  pagingMode: 'direct'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // эмулируем появление скролла
         BaseControl._private.onScrollShow(ctrl);

         // скроллпэйджиг контроллер создается асинхронном
         setTimeout(function() {
            ctrl._notify = function(eventName, type) {
               result = type;
            };

            // прогоняем все варианты, без проверки, т.к. все ветки уже тестируются выше
            ctrl.__onEmitScroll({}, 'loadTop');
            ctrl.__onEmitScroll({}, 'loadBottom');
            ctrl.__onEmitScroll({}, 'listTop');
            ctrl.__onEmitScroll({}, 'listBottom');
            ctrl.__onEmitScroll({}, 'scrollMove', { scrollTop: 200 });
            ctrl.__onEmitScroll({}, 'canScroll');
            ctrl.__onEmitScroll({}, 'cantScroll');

            ctrl.reload();

            done();
         }, 100);
      });

      it('__needShowEmptyTemplate', () => {
         let baseControlOptions = {
            viewModelConstructor: lists.ListViewModel,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id'
            },
            viewName: 'Controls/List/ListView',
            source: source,
            emptyTemplate: null
         };

         let baseControl = new BaseControl(baseControlOptions);
         baseControl.saveOptions(baseControlOptions);

         return new Promise(function(resolve) {
            baseControl._beforeMount(baseControlOptions).addCallback(function(result) {
               assert.isFalse(!!baseControl.__needShowEmptyTemplate(baseControl._options.emptyTemplate, baseControl._listViewModel, baseControl._loadingState));

               baseControl._listViewModel.getItems().clear();
               baseControl._options.emptyTemplate = {};
               assert.isTrue(!!baseControl.__needShowEmptyTemplate(baseControl._options.emptyTemplate, baseControl._listViewModel, baseControl._loadingState));

               baseControl._loadingState = 'down';
               assert.isFalse(!!baseControl.__needShowEmptyTemplate(baseControl._options.emptyTemplate, baseControl._listViewModel, baseControl._loadingState));

               baseControl._loadingState = 'all';
               assert.isTrue(!!baseControl.__needShowEmptyTemplate(baseControl._options.emptyTemplate, baseControl._listViewModel, baseControl._loadingState));

               baseControl._listViewModel._editingItemData = {};
               assert.isFalse(!!baseControl.__needShowEmptyTemplate(baseControl._options.emptyTemplate, baseControl._listViewModel, baseControl._loadingState));
               resolve();

               return result;
            });
         });
      });

      it('reload with changing source/navig/filter should call scroll to start', function() {

         var
             lnSource = new sourceLib.Memory({
                idProperty: 'id',
                data: data
             }),
             lnSource2 = new sourceLib.Memory({
                idProperty: 'id',
                data: [{
                   id: 4,
                   title: 'Четвертый',
                   type: 1
                },
                   {
                      id: 5,
                      title: 'Пятый',
                      type: 2
                   }]
             }),
             lnSource3 = new sourceLib.Memory({
                idProperty: 'id',
                data: []
             }),
             lnCfg = {
                viewName: 'Controls/List/ListView',
                source: lnSource,
                keyProperty: 'id',
                markedKey: 3,
                viewModelConstructor: lists.ListViewModel
             },
             lnBaseControl = new BaseControl(lnCfg);

         lnBaseControl.saveOptions(lnCfg);
         lnBaseControl._beforeMount(lnCfg);

         assert.equal(lnBaseControl._keyDisplayedItem, null);

         return new Promise(function (resolve) {
            setTimeout(function () {
               BaseControl._private.reload(lnBaseControl, lnCfg);
               setTimeout(function () {
                  assert.equal(lnBaseControl._keyDisplayedItem, null);
                  lnCfg = clone(lnCfg);
                  lnCfg.source = lnSource2;
                  lnBaseControl._isScrollShown = true;
                  lnBaseControl._beforeUpdate(lnCfg).addCallback(function() {
                     assert.equal(lnBaseControl._keyDisplayedItem, 4);
                     lnBaseControl._keyDisplayedItem = null;

                     lnCfg = clone(lnCfg);
                     lnCfg.source = lnSource3;
                     lnBaseControl._beforeUpdate(lnCfg).addCallback(function(res) {
                        assert.equal(lnBaseControl._keyDisplayedItem, null);
                        resolve();
                        return res;
                     });
                  });
               }, 10);
            },10);
         });
      });

      it('List navigation by keys and after reload', function(done) {
         // mock function working with DOM
         BaseControl._private.scrollToItem = function() {};

         var
            stopImmediateCalled = false,
            preventDefaultCalled = false,

            lnSource = new sourceLib.Memory({
               idProperty: 'id',
               data: data
            }),
            lnCfg = {
               viewName: 'Controls/List/ListView',
               source: lnSource,
               keyProperty: 'id',
               markedKey: 1,
               viewModelConstructor: lists.ListViewModel
            },
            lnCfg2 = {
               viewName: 'Controls/List/ListView',
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: [{
                     id: 'firstItem',
                     title: 'firstItem'
                  }]
               }),
               keyProperty: 'id',
               markedKey: 1,
               viewModelConstructor: lists.ListViewModel
            },
            lnBaseControl = new BaseControl(lnCfg);

         lnBaseControl.saveOptions(lnCfg);
         lnBaseControl._beforeMount(lnCfg);

         setTimeout(function() {
            assert.equal(lnBaseControl.getViewModel().getMarkedKey(), 1, 'Invalid initial value of markedKey.');
            lnBaseControl.reload();
            setTimeout(function () {
               assert.equal(lnBaseControl.getViewModel().getMarkedKey(), 1, 'Invalid value of markedKey after reload.');

               lnBaseControl._onViewKeyDown({
                  stopImmediatePropagation: function() {
                     stopImmediateCalled = true;
                  },
                  nativeEvent: {
                     keyCode: Env.constants.key.down
                  }
               });
               assert.equal(lnBaseControl.getViewModel().getMarkedKey(), 2, 'Invalid value of markedKey after press "down".');

               lnBaseControl._children = {
                  selectionController: {
                     onCheckBoxClick: function() {
                     }
                  }
               };
               lnBaseControl._onViewKeyDown({
                  stopImmediatePropagation: function() {
                     stopImmediateCalled = true;
                  },
                  nativeEvent: {
                     keyCode: Env.constants.key.space
                  },
                  preventDefault: function() {
                     preventDefaultCalled = true;
                  }
               });
               assert.equal(lnBaseControl.getViewModel().getMarkedKey(), 3, 'Invalid value of markedKey after press "space".');
               assert.isTrue(preventDefaultCalled);

               lnBaseControl._onViewKeyDown({
                  stopImmediatePropagation: function() {
                     stopImmediateCalled = true;
                  },
                  nativeEvent: {
                     keyCode: Env.constants.key.up
                  }
               });
               assert.equal(lnBaseControl.getViewModel().getMarkedKey(), 2, 'Invalid value of markedKey after press "up".');

               assert.isTrue(stopImmediateCalled, 'Invalid value "stopImmediateCalled"');

               // reload with new source (first item with id "firstItem")
               lnBaseControl._beforeUpdate(lnCfg2);

               setTimeout(function() {
                  assert.equal(lnBaseControl.getViewModel().getMarkedKey(), 'firstItem', 'Invalid value of markedKey after set new source.');
                  done();
               }, 1);
            }, 1);
         }, 1);
      });

      it('_onCheckBoxClick', function() {
         var rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new sourceLib.Memory({
            idProperty: 'id',
            data: data
         });

         var cfg = {
            selectedKeys: [1, 3],
            viewName: 'Controls/List/ListView',
            source: source,
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            },
            viewModelConstructor: lists.ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  hasMore: false
               },
               view: 'infinity',
               viewConfig: {
                  pagingMode: 'direct'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);
         ctrl._notify = function(e, args) {
            assert.equal(e, 'checkboxClick');
            assert.equal(args[0], 2);
            assert.equal(args[1], 0);
         };
         ctrl._children = {
            selectionController: {
               onCheckBoxClick: function(key, status) {
                  assert.equal(key, 2);
                  assert.equal(status, 0);
               }
            }
         };
         ctrl._onCheckBoxClick({}, 2, 0);
         ctrl._notify = function(e, args) {
            assert.equal(e, 'checkboxClick');
            assert.equal(args[0], 1);
            assert.equal(args[1], 1);
         };
         ctrl._children = {
            selectionController: {
               onCheckBoxClick: function(key, status) {
                  assert.equal(key, 1);
                  assert.equal(status, 1);
               }
            }
         };
         ctrl._onCheckBoxClick({}, 1, 1);
      });

      it('_onItemClick', function() {
         var cfg = {
            keyProperty: 'id',
            viewName: 'Controls/List/ListView',
            source: source,
            items: rs,
            viewModelConstructor: lists.ListViewModel
         };
         var originalEvent = {
            target: {
               closest: function(selector) {
                  return selector === '.js-controls-ListView__checkbox';
               },
               getAttribute: function(attrName) {
                  return attrName === 'contenteditable' ? 'true' : '';
               }
            }
         };
         var stopPropagationCalled = false;
         var event = {
            stopPropagation: function() {
               stopPropagationCalled = true;
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);
         ctrl._onItemClick(event, rs.at(2), originalEvent);
         assert.isTrue(stopPropagationCalled);
         assert.equal(rs.at(2), ctrl._listViewModel.getMarkedItem().getContents());
      });

      describe('EditInPlace', function() {
         it('beginEdit', function() {
            var opt = {
               test: 'test'
            };
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._children = {
               editInPlace: {
                  beginEdit: function(options) {
                     assert.equal(options, opt);
                     return cDeferred.success();
                  }
               }
            };
            var result = ctrl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginAdd', function() {
            var opt = {
               test: 'test'
            };
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._children = {
               editInPlace: {
                  beginAdd: function(options) {
                     assert.equal(options, opt);
                     return cDeferred.success();
                  }
               }
            };
            var result = ctrl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit', function() {
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._children = {
               editInPlace: {
                  cancelEdit: function() {
                     return cDeferred.success();
                  }
               }
            };
            var result = ctrl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit, readOnly: true', function() {
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               },
               readOnly: true
            };
            var ctrl = new BaseControl(cfg);
            ctrl.saveOptions(cfg);
            var result = ctrl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._children = {
               editInPlace: {
                  commitEdit: function() {
                     return cDeferred.success();
                  }
               }
            };
            var result = ctrl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit, readOnly: true', function() {
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               },
               readOnly: true
            };
            var ctrl = new BaseControl(cfg);
            ctrl.saveOptions(cfg);
            var result = ctrl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('readOnly, beginEdit', function() {
            var opt = {
               test: 'test'
            };
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               },
               readOnly: true
            };
            var ctrl = new BaseControl(cfg);
            ctrl.saveOptions(cfg);
            var result = ctrl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('readOnly, beginAdd', function() {
            var opt = {
               test: 'test'
            };
            var cfg = {
               viewName: 'Controls/List/ListView',
               source: source,
               viewConfig: {
                  keyProperty: 'id'
               },
               viewModelConfig: {
                  items: rs,
                  keyProperty: 'id',
                  selectedKeys: [1, 3]
               },
               viewModelConstructor: lists.ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     hasMore: false
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               },
               readOnly: true
            };
            var ctrl = new BaseControl(cfg);
            ctrl.saveOptions(cfg);
            var result = ctrl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
      });

      it('_onAnimationEnd', function() {
         var setRightSwipedItemCalled = false;
         var ctrl = new BaseControl();
         ctrl._listViewModel = {
            setRightSwipedItem: function() {
               setRightSwipedItemCalled = true;
            }
         };
         ctrl._onAnimationEnd({
            nativeEvent: {
               animationName: 'test'
            }
         });
         assert.isFalse(setRightSwipedItemCalled);
         ctrl._onAnimationEnd({
            nativeEvent: {
               animationName: 'rightSwipe'
            }
         });
         assert.isTrue(setRightSwipedItemCalled);
      });

      it('_documentDragEnd', function() {
         var
            dragEnded,
            ctrl = new BaseControl();

         //dragend without deferred
         dragEnded = false;
         ctrl._documentDragEndHandler = function() {
            dragEnded = true;
         };
         ctrl._documentDragEnd();
         assert.isTrue(dragEnded);

         //dragend with deferred
         dragEnded = false;
         ctrl._dragEndResult = new cDeferred();
         ctrl._documentDragEnd();
         assert.isFalse(dragEnded);
         assert.isTrue(!!ctrl._loadingState);
         ctrl._dragEndResult.callback();
         assert.isTrue(dragEnded);
         assert.isFalse(!!ctrl._loadingState);

      });

      it('getSelectionForDragNDrop', function() {
         var selection;

         selection = BaseControl._private.getSelectionForDragNDrop([1, 2, 3], [], 4);
         assert.deepEqual(selection.selected, [4, 1, 2, 3]);
         assert.deepEqual(selection.excluded, []);

         selection = BaseControl._private.getSelectionForDragNDrop([1, 2, 3], [], 2);
         assert.deepEqual(selection.selected, [2, 1, 3]);
         assert.deepEqual(selection.excluded, []);

         selection = BaseControl._private.getSelectionForDragNDrop([1, 2, 3], [4], 3);
         assert.deepEqual(selection.selected, [3, 1, 2]);
         assert.deepEqual(selection.excluded, [4]);

         selection = BaseControl._private.getSelectionForDragNDrop([1, 2, 3], [4], 5);
         assert.deepEqual(selection.selected, [5, 1, 2, 3]);
         assert.deepEqual(selection.excluded, [4]);

         selection = BaseControl._private.getSelectionForDragNDrop([1, 2, 3], [4], 4);
         assert.deepEqual(selection.selected, [4, 1, 2, 3]);
         assert.deepEqual(selection.excluded, []);
      });

      describe('ItemActions', function() {
         var
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
         it('showActionsMenu context', function(done) {
            var callBackCount = 0;
            var cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               fakeEvent = {
                  type: 'itemcontextmenu'

               },
               childEvent = {
                  nativeEvent: {
                     preventDefault: function() {
                        callBackCount++;
                     }
                  },
                  stopImmediatePropagation: function() {
                     callBackCount++;
                  }
               },
               itemData = {
                  itemActions: { all: actions }
               };
            instance._children = {
               itemActionsOpener: {
                  open: function(args) {
                     callBackCount++;
                     assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'Types/collection:RecordSet'));
                     assert.equal(args.templateOptions.keyProperty, 'id');
                     assert.equal(args.templateOptions.parentProperty, 'parent');
                     assert.equal(args.templateOptions.nodeProperty, 'parent@');
                     assert.equal(itemData, instance._listViewModel._activeItem);
                     assert.isTrue(itemData.contextEvent);
                     assert.equal(callBackCount, 3);
                     done();
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
         });

         it('_onItemContextMenu', function() {
            var callBackCount = 0;
            var cfg = {
                  items: new collection.RecordSet({
                     rawData: [
                        { id: 1, title: 'item 1' },
                        { id: 2, title: 'item 2' }
                     ],
                     idProperty: 'id'
                  }),
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  markedKey: null,
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               fakeEvent = {
                  type: 'itemcontextmenu'
               },
               childEvent = {
                  nativeEvent: {
                     preventDefault: function() {
                        callBackCount++;
                     }
                  },
                  stopImmediatePropagation: function() {
                     callBackCount++;
                  }
               },
               itemData = {
                  key: 1
               };
            instance._children = {
               itemActionsOpener: {
                  open: function() {
                     callBackCount++;
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            assert.equal(instance.getViewModel()._markedKey, undefined);
            instance._onItemContextMenu(fakeEvent, itemData, childEvent, false);
            assert.equal(instance.getViewModel()._markedKey, 1);
            assert.equal(callBackCount, 0);
         });



         it('showActionsMenu context', function() {
            var callBackCount = 0;
            var cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               fakeEvent = {
                  type: 'itemcontextmenu'
               },
               childEvent = {
                  nativeEvent: {
                     preventDefault: function() {
                        callBackCount++;
                     }
                  },
                  stopImmediatePropagation: function() {
                     callBackCount++;
                  }
               },
               itemData = {};
            instance._children = {
               itemActionsOpener: {
                  open: function() {
                     callBackCount++;
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
            assert.equal(callBackCount, 0);
         });

         it('no showActionsMenu context without actions', function() {
            var callBackCount = 0;
            var cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               fakeEvent = {
                  type: 'itemcontextmenu'
               },
               itemData = {
                  itemActions: { all: [] }
               };
            instance._children = {
               itemActionsOpener: {
                  open: function() {
                     callBackCount++;
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData);
            assert.equal(callBackCount, 0); // проверяем что не открывали меню
         });

         it('showActionsMenu no context', function() {
            var callBackCount = 0;
            var
               cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               target = {
                  getBoundingClientRect: function() {
                     return {
                        bottom: 1,
                        height: 2,
                        left: 3,
                        right: 4,
                        top: 5,
                        width: 6
                     };
                  }
               },
               fakeEvent = {
                  type: 'click'

               },
               childEvent = {
                  target: target,
                  nativeEvent: {
                     preventDefault: function() {
                        callBackCount++;
                     }
                  },
                  stopImmediatePropagation: function() {
                     callBackCount++;
                  }
               },
               itemData = {
                  itemActions: { all: actions }
               };
            instance._children = {
               itemActionsOpener: {
                  open: function(args) {
                     callBackCount++;
                     assert.deepEqual(target.getBoundingClientRect(), args.target.getBoundingClientRect());
                     assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'Types/collection:RecordSet'));
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
            setTimeout(function() {
               assert.equal(itemData, instance._listViewModel._activeItem);
               assert.isFalse(itemData.contextEvent);
               assert.equal(callBackCount, 3);
            }, 100);
         });

         it('closeActionsMenu', function() {
            var callBackCount = 0;
            var
               cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               target = '123',
               fakeEvent = {
                  target: target,
                  type: 'click',
                  stopPropagation: function() {
                     callBackCount++;
                  }
               };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._children = {
               itemActionsOpener: {
                  close: function() {
                     callBackCount++;
                  }
               },
               swipeControl: {
                  closeSwipe: function() {
                     callBackCount++;
                  }
               }
            };
            instance._listViewModel._activeItem = {
               item: true
            };
            instance._container = {
               querySelector: function(selector) {
                  if (selector === '.controls-ListView__itemV') {
                     return {
                        parentNode: {
                           children: [{
                              className: ''
                           }]
                        }
                     };
                  }
               }
            };
            instance._closeActionsMenu({
               action: 'itemClick',
               event: fakeEvent,
               data: [{
                  getRawData: function() {
                     callBackCount++;
                     return {
                        handler: function() {
                           callBackCount++;
                        }
                     };
                  }
               }]
            });
            assert.equal(instance._listViewModel._activeItem, null);
            assert.equal(callBackCount, 5);
            assert.isFalse(instance._menuIsShown);
         });

         it('closeActionsMenu item with children', function() {
            var cfg = {
                  viewName: 'Controls/List/ListView',
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg);
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._listViewModel._activeItem = {
               item: true
            };
            instance._container = {
               querySelector: function(selector) {
                  if (selector === '.controls-ListView__itemV') {
                     return {
                        parentNode: {
                           children: [{
                              className: ''
                           }]
                        }
                     };
                  }
               }
            };
            instance._closeActionsMenu({
               action: 'itemClick',
               event: {
                  type: 'click',
                  stopPropagation: ()=>{}
               },
               data: [{
                  getRawData: function() {
                     return {
                        'parent@': true
                     };
                  }
               }]});
            assert.equal(instance._menuIsShown, null);
         });

         describe('_listSwipe animation', function() {
            var
               childEvent = {
                  nativeEvent: {
                     direction: 'right'
                  }
               },
               itemData = {
                  key: 1,
                  multiSelectStatus: false
               },
               instance;
            function initTest(multiSelectVisibility) {
               var
                  cfg = {
                     viewName: 'Controls/List/ListView',
                     viewConfig: {
                        idProperty: 'id'
                     },
                     viewModelConfig: {
                        items: rs,
                        idProperty: 'id'
                     },
                     viewModelConstructor: lists.ListViewModel,
                     source: source,
                     multiSelectVisibility: multiSelectVisibility,
                     selectedKeysCount: 1
                  };
               instance = new BaseControl(cfg);
               instance._children = {
                  itemActionsOpener: {
                     close: function() {}
                  }
               };
               instance.saveOptions(cfg);
               instance._beforeMount(cfg);
            }

            it('multiSelectVisibility: visible, should start animation', function() {
               initTest('visible');
               instance._listSwipe({}, itemData, childEvent);
               assert.equal(itemData, instance.getViewModel()._rightSwipedItem);
            });

            it('multiSelectVisibility: onhover, should start animation', function() {
               initTest('onhover');
               instance._listSwipe({}, itemData, childEvent);
               assert.equal(itemData, instance.getViewModel()._rightSwipedItem);
            });

            it('multiSelectVisibility: hidden, should not start animation', function() {
               initTest('hidden');
               instance._listSwipe({}, itemData, childEvent);
               assert.isNotOk(instance.getViewModel()._rightSwipedItem);
            });
         });
         describe('itemSwipe event', function() {
            var
               childEvent = {
                  nativeEvent: {
                     direction: 'right'
                  }
               },
               itemData = {
                  key: 1,
                  multiSelectStatus: false,
                  item: {}
               };
            it('list has item actions, event should not fire', function() {
               var
                  cfg = {
                     viewName: 'Controls/List/ListView',
                     viewConfig: {
                        idProperty: 'id'
                     },
                     viewModelConfig: {
                        items: rs,
                        idProperty: 'id'
                     },
                     viewModelConstructor: lists.ListViewModel,
                     source: source,
                     itemActions: []
                  },
                  instance = new BaseControl(cfg);
               instance._children = {
                  itemActionsOpener: {
                     close: function() {}
                  }
               };
               instance.saveOptions(cfg);
               instance._beforeMount(cfg);
               instance._notify = function(eventName) {
                  if (eventName === 'itemSwipe') {
                     throw new Error('itemSwipe event should not fire if the list has itemActions');
                  }
               };
               instance._listSwipe({}, itemData, childEvent);
            });

            it('list has multiselection, event should not fire', function() {
               var
                  cfg = {
                     viewName: 'Controls/List/ListView',
                     viewConfig: {
                        idProperty: 'id'
                     },
                     viewModelConfig: {
                        items: rs,
                        idProperty: 'id'
                     },
                     viewModelConstructor: lists.ListViewModel,
                     source: source,
                     selectedKeysCount: 1
                  },
                  instance = new BaseControl(cfg);
               instance._children = {
                  itemActionsOpener: {
                     close: function() {}
                  }
               };
               instance.saveOptions(cfg);
               instance._beforeMount(cfg);
               instance._notify = function(eventName) {
                  if (eventName === 'itemSwipe') {
                     throw new Error('itemSwipe event should not fire if the list has multiselection');
                  }
               };
               instance._listSwipe({}, itemData, childEvent);
            });

            it('list doesn\'t handle swipe, event should fire', function() {
               var
                  cfg = {
                     viewName: 'Controls/List/ListView',
                     viewConfig: {
                        idProperty: 'id'
                     },
                     viewModelConfig: {
                        items: rs,
                        idProperty: 'id'
                     },
                     viewModelConstructor: lists.ListViewModel,
                     source: source
                  },
                  instance = new BaseControl(cfg),
                  notifyCalled = false;
               instance._children = {
                  itemActionsOpener: {
                     close: function() {}
                  }
               };
               instance.saveOptions(cfg);
               instance._beforeMount(cfg);
               instance._notify = function(eventName, eventArgs, eventOptions) {
                  assert.equal(eventName, 'itemSwipe');
                  assert.deepEqual(eventArgs, [itemData.item, childEvent]);
                  notifyCalled = true;
               };
               instance._listSwipe({}, itemData, childEvent);
               assert.isTrue(notifyCalled);
            });
         });

         it('_listSwipe  multiSelectStatus = true', function(done) {
            var callBackCount = 0;
            var
               cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               itemData,
               childEvent = {
                  nativeEvent: {
                     direction: 'left'
                  }
               };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._children = {
                  itemActionsOpener: {
                     close: function() {
                        callBackCount++;
                     }
                  },
                  selectionController: {
                     onCheckBoxClick: function() {
                     }
                  }
               };
               instance._listViewModel.reset();
               instance._listViewModel.goToNext();
               itemData = instance._listViewModel.getCurrent();
               itemData.multiSelectVisibility = true;
               itemData.multiSelectStatus = true;

               instance._listSwipe({}, itemData, childEvent);
               assert.equal(callBackCount, 1);
               childEvent = {
                  nativeEvent: {
                     direction: 'right'
                  }
               };

               instance._listSwipe({}, itemData, childEvent);
               assert.equal(callBackCount, 2);
               assert.equal(itemData, instance._listViewModel._activeItem);
               done();
            });
            return done;
         });

         it('_listSwipe  multiSelectStatus = false', function(done) {
            var callBackCount = 0;
            var
               cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               itemData,
               childEvent = {
                  nativeEvent: {
                     direction: 'right'
                  }
               };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._children = {
                  itemActionsOpener: {
                     close: function() {
                        callBackCount++;
                     }
                  },
                  selectionController: {
                     onCheckBoxClick: function() {
                     }
                  }
               };
               instance._listViewModel.reset();
               instance._listViewModel.goToNext();
               itemData = instance._listViewModel.getCurrent();
               itemData.multiSelectVisibility = true;
               itemData.multiSelectStatus = false;
               instance._listSwipe({}, itemData, childEvent);
               assert.equal(callBackCount, 1);
               assert.equal(itemData, instance._listViewModel._activeItem);
               done();
            });
            return done;
         });

         it('_listSwipe, multiSelectStatus = true, item is swiped', function(done) {
            var callBackCount = 0;
            var
               cfg = {
                  viewName: 'Controls/List/ListView',
                  viewConfig: {
                     idProperty: 'id'
                  },
                  viewModelConfig: {
                     items: [],
                     idProperty: 'id'
                  },
                  viewModelConstructor: lists.ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               itemData,
               childEvent = {
                  nativeEvent: {
                     direction: 'right'
                  }
               };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._children = {
                  itemActionsOpener: {
                     close: function() {
                        callBackCount++;
                     }
                  }
               };
               instance._listViewModel.reset();
               instance._listViewModel.goToNext();
               itemData = instance._listViewModel.getCurrent();
               itemData.multiSelectVisibility = true;
               itemData.multiSelectStatus = true;
               itemData.isSwiped = true;

               instance._notify = function(eventName) {
                  if (eventName === 'checkboxClick') {
                     throw new Error('checkBoxClick shouldn\'t be called if the item is swiped');
                  }
               };

               instance._listSwipe({}, itemData, childEvent);
               assert.equal(callBackCount, 1);
               assert.equal(itemData, instance._listViewModel._activeItem);
               done();
            });
            return done;
         });

      });

      it('resolveIndicatorStateAfterReload', function() {
         var baseControlMock = {
            _needScrollCalculation: true,
            _sourceController: {hasMoreData: () => {return true;}},
            _forceUpdate: () => {}
         };
         var emptyList = new collection.List();
         var list = new collection.List({items: [{test: 'testValue'}]});

         BaseControl._private.resolveIndicatorStateAfterReload(baseControlMock, emptyList);
         assert.equal(baseControlMock._loadingState, 'down');

         BaseControl._private.resolveIndicatorStateAfterReload(baseControlMock, list);
         assert.isNull(baseControlMock._loadingState);

      });

      it('reloadItem', function() {
         var filter = {};
         var cfg = {
            viewName: 'Controls/List/ListView',
            viewConfig: {
               keyProperty: 'id'
            },
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: lists.ListViewModel,
            keyProperty: 'id',
            source: source,
            filter: filter
         };
         var baseCtrl = new BaseControl(cfg);
         baseCtrl.saveOptions(cfg);

         return new Promise(function(resolve) {
            baseCtrl._beforeMount(cfg).addCallback(function() {
               baseCtrl.reloadItem(1).addCallback(function(item) {
                  assert.equal(item.get('id'), 1);
                  assert.equal(item.get('title'), 'Первый');

                  baseCtrl.reloadItem(1, null, true, 'query').addCallback(function(items) {
                     assert.isTrue(!!items.getCount);
                     assert.equal(items.getCount(), 1);
                     assert.equal(items.at(0).get('id'), 1);
                     resolve();
                  });
               });
            });
         });
      });

      it('should fire "drawItems" event if collection has changed', async function() {
         var
            cfg = {
               viewName: 'Controls/List/ListView',
               viewModelConfig: {
                  items: [],
                  keyProperty: 'id'
               },
               viewModelConstructor: lists.ListViewModel,
               keyProperty: 'id',
               source: source
            },
            instance = new BaseControl(cfg);
         instance.saveOptions(cfg);
         await instance._beforeMount(cfg);
         instance._beforeUpdate(cfg);
         instance._afterUpdate(cfg);

         var fakeNotify = sandbox.spy(instance, '_notify').withArgs('drawItems');

         instance.getViewModel()._notify('onListChange', 'collectionChanged');
         assert.isFalse(fakeNotify.called);
         instance._beforeUpdate(cfg);
         assert.isFalse(fakeNotify.called);
         instance._afterUpdate(cfg);
         assert.isTrue(fakeNotify.calledOnce);
      });

      it('should fire "drawItems" event if indexes have changed', async function() {
         var
            cfg = {
               viewName: 'Controls/List/ListView',
               viewModelConfig: {
                  items: [],
                  keyProperty: 'id'
               },
               viewModelConstructor: lists.ListViewModel,
               keyProperty: 'id',
               source: source
            },
            instance = new BaseControl(cfg);
         instance.saveOptions(cfg);
         await instance._beforeMount(cfg);
         instance._beforeUpdate(cfg);
         instance._afterUpdate(cfg);
         var fakeNotify = sandbox.spy(instance, '_notify').withArgs('drawItems');

         instance.getViewModel()._notify('onListChange', 'indexesChanged');
         assert.isFalse(fakeNotify.called);
         instance._beforeUpdate(cfg);
         assert.isFalse(fakeNotify.called);
         instance._afterUpdate(cfg);
         assert.isTrue(fakeNotify.calledOnce);
      });
   });
});
