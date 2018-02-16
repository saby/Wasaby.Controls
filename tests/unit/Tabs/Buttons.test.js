/**
 * Created by ps.borisov on 16.02.2018.
 */
define([
    'Controls/Tabs/Buttons',
    'WS.Data/Source/Memory',
    'Core/core-instance'
], function(TabsButtons, MemorySource, cInstance){

    describe('Controls.Tabs.Buttons', function () {
        var data, source;
        /*beforeEach(function() {
            data = [
                {
                    id : 1,
                    title : 'Первый',
                    type: 1
                },
                {
                    id : 2,
                    title : 'Второй',
                    type: 2
                },
                {
                    id : 3,
                    title : 'Третий',
                    type: 2
                }
            ];
            source = new MemorySource({
                data: data,
                idProperty: 'id'
            });

        });*/

        it('prepareOrder', function () {
            assert.equal('id', 123, 'find me');
            /*var resSource;

            resSource = SourceController._private.prepareSource(source);
            assert.equal(source, resSource, 'prepareSource doesn\'t returns initial datasource');

            resSource = SourceController._private.prepareSource({
                module: 'WS.Data/Source/Memory',
                options: {
                    data: data,
                    idProperty: 'id'
                }
            });

            assert.isTrue(cInstance.instanceOfModule(resSource, 'WS.Data/Source/Memory'), 'prepareSource doesn\'t returns datasource by config');
            assert.equal('id', resSource.getIdProperty(), 'prepareSource doesn\'t returns datasource by config');*/
        });


    })
});