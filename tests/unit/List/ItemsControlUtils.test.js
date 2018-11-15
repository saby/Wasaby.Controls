/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['Controls/List/resources/utils/ItemsUtil', 'WS.Data/Collection/RecordSet', 'WS.Data/Source/Memory', 'Core/core-instance', 'WS.Data/Types/Enum'],
   function (ItemsUtil, RecordSet, MemorySource, cInstance, Enum) {

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
               groupMethod: groupFnc
            };
         });
         
         describe('ItemsUtil', function () {
            var proj;
            it('Flat display Array', function () {
               proj = ItemsUtil.getDefaultDisplayFlat(data, cfg1, [cfg1.itemsFilterMethod]);

               assert.equal(proj.getFilter()[0], filterFnc, 'itemsFilterMethod doesn\'t transfer to display');
               assert.equal(proj.getGroup(), groupFnc, 'groupBy doesn\'t transfer to display');
            });

            it('Flat display Recordset', function () {
               var rs = new RecordSet({
                  rawData: data,
                  idProperty : 'id'
               });
               proj = ItemsUtil.getDefaultDisplayFlat(rs, cfg1, [cfg1.itemsFilterMethod]);
               assert.equal(proj.getFilter()[0], filterFnc, 'itemsFilterMethod doesn\'t transfer to display');
               assert.equal(proj.getGroup(), groupFnc, 'groupBy doesn\'t transfer to display');

            });

            it('getPropertyValue', function () {
               var rs = new RecordSet({
                  rawData: data,
                  idProperty : 'id'
               });

               var value = ItemsUtil.getPropertyValue(rs.at(0), 'title');
               assert.equal('Первый', value, 'getPropertyValue doesn\'t return value of the record field');

               value = ItemsUtil.getPropertyValue(data[0], 'title');
               assert.equal('Первый', value, 'getPropertyValue doesn\'t return value of the native object field');

               value = ItemsUtil.getPropertyValue('Первый', 'title');
               assert.equal('Первый', value, 'getPropertyValue doesn\'t return value of the flag/enum item');
            });

            it('getDisplayItemById', function () {
               var rs = new RecordSet({
                  rawData: data,
                     idProperty : 'id'
               }),
               myEnum = new Enum({
                  dictionary: ['Первый', 'Второй', 'Третий']
               });

               var displayRs = ItemsUtil.getDefaultDisplayFlat(rs, {}),
               displayArray = ItemsUtil.getDefaultDisplayFlat(data, {}),
               displayEnum = ItemsUtil.getDefaultDisplayFlat(myEnum, {});

               var value = ItemsUtil.getDisplayItemById(displayRs, 2);
               assert.equal(rs.getRecordById(2), value.getContents(), 'getItemById doesn\'t return record from recordset');

               value = ItemsUtil.getDisplayItemById(displayArray, 2, 'id');
               assert.equal(data[1], value.getContents(), 'getItemById doesn\'t return object from array');

               value = ItemsUtil.getDisplayItemById(displayEnum, 'Второй');
               assert.equal('Второй', value.getContents(), 'getPropertyValue doesn\'t return value of Enum');
            });

         });
      });
   });