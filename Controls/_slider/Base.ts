
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
   _round: function(val, perc) {
      return parseFloat(val.toFixed(perc));
   },
   _calcValue: function(pos) {
      const box = this._children.area.getBoundingClientRect();
      const rangeLength = this._options.maxValue - this._options.minValue;
      const ratio = (pos - box.left - window.pageXOffset) / box.width;
      const val = Math.max(Math.min(ratio, 1), 0) * rangeLength;
      return this._options.minValue + val;
   },
   _checkBuildOptions: function(opts) {
      if (opts.minValue === undefined || opts.maxValue === undefined) {
         Env.IoC.resolve('ILogger').error('Slider', 'You must set minValue and maxValue for slider.');
      }
      if (opts.value < opts.minValue || opts.value > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'value must be in the range [minValue..maxValue].');
      }
      if (opts.scaleStep < 0) {
         Env.IoC.resolve('ILogger').error('Slider', 'scaleStep must positive.');
      }
   },
   _prepareScale: function(opts) {
      this._scaleArr = [];
      if (opts.scaleStep) {
         const scaleRange = opts.maxValue - opts.minValue;
         this._scaleArr.push({value: opts.minValue, position: 0});
         for (let i = opts.minValue + opts.scaleStep; i <= opts.maxValue - opts.scaleStep / 2; i += opts.scaleStep) {
            this._scaleArr.push({value: i, position: (i - opts.minValue) / scaleRange * 100});
         }
         this._scaleArr.push({value: opts.maxValue, position: 100});
      }
   },
   _setValues: function(val) {
      this._notify('valueChanged', [val], true);
   },
   _render: function(options) {
      const rangeLength = options.maxValue - options.minValue;
      const left = (options.minValue) / rangeLength * 100;
      const right =  Math.min(Math.max((options.value - options.minValue), options.minValue), options.maxValue) / rangeLength * 100;
      const width = right - left;
      this._pointPos = right;
      this._lineWidth = width;
   }
};

var Base = Control.extend({
   _template: template,
   _value: undefined,
   _pointPos: undefined,
   _lineWidth: undefined,
   _scaleArr: undefined,
   _beforeMount: function(options) {
      _private._checkBuildOptions(options);
      _private._prepareScale.call(this, options);
      this._value = options.value || options.maxValue;
      this._lineWidth = 100;
      this._pointPos = 100;
   },
   _beforeUpdate: function(options) {
      _private._checkBuildOptions(options);
      if (options.scaleStep !== this._options.scaleStep ||
            options.minValue !== this._options.minValue ||
            options.maxValue !== this._options.maxValue) {
         _private._prepareScale.call(this, options);
      }
      _private._render.call(this, options);
   },
   /**
    * Handler for the mousedown event.
    */
   _onMouseDownHandler: function(event) {
      if (!this._options.readOnly) {
         const nativeEvent = event.nativeEvent;
         this._startElemPosition = event.nativeEvent.clientX;
         this._value = _private._calcValue.call(this, nativeEvent.pageX);
         this._value = _private._round(this._value, this._options.precision);
         _private._setValues.call(this, this._value);
         this._children.dragNDrop.startDragNDrop(this._children.point, event);
      }
   },
   /**
    * Handler for the dragmove event.
    */
   _onDragMoveHandler: function(e, dragObject) {
      if (!this._options.readOnly) {
         this._value = _private._calcValue.call(this, dragObject.position.x);
         this._value = _private._round(this._value,this._options.precision);
         _private._setValues.call(this, this._value);
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
