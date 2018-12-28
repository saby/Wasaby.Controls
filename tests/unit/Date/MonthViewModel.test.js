define([
   'Core/core-merge',
   'Controls/Date/MonthView/MonthViewModel',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tests/Calendar/Utils'
], function(
   coreMerge,
   MonthViewModel,
   DateUtil,
   calendarTestUtils
) {
   'use strict';

   let config = {
      month: new Date(2017, 0, 1)
   };

   describe('Controls/Date/MonthView/MonthViewModel', function() {
      describe('Initialisation', function() {

         it('should create the correct model for the month when creating', function() {
            let mvm, weeks;

            mvm = new MonthViewModel(config);
            weeks = mvm.getMonthArray();

            assert.equal(weeks.length, 6);
            calendarTestUtils.assertMonthView(weeks);
            assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
         });

      });
      describe('_getDayObject', function() {
         let state = {
            mode: 'mode',
            month: new Date(2018, 0, 1),
            enabled: true
         };

         it('should create the object with correct extData', function() {
            let extData = 'some data',
               mvm, dayObj;

            mvm = new MonthViewModel(config);
            dayObj = mvm._getDayObject(
               new Date(2018, 0, 1),
               coreMerge({ daysData: [extData] }, state, { preferSource: true })
            );

            assert.equal(dayObj.extData, extData);
         });

      });
      describe('_isStateChanged', function() {
         it('should return true if new state the same', function() {
            let mvm = new MonthViewModel(config);
            assert.isFalse(mvm._isStateChanged(config));
         });

         it('should return false if new state contain changed daysData', function() {
            let mvm = new MonthViewModel(config);
            assert.isTrue(mvm._isStateChanged(
               coreMerge({ daysData: [2] }, config, { preferSource: true })
            ));
         });

      });
   });
});
