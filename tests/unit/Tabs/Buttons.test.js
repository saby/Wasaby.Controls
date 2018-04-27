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
                   keyProperty: 'id'
                });

            TabsButtons._private.initItems(source, tabInstance).addCallback(function(items) {
                assert.equal(1, items.getRecordById('1').get('_order'), 'incorrect  left order');
                assert.equal(30, items.getRecordById('2').get('_order'), 'incorrect right order');
                assert.equal(5, items.getRecordById('12').get('_order'), 'incorrect right order');
                assert.equal(36, items.getRecordById('11').get('_order'), 'incorrect right order');
                assert.equal(37, tabInstance._lastRightOrder, 'incorrect last right order');
                tabInstance.destroy();
                done();
            })
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
                options = {
                    style: "additional",
                    selectedKey: '15',
                    keyProperty: 'karambola'
                },
                expected =  'controls-Tabs__item controls-Tabs__item_align_left controls-Tabs_style_additional__item_state_selected controls-Tabs__item_state_selected',
                expected2 = 'controls-Tabs__item controls-Tabs__item_align_right controls-Tabs__item_state_default controls-Tabs__item_type_photo';
            assert.equal(expected, TabsButtons._private.prepareItemClass(item, options, 144), 'wrong order cross-brwoser styles');
            assert.equal(expected2, TabsButtons._private.prepareItemClass(item2, options, 144), 'wrong order cross-brwoser styles');
        });
    })
});