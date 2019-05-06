define(
   [
      'Controls/filterPopup',
      'Controls/filter',
      'Types/collection',
      'Core/core-clone',
      'Core/Deferred'
   ],
   function(filterPopup, filter, collection, Clone, Deferred) {
      describe('FilterPanelVDom', function() {
         var template = 'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/filterItemsTemplate';
         var config = {},
            items = [
               {
                  id: 'list',
                  value: 1,
                  resetValue: 1,
                  visibility: true
               },
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               }
            ];
         config.items = items;
         config.itemTemplate = template;
         config.additionalTemplate = template;

         function getFilterPanel(FPconfig) {
            var panel2 = new filterPopup.Panel(FPconfig);
            panel2.saveOptions(FPconfig);
            return panel2;
         }

         it('Init', function() {
            var panel = getFilterPanel(config);
            panel._beforeMount(config);
            assert.deepEqual(panel._items, config.items);
            assert.isTrue(panel._isChanged);
         });

         it('Init::historyItems', function(done) {
            var config2 = {
               items: items,
               historyId: 'TEST_PANEL_HISTORY_ID'
            };
            var panel2 = getFilterPanel(config2);
            filterPopup.Panel._private.loadHistoryItems(panel2, 'TEST_PANEL_HISTORY_ID').addCallback(function(items) {
               assert.equal(items.getCount(), 2);
               done();
            });
         });

         it('Init::historyItems fail loading', function(done) {
            var config2 = {
               items: items,
               historyId: 'TEST_PANEL_HISTORY_ID'
            };
            var panel2 = getFilterPanel(config2);
            let hUtilsLoader = filter.HistoryUtils.loadHistoryItems;
            filter.HistoryUtils.loadHistoryItems = () => { return new Deferred.fail(); };
            filterPopup.Panel._private.loadHistoryItems(panel2, 'TEST_PANEL_HISTORY_ID').addCallback(function() {
               assert.equal(panel2._historyItems.getCount(), 0);
               done();
            });
            filter.HistoryUtils.loadHistoryItems = hUtilsLoader;
         });

         it('before update', function() {
            var panel = getFilterPanel(config);
            panel._beforeMount(config);
            panel._items[2].visibility = false;
            panel._beforeUpdate(config);
            assert.isTrue(panel._isChanged);
            assert.isTrue(panel._hasAdditionalParams);
         });

         it('before update new historyId', function() {
            var changedConfig = Clone(config);
            changedConfig.historyId = 'new_history_id';
            var panel2 = getFilterPanel(config);
            panel2._beforeMount(config);
            assert.equal(panel2._historyId, undefined);
            panel2._beforeUpdate(changedConfig);
            assert.equal(panel2._historyId, changedConfig.historyId);
         });

         it('apply', function() {
            var panel = getFilterPanel(config),
               isNotifyClose, filter;
            panel._notify = (e, args, eCfg) => {
               if (e == 'close') {
                  isNotifyClose = true;
               } else if (e == 'sendResult') {
                  filter = args[0].filter;
               }
               assert.isTrue(eCfg.bubbling);
            };
            isNotifyClose = false;
            panel._beforeMount(config);
            panel._children = {
               formController: {
                  submit: () => Deferred.success([true])
               }
            };
            panel._applyFilter();
            assert.isFalse(isNotifyClose);
            panel._children = {
               formController: {
                  submit: () => Deferred.success([false])
               }
            };
            panel._applyFilter();
            assert.deepEqual({ text: '123' }, filter);
            assert.isTrue(isNotifyClose);
         });

         it('_applyHistoryFilter', function() {
            var panel = getFilterPanel(config),
               isNotifyClose, filter;
            panel._notify = (e, args) => {
               if (e == 'sendResult') {
                  filter = args[0].filter;
               } else if (e == 'close') {
                  isNotifyClose = true;
               }
            };
            panel._beforeMount(config);
            panel._children = { formController: { submit: ()=>{return Deferred.success([])} } };
            var historyItems = [
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: true
               }
            ];
            panel._applyHistoryFilter('applyHistoryFilter', historyItems);
            assert.deepEqual({ text: '123', bool: true }, filter);
            assert.isTrue(isNotifyClose);
         });

         it('reset and filter', function() {
            var changedItems = [
               {
                  id: 'list',
                  value: 5,
                  resetValue: 1
               },
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               }
            ];
            var resetedItems = [
               {
                  id: 'list',
                  value: 1,
                  resetValue: 1
               },
               {
                  id: 'text',
                  value: '',
                  resetValue: '',
                  visibility: false
               },
               {
                  id: 'bool',
                  value: false,
                  resetValue: false,
                  visibility: false
               }
            ];
            var panel2 = getFilterPanel({ items: changedItems });
            panel2._resetFilter();
            assert.deepEqual({}, filterPopup.Panel._private.getFilter(panel2._items));
            assert.deepEqual(panel2._items, resetedItems);
            assert.isFalse(panel2._isChanged);
         });

         it('isChangeValue', function() {
            var panel = getFilterPanel(config);
            panel._resetFilter();
            assert.isFalse(filterPopup.Panel._private.isChangedValue(panel._items));
         });

         it('without add params', function() {
            var panel = getFilterPanel(config);
            panel._beforeMount(config);
            panel._items[2].visibility = true;
            assert.isFalse(filterPopup.Panel._private.hasAdditionalParams(panel._items));
         });

         it('recordSet', function() {

            var rs = new collection.RecordSet({
                  idProperty: 'id',
                  rawData: items
               }),
               options = {};
            options.items = rs;
            options.additionalTemplate = template;
            var panel2 = new filterPopup.Panel(options);
            panel2._beforeMount(options);
            panel2._beforeUpdate(options);
            assert.isTrue(panel2._isChanged);
            assert.isTrue(panel2._hasAdditionalParams);
         });

         it('valueChanged, visibilityChanged', function() {
            var panel = getFilterPanel(config);
            panel._beforeMount(config);
            var newItems = Clone(items);
            newItems[0].value = 'testValue2';
            panel._itemsChangedHandler('itemsChanged', newItems);
            assert.deepEqual(panel._items[0].value, 'testValue2');
         });

         it('resolveItems', function() {
            var items = ['test'];
            var self = {};
            var options = {
               items: items
            };
            var context = {
               filterPanelOptionsField: {
                  options: {
                     items: items
                  }
               }
            };
            var errorCathed = false;

            filterPopup.Panel._private.resolveItems(self, options);
            assert.isTrue(options.items !== self._items);
            assert.equal(self._items[0], 'test');

            filterPopup.Panel._private.resolveItems(self, {}, context);
            assert.isTrue(context.filterPanelOptionsField.options.items !== self._items);
            assert.equal(self._items[0], 'test');

            try {
               filterPopup.Panel._private.resolveItems(self, {}, {});
            } catch (e) {
               errorCathed = true;
            }
            assert.isTrue(errorCathed);
         });
         it('resolveHistoryId', function() {
            var self = {};
            var options = { items: ['test'] };
            var context = {
               filterPanelOptionsField: {
                  options: {
                     historyId: 'testId'
                  }
               }
            };

            filterPopup.Panel._private.resolveItems(self, options, context);
            assert.isTrue(context.filterPanelOptionsField.options.items !== self._items);
            assert.equal(self._items[0], 'test');
            filterPopup.Panel._private.resolveHistoryId(self, {}, self._contextOptions);
            assert.equal(self._historyId, 'testId');
         });

         it('_private:prepareItems', function() {
            var changeItems = [
                  {
                     id: 'list',
                     value: 1,
                     resetValue: 1,
                     visibility: true
                  },
                  {
                     id: 'text',
                     value: '123',
                     resetValue: '',
                     visibility: true
                  },
                  {
                     id: 'bool',
                     value: true,
                     resetValue: false,
                     visibility: false
                  },
                  {
                     id: 'testObject',
                     value: {},
                     resetValue: {},
                     visibility: true
                  }
               ],
               resetItems = [
                  {
                     id: 'list',
                     value: 1,
                     resetValue: 1,
                     visibility: false
                  },
                  {
                     id: 'text',
                     value: '123',
                     resetValue: '',
                     visibility: true
                  },
                  {
                     id: 'bool',
                     value: true,
                     resetValue: false,
                     visibility: false
                  },
                  {
                     id: 'testObject',
                     value: {},
                     resetValue: {},
                     visibility: false
                  }
               ];
            assert.deepEqual(filterPopup.Panel._private.prepareItems(changeItems), resetItems);
         });

         it('_historyItemsChanged', function() {
            var panel = getFilterPanel(config);
            filterPopup.Panel._private.loadHistoryItems = (self, historyId) => {assert.equal(historyId, 'TEST_PANEL_HISTORY_ID')};
            panel._historyId = 'TEST_HISTORY_ID';
            panel._historyItemsChanged();
         });

         it('_private:isPassedValidation', function() {
            var validationResult = [null];
            assert.isTrue(filterPopup.Panel._private.isPassedValidation(validationResult));

            validationResult = [null, 'Дата заполнена некорректно.'];
            assert.isFalse(filterPopup.Panel._private.isPassedValidation(validationResult));

            validationResult = ['Дата заполнена некорректно.', null];
            assert.isFalse(filterPopup.Panel._private.isPassedValidation(validationResult));
         });
      });
   }
);
