define([
   'Core/core-merge',
   'Controls/_datePopup/DateRange',
   'Controls/_datePopup/Utils',
   'Controls/Utils/Date',
   'unit/Calendar/Utils'
], function(
   coreMerge,
   DateRange,
   datePopupUtils,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2),
      year = new Date(2018, 0, 1);

   let sandbox;

   describe('Controls/_datePopup/DateRange', function() {
      describe('Initialisation', function() {
         beforeEach(function() {
            sandbox = sinon.sandbox.create();
            sandbox.stub(datePopupUtils.default, 'getElementByDate');
         });

         afterEach(function() {
            sandbox.restore();
            sandbox = null;
         });

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
         });

      });
   });
});
