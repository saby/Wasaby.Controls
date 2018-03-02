define(
   [
      'Controls/Input/Phone/getMask'
   ],
   function(getMask) {

      'use strcit';

      describe('Controls.Input.Phone.getMask', function() {
         var result;
         describe('getMask', function() {
            it('Invalid value', function() {
               result = getMask('qwerty');
               assert.equal(result, 'dd-dd');
            });
            it('Addaptive phone on length', function() {
               result = getMask('');
               assert.equal(result, 'dd-dd');

               result = getMask('5');
               assert.equal(result, 'dd-dd');

               result = getMask('56');
               assert.equal(result, 'dd-dd');

               result = getMask('568');
               assert.equal(result, 'dd-dd');

               result = getMask('5689');
               assert.equal(result, 'dd-dd');

               result = getMask('56898');
               assert.equal(result, 'd-dd-dd');

               result = getMask('568981');
               assert.equal(result, 'dd-dd-dd');

               result = getMask('5689812');
               assert.equal(result, 'ddd-dd-dd');

               result = getMask('5689812345');
               assert.equal(result, '(ddd)-ddd-dd-dd');

               result = getMask('56898123456');
               assert.equal(result, '+d\\*');
            });
            it('Addaptive phone with +7', function() {
               result = getMask('+7 (910) 856-34-21');
               assert.equal(result, '+d (ddd) ddd-dd-dd');

               result = getMask('+7 91085634210');
               assert.equal(result, '+d ddddddddddd');

               result = getMask('+8 91085634210');
               assert.equal(result, '+d\\*');
            });
            it('Addaptive phone with 8', function() {
               result = getMask('8 (485) 274-32-85');
               assert.equal(result, 'd (ddd) ddd-dd-dd');

               result = getMask('8 48527432856');
               assert.equal(result, 'd ddddddddddd');

               result = getMask('8 485274328567');
               assert.equal(result, '+d\\*');
            });
         });
      });
   }
);