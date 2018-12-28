define(
   [
      'Controls/Filter/Fast',
      'WS.Data/Source/Memory',
      'Core/core-clone'
   ],
   function(FastData, Memory, Clone) {
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
                  source: new Memory({
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
                  source: new Memory({
                     data: items[1],
                     idProperty: 'key'
                  }),
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
                  source: new Memory({
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
                  source: new Memory({
                     data: items[0],
                     idProperty: 'key'
                  }),
                  navigation: {view: 'page', source: 'page', sourceConfig: {pageSize: 2, page: 0, mode: 'totalCount'}}
               }
            }
         ];

         var config = {};
         config.source = new Memory({
            idProperty: 'id',
            data: source
         });

         var getFastFilter = function(config) {
            var fastFilter = new FastData(config);
            fastFilter.saveOptions(config);
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

         it('beforeUpdate new items', function(done) {
            var fastFilter = getFastFilter(configWithItems);
            fastFilter._beforeMount(configWithItems);
            var newConfigItems = Clone(configWithItems);
            newConfigItems.items[0].value = 'США';
            fastFilter._beforeUpdate(newConfigItems).addCallback(function() {
               assert.equal(fastFilter._items.at(0).value, 'США');
               fastFilter._beforeUpdate(configWithItems);
               done();
            });
            fastFilter._beforeUpdate({});
         });

         it('beforeUpdate new source', function(done) {
            var fastFilter = getFastFilter(config),
               newConfigSource = Clone(config),
               newSource = Clone(source);
            fastFilter._beforeMount(config);
            newSource[0].value = 'США';
            newConfigSource.source = new Memory({
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
            FastData._private.reload(fastDataItems).addCallback(function() {
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

         it('on result', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function() {
                  fastData.lastOpenIndex = 0;
                  isFilterChanged = false;
                  fastData._onResult({ data: [fastData._configs[0]._items.at(2)] });
                  assert.isTrue(isFilterChanged);
                  assert.equal(items[0][2].title, 'США');
                  done();
               });
            });
         });

         it('setText', function(done) {
            FastData._private.reload(fastData).addCallback(function() {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function(items) {
                  fastData._setText();
                  assert.equal(fastData._items.at(0).get('textValue'), 'США');
                  assert.equal(fastData._items.at(1).get('textValue'), 'фэнтези');
                  assert.equal(fastData._items.at(2).get('textValue'), 'все страны');
                  assert.equal(fastData._items.at(3).get('textValue'), 'все страны');
                  done();
               });
            });
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

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   }
);
