define(
   [
      'Env/Env',
      'Controls/input',
      'unit/Calendar/Utils'
   ],
   function(Env, input, testUtils) {

      'use strict';

      describe('Controls.Input.Mask', function() {
         it('findLastUserEnteredCharPosition', function() {
            var findLastUserEnteredCharPosition = input.Mask._private.findLastUserEnteredCharPosition;

            assert.equal(findLastUserEnteredCharPosition('12.34.56', ' '), 8);
            assert.equal(findLastUserEnteredCharPosition('12.34.  ', ' '), 6);
            assert.equal(findLastUserEnteredCharPosition('12.34.56', ''), 8);
            assert.equal(findLastUserEnteredCharPosition('12.34.', ''), 6);
         });

         it('validateReplacer', function() {
            var message = '';
            var error = Env.IoC.resolve('ILogger').error;
            var validateReplacer = input.Mask._private.validateReplacer;

            Env.IoC.resolve('ILogger').error = function(arg1, arg2) {
               message = arg1 + ': ' + arg2;
            };

            assert.equal(validateReplacer('', 'dd.dd'), true);
            assert.equal(message, '');
            assert.equal(validateReplacer(' ', 'dd.dd'), true);
            assert.equal(message, '');
            assert.equal(validateReplacer('', 'd\\*'), true);
            assert.equal(message, '');
            assert.equal(validateReplacer(' ', 'd\\*'), false);
            assert.equal(message, 'Mask: Used not empty replacer and mask with quantifiers. More on https://wi.sbis.ru/docs/js/Controls/_input/Mask/options/replacer/');

            Env.IoC.resolve('ILogger').error = error;
         });

         it('calcReplacer', function() {
            var calcReplacer = input.Mask._private.calcReplacer;

            assert.equal(calcReplacer(' ', 'dd.dd'), ' ');
            assert.equal(calcReplacer(' ', 'd\\*'), '');
         });

      });
   }
);
