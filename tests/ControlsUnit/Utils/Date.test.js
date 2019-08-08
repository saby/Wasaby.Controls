define([
   'Controls/Utils/Date'
], function(
   dateUtil
) {
   describe('Controls/Utils/Date', function () {
      describe('getDaysInMonth', function() {
         [
            { date: new Date(2018, 0, 4), resp: 31 },
            { date: new Date(2018, 1, 4), resp: 28 },
            { date: new Date(2016, 1, 4), resp: 29 },
            { date: new Date(2018, 3, 1), resp: 30 }
         ].forEach(function(test) {
            it(`should return ${test.resp} for ${test.date}`, function() {
               assert.equal(dateUtil.getDaysInMonth(test.date), test.resp);
            });
         });
      });
   });
});
