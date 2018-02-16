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
                expected =  '-webkit-box-ordinal-group:2; -moz-box-ordinal-group:2; -ms-flex-order:2; -webkit-order:2; order:2';
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
                        title : 'Второй',
                    },
                    {
                        id : 3,
                        title : 'Третий',
                    }
                ],
                source = new MemorySource({
                    data: data,
                    idProperty: 'id'
                });

            TabsButtons._private.initItems(source, tabInstance).addCallback(function(items) {
                assert(1, items.getRecordById('1'), 'incorrect  left order');
                assert(30, items.getRecordById('2'), 'incorrect right order');
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
                        _order: '2'
                    }
                }),
                options = {
                    style: "additional",
                    selectedKey: '15',
                    keyProperty: 'karambola'
                },
                expected =  'controls-Tabs__item controls-Tabs__item_align_left controls-Tabs_style_additional__item_state_selected controls-Tabs__item_state_selected',
                expected2 = 'controls-Tabs__item controls-Tabs__item_align_right controls-Tabs__item_state_default';
            assert.equal(expected, TabsButtons._private.prepareItemClass(item, options, 144), 'wrong order cross-brwoser styles');
            assert.equal(expected2, TabsButtons._private.prepareItemClass(item2, options, 144), 'wrong order cross-brwoser styles');
        });
    })
});