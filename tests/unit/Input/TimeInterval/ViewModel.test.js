define([
   'Controls/Input/TimeInterval/ViewModel',
   'Core/TimeInterval'
], function(
   ViewModel,
   constTimeInterval
) {
   'use strict';

   let _options = {
      mask: 'HH:mm:ss',
      replacer: ' '
   };
   let formatMaskChars = {
      'D': '[0-9]',
      'H': '[0-9]',
      'm': '[0-9]',
      's': '[0-9]',
      'U': '[0-9]'
   };

   describe('Controls/Input/TimeInterval/ViewModel', function() {

      describe('._convertToValue', function() {
         it('should return correct TimeInterval object from String', function() {
            let model = new ViewModel(_options);
            const value = new constTimeInterval({days: 1, hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToValue('44:10:20')._normIntervalStr, value._normIntervalStr);
         });
         it('should return same TimeInterval object from TimeInterval object', function() {
            let model = new ViewModel(_options);
            const value = new constTimeInterval({days: 1, hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToValue(value)._normIntervalStr, value._normIntervalStr);
         });
      });

      describe('._convertToDisplayValue', function() {
         it('should return correct displayValue from TimeInterval object', function() {
            let model = new ViewModel(_options);
            const value = new constTimeInterval({days: 1, hours: 20, minutes: 10, seconds: 20});
            assert.strictEqual(model._convertToDisplayValue(value), '44:10:20');
         });
      });

      describe('._autoComplete', function() {
         it('should auto complete display value in correct way', function() {
            let model = new ViewModel(_options),
               sandbox = sinon.createSandbox();
            model.value = model._convertToValue('1 :  :  ');
            model._autoComplete();
            assert.strictEqual(model.displayValue, '01:00:00');
            sandbox.restore();
         });
      });

      describe('private.prepareData', function() {
         it('should return correct split value from object cursor position and value', function() {
            let obj = { position: 6, value: '11:14:  ' };
            let res = ViewModel._private.prepareData(obj);
            let resObj = {
               after: '  ',
               before: '11:14:',
               delete: '',
               insert: ''
            };
            assert.deepEqual(res, resObj);
         });
      });

      describe('private.displayValueParser', function() {
         it('should return array of symbols from value', function() {
            let model = new ViewModel(_options);
            let resArr = [1, 1, 1, 4, 1, 1];
            let arr = ViewModel._private.displayValueParser(model, '11:14:11');
            assert.deepEqual(arr, resArr);
         });
      });

      describe('private.timeIntervalToValueConverter', function() {
         it('should return correct clear string value from TimeInterval object ', function() {
            let model = new ViewModel(_options);
            let ti = new constTimeInterval('P0DT10H10M10S');
            let currentStr = ViewModel._private.timeIntervalToValueConverter(model, ti);
            assert.deepEqual(currentStr, '101010');
         });
      });

      describe('private.valueToTimeIntervalConverter', function() {
         it('should return correct TimeInterval object from string value', function() {
            let model = new ViewModel(_options);
            let ti = new constTimeInterval('P0DT10H10M10S');
            let currentTi = ViewModel._private.valueToTimeIntervalConverter(model, '10:10:10');
            assert.deepEqual(ti, currentTi);
         });
      });
   });
});
