/**
 * Created by ps.borisov on 16.02.2018.
 */
define([
   'Controls/Tabs/Buttons',
   'WS.Data/Source/Memory',
   'WS.Data/Entity/Record'
], function(TabsButtons, MemorySource, Record) {
   describe('Controls.Tabs.Buttons', function() {
      it('prepareItemOrder', function() {
         var
            expected = '-ms-flex-order:2; order:2';
         assert.equal(expected, TabsButtons._private.prepareItemOrder(2), 'wrong order cross-brwoser styles');
      });
      it('initItems', function(done) {
         var
            tabInstance = new TabsButtons(),
            data = [
               {
                  id: 1,
                  title: 'Первый',
                  align: 'left'
               },
               {
                  id: 2,
                  title: 'Второй'
               },
               {
                  id: 3,
                  title: 'Третий',
                  align: 'left'
               },
               {
                  id: 4,
                  title: 'Четвертый'
               },
               {
                  id: 5,
                  title: 'Пятый'
               },
               {
                  id: 6,
                  title: 'Шестой',
                  align: 'left'
               },
               {
                  id: 7,
                  title: 'Седьмой'
               },
               {
                  id: 8,
                  title: 'Восьмой'
               },
               {
                  id: 9,
                  title: 'Девятый',
                  align: 'left'
               },
               {
                  id: 10,
                  title: 'Десятый'
               },
               {
                  id: 11,
                  title: 'Одиннадцатый'
               },
               {
                  id: 12,
                  title: 'Двенадцатый',
                  align: 'left'
               },
               {
                  id: 13,
                  title: 'Тринадцатый'
               }
            ],
            source = new MemorySource({
               data: data,
               idProperty: 'id'
            });

         TabsButtons._private.initItems(source, tabInstance).addCallback(function(result) {
            var itemsOrder = result.itemsOrder;
            assert.equal(1, itemsOrder[0], 'incorrect  left order');
            assert.equal(30, itemsOrder[1], 'incorrect right order');
            assert.equal(5, itemsOrder[11], 'incorrect right order');
            assert.equal(36, itemsOrder[10], 'incorrect right order');
            assert.equal(37, tabInstance._lastRightOrder, 'incorrect last right order');
            tabInstance.destroy();
            done();
         });
      });
      it('prepareItemClass', function() {
         var
            item = new Record({
               rawData: {
                  align: 'left',
                  karambola: '15',
                  _order: '144'
               }
            }),
            item2 = new Record({
               rawData: {
                  karambola: '10',
                  _order: '2',
                  type: 'photo'
               }
            }),
            options = {
               style: 'additional',
               selectedKey: '15',
               keyProperty: 'karambola'
            },
            expected = 'controls-Tabs__item controls-Tabs__item_align_left controls-Tabs_style_additional__item_state_selected controls-Tabs__item_state_selected',
            expected2 = 'controls-Tabs__item controls-Tabs__item_align_right controls-Tabs__item_state_default controls-Tabs__item_type_photo';
         assert.equal(expected, TabsButtons._private.prepareItemClass(item, '144', options, 144), 'wrong order cross-brwoser styles');
         assert.equal(expected2, TabsButtons._private.prepareItemClass(item2, '2', options, 144), 'wrong order cross-brwoser styles');
      });
      it('_beforeMount with received state', function() {
         var tabs = new TabsButtons(),
            receivedState = {
               items: 'items',
               itemsOrder: 'itemsOrder'
            },
            options = {
               source: null
            };
         tabs._beforeMount(options, null, receivedState);
         assert.equal(tabs._items, receivedState.items, 'items uncorrect in beforeMount with receivedState');
         assert.equal(tabs._itemsOrder, receivedState.itemsOrder, 'items uncorrect in beforeMount with receivedState');
         tabs.destroy();
      });
      it('_beforeMount without received state', function() {
         var tabs = new TabsButtons(),
            data = [
               {
                  id: '1',
                  title: 'test1'
               }
            ],
            source = new MemorySource({
               data: data,
               idProperty: 'id'
            }),
            options = {
               source: source
            };
         tabs._beforeMount(options).addCallback(function() {
            assert.equal(tabs._items.at(0).get('id') === '1', 'incorrect items _beforeMount without received state');
            assert.equal(tabs._items.at(0).get('title') === 'test1', 'incorrect items _beforeMount without received state');
            tabs.destroy();
            done();
         });
      });
      it('_beforeUpdate', function() {
         var tabs = new TabsButtons(),
            data = [
               {
                  id: '1',
                  title: 'test1'
               }
            ],
            source = new MemorySource({
               data: data,
               idProperty: 'id'
            }),
            options = {
               source: source
            },
            forceUpdateCalled = false,
            origForceUpdate = tabs._forceUpdate;
         tabs._forceUpdate = function() {
            forceUpdateCalled = true;
         };
         tabs._beforeUpdate(options).addCallback(function() {
            assert.equal(tabs._items.at(0).get('id') === '1', 'incorrect items _beforeUpdate without received state');
            assert.equal(tabs._items.at(0).get('title') === 'test1', 'incorrect items _beforeUpdate without received state');
            assert.equal(forceUpdateCalled, true, 'forceUpdate in _beforeUpdate does not called');
            tabs._forceUpdate = origForceUpdate;
            tabs.destroy();
            done();
         });
      });
      it('_onItemClick', function() {
         var tabs = new TabsButtons(),
            notifyCorrectCalled = false;
         tabs._notify = function(eventName) {
            if (eventName === 'selectedKeyChanged') {
               notifyCorrectCalled = true;
            }
         };
         tabs._onItemClick(null, 1);
         assert.equal(notifyCorrectCalled, true, 'uncorrect _onItemClick');
         tabs.destroy();
      });
      it('_prepareItemClass', function() {
         var tabs = new TabsButtons(),
            originalFunc = TabsButtons._private.prepareItemClass,
            prepareItemClassCorrectCalled = false;
         tabs._options = 'options';
         tabs._itemsOrder = [
            'itemsOrder'
         ];
         tabs._lastRightOrder = 'lastRightOrder';
         TabsButtons._private.prepareItemClass = function(item, itemsOrder, options, lastRightOrder) {
            if (item === 'item' && itemsOrder === 'itemsOrder' && options === 'options' && lastRightOrder === 'lastRightOrder') {
               prepareItemClassCorrectCalled = true;
            }
         };
         tabs._prepareItemClass('item', 0);
         assert.equal(prepareItemClassCorrectCalled, true, 'uncorrect _prepareItemClass');
         tabs.destroy();
         TabsButtons._private.prepareItemClass = originalFunc;
      });
      it('_prepareItemOrder', function() {
         var tabs = new TabsButtons(),
            originalFunc = TabsButtons._private.prepareItemOrder,
            prepareItemOrderCorrectCalled = false;
         tabs._itemsOrder = [
            'itemsOrder'
         ];
         TabsButtons._private.prepareItemOrder = function(itemsOrder) {
            if (itemsOrder === 'itemsOrder') {
               prepareItemOrderCorrectCalled = true;
            }
         };
         tabs._prepareItemOrder(0);
         assert.equal(prepareItemOrderCorrectCalled, true, 'uncorrect _prepareItemOrder');
         tabs.destroy();
         TabsButtons._private.prepareItemClass = originalFunc;
      });
   });
});
