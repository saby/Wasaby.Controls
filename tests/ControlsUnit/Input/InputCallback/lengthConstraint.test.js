define(
   [
      'Controls/input'
   ],
   function(input) {
      describe('Controls/input:InputCallback.lengthConstraint', function() {
         var lengthConstraint = input.InputCallback.lengthConstraint;

         describe('The maximum length is 4 and use grouping.', function() {
            var callback = lengthConstraint(4, true);

            it('value: -123.45, position: 4', function() {
               assert.deepEqual(callback({
                  position: 4,
                  displayValue: '-123.45'
               }), {
                  position: 4,
                  displayValue: '-123.45'
               });
            });
            it('12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '12345'
               }), {
                  position: 0,
                  displayValue: '1 234'
               });
            });
            it('-12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '-12345'
               }), {
                  position: 0,
                  displayValue: '-123'
               });
            });
            it('12345.12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '12345.12345'
               }), {
                  position: 0,
                  displayValue: '1 234.12345'
               });
            });
            it('-12345.12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '-12345.12345'
               }), {
                  position: 0,
                  displayValue: '-123.12345'
               });
            });
            it('0.0', function() {
               assert.deepEqual(callback({
                  position: 2,
                  displayValue: '0.0'
               }), {
                  position: 2,
                  displayValue: '0.0'
               });
            });
         });
         describe('The maximum length is 4 and not use grouping.', function() {
            var callback = lengthConstraint(4, false);

            it('12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '12345'
               }), {
                  position: 0,
                  displayValue: '1234'
               });
            });
            it('-12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '-12345'
               }), {
                  position: 0,
                  displayValue: '-123'
               });
            });
            it('12345.12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '12345.12345'
               }), {
                  position: 0,
                  displayValue: '1234.12345'
               });
            });
            it('-12345.12345', function() {
               assert.deepEqual(callback({
                  position: 0,
                  displayValue: '-12345.12345'
               }), {
                  position: 0,
                  displayValue: '-123.12345'
               });
            });
            it('0.0', function() {
               assert.deepEqual(callback({
                  position: 2,
                  displayValue: '0.0'
               }), {
                  position: 2,
                  displayValue: '0.0'
               });
            });
         });
      });
   }
);
