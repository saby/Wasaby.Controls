define('Controls-demo/Slider/SliderDemo',
   [
      'Core/Control',
      'Types/source',
      'wml!Controls-demo/Slider/SliderDemo',
      'css!Controls-demo/Slider/SliderDemo',
      'Controls/Slider'
   ],
   function(Control, source, template) {
      'use strict';
      var SliderDemo = Control.extend({
         _template: template,
         _orientationSource: null,
         _minValue: 1,
         _maxValue: 10,
         _scaleStep: 5,
         _single: false,
         _bigPoint: false,
         _input: false,
         _bordered: false,
         _startLabel: 'from',
         _centerLabel: 'to',
         _endLabel: '$',

         _beforeMount: function(opts){
            
            this._minValue = 1;
            this._maxValue = 10;
            this._scaleStep = 5;
            this._decimals = 2;
         },
         changeMinValue: function(e, val){
            this._minValue = val;
         },
         changeMaxValue: function(e, val){
            this._maxValue = val;
         },
         changeDecimals: function(e, val){
            this._decimals = val;
         },
         changeScaleStep: function(e, val){
            this._scaleStep = val;
         },
         changeSingle: function(e, val){
            this._single = val;
         },
         changeBigPoint: function(e, val){
            this._bigPoint = val;
         },
         changeInput: function(e, val){
            this._input = val;
         },
         changeBordered: function(e, val){
            this._bordered = val;
         },
         changeStartLabel: function(e, val){
            this._startLabel = val;
         },
         changeCenterLabel: function(e, val){
            this._centerLabel = val;
         },
         changeEndLabel: function(e, val){
            this._endLabel = val;
         },
         changeOrientation: function(e, val){
            this._orientation = val;
         },
      });

      return SliderDemo;
   }
);
