/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Lists/ItemsControl', 'js!WS.Data/Collection/RecordSet', 'js!WS.Data/Source/Memory', 'Core/core-instance'],
   function (ItemsControl, RecordSet, MemorySource, cInstance) {

      'use strict';

      describe('WSControls.ItemsControl', function () {
         var data;

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
            ]
         });

         describe('Init', function () {

            it('Array.Simple', function () {
               var ctrl = new ItemsControl({
                  items : data
               });

               var drawedItems = ctrl._records;
               assert.equal(data.length, drawedItems.length, 'Count of drawed items is not equal to count of src items');
            });

            it('Recordset.Simple', function () {
               var rs = new RecordSet({
                     rawData: data,
                     idProperty : 'id'
                  }),
                  ctrl = new ItemsControl({
                     items : rs,
                     idProperty: 'id'
                  });

               var drawedItems = ctrl._records;
               assert.equal(rs.getCount(), drawedItems.length, 'Count of drawed items is not equal to count of src items');
            });

            it('Array.Simple + Source', function () {
               var source = new MemorySource({
                  data: data,
                  idProperty : 'id'
               });

               var ctrl = new ItemsControl({
                  items : data,
                  dataSource : source,
                  handlers : {
                     'onDataLoad' : function() {
                        assert.isTrue(cInstance.instanceOfModule(this._getItems(), 'WS.Data/Collection/RecordSet'), 'ItemsControl getItems() after reload() must returns Recordset');

                        var drawedItems = ctrl._records;
                        assert.equal(data.length, drawedItems.length, 'Count of drawed items is not equal to count of src items');
                     }
                  }
               });
            });

            it('Recordset + Source', function () {
               var source = new MemorySource({
                  data: data,
                  idProperty : 'id'
               });

               var rs = new RecordSet({
                  rawData: data,
                  idProperty : 'id'
               });

               var ctrl = new ItemsControl({
                  items : rs,
                  dataSource : source,
                  handlers : {
                     'onDataLoad' : function() {
                        assert.equal(rs, this._getItems(), 'After reload getItems() must return instance of initial recordset');

                        var drawedItems = ctrl._records;
                        assert.equal(data.length, drawedItems.length, 'Count of drawed items is not equal to count of src items');
                     }
                  }
               });
            });

         });
      });
   });