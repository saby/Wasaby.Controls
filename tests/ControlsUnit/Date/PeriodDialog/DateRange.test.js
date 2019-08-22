define([
   'Core/core-merge',
   'Controls/_datePopup/DateRange',
   'Controls/_datePopup/Utils',
   'Controls/Utils/Date',
   'ControlsUnit/Calendar/Utils'
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
      beforeEach(function() {
         sandbox = sinon.sandbox.create();
      });

      afterEach(function() {
         sandbox.restore();
         sandbox = null;
      });

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
         });

      });

      describe('_monthCaptionClick', function() {
         it('should notify event.', function() {
            const component = calendarTestUtils.createComponent(DateRange, { month: year, selectionType: 'range' });
            sandbox.stub(component, '_notify');
            component._monthCaptionClick(null, new Date(2019, 0), 3);
            sinon.assert.calledWith(
               component._notify, 'fixedPeriodClick', [new Date(2019, 3, 1), new Date(2019, 3, 30)]);
         });
         it('should not notify event if month selection disabled.', function() {
            const component = calendarTestUtils.createComponent(
               DateRange, { month: year, selectionType: 'quantum', quantum: { days: [1] } });
            sandbox.stub(component, '_notify');
            component._monthCaptionClick(null, new Date(2019, 0), 3);
            sinon.assert.notCalled(component._notify);
         });
      });

      describe('_wheelHandler', function() {
         const
            scrollNextDate = new Date(year.getFullYear(), 10, 1),
            scrollPrevDate = new Date(year.getFullYear(), 0, 1);

         [{
            caption: 'should increase the year.',
            offset: { top: 10, bottom: 1000 },
            offsetHeight: 400,
            deltaY: 1,
            resultDate: scrollNextDate
         }, {
            caption: 'should\'t change scroll position.',
            offset: { top: 10, bottom: 300 },
            offsetHeight: 400,
            deltaY: 1,
            resultDate: null
         }, {
            caption: 'should\'t change scroll position.',
            offset: { top: -10, bottom: 1000 },
            offsetHeight: 400,
            deltaY: 1,
            resultDate: null
         }, {
            caption: 'should decrease the year.',
            offset: { top: 10, bottom: 1000 },
            offsetHeight: 400,
            deltaY: -1,
            resultDate: scrollPrevDate
         }, {
            caption: 'should\'t change scroll position.',
            offset: { top: -10, bottom: 1000 },
            offsetHeight: 400,
            deltaY: -1,
            resultDate: null
         }, {
            caption: 'should\'t change scroll position.',
            offset: { top: 10, bottom: -1000 },
            offsetHeight: 400,
            deltaY: -1,
            resultDate: null
         }].forEach(function(test) {
            it(test.caption, function() {
               const component = calendarTestUtils.createComponent(DateRange, { position: year });
               component._children.monthList = {
                  getDisplayedItemOffset: function() {
                     return test.offset;
                  },
                  scrollIntoView: sinon.fake()
               };
               component._container.offsetHeight = test.offsetHeight;
               component._wheelHandler({ preventDefault: function(){}, nativeEvent: { deltaY: test.deltaY } });
               if (test.resultDate) {
                  sinon.assert.calledWith(component._children.monthList.scrollIntoView, test.resultDate);
               } else {
                  sinon.assert.notCalled(component._children.monthList.scrollIntoView);
               }
            });
         });
      });

      describe('_formatMonth', function() {
         [
            { month: 0, text: 'Январь' },
            { month: 1, text: 'Февраль' },
            { month: 2, text: 'Март' },
            { month: 3, text: 'Апрель' },
            { month: 4, text: 'Май' },
            { month: 5, text: 'Июнь' },
            { month: 6, text: 'Июль' },
            { month: 7, text: 'Август' },
            { month: 8, text: 'Сентябрь' },
            { month: 9, text: 'Октябрь' },
            { month: 10, text: 'Ноябрь' },
            { month: 11, text: 'Декабрь' }

         ].forEach(function(test) {
            it(`should return ${test.text} if ${test.month} is passed.`, function() {
               const component = calendarTestUtils.createComponent(DateRange, { year: year });
               assert.equal(component._formatMonth(test.month), test.text);
            });
         });
      });
   });
});
