/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/BaseControl',
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/List/ListViewModel',
   'Controls/Utils/Toolbar',
   'Core/Deferred',
   'Core/core-instance',
   'Controls/List/ListView'
], function(BaseControl, ItemsUtil, MemorySource, RecordSet, ListViewModel, tUtil, cDeferred, cInstance) {
   describe('Controls.List.BaseControl', function() {
      var data, display, result, source, rs;
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
      });
      it('life cycle', function(done) {
         var dataLoadFired = false;
         var filter = {1: 1, 2: 2};
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

         //received state 3'rd argument
         mountResult = ctrl._beforeMount(cfg, {}, rs);
         assert.isFalse(!!(mountResult && mountResult.addCallback), '_beforeMount return deferred with received state');

         assert.isTrue(!!ctrl._sourceController, '_dataSourceController wasn\'t created before mounting');
         assert.deepEqual(filter, ctrl._options.filter, 'incorrect filter before mounting');

         //создаем новый сорс
         var oldSourceCtrl = ctrl._sourceController;

         source = new MemorySource({
            idProperty: 'id',
            data: data
         });

         var filter2 = {3: 3};
         cfg = {
            viewName: 'Controls/List/ListView',
            source: source,
            dataLoadCallback: function() {
               dataLoadFired = true;
            },
            viewModelConstructor: ListViewModel,
            viewModelConfig: {
               items: [],
               keyProperty: 'id'
            },
            filter: filter2
         };

         ctrl._beforeUpdate(cfg);
         assert.isTrue(ctrl._sourceController !== oldSourceCtrl, '_dataSourceController wasn\'t changed before updating');
         assert.deepEqual(filter, ctrl._options.filter, 'incorrect filter before updating');
         ctrl.saveOptions(cfg);
         assert.deepEqual(filter2, ctrl._options.filter, 'incorrect filter after updating');

         //сорс грузит асинхронно
         setTimeout(function() {
            assert.isTrue(dataLoadFired, 'dataLoadCallback is not fired');
            ctrl._afterUpdate();
            ctrl._beforeUnmount();
            done();
         }, 100);



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

         //waiting for first load
         setTimeout(function() {

            //emulate loading error
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


      it('_needScrollCalculation', function() {

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
         ctrl._beforeUpdate(cfg);
         assert.isTrue(ctrl._needScrollCalculation, 'Wrong _needScrollCalculation value after updating');

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

      it('loadToDirection down', function(done) {
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

         //два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
         setTimeout(function() {
            BaseControl._private.onScrollLoadEdge(ctrl, 'down');
            setTimeout(function() {
               assert.equal(6, ctrl._listViewModel.getCount(), 'Items wasn\'t load');
               done();
            }, 100);
         }, 100);


      });

      it('processLoadError', function() {
         var cfg = {};
         var ctrl = new BaseControl(cfg);
         var error = {message: 'error'};

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

         //картинка должен появляться через 2000 мс, проверим, что её нет сразу
         assert.isFalse(!!ctrl._showLoadingIndicatorImage, 'Wrong loading indicator image state');

         //искуственно покажем картинку
         ctrl._showLoadingIndicatorImage = true;

         //и вызовем скрытие
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


         //два таймаута, первый - загрузка начального рекордсета, второй - на последюущий запрос
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
               viewConfig: {
                  pagingMode: 'direct'
               }
            }
         };
         var ctrl = new BaseControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);

         //эмулируем появление скролла
         BaseControl._private.onScrollShow(ctrl);

         //скроллпэйджиг контроллер создается асинхронном
         setTimeout(function() {
            assert.isTrue(!!ctrl._scrollPagingCtr, 'ScrollPagingController wasn\'t created');


            //прокручиваем к низу, проверяем состояние пэйджинга
            BaseControl._private.onScrollListEdge(ctrl, 'down');
            assert.deepEqual({stateBegin: 'normal', statePrev: 'normal', stateNext: 'disabled', stateEnd: 'disabled'}, ctrl._pagingCfg, 'Wrong state of paging arrows after scroll to bottom');

            BaseControl._private.handleListScroll(ctrl, '200');
            assert.deepEqual({stateBegin: 'normal', statePrev: 'normal', stateNext: 'normal', stateEnd: 'normal'}, ctrl._pagingCfg, 'Wrong state of paging arrows after scroll');

            BaseControl._private.onScrollHide(ctrl);
            assert.deepEqual(null, ctrl._pagingCfg, 'Wrong state of paging');

            done();
         }, 100);
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

         //дождемся загрузки списка
         setTimeout(function() {
            result = false;
            ctrl._notify = function(event, dir) {
               result = dir;
            };

            //прокручиваем к низу, проверяем состояние пэйджинга
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

         //эмулируем появление скролла
         BaseControl._private.onScrollShow(ctrl);

         //скроллпэйджиг контроллер создается асинхронном
         setTimeout(function() {
            ctrl._notify = function(eventName, type) {
               result = type;
            };

            //прокручиваем к низу, проверяем состояние пэйджинга
            result = false;
            ctrl.__onPagingArrowClick({}, 'End');
            assert.equal('bottom', result[0], 'Wrong state of scroll after clicking to End');

            //прокручиваем к верху, проверяем состояние пэйджинга
            ctrl.__onPagingArrowClick({}, 'Begin');
            assert.equal('top', result[0], 'Wrong state of scroll after clicking to Begin');

            //прокручиваем страницу вверх и вниз, проверяем состояние пэйджинга
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

         //эмулируем появление скролла
         BaseControl._private.onScrollShow(ctrl);

         //скроллпэйджиг контроллер создается асинхронном
         setTimeout(function() {
            ctrl._notify = function(eventName, type) {
               result = type;
            };

            //прогоняем все варианты, без проверки, т.к. все ветки уже тестируются выше
            ctrl.__onEmitScroll({}, 'loadTop');
            ctrl.__onEmitScroll({}, 'loadBottom');
            ctrl.__onEmitScroll({}, 'listTop');
            ctrl.__onEmitScroll({}, 'listBottom');
            ctrl.__onEmitScroll({}, 'scrollMove', {scrollTop: 200});
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
         ctrl._onCheckBoxClick({}, 2, 0);
         ctrl._notify = function(e, args) {
            assert.equal(e, 'checkboxClick');
            assert.equal(args[0], 1);
            assert.equal(args[1], 1);
         };
         ctrl._onCheckBoxClick({}, 1, 1);
      });

      describe('EditInPlace', function() {
         it('editItem', function(done) {
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
                  editItem: function(options) {
                     assert.equal(options, opt);
                     done();
                  }
               }
            };
            ctrl.editItem(opt);
         });

         it('addItem', function(done) {
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
                  addItem: function(options) {
                     assert.equal(options, opt);
                     done();
                  }
               }
            };
            ctrl.addItem(opt);
         });

         it('cancelEdit', function(done) {
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
                     done();
                  }
               }
            };
            ctrl.cancelEdit();
         });

         it('commitEdit', function(done) {
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
                     done();
                  }
               }
            };
            ctrl.commitEdit();
         });

         it('_onBeforeItemAdd', function() {
            var opt = {
               test: 'test'
            };
            var newOpt = {
               test2: 'test'
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
            ctrl._notify = function(e, options) {
               assert.equal('beforeItemAdd', e);
               assert.equal(options[0], opt);
               return newOpt;
            };
            var result = ctrl._onBeforeItemAdd({}, opt);
            assert.equal(result, newOpt);
         });

         it('_onBeforeItemEdit', function() {
            var opt = {
               test: 'test'
            };
            var newOpt = {
               test2: 'test'
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
            ctrl._notify = function(e, options) {
               assert.equal('beforeItemEdit', e);
               assert.equal(options[0], opt);
               return newOpt;
            };
            var result = ctrl._onBeforeItemEdit({}, opt);
            assert.equal(result, newOpt);
         });

         it('_onAfterItemEdit', function() {
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
            ctrl._listViewModel = new ListViewModel({ //аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {itemActions: {updateItemActions: function() {}}};
            ctrl._notify = function(e, options) {
               assert.equal('afterItemEdit', e);
               assert.equal(options[0], opt);
               assert.isNotOk(options[1]);
            };
            ctrl._onAfterItemEdit({}, opt);
         });

         it('_onAfterItemEdit, isAdd = true', function() {
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
            ctrl._listViewModel = new ListViewModel({ //аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {itemActions: {updateItemActions: function() {}}};
            ctrl._notify = function(e, options) {
               assert.equal('afterItemEdit', e);
               assert.equal(options[0], opt);
               assert.isTrue(options[1]);
            };
            ctrl._onAfterItemEdit({}, opt, true);
         });

         it('_onBeforeItemEndEdit', function() {
            var opt = {
               test: 'test'
            };
            var newOpt = {
               test2: 'test'
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
            ctrl._listViewModel = new ListViewModel({ //аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {itemActions: {updateItemActions: function() {}}};
            ctrl._notify = function(e, options) {
               assert.equal('beforeItemEndEdit', e);
               assert.equal(options[0], opt);
               assert.isTrue(options[1]);
               assert.isTrue(options[2]);
               return newOpt;
            };
            var result = ctrl._onBeforeItemEndEdit({}, opt, true, true);
            assert.equal(result, newOpt);
         });

         it('_onBeforeItemEndEdit', function() {
            var opt = {
               test: 'test'
            };
            var newOpt = {
               test2: 'test'
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
            ctrl._listViewModel = new ListViewModel({ //аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {itemActions: {updateItemActions: function() {}}};
            ctrl._notify = function(e, options) {
               assert.equal(options[0], opt);
               return newOpt;
            };
            var result = ctrl._onBeforeItemEndEdit({}, opt);
            assert.equal(result, newOpt);
         });

         it('_onAfterItemEndEdit', function() {
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
            ctrl._listViewModel = new ListViewModel({ //аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {itemActions: {updateItemActions: function() {}}};
            ctrl._notify = function(e, args) {
               assert.equal('afterItemEndEdit', e);
               assert.equal(args[0], opt);
               assert.isNotOk(args[1]);
            };
            ctrl._onAfterItemEndEdit({}, opt);
         });

         it('_onAfterItemEndEdit, isAdd: true', function() {
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
            ctrl._listViewModel = new ListViewModel({ //аналог beforemount
               items: rs,
               keyProperty: 'id',
               selectedKeys: [1, 3]
            });
            ctrl._children = {itemActions: {updateItemActions: function() {}}};
            ctrl._notify = function(e, args) {
               assert.equal('afterItemEndEdit', e);
               assert.equal(args[0], opt);
               assert.isTrue(args[1]);
            };
            ctrl._onAfterItemEndEdit({}, opt, true);
         });

         it('readOnly, editItem', function() {
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
            ctrl._children = {
               editInPlace: {
                  editItem: function() {
                     throw new Error('editItem shouldn\'t be called if BaseControl is readOnly');
                  }
               }
            };
            ctrl.editItem(opt);
         });

         it('readOnly, addItem', function() {
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
            ctrl._children = {
               editInPlace: {
                  addItem: function() {
                     throw new Error('addItem shouldn\'t be called if BaseControl is readOnly');
                  }
               }
            };
            ctrl.addItem(opt);
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
                  itemActions: {all: actions}
               };
            instance._children = {
               itemActionsOpener: {
                  open: function(args) {
                     callBackCount++;
                     assert.isFalse(args.target);
                     assert.isTrue(cInstance.instanceOfModule(args.templateOptions.items, 'WS.Data/Collection/RecordSet'));
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
            assert.equal(itemData, instance._listViewModel._activeItem);
            assert.isTrue(itemData.contextEvent);
            assert.equal(callBackCount, 3);

            //dont show by long tap
            instance._isTouch = true;
            instance._showActionsMenu(fakeEvent, itemData, childEvent, false);
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
                  itemActions: {all: []}
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
            assert.equal(callBackCount, 0); //проверяем что не открывали меню

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
                  itemActions: {all: actions}
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
               }]});
            assert.equal(instance._listViewModel._activeItem, null);
            assert.equal(callBackCount, 5);
         });

         it('_listSwipe  multiSelectStatus = 1', function(done) {
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
                  }
               };
               instance._listViewModel.reset();
               instance._listViewModel.goToNext();
               itemData = instance._listViewModel.getCurrent();
               itemData.multiSelectVisibility = true;
               itemData.multiSelectStatus = 1;

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

         it('_listSwipe  multiSelectStatus = 0', function(done) {
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
               itemData.multiSelectStatus = 0;
               instance._listSwipe({}, itemData, childEvent);
               assert.equal(callBackCount, 1);
               done();

            });
            return done;
         });

      });
   });
});
