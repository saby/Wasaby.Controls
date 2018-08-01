define([
   'Core/core-merge',
   'Controls/Calendar/MonthView',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   MonthView,
   DateUtil,
   calendarTestUtils
) {
   'use strict';

   let
      config = {
         month: new Date(2017, 0, 1)
      };

   describe('Controls/Calendar/MonthView', function() {
      describe('Initialisation', function() {

         it('should create the correct model for the month when creating', function() {
            let mv, weeks;

            mv = calendarTestUtils.createComponent(MonthView, config);
            weeks = mv._monthViewModel.getMonthArray();

            assert.equal(weeks.length, 6);
            calendarTestUtils.assertMonthView(weeks);
            assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
         });

      });

      describe('_dayClickHandler', function() {
         it('should generate "itemClick" event', function() {
            let sandbox = sinon.sandbox.create(),
               item = 'item',
               mv = calendarTestUtils.createComponent(MonthView, config);

            sandbox.stub(mv, '_notify');
            mv._dayClickHandler({}, item);

            sinon.assert.calledWith(mv._notify, 'itemClick', [item]);
            sandbox.restore();
         });
      });

      describe('_mouseEnterHandler', function() {
         it('should generate "itemMouseEnter" event', function() {
            let sandbox = sinon.sandbox.create(),
               item = 'item',
               mv = calendarTestUtils.createComponent(MonthView, config);

            sandbox.stub(mv, '_notify');
            mv._mouseEnterHandler({}, item);

            sinon.assert.calledWith(mv._notify, 'itemMouseEnter', [item]);
            sandbox.restore();
         });
      });
   });
});
