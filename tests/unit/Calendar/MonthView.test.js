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
            let onItemClick = sinon.spy(),
               item = 'item',
               mv = calendarTestUtils.createComponent(MonthView, config);

            mv.subscribe('itemClick', onItemClick);
            mv._dayClickHandler({}, item);

            // TODO: почему то в тестах вне браузера события не генерируются.. Разобраться с этим
            if (typeof $ !== 'undefined') {
               assert(onItemClick.calledOnce, `onItemClick called ${onItemClick.callCount}`);
               assert.strictEqual(item, onItemClick.args[0][1][0], `wrong parameter ${onItemClick.args[0][1]}`);
            }
         });
      });

      describe('_mouseEnterHandler', function() {
         it('should generate "itemMouseEnter" event', function() {
            let onItemMouseEnter = sinon.spy(),
               item = 'item',
               mv = calendarTestUtils.createComponent(MonthView, config);

            mv.subscribe('itemMouseEnter', onItemMouseEnter);
            mv._mouseEnterHandler({}, item);

            // TODO: почему то в тестах вне браузера события не генерируются.. Разобраться с этим
            if (typeof $ !== 'undefined') {
               assert(onItemMouseEnter.calledOnce, `itemMouseEnter called ${onItemMouseEnter.callCount}`);
               assert.strictEqual(item, onItemMouseEnter.args[0][1][0], `wrong parameter ${onItemMouseEnter.args[0][1]}`);
            }
         });
      });
   });
});
