define([
   'Core/core-merge',
   'Controls/Date/MonthList',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tests/Calendar/Utils'
], function(
   coreMerge,
   MonthList,
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
            let mv = calendarTestUtils.createComponent(MonthList, config);
            assert.isTrue(DateUtil.isDatesEqual(mv._getMonth(2018, 1), new Date(2018, 1, 1)));
         });
      });
   });
});
