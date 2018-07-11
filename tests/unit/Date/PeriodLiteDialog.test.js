define([
   'Controls/Date/PeriodLiteDialog',
   'tests/unit/Calendar/Utils',
   'tmpl!Controls/Date/PeriodLiteDialog/Item',
   'tmpl!Controls/Date/PeriodLiteDialog/ItemMonths',
   'tmpl!Controls/Date/PeriodLiteDialog/ItemQuarters'
], function(
   PeriodLiteDialog,
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

               assert.strictEqual(component._itemTmpl, test.tmpl);
            });
         });

         it('should create correct month model', function() {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog, {});

            assert.deepEqual(component._months, [{
               name: 'I',
               quarters: [{
                  name: 'I',
                  months: [{
                     number: 0, name: 'Январь'
                  }, {
                     number: 1, name: 'Февраль'
                  }, {
                     number: 2, name: 'Март'
                  }],
                  number: 0
               }, {
                  name: 'II',
                  months: [{
                     number: 3, name: 'Апрель'
                  }, {
                     number: 4, name: 'Май'
                  }, {
                     number: 5, name: 'Июнь'
                  }],
                  number: 1
               }]
            }, {
               name: 'II',
               quarters: [{
                  name: 'III',
                  months: [{
                     number: 6, name: 'Июль'
                  }, {
                     number: 7, 'name': 'Август'
                  }, {
                     number: 8, name: 'Сентябрь'
                  }],
                  number: 2
               }, {
                  name: 'IV',
                  months: [{
                     number: 9, name: 'Октябрь'
                  }, {
                     number: 10, name: 'Ноябрь'
                  }, {
                     number: 11, name: 'Декабрь'
                  }],
                  number: 3
               }]
            }]);
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
            component._onMonthClick(null, 0);

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
