/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/Controllers/SourceController',
   'WS.Data/Source/Memory',
   'Core/core-instance'
], function(SourceController, MemorySource, cInstance){
   describe('Controls.Controllers.SourceController', function () {
      var data, source;
      beforeEach(function() {
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

      });

      it('prepareSource', function () {
         var resSource;

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
         assert.equal('id', resSource.getIdProperty(), 'prepareSource doesn\'t returns datasource by config');
      });

      it('load', function (done) {
         var controller = new SourceController({
            source: source
         });

         var def = controller.load();
         assert.isTrue(controller.isLoading(), 'Wrong _isloading value');
         def.addCallback(function(rs){
            assert.isFalse(controller.isLoading(), 'Wrong _isloading value');
            assert.isTrue(cInstance.instanceOfModule(rs, 'WS.Data/Collection/RecordSet'), 'load doesn\'t returns recordset instance');
            assert.equal(3, rs.getCount(), 'load doesn\'t returns recordset instance');
            controller.destroy();
            done();
         });


      });

      it('load + navigation', function (done) {
         var controller = new SourceController({
            source: source,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 1,
                  mode: 'totalCount'
               }
            }

         });
         controller.load().addCallback(function(rs){
            assert.isTrue(cInstance.instanceOfModule(rs, 'WS.Data/Collection/RecordSet'), 'load doesn\'t returns recordset instance');
            assert.equal(1, rs.getCount(), 'Load doesn\'t returns correct records count');

            assert.isTrue(controller.hasMoreData('down'), 'Wrong has more value after load');
            assert.isFalse(controller.hasMoreData('up'), 'Wrong has more value after load');
            controller.destroy();
            done();
         });


      });

      it('filters', function (done) {
         var controller = new SourceController({
            source: source
         });
         controller.load({id: 2}).addCallback(function(rs){
            assert.equal(1, rs.getCount(), 'Load with filter doesn\'t returns correct records count');
            done();
         });

      });

      it('sorting', function (done) {
         var controller = new SourceController({
            source: source
         });
         controller.load({}, [{id: 'DESC'}]).addCallback(function(rs){

            assert.equal(3, rs.getCount(), 'Load with sorting doesn\'t returns correct records count');
            assert.equal(3, rs.at(0).get('id'), 'Load with sorting doesn\'t returns correct records order');

            done();
         });

      });
   })
});