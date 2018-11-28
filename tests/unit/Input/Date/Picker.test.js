define([
   'Core/core-merge',
   'Controls/Input/Date/Picker',
   'tests/Calendar/Utils'
], function(
   cMerge,
   DatePicker,
   calendarTestUtils
) {
   'use strict';

   const options = {
      mask: 'DD.MM.YYYY',
      value: new Date(2018, 0, 1),
      replacer: ' ',
   };

   describe('Controls/Input/Date/Picker', function() {

      describe('_openDialog', function() {
         it('should open opener', function() {
            const component = calendarTestUtils.createComponent(DatePicker, options);
            component._children.opener = {
               open: sinon.fake()
            };
            component._openDialog();
            sinon.assert.called(component._children.opener.open);
         });
      });

      describe('_onResult', function() {
         it('should generate valueChangedEvent and close opener', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(DatePicker, options),
               value = new Date(2017, 11, 1);

            component._children.opener = {
               close: sinon.fake()
            };
            sandbox.stub(component, '_notify');

            component._onResult(null, value);

            sinon.assert.calledWith(component._notify, 'valueChanged');
            sinon.assert.called(component._children.opener.close);
            sandbox.restore();
         });
      });

      describe('_onResultWS3', function() {
         it('should generate valueChangedEvent and close opener', function() {
            const
               sandbox = sinon.sandbox.create(),
               component = calendarTestUtils.createComponent(DatePicker, options),
               value = new Date(2017, 11, 1);

            component._children.opener = {
               close: sinon.fake()
            };
            sandbox.stub(component, '_notify');

            component._onResultWS3(null, value);

            sinon.assert.calledWith(component._notify, 'valueChanged');
            sinon.assert.called(component._children.opener.close);
            sandbox.restore();
         });
      });

   });
});
