/**
 * Created by ps.borisov on 16.02.2018.
 */
define([
    'Controls/Tabs/Buttons',
    'WS.Data/Source/Memory',
    'WS.Data/Entity/Record'
], function(TabsButtons, MemorySource, Record){

    describe('Controls.Tabs.Buttons', function () {
        it('prepareItemOrder', function () {
            var
                expected =  '-ms-flex-order:2; order:2';
            assert.equal(expected, TabsButtons._private.prepareItemOrder(2), 'wrong order cross-brwoser styles');
        });
        it('initItems', function (done) {
            var
                tabInstance =  new TabsButtons(),
                data = [
                    {
                        id : 1,
                        title : 'Первый',
                        align: 'left'
                    },
                    {
                        id : 2,
                        title : 'Второй'
                    },
                    {
                        id : 3,
                        title : 'Третий',
                        align: 'left'
                    },
                    {
                        id : 4,
                        title : 'Четвертый'
                    },
                    {
                        id : 5,
                        title : 'Пятый'
                    },
                    {
                        id : 6,
                        title : 'Шестой',
                        align: 'left'
                    },
                    {
                        id : 7,
                        title : 'Седьмой'
                    },
                    {
                        id : 8,
                        title : 'Восьмой'
                    },
                    {
                        id : 9,
                        title : 'Девятый',
                        align: 'left'
                    },
                    {
                        id : 10,
                        title : 'Десятый'
                    },
                    {
                        id : 11,
                        title : 'Одиннадцатый'
                    },
                    {
                        id : 12,
                        title : 'Двенадцатый',
                        align: 'left'
                    },
                    {
                        id : 13,
                        title : 'Тринадцатый'
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
        it('prepareItemClass', function () {
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
                        type: "photo"
                    }
                }),
               item3 = new Record({
                  rawData: {
                     karambola: '10',
                     _order: '2',
                     isMainTab: true
                  }
               }),
               item4 = new Record({
                  rawData: {
                     karambola: '10',
                     _order: '2',
                     isMainTab: false
                  }
               }),
                options = {
                    style: "additional",
                    selectedKey: '15',
                    keyProperty: 'karambola'
                },
                expected =  'controls-Tabs__item controls-Tabs__item_align_left controls-Tabs_style_secondary__item_state_selected controls-Tabs__item_state_selected',
                expected2 = 'controls-Tabs__item controls-Tabs__item_align_right controls-Tabs__item_state_default controls-Tabs__item_type_photo',
                expected3 = 'controls-Tabs__item controls-Tabs__item_align_right controls-Tabs__item_state_default controls-Tabs__item_canShrink',
                expected4 = 'controls-Tabs__item controls-Tabs__item_align_right controls-Tabs__item_state_default';
            assert.equal(expected, TabsButtons._private.prepareItemClass(item, '144', options, 144), 'wrong order cross-brwoser styles');
            assert.equal(expected2, TabsButtons._private.prepareItemClass(item2, '2', options, 144), 'wrong order cross-brwoser styles');
            assert.equal(expected3, TabsButtons._private.prepareItemClass(item3, '2', options, 144));
            assert.equal(expected4, TabsButtons._private.prepareItemClass(item4, '2', options, 144));
        });
    })
});