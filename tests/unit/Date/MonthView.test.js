define([
   'Core/core-merge',
   'Controls/Date/MonthView',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tests/unit/Calendar/Utils'
], function(
   coreMerge,
   MonthView,
   DateUtil,
   calendarTestUtils
) {
   'use strict';

   let config = {
      month: new Date(2017, 0, 1),
      showCaption: true
   };

   describe('Controls/Date/MonthView', function() {
      describe('Initialisation', function() {

         it('should create the correct model for the month when creating', function() {
            let mv, weeks;

            mv = calendarTestUtils.createComponent(MonthView, config);

            assert.strictEqual(mv._caption, "Январь'17", 'wrong _caption field');

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

      describe('_updateView', function() {
         it('should update month and month caption when month changed', function() {
            const mv = calendarTestUtils.createComponent(MonthView, config),
               month = new Date(2018, 4, 1);
            MonthView._private._updateView(mv, Object.assign({}, config, {month: month}));
            assert.equal(mv._month.getTime(), month.getTime(), 'wrong _month');
            assert.strictEqual(mv._caption, "Май'18", 'wrong _caption');
         });

         it('should not update month if month did not changed', function() {
            const mv = calendarTestUtils.createComponent(MonthView, config);
            MonthView._private._updateView(mv, Object.assign({}, config, {month: new Date(config.month)}));
            assert.strictEqual(mv._month.getTime(), config.month.getTime(), 'wrong _month');
         });
      });

   });
});
