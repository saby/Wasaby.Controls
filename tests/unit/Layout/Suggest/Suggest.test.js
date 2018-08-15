define(['Controls/Container/Suggest/Layout', 'WS.Data/Collection/List', 'WS.Data/Collection/RecordSet', 'WS.Data/Entity/Model'], function(Suggest, List, RecordSet, Model){
   
   describe('Controls.Container.Suggest.Layout', function () {
   
      var hasMoreTrue = {
         hasMore: true
      };
      var hasMoreFalse = {
         hasMore: false
      };
      
      var getComponentObject = function() {
         var self = {};
         self._options = {};
         self._options.suggestTemplate = {};
         self._options.footerTemplate = {};
         return self;
      };
      
      it('Suggest::_private.hasMore', function () {
         assert.isTrue(Suggest._private.hasMore(hasMoreTrue));
         assert.isFalse(Suggest._private.hasMore(hasMoreFalse));
      });
   
      it('Suggest::_private.shouldShowFooter', function () {
         var self = getComponentObject();
         self._options.footerTemplate = 'anyTemplate';
         assert.isTrue(!!Suggest._private.shouldShowFooter(self, hasMoreTrue));
         assert.isFalse(!!Suggest._private.shouldShowFooter(self, hasMoreFalse));
      });
   
      it('Suggest::_private.suggestStateNotify', function () {
         var self = getComponentObject();
         var stateNotifyed = false;
         self._options.suggestState = true;
         self._notify = function(eventName, args) {
            stateNotifyed = true;
         };
   
         Suggest._private.suggestStateNotify(self, true);
         assert.isFalse(stateNotifyed);
   
         Suggest._private.suggestStateNotify(self, false);
         assert.isTrue(stateNotifyed);
      });
   
      it('Suggest::_private.close', function() {
         var self = getComponentObject();
         var state;
         self._options.suggestState = true;
         self._notify = function(eventName, args) {
            state = args[0];
         };
         Suggest._private.close(self);
         assert.isFalse(state);
      });
   
      it('Suggest::_close', function() {
         var suggestComponent = new Suggest();
         var value = 'test';
         
         suggestComponent._notify = function(event, val) {
            if (event === 'valueChanged') {
               value = val[0];
            }
         };
   
         suggestComponent._options.suggestStyle = 'overInput';
         suggestComponent._options.value = '';
         suggestComponent._close();
         assert.equal(value, 'test');
         assert.equal(suggestComponent._searchValue, '');
   
         suggestComponent._options.value = 'test';
         suggestComponent._close();
         assert.equal(value, '');
      });
   
      it('Suggest::_private.open', function (done) {
         var self = getComponentObject();
         var state;
         self._options.suggestState = false;
         self._notify = function(eventName, args) {
            state = args[0];
         };
         Suggest._private.open(self);
         self._dependenciesDeferred.addCallback(function() {
            assert.isTrue(state);
            done();
         });
      });
   
      it('Suggest::_private.shouldSearch', function () {
         var self = getComponentObject();
         self._options.minSearchLength = 3;
         
         self._active = true;
         assert.isTrue(Suggest._private.shouldSearch(self, 'test'));
         assert.isFalse(Suggest._private.shouldSearch(self, 't'));
   
         self._active = false;
         assert.isFalse(Suggest._private.shouldSearch(self, 'test'));
         assert.isFalse(Suggest._private.shouldSearch(self, 't'));
      });
   
      it('Suggest::_private.shouldShowSuggest', function () {
         var self = getComponentObject();
         var result = {
            data: new List({items: [1,2,3]})
         };
         var emptyResult = {
            data: new List()
         };
         
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
         assert.isFalse(!!Suggest._private.shouldShowSuggest(self, emptyResult));
   
         self._options.emptyTemplate = {};
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, emptyResult));
      });
   
      it('Suggest::_private.prepareFilter', function() {
         var self = getComponentObject();
         self._options.searchParam = 'searchParam';
         var resultFilter = {
            currentTab: 1,
            searchParam: 'test',
            filterTest: 'filterTest'
         };
   
         var filter = Suggest._private.prepareFilter(self, {filterTest: 'filterTest'}, 'test', 1);
         assert.deepEqual(filter, resultFilter);
      });
   
      it('Suggest::_private.setFilter', function() {
         var self = getComponentObject();
         self._options.searchParam = 'searchParam';
         self._searchValue = 'test';
         self._tabsSelectedKey = 1;
         var filter = {
            test: 'test'
         };
         var resultFilter = {
            searchParam: 'test',
            test: 'test',
            currentTab: 1
         };
         Suggest._private.setFilter(self, filter);
         assert.deepEqual(self._filter, resultFilter);
      });
   
      it('Suggest::_private.calcOrient', function() {
         var self = getComponentObject();
         var suggestHeight = 200;
   
         self._children = {
            suggestionsContainer: {
               getBoundingClientRect: function() {
                  return {
                     height: suggestHeight
                  };
               },
               offsetHeight: 200 //suggestHeight
            }
         };
         var mockContainer = {};
         mockContainer.getBoundingClientRect = function() {
            return {
               bottom: 324,
               top: 300//bottom of input
            };
         };
         self._container = mockContainer;
         
         self._orient = null;
         assert.equal(Suggest._private.calcOrient(self, {innerHeight: 900}), '-down');
         assert.equal(Suggest._private.calcOrient(self, {innerHeight: 400}), '-up');
         
         self._orient = null;
         self._options.suggestStyle = 'overInput';
         assert.equal(Suggest._private.calcOrient(self, {innerHeight: 900}), '-down');
         assert.equal(Suggest._private.calcOrient(self, {innerHeight: 400}), '-down');
         
         /* a special case, when suggest must opened down */
         suggestHeight = 400;
         assert.equal(Suggest._private.calcOrient(self, {innerHeight: 500}), '-down');
      });
   
      it('Suggest::_private.calcHeight', function() {
         var self = getComponentObject();
         var suggestHeight;
      
         self._children = {
            suggestionsContainer: {
               getBoundingClientRect: function() {
                  return {
                     height: suggestHeight
                  };
               },
            }
         };
         var mockContainer = {};
         mockContainer.getBoundingClientRect = function() {
            return {
               bottom: 324,
               top: 300//bottom of input
            };
         };
         self._container = mockContainer;
         self._height = 'auto';
         suggestHeight = 200;
         assert.equal(Suggest._private.calcHeight(self, '-down', {innerHeight: 900}), 'auto');
         assert.equal(Suggest._private.calcHeight(self, '-down', {innerHeight: 400}), '76px');
   
         assert.equal(Suggest._private.calcHeight(self, '-up', {innerHeight: 900}), 'auto');
         suggestHeight = 400;
         assert.equal(Suggest._private.calcHeight(self, '-up', {innerHeight: 400}), '300px');
      });
   
      it('Suggest::_inputActivated/inputClicked with autoDropDown', function(done) {
         var self = getComponentObject();
         var suggestComponent = new Suggest();
         var suggestState = false;
      
         self._options.searchParam = 'searchParam';
         self._options.autoDropDown = true;
         self._options.minSearchLength = 3;
         suggestComponent.saveOptions(self._options);
         suggestComponent._notify = function(event, val) {
            if (event === 'suggestStateChanged') {
               suggestState = val[0];
            }
         };
         suggestComponent._inputActivated();
   
         suggestComponent._dependenciesDeferred.addCallback(function() {
            assert.isTrue(suggestState);
            
            suggestComponent._changeValueHandler(null, '');
            assert.isTrue(suggestState);
   
            suggestComponent._close();
            suggestComponent._inputClicked();
            
            suggestComponent._dependenciesDeferred.addCallback(function() {
               assert.isTrue(suggestState);
               done();
            });
         });
      });
   
      it('Suggest::_changeValueHandler', function() {
         var self = getComponentObject();
         var suggestComponent = new Suggest();
      
         self._options.searchParam = 'searchParam';
         self._options.minSearchLength = 3;
         suggestComponent.saveOptions(self._options);
         suggestComponent._active = true;
   
         suggestComponent._changeValueHandler(null, 't');
         assert.equal(suggestComponent._searchValue, '');
   
         suggestComponent._changeValueHandler(null, 'te');
         assert.equal(suggestComponent._searchValue, '');
   
         suggestComponent._changeValueHandler(null, 'test');
         assert.equal(suggestComponent._searchValue, 'test');
   
         self._options.trim = true;
         suggestComponent._changeValueHandler(null, '  ');
         assert.equal(suggestComponent._searchValue, '');
      });
   
      it('Suggest::_private.loadDependencies', function(done) {
         var self = getComponentObject();

         Suggest._private.loadDependencies(self).addCallback(function() {
            assert.isTrue(self._dependenciesDeferred.isReady());
            done();
         });
      });
   
      it('Suggest::_private.processResultData', function() {
         var self = getComponentObject();
         self._notify = function() {};
         var queryRecordSet = new RecordSet({
            rawData: [{id: 1}, {id: 2}, {id: 3}],
            idProperty: 'id'
         });
         queryRecordSet.setMetaData({
            results: new Model({
               rawData: {
                  tabsSelectedKey: 'testId'
               }
            })
         });
         
         Suggest._private.precessResultData(self, {data: queryRecordSet});
   
         assert.equal(self._searchResult.data, queryRecordSet);
         assert.equal(self._tabsSelectedKey, 'testId');
   
         var queryRecordSetEmpty = new RecordSet();
         queryRecordSetEmpty.setMetaData({
            results: new Model({
               rawData: {
                  tabsSelectedKey: 'testId2'
               }
            })
         });
         Suggest._private.precessResultData(self, {data: queryRecordSetEmpty});
   
         assert.notEqual(self._searchResult.data, queryRecordSet);
         assert.equal(self._searchResult.data, queryRecordSetEmpty);
         assert.equal(self._tabsSelectedKey, 'testId2');
      });
   
      it('Suggest::_tabsSelectedKeyChanged', function() {
         var suggestComponent = new Suggest();
         var suggestActivated = false;
         suggestComponent.activate = function() {
            suggestActivated = true;
         };
         suggestComponent._filter = {};
         suggestComponent._filter.currentTab = null;
         suggestComponent._tabsSelectedKey = 'checkChanged';
   
         /* tabSelectedKey not changed, filter must be not changed too */
         suggestComponent._tabsSelectedKeyChanged(null, 'checkChanged');
         assert.equal(suggestComponent._filter.currentTab, null);
   
         /* tabSelectedKey changed, filter must be changed */
         suggestComponent._tabsSelectedKeyChanged(null, 'test');
         assert.equal(suggestComponent._filter.currentTab, 'test');
         assert.isTrue(suggestActivated);
      });
   
      it('Suggest::searchDelay on tabChange', function() {
         var suggestComponent = new Suggest();
         suggestComponent.activate = function() {};
         
         suggestComponent._tabsSelectedKeyChanged(null, 'test');
         assert.equal(suggestComponent._searchDelay, 0);
      });
   
      it('Suggest::_beforeUpdate', function() {
         var suggestComponent = new Suggest();
         suggestComponent._orient = 'down';
   
         suggestComponent._beforeUpdate({suggestState: false});
         assert.equal(suggestComponent._orient, null);
      });
      
   });
   
});