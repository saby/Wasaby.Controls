/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/BaseControl',
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/List/ListViewModel',
   'Controls/List/Tree/TreeViewModel',
   'Controls/Utils/Toolbar',
   'Core/Deferred',
   'Core/core-instance',
   'Controls/List/ListView'
], function(BaseControl, ItemsUtil, MemorySource, RecordSet, ListViewModel, TreeViewModel, tUtil, cDeferred, cInstance) {
   describe('Controls.List.BaseControl', function() {
      var data, result, source, rs;
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
         source = new MemorySource({
            idProperty: 'id',
            data: data
         });
         rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });
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
            viewModelConstructor: ListViewModel,
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

         source = new MemorySource({
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
            assert.isTrue(ctrl._sourceController !== oldSourceCtrl, '_dataSourceController wasn\'t changed before updating');
            assert.deepEqual(filter, ctrl._options.filter, 'incorrect filter before updating');
            ctrl.saveOptions(cfg);
            assert.deepEqual(filter2, ctrl._options.filter, 'incorrect filter after updating');
            assert.equal(ctrl._viewModelConstructor, TreeViewModel);
            assert.isTrue(cInstance.instanceOfModule(ctrl._listViewModel, 'Controls/List/Tree/TreeViewModel'));
            assert.isTrue(ctrl._hasUndrawChanges);
            setTimeout(function() {
               assert.isTrue(dataLoadFired, 'dataLoadCallback is not fired');
               ctrl._afterUpdate();
               assert.isFalse(ctrl._hasUndrawChanges);
               ctrl._beforeUnmount();
               done();
            }, 100);
         }, 1);
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
         var source = new MemorySource({
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
               items: [],
               keyProperty: 'id'
            },
            viewModelConstructor: ListViewModel
         };

         var ctrl = new BaseControl(cfg);


         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // waiting for first load
         setTimeout(function() {
            // emulate loading error
            ctrl._sourceController.load = function() {
               var def = new cDeferred();
               def.errback();
               return def;
            };

            BaseControl._private.reload(ctrl).addCallback(function() {
               done();
            }).addErrback(function() {
               assert.isTrue(false, 'reload() returns errback');
               done();
            });
         }, 100);
      });


      it('_needScrollCalculation', function(done) {
         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
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
            viewModelConstructor: ListViewModel,
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
         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  mode: 'totalCount'
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
               done();
            }, 100);
         }, 100);
      });

      it('Navigation demand', function(done) {
         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               view: 'demand',
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  mode: 'totalCount'
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

      it('loadToDirection up', function(done) {
         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 1,
                  mode: 'totalCount'
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

      it('onScrollLoadEdge', function(done) {
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               view: 'infinity',
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  mode: 'totalCount'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
         setTimeout(function() {
            ctrl._hasUndrawChanges = true;
            BaseControl._private.onScrollLoadEdge(ctrl, 'down');
            setTimeout(function() {
               assert.equal(3, ctrl._listViewModel.getCount(), 'Items are loaded, but should not');

               ctrl._hasUndrawChanges = false;
               BaseControl._private.onScrollLoadEdge(ctrl, 'down');
               setTimeout(function() {
                  assert.equal(6, ctrl._listViewModel.getCount(), 'Items wasn\\\'t load');
                  done();
               }, 100);
            }, 100);
         }, 100);
      });

      it('scrollLoadStarted MODE', function(done) {
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               view: 'infinity',
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  mode: 'totalCount'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         // два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
         setTimeout(function() {
            ctrl._hasUndrawChanges = false; // _afterUpdate
            BaseControl._private.onScrollLoadEdgeStart(ctrl, 'down');
            BaseControl._private.checkLoadToDirectionCapability(ctrl);
            setTimeout(function() {
               assert.equal(6, ctrl._listViewModel.getCount(), 'Items wasn\'t load with started "scrollloadmode"');

               BaseControl._private.onScrollLoadEdgeStop(ctrl, 'down');
               BaseControl._private.checkLoadToDirectionCapability(ctrl);

               setTimeout(function() {
                  assert.equal(6, ctrl._listViewModel.getCount(), 'Items was load without started "scrollloadmode"');

                  done();
               }, 100);
            }, 100);
         }, 100);
      });

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

      it('indicator', function() {
         var cfg = {};
         var ctrl = new BaseControl(cfg);

         BaseControl._private.showIndicator(ctrl);
         assert.equal(ctrl._loadingState, 'all', 'Wrong loading state');
         assert.equal(ctrl._loadingIndicatorState, 'all', 'Wrong loading state');

         // картинка должен появляться через 2000 мс, проверим, что её нет сразу
         assert.isFalse(!!ctrl._showLoadingIndicatorImage, 'Wrong loading indicator image state');

         // искуственно покажем картинку
         ctrl._showLoadingIndicatorImage = true;

         // и вызовем скрытие
         BaseControl._private.hideIndicator(ctrl);
         assert.equal(ctrl._loadingState, null, 'Wrong loading state');
         assert.equal(ctrl._loadingIndicatorState, null, 'Wrong loading indicator state');
         assert.isFalse(!!ctrl._showLoadingIndicatorImage, 'Wrong loading indicator image state');
      });

      it('scrollToEdge_load', function(done) {
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  mode: 'totalCount'
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
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               view: 'infinity',
               source: 'page',
               viewConfig: {
                  pagingMode: 'direct'
               },
               sourceConfig: {
                  pageSize: 3,
                  page: 0,
                  mode: 'totalCount'
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

            done();
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
                  mode: 'totalCount'
               }
            }
         };
         var baseControl = new BaseControl(cfg);
         baseControl.saveOptions(cfg);
   
         BaseControl._private.onScrollHide(baseControl);
         assert.equal(baseControl._loadOffset, 0);
   
         BaseControl._private.onScrollShow(baseControl);
         assert.equal(baseControl._loadOffset, 100);
      });

      it('scrollToEdge without load', function(done) {
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  mode: 'totalCount'
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
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  mode: 'totalCount'
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
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  mode: 'totalCount'
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

      it('_onCheckBoxClick', function() {
         var rs = new RecordSet({
            idProperty: 'id',
            rawData: data
         });

         var source = new MemorySource({
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
            viewModelConstructor: ListViewModel,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 6,
                  page: 0,
                  mode: 'totalCount'
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
            viewModelConstructor: ListViewModel
         };
         var originalEvent = {
            target: {
               closest: function(selector) {
                  return selector === '.js-controls-ListView__checkbox';
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
         assert.equal(rs.at(2), ctrl._listViewModel._markedItem.getContents());
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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

         it('_onAfterBeginEdit', function() {
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._listViewModel = new ListViewModel({ // аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {
               itemActions: {
                  updateItemActions: function() {
                  }
               }
            };
            ctrl._notify = function(e, options) {
               assert.equal('afterBeginEdit', e);
               assert.equal(options[0], opt);
               assert.isNotOk(options[1]);
            };
            ctrl._onAfterBeginEdit({}, opt);
         });

         it('_onAfterBeginEdit, isAdd = true', function() {
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._listViewModel = new ListViewModel({ // аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {
               itemActions: {
                  updateItemActions: function() {
                  }
               }
            };
            ctrl._notify = function(e, options) {
               assert.equal('afterBeginEdit', e);
               assert.equal(options[0], opt);
               assert.isTrue(options[1]);
            };
            ctrl._onAfterBeginEdit({}, opt, true);
         });

         it('_onAfterEndEdit', function() {
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._listViewModel = new ListViewModel({ // аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {
               itemActions: {
                  updateItemActions: function() {
                  }
               }
            };
            ctrl._notify = function(e, args) {
               assert.equal('afterEndEdit', e);
               assert.equal(args[0], opt);
               assert.isNotOk(args[1]);
            };
            ctrl._onAfterEndEdit({}, opt);
         });

         it('_onAfterEndEdit, isAdd: true', function() {
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
                  },
                  view: 'infinity',
                  viewConfig: {
                     pagingMode: 'direct'
                  }
               }
            };
            var ctrl = new BaseControl(cfg);
            ctrl._listViewModel = new ListViewModel({ // аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {
               itemActions: {
                  updateItemActions: function() {
                  }
               }
            };
            ctrl._notify = function(e, args) {
               assert.equal('afterEndEdit', e);
               assert.equal(args[0], opt);
               assert.isTrue(args[1]);
            };
            ctrl._onAfterEndEdit({}, opt, true);
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
               viewModelConstructor: ListViewModel,
               navigation: {
                  source: 'page',
                  sourceConfig: {
                     pageSize: 6,
                     page: 0,
                     mode: 'totalCount'
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
                  viewModelConstructor: ListViewModel,
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
                     assert.isFalse(args.target);
                     assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'WS.Data/Collection/RecordSet'));
                     assert.equal(args.templateOptions.keyProperty, 'id');
                     assert.equal(args.templateOptions.parentProperty, 'parent');
                     assert.equal(args.templateOptions.nodeProperty, 'parent@');
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
            assert.equal(itemData, instance._listViewModel._activeItem);
            assert.isTrue(itemData.contextEvent);
            assert.equal(callBackCount, 3);

            // dont show by long tap
            instance._isTouch = true;
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
         });

         it('_onItemContextMenu', function() {
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
                  viewModelConstructor: ListViewModel,
                  markedKey: 0,
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
            assert.equal(instance.getViewModel()._markedKey, 0);
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
                  viewModelConstructor: ListViewModel,
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
                  viewModelConstructor: ListViewModel,
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
                  viewModelConstructor: ListViewModel,
                  source: source
               },
               instance = new BaseControl(cfg),
               target = 123,
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
                     assert.equal(target, args.target);
                     assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'WS.Data/Collection/RecordSet'));
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
            assert.equal(itemData, instance._listViewModel._activeItem);
            assert.isFalse(itemData.contextEvent);
            assert.equal(callBackCount, 3);
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
                  viewModelConstructor: ListViewModel,
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
                  viewModelConstructor: ListViewModel,
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
                  viewModelConstructor: ListViewModel,
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
                  viewModelConstructor: ListViewModel,
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
                  viewModelConstructor: ListViewModel,
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

               done();
            });
            return done;
         });

      });
   });
});
