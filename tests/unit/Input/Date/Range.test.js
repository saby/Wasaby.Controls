define([
   'Core/core-merge',
   'Controls/dateRange',
   'unit/Calendar/Utils'
], function(
   cMerge,
   dateRange,
   calendarTestUtils
) {
   'use strict';

   const options = {
      mask: 'DD.MM.YYYY',
      value: new Date(2018, 0, 1),
      replacer: ' ',
   };

   describe('Controls/Input/Date/Range', function() {

      describe('_openDialog', function() {
         it('should open opener', function() {
            const component = calendarTestUtils.createComponent(dateRange.Input, options);
            component._children.opener = {
               open: sinon.fake()
            };
            component._openDialog();
            sinon.assert.called(component._children.opener.open);
         });
      });

      describe('_onResult', function() {
         it('should generate events and close opener', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(dateRange.Input, options),
               startValue = new Date(2017, 11, 1),
               endValue = new Date(2017, 11, 2);

            component._children = {}
            component._children.opener = {
               close: sinon.fake()
            };
            component._children.startValueField = {
               activate: sinon.fake()
            };
            sandbox.stub(component, '_notify');

            component._onResultWS3(startValue, endValue);

            sinon.assert.calledWith(component._notify, 'startValueChanged');
            sinon.assert.calledWith(component._notify, 'endValueChanged');
            sinon.assert.calledWith(component._notify, 'inputCompleted');
            sinon.assert.called(component._children.opener.close);
            sinon.assert.called(component._children.startValueField.activate);
            sandbox.restore();
         });
      });

      describe('_onResultWS3', function() {
         it('should generate events and close opener', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(dateRange.Input, options),
               startValue = new Date(2017, 11, 1),
               endValue = new Date(2017, 11, 2);

            component._children = {}
            component._children.opener = {
               close: sinon.fake()
            };
            component._children.startValueField = {
               activate: sinon.fake()
            };
            sandbox.stub(component, '_notify');

            component._onResultWS3(null, startValue, endValue);

            sinon.assert.calledWith(component._notify, 'startValueChanged');
            sinon.assert.calledWith(component._notify, 'endValueChanged');
            sinon.assert.calledWith(component._notify, 'inputCompleted');
            sinon.assert.called(component._children.opener.close);
            sinon.assert.called(component._children.startValueField.activate);
            sandbox.restore();
         });
      });

      describe('_keyUpHandler', function() {
         [{
            key: '0',
            checkHandle: true
         }, {
            key: '9',
            checkHandle: true
         }, {
            key: 'x',
            checkHandle: false
         }].forEach(function(test) {
            it('should generate events and close opener', function() {
               const
                  sandbox = sinon.sandbox.create(),
                  component = calendarTestUtils.createComponent(dateRange.Input, options);

               sandbox.stub(component, '_focusChanger');

               component._keyUpHandler({ nativeEvent: { key: test.key } });

               if (test.checkHandle) {
                  sinon.assert.called(component._focusChanger);
               } else {
                  sinon.assert.notCalled(component._focusChanger);
               }
               sandbox.restore();
            });
         });
      });

   });
});
