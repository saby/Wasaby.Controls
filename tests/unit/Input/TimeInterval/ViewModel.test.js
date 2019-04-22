define([
   'Controls/_input/TimeInterval/ViewModel',
   'Core/TimeInterval'
], function(
   ViewModel,
   constTimeInterval
) {
   'use strict';

   const  _options = {
      mask: 'HH:MM:SS',
      replacer: ' '
   };

   ViewModel = ViewModel.ViewModel;

   describe('Controls/_input/TimeInterval/ViewModel', function() {

      describe('._convertToValue', function() {
         it('should return correct TimeInterval object from String', function() {
            let model = new ViewModel(_options);
            let value = new constTimeInterval({days: 1, hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToValue('44:10:20')._normIntervalStr, value._normIntervalStr);

            value = new constTimeInterval({hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToValue('20:10:20')._normIntervalStr, value._normIntervalStr);

            value = new constTimeInterval({seconds: 20});
            assert.strictEqual(model._convertToValue('00:00:20')._normIntervalStr, value._normIntervalStr);
         });
      });

      describe('._convertToDisplayValue', function() {
         it('should return correct displayValue from TimeInterval object', function() {
            let model = new ViewModel(_options);
            let value = new constTimeInterval({days: 1, hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToDisplayValue(value), '44:10:20');

            value = new constTimeInterval({hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToDisplayValue(value), '20:10:20');

            value = new constTimeInterval({seconds: 20});
            assert.strictEqual(model._convertToDisplayValue(value), '00:00:20');
         });
      });

      describe('.autoComplete', function() {
         it('should auto complete display value in correct way', function() {
            let model = new ViewModel(_options),
               sandbox = sinon.createSandbox();
            model.value = model._convertToValue('1 :  :  ');
            model.autoComplete();
            assert.strictEqual(model.displayValue, '01:00:00');
            sandbox.restore();
         });
      });
   });
});
