define([
   'Core/core-merge',
   'Core/Deferred',
   'Types/formatter',
   'Controls/datePopup',
   'Controls/Utils/Date',
   'ControlsUnit/Calendar/Utils'
], function(
   coreMerge,
   Deferred,
   formatter,
   PeriodDialog,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2);

   const formatDate = function(date) {
      return formatter.date(date, formatter.date.FULL_DATE);
   };

   describe('Controls/Date/PeriodDialog', function() {
      describe('Initialisation', function() {

         it('should create the correct range model when empty range passed.', function() {
            const
               now = new Date(2019, 6, 1),
               clock = sinon.useFakeTimers(now.getTime(), 'Date'),
               component = calendarTestUtils.createComponent(PeriodDialog, {});

            assert.isTrue(component._monthStateEnabled);
            assert.isTrue(component._yearStateEnabled);
            assert.strictEqual(component._state, component._STATES.year);
            assert.strictEqual(component._yearRangeSelectionType, 'range');
            assert.strictEqual(component._headerType, 'link');
            assert(dateUtils.isDatesEqual(component._displayedDate, now));

            clock.restore();
         });

         it('should initialize if invalid start and end dates passed.', function() {
            const
               now = new Date(2019, 6, 1),
               clock = sinon.useFakeTimers(now.getTime(), 'Date'),
               component = calendarTestUtils.createComponent(PeriodDialog, {});

            assert(dateUtils.isDatesEqual(component._displayedDate, now));

            clock.restore();
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

         [{
            state: 'year',
            tests: [
               { },
               { startValue: new Date(2019, 0, 1), endValue: new Date(2019, 1, 0) },
               { startValue: new Date(2019, 0, 3), endValue: new Date(2019, 1, 10) }
            ]
         }, {
            state: 'month',
            tests: [
               { startValue: new Date(2019, 0, 1), endValue: new Date(2019, 0, 1) },
               { selectionType: PeriodDialog.SELECTION_TYPES.single },
               { selectionType: PeriodDialog.SELECTION_TYPES.quantum, quantum: { days: [1] } },
               { selectionType: PeriodDialog.SELECTION_TYPES.quantum, quantum: { weeks: [1] } }
            ]
         }].forEach(function(testGroup) {
            testGroup.tests.forEach(function(options) {
               it(`should set ${testGroup.state} state if options are equals ${JSON.stringify(options)}.`, function() {
                  const component = calendarTestUtils.createComponent(PeriodDialog, options);
                  assert.equal(component._state, testGroup.state);
               });
            });
         });

         it('should set correct header type.', function() {
            const component = calendarTestUtils.createComponent(
               PeriodDialog,
               { headerType: PeriodDialog.HEADER_TYPES.input }
            );
            assert.strictEqual(component._headerType, PeriodDialog.HEADER_TYPES.input);
         });

         describe('mask', function() {
            [{
               options: {},
               mask: 'DD.MM.YY'
            }, {
               options: { mask: 'DD.MM.YY hh:mm' },
               mask: 'DD.MM.YY hh:mm'
            }, {
               options: { minRange: 'month' },
               mask: 'MM.YYYY'
            }].forEach(function (test) {
               it(`should set mask to ${test.mask} if options are equals ${JSON.stringify(test.options)}.`, function () {
                  const component = calendarTestUtils.createComponent(PeriodDialog, test.options);
                  assert.strictEqual(component._mask, test.mask);
               });
            });
         });
      });

      describe('_homeButtonClick', function() {
         it('should update _displayedDate.', function() {
            const
               oldDate = new Date(2017, 0, 1),
               component = calendarTestUtils.createComponent(PeriodDialog, { startValue: oldDate, endValue: oldDate });
            assert(dateUtils.isDatesEqual(component._displayedDate, oldDate));
            component._homeButtonClick();
            assert(dateUtils.isMonthsEqual(component._displayedDate, new Date()));
         });
      });

      describe('_headerLinkClick', function() {
         it('should toggle header type.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            assert.strictEqual(component._headerType, PeriodDialog.HEADER_TYPES.link);
            component._headerLinkClick();
            assert.strictEqual(component._headerType, PeriodDialog.HEADER_TYPES.input);
         });
      });

      describe('_onHeaderLinkRangeChanged', function() {
         it('should update range.', function() {
            const component = calendarTestUtils.createComponent(
               PeriodDialog, { startValue: new Date(2019, 0, 1), endValue: new Date(2019, 1, 0) });
            component._onHeaderLinkRangeChanged(null, null, null);
            assert.isNull(component._rangeModel.startValue);
            assert.isNull(component._rangeModel.endValue);
         });
      });

      describe('_startValuePickerChanged', function() {
         it('should update start value.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {}),
               date = new Date();
            component._startValuePickerChanged(null, date);
            assert.strictEqual(component._rangeModel.startValue, date);
            assert.strictEqual(component._headerRangeModel.startValue, date);
         });
      });

      describe('_endValuePickerChanged', function() {
         [{
            options: {},
            date: new Date(2019, 6, 10),
            endValue: new Date(2019, 6, 10)
         }, {
            options: { mask: 'MM.YYYY' },
            date: new Date(2019, 6, 10),
            endValue: new Date(2019, 7, 0)
         }].forEach(function(test) {
            it(`should update end value to ${formatDate(test.endValue)} if ${formatDate(test.date)} is passed and options is equal ${JSON.stringify(test.options)}.`, function() {
               const component = calendarTestUtils.createComponent(PeriodDialog, test.options);
               component._endValuePickerChanged(null, test.date);
               assert(dateUtils.isDatesEqual(component._rangeModel.endValue, test.endValue));
               assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, test.endValue));
            });
         });
      });

      describe('_toggleStateClick', function() {
         it('should toggle state and set correct displayed date.', function() {
            const component = calendarTestUtils.createComponent(
               PeriodDialog, { startValue: new Date(2019, 3, 10), endValue: new Date(2019, 5, 0) });
            assert.strictEqual(component._state, component._STATES.year);
            component._toggleStateClick();
            assert.strictEqual(component._state, component._STATES.month);
            assert(dateUtils.isDatesEqual(component._displayedDate, new Date(2019, 3, 10)));
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
         it('should update range models and displayed day.', function() {
            const component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._yearsSelectionChanged(null, start, end);
            assert(dateUtils.isDatesEqual(component._headerRangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._headerRangeModel.endValue, dateUtils.getEndOfYear(end)));
            assert(dateUtils.isDatesEqual(component._rangeModel.startValue, start));
            assert(dateUtils.isDatesEqual(component._rangeModel.endValue, dateUtils.getEndOfYear(end)));
         });
      });

      describe('_onYearsSelectionHoveredValueChanged', function() {
         it('should update range models and displayed day.', function() {
            const
               date = new Date(2018, 0, 1),
               component = calendarTestUtils.createComponent(PeriodDialog, {});
            component._onYearsSelectionHoveredValueChanged(null, date);
            assert(dateUtils.isDatesEqual(component._displayedDate, date));
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
         it('should toggle state and update _displayedDate.', function() {
            const
               component = calendarTestUtils.createComponent(PeriodDialog, {}),
               newDate = dateUtils.getStartOfMonth(new Date());
            assert.strictEqual(component._state, component._STATES.year);
            component._monthRangeMonthClick(null, newDate);
            assert.strictEqual(component._state, component._STATES.month);
            assert(dateUtils.isDatesEqual(component._displayedDate, newDate));
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

      describe('_dateRangeSelectionEnded', function() {
         it('should generate "sendResult" event.', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodDialog, {}),
               start = new Date(),
               end = new Date();

            sandbox.stub(component, '_notify');

            component._dateRangeSelectionEnded(null, start, end);
            sinon.assert.calledWith(component._notify, 'sendResult', [start, end]);
            sandbox.restore();
         });
      });

      describe('_applyClick', function() {
         it('should generate "sendResult" event if validation successful.', function() {
            const sandbox = sinon.sandbox.create(),
               start = new Date(),
               end = new Date(),
               component = calendarTestUtils.createComponent(PeriodDialog, { startValue: start, endValue: end });

            sandbox.stub(component, '_notify');
            component._children = {
               formController: {
                  submit: function() {
                     return (new Deferred()).callback({ '0': null, '1': null });
                  }
               }
            };
            component._applyClick(null);
            sinon.assert.calledWith(component._notify, 'sendResult', [start, end]);
            sandbox.restore();
         });
         it('should generate "sendResult" event if validation failed.', function() {
            const sandbox = sinon.sandbox.create(),
               start = new Date(),
               end = new Date(),
               component = calendarTestUtils.createComponent(PeriodDialog, { startValue: start, endValue: end });

            sandbox.stub(component, '_notify');
            component._children = {
               formController: {
                  submit: function() {
                     return (new Deferred()).callback({ '0': ['error'], '1': null });
                  }
               }
            };
            component._applyClick(null);
            sinon.assert.notCalled(component._notify);
            sandbox.restore();
         });
      });
   });
});
