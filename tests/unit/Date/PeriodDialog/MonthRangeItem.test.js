define([
   'Core/core-merge',
   'Controls/_datePopup/MonthsRangeItem',
   'Controls/Utils/Date',
   'unit/Calendar/Utils'
], function(
   coreMerge,
   MonthsRangeItem,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   MonthsRangeItem = MonthsRangeItem.default;

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2);

   describe('Controls/Date/PeriodDialog/MonthRangeItem', function() {
      describe('Initialisation', function() {
         [{
            options: { selectionType: 'range', date: start},
            eq: { months: true, quarters: true, halfYears: true, years: true }
         }, {
            options: { selectionType: 'quantum', quantum: { days: [3] }, date: start },
            eq: { months: false, quarters: false, halfYears: false, years: false }
         }, {
            options: {
               selectionType: 'quantum',
               quantum: { months: [1], quarters: [1], halfyears: [1], years: [1] },
               date: start
            },
            eq: { months: true, quarters: true, halfYears: true, years: true }
         }].forEach(function(test) {
            it(`should set proper model for options ${JSON.stringify(test.options)}.`, function() {
               const component = calendarTestUtils.createComponent(MonthsRangeItem, test.options);

               assert.equal(component._monthsSelectionEnabled, test.eq.months);
               assert.equal(component._quarterSelectionEnabled, test.eq.quarters);
               assert.equal(component._halfyearSelectionEnabled, test.eq.halfYears);
               assert.equal(component._yearSelectionEnabled, test.eq.years);
            });
         });
      });

      // describe('_toggleState', function() {
      //    it('should toggle state.', function() {
      //       const component = calendarTestUtils.createComponent(PeriodDialog, {});
      //       assert.strictEqual(component._state, component._STATES.year);
      //       component._toggleState();
      //       assert.strictEqual(component._state, component._STATES.month);
      //    });
      // });
   });
});
