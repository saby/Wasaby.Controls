define(['Controls/Container/List', 'WS.Data/Source/Memory', 'WS.Data/Collection/RecordSet', 'Core/Deferred'], function(List, Memory, RecordSet, Deferred) {
   
   if (typeof mocha !== 'undefined') {
      //Из-за того, что загрузка через Core/moduleStubs добавляет в global Lib/Control/LoadingIndicator/LoadingIndicator,
      //чтобы потом брать его из кэша
      mocha.setup({globals: ['Controls/Controllers/_Search']});
   }
   
   
   describe('Controls.Container.List', function () {
      var listLayout, listOptions, listSource, listSourceData, listSearchParam;
   
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
         listLayout = new List(listOptions);
         listLayout.saveOptions(listOptions);
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
         assert.deepEqual(listLayout._filter, {testField: 'testValue'});
      });
   
      it('.filterChanged', function() {
         List._private.filterChanged(listLayout, {testField: 'testValue2'});
         assert.deepEqual(listLayout._filter, {testField: 'testValue2'});
      });
      
      it('.searchValueChanged', function(done) {
         var listLayout = new List(listOptions);
         List._private.searchValueChanged(listLayout, 'Sasha');
         
         setTimeout(function() {
            assert.deepEqual(listLayout._filter, {title: 'Sasha'});
            assert.deepEqual(listLayout._source._$data, [
               { id: 1, title: 'Sasha' },
               { id: 5, title: 'Sasha' }
               ]);
            List._private.searchValueChanged(listLayout, '');
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
         List._private.abortCallback(listLayout, {});
         List._private.searchValueChanged(listLayout, 'Sasha');

         setTimeout(function() {
            assert.deepEqual(listLayout._filter, {title: 'Sasha'});
            assert.deepEqual(listLayout._source._$data, [
               { id: 1, title: 'Sasha' },
               { id: 5, title: 'Sasha' }
            ]);
            listLayout._beforeUnmount();
            setTimeout(function() {
               assert.deepEqual(listLayout._filter, {});
               assert.deepEqual(listLayout._source._$data, listSourceData);
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
         listLayout._contextObj = {};
         listLayout._contextObj['filterLayoutField'] = { filter: {} };
         listLayout._contextObj['searchLayoutField'] = {searchValue: ''};
         
         listLayout._beforeUpdate({}, context);
         
         /* Nothing changes */
         assert.deepEqual(listLayout._filter, {});
         assert.deepEqual(listLayout._source._$data, listSourceData);
   
         /* SearchValue changed */
         context.searchLayoutField.searchValue = 'Sasha';
         listLayout._beforeUpdate({}, context);
         setTimeout(function() {
            assert.deepEqual(listLayout._filter, {title: 'Sasha'});
            assert.deepEqual(listLayout._source._$data, [
               { id: 1, title: 'Sasha' },
               { id: 5, title: 'Sasha' }
            ]);
   
            /* To reset source and context*/
            List._private.abortCallback(listLayout, {});
            listLayout._contextObj['searchLayoutField'] = {searchValue: ''};
            context.searchLayoutField.searchValue = '';
            /* check reset */
            assert.deepEqual(listLayout._filter, {});
            assert.deepEqual(listLayout._source._$data, listSourceData);
   
            /* Change context filter */
            context.filterLayoutField.filter = { title: 'Sasha' };
            listLayout._beforeUpdate({}, context);
            setTimeout(function() {
               assert.deepEqual(listLayout._filter, {title: 'Sasha'});
               done();
            }, 50);
         }, 50);
         
      });
      
   });
   
});
