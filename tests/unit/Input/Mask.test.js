define(
   [
      'Controls/Input/Mask'
   ],
   function(Mask) {

      'use strict';

      describe('Controls.Input.Mask', function() {
         var defaultOptions = Mask.getDefaultOptions();

         it('calcPositionAtFocus', function() {
            assert.equal(Mask._private.findLastUserEnteredCharPosition('12.34.56', ' '), 8);
            assert.equal(Mask._private.findLastUserEnteredCharPosition('12.34.  ', ' '), 6);
            assert.equal(Mask._private.findLastUserEnteredCharPosition('12.34.56', ''), 8);
            assert.equal(Mask._private.findLastUserEnteredCharPosition('12.34.', ''), 6);
         });

         it('calcReplacer', function() {
            assert.equal(Mask._private.calcReplacer('', 'dd.dd'), '');
            assert.equal(Mask._private.calcReplacer(' ', 'dd.dd'), ' ');
            assert.equal(Mask._private.calcReplacer('', 'd\\*'), '');
            assert.equal(Mask._private.calcReplacer(' ', 'd\\*'), '');
         });
      });
   }
);
