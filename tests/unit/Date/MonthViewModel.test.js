define([
   'Core/core-merge',
   'Controls/Date/MonthView/MonthViewModel',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   MonthViewModel,
   DateUtil,
   calendarTestUtils
) {
   'use strict';

   let config = {
      month: new Date(2017, 0, 1)
   };

   describe('Controls/Date/MonthView/MonthViewModel', function() {
      describe('Initialisation', function() {

         it('should create the correct model for the month when creating', function() {
            let mvm, weeks;

            mvm = new MonthViewModel(config);
            weeks = mvm.getMonthArray();

            assert.equal(weeks.length, 6);
            calendarTestUtils.assertMonthView(weeks);
            assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
         });

      });
   });
});
