define([
   'Controls/Calendar/Utils'
], function(Utils) {
   describe('Controls.Calendar.Utils', function() {
      
      it('getFirstDayOffset', function() {
         assert.equal(Utils.getFirstDayOffset(2017, 12), 4);
         assert.equal(Utils.getFirstDayOffset(2017, null), 6);
      });
      
      it('getDaysInMonth', function() {
         assert.equal(Utils.getDaysInMonth(2017, 12), 31);
         assert.equal(Utils.getDaysInMonth(2017, 2), 28);
         assert.equal(Utils.getDaysInMonth(2016, 2), 29);
      });
      
      it('getWeeksInMonth', function() {
         assert.equal(Utils.getWeeksInMonth(2017, 12), 5);
         assert.equal(Utils.getWeeksInMonth(2018, 4), 6);
      });
      
   })
});