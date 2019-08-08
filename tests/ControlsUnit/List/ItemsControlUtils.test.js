/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['Controls/list', 'Types/collection', 'Types/source', 'Core/core-instance'],
   function (list, collection, source, cInstance) {

      'use strict';

      describe('Controls.List.Utils', function () {
         var data, cfg1, filterFnc, groupFnc;

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
            filterFnc = function() {
               return true
            },
            groupFnc = function() {
               return true
            },
            cfg1 = {
               itemsFilterMethod : filterFnc,
               groupingKeyCallback: groupFnc
            };
         });
         
         describe('ItemsUtil', function () {
            var proj;
            it('Flat display Array', function () {
               proj = list.ItemsUtil.getDefaultDisplayFlat(data, cfg1, [cfg1.itemsFilterMethod]);

               assert.equal(proj.getFilter()[0], filterFnc, 'itemsFilterMethod doesn\'t transfer to display');
               assert.equal(proj.getGroup(), groupFnc, 'groupBy doesn\'t transfer to display');
            });

            it('Flat display Recordset', function () {
               var rs = new collection.RecordSet({
                  rawData: data,
                  idProperty : 'id'
               });
               proj = list.ItemsUtil.getDefaultDisplayFlat(rs, cfg1, [cfg1.itemsFilterMethod]);
               assert.equal(proj.getFilter()[0], filterFnc, 'itemsFilterMethod doesn\'t transfer to display');
               assert.equal(proj.getGroup(), groupFnc, 'groupBy doesn\'t transfer to display');

            });

            it('getPropertyValue', function () {
               var rs = new collection.RecordSet({
                  rawData: data,
                  idProperty : 'id'
               });

               var value = list.ItemsUtil.getPropertyValue(rs.at(0), 'title');
               assert.equal('Первый', value, 'getPropertyValue doesn\'t return value of the record field');

               value = list.ItemsUtil.getPropertyValue(data[0], 'title');
               assert.equal('Первый', value, 'getPropertyValue doesn\'t return value of the native object field');

               value = list.ItemsUtil.getPropertyValue('Первый', 'title');
               assert.equal('Первый', value, 'getPropertyValue doesn\'t return value of the flag/enum item');
            });

            it('getDisplayItemById', function () {
               var rs = new collection.RecordSet({
                  rawData: data,
                     idProperty : 'id'
               }),
               myEnum = new collection.Enum({
                  dictionary: ['Первый', 'Второй', 'Третий']
               });

               var displayRs = list.ItemsUtil.getDefaultDisplayFlat(rs, {}),
               displayArray = list.ItemsUtil.getDefaultDisplayFlat(data, {}),
               displayEnum = list.ItemsUtil.getDefaultDisplayFlat(myEnum, {});

               var value = list.ItemsUtil.getDisplayItemById(displayRs, 2);
               assert.equal(rs.getRecordById(2), value.getContents(), 'getItemById doesn\'t return record from recordset');

               value = list.ItemsUtil.getDisplayItemById(displayArray, 2, 'id');
               assert.equal(data[1], value.getContents(), 'getItemById doesn\'t return object from array');

               value = list.ItemsUtil.getDisplayItemById(displayEnum, 'Второй');
               assert.equal('Второй', value.getContents(), 'getPropertyValue doesn\'t return value of Enum');
            });

         });
      });
   });