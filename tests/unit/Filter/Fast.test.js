define(
   [
      'Controls/Filter/Fast',
      'Types/source',
      'Core/core-clone',
      'Types/collection',
      'Controls/History/Source'
   ],
   function(FastData, sourceLib, Clone, collection, HistorySource) {
      describe('FastFilterVDom', function() {
         var items = [
            [{ key: 0, title: 'все страны' },
               { key: 1, title: 'Россия' },
               { key: 2, title: 'США' },
               { key: 3, title: 'Великобритания' }
            ],

            [{ key: 0, title: 'все жанры' },
               { key: 1, title: 'фантастика' },
               { key: 2, title: 'фэнтези' },
               { key: 3, title: 'мистика' }
            ]
         ];
         var source = [
            {
               id: 'first',
               value: 'Россия',
               resetValue: 'все страны',
               textValue: '',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: new sourceLib.Memory({
                     data: items[0],
                     idProperty: 'key'
                  })
               }
            },
            {
               id: 'second',
               resetValue: 'фэнтези',
               value: 'фэнтези',
               textValue: '',
               properties: {
                  items: items[1],
                  keyProperty: 'title',
                  displayProperty: 'title'
               }
            },
            {
               id: 'third',
               value: 0,
               resetValue: 0,
               textValue: '',
               properties: {
                  keyProperty: 'key',
                  displayProperty: 'title',
                  filter: {
                     key: 0
                  },
                  source: new sourceLib.Memory({
                     data: items[0],
                     idProperty: 'key'
                  })
               }
            },
            {
               id: 'fourth',
               value: 'все страны',
               resetValue: 'все страны',
               textValue: '',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: new sourceLib.Memory({
                     data: items[0],
                     idProperty: 'key'
                  }),
                  navigation: {view: 'page', source: 'page', sourceConfig: {pageSize: 2, page: 0, hasMore: false}}
               }
            }
         ];

         var config = {};
         config.source = new sourceLib.Memory({
            idProperty: 'id',
            data: source
         });

         let configItems = {
            items: [{
               id: 'first',
               value: ['Россия'],
               resetValue: ['все страны'],
               textValue: '',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  multiSelect: true,
                  source: new sourceLib.Memory({
                     data: items[0],
                     idProperty: 'key'
                  })
               }}
            ]
         };

         var getFastFilter = function(configFastFilter) {
            var fastFilter = new FastData(configFastFilter);
            fastFilter.saveOptions(configFastFilter);
            return fastFilter;
         };

         var getFastFilterWithItems = function(config) {
            var fastFilter = new FastData(config);
            fastFilter._beforeMount(config);
            fastFilter._configs[0]._items = new collection.RecordSet({
               rawData: Clone(items[0]),
               idProperty: 'title'
            });
            fastFilter.lastOpenIndex = 0;
            fastFilter._children.DropdownOpener = {
               close: setTrue.bind(this, assert),
               open: setTrue.bind(this, assert)
            };
            return fastFilter;
         };

         var fastData = new FastData(config);
         var isFilterChanged;

         var configWithItems = {};
         configWithItems.items = source;
         var fastDataItems = new FastData(configWithItems);
         fastDataItems._beforeMount(configWithItems);

         fastData._notify = (e, args) => {
            if (e == 'filterChanged') {
               isFilterChanged = true;
            }
         };
         fastData._beforeMount(config);
         fastData._children.DropdownOpener = {
            close: setTrue.bind(this, assert),
            open: setTrue.bind(this, assert)
         };

         it('beforeUpdate new items property not changed', function(done) {
            var fastFilter = getFastFilter(configWithItems);
            fastFilter._beforeMount(configWithItems).addCallback(function(result) {
               assert.isTrue(!!result.configs);
               assert.equal(Object.keys(result.configs).length, Object.keys(fastFilter._configs).length);
               var newConfigItems = Clone(configWithItems);
               newConfigItems.items[0].value = 'США';
               fastFilter._beforeUpdate(newConfigItems);
               assert.equal(fastFilter._items.at(0).value, 'США');
               fastFilter._beforeUpdate({});
               done();
            });
         });

         it('beforeUpdate new items property changed', function(done) {
            var fastFilter = getFastFilter(configWithItems);
            fastFilter._beforeMount(configWithItems);
            var newConfigItems = Clone(configWithItems);
            newConfigItems.items[0].value = 'США';
            newConfigItems.items[0].properties.navigation = {page: 2};
            fastFilter._beforeUpdate(newConfigItems).addCallback(function() {
               assert.equal(fastFilter._items.at(0).value, 'США');
               done();
            });
         });

         it('beforeUpdate new source', function(done) {
            var fastFilter = getFastFilter(config),
               newConfigSource = Clone(config),
               newSource = Clone(source);
            fastFilter._beforeMount(config);
            newSource[0].value = 'США';
            newConfigSource.source = new sourceLib.Memory({
               idProperty: 'id',
               data: newSource
            });
            fastFilter._beforeUpdate(newConfigSource).addCallback(function() {
               assert.equal(fastFilter._items.at(0).get('value'), 'США');
               done();
            });
         });

         it('load config', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), items[0]);
                  done();
               });
            });
         });

         it('load config from items', function(done) {
            FastData._private.reload(fastDataItems).addCallback(function(result) {
               assert.isTrue(!!result.configs);
               assert.equal(Object.keys(result.configs).length, Object.keys(fastData._configs).length);
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), items[0]);
                  done();
               });
            });
         });

         it('load config from items with filter', function(done) {
            FastData._private.reload(fastDataItems).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(2), 0).addCallback(function() {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), [{ key: 0, title: 'все страны' }]);
                  done();
               });
            });
         });

         it('load config from items with navigation', function(done) {
            FastData._private.reload(fastDataItems).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(3), 0).addCallback(function() {
                  assert.equal(fastData._configs[0]._items.getCount(), 2);
                  done();
               });
            });
         });

         it('get filter', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  var result = FastData._private.getFilter(fastData._items);
                  assert.deepEqual(result, { 'first': fastData._items.at(0).get('value') });
                  done();
               });
            });
         });

         it('notifyChanges', function() {
            var fastFilter = getFastFilter(config);
            var itemsChanges = { id: '1', value: '1', resetValue: '2' };
            fastFilter._notify = function(e, data) {
               if (e === 'filterChanged') {
                  assert.deepEqual(data[0], { 1: '1' });
               } else if (e === 'itemsChanged') {
                  assert.deepEqual(data[0], [itemsChanges]);
               }
            };
            FastData._private.notifyChanges(fastFilter, [itemsChanges]);
         });

         it('setValue', function() {
            let fastData2 = getFastFilterWithItems(configItems);
            FastData._private.setValue(fastData2, ['Россия', 'Великобритания']);
            assert.deepEqual(fastData2._items.at(0).value, ['Россия', 'Великобритания']);
         });

         it('onResult itemClick', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  fastData.lastOpenIndex = 0;
                  isFilterChanged = false;
                  fastData._onResult({ data: [fastData._configs[0]._items.at(2)], action: 'itemClick' });
                  assert.isTrue(isFilterChanged);
                  assert.equal(items[0][2].title, 'США');
                  done();
               });
            });
         });

         it('onResult applyClick', function() {
            let fastData2 = getFastFilterWithItems(configItems);
            let selectedItems = [
               { key: 1, title: 'Россия' },
               { key: 3, title: 'Великобритания' }
            ];
            fastData2._onResult({ data: selectedItems, action: 'applyClick' });
            assert.deepEqual(fastData2._items.at(0).value, ['Россия', 'Великобритания']);

            fastData2._onResult({ data: [], action: 'applyClick' });
            assert.deepEqual(fastData2._items.at(0).value, ['все страны']);
         });

         it('onResult selectorResult', function() {
            let fastData2 = getFastFilterWithItems(configItems);
            let selectedItems = new collection.RecordSet({
               idProperty: 'key',
               rawData: [
                  { key: 1, title: 'Россия' },
                  { key: 5, title: 'Франция' }
               ]
            });
            fastData2._onResult({ data: selectedItems, action: 'selectorResult' });
            assert.deepEqual(fastData2._items.at(0).value, ['Россия', 'Франция']);
            assert.deepEqual(fastData2._configs[0]._items.getCount(), 5);
            assert.deepEqual(fastData2._configs[0]._items.at(0).getRawData(), { key: 5, title: 'Франция' });
         });

         it('selectItems', function() {
            let configMultiSelect = Clone(configItems);
            let fastData2 = getFastFilterWithItems(configMultiSelect);

            // multi selection
            FastData._private.selectItems.call(fastData2, [
               { key: 1, title: 'Россия' },
               { key: 2, title: 'США' },
               { key: 3, title: 'Великобритания' }]);
            assert.deepEqual(fastData2._items.at(0).value, ['Россия', 'США', 'Великобритания']);

            // single selection
            configMultiSelect.items[0].properties.multiSelect = false;
            fastData2 = getFastFilterWithItems(configMultiSelect);
            FastData._private.selectItems.call(fastData2, [{ key: 3, title: 'Великобритания' }]);
            assert.deepEqual(fastData2._items.at(0).value, 'Великобритания');

            // empty selection
            fastData2 = getFastFilterWithItems(configMultiSelect);
            FastData._private.selectItems.call(fastData2, []);
            assert.deepEqual(fastData2._items.at(0).value, ['все страны']);
         });

         it('setText', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function(items) {
                  fastData._setText();
                  assert.equal(fastData._configs[0].text, 'США');
                  assert.equal(fastData._configs[1].text, 'фэнтези');
                  assert.equal(fastData._configs[2].text, 'все страны');
                  assert.equal(fastData._configs[3].text, 'все страны');
                  done();
               });
            });
         });

         it('setText multiSelect', function() {
            let configMultiSelect = Clone(config);
            configMultiSelect.items = [{
               id: 'first',
               value: ['Россия'],
               resetValue: ['все страны'],
               textValue: '',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: new sourceLib.Memory({
                     data: items[0],
                     idProperty: 'key'
                  })
               }
            }];
            let fastDataMultiSelect = new FastData(configMultiSelect);
            fastDataMultiSelect._beforeMount(configMultiSelect);
            fastDataMultiSelect._configs[0]._items = items[0];
            fastDataMultiSelect._setText();
            assert.equal(fastDataMultiSelect._configs[0].text, 'Россия');
            assert.equal(fastDataMultiSelect._configs[0].title, 'Россия');
            assert.equal(fastDataMultiSelect._configs[0].hasMoreText, '');

            configMultiSelect.items[0].value = ['Россия', 'Великобритания'];
            fastDataMultiSelect._beforeMount(configMultiSelect);
            fastDataMultiSelect._configs[0]._items = items[0];
            fastDataMultiSelect._setText();
            assert.equal(fastDataMultiSelect._configs[0].text, 'Россия');
            assert.equal(fastDataMultiSelect._configs[0].title, 'Россия, Великобритания');
            assert.equal(fastDataMultiSelect._configs[0].hasMoreText, ', еще 1');
         });

         it('reset', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  fastData.lastOpenIndex = 0;
                  fastData._container = { children: [] };
                  fastData._reset(null, fastData._items.at(0), 0);
                  assert.equal(fastData._items.at(0).get('resetValue'), 'все страны');
                  done();
               });
            });
         });

         it('open dropdown', function() {
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  fastData._open('itemClick', fastData._items.at(0), 0);
               });
            });
         });

         it('_private::itemsPropertiesChanged', function() {
            let oldItems = Clone(source);
            let newItems = Clone(source);
            let newItems2 = Clone(source);
            let newItems3 = Clone(source);
            let result;
            
            newItems[0].properties.navigation = {page: 2};
            result = FastData._private.isNeedReload(oldItems, newItems);
            assert.isTrue(result);
            
            result = FastData._private.isNeedReload(oldItems, newItems2);
            assert.isFalse(result);
   
            newItems3.splice(0, 1);
            result = FastData._private.isNeedReload(oldItems, newItems3);
            assert.isTrue(result);
         });

         it('_private::getItemPopupConfig', function() {
            var properties = {
               displayProperty: 'text',
               keyProperty: 'key',
               itemTemplate: 'newItemTemplate',
               itemTemplateProperty: 'myTemplate',
               headerTemplate: 'headerTemplateText',
               footerTemplate: 'footerTemplateText',
               emptyText: 'empty text',
               multiSelect: false,
               selectorTemplate: 'selectorTemplate'
            };
            var result = FastData._private.getItemPopupConfig(properties);
            assert.deepEqual(properties, result);
         });

         it('_private::prepareItems', function() {
            var self = {};
            var items = [{ properties: { source: new HistorySource({}) } }];
            FastData._private.prepareItems(self, items);
            assert.isTrue(self._items.at(0).properties.source instanceof HistorySource);
         });

         it('_private::getNewItems', function() {
            let fastData2 = getFastFilterWithItems(configItems);
            let selectedItems = new collection.RecordSet({
               idProperty: 'key',
               rawData: [
                  { key: 1, title: 'Россия' },
                  { key: 2, title: 'США' },
                  { key: 5, title: 'Франция' }
               ]
            });
            let result = FastData._private.getNewItems(fastData2, selectedItems);
            assert.deepEqual(result[0], selectedItems.at(2));
         });

         it('_needShowCross', function() {
            var item = {value: 'test1', resetValue: 'test2'};
            var fastFilter = getFastFilter(config);
            assert.isTrue(fastFilter._needShowCross(item));
            item = {value: 'test1'};
            assert.isFalse(fastFilter._needShowCross(item));
            item = {value: ['test1'], resetValue: ['test1']};
            assert.isFalse(fastFilter._needShowCross(item));
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   }
);
