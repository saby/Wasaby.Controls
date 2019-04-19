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

   describe('Controls/Input/Date/RangeLink', function() {
      describe('_openDialog', function() {
         it('should open opener', function() {
            const component = calendarTestUtils.createComponent(RangeLink, options);
            component._children.opener = {
               open: sinon.fake()
            };
            component._openDialog();
            sinon.assert.called(component._children.opener.open);
         });
      });

      describe('_openDialog with minRange', function() {
         it('should open opener with parametr month', function() {
            const component = calendarTestUtils.createComponent(RangeLink, cMerge({ minRange: 'month' }, options));
            component._children.opener = {
               open: sinon.fake()
            };
            component._openDialog();
            sinon.assert.calledWith(component._children.opener.open, sinon.match({ templateOptions: {minQuantum: 'month'} }));
         });
      });

      describe('_onResult', function() {
         it('should generate valueChangedEvent and close opener', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(RangeLink, options),
               startValue = new Date(2018, 11, 10),
               endValue = new Date(2018, 11, 13);

            component._children.opener = {
               close: sinon.fake()
            };
            sandbox.stub(component, '_notify');

            component._onResult(startValue, endValue);

            sinon.assert.calledWith(component._notify, 'startValueChanged');
            sinon.assert.calledWith(component._notify, 'endValueChanged');
            sinon.assert.called(component._children.opener.close);
            sandbox.restore();
         });
      });

      describe('_onResultWS3', function() {
         it('should generate valueChangedEvent and close opener', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(RangeLink, options),
               startValue = new Date(2018, 11, 10),
               endValue = new Date(2018, 11, 13);

            component._children.opener = {
               close: sinon.fake()
            };
            sandbox.stub(component, '_notify');

            component._onResultWS3(null, startValue, endValue);

            sinon.assert.calledWith(component._notify, 'startValueChanged');
            sinon.assert.calledWith(component._notify, 'endValueChanged');
            sinon.assert.called(component._children.opener.close);
            sandbox.restore();
         });
      });
   });
});
