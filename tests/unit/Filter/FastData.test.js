define(
   [
      'Controls/Filter/FastData',
      'WS.Data/Source/Memory',
      'WS.Data/Entity/Record',
      'WS.Data/Collection/RecordSet',
      'Core/Deferred'
   ],
   function (FastData, Memory, Record, RecordSet, Deferred) {
      describe('FastDataVDom', function () {
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
               name: 'first',
               idProperty: 'title',
               displayProperty: 'title',
               selectedIndex: '1',
               source: {
                  module: 'WS.Data/Source/Memory',
                  options: {
                     data: items[0]
                  }
               }
            },
            {
               name: 'second',
               idProperty: 'key',
               displayProperty: 'title',
               source: items[1]
            }

         ];

         var config = {};
         config.source = new Memory({
            idProperty: 'id',
            data: source
         });

         var fastData = new FastData(config);
         var isSelected = false;
         var selectedKey;

         fastData.once('selectedKeysChanged', function (event, key) {
            isSelected = true;
            selectedKey = key;
         });

         var instance = {_configs: {}, _selectedIndexes: {0: 0, 1: 1}};
         for (var i = 0; i < items.length; i++) {
            instance._configs[i] = {};
            instance._configs[i]._items = new RecordSet({rawData: items[i]});
         }

         it('load config', function () {
            fastData._beforeMount(config).addCallback(function () {
               FastData._private._loadConfig(fastData, fastData._listConfig.at(0)).addCallback(function () {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), items[0]);
               });
            });
         });

         it('update text', function () {
            fastData._beforeMount(config).addCallback(function () {
                  FastData._private._loadConfig(fastData, fastData._listConfig.at(0)).addCallback(function () {
                     var text = fastData._updateText(fastData._listConfig.at(0), 0);
                     assert.equal(text, items[0][1].title);
                  });
            });
         });

         it('getElement', function () {
            assert.equal(FastData._private._getElement(instance, 0, 'title'), items[0][0].title);
         });

         // it('on result', function () {
         //    fastData._beforeMount(config).addCallback(function (res) {
         //          item.addCallback(function () {
         //             fastData.lastOpenIndex = 0;
         //             isSelected = false;
         //             selectedKey = null;
         //             fastData._onResult(['itemClick', 'event', [fastData._configs[0]._items.at(0)]]);
         //             assert.isTrue(isSelected);
         //             assert.equal(items[0][0].title, selectedKey);
         //          });
         //       });
         // });

         it('reset', function () {

         });

      });
   });