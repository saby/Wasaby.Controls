define(['js!Controls/Toggle/DoubleSwitch'], function (Switch) {
   'use strict';
   var SW, switcherClickedFlag;
   describe('SBIS3.CONTROLS.DoubleSwitch', function () {
      describe('update captions (function _beforeUpdate)',function () {
         beforeEach(function(){
            SW = new Switch({
               captions: ['capt1', 'capt2']
            });
         });

         afterEach(function () {
            SW.destroy();
            SW = undefined;
         });

         it('with one captions', function () {
            var temp = {
               captions: ['newcapt1']
            };
            try {
               SW._beforeUpdate(temp);
               assert(false);
            }
            catch(e) {
               assert(e.message === 'You must set 2 captions.');
            }
         });

         it('with two captions', function () {
            var temp = {
               captions: ['newcapt1','newcapt2']
            };
            SW._beforeUpdate(temp);
            assert(true);
         });

         it('with three captions', function () {
            var temp = {
               captions: ['capt1','capt2','capt3']
            };
            try {
               SW._beforeUpdate(temp);
               assert(false);
            }
            catch(e) {
               assert(e.message === 'You must set 2 captions.');
            }
         });
      });

      describe('checked captions in constructor', function () {

         afterEach(function () {
            if (SW) {
               SW.destroy();
               SW = undefined;
            }
         });

         it('without captions', function () {
            try {
               SW = new Switch({
                  captions: []
               });
            }
            catch(e) {
               assert(e.message === 'You must set 2 captions.');
            }
         });

         it('with one caption', function () {
            try {
               SW = new Switch({
                  captions: ['capt1']
               });
            }
            catch(e) {
               assert(e.message === 'You must set 2 captions.');
            }
         });

         it('with two captions', function () {
            SW = new Switch({
               captions: ['capt1', 'capt2']
            });
            assert(true);
         });

         it('with three captions', function () {
            try {
               SW = new Switch({
                  captions: ['capt1', 'capt2','capt3']
               });
            }
            catch(e) {
               assert(e.message === 'You must set 2 captions.');
            }
         });
      });

      describe('click to Switcher', function () {
         beforeEach(function() {
            SW = new Switch({
               captions: ['capt1','capt2']
            });
            switcherClickedFlag = false;
            SW.subscribe('valueChanged', function () {
               switcherClickedFlag = true;
            });
         });

         afterEach(function () {
            SW.destroy();
            SW = undefined;
            switcherClickedFlag = undefined;
         });

         describe('click to toggle(function _clickToggleHandler)', function(){
            it('click', function () {
               SW._clickToggleHandler();
               assert(switcherClickedFlag);
            });
         });

         describe('click to captions(function _clickTextHandler)', function(){
            it ('click to double Switcher <<On>> caption and <<On>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: true
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, true);
               assert(switcherClickedFlag === false);
            });

            it ('click to double Switcher <<On>> caption and <<Off>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: false
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, true);
               assert(switcherClickedFlag);
            });

            it ('click to double Switcher <<Off>> caption and <<On>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: true
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, false);
               assert(switcherClickedFlag);
            });

            it ('click to double Switcher <<Off>> caption and <<Off>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: false
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, false);
               assert(switcherClickedFlag === false);
            });
         });
      });
      describe('private function', function(){
         beforeEach(function() {
            SW = new Switch({
               captions: ['capt1', 'capt2']
            });
            switcherClickedFlag = false;
            SW.subscribe('valueChanged', function () {
               switcherClickedFlag = true;
            });
         });

         afterEach(function () {
            SW.destroy();
            SW = undefined;
            switcherClickedFlag = undefined;
         });

         describe('checkCaptions', function(){
            it('checked with 3 captions', function () {
               var opt = {
                  captions: ['capt1', 'capt2', 'capt3']
               };
               SW.saveOptions(opt);
               try {
                  Switch._private.checkCaptions(SW._options);
                  assert(false);
               }
               catch(e) {
                  assert(e.message === 'You must set 2 captions.');
               }
            });

            it('checked with 3 captions', function () {
               var opt = {
                  captions: []
               };
               SW.saveOptions(opt);
               try {
                  Switch._private.checkCaptions(SW._options);
                  assert(false);
               }
               catch(e) {
                  assert(e.message === 'You must set 2 captions.');
               }
            });

            it('checked with 3 captions', function () {
               var opt = {
                  captions: ['capt1']
               };
               SW.saveOptions(opt);
               try {
                  Switch._private.checkCaptions(SW._options);
                  assert(false);
               }
               catch(e) {
                  assert(e.message === 'You must set 2 captions.');
               }
            });

            it('checked with 2 captions', function () {
               var opt = {
                  captions: ['capt1', 'capt2']
               };
               SW.saveOptions(opt);
               Switch._private.checkCaptions(SW._options);
               assert(true);
            });
         });
      });
   });
});