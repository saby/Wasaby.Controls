define(
   [
      'Controls/Filter/FastData',
      'WS.Data/Source/Memory',
      'Core/vdom/Synchronizer/resources/SyntheticEvent',
      'WS.Data/Entity/Record',
      'WS.Data/Collection/RecordSet',
      'Core/Deferred'
   ],
   function (FastData, Memory, SyntheticEvent, RecordSet, Deferred) {
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
               id: 'first',
               idProperty: 'title',
               displayProperty: 'title',
               value: 'Россия',
               resetValue: 'все страны',
               source: {
                  module: 'WS.Data/Source/Memory',
                  options: {
                     data: items[0]
                  }
               }
            },
            {
               id: 'second',
               idProperty: 'title',
               displayProperty: 'title',
               resetValue: '',
               source: items[0]
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

         fastData.subscribe('selectedKeysChanged', function (event, key) {
            isSelected = true;
            selectedKey = key;
         });
         fastData.subscribe('onFilterChange', function () {
            isFilterChanged = true;
         });
         fastData._beforeMount(config);
         fastData._children.DropdownOpener = {
            close: setTrue.bind(this, assert),
            open: setTrue.bind(this, assert)
         };

         it('load config', function (done) {
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadListConfig(fastData, fastData._listConfig.at(0), 0).addCallback(function () {
                  assert.deepEqual(fastData._configs[0]._items.getRawData(), items[0]);
                  done();
               });
            });
         });

         it('update text', function (done) {
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadListConfig(fastData, fastData._listConfig.at(0), 0).addCallback(function () {
                  var text = fastData._updateText(fastData._listConfig.at(0), 0);
                  assert.equal(text, items[0][1].title);
                  done();
               });
            });
         });

         it('get filter', function (done) {
           FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
              FastData._private.loadListConfig(fastData, fastData._listConfig.at(0), 0).addCallback(function () {
                 var result = FastData._private.getFilter(fastData);
                 assert.deepEqual(result, {'first': fastData._configs[0].value});
                 done();
              });
           });
         });

         it('on result', function (done) {
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadListConfig(fastData, fastData._listConfig.at(0), 0).addCallback(function () {
                  fastData.lastOpenIndex = 0;
                  isSelected = false;
                  isFilterChanged = false;
                  selectedKey = null;
                  fastData._onResult(['itemClick', 'event', [fastData._configs[0]._items.at(2)]]);
                  assert.isTrue(isSelected);
                  assert.isTrue(isFilterChanged);
                  assert.equal(items[0][2].title, selectedKey);
                  done();
               });
            });
         });

         it('reset', function (done) {
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadListConfig(fastData, fastData._listConfig.at(0), 0).addCallback(function () {
                  fastData.lastOpenIndex = 0;
                  isSelected = false;
                  selectedKey = null;
                  fastData._reset(null, fastData._listConfig.at(0), 0);
                  assert.isTrue(isSelected);
                  assert.equal(items[0][0].title, selectedKey);
                  done();
               });
            });
         });

         it('open dropdown', function () {

            var event = {target: {}};
            FastData._private.reload(fastData, fastData.sourceController).addCallback(function () {
               FastData._private.loadListConfig(fastData, fastData._listConfig.at(0), 0).addCallback(function () {
                  fastData._open(new SyntheticEvent(null, event), fastData._listConfig.at(0), 0);
               });
            });
         });
         function setTrue(assert) {
            assert.equal(true, true);
         }

      });
   });