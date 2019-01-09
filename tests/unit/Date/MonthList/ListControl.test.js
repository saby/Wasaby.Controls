define([
   'Core/core-merge',
   'Controls/Date/MonthList/ListControl',
   'WS.Data/Collection/RecordSet'
], function(
   coreMerge,
   ListControl,
   RecordSet
) {
   'use strict';

   describe('Controls/Date/MonthList/ListControl', function() {
      describe('getQuery', function() {
         it('should return correct query object', function() {
            let
               rs = new RecordSet({
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
