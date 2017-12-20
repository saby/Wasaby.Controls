define(['js!Controls/Toggle/Switch'], function (Switch) {
   'use strict';
   describe('SBIS3.CONTROLS.Switch', function () {

      describe('constructors', function () {
         it('constructor without captions', function () {
            var SW = new Switch({
               captions: []
            });
            assert(SW._isDouble() === false);
         });

         it('constructor with one caption', function () {
            var SW = new Switch({
               captions: ['capt1']
            });
            assert(SW._isDouble() === false);
         });

         it('constructor with two captions', function () {
            var SW = new Switch({
               captions: ['capt1', 'capt2']
            });
            assert(SW._isDouble() === true);
         });
      });
      describe('change captions', function () {
         var SW = new Switch({
            captions: ['capt1', 'capt2']
         });

         it('switcher had 2 captions, after _beforeUpdate it has 1 caption', function () {
            SW._beforeUpdate({captions: ['capt1']});
            assert(SW._isDouble() === false);
         });

         it('switcher had 1 caption, after _beforeUpdate it has 2 captions', function () {
            SW._beforeUpdate({captions: ['capt1', 'capt2']});
            assert(SW._isDouble() === true);
         });

         it('switcher had 2 captions, after _beforeUpdate it has 0 caption', function () {
            SW._beforeUpdate({captions: []});
            assert(SW._isDouble() === false);
         });
      });
      describe('click on toggle', function () {
         var SW = new Switch({
            captions: []
         });

         it('init value', function () {
            assert(SW._options.value === false);
         });

         it('first state after click toggle', function () {
            SW._clickToggleHandler();
            assert(SW._options.value === true);
         });

         it('second state after click toggle', function () {
            SW._clickToggleHandler();
            assert(SW._options.value === false);
         });
      });
      describe('click on singleSwitcher caption', function () {
         var SW = new Switch({
            captions: ['capt1']
         });

         it('init value', function () {
            assert(SW._options.value === false);
         });

         it('first state after click caption', function () {
            SW._clickTextHandler();
            assert(SW._options.value === true);
         });

         it('second state after click caption', function () {
            SW._clickTextHandler();
            assert(SW._options.value === false);
         });
      });
      describe('click on doubleSwitcher caption', function () {
         var SW = new Switch({
            captions: ['capt1','capt2']
         });

         it('init value', function () {
            assert(SW._options.value === false);
         });

         it('first state after click <<On>> caption and switcher is off', function () {
            SW._clickTextHandler(null, 'testOn');
            assert(SW._options.value === true);
         });

         it('first state after click <<On>> caption and switcher is on', function () {
            SW._clickTextHandler(null, 'testOn');
            assert(SW._options.value === true);
         });

         it('first state after click <<Off>> caption and switcher is on', function () {
            SW._clickTextHandler(null, 'testOff');
            assert(SW._options.value === false);
         });

         it('first state after click <<On>> caption and switcher is off', function () {
            SW._clickTextHandler(null, 'testOff');
            assert(SW._options.value === false);
         });
      });
   });
});