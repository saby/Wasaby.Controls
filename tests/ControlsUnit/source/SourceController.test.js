/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/source',
   'Types/source',
   'Core/core-instance',
   'Types/collection'
], function(scroll, sourceLib, cInstance, collection){

   const data = [
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
   function getControllerWithMultiNavigation() {
      const source = new sourceLib.Memory({
         keyProperty: 'id',
         data: data
      });
      const controller = new scroll.Controller({
         source: source,
         navigation: {
            source: 'page',
            sourceConfig: {
               pageSize: 1,
               hasMore: false
            }
         }
      });
      const metaMultiNavigation = {
         more: new collection.RecordSet({
            rawData: [
               {
                  id: 1,
                  nav_result: 3
               },
               {
                  id: 2,
                  nav_result: 3
               }
            ]
         })
      };
      const recordSetWithMultiNavigation = new collection.RecordSet();
      recordSetWithMultiNavigation.setMetaData(metaMultiNavigation);
      controller.calculateState(recordSetWithMultiNavigation);
      return controller;
   }

   describe('Controls.Controllers.SourceController', function () {
      var source;
      beforeEach(function() {
         source = new sourceLib.Memory({
            data: data,
            keyProperty: 'id'
         });

      });

      describe('load', function () {

         it('load from source', (done) => {
            var controller = new scroll.Controller({
               source: source
            });

            var def = controller.load();
            assert.isTrue(controller.isLoading(), 'Wrong _isloading value');
            def.addCallback(function(rs){
               assert.isFalse(controller.isLoading(), 'Wrong _isloading value');
               assert.isTrue(cInstance.instanceOfModule(rs, 'Types/collection:RecordSet'), 'load doesn\'t returns recordset instance');
               assert.equal(3, rs.getCount(), 'load doesn\'t returns recordset instance');
               controller.destroy();
               done();
            });
         });

         it('load with multiNavigation', () => {
            const controller = getControllerWithMultiNavigation();
            const originQuery = controller._source.query;
            let queryInstance;
            controller._source.query = (query) => {
               queryInstance = query;
               return originQuery.apply(controller._source, arguments);
            };
            return new Promise((resolve) => {
               controller.load({}, null, null, {multiNavigation: true}).then(() => {
                  assert.equal(queryInstance.getUnion().length, 1);
                  resolve();
               });
            });
         });

      });

      it('load with config', function (done) {
         const controller = new scroll.Controller({
            source: source,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 1,
                  hasMore: false
               }
            }
         });
         const sandbox = sinon.createSandbox();
         const stub = sandbox.stub(controller._queryParamsController, 'updateQueryProperties');
         const config = {};

         controller.load({}, null, 'down', config).addCallback(function(rs) {
            assert.isTrue(stub.calledWith(rs, 'down', config));
            sandbox.restore();
            done();
         });
      });


      it('load + navigation', function (done) {
         var controller = new scroll.Controller({
            source: source,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 1,
                  hasMore: false
               }
            }
         });
         controller.load().addCallback(function(rs){
            assert.isTrue(cInstance.instanceOfModule(rs, 'Types/collection:RecordSet'), 'load doesn\'t returns recordset instance');
            assert.equal(1, rs.getCount(), 'Load doesn\'t returns correct records count');

            assert.isTrue(controller.hasMoreData('down'), 'Wrong has more value after load');
            assert.isFalse(controller.hasMoreData('up'), 'Wrong has more value after load');
            controller.destroy();
            done();
         });
      });

      it('modifyQueryParamsWithNavigation', function () {
         var controller = new scroll.Controller({
            source: source,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 10,
                  hasMore: false
               }
            }
         });
         var resParams = scroll.Controller._private.modifyQueryParamsWithNavigation({
            cleanParams: {filter: {}},
            direction: null,
            paramsController: controller._queryParamsController
         });
         assert.deepEqual({filter:{}, limit: 10, offset: 0, meta: { hasMore: false, navigationType: sourceLib.SbisService.NAVIGATION_TYPE.PAGE } }, resParams[0], 'Wrong query params in page navigation');

         controller = new scroll.Controller({
            source: source,
            navigation: {
               source: 'position',
               sourceConfig: {
                  limit: 10,
                  field: 'id',
                  direction: 'forward',
                  position: 2
               }
            }
         });
         resParams = scroll.Controller._private.modifyQueryParamsWithNavigation({
            cleanParams:{ filter: {}, meta: { navigationType: sourceLib.SbisService.NAVIGATION_TYPE.POSITION } },
            direction: null,
            paramsController: controller._queryParamsController
         });
         assert.deepEqual({limit: 10, offset: undefined, filter: {'id>=': 2}, meta: { navigationType: sourceLib.SbisService.NAVIGATION_TYPE.POSITION } }, resParams[0], 'Wrong query params in position navigation');

         var originalFilter = {};
         resParams = scroll.Controller._private.modifyQueryParamsWithNavigation({
             cleanParams: { filter: {}, meta: { navigationType: sourceLib.SbisService.NAVIGATION_TYPE.POSITION } },
             direction: null,
             paramsController: controller._queryParamsController
         });
         assert.notEqual(originalFilter, resParams.filter, 'Modified filter should be a new object instance');
      });

      it('filters', function (done) {
         var controller = new scroll.Controller({
            source: source
         });
         controller.load({id: 2}).addCallback(function(rs){
            assert.equal(1, rs.getCount(), 'Load with filter doesn\'t returns correct records count');
            done();
         });

      });

      it('sorting', function (done) {
         var controller = new scroll.Controller({
            source: source
         });
         controller.load({}, [{id: 'DESC'}]).addCallback(function(rs){

            assert.equal(3, rs.getCount(), 'Load with sorting doesn\'t returns correct records count');
            assert.equal(3, rs.at(0).get('id'), 'Load with sorting doesn\'t returns correct records order');

            done();
         });

      });

      it('calculateState', function () {
         const controller = new scroll.Controller({
            source: source,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 1,
                  hasMore: true
               }
            }
         });
         const loadedRecordSet = new collection.RecordSet({
            keyProperty: 'id',
            rawData: data
         });
         loadedRecordSet.setMetaData({
            more: true
         });
         controller.calculateState(loadedRecordSet, 'down', 'testRoot');
         assert.isTrue(controller.hasMoreData('down', 'testRoot'));

         loadedRecordSet.setMetaData({
            more: false
         });
         controller.calculateState(loadedRecordSet, 'down', 'testRoot');
         assert.isFalse(controller.hasMoreData('down', 'testRoot'));
      });
   })
});
