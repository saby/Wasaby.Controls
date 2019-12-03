define(
   [
      'Types/entity',
      'Controls/input'
   ],
   function(entity, input) {
      describe('Controls/input:InputCallback.hoursFormat', function() {
         var hoursFormat = input.InputCallback.hoursFormat;

         it('Within normal limits', function() {
            assert.deepEqual(hoursFormat({
               position: 1,
               displayValue: '10:00',
               value: new entity.TimeInterval({hours: 10})
            }), {
               position: 1,
               displayValue: '10:00'
            });
         });
         it('More normal', function() {
            assert.deepEqual(hoursFormat({
               position: 1,
               displayValue: '30:00',
               value: new entity.TimeInterval({hours: 30})
            }), {
               position: 1,
               displayValue: '24:00'
            });
            assert.deepEqual(hoursFormat({
               position: 2,
               displayValue: '25:59',
               value: new entity.TimeInterval({hours: 25, minutes: 59})
            }), {
               position: 2,
               displayValue: '24:00'
            });
         });
      });
   }
);
