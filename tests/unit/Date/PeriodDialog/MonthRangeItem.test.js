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
      let sandbox;

      beforeEach(function() {
         sandbox = sinon.sandbox.create();
      });

      afterEach(function() {
         sandbox.restore();
         sandbox = null;
      });

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


      [{
         method: '_onMonthTitleMouseLeave',
         tests: [{
            options: { selectionProcessing: true, monthClickable: true },
            event: null
         }, {
            options: { selectionProcessing: true, monthClickable: false },
            event: null
         }, {
            options: { selectionProcessing: false, monthClickable: true },
            event: 'itemMouseLeave'
         }, {
            options: { selectionProcessing: false, monthClickable: false },
            event: null
         }]
      }, {
         method: '_onMonthBodyClick',
         tests: [{
            options: { selectionProcessing: true, monthClickable: true },
            event: null
         }, {
            options: { selectionProcessing: true, monthClickable: false },
            event: null
         }, {
            options: { selectionProcessing: false, monthClickable: true },
            event: 'monthClick'
         }, {
            options: { selectionProcessing: false, monthClickable: false },
            event: 'itemClick'
         }]
      }, {
         method: '_onMonthClick',
         tests: [{
            options: { selectionProcessing: true, monthClickable: true },
            event: 'itemClick'
         }, {
            options: { selectionProcessing: true, monthClickable: false },
            event: 'itemClick'
         }, {
            options: { selectionProcessing: false, monthClickable: true },
            event: null
         }, {
            options: { selectionProcessing: false, monthClickable: false },
            event: 'itemClick'
         }]
      }, {
         method: '_onMonthMouseEnter',
         tests: [{
            options: { selectionProcessing: true, monthClickable: true },
            event: 'itemMouseEnter'
         }, {
            options: { selectionProcessing: true, monthClickable: false },
            event: 'itemMouseEnter'
         }, {
            options: { selectionProcessing: false, monthClickable: true },
            event: null
         }, {
            options: { selectionProcessing: false, monthClickable: false },
            event: 'itemMouseEnter'
         }]
      }, {
         method: '_onMonthMouseLeave',
         tests: [{
            options: { selectionProcessing: true, monthClickable: true },
            event: 'itemMouseLeave'
         }, {
            options: { selectionProcessing: true, monthClickable: false },
            event: 'itemMouseLeave'
         }, {
            options: { selectionProcessing: false, monthClickable: true },
            event: null
         }, {
            options: { selectionProcessing: false, monthClickable: false },
            event: 'itemMouseLeave'
         }]
      }].forEach(function(testGroup) {
         describe(testGroup.method, function() {
            testGroup.tests.forEach(function(test) {
               it(`should generate ${test.event} for options ${JSON.stringify(test.options)}.`, function () {
                  const component = calendarTestUtils.createComponent(
                     MonthsRangeItem, coreMerge({ date: start }, test.options, { preferSource: true }));

                  sandbox.stub(component, '_notify');
                  component[testGroup.method](null, start);

                  if (test.event) {
                     sinon.assert.calledWith(
                        component._notify, test.event, [start]);
                  } else {
                     sinon.assert.notCalled(component._notify);
                  }
               });
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
