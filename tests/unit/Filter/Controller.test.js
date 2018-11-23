define(['Controls/Filter/Controller'], function(Filter) {
   
   describe('Controls.Filter.Controller', function () {
      
      it('_itemsChanged', function () {
         var filterLayout = new Filter();
         var items = [{
            id: 'testKey',
            value: 'testValue',
            resetValue: ''
         }];
         var filterChangedNotifyed = false;
         filterLayout._notify = function() {
            filterChangedNotifyed = true;
         };
         filterLayout._itemsChanged(null, items);
         assert.deepEqual(filterLayout._filter, {testKey: 'testValue'});
         assert.isTrue(filterChangedNotifyed);
      });
      
      it('_private.getItemsByOption::array', function () {
         var opt = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }];
         
         var items = Filter._private.getItemsByOption(opt);
         
         assert.deepEqual(items, opt);
      });
      
      it('_private.getItemsByOption::function', function () {
         var opt = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }];
         
         var returnOptFunc = function() {
            return [{
               id: 'testId',
               value: '',
               resetValue: ''
            }];
         };
         
         var items = Filter._private.getItemsByOption(returnOptFunc);
         assert.deepEqual(items, opt);
      });
      
      it('_private.getItemsByOption::array with history', function () {
         var opt = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }];
         var history = [{
            id: 'testId',
            value: 'testValue',
            resetValue: ''
         }];
         var items = Filter._private.getItemsByOption(opt, history);
         assert.deepEqual(items, history);
      });
      
      it('_private.getItemsByOption::function with history', function () {
         var returnOptFunc = function(history) {
            return [{
               id: 'testId',
               value: history[0].value,
               resetValue: ''
            }];
         };
         var history = [{
            id: 'testId',
            value: 'testValue',
            resetValue: ''
         }];
         var items = Filter._private.getItemsByOption(returnOptFunc, history);
         assert.deepEqual(items, history);
      });

      it('_private.getFilterByItems(filterButtonItems)', function () {
         var fbItems = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            resetValue: ''
         }, {
            id: 'testId3',
            value: '',
            resetValue: '',
            visibility: false
         }, {
            id: 'testId4',
            value: 'testValue',
            resetValue: ''
         }];

         var filter = Filter._private.getFilterByItems(fbItems);
         assert.deepEqual(filter, {testId2: 'testValue', testId4: 'testValue'});
      });

      it('_private.getFilterByItems(fastFilterItems)', function () {
         var fastFilterItems = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            resetValue: ''
         }];
         var filter = Filter._private.getFilterByItems(null, fastFilterItems);
         assert.deepEqual(filter, {testId2: 'testValue'});
      });
      
      it('_private.getFilterByItems(filterButtonItems, fastFilterItems)', function () {
         var fastFilterItems = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            resetValue: ''
         }];
         
         var fbItems = [{
            id: 'testId2',
            value: '',
            resetValue: ''
         }, {
            id: 'testId3',
            value: 'testValue',
            resetValue: ''
         }];
         
         var filter = Filter._private.getFilterByItems(fbItems, fastFilterItems);
         assert.deepEqual(filter, {testId2: 'testValue', testId3: 'testValue'});
      });
      
      it('_private.mergeFilterItems', function () {
         var items = [{
            id: 'testId',
            value: '',
            textValue: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            textValue: '',
            resetValue: '',
            visibility: false
         },
            {
               id: 'testId3',
               value: 'testValue2',
               textValue: 'textTextValue',
               resetValue: ''
            }];
         
         var history = [{
            id: 'testId',
            value: 'testValue',
            resetValue: '',
            textValue: 'textTextValue'
         }, {
            id: 'testId2',
            value: 'testValue1',
            resetValue: '',
            textValue: '',
            visibility: true
         }];
         
         var result = [{
            id: 'testId',
            value: 'testValue',
            textValue: 'textTextValue',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue1',
            textValue: '',
            resetValue: '',
            visibility: true
         },
            {
               id: 'testId3',
               value: 'testValue2',
               textValue: 'textTextValue',
               resetValue: ''
            }];
         
         Filter._private.mergeFilterItems(items, history);
         assert.deepEqual(result, items);
      });
   
      it('_filterChanged', function() {
         var filterLayout = new Filter();
         var filterChangedNotifyed = false;
         var resultFilter = {test: 'test'};
         filterLayout._notify = function() {
            filterChangedNotifyed = true;
         };
         
         filterLayout._filterChanged(null, {test: 'test'});
         
         assert.deepEqual(filterLayout._filter, resultFilter);
         assert.isTrue(filterChangedNotifyed);
      });
   
      it('_private.updateFilterItems', function() {
         var self = {};
         
         var fastFilterItems = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            resetValue: ''
         }];
   
         var fbItems = [{
            id: 'testId2',
            value: '',
            resetValue: ''
         }, {
            id: 'testId3',
            value: 'testValue',
            resetValue: ''
         }];
         
         var newItems = [{
            id: 'testId2',
            value: '123',
            resetValue: ''
         }];
         
         self._filterButtonItems = fbItems;
         self._fastFilterItems = fastFilterItems;
         Filter._private.updateFilterItems(self, newItems);
         
         assert.isTrue(self._filterButtonItems !== fbItems, 'FilterButton items must be changed');
         assert.isTrue(self._fastFilterItems !== fastFilterItems, 'FastFilter items items must be changed');
         assert.equal(self._fastFilterItems[1].value, '123');
         assert.equal(self._filterButtonItems[0].value, '123');
      });

      it('minimize filter items', function() {
         var items = [{
            id: 'testId',
            value: '',
            textValue: '',
            source: [],
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            textValue: '',
            resetValue: '',
            keys: ['1', '2', '3'],
            visibility: false
         }, {
            id: 'testId3',
            value: 'testValue2',
            textValue: 'textTextValue',
            resetValue: ''
         }];
         var minItems = Filter._private.minimizeFilterItems(items);
         assert.deepEqual(minItems, [{
            id: 'testId',
            value: '',
            textValue: '',
            visibility: undefined
         }, {
            id: 'testId2',
            value: 'testValue',
            textValue: '',
            visibility: false
         }, {
            id: 'testId3',
            value: 'testValue2',
            textValue: 'textTextValue',
            visibility: undefined
         }]);
      });

      it('setFilterButtonItems', function() {
         var fastFilterItems = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            textValue: 'test2',
            resetValue: ''
         }];

         var fbItems = [{
            id: 'testId2',
            value: '',
            textValue: 'test2',
            resetValue: ''
         }, {
            id: 'testId3',
            value: 'testValue',
            resetValue: ''
         }];
         Filter._private.setFilterButtonItems(fbItems, fastFilterItems);
         assert.deepEqual(fbItems, [{
            id: 'testId2',
            value: '',
            textValue: '',
            resetValue: ''
         }, {
            id: 'testId3',
            value: 'testValue',
            resetValue: ''
         }]);
      });

      it('prepareHistoryItems', function() {
         var fastFilterItems = [{
            id: 'testId',
            value: '',
            resetValue: ''
         }, {
            id: 'testId2',
            value: 'testValue',
            textValue: 'test2',
            resetValue: ''
         }];

         var fbItems = [{
            id: 'testId2',
            value: '',
            textValue: '',
            resetValue: ''
         }, {
            id: 'testId3',
            value: 'testValue',
            resetValue: ''
         }];
         var historyItems = Filter._private.prepareHistoryItems(fbItems, fastFilterItems);
         assert.deepEqual(historyItems, [{
            id: 'testId2',
            value: '',
            textValue: 'test2',
            visibility: undefined
         }, {
            id: 'testId3',
            value: 'testValue',
            textValue: undefined,
            visibility: undefined
         }]);
      });

   });

});