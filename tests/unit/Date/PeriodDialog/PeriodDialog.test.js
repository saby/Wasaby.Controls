define([
   'Core/core-merge',
   'Controls/Date/PeriodDialog',
   'Controls/Utils/Date',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   PeriodDialog,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2);

   describe('Controls/Date/PeriodDialog', function() {
      describe('Initialisation', function() {

         it('should create the correct range model when empty range passed.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});

            assert.isTrue(component._monthStateEnabled);
            assert.isTrue(component._yearStateEnabled);
            assert.strictEqual(component._state, component._STATES.year);
            assert.strictEqual(component._yearRangeSelectionType, 'range');
         });

         it('should create the correct range models when empty range passed.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            assert.isNull(component._rangeModel.startValue);
            assert.isNull(component._rangeModel.endValue);
            assert.isNull(component._headerRangeModel.startValue);
            assert.isNull(component._headerRangeModel.endValue);
            assert.isNull(component._yearRangeModel.startValue);
            assert.isNull(component._yearRangeModel.endValue);
         });

         it('should create the correct range models when range passed.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, { startValue: start, endValue: end });
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, end));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, end));
            assert.isNull(component._yearRangeModel.startValue);
            assert.isNull(component._yearRangeModel.endValue);
         });

         [
            {},
            { selectionType: PeriodDialog.SELECTION_TYPES.quantum, quantum: { months: [1], days: [1] } }
         ].forEach(function(options) {
            it(`should enable year and month modes if options are equals ${JSON.stringify(options)}.`, function () {
               const component = calendarTestUtils.createComponent(PeriodDialog, {});
               assert.isTrue(component._monthStateEnabled);
               assert.isTrue(component._yearStateEnabled);
               assert.strictEqual(component._state, component._STATES.year);
            });
         });

         [
            { selectionType: PeriodDialog.SELECTION_TYPES.single },
            { selectionType: PeriodDialog.SELECTION_TYPES.quantum, quantum: { days: [1] } }
         ].forEach(function(options) {
            it(`should enable only month mode if options are equals ${JSON.stringify(options)}.`, function() {
               const component = calendarTestUtils.createComponent(PeriodDialog, options);
               assert.isTrue(component._monthStateEnabled);
               assert.isFalse(component._yearStateEnabled);
            });
         });

         [
            { selectionType: PeriodDialog.SELECTION_TYPES.quantum, quantum: { years: [1] } },
            { selectionType: PeriodDialog.SELECTION_TYPES.quantum, quantum: { months: [1] } }
         ].forEach(function(options) {
            it(`should enable only year mode if options are equals ${JSON.stringify(options)}.`, function() {
               const component = calendarTestUtils.createComponent(PeriodDialog, options);
               assert.isFalse(component._monthStateEnabled);
               assert.isTrue(component._yearStateEnabled);
            });
         });
      });

      describe('_toggleState', function() {
         it('should toggle state.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            assert.strictEqual(component._state, component._STATES.year);
            component._toggleState();
            assert.strictEqual(component._state, component._STATES.month);
         });
      });

      describe('_yearsRangeChanged', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._yearsRangeChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, dateUtils.getEndOfYear(end)));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, dateUtils.getEndOfYear(end)));
         });
      });

      describe('_yearsSelectionChanged', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._yearsSelectionChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, dateUtils.getEndOfYear(end)));
         });
      });

      describe('_yearsSelectionStarted', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._yearsSelectionStarted(null, start, end);
            assert.equal(component._monthRangeSelectionViewType, 'days');
         });
      });

      describe('_monthsRangeChanged', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._monthsRangeChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, dateUtils.getEndOfMonth(end)));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, dateUtils.getEndOfMonth(end)));
         });
      });

      describe('_monthsSelectionChanged', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._monthsSelectionChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, dateUtils.getEndOfMonth(end)));
         });
      });

      describe('_monthRangeMonthClick', function() {
         it('should toggle state.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            assert.strictEqual(component._state, component._STATES.year);
            component._toggleState();
            assert.strictEqual(component._state, component._STATES.month);
         });
      });

      describe('_monthRangeFixedPeriodClick', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._monthRangeFixedPeriodClick(null, start, end);
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, end));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, end));
            assert.isFalse(component._monthRangeSelectionProcessing);
         });
      });

      describe('_dateRangeChanged', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._dateRangeChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, end));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, end));
         });
      });

      describe('_dateRangeSelectionChanged', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._dateRangeSelectionChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, end));
         });
      });

      describe('_dateRangeFixedPeriodClick', function() {
         it('should update range models.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._dateRangeFixedPeriodClick(null, start, end);
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, end));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, end));
            assert.isFalse(component._monthRangeSelectionProcessing);
         });
      });
   });
});
