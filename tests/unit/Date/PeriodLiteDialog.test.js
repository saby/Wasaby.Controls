/* global define, describe, it, assert */
define([
   'Core/core-merge',
   'Controls/Date/PeriodLiteDialog',
   'Controls/Utils/Date',
   'tests/unit/Calendar/Utils',
   'wml!Controls/Date/PeriodLiteDialog/ItemFull',
   'wml!Controls/Date/PeriodLiteDialog/ItemMonths',
   'wml!Controls/Date/PeriodLiteDialog/ItemQuarters'
], function(
   coreMerge,
   PeriodLiteDialog,
   DateUtils,
   calendarTestUtils,
   itemTmpl,
   itemTmplMonths,
   itemTmplQuarters
) {
   'use strict';

   describe('Controls/Date/PeriodLiteDialog', function() {
      describe('Initialisation', function() {
         [{
            chooseHalfyears: true, chooseQuarters: true, chooseMonths: true, tmpl: itemTmpl
         }, {
            chooseHalfyears: false, chooseQuarters: false, chooseMonths: true, tmpl: itemTmplMonths
         }, {
            chooseHalfyears: false, chooseQuarters: true, chooseMonths: false, tmpl: itemTmplQuarters
         }, {
            chooseHalfyears: false, chooseQuarters: false, chooseMonths: false, tmpl: null
         }].forEach(function(test) {
            it(`should choose correct item template for options chooseHalfyears: ${test.chooseHalfyears}, ` +
               `chooseQuarters: ${test.chooseQuarters}, chooseMonths: ${test.chooseMonths}`, function() {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog, {
                  chooseHalfyears: test.chooseHalfyears,
                  chooseQuarters: test.chooseQuarters,
                  chooseMonths: test.chooseMonths
               });

               assert.strictEqual(component._itemTmplByType, test.tmpl);
            });
         });

         it('should create correct month model', function() {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog, {}),
               year = (new Date()).getFullYear(),
               data = [{
                  name: 'I',
                  quarters: [{
                     name: 'I',
                     months: [ new Date(year, 0, 1), new Date(year, 1, 1), new Date(year, 2, 1) ],
                     number: 0
                  }, {
                     name: 'II',
                     months: [ new Date(year, 3, 1), new Date(year, 4, 1), new Date(year, 5, 1) ],
                     number: 1
                  }]
               }, {
                  name: 'II',
                  quarters: [{
                     name: 'III',
                     months: [ new Date(year, 6, 1), new Date(year, 7, 1), new Date(year, 8, 1) ],
                     number: 2
                  }, {
                     name: 'IV',
                     months: [ new Date(year, 9, 1), new Date(year, 10, 1), new Date(year, 11, 1) ],
                     number: 3
                  }]
               }];

            // Compare all but months.
            assert.deepEqual(
               coreMerge({}, component._months, { ignoreRegExp: /^months$/, clone: true }),
               coreMerge({}, data, { ignoreRegExp: /^months$/, clone: true })
            );

            // And now let's check the month.
            for (let [halhyearIndex, halhyear] of data.entries()) {
               for (let [quarterIndex, quarter] of halhyear.quarters.entries()) {
                  for (let [monthIndex, month] of quarter.months.entries()) {
                     assert(
                        DateUtils.isDatesEqual(
                           component._months[halhyearIndex].quarters[quarterIndex].months[monthIndex], month
                        )
                     );
                  }
               }
            }
         });
      });

      describe('_onYearClick', function() {
         it('should generate sendResult event', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodLiteDialog, {});
            sandbox.stub(component, '_notify');
            component._onYearClick(null, 2000);

            sinon.assert.calledWith(
               component._notify, 'sendResult', [new Date(2000, 0, 1), new Date(2000, 11, 31)], { bubbling: true });
            sandbox.restore();
         });
      });

      describe('_onHalfYearClick', function() {
         it('should generate sendResult event', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodLiteDialog, {year: new Date(2000, 0, 1)});
            sandbox.stub(component, '_notify');
            component._onHalfYearClick(null, 0);

            sinon.assert.calledWith(
               component._notify, 'sendResult', [new Date(2000, 0, 1), new Date(2000, 5, 30)], { bubbling: true });
            sandbox.restore();
         });
      });

      describe('_onQuarterClick', function() {
         it('should generate sendResult event', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodLiteDialog, {year: new Date(2000, 0, 1)});
            sandbox.stub(component, '_notify');
            component._onQuarterClick(null, 0);

            sinon.assert.calledWith(
               component._notify, 'sendResult', [new Date(2000, 0, 1), new Date(2000, 2, 31)], { bubbling: true });
            sandbox.restore();
         });
      });

      describe('_onMonthClick', function() {
         it('should generate sendResult event', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodLiteDialog, {year: new Date(2000, 0, 1)});
            sandbox.stub(component, '_notify');
            component._onMonthClick(null, new Date(2000, 0, 1));

            sinon.assert.calledWith(
               component._notify, 'sendResult', [new Date(2000, 0, 1), new Date(2000, 0, 31)], { bubbling: true });
            sandbox.restore();
         });
      });

      describe('_onPrevYearBtnClick', function() {
         it('should update year', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodLiteDialog, {year: new Date(2000, 0, 1)});
            sandbox.stub(component, '_notify');
            component._onPrevYearBtnClick(null, 0);

            assert.equal(component._year, 1999);
            sinon.assert.calledWith(component._notify, 'yearChanged', [1999]);
            sandbox.restore();
         });
      });

      describe('_onNextYearBtnClick', function() {
         it('should update year', function() {
            const sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(PeriodLiteDialog, {year: new Date(2000, 0, 1)});
            sandbox.stub(component, '_notify');
            component._onNextYearBtnClick(null, 0);

            assert.equal(component._year, 2001);
            sinon.assert.calledWith(component._notify, 'yearChanged', [2001]);
            sandbox.restore();
         });
      });

      describe('_getDefaultYear', function() {
         const currentYear = (new Date).getFullYear();
         [
            [currentYear - 6, currentYear - 2],
            [currentYear - 5, currentYear - 1],
            [currentYear - 4, currentYear],
            [currentYear - 3, currentYear],
            [currentYear - 2, currentYear],
            [currentYear - 1, currentYear],
            [currentYear, currentYear],
            [currentYear + 1, currentYear + 1],
            [currentYear + 2, currentYear + 2],
            [currentYear + 3, currentYear + 3]
         ].forEach(function(test) {
            it(`should return ${test[1]} for ${test[0]}} year`, function() {
               assert.equal(
                  PeriodLiteDialog._private._getDefaultYear({ startValue: new Date(test[0], 0, 1), chooseYears: true }),
                  test[1]
               );
            });
         });
      });
   });
});
