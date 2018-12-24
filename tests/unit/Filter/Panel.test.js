define(
   [
      'Controls/Filter/Button/Panel',
      'WS.Data/Collection/RecordSet',
      'Core/core-clone',
      'Core/Deferred'
   ],
   function(FilterPanel, RecordSet, Clone, Deferred) {
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

         var panel = new FilterPanel(config);
         panel._options = config;
         var isNotifyClose,
            filter;

         panel._notify = (e, args) => {
            if (e == 'close') {
               isNotifyClose = true;
            } else if (e == 'sendResult') {
               filter = args[0].filter;
            }
         };

         it('Init', function() {
            panel._beforeMount(config);
            assert.deepEqual(panel._items, config.items);
            assert.isTrue(panel._isChanged);
         });

         it('before update', function() {
            panel._items[2].visibility = false;
            panel._beforeMount(config);
            panel._beforeUpdate(config);
            assert.isTrue(panel._isChanged);
            assert.isTrue(panel._hasAdditionalParams);
         });

         it('apply', function() {
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

         it('apply history filter', function() {
            panel._beforeMount(config);
            panel._applyHistoryFilter();
            assert.deepEqual({ text: '123' }, filter);
         });

         it('reset and filter', function() {
            panel._beforeMount(config);
            panel._resetFilter();
            assert.deepEqual({}, FilterPanel._private.getFilter(panel));
            assert.isFalse(panel._isChanged);
         });

         it('isChangeValue', function() {
            panel._beforeMount(config);
            panel._resetFilter();
            assert.isFalse(FilterPanel._private.isChangedValue(panel._items));
         });

         it('without add params', function() {
            panel._beforeMount(config);
            panel._items[2].visibility = true;
            assert.isFalse(FilterPanel._private.hasAdditionalParams(panel._items));
         });

         it('recordSet', function() {
            var rs = new RecordSet({
                  idProperty: 'id',
                  rawData: items
               }),
               options = {};
            options.items = rs;
            options.additionalTemplate = template;
            var panel2 = new FilterPanel(options);
            panel2._beforeMount(options);
            panel2._beforeUpdate(options);
            assert.isTrue(panel2._isChanged);
            assert.isTrue(panel2._hasAdditionalParams);
         });

         it('valueChanged, visibilityChanged', function() {
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

            FilterPanel._private.resolveItems(self, options);
            assert.isTrue(options.items !== self._items);
            assert.equal(self._items[0], 'test');

            FilterPanel._private.resolveItems(self, {}, context);
            assert.isTrue(context.filterPanelOptionsField.options.items !== self._items);
            assert.equal(self._items[0], 'test');

            try {
               FilterPanel._private.resolveItems(self, {}, {});
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
                  options: {}
               }
            };

            FilterPanel._private.resolveItems(self, options, context);
            assert.isTrue(context.filterPanelOptionsField.options.items !== self._items);
            assert.equal(self._items[0], 'test');
            FilterPanel._private.resolveHistoryId(self, {}, context);
            assert.equal(self._historyId, undefined);
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
            assert.deepEqual(FilterPanel._private.prepareItems(changeItems), resetItems);
         });
      });
   }
);
