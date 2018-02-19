define(
   [
      'Controls/Input/resources/PhoneHelper'
   ],
   function(PhoneHelper) {

      'use strcit';

      describe('Controls.Input.PhoneHelper', function() {
         var result;
         describe('getMask', function() {
            it('Invalid value', function() {
               result = PhoneHelper.getMask('qwerty');
               assert.equal(result, 'dd-dd');
            });
            it('Addaptive phone on length', function() {
               result = PhoneHelper.getMask('');
               assert.equal(result, 'dd-dd');

               result = PhoneHelper.getMask('5');
               assert.equal(result, 'dd-dd');

               result = PhoneHelper.getMask('56');
               assert.equal(result, 'dd-dd');

               result = PhoneHelper.getMask('568');
               assert.equal(result, 'dd-dd');

               result = PhoneHelper.getMask('5689');
               assert.equal(result, 'dd-dd');

               result = PhoneHelper.getMask('56898');
               assert.equal(result, 'd-dd-dd');

               result = PhoneHelper.getMask('568981');
               assert.equal(result, 'dd-dd-dd');

               result = PhoneHelper.getMask('5689812');
               assert.equal(result, 'ddd-dd-dd');

               result = PhoneHelper.getMask('5689812345');
               assert.equal(result, '(ddd)-ddd-dd-dd');

               result = PhoneHelper.getMask('56898123456');
               assert.equal(result, 'ddddddddddd');
            });
            it('Addaptive phone with +7', function() {
               result = PhoneHelper.getMask('+7 (910) 856-34-21');
               assert.equal(result, '+7 (ddd) ddd-dd-dd');

               result = PhoneHelper.getMask('+7 91085634210');
               assert.equal(result, '+7 ddddddddddd');
            });
            it('Addaptive phone with 8', function() {
               result = PhoneHelper.getMask('8 (485) 274-32-85');
               assert.equal(result, 'd (ddd) ddd-dd-dd');

               result = PhoneHelper.getMask('8 48527432856');
               assert.equal(result, 'd ddddddddddd');
            });
         });
      });
   }
);