/* global Array, Object, Date, define, beforeEach, afterEach, describe, context, it, assert */
define([
   'Core/core-clone',
   'Controls/dateRange',
   'unit/Calendar/Utils'
], function(
   cClone,
   dateRange,
   calendarTestUtils
) {
   'use strict';

   const RelationWrapper = dateRange.RelationWrapper;

   describe('Controls.dateRange:RelationWrapper', function () {
      it('should generate an event on date changed', function () {
         let
            component = calendarTestUtils.createComponent(RelationWrapper, { number: 0 }),
            sandbox = sinon.sandbox.create(),
            startDate = new Date(),
            endDate = new Date();

         sandbox.stub(component, '_notify');
         component._onRangeChanged(null, startDate, endDate);

         sinon.assert.calledWith(
            component._notify, 'relationWrapperRangeChanged', [startDate, endDate, 0, undefined], { bubbling: true });

         sandbox.restore();
      });
   });
}
)