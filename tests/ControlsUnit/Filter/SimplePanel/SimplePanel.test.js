define(
   [
      'Controls/filterPopup',
      'Types/util',
      'Types/collection',
      'Core/Deferred',
      'Controls/_filter/HistoryUtils'
   ],
   function(filterPopup, util, collection, Deferred, HistoryUtils) {
      describe('Filter:SimplePanel', function() {

         let defaultItems = [
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

         let defaultItemsConfig = [
            {
               id: 'first',
               displayProperty: 'title',
               keyProperty: 'key',
               selectedKeys: [0],
               emptyText: 'empty text',
               hasMoreButton: false,
               items: new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: defaultItems[0]
               })
            }, {
               id: 'second',
               displayProperty: 'title',
               keyProperty: 'key',
               selectedKeys: [0],
               emptyText: 'empty text2',
               hasMoreButton: false,
               items: new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: defaultItems[1]
               })
            }
         ];

         let defaultConfig = {
            items: new collection.RecordSet({
               keyProperty: 'id',
               rawData: defaultItemsConfig
            })
         };

         let getPanel = function (config) {
            let panel = new filterPopup.SimplePanel();
            panel.saveOptions(config);
            return panel;
         };

         describe('_private.getItems', () => {
            it('returns items only with 2 and more elements in collection', (done) => {
               const itemsConfig = util.object.clone(defaultItemsConfig);
               itemsConfig[0].items.clear();
               const items = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: itemsConfig
               });
               filterPopup.SimplePanel._private.getItems({}, items).then((resultItems) => {
                  const itemWithEmptyCollection = resultItems.find((resultItem) => {
                     return resultItem.id === defaultItemsConfig[0].id;
                  });
                  assert.isUndefined(itemWithEmptyCollection);
                  done();
               });
            });
         });

         it('_beforeMount', function() {
            let expectedItems = defaultConfig.items.getRawData();
            for (var i in expectedItems) {
               expectedItems[i].initSelectedKeys = expectedItems[i].selectedKeys;
            }
            let panel = getPanel(defaultConfig);
            panel._beforeMount(defaultConfig);
            assert.deepStrictEqual(panel._items, expectedItems);
            assert.isFalse(panel._hasApplyButton);

            let multiSelectDefaultConfig = [...defaultItemsConfig];
            multiSelectDefaultConfig[0].multiSelect = true;
            panel._beforeMount({
               items: new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: multiSelectDefaultConfig
               })
            });
            assert.isTrue(panel._hasApplyButton);
         });

         it('_beforeUpdate', function(done) {
            let panel = getPanel(defaultConfig);
            panel._beforeMount(defaultConfig);

            let items = util.object.clone(defaultItemsConfig);
            items[0].selectedKeys = [1];
            let newConfig = {...defaultConfig, items: new collection.RecordSet({
               keyProperty: 'id',
               rawData: items
            })};

            let expectedItems = defaultConfig.items.getRawData();
            for (var i in expectedItems) {
               expectedItems[i].initSelectedKeys = expectedItems[i].selectedKeys;
            }
            panel._needShowApplyButton = false;
            panel._beforeUpdate(defaultConfig);
            assert.deepStrictEqual(panel._items, expectedItems);
            assert.isFalse(panel._needShowApplyButton);

            expectedItems[0].selectedKeys = [1];
            panel._beforeUpdate(newConfig).addCallback(() => {
               assert.deepStrictEqual(panel._items, expectedItems);
               assert.isTrue(panel._needShowApplyButton);
               done();
            });
         });

         it('_beforeUpdate loadDeferred', function(done) {
            let panel = getPanel(defaultConfig);
            panel._beforeMount(defaultConfig);

            let items = util.object.clone(defaultItemsConfig);
            items[0].loadDeferred = Deferred.success(items[0].items);
            items[0].sourceController = { hasMoreData: () => true };
            items[0].source = { prepareItems: loadItems => loadItems };
            const sandBox = sinon.createSandbox();
            sandBox.stub(HistoryUtils, 'isHistorySource').returns(true);

            let newConfig = {...defaultConfig, items: new collection.RecordSet({
               keyProperty: 'id',
               rawData: items
            })};

            panel._beforeUpdate(newConfig).addCallback(() => {
               assert.isTrue(panel._items[0].hasMoreButton);
               sandBox.restore();
               done();
            });
         });

         it('_itemClickHandler', function() {
            let actualResult;
            let panel = getPanel(defaultConfig);
            panel._notify = (event, data) => {
               if (event === 'sendResult') {
                  actualResult = data[0];
               }
            };
            let item = defaultItemsConfig[0],
               expectedResult =  {
                  action: 'itemClick',
                  event: 'itemClickEvent',
                  selectedKeys: [2],
                  id: 'first'
               };
            panel._itemClickHandler('itemClickEvent', item, [2]);
            assert.deepStrictEqual(actualResult, expectedResult);
         });

         it('_checkBoxClickHandler', function() {
            let actualResult;
            let panel = getPanel(defaultConfig);
            panel._notify = (event, data) => {
               if (event === 'selectedKeysChangedIntent') {
                  actualResult = data;
               }
            };
            let expectedResult = [1, [1]];
            panel._beforeMount(defaultConfig);

            panel._checkBoxClickHandler('checkBoxClick', 1, [1]);
            assert.isTrue(panel._needShowApplyButton);
            assert.deepStrictEqual(panel._items[1].selectedKeys, [1]);
            assert.deepStrictEqual(actualResult, expectedResult);
         });

         it('_closeClick', function() {
            let isClosed = false;
            let panel = getPanel(defaultConfig);
            panel._notify = (event) => {
               if (event === 'close') {
                  isClosed = true;
               }
            };
            panel._closeClick();
            assert.isTrue(isClosed);
         });

         it('_applySelection', function() {
            let actualResult;
            let panel = getPanel(defaultConfig);
            panel._notify = (event, data) => {
               if (event === 'sendResult') {
                  actualResult = data[0];
               }
            };
            let expectedResult = {
               action: 'applyClick',
               event: 'applyClickEvent',
               selectedKeys: {
                  'first': [0],
                  'second': [0]
               }
            };
            panel._beforeMount(defaultConfig);

            panel._applySelection('applyClickEvent');
            assert.deepStrictEqual(actualResult, expectedResult);
         });

         it('_moreButtonClick', function() {
            let actualResult;
            let panel = getPanel(defaultConfig);
            panel._notify = (event, data) => {
               if (event === 'sendResult') {
                  actualResult = data[0];
               }
            };
            let expectedResult = {
               action: 'moreButtonClick',
               id: 'first',
               selectedItems: []
            };
            panel._beforeMount(defaultConfig);

            panel._moreButtonClick('moreButtonClick', defaultItemsConfig[0], []);
            assert.deepStrictEqual(actualResult, expectedResult);
         });

         it('_private::isEqualKeys', function() {
            let isEqual = filterPopup.SimplePanel._private.isEqualKeys([1,2,3], [1,2,3,4]);
            assert.isFalse(isEqual);
            isEqual = filterPopup.SimplePanel._private.isEqualKeys([1,2,3], [1,2,3]);
            assert.isTrue(isEqual);
            isEqual = filterPopup.SimplePanel._private.isEqualKeys([null], []);
            assert.isFalse(isEqual);
            isEqual = filterPopup.SimplePanel._private.isEqualKeys([null], [1,2,3]);
            assert.isFalse(isEqual);
            isEqual = filterPopup.SimplePanel._private.isEqualKeys([3,5,4], [1,2,3]);
            assert.isFalse(isEqual);
         });

      });
   }
);
