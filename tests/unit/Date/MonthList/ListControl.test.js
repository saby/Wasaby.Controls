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
         it('should return correct query object', function() {
            let
               rs = new collection.RecordSet({
                  rawData: [{
                     id: 1,
                     title: 'first',
                  }, {
                     id: 2,
                     title: 'first',
                  }],
                  idProperty: 'id'
               }),
               query = ListControl._private.getQuery(rs);

            assert.deepEqual(query._where, { 'id>=': 0 });
            assert.equal(query._limit, 2);
         });
      });
   });
});
