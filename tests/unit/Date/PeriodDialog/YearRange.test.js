define([
   'Core/core-merge',
   'Controls/Date/PeriodDialog/YearsRange',
   'Controls/Utils/Date',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   YearsRange,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2),
      year = new Date(2018, 0, 1);

   describe('Controls/Date/PeriodDialog/YearRange', function() {
      describe('Initialisation', function() {

         it('should create the correct models when empty range passed.', function() {
            const component = calendarTestUtils.createComponent(YearsRange, { year: year });
            assert.isNull(component._rangeModel.startValue);
            assert.isNull(component._rangeModel.endValue);
         });

         it('should create the correct range model when range passed.', function() {
            const component = calendarTestUtils.createComponent(
               YearsRange,
               { year: year, startValue: start, endValue: end }
            );
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, end));
         });
      });


      describe('_onPrevClick', function() {
         it('should decrease year.', function() {
            const component = calendarTestUtils.createComponent(YearsRange, { year: year });
            component._onPrevClick();
            assert(component._year, year.getFullYear() - 1);
         });
      });

      describe('_onNextClick', function() {
         it('should increase year.', function() {
            const component = calendarTestUtils.createComponent(YearsRange, { year: year });
            component._onNextClick();
            assert(component._year, year.getFullYear() + 1);
         });
      });

   });
});
