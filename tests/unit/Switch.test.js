define(['js!Controls/Toggle/Switch'], function (Switch) {
   'use strict';
   describe('SBIS3.CONTROLS.Switch', function () {

      describe('constructors', function () {
         it('constructor without captions', function () {
            var SW = new Switch({
               captions: []
            });
            assert(SW._isDoubleSwitcher === false);
         });

         it('constructor with one caption', function () {
            var SW = new Switch({
               captions: ['capt1']
            });
            assert(SW._isDoubleSwitcher === false);
         });

         it('constructor with two captions', function () {
            var SW = new Switch({
               captions: ['capt1', 'capt2']
            });
            assert(SW._isDoubleSwitcher === true);
         });
      });
      describe('change captions', function () {
         var SW = new Switch({
            captions: ['capt1', 'capt2']
         });

         it('switcher had 2 captions, after _beforeUpdate it has 1 caption', function () {
            SW._beforeUpdate({captions: ['capt1']});
            assert(SW._isDoubleSwitcher === false);
         });

         it('switcher had 1 caption, after _beforeUpdate it has 2 captions', function () {
            SW._beforeUpdate({captions: ['capt1', 'capt2']});
            assert(SW._isDoubleSwitcher === true);
         });

         it('switcher had 2 captions, after _beforeUpdate it has 0 caption', function () {
            SW._beforeUpdate({captions: []});
            assert(SW._isDoubleSwitcher === false);
         });
      });
   });
});