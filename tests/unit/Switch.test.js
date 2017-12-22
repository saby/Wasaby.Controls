define(['js!Controls/Toggle/Switch'], function (Switch) {
   'use strict';
   var SW, switcherClickedFlag;
   describe('SBIS3.CONTROLS.Switch', function () {
      describe('update captions (function _beforeUpdate)',function () {
         beforeEach(function(){
            SW = new Switch({
               captions: ['capt1']
            });
         });

         afterEach(function () {
            SW.destroy();
            SW = undefined;
         });

         it('without captions', function () {
            var temp = {
               captions: []
            };
            SW._beforeUpdate(temp);
            assert(true);
         });

         it('with one captions', function () {
            var temp = {
               captions: ['capt1']
            };
            SW._beforeUpdate(temp);
            assert(true);
         });

         it('with two captions', function () {
            var temp = {
               captions: ['capt1','capt2']
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
               assert(e.message === 'You cannot set more than 2 captions.');
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
            SW = new Switch({
               captions: []
            });
            assert(true);
         });

         it('with one caption', function () {
            SW = new Switch({
               captions: ['capt1']
            });
            assert(true);
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
               assert(e.message === 'You cannot set more than 2 captions.');
            }
         });
      });

      describe('check caption quantity (IsDouble function)', function () {
         beforeEach(function () {
            SW = new Switch({
               captions: []
            });
         });

         afterEach(function(){
            SW.destroy();
            SW = undefined;
         });

         it('constructor without captions', function () {
            var opt = {
               captions: []
            };
            SW.saveOptions(opt);
            assert(SW._isDouble() === false);
         });

         it('constructor with one caption', function () {
            var opt = {
               captions: ['capt1']
            };
            SW.saveOptions(opt);
            assert(SW._isDouble() === false);
         });

         it('constructor with two captions', function () {
            var opt = {
               captions: ['capt1', 'capt2']
            };
            SW.saveOptions(opt);
            assert(SW._isDouble() === true);
         });
      });

      describe('click to Switcher', function () {
         beforeEach(function() {
            SW = new Switch({
               captions: []
            });
            switcherClickedFlag = false;
            SW.subscribe('changeValue', function () {
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
            it ('click to single Switcher caption', function(){
               var opt = {
                  captions: []
               };
               SW.saveOptions(opt);
               SW._clickToggleHandler();
               assert(switcherClickedFlag);
            });

            it ('click to double Switcher <<On>> caption and <<On>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: true
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, "textOn");
               assert(switcherClickedFlag === false);
            });

            it ('click to double Switcher <<On>> caption and <<Off>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: false
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, "textOn");
               assert(switcherClickedFlag);
            });

            it ('click to double Switcher <<Off>> caption and <<On>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: true
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, "textOff");
               assert(switcherClickedFlag);
            });

            it ('click to double Switcher <<Off>> caption and <<Off>> value', function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: false
               };
               SW.saveOptions(opt);
               SW._clickTextHandler(null, "textOff");
               assert(switcherClickedFlag === false);
            });
         });
      });
      describe('private function', function(){
         beforeEach(function() {
            SW = new Switch({
               captions: []
            });
            switcherClickedFlag = false;
            SW.subscribe('changeValue', function () {
               switcherClickedFlag = true;
            });
         });

         afterEach(function () {
            SW.destroy();
            SW = undefined;
            switcherClickedFlag = undefined;
         });

         describe('doubleSwitcherClickHandler', function(){
            it('textOn click and Switch was Off',function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: false
               };
               SW.saveOptions(opt);
               Switch._private.doubleSwitcherClickHandler(SW, "textOn");
               assert(switcherClickedFlag);
            });

            it('textOn click and Switch was On',function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: true
               };
               SW.saveOptions(opt);
               Switch._private.doubleSwitcherClickHandler(SW, "textOn");
               assert(switcherClickedFlag===false);
            });

            it('textOff click and Switch was On',function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: true
               };
               SW.saveOptions(opt);
               Switch._private.doubleSwitcherClickHandler(SW, "textOff");
               assert(switcherClickedFlag);
            });
            it('textOff click and Switch was Off',function(){
               var opt = {
                  captions: ['capt1', 'capt2'],
                  value: false
               };
               SW.saveOptions(opt);
               Switch._private.doubleSwitcherClickHandler(SW, "textOff");
               assert(switcherClickedFlag===false);
            });
         });

         describe('singleSwitcherClickHandler', function(){
            it('click', function(){
               Switch._private.singleSwitcherClickHandler(SW);
               assert(switcherClickedFlag);
            });
         });

         describe('notifyChangeValue', function() {
            it('click', function () {
               var opt = {
                  captions: [],
                  value: false
               };
               SW.saveOptions(opt);
               Switch._private.notifyChangeValue(SW);
               assert(switcherClickedFlag);
            });
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
                  assert(e.message === 'You cannot set more than 2 captions.');
               }
            });

            it('checked without captions', function () {
               var opt = {
                  captions: []
               };
               SW.saveOptions(opt);
               Switch._private.checkCaptions(SW._options);
               assert(true);
            });

            it('checked with 1 captions', function () {
               var opt = {
                  captions: ['capt1']
               };
               SW.saveOptions(opt);
               Switch._private.checkCaptions(SW._options);
               assert(true);
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