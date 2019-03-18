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
         _readOnly: false,
         _scaleAlign: false,
         _showScale: false,
         _event: 'none',
         _beforeMount: function(opts){
            
            this._minValue = 1;
            this._maxValue = 10;
            this._scaleStep = 5;
            this._decimals = 2;
         },
         reset: function(){
            this._event = 'none';
         },
         changeMinValue: function(e, val){
            this._minValue = val;
            this._event = 'changeMinValue';
         },
         changeMaxValue: function(e, val){
            this._maxValue = val;
            this._event = 'changeMaxValue';
         },
         changeDecimals: function(e, val){
            this._decimals = val;
            this._event = 'changeDecimals';
         },
         changeScaleStep: function(e, val){
            this._scaleStep = val;
            this._event = 'changeScaleStep';
         },
         changeSingle: function(e, val){
            this._single = val;
            this._event = 'changeSingle';
         },
         changeBigPoint: function(e, val){
            this._bigPoint = val;
            this._event = 'changeBigPoint';
         },
         changeInput: function(e, val){
            this._input = val;
            this._event = 'changeInput';
         },
         changeBordered: function(e, val){
            this._bordered = val;
            this._event = 'changeBordered';
         },
         changeStartLabel: function(e, val){
            this._startLabel = val;
            this._event = 'changeStartLabel';
         },
         changeCenterLabel: function(e, val){
            this._centerLabel = val;
            this._event = 'changeCenterLabel';
         },
         changeEndLabel: function(e, val){
            this._endLabel = val;
            this._event = 'changeEndLabel';
         },
         changeReadOnly: function(e, val){
            this._readOnly = val;
            this._event = 'changeReadOnly';
         },
         changeScaleAlign: function(e, val){
            this._scaleAlign = val;
            this._event = 'changeScaleAlign';
         },

         changeShowScale: function(e, val){
            this._showScale = val;
            this._event = 'changeShowScale';
         },
      });

      return SliderDemo;
   }
);
