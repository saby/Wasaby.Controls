define([
   'js!SBIS3.CONTROLS.Slider',
   'js!SBIS3.CONTROLS.SliderInput'
], function (
   Slider,
   SliderInput
) {
   'use strict';

   describe('SBIS3.CONTROLS.Slider', function () {
      var cfg, slider;

      describe('methods', function(){

         before(function () {
            if(typeof window !== 'undefined') {
               cfg = {
                  minValue: "0",
                  maxValue: "5",
                  decimals: 2
               };
               slider = new Slider(cfg);
            }
         });

         beforeEach(function () {
            if(typeof window === 'undefined') {
               this.skip();
            }
         });

         it('setStartValue', function () {
            assert.equal(null, slider.getStartValue());
            slider.setStartValue(2);
            assert.equal(2, slider.getStartValue());
         });
         it('setEndValue', function () {
            assert.equal(null, slider.getEndValue());
            slider.setEndValue(4);
            assert.equal(4, slider.getEndValue());
         });
         it('setMinValue', function () {
            assert.equal(0, slider.getMinValue());
            slider.setMinValue(1);
            assert.equal(1, slider.getMinValue());
         });
         it('setMaxValue', function () {
            assert.equal(5, slider.getMaxValue());
            slider.setMaxValue(6);
            assert.equal(6, slider.getMaxValue());
         });
         it('setMinMaxValue', function () {
            assert.equal(6, slider.getMaxValue());
            assert.equal(1, slider.getMinValue());
            slider.setMinMaxValue(0, 5);
            assert.equal(5, slider.getMaxValue());
            assert.equal(0, slider.getMinValue());
         });
         it('_prepareValue', function () {
            assert.equal(0, slider._prepareValue(0,'start'));
            assert.equal(4, slider._prepareValue(10,'start')); // выше методе ставили endValue 4
            assert.equal(5, slider._prepareValue(10,'end'));
            assert.equal(2, slider._prepareValue(0,'end')); // выше методе ставили startValue 2
         });
         it('_calcSide', function () {
            assert.equal('end', slider._calcSide(3));
            assert.equal('end', slider._calcSide(5));
            assert.equal('end', slider._calcSide(4));
            assert.equal('start', slider._calcSide(1));
            assert.equal('start', slider._calcSide(2));
            assert.equal('start', slider._calcSide(0));
         });
         it('_lineClick', function () {
            slider._calcValue = function(){ // перебиваем функцию чтобы не было привязки в dom
               return 0;
            };
            slider._lineClick({});
            assert.equal(0, slider.getStartValue());

            slider._calcValue = function(){ // перебиваем функцию чтобы не было привязки в dom
               return 5;
            };
            slider._lineClick({});
            assert.equal(5, slider.getEndValue());
         });
      });

   });
   describe('SBIS3.CONTROLS.SliderInput', function () {
      var cfg, slider;

      describe('methods', function(){

         before(function () {
            SliderInput = SliderInput.extend({
               _initInputs: function(){
                  this._startTextBox = this._endTextBox = {
                     setText: function(){}
                  };
               },
            });

            if(typeof window !== 'undefined') {
               cfg = {
                  minValue: "0",
                  maxValue: "5",
                  decimals: 2,
                  single: true
               };
               slider = new SliderInput(cfg);
            }
         });

         beforeEach(function () {
            if (typeof window === 'undefined') {
               this.skip();
            }
         });


         it('_setPreparedValue', function () {
            slider._setPreparedValue(undefined);
            assert.equal(0, slider.getEndValue());
         });
      });

   });


});
