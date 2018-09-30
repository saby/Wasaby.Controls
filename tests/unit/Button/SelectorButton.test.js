define(
   [
      'Controls/Button/SelectorButton',
      'WS.Data/Collection/List',
      'Core/core-clone',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Source/Memory'
   ],
   function(SelectorButton, List, Clone, RecordSet, Memory) {
      describe('SelectorButton', function() {
         let initItems = [
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
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            }
         ];
         let source = new Memory({
            data: initItems,
            idProperty: 'id'
         });

         let config = {
            source: source,
            multiSelect: true,
            selectedKeys: ['1', '2', '3'],
            keyProperty: 'id',
            displayProperty: 'title',
            caption: 'Выберите запись',
            maxVisibilityItems: 2
         };

         let getButton = function(config) {
            let selButton = new SelectorButton(config);
            selButton.saveOptions(config);
            return selButton;
         };

         it('_beforeMount', function(done) {
            let button = getButton(config);
            button._beforeMount(config).addCallback(function() {
               assert.deepEqual(button._selectedItems.getCount(), 3);
               assert.deepEqual(button._selectedItems.at(0).getId(), '1');
               done();
            });
         });

         it('_beforeMount with filter', function(done) {
            let filterConfig = Clone(config);
            filterConfig.filter = {
               id: '3'
            };
            let button = getButton(filterConfig);
            button._beforeMount(filterConfig).addCallback(function(loadItems) {
               assert.deepEqual(loadItems.getRawData(), [{
                  id: '3',
                  title: 'Запись 3'
               }]);
               done();
            });
         });

         it('_beforeMount from receivedState', function() {
            let button = getButton(config);
            button._beforeMount(config, undefined, new RecordSet({
               rawData: initItems, idProperty: 'id'
            }));
            assert.deepEqual(button._selectedItems.getCount(), 5);
            assert.deepEqual(button._selectedItems.at(0).getId(), '1');
            assert.deepEqual(button._selectedItems.at(4).getId(), '5');
         });

         it('_beforeUpdate', function(done) {
            let button = getButton(config);
            button._beforeMount({});
            var newConfig = Clone(config);
            newConfig.selectedKeys = ['2', '4'];
            button._beforeUpdate(newConfig).addCallback(function() {
               assert.deepEqual(button._selectedItems.getCount(), 2);
               assert.deepEqual(button._selectedItems.at(0).getId(), '2');
               done();
            });
         });

         it('getVisibleItems', function() {
            let visibleItems = SelectorButton._private.getVisibleItems(new RecordSet({
               rawData: initItems, idProperty: 'id'
            }), 3);
            assert.equal(visibleItems.getCount(), 3);
            assert.equal(visibleItems.at(0).get('id'), '3');
            assert.equal(visibleItems.at(2).get('id'), '5');
         });

         it('getSelectedKeys', function() {
            let keys = SelectorButton._private.getSelectedKeys(new RecordSet({
               rawData: initItems, idProperty: 'id'
            }), 'id');
            assert.deepEqual(keys, ['1', '2', '3', '4', '5']);
         });

         it('notifyChanges', function() {
            let button = getButton(config);
            button._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], [1, 2, 3]);
               } else if (e === 'selectedItemsChanged') {
                  assert.deepEqual(data[0], ['1', '2', '3']);
               }
            };
            SelectorButton._private.notifyChanges(button, ['1', '2', '3'], [1, 2, 3]);
         });

         it('open', function() {
            let OpenConfig = Clone(config);
            let button = getButton(OpenConfig);
            button._children = { 'selectorOpener': { open: setTrue.bind(this, assert) } };
            button._open();
         });

         it('result', function() {
            let button = getButton(config);
            button._beforeMount({});
            button._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], ['2', '3']);
               }
            };
            button._onResult(new RecordSet({
               rawData: initItems.slice(1, 3), idProperty: 'id'
            }));
            assert.deepEqual(button._selectedItems.getCount(), 2);
         });

         it('reset', function() {
            let button = getButton(config);
            button._beforeMount({});
            button._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], []);
               }
            };
            button._selectedKeys = ['1', '2', '3'];
            button._reset();
            assert.deepEqual(button._selectedItems.length, 0);
         });

         it('removeItems', function() {
            let button = getButton(config);
            button._beforeMount({});
            button._selectedItems = button._selectedItemsVisible = new List({
               items: [{ id: '1', title: 'Запись 1' }]
            });
            SelectorButton._private.removeItem(button, button._selectedItems.at(0));
            assert.equal(button._selectedItems.getCount(), 0);
            assert.equal(button._selectedItemsVisible.getCount(), 0);
         });

         it('_resultHiddenItem', function() {
            let button = getButton(config);
            button._selectedItems = button._selectedItemsVisible = new List({
               items: [{ id: '1', title: 'Запись 1' }]
            });
            button._notify = (e, data) => {
               if (e === 'itemClick') {
                  assert.deepEqual(data[0], { id: '1', title: 'Запись 1' });
               }
            };
            button._resultHiddenItem({ id: '1', title: 'Запись 1' }, 'crossClick');
            button._resultHiddenItem({ id: '1', title: 'Запись 1' }, 'itemClick');
         });

         it('_crossClick', function() {
            let button = getButton(config);
            button._selectedItems = button._selectedItemsVisible = new List({
               items: [{ id: '1', title: 'Запись 1' }]
            });
            button._crossClick('crossClick', { id: '1', title: 'Запись 1' });
            assert.equal(button._selectedItems.getCount(), 0);
            assert.equal(button._selectedItemsVisible.getCount(), 0);
         });

         it('_itemClickHandler singleSelect', function() {
            let singleConfig = Clone(config);
            singleConfig.multiSelect = false;
            let button = getButton(singleConfig);
            button._children = { 'selectorOpener': { open: setTrue.bind(this, assert) } };
            button._itemClickHandler([]);
         });

         it('_itemClickHandler multiSelect', function() {
            let button = getButton(config);
            button._notify = (e, data) => {
               if (e === 'itemClick') {
                  assert.deepEqual(data[0], []);
               }
            };
            button._itemClickHandler([]);
         });

         it('_showHiddenItems', function() {
            let button = getButton(config);
            button._children = { 'stickyOpener': { open: setTrue.bind(this, assert) } };
            button._container = { offsetWidth: 400 };
            button._showHiddenItems();
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   }
);
