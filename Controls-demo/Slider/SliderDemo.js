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
         _minValue: 0,
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
         _myStartValue:0,
         _myEndValue:10,
         _beforeMount: function(opts){
            
            this._minValue = 0;
            this._maxValue = 10;
            this._scaleStep = 5;
            this._decimals = 2;
            this._myStartValue = 0;
            this._myEndValue = 10;

         },
         reset: function(){
            this._event = 'none';
         },
         changeMinValue: function(e, val){
            this._minValue = val;
            this._event = 'minValueChanged';
         },
         changeMaxValue: function(e, val){
            this._maxValue = val;
            this._event = 'maxValueChanged';
         },
         changeStartValue: function(e, val){
            this._myStartValue = Math.max(this._minValue,Math.min(val,this._myEndValue));
            this._event = 'startValueChanged';
         },
         changeEndValue: function(e, val){
            this._myEndValue = Math.min(this._maxValue,Math.max(val,this._myStartValue));
            this._event = 'endValueChanged';
         },
         changeDecimals: function(e, val){
            this._decimals = val;
            this._event = 'decimalsChanged';
         },
         changeScaleStep: function(e, val){
            this._scaleStep = val;
            this._event = 'scaleStepChanged';
         },
         changeSingle: function(e, val){
            this._single = val;
            this._event = 'singleChanged';
         },
         changeBigPoint: function(e, val){
            this._bigPoint = val;
            this._event = 'bigPointChanged';
         },
         changeInput: function(e, val){
            this._input = val;
            this._event = 'inputChanged';
         },
         changeBordered: function(e, val){
            this._bordered = val;
            this._event = 'borderedChanged';
         },
         changeStartLabel: function(e, val){
            this._startLabel = val;
            this._event = 'startLabelChanged';
         },
         changeCenterLabel: function(e, val){
            this._centerLabel = val;
            this._event = 'centerLabelChanged';
         },
         changeEndLabel: function(e, val){
            this._endLabel = val;
            this._event = 'endLabelChanged';
         },
         changeReadOnly: function(e, val){
            this._readOnly = val;
            this._event = 'readOnlyChanged';
         },
         changeScaleAlign: function(e, val){
            this._scaleAlign = val;
            this._event = 'scaleAlignChanged';
         },

         changeShowScale: function(e, val){
            this._showScale = val;
            this._event = 'ShowScaleChanged';
         },
      });

      return SliderDemo;
   }
);
