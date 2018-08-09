define([
   'Core/core-merge',
   'Controls/Date/PeriodDialog/DateRange',
   'Controls/Utils/Date',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   DateRange,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2),
      year = new Date(2018, 0, 1);

   describe('Controls/Date/PeriodDialog/DateRange', function() {
      describe('Initialisation', function() {

         it('should create the correct models when empty range passed.', function() {
            const component = calendarTestUtils.createComponent(DateRange, { year: year });
            assert.isNull(component._rangeModel.startValue);
            assert.isNull(component._rangeModel.endValue);
         });

         it('should create the correct range model when range passed.', function() {
            const component = calendarTestUtils.createComponent(
               DateRange,
               { year: year, startValue: start, endValue: end }
            );
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, end));
         });

         [
            { options: { selectionType: 'range' }, eq: true },
            { options: { selectionType: 'quantum', quantum: { months: [1] } }, eq: true },
            { options: { selectionType: 'quantum', quantum: { years: [1] } }, eq: false },
            { options: { selectionType: 'single' }, eq: false }
         ].forEach(function(test) {
            it(`should set proper _monthSelectionEnabled for options ${JSON.stringify(test.options)}.`, function() {
               const component = calendarTestUtils.createComponent(DateRange, test.options);
               assert.equal(component._monthSelectionEnabled, test.eq);
            });
         })

      });
   });
});
