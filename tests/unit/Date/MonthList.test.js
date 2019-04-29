define([
   'Core/core-merge',
   'Controls/calendar',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'unit/Calendar/Utils'
], function(
   coreMerge,
   calendar,
   DateUtil,
   calendarTestUtils
) {
   'use strict';
   let config = {
      month: new Date(2018, 0, 1)
   };

   describe('Controls/Date/MonthList', function() {
      describe('_getMonth', function() {
         it('should return correct month', function() {
            let mv = calendarTestUtils.createComponent(calendar.MonthList, config);
            assert.isTrue(DateUtil.isDatesEqual(mv._getMonth(2018, 1), new Date(2018, 1, 1)));
         });
      });
   });
});
