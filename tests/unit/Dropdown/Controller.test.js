define(
   [
      'Controls/dropdown',
      'Types/source',
      'Core/core-clone',
      'Types/collection',
      'Controls/history',
      'Core/Deferred'
   ],
   (dropdown, sourceLib, Clone, collection, history, Deferred) => {
      describe('Dropdown/Controller', () => {
         let items = [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3',
               icon: 'icon-16 icon-Admin icon-primary'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6',
               node: true
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ];

         let itemsRecords = new collection.RecordSet({
            idProperty: 'id',
            rawData: items
         });

         let config = {
            selectedKeys: [2],
            keyProperty: 'id',
            emptyText: true,
            source: new sourceLib.Memory({
               idProperty: 'id',
               data: items
            }),
            nodeProperty: 'node'
         };

         let configLazyLoad = {
            lazyItemsLoad: true,
            selectedKeys: '[2]',
            keyProperty: 'id',
            source: new sourceLib.Memory({
               idProperty: 'id',
               data: items
            })
         };

         let getDropdownController = function(config) {
            let dropdownCntroller = new dropdown._Controller(config);
            dropdownCntroller.saveOptions(config);
            return dropdownCntroller;
         };

         it('before mount', (done) => {
            let newConfig = Clone(config),
               loadedItems;
            newConfig.dataLoadCallback = (items) => {loadedItems = items;};
            let dropdownController = getDropdownController(newConfig);
            dropdownController._beforeMount(newConfig).addCallback(function(items) {
               assert.deepEqual(items.getRawData(), itemsRecords.getRawData());
               assert.deepEqual(loadedItems.getRawData(), itemsRecords.getRawData());
               done();
            });
         });

         it('before mount navigation', (done) => {
            let navigationConfig = Clone(config);
            navigationConfig.navigation = {view: 'page', source: 'page', sourceConfig: {pageSize: 2, page: 0, hasMore: false}};
            let dropdownController = getDropdownController(navigationConfig);
            dropdownController._beforeMount(navigationConfig).addCallback(function(items) {
               assert.deepEqual(items.getCount(), 2);
               done();
            });
         });

         it('before mount filter', (done) => {
            let filterConfig = Clone(config);
            filterConfig.filter = {id: ['3', '4']};
            let dropdownController = getDropdownController(filterConfig);
            dropdownController._beforeMount(filterConfig).addCallback(function(items) {
               assert.deepEqual(items.getCount(), 2);
               done();
            });
         });

         it('check received state', () => {
            let dropdownController = getDropdownController(config);
            dropdownController._beforeMount(config, null, itemsRecords);
            assert.deepEqual(dropdownController._items.getRawData(), itemsRecords.getRawData());
         });

         it('received state, selectedItems = [null], emptyText is set', () => {
            let selectedItemsChangeCalled = false,
               selectedItems = [];
            const config = {
               selectedKeys: [null],
               keyProperty: 'id',
               emptyText: '123',
               selectedItemsChangedCallback: function(items) {
                  selectedItems = items;
                  selectedItemsChangeCalled = true;
               },
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: items
               })
            };
            const dropdownController = getDropdownController(config);
            dropdownController._beforeMount(config, null, itemsRecords);
            assert.deepEqual(selectedItems, [null]);
            assert.isTrue(selectedItemsChangeCalled);
         });

         it('received state, selectedItems = [null], emptyText is NOT set', () => {
            let selectedItemsChangeCalled = false,
               selectedItems = [];
            const config = {
               selectedKeys: [null],
               keyProperty: 'id',
               selectedItemsChangedCallback: function(items) {
                  selectedItems = items;
                  selectedItemsChangeCalled = true;
               },
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: items
               })
            };
            const dropdownController = getDropdownController(config);
            dropdownController._beforeMount(config, null, itemsRecords);
            assert.deepEqual(selectedItems, []);
            assert.isTrue(selectedItemsChangeCalled);
         });

         it('_beforeUpdate new templateOptions', function() {
            let dropdownController = getDropdownController(config),
               opened = false, isOpen = false;
            dropdownController._children = {
               DropdownOpener: {
                  open: () => { opened = true; },
                  isOpened: () => { return isOpen; }
               }
            };
            dropdownController._beforeUpdate({ ...config, headTemplate: 'headTemplate.wml', source: undefined });
            assert.isFalse(opened);

            isOpen = true;
            dropdownController._items = itemsRecords;
            dropdownController._beforeUpdate({ ...config, headTemplate: 'headTemplate.wml', source: undefined });
            assert.isTrue(opened);
         });

         it('_beforeUpdate source', () => {
            let dropdownController = getDropdownController(config),
               opened = false;
            let updatedItems = Clone(items);
            updatedItems.push({
               id: '9',
               title: 'Запись 9'
            });
            dropdownController._items = itemsRecords;
            dropdownController._children = {
               DropdownOpener: {
                  open: function() {
                     opened = true;
                  },
                  isOpened: function() {
                     return opened;
                  }
               }
            };
            return new Promise((resolve) => {
               dropdownController._beforeUpdate({
                  selectedKeys: '[2]',
                  keyProperty: 'id',
                  source: new sourceLib.Memory({
                     idProperty: 'id',
                     data: updatedItems
                  })
               }).addCallback(() => {
                  assert.equal(dropdownController._items.getCount(), updatedItems.length);
                  assert.isFalse(opened);
                  resolve();
               });
            });
         });

         it('_beforeUpdate source dropdown open', () => {
            let dropdownController = getDropdownController(config),
               opened = false;
            let updatedItems = Clone(items);
            updatedItems.push({
               id: '9',
               title: 'Запись 9'
            });
            dropdownController._items = itemsRecords;
            dropdownController._children = {
               DropdownOpener: {
                  open: function() {
                     opened = true;
                  },
                  isOpened: function() {
                     return true;
                  }
               }
            };
            return new Promise((resolve) => {
               dropdownController._beforeUpdate({
                  selectedKeys: '[2]',
                  keyProperty: 'id',
                  source: new sourceLib.Memory({
                     idProperty: 'id',
                     data: updatedItems
                  })
               }).addCallback(() => {
                  assert.equal(dropdownController._items.getCount(), updatedItems.length);
                  assert.isTrue(opened);
                  resolve();
               });
            });
         });

         it('_beforeUpdate new filter', (done) => {
            let configFilter = Clone(config),
               selectedItems = [];
            configFilter.filter = {id: '1'};
            configFilter.selectedKeys = ['2'];
            configFilter.selectedItemsChangedCallback = function(items) {
               selectedItems = items;
            };
            let dropdownController = getDropdownController(configFilter);
            dropdownController._beforeMount(configFilter, {}, itemsRecords);
            dropdownController._beforeUpdate(configFilter);
            dropdownController._children.DropdownOpener = {
               isOpened: function() {
                  return false;
               }
            };
            dropdownController._beforeUpdate({...configFilter, filter: {}}).addCallback(function() {
               assert.deepStrictEqual(selectedItems[0].getRawData(), itemsRecords.at(1).getRawData());
               done();
            });
         });

         it('_beforeUpdate without loaded items', () => {
            let configItems = Clone(config),
               selectedItems = [];
            configItems.selectedItemsChangedCallback = function(items) {
               selectedItems = items;
            };
            let dropdownController = getDropdownController(configItems);
            dropdownController._children.DropdownOpener = {
               isOpened: function() {
                  return false;
               }
            };
            dropdownController._items = null;
            var newConfig = Clone(configItems);
            newConfig.source = new sourceLib.Memory({
               idProperty: 'id',
               data: items
            });
            newConfig.selectedKeys = ['4'];
            dropdownController._beforeUpdate(newConfig).addCallback(function() {
               assert.equal(selectedItems.length, 1);
            });
         });

         it('notify footer click', () => {
            let dropdownController = getDropdownController(config);
            dropdownController._beforeMount(configLazyLoad);
            dropdownController._children.DropdownOpener = {
               close: setTrue.bind(this, assert),
               open: setTrue.bind(this, assert)
            };
            dropdownController._notify = (e) => {
               assert.equal(e, 'footerClick');
            };
            dropdownController._onResult(null, {action: 'footerClick'});
         });

         it('check item click', () => {
            let dropdownController = getDropdownController(config);
            let closed = false;
            let opened = false;
            let closeByNodeClick = false;

            dropdownController._beforeMount(configLazyLoad);
            dropdownController._items = itemsRecords;
            dropdownController._children.DropdownOpener = {
               close: function() {
                  closed = true;
               },
               open: function() {
                  opened = true;
               }
            };

            dropdownController._notify = (e, eventResult) => {
               assert.equal(e, 'selectedItemsChanged');

               return closeByNodeClick;
            };

            // returned false from handler and no hierarchy
            dropdownController._onResult(null, {action: 'itemClick', data: [dropdownController._items.at(4)]});
            assert.isFalse(closed);

            // returned undefined from handler and there is hierarchy
            closed = false;
            closeByNodeClick = false;
            dropdownController._onResult(null, {action: 'itemClick', data: [dropdownController._items.at(5)]});
            assert.isFalse(closed);

            // returned undefined from handler and no hierarchy
            closed = false;
            closeByNodeClick = undefined;
            dropdownController._onResult(null, {action: 'itemClick', data: [dropdownController._items.at(4)]});
            assert.isTrue(closed);

            // returned true from handler and there is hierarchy
            closed = false;
            closeByNodeClick = undefined;
            dropdownController._onResult(null, {action: 'itemClick', data: [dropdownController._items.at(5)]});
            assert.isTrue(closed);
         });

         it('lazy load', () => {
            let dropdownController = getDropdownController(configLazyLoad);
            dropdownController._beforeMount(configLazyLoad);
            assert.equal(dropdownController._items, undefined);
         });

         it('before update source lazy load', (done) => {
            let dropdownController = getDropdownController(configLazyLoad),
               opened = false, open;
            dropdownController._beforeMount(configLazyLoad);
            items.push({
               id: '5',
               title: 'Запись 11'
            });
            dropdownController._children = {
               DropdownOpener: {
                  open: function() {
                     open = true;
                  },
                  isOpened: function() {
                     return opened;
                  }
               }
            };
            dropdownController._beforeUpdate({
               lazyItemsLoad: true,
               selectedKeys: '[2]',
               keyProperty: 'id',
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: items
               })
            });
            assert.isNull(dropdownController._sourceController);
            assert.equal(dropdownController._items, null);

            opened = true;
            dropdownController._beforeUpdate({
               lazyItemsLoad: true,
               selectedKeys: '[2]',
               keyProperty: 'id',
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: items
               })
            }).addCallback(function(loadedItems) {
               assert.isOk(dropdownController._sourceController);
               assert.isTrue(open);
               done();
            });
         });

         it('before update new key', () => {
            let dropdownController = getDropdownController(config),
               selectedItems = [];
            let selectedItemsChangedCallback = function(items) {
               selectedItems = items;
            };
            dropdownController._items = itemsRecords;
            dropdownController._beforeUpdate({
               selectedKeys: '[6]',
               keyProperty: 'id',
               filter: config.filter,
               selectedItemsChangedCallback: selectedItemsChangedCallback
            });
            assert.deepEqual(selectedItems[0].getRawData(), items[5]);
         });

         it('check empty item update', () => {
            let dropdownController = getDropdownController(config),
               selectedItems = [];
            let selectedItemsChangedCallback = function(items) {
               selectedItems = items;
            };
            dropdown._Controller._private.updateSelectedItems(dropdownController, '123', [null], 'id', selectedItemsChangedCallback);
            assert.deepEqual(selectedItems, [null]);

            dropdown._Controller._private.updateSelectedItems(dropdownController, '123', [], 'id');
            assert.deepEqual(selectedItems, [null]);
         });

         it('_open dropdown', () => {
            let dropdownController = getDropdownController(config),
               opened = false;
            dropdownController._beforeMount(config);
            dropdownController._items = Clone(itemsRecords);
            dropdownController._children.DropdownOpener = {
               open: () => { opened = true;}
            };
            dropdownController._open();
            assert.isTrue(opened);

            // items is empty recordSet
            opened = false;
            dropdownController._items.clear();
            dropdownController._open();
            assert.isFalse(opened);

            // items = null
            opened = false;
            dropdownController._items = null;
            dropdownController._open();
            assert.isFalse(opened);
         });

         it('_open one item', () => {
            let selectedItems;
            let dropdownController = getDropdownController(config);
            let item = new collection.RecordSet({
               idProperty: 'id',
               rawData: [ {id: 1, title: 'Запись 1'} ]
            });
            dropdownController._items = item;
            dropdownController._notify = (e, data) => {
               if (e === 'selectedItemsChanged') {
                  selectedItems = data[0];
               }
            };
            dropdownController._open();
            assert.deepEqual(selectedItems, [item.at(0)]);
         });

         it('_open lazyLoad', () => {
            let dropdownController = getDropdownController(configLazyLoad);
            dropdownController._beforeMount(configLazyLoad);
            dropdownController._children.DropdownOpener = {
               close: setTrue.bind(this, assert),
               open: setTrue.bind(this, assert)
            };
            dropdownController._open();
         });

         it('mousedown', () => {
            let dropdownController = getDropdownController(configLazyLoad);
            dropdownController._beforeMount(configLazyLoad);
            let opened = false;
            let items2 = new collection.RecordSet({
               idProperty: 'id',
               rawData: [ {id: 1, title: 'Запись 1'}, {id: 2, title: 'Запись 2'} ]
            });
            dropdownController._items = items2;
            dropdown._Controller._private.getSourceController(dropdownController, configLazyLoad);
            dropdownController._children.DropdownOpener = {
               close: function() {
                  opened = false;
               },
               open: function() {
                  opened = true;
               },
               isOpened: function() {
                  return opened;
               }
            };
            dropdownController._mousedown();
            assert.isTrue(opened);

            dropdownController._mousedown();
            assert.isFalse(opened);
         });

         it('_private::getNewItems', function() {
            let curItems = new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [{
                     id: '1',
                     title: 'Запись 1'
                  }, {
                     id: '2',
                     title: 'Запись 2'
                  }, {
                     id: '3',
                     title: 'Запись 3'
                  }]
               }),
               selectedItems = new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [{
                     id: '1',
                     title: 'Запись 1'
                  }, {
                     id: '9',
                     title: 'Запись 9'
                  }, {
                     id: '10',
                     title: 'Запись 10'
                  }]
               });
            let newItems = [selectedItems.at(1), selectedItems.at(2)];
            let result = dropdown._Controller._private.getNewItems(curItems, selectedItems, 'id');

            assert.deepEqual(newItems, result);
         });

         it('_private::onSelectorResult', function() {
            let dropdownController = getDropdownController(config);
            let curItems = new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [{
                     id: '1',
                     title: 'Запись 1'
                  }, {
                     id: '2',
                     title: 'Запись 2'
                  }, {
                     id: '3',
                     title: 'Запись 3'
                  }]
               }),
               selectedItems = new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [{
                     id: '1',
                     title: 'Запись 1'
                  },
                  {
                     id: '9',
                     title: 'Запись 9'
                  },
                  {
                     id: '10',
                     title: 'Запись 10'
                  }]
               });
            dropdownController._items = curItems;
            let newItems = [ {
               id: '9',
               title: 'Запись 9'
            },
            {
               id: '10',
               title: 'Запись 10'
            },
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            }
            ];

            dropdown._Controller._private.onSelectorResult(dropdownController, selectedItems);
            assert.deepEqual(newItems, dropdownController._items.getRawData());
         });

         it('_private::getSourceController', function() {
            let dropdownController = getDropdownController(config);
            dropdownController._beforeMount(configLazyLoad);
            assert.isNotOk(dropdownController._sourceController);

            dropdownController._beforeMount(config);
            assert.isOk(dropdownController._sourceController);
         });

         let historySource,
            dropdownController;
         describe('history', ()=> {
            beforeEach(function() {
               historySource = new history.Source({
                  originSource: new sourceLib.Memory({
                     idProperty: 'id',
                     data: items
                  }),
                  historySource: new history.Service({
                     historyId: 'TEST_HISTORY_ID_DDL_CONTROLLER'
                  })
               });
               historySource.query = function() {
                  var def = new Deferred();
                  def.addCallback(function(set) {
                     return set;
                  });
                  def.callback(itemsRecords);
                  return def;
               };
               historySource.getItems = () => {};

               let historyConfig = { ...config, source: historySource };
               dropdownController = getDropdownController(historyConfig);
               dropdownController._items = itemsRecords;
               dropdownController._children = { DropdownOpener: { close: setTrue.bind(this, assert), isOpened: setTrue.bind(this, assert) } };
            });

            it('_beforeUpdate new historySource', function() {
               dropdownController._beforeUpdate({
                  selectedKeys: [2],
                  keyProperty: 'id',
                  source: historySource,
                  filter: {}
               });
               assert.deepEqual(dropdownController._filter, { $_history: true });
            });

            it('_private::onResult applyClick with history', function() {
               let selectedItems, updated;
               dropdownController._notify = function(e, d) {
                  if (e === 'selectedItemsChanged') {
                     selectedItems = d[0];
                  }
               };

               historySource.update = function() {
                  updated = true;
               };
               dropdownController._items = itemsRecords;
               dropdownController._beforeMount({
                  selectedKeys: [2],
                  keyProperty: 'id',
                  source: historySource,
                  filter: {}
               });

               dropdownController._onResult(null, {data: items, action: 'applyClick'});
               assert.deepEqual(selectedItems, items);
               assert.isTrue(updated);
            });
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   });
