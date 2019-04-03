define(['Controls/Container/Suggest/Layout', 'Types/collection', 'Types/entity', 'Env/Env', 'Controls/History/Service', 'Core/Deferred'], function(Suggest, collection, entity, Env, Service, Deferred) {

   describe('Controls.Container.Suggest.Layout', function() {
      var IDENTIFICATORS = [1, 2, 3];

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
      
      var getContainer = function(size) {
         return {
            getBoundingClientRect: function() {
               return {
                  toJSON: function() {
                     return size;
                  }
               };
            }
         };
      };
   
      var getDropDownContainer = function(height) {
         return {
            getBoundingClientRect: function() {
               return {
                  bottom: 0,
                     top: 0,
                     height: height
               };
            }
         };
      };

      Suggest._private.getRecentKeys = function() {
         return Deferred.success(IDENTIFICATORS);
      };

      var getHistorySource = Suggest._private.getHistoryService;

      Suggest._private.getHistoryService = function() {
         return {
            addCallback: function(func) {
               func({
                  update: function(item) {
                     item._isUpdateHistory = true;
                  }
               });
            }
         }
      };

      it('Suggest::getHistoryService', function(done) {
         getHistorySource({_options: {historyId: 'TEST_HISTORY_ID_GET_SOURCE'}}).addCallback(function(historyService) {
            assert.equal(12, historyService._recent);
            assert.equal('TEST_HISTORY_ID_GET_SOURCE', historyService._historyId);
            done();
         });
      });
   
      it('Suggest::_private.hasMore', function() {
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
         self._forceUpdate = function () {};
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
         suggestComponent._loading = true;
         suggestComponent._showContent = true;
         
         suggestComponent._close();
         assert.equal(suggestComponent._loading, null);
         assert.equal(suggestComponent._showContent, false);
      });
   
      it('Suggest::_private.open', function (done) {
         var self = getComponentObject();
         var state;
         self._options.suggestState = false;
         self._inputActive = true;
         self._notify = function(eventName, args) {
            state = args[0];
         };
         self._forceUpdate = function () {};
         Suggest._private.open(self);
         self._dependenciesDeferred.addCallback(function() {
            assert.isTrue(state);
   
            state = false;
            self._options.suggestState = false;
            Suggest._private.open(self);
            self._inputActive = false;
            self._dependenciesDeferred.addCallback(function() {
               assert.isFalse(state);
   
               self._inputActive = true;
               self._stackWithSearchResultsOpened = true;
               Suggest._private.open(self);
   
               self._dependenciesDeferred.addCallback(function() {
                  assert.isFalse(state);
                  done();
               });
            });
         });
      });
   
      it('Suggest::_private.shouldSearch', function () {
         var self = getComponentObject();
         self._options.minSearchLength = 3;
         
         self._inputActive = true;
         assert.isTrue(Suggest._private.shouldSearch(self, 'test'));
         assert.isFalse(Suggest._private.shouldSearch(self, 't'));
   
         self._inputActive = false;
         assert.isFalse(Suggest._private.shouldSearch(self, 'test'));
         assert.isFalse(Suggest._private.shouldSearch(self, 't'));
      });
   
      it('Suggest::_private.shouldShowSuggest', function () {
         var self = getComponentObject();
         var result = {
            data: new collection.List({items: [1,2,3]})
         };
         var emptyResult = {
            data: new collection.List()
         };
         
         //case 1. emptyTemplate - is null/undefined, searchValue - is empty string/null
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
         assert.isFalse(!!Suggest._private.shouldShowSuggest(self, emptyResult));
   
         //case 2. emptyTemplate is set, searchValue - is empty string/null
         self._options.emptyTemplate = {};
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, emptyResult));
         
         //case 3. emptyTemplate is set, searchValue - is set
         self._searchValue = 'test';
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, emptyResult));
   
         //case 4. emptyTemplate is set, search - is empty string, historyId is set
         self._searchValue = '';
         self._options.historyId = '123';
         assert.isFalse(!!Suggest._private.shouldShowSuggest(self, emptyResult));
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
   
         //emptyTemplate is set, search - is set, historyId is set
         self._searchValue = '123';
         self._options.historyId = '123';
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, emptyResult));
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
         
         //case 6. emptyTemplate is null/undefined, search - is empty string, historyId is set
         self._options.emptyTemplate = null;
         assert.isFalse(!!Suggest._private.shouldShowSuggest(self, emptyResult));
         assert.isTrue(!!Suggest._private.shouldShowSuggest(self, result));
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

      it('Suggest::_searchEnd', function() {
         var suggest = new Suggest();
         var errorFired = false;
         var options = {
           searchDelay: 300
         };
         suggest.saveOptions(options);
         suggest._searchDelay = 0;
         suggest._children = {};

         try {
            suggest._searchEnd();
         } catch (e) {
            errorFired = true;
         }

         assert.equal(options.searchDelay, suggest._searchDelay);
         assert.isFalse(errorFired);
      });
   
      it('Suggest::_private.searchErrback', function(done) {
         var self = getComponentObject();
         self._forceUpdate = function() {};
   
         self._loading = null;
         Suggest._private.searchErrback(self, {canceled: true});
         assert.isTrue(self._loading === null);
   
         self._loading = true;
         Suggest._private.searchErrback(self, {canceled: false});
         assert.isFalse(self._loading);
   
         self._forceUpdate = function() {
            assert.equal(self._emptyTemplate(), '<div class="controls-Suggest__empty"> Справочник недоступен </div>');
            done();
         };
         self._loading = true;
         Suggest._private.searchErrback(self, {canceled: true});
         assert.isFalse(self._loading);
      });
      
      it('Suggest::_private.setSearchValue', function() {
         var self = {};
         
         Suggest._private.setSearchValue(self, 'test');
         assert.equal(self._searchValue, 'test');
   
         Suggest._private.setSearchValue(self, '');
         assert.equal(self._searchValue, '');
      });
      
      it('Suggest::_searchErrback', function() {
         var suggest = new Suggest();
         suggest._loading = true;
         suggest._searchErrback({canceled: true});
         assert.isFalse(suggest._loading);
      });
   
      it('Suggest::check footer template', function(done) {
         var footerTpl;
         
         requirejs(['wml!Controls/Container/Suggest/Layout/footer'], function(result) {
            footerTpl = result;
            
            assert.equal(footerTpl(), '<div class="controls-Suggest__footer"></div>');
            assert.equal(footerTpl({showMoreButtonTemplate: 'testShowMore'}), '<div class="controls-Suggest__footer">testShowMore</div>');
            assert.equal(footerTpl({showMoreButtonTemplate: 'testShowMore', showSelectorButtonTemplate: 'testShowSelector'}), '<div class="controls-Suggest__footer">testShowMoretestShowSelector</div>');
            done();
         });
      });
   
      it('Suggest::_inputActivated/inputClicked with autoDropDown', function() {
         var self = getComponentObject();
         var suggestComponent = new Suggest();
         var suggestState = false;
      
         self._options.searchParam = 'searchParam';
         self._options.autoDropDown = true;
         self._options.minSearchLength = 3;
         self._options.readOnly = true;
         self._options.historyId = 'testFieldHistoryId';
         self._options.keyProperty = 'Identificator';

         suggestComponent._searchDelay = 300;
         suggestComponent.saveOptions(self._options);
         Suggest._private.setFilter(suggestComponent, {});
         suggestComponent._notify = function(event, val) {
            if (event === 'suggestStateChanged') {
               suggestState = val[0];
            }
         };

         suggestComponent._inputActivated();
         assert.equal(suggestComponent._searchDelay, 300);
         suggestComponent._options.readOnly = false;
         
         
         return new Promise(function(resolve) {
            suggestComponent._inputActivated();
            assert.equal(suggestComponent._searchDelay, 0);
   
            suggestComponent._dependenciesDeferred.addCallback(function() {
               assert.isTrue(suggestState);
               assert.deepEqual(suggestComponent._filter['historyKeys'], IDENTIFICATORS);
      
               suggestComponent._changeValueHandler(null, '');
               assert.isTrue(suggestState);
               assert.equal(suggestComponent._searchValue, '');
      
               suggestComponent._close();
               suggestComponent._filter = {};
               suggestComponent._inputClicked();
      
               suggestComponent._dependenciesDeferred.addCallback(function() {
                  assert.isTrue(suggestState);
                  assert.deepEqual(suggestComponent._filter['historyKeys'], IDENTIFICATORS);
         
                  suggestComponent._close();
                  self._options.readOnly = true;
                  suggestComponent._inputActivated();
                  suggestComponent._dependenciesDeferred.addCallback(function() {
                     assert.isFalse(suggestState);
            
                     suggestComponent._inputClicked();
                     suggestComponent._dependenciesDeferred.addCallback(function() {
                        assert.isFalse(suggestState);
               
                        suggestComponent._options.historyId = '';
                        suggestComponent._filter = {};
                        suggestComponent._options.readOnly = false;
                        suggestComponent._inputActivated();
               
                        suggestComponent._dependenciesDeferred.addCallback(function() {
                           assert.isTrue(suggestState);
                           assert.deepEqual(suggestComponent._filter, {searchParam: ''});
   
                           suggestComponent._options.suggestState = true;
                           suggestComponent._filter = {};
                           suggestComponent._inputActivated();
   
                           suggestComponent._dependenciesDeferred.addCallback(function() {
                              assert.deepEqual(suggestComponent._filter, {});
                              resolve();
                           });
                        });
                     });
                  });
               });
            });
         });
      });
   
      it('Suggest::_changeValueHandler', function() {
         var self = getComponentObject();
         var suggestComponent = new Suggest();
      
         self._options.searchParam = 'searchParam';
         self._options.keyProperty = 'Identificator';
         self._options.minSearchLength = 3;
         self._options.searchDelay = 300;
         
         suggestComponent.saveOptions(self._options);
         suggestComponent._inputActive = true;
         suggestComponent._searchDelay = 0;
   
         suggestComponent._changeValueHandler(null, 't');
         assert.equal(suggestComponent._searchValue, '');
         assert.equal(suggestComponent._searchDelay, 300);
   
         suggestComponent._changeValueHandler(null, 'te');
         assert.equal(suggestComponent._searchValue, '');
   
         suggestComponent._changeValueHandler(null, 'test');
         assert.equal(suggestComponent._searchValue, 'test');
   
         self._options.trim = true;
         suggestComponent._changeValueHandler(null, '  ');
         assert.equal(suggestComponent._searchValue, '');
   
         self._options.historyId = 'testFieldHistoryId';
         suggestComponent._changeValueHandler(null, 'te');
         assert.equal(suggestComponent._searchValue, '');
         assert.deepEqual(suggestComponent._filter.historyKeys, IDENTIFICATORS);
         
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
         var queryRecordSet = new collection.RecordSet({
            rawData: [{id: 1}, {id: 2}, {id: 3}],
            idProperty: 'id'
         });
         queryRecordSet.setMetaData({
            results: new entity.Model({
               rawData: {
                  tabsSelectedKey: 'testId',
                  switchedStr: 'testStr'
               }
            })
         });
         
         Suggest._private.processResultData(self, {data: queryRecordSet});
   
         assert.equal(self._searchResult.data, queryRecordSet);
         assert.equal(self._tabsSelectedKey, 'testId');
         assert.equal(self._misspellingCaption, 'testStr');
   
         var queryRecordSetEmpty = new collection.RecordSet();
         queryRecordSetEmpty.setMetaData({
            results: new entity.Model({
               rawData: {
                  tabsSelectedKey: 'testId2',
                  switchedStr: 'testStr2'
               }
            })
         });
         self._suggestMarkedKey = 'test';
         Suggest._private.processResultData(self, {data: queryRecordSetEmpty});
   
         assert.equal(self._suggestMarkedKey, null);
         assert.notEqual(self._searchResult.data, queryRecordSet);
         assert.equal(self._searchResult.data, queryRecordSetEmpty);
         assert.equal(self._tabsSelectedKey, 'testId2');
         assert.equal(self._misspellingCaption, 'testStr2');
      });
   
      it('Suggest::_tabsSelectedKeyChanged', function() {
         var suggestComponent = new Suggest();
         var suggestActivated = false;
         var updated = false;
         suggestComponent.activate = function() {
            suggestActivated = true;
         };
         suggestComponent._forceUpdate = function() {
            updated = true;
         };
         suggestComponent._filter = {};
         suggestComponent._filter.currentTab = null;
         suggestComponent._tabsSelectedKey = 'checkChanged';
   
         /* tabSelectedKey not changed, filter must be not changed too */
         suggestComponent._tabsSelectedKeyChanged('checkChanged');
         assert.equal(suggestComponent._filter.currentTab, null);
         assert.isTrue(updated);
   
         /* tabSelectedKey changed, filter must be changed */
         suggestComponent._suggestMarkedKey = 'test';
         suggestComponent._tabsSelectedKeyChanged('test');
         assert.equal(suggestComponent._filter.currentTab, 'test');
         assert.isTrue(suggestActivated);
         assert.isTrue(suggestComponent._suggestMarkedKey === null);
      });
   
      it('Suggest::searchDelay on tabChange', function() {
         var suggestComponent = new Suggest();
         suggestComponent.activate = function() {};
         
         suggestComponent._tabsSelectedKeyChanged('test');
         assert.equal(suggestComponent._searchDelay, 0);
      });
   
      it('Suggest::_beforeUpdate', function() {
         var options = {
            emptyTemplate: 'anyTpl',
            footerTemplate: 'anyTp',
            suggestState: true,
            value: '',
            trim: true,
            searchParam: 'testSearchParam',
            minSearchLength: 3
         };
         Suggest._private.loadDependencies = function() {return Deferred.success(true)};
         var suggestComponent = new Suggest(options);
         suggestComponent.saveOptions(options);
         suggestComponent._loading = true;
         suggestComponent._showContent = true;
         suggestComponent._dependenciesDeferred = true;
         suggestComponent._inputActive = true;
         suggestComponent._suggestMarkedKey = 'test'

         suggestComponent._beforeUpdate({suggestState: false, emptyTemplate: 'anotherTpl', footerTemplate: 'anotherTpl',  value: 'te'});
         assert.isFalse(suggestComponent._showContent, null);
         assert.equal(suggestComponent._loading, null);
         assert.equal(suggestComponent._dependenciesDeferred, null);
         assert.equal(suggestComponent._searchValue, '');
         assert.equal(suggestComponent._filter, null);
         assert.equal(suggestComponent._suggestMarkedKey, null);
   
         suggestComponent._beforeUpdate({suggestState: false, emptyTemplate: 'anotherTpl', footerTemplate: 'anotherTpl', value: '   '});
         assert.equal(suggestComponent._filter, null);
         assert.equal(suggestComponent._searchValue, '');
         
         suggestComponent._beforeUpdate({suggestState: false, emptyTemplate: 'anotherTpl', footerTemplate: 'anotherTpl', value: 'test'});
         assert.deepEqual(suggestComponent._filter, {testSearchParam: 'test'});
         assert.equal(suggestComponent._searchValue, 'test');
   
         suggestComponent._options.value = 'test';
         suggestComponent._beforeUpdate({suggestState: false, emptyTemplate: 'anotherTpl', footerTemplate: 'anotherTpl',  value: ''});
         assert.deepEqual(suggestComponent._filter, {testSearchParam: ''});
         assert.equal(suggestComponent._searchValue, '');
      });
   
      it('Suggest::_updateSuggestState', function() {
         var compObj = getComponentObject();
         compObj._options.fitler = {};
         compObj._options.searchParam = 'testSearchParam';
         
         var suggestComponent = new Suggest();
         suggestComponent.saveOptions(compObj._options);
         suggestComponent._searchValue = 'te';
         
         compObj._options.autoDropDown = true;
         compObj._options.suggestState = true;
         Suggest._private.updateSuggestState(suggestComponent);
         assert.equal(suggestComponent._filter, null);
   
         compObj._options.suggestState = false;
         Suggest._private.updateSuggestState(suggestComponent);
         assert.deepEqual(suggestComponent._filter, {testSearchParam: 'te'});
   
         compObj._options.autoDropDown = false;
         suggestComponent._filter = {};
         Suggest._private.updateSuggestState(suggestComponent);
         assert.deepEqual(suggestComponent._filter, {});
      });
   
      it('Suggest::_missSpellClick', function() {
         var suggestComponent = new Suggest();
         var value;
   
         suggestComponent._notify = function(event, val) {
            if (event === 'valueChanged') {
               value = val[0];
            }
         };
         suggestComponent._misspellingCaption = 'test';
         suggestComponent._missSpellClick();
         
         assert.equal(value, 'test');
         assert.equal(suggestComponent._misspellingCaption, '');
      });
   
      it('Suggest::_private.setMissSpellingCaption', function() {
         var self = {};
         
         Suggest._private.setMissSpellingCaption(self, 'test');
         assert.equal(self._misspellingCaption, 'test');
      });

      it('Suggest::_select', function() {
         var
            item = {
               _isUpdateHistory: false
            },
            suggestComponent = new Suggest();

         suggestComponent._inputActive = true;
         suggestComponent._notify = function(eventName) {
            if (eventName === 'choose') {
               assert.isFalse(suggestComponent._inputActive);
            }
         };
         suggestComponent._select(item);
         assert.isFalse(item._isUpdateHistory);
         assert.isFalse(suggestComponent._inputActive);

         suggestComponent._options.historyId = 'testFieldHistoryId';
         suggestComponent._select(item);
         assert.isTrue(item._isUpdateHistory);
      });
   
      it('Suggest::_markedKeyChangedHandler', function() {
         var suggestComponent = new Suggest();
         suggestComponent._markedKeyChangedHandler(null, 'test');
         assert.equal(suggestComponent._suggestMarkedKey, 'test');
   
         suggestComponent._markedKeyChangedHandler(null, 'test2');
         assert.equal(suggestComponent._suggestMarkedKey, 'test2');
      });
   
      it('Suggest::_stackWithSearchResultsClosed', function() {
         var suggestComponent = new Suggest();
         suggestComponent._stackWithSearchResultsOpened = true;
         suggestComponent._stackWithSearchResultsClosed();
         assert.isFalse(suggestComponent._stackWithSearchResultsOpened);
      });
   
   
      it('Suggest::_keyDown', function() {
         var suggestComponent = new Suggest();
         var eventPreventDefault = false;
         var eventStopPropagation = false;
         var suggestStateChanged = false;
         var eventTriggered = false;
         suggestComponent._children = {
            inputKeydown: {
               start: function() {
                  eventTriggered = true;
               }
            }
         };

         suggestComponent._notify = (event) => {
            if (event === 'suggestStateChanged') {
               suggestStateChanged = true;
            }
         };
         
         function getEvent(keyCode) {
            return {
               nativeEvent: {
                  keyCode: keyCode
               },
               preventDefault: () => {
                  eventPreventDefault = true;
               },
               stopPropagation: () => {
                  eventStopPropagation = true;
               }
            };
         }
         suggestComponent._keydown(getEvent(Env.constants.key.down));
         assert.isFalse(eventPreventDefault);
         assert.isFalse(eventStopPropagation);
   
         suggestComponent._options.suggestState = true;
   
         suggestComponent._keydown(getEvent(Env.constants.key.down));
         assert.isTrue(eventPreventDefault);
         assert.isTrue(eventStopPropagation);
         eventPreventDefault = false;
         
         suggestComponent._keydown(getEvent(Env.constants.key.up));
         assert.isTrue(eventPreventDefault);
         eventPreventDefault = false;
         
         suggestComponent._keydown(getEvent(Env.constants.key.enter));
         assert.isFalse(eventPreventDefault);
         eventPreventDefault = false;
   
         suggestComponent._suggestMarkedKey = 'test';
         suggestComponent._keydown(getEvent(Env.constants.key.enter));
         assert.isTrue(eventPreventDefault);
   
         eventPreventDefault = false;
         suggestComponent._keydown(getEvent('test'));
         assert.isFalse(eventPreventDefault);
         assert.isTrue(eventTriggered);

         eventPreventDefault = false;
         suggestComponent._keydown(getEvent(Env.constants.key.esc));
         assert.isTrue(suggestStateChanged);
      });

      it('Suggest::_private.openWithHistory', function () {
         var
            isCallOpenPopup = false,
            suggestComponent = new Suggest(),
            getRecentKeys = Suggest._private.getRecentKeys,
            _privateOpen = Suggest._private.open;

         Suggest._private.open = function() {
            isCallOpenPopup = true;
         };

         suggestComponent._filter = {};
         Suggest._private.openWithHistory(suggestComponent);
         assert.isTrue(isCallOpenPopup);

         isCallOpenPopup = false;
         suggestComponent._filter = {};
         suggestComponent._options.suggestState = true;
         Suggest._private.openWithHistory(suggestComponent);
         assert.isTrue(isCallOpenPopup);

         isCallOpenPopup = false;
         suggestComponent._filter = {};
         Suggest._private.getRecentKeys = function() {
            return Deferred.success([]);
         };
         Suggest._private.openWithHistory(suggestComponent);
         assert.isFalse(isCallOpenPopup);

         suggestComponent._options.suggestState = false;
         Suggest._private.openWithHistory(suggestComponent);
         assert.isTrue(isCallOpenPopup);

         isCallOpenPopup = false;
         suggestComponent._filter.historyKeys = [7, 8];
         Suggest._private.openWithHistory(suggestComponent);
         assert.isTrue(isCallOpenPopup);

         isCallOpenPopup = false;
         suggestComponent._filter.historyKeys = [7, 8];
         suggestComponent._options.suggestState = true;
         Suggest._private.openWithHistory(suggestComponent);
         assert.isFalse(isCallOpenPopup);

         isCallOpenPopup = false;
         suggestComponent._filter.historyKeys = [7, 8];
         Suggest._private.getRecentKeys = getRecentKeys;
         Suggest._private.openWithHistory(suggestComponent);
         assert.isFalse(isCallOpenPopup);

         Suggest._private.open = _privateOpen;
      });

      it('Suggest::_inputClicked', function() {
         var suggestComponent = new Suggest();

         suggestComponent._inputClicked();
         assert.isTrue(suggestComponent._inputActive);
      });
   });
});