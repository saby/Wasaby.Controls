/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Lists/ItemsControl', 'js!WS.Data/Collection/RecordSet'],
   function (ItemsControl, RecordSet) {

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
                  title : 'Первый'
               },
               {
                  id : 3,
                  title : 'Первый'
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

         });
      });
   });