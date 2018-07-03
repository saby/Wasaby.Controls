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
            if(e == 'selectedKeysChanged') {
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
                  fastData._children = {fastFilter: []};
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
         function setTrue(assert) {
            assert.equal(true, true);
         }

      });
   });