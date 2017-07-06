/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Lists/resources/utils/DataSourceUtil', 'js!WSControls/Lists/resources/utils/ItemsUtil', 'js!WS.Data/Collection/RecordSet'
   , 'js!WS.Data/Source/Memory', 'Core/core-instance'],
   function (DataSourceUtil, ItemsUtil, RecordSet, MemorySource, cInstance) {

      'use strict';

      describe('WSControls.Lists.Utils', function () {
         var data, cfg1, cfg2, sortFnc, filterFnc, groupFnc;

         beforeEach(function() {
            data = [
               {
                  id : 1,
                  title : 'Первый'
               },
               {
                  id : 2,
                  title : 'Второй'
               },
               {
                  id : 3,
                  title : 'Третий'
               }
            ],
            sortFnc = function() {
               return true
            },
            filterFnc = function() {
               return true
            },
            groupFnc = function() {
               return true
            },
            cfg1 = {
               itemsSortMethod : sortFnc,
               itemsFilterMethod : filterFnc,
               groupBy : {
                  method : groupFnc
               }
            },
            cfg2 = {
               groupBy : {
                  field : 'title'
               }
            }
         });

         describe('DataSourceUtil', function () {
            var dataSource;
            beforeEach(function() {
               dataSource = new MemorySource({
                  data: data,
                  idProperty: 'id'
               });
            });

            it('prepareSource', function () {


               var resSource = DataSourceUtil.prepareSource(dataSource);
               assert.equal(dataSource, resSource, 'prepareSource doesn\'t returns initial datasource');

               resSource = DataSourceUtil.prepareSource({
                  module: 'js!WS.Data/Source/Memory',
                  options: {
                     data: data,
                     idProperty: 'id'
                  }
               });

               assert.isTrue(cInstance.instanceOfModule(resSource, 'WS.Data/Source/Memory'), 'prepareSource doesn\'t returns datasource by config');
               assert.equal('id', resSource.getIdProperty(), 'prepareSource doesn\'t returns datasource by config');

            });

            it('callQuery', function () {
               DataSourceUtil.callQuery(dataSource, 'id').addCallback(function(list){
                  assert.isTrue(cInstance.instanceOfModule(list, 'WS.Data/Collection/RecordSet'), 'callQuery doesn\'t returns recordset');
                  assert.equal('3', list.getCount(), 'callQuery doesn\'t returns recordset width all records by default');
               })
            })

         });
         describe('ItemsUtil', function () {
            var proj;
            it('Flat display Array', function () {
               proj = ItemsUtil.getDefaultDisplayFlat(data, cfg1);

               assert.equal(proj.getSort()[0], sortFnc, 'ItemsSortMethod doesn\'t transfer to projection');
               assert.equal(proj.getFilter()[0], filterFnc, 'itemsFilterMethod doesn\'t transfer to projection');
               assert.equal(proj.getGroup(), groupFnc, 'groupBy doesn\'t transfer to projection');
            });

            it('Flat display Recordset', function () {
               var rs = new RecordSet({
                  rawData: data,
                  idProperty : 'id'
               });
               proj = ItemsUtil.getDefaultDisplayFlat(rs, cfg1);
               assert.equal(proj.getSort()[0], sortFnc, 'ItemsSortMethod doesn\'t transfer to projection');
               assert.equal(proj.getFilter()[0], filterFnc, 'itemsFilterMethod doesn\'t transfer to projection');
               assert.equal(proj.getGroup(), groupFnc, 'groupBy doesn\'t transfer to projection');

               proj = ItemsUtil.getDefaultDisplayFlat(rs, cfg2);

            });

         });
      });
   });