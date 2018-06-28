define([
   'Controls/Calendar/Utils',
   'SBIS3.CONTROLS/Utils/DateUtil'
], function(
   Utils,
   DateUtil
) {
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

      it('getWeeksArray', function() {
         let weeks = Utils.getWeeksArray(new Date(2017, 0, 1));
         assert.equal(weeks.length, 6);
         for (let week of weeks) {
            assert.equal(week.length, 7);
         }
         assert.isTrue(DateUtil.isDatesEqual(weeks[0][0], new Date(2016, 11, 26)));
      });

      describe('updateRangeByQuantum', function() {
         const tests = [{
            baseDate: new Date(2018, 0, 15),
            date: new Date(2018, 0, 16),
            quantum: {},
            ret: [new Date(2018, 0, 15), new Date(2018, 0, 16)]
         }, {
            baseDate: new Date(2018, 0, 16),
            date: new Date(2018, 0, 15),
            quantum: {},
            ret: [new Date(2018, 0, 15), new Date(2018, 0, 16)]
         }, {
            baseDate: new Date(2018, 0, 15),
            date: new Date(2018, 0, 16),
            quantum: {days: [1]},
            ret: [new Date(2018, 0, 15), new Date(2018, 0, 15)]
         }, {
            baseDate: new Date(2018, 0, 16),
            date: new Date(2018, 0, 15),
            quantum: {days: [1]},
            ret: [new Date(2018, 0, 16), new Date(2018, 0, 16)]
         }, {
            baseDate: new Date(2018, 0, 16),
            date: new Date(2018, 0, 17),
            quantum: {weeks: [1]},
            ret: [new Date(2018, 0, 15), new Date(2018, 0, 21)]
         }, {
            baseDate: new Date(2018, 0, 17),
            date: new Date(2018, 0, 16),
            quantum: {weeks: [1]},
            ret: [new Date(2018, 0, 15), new Date(2018, 0, 21)]
         }, {
            baseDate: new Date(2018, 0, 16),
            date: new Date(2018, 0, 17),
            quantum: {months: [1]},
            ret: [new Date(2018, 0, 1), new Date(2018, 0, 31)]
         }, {
            baseDate: new Date(2018, 0, 17),
            date: new Date(2018, 0, 16),
            quantum: {months: [1]},
            ret: [new Date(2018, 0, 1), new Date(2018, 0, 31)]
         }];
         tests.forEach(function(test) {
            it(`updateRangeByQuantum(${test.baseDate}, ${test.date}, ${test.quantum})`, function() {
               assert.deepEqual(Utils.updateRangeByQuantum(test.baseDate, test.date, test.quantum), test.ret);
            });
         });
      });
   });
});
