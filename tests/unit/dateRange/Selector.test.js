define([
   'Core/core-merge',
   'Controls/Input/Date/RangeLink',
   'Controls/Date/model/DateRange',
   'unit/Calendar/Utils'
], function(
   cMerge,
   RangeLink,
   DateRange,
   calendarTestUtils
) {
   'use strict';

   const options = {
      rangeModel: new DateRange(),
      mask: 'DD.MM.YYYY',
      value: new Date(2018, 0, 1),
      replacer: ' ',
   };

   describe('Controls/dateRange/Selector', function() {

      describe('_rangeChangedHandler', function() {
         it('should set range on model', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(RangeLink, options),
               startValue = new Date(2018, 11, 10),
               endValue = new Date(2018, 11, 13);

            sandbox.stub(component, '_notify');

            component._rangeChangedHandler(null, startValue, endValue);

            sinon.assert.calledWith(component._notify, 'startValueChanged');
            sinon.assert.calledWith(component._notify, 'endValueChanged');
            sinon.assert.calledWith(component._notify, 'rangeChanged');
            sinon.assert.callCount(component._notify, 3);
            sandbox.restore();
         });
      });
   });
});
