define(
   [
      'Controls/Filter/Fast',
      'WS.Data/Source/Memory',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function (FastData, Memory, SyntheticEvent) {
      describe('FastFilterVDom', function () {
         var items = [
            [{key: 0, title: 'все страны'},
               {key: 1, title: 'Россия'},
               {key: 2, title: 'США'},
               {key: 3, title: 'Великобритания'}
            ],

            [{key: 0, title: 'все жанры'},
               {key: 1, title: 'фантастика'},
               {key: 2, title: 'фэнтези'},
               {key: 3, title: 'мистика'}
            ]
         ];
         var source = [
            {
               id: 'first',
               value: 'Россия',
               resetValue: 'все страны',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: {
                     module: 'WS.Data/Source/Memory',
                     options: {
                        data: items[0]
                     }
                  }
               }
            },
            {
               id: 'second',
               resetValue: 'фэнтези',
               value: 'фэнтези',
               properties: {
                  items: items[1],
                  keyProperty: 'title',
                  displayProperty: 'title'
               }
            },
            {
               id: 'third',
               value: 'все страны',
               resetValue: 'все страны',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: {
                     module: 'WS.Data/Source/Memory',
                     options: {
                        data: items[0]
                     }
                  }
               }
            },            {
               id: 'fourth',
               value: 'все страны',
               resetValue: 'все страны',
               properties: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: {
                     module: 'WS.Data/Source/Memory',
                     options: {
                        data: items[0]
                     }
                  }
               }
            }
         ];

         var config = {};
         config.source = new Memory({
            idProperty: 'id',
            data: source
         });

         var fastData = new FastData(config);
         var isSelected = false,
            selectedKey,
            isFilterChanged;

         var configWithItems = {};
         configWithItems.items = source;
         var fastDataItems = new FastData(configWithItems);
         fastDataItems._beforeMount(configWithItems);

         fastData._notify = (e, args) => {
            if (e == 'selectedKeysChanged') {
               isSelected = true;
               selectedKey = args[0];
            } else {
               isFilterChanged = true;
            }
         };
         fastData._beforeMount(config);
         fastData._children.DropdownOpener = {
            close: setTrue.bind(this, assert),
            open: setTrue.bind(this, assert)
         };

         it('load config', function (done) {
            FastData._private.reload(fastData).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), items[0]);
                  done();
               });
            });
         });

         it('load config from items', function (done) {
            FastData._private.reload(fastDataItems).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), items[0]);
                  done();
               });
            });
         });

         it('update text', function (done) {
            FastData._private.reload(fastData).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  var text = fastData._getText(fastData._items.at(0), 0);
                  assert.equal(text, items[0][1].title);
                  done();
               });
            });
         });

         it('get filter', function (done) {
            FastData._private.reload(fastData).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  var result = FastData._private.getFilter(fastData._items);
                  assert.deepEqual(result, {'first': fastData._items.at(0).get('value')});
                  done();
               });
            });
         });

         it('on result', function (done) {
            FastData._private.reload(fastData).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  fastData.lastOpenIndex = 0;
                  isSelected = false;
                  isFilterChanged =false;
                  selectedKey = null;
                  fastData._onResult({data: [fastData._configs[0]._items.at(2)]});
                  assert.isTrue(isSelected);
                  assert.isTrue(isFilterChanged);
                  assert.equal(items[0][2].title, selectedKey);
                  done();
               });
            });
         });

         it('reset', function (done) {
            FastData._private.reload(fastData).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  fastData.lastOpenIndex = 0;
                  fastData._container = {children: []};
                  isSelected = false;
                  selectedKey = null;
                  fastData._reset(null, fastData._items.at(0), 0);
                  assert.isTrue(isSelected);
                  assert.equal(fastData._items.at(0).get('resetValue'), selectedKey);
                  done();
               });
            });
         });

         it('open dropdown', function () {
            var event = {target: {}};
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  fastData._open(new SyntheticEvent(null, event), fastData._items.at(0), 0);
               });
            });
         });

         it('set shrink', function(done) {
            var width = [{index: '2', width: 100},
               {index: '0', width: 300},
               {index: '1', width: 50},
               {index: '3', width: 600}];
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadItems(fastData, fastData._items.at(0), 0).addCallback(function () {
                  FastData._private.setShrink(fastData, width);
                  assert.equal(fastData._configs[0].shrink, 3);
                  assert.equal(fastData._configs[1].shrink, 1);
                  assert.equal(fastData._configs[2].shrink, 2);
                  assert.equal(fastData._configs[3].shrink, 4);
                  done();
               });
            });
         });
         function setTrue(assert) {
            assert.equal(true, true);
         }

      });
   });