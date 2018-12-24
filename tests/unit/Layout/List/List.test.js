define(['Controls/Container/List', 'WS.Data/Source/Memory', 'WS.Data/Source/PrefetchProxy', 'WS.Data/Collection/RecordSet', 'Core/Deferred', 'Core/core-clone'], function(List, Memory, PrefetchProxy, RecordSet, Deferred, clone) {
   
   if (typeof mocha !== 'undefined') {
      //Из-за того, что загрузка через Core/moduleStubs добавляет в global Lib/Control/LoadingIndicator/LoadingIndicator,
      //чтобы потом брать его из кэша
      mocha.setup({globals: ['Controls/Controllers/_Search']});
   }
   
   
   describe('Controls.Container.List', function () {
      var listLayout, listLayoutWithPrefetch, listOptions, listSource, listSourceData, listSearchParam, listPrefetchSource, listOptionsWithPrefetch;
      
      var getFilledContext = function() {
         return {
            filterLayoutField: {
               filter: {
                  title: 'Sasha'
               }
            },
            searchLayoutField: {
               searchValue: 'Sasha'
            }
         };
      };
      
      var getEmptyContext = function() {
         return {
            filterLayoutField: {
               filter: {
                  title: ''
               }
            },
            searchLayoutField: {
               searchValue: ''
            }
         };
      };
   
      before(function() {
         listSourceData = [{ id: 1, title: 'Sasha' },
            { id: 2, title: 'Dmitry' },
            { id: 3, title: 'Andrey' },
            { id: 4, title: 'Aleksey' },
            { id: 5, title: 'Sasha' }];
         listSource = new Memory({
            data: listSourceData,
            idProperty: 'id'
         });
         listPrefetchSource = new PrefetchProxy({
            target: listSource,
            data: {
               query: new RecordSet({
                  rawData: listSourceData
               })
            }
         });
         listSearchParam = 'title';
         listOptions = {
            source: listSource,
            searchParam: listSearchParam,
            searchDelay: 0,
            minSearchLength: 3,
            filter: {},
            navigation: {
               source: 'page',
               view: 'page',
               sourceConfig: {
                  pageSize: 10,
                  page: 0,
                  mode: 'totalCount'
               }
            }
         };
   
         listOptionsWithPrefetch = {
            source: listPrefetchSource,
            searchParam: listSearchParam,
            searchDelay: 0,
            minSearchLength: 3,
            filter: {},
            navigation: {
               source: 'page',
               view: 'page',
               sourceConfig: {
                  pageSize: 10,
                  page: 0,
                  mode: 'totalCount'
               }
            }
         };
         listLayout = new List(listOptions);
         listLayout.saveOptions(listOptions);
   
         listLayoutWithPrefetch = new List(listOptionsWithPrefetch);
         listLayoutWithPrefetch.saveOptions(listOptionsWithPrefetch);
      });
      
      it('.updateFilter', function() {
         List._private.updateFilter(listLayout, {testKey: 'testFilter'});
         assert.deepEqual(listLayout._filter, {testKey: 'testFilter'});
   
         List._private.updateFilter(listLayout, {testKey: 'testFilter2'});
         assert.deepEqual(listLayout._filter, {testKey: 'testFilter2'});
      });
      
      it('.updateSource', function() {
         var recordSet = new RecordSet({
            rawData:[
               { id: 1, title: 'Sasha' },
               { id: 2, title: 'Dmitry' }
               ]
         });
         List._private.updateSource(listLayout, recordSet);
         
         assert.deepEqual(recordSet.getRawData(), listLayout._source._$data);
      });
   
      it('.abortCallback', function() {
         List._private.abortCallback(listLayout, {});
         assert.deepEqual(listSourceData, listLayout._source._$data);
      });
   
      it('.searchErrback', function() {
         var errbackCalled = false;
         var errbackCalledWithPrefetch = false;
         listLayout._options.searchErrback = function() {
            errbackCalled = true;
         };
         listLayoutWithPrefetch._options.searchErrback = function() {
            errbackCalledWithPrefetch = true;
         };
         listLayoutWithPrefetch._options.source = listSource;
         List._private.searchErrback(listLayout, {});
         
         assert.deepEqual(null, listLayout._source._$data);
         assert.isTrue(errbackCalled);
   
         List._private.searchErrback(listLayoutWithPrefetch, {});
   
         assert.deepEqual(null, listLayoutWithPrefetch._source._$data);
         assert.isTrue(errbackCalledWithPrefetch);
      });
   
      it('.searchCallback', function() {
         var recordSet = new RecordSet({
            rawData:[
               { id: 1, title: 'Sasha' },
               { id: 2, title: 'Dmitry' }
            ]
         });
         listLayout._searchDeferred = new Deferred();
         List._private.searchCallback(listLayout, {data: recordSet}, {testField: 'testValue'});
         assert.deepEqual(recordSet.getRawData(), listLayout._source._$data);
         //FIXME вернуть как будет cached source
         //assert.deepEqual(listLayout._filter, {testField: 'testValue'});
         assert.deepEqual(listLayout._filter, {});
      });
      
      it('.searchValueChanged', function(done) {
         var listLayout = new List(listOptions);
         listLayout._beforeMount(listOptions);
         List._private.searchValueChanged(listLayout, 'Sasha');
         assert.equal(listLayout._searchValue, 'Sasha');
         
         setTimeout(function() {
            //FIXME вернуть как будет cached source
            //assert.deepEqual(listLayout._filter, {title: 'Sasha'});
            assert.deepEqual(listLayout._filter, {});
            assert.deepEqual(listLayout._source._$data, [
               { id: 1, title: 'Sasha' },
               { id: 5, title: 'Sasha' }
               ]);
            List._private.searchValueChanged(listLayout, '');
            assert.equal(listLayout._searchValue, '');
            setTimeout(function() {
               assert.deepEqual(listLayout._filter, {});
               assert.deepEqual(listLayout._source._$data, listSourceData);
               done();
            }, 50);
         }, 50);
      });
   
      it('.getSearchController', function() {
         listLayout._searchController = undefined;
   
   
         assert.isFalse(!!listLayout._searchController);
         
         var searchController = List._private.getSearchController(listLayout);
   
         assert.isTrue(!!listLayout._searchController);
         assert.equal(searchController._moduleName, 'Controls/Controllers/_SearchController');
         assert.equal(searchController._options.searchParam, listSearchParam);
         assert.equal(searchController._options.source, listSource);
      });
   
      it('._beforeUnmount', function(done) {
         /* To reset source */
         var listLayout = new List(listOptions);
         var context = getFilledContext();
         var aborted = false;
         listLayout._beforeMount(listOptions);
         listLayout._saveContextObject(getEmptyContext());
         
         List._private.abortCallback(listLayout, {});
         
         listLayout._beforeUpdate(listOptions, context);

         setTimeout(function() {
            //FIXME вернуть как будет cached source
            //assert.deepEqual(listLayout._filter, {title: 'Sasha'});
            assert.deepEqual(listLayout._filter, {});
            assert.deepEqual(listLayout._source._$data, [
               { id: 1, title: 'Sasha' },
               { id: 5, title: 'Sasha' }
            ]);
            assert.isTrue(!!listLayout._searchDeferred);
            assert.isTrue(!!listLayout._searchController);
            listLayout._searchController.abort = function() {
               aborted = true;
            };
            listLayout._beforeUnmount();
            setTimeout(function() {
               assert.isTrue(aborted);
               assert.equal(listLayout._searchController, undefined);
               assert.equal(listLayout._searchDeferred, undefined);
               done();
            }, 50);
         }, 50);
      });
   
      it('._beforeUpdate', function(done) {
         /* Изолированный тест beforeUpdate */
         var context = {
            filterLayoutField: {
               filter: {}
            },
            searchLayoutField: {
               searchValue: ''
            }
         };
         var listLayout = new List(listOptions);
         listLayout._saveContextObject({
            filterLayoutField: {filter: {}},
            searchLayoutField: {searchValue: ''}
         });
   
         /* emulate _beforeMount */
         listLayout.saveOptions(listOptions);
         List._private.resolveOptions(listLayout, listOptions);
         listLayout._source = listOptions.source;
         
         listLayout._beforeUpdate(listOptions, context);
         
         /* Nothing changes */
         assert.deepEqual(listLayout._filter, {});
         assert.deepEqual(listLayout._source._$data, listSourceData);
   
         /* SearchValue changed */
         context.searchLayoutField.searchValue = 'Sasha';
         listLayout._beforeUpdate(listOptions, context);
         setTimeout(function() {
            //FIXME вернуть как будет cached source
            //assert.deepEqual(listLayout._filter, {title: 'Sasha'});
            assert.deepEqual(listLayout._filter, {});
            assert.deepEqual(listLayout._source._$data, [
               { id: 1, title: 'Sasha' },
               { id: 5, title: 'Sasha' }
            ]);
   
            /* To reset source and context*/
            listLayout._saveContextObject({
               filterLayoutField: {filter: {title: 'Sasha'}},
               searchLayoutField: {searchValue: 'Sasha'}
            });
            List._private.abortCallback(listLayout, {});
            /* check reset */
            assert.deepEqual(listLayout._filter, {});
            assert.deepEqual(listLayout._source._$data, listSourceData);
   
            /* change source */
            var newSource = new Memory({
               data: listSourceData,
               idProperty: 'id'
            });
            var newOpts = clone(listOptions);
            newOpts.source = newSource;
            listLayout._beforeUpdate(newOpts, context);
            assert.equal(listLayout._searchController._options.source, newSource);
            
            
            /* Change context filter */
            listLayout._saveContextObject({
               filterLayoutField: {filter: {title: ''}},
               searchLayoutField: {searchValue: 'Sasha'}
            });
            context.filterLayoutField.filter = { title: 'Sasha' };
            listLayout._beforeUpdate(newOpts, context);
            setTimeout(function() {
               assert.deepEqual(listLayout._filter, {title: 'Sasha'});
   
               var newNavigation = {
                  source: 'page',
                  view: 'page',
                  sourceConfig: {
                     pageSize: 2,
                     page: 0,
                     mode: 'totalCount'
                  }
               };
               newOpts = clone(newOpts);
               newOpts.navigation = newNavigation;
               newOpts.source = new Memory({
                  data: listSourceData,
                  idProperty: 'id'
               });
   
               listLayout._searchMode = true;
               context.filterLayoutField.filter = {test: 'testFilter'};
               listLayout._beforeUpdate(newOpts, context);
   
               assert.deepEqual(listLayout._searchController._options.navigation, newNavigation);
               assert.deepEqual(listLayout._searchController._options.filter, {test: 'testFilter'});
               assert.isTrue(listLayout._source !== newOpts.source);
   
               done();
            }, 50);
         }, 50);
         
      });
   
      it('Container/List::_private.isFilterChanged', function() {
         var listLayout = new List(listOptions);
         var context = getFilledContext();
   
         listLayout._saveContextObject(getEmptyContext());
         assert.isTrue(List._private.isFilterChanged(listLayout, context));
   
         listLayout._saveContextObject(getFilledContext());
         assert.isFalse(List._private.isFilterChanged(listLayout, context));
   
         listLayout._filter = getFilledContext().filterLayoutField.filter;
         assert.isFalse(List._private.isFilterChanged(listLayout, context));
   
         listLayout._filter = getEmptyContext().filterLayoutField.filter;
         assert.isTrue(List._private.isFilterChanged(listLayout, context));
      });
   
      it('Container/List::_private.isSearchValueChanged', function() {
         var listLayout = new List(listOptions);
         listLayout._beforeMount(listOptions);
         var context = getFilledContext();
   
         listLayout._saveContextObject(getEmptyContext());
         assert.isTrue(List._private.isSearchValueChanged(listLayout, context));
   
         listLayout._saveContextObject(getFilledContext());
         assert.isFalse(List._private.isSearchValueChanged(listLayout, context));
         
         listLayout._searchValue = getFilledContext().searchLayoutField.searchValue;
         assert.isFalse(List._private.isSearchValueChanged(listLayout, context));
         
         listLayout._searchValue = getEmptyContext().searchLayoutField.searchValue;
         assert.isTrue(List._private.isSearchValueChanged(listLayout, getEmptyContext()));
         
      });
   
      it('Container/List::_private.getSearchValueFromContext', function () {
         var listLayout = new List(listOptions);
         var context = getFilledContext();
         var emptyContext = getEmptyContext();
         
         assert.equal('Sasha', List._private.getSearchValueFromContext(listLayout, context));
         assert.equal('', List._private.getSearchValueFromContext(listLayout, emptyContext));
      });
   
      it('Container/List::_private.getFilterFromContext', function () {
         var listLayout = new List(listOptions);
         var context = getFilledContext();
         var emptyContext = getEmptyContext();
   
         assert.deepEqual({title: 'Sasha'}, List._private.getFilterFromContext(listLayout, context));
         assert.deepEqual({title: ''}, List._private.getFilterFromContext(listLayout, emptyContext));
      });
      
   });
   
});
