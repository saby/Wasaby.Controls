define([
   'Core/core-merge',
   'Controls/_calendar/MonthList/ListControl',
   'Types/collection'
], function(
   coreMerge,
   ListControl,
   collection
) {
   'use strict';

   ListControl = ListControl.default;

   describe('Controls/Date/MonthList/ListControl', function() {
      describe('getQuery', function() {
         [{
            caption: 'should return correct query object for itemMode: "month"',
            itemMode: 'month',
            rawData: [{
               id: '2001-01-01',
               title: 'first',
            }, {
               id: '2001-02-01',
               title: 'first',
            }],
            where: '2000-12-01',
            limit: 2
         }, {
            caption: 'should return correct query object for itemMode: "year"',
            itemMode: 'year',
            rawData: [{
               id: '2001-01-01',
               title: 'first',
            }, {
               id: '2002-01-01',
               title: 'first',
            }],
            where: '2000-12-01',
            limit: 24
         }].forEach(function (test) {
            it(test.caption, function () {
               let
                  rs = new collection.RecordSet({
                     rawData: test.rawData,
                     idProperty: 'id'
                  }),
                  query = ListControl._private.getQuery(rs, test.itemMode);

               assert.deepEqual(query._where, {'id>=': test.where});
               assert.equal(query._limit, test.limit);
            });
         });
      });

      describe('getDataForEnrich', function() {
         [{
            caption: 'should return correct data object for itemMode: "month"',
            itemMode: 'month',
            rawData: [{
               id: '2019-01-01',
               extData: []
            }, {
               id: '2019-02-01',
               extData: []
            }],
            respData: [{
               id: '2019-01-01',
               date: new Date(2019, 0),
               extData: []
            }, {
               id: '2019-02-01',
               date: new Date(2019, 1),
               extData: []
            }]
         }, {
            caption: 'should return correct data object for itemMode: "year"',
            itemMode: 'year',
            rawData: [{
               id: '2019-01-01',
               extData: [1]
            }, {
               id: '2019-02-01',
               extData: [2]
            }, {
               id: '2019-03-01',
               extData: [3]
            }, {
               id: '2019-04-01',
               extData: [4]
            }, {
               id: '2019-05-01',
               extData: [5]
            }, {
               id: '2019-06-01',
               extData: [6]
            }, {
               id: '2019-07-01',
               extData: [7]
            }, {
               id: '2019-08-01',
               extData: [8]
            }, {
               id: '2019-09-01',
               extData: [9]
            }, {
               id: '2019-10-01',
               extData: [10]
            }, {
               id: '2019-11-01',
               extData: [11]
            }, {
               id: '2019-12-01',
               extData: [12]
            }],
            respData: [{
               id: '2019-01-01',
               date: new Date(2019, 0),
               extData: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]]
            }]
         }].forEach(function(test) {
            it(test.caption, function() {
               let
                  rs = new collection.RecordSet({
                     rawData: test.rawData,
                     idProperty: 'id'
                  }),
                  context = {},
                  resp = ListControl._private.getDataForEnrich.call(context, rs, test.itemMode);

               assert.deepEqual(resp._getRawData(), test.respData);
            });
         });
      });
   });
});
