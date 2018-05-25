define([
   'Core/core-merge',
   'Controls/Calendar/Month/Model',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   MonthModel,
   DateUtil,
   calendarTestUtils
) {
   'use strict';

   let config = {
      month: new Date(2017, 0, 1)
   };

   describe('Controls/Calendar/Month/MonthModel', function() {
      describe('Initialisation', function() {

         it('should create the correct model for the month with selection when creating', function() {
            let mvm, weeks, cfg;

            cfg = coreMerge({
               startValue: new Date(2017, 0, 2),
               endValue: new Date(2017, 1, -1)
            }, config, {preferSource: true});

            mvm = new MonthModel(cfg);
            weeks = mvm.getMonthArray();

            calendarTestUtils.assertMonthView(weeks, function (day) {
               if (day.date.getMonth() === 0 && (day.date.getDate() !== 1 && day.date.getDate() !== 31)) {
                  assert.isTrue(day.selected);
               } else {
                  assert.isFalse(day.selected);
               }
            });
            assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
         });
      });

   });
});
