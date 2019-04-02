
import Control = require('Core/Control');
import Env = require('Env/Env');
import template = require('wml!Controls/_slider/Base/Base');
import DragNDrop = require('Controls/DragNDrop/Controller');
/**
 * Basic slider with single movable point for choosing value.
 *
 * @public
 * @extends Core/Control
 * @class Controls/_slider/Base
 * @author Колесов В.А.
 */
var _private = {
   _round: function (val, perc) {
      return parseFloat(val.toFixed(perc));
   },
   _getRatio: function(pos, left, width) {
       return (pos - left) / width;
   },
   _calcValue: function (minValue, maxValue, ratio) {
      const rangeLength = maxValue - minValue;
      const val = Math.max(Math.min(ratio, 1), 0) * rangeLength;
      return minValue + val;
   },
   _checkOptions: function(opts) {
      if (opts.minValue === undefined || opts.maxValue === undefined) {
         Env.IoC.resolve('ILogger').error('Slider', 'You must set minValue and maxValue for slider.');
      }
      if (opts.minValue >= opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'minValue must be less than maxValue.');
      }
      if (opts.value < opts.minValue || opts.value > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'value must be in the range [minValue..maxValue].');
      }
      if (opts.scaleStep < 0) {
         Env.IoC.resolve('ILogger').error('Slider', 'scaleStep must positive.');
      }
   },
   _prepareScale: function(self, minValue, maxValue, scaleStep) {
      self._scaleArr = [];
      if (scaleStep) {
         const scaleRange =maxValue - minValue;
         self._scaleArr.push({value: minValue, position: 0});
         for (let i = minValue + scaleStep; i <= maxValue - scaleStep / 2; i += scaleStep) {
            self._scaleArr.push({value: i, position: (i - minValue) / scaleRange * 100});
         }
         self._scaleArr.push({value: maxValue, position: 100});
      }
   },
   _setValue: function(self, val) {
      self._notify('valueChanged', [val], true);
   },
   _render: function(self, minValue, maxValue, value) {
      const rangeLength = maxValue - minValue;
      const right =  Math.min(Math.max((value - minValue), 0), rangeLength) / rangeLength * 100;
      self._pointPos = right;
      self._lineWidth = right;
   }
};


var Base = Control.extend({
   _template: template,
   _value: undefined,
   _pointPos: undefined,
   _lineWidth: undefined,
   _scaleArr: undefined,
   _beforeMount: function(options) {
      _private._checkOptions(options);
      _private._prepareScale(this, options.minValue, options.maxValue, options.scaleStep);
      this._value = options.value || options.maxValue;
      this._lineWidth = 100;
      this._pointPos = 100;
   },
   _beforeUpdate: function(options) {
      if (options.scaleStep !== this._options.scaleStep ||
            options.minValue !== this._options.minValue ||
            options.maxValue !== this._options.maxValue ||
            options.value !== this._options.value) {
         _private._prepareScale(this, options.minValue, options.maxValue, options.scaleStep);
         _private._checkOptions(options);
      }
      _private._render(this, options.minValue, options.maxValue, options.value);
   },
   /**
    * Handler for the mousedown event.
    */
   _onMouseDownHandler: function(event) {
      if (!this._options.readOnly) {
         const nativeEvent = event.nativeEvent;
         this._startElemPosition = event.nativeEvent.clientX;
         const box = this._children.area.getBoundingClientRect();
         const ratio = _private._getRatio(nativeEvent.pageX, box.left + window.pageXOffset, box.width);
         this._value = _private._calcValue(this._options.minValue, this._options.maxValue, ratio);
         this._value = _private._round(this._value, this._options.precision);
         _private._setValue(this, this._value);
         this._children.dragNDrop.startDragNDrop(this._children.point, event);
      }
   },
   /**
    * Handler for the dragmove event.
    */
   _onDragMoveHandler: function(e, dragObject) {
      if (!this._options.readOnly) {
         const box = this._children.area.getBoundingClientRect();
         const ratio = _private._getRatio(dragObject.position.x, box.left + window.pageXOffset, box.width);
         this._value = _private._calcValue(this._options.minValue, this._options.maxValue, ratio);
         this._value = _private._round(this._value,this._options.precision);
         _private._setValue(this, this._value);
      }
   },
   /**
    * Handler for the dragend event.
    */
   _onDragEndHandler: function() {
      if (!this._options.readOnly) {
         this._startElemPosition = undefined;
      }
   }
});

Base.getDefaultOptions = function() {
   return {
      theme: "default",
      /**
       * @cfg {Boolean} sets the size of slider point
       */
      size: 'm',
      /**
       * @cfg {Boolean} sets the stroke around control
       */
      borderVisible: false,
      /**
       * @cfg {Number} sets the minimum value of slider
       */
      minValue: undefined,
      /**
       * @cfg {Number} sets the maximum value of slider
       */
      maxValue: undefined,
      /**
       * @cfg {Number} The scaleStep option determines the step in the scale grid under the slider
       */
      scaleStep: undefined,
      /**
       * @cfg {Number} sets the current value of slider
       */
      value: undefined,
      /**
       * @cfg {Number} Number of characters in decimal part.
       */
      precision: 0
   };
};
Base._theme = ['Controls/_slider/slider'];

Base._private = _private;
export default Base;
