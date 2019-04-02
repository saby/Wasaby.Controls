import Control = require('Core/Control');
import Env = require('Env/Env');
import template = require('wml!Controls/_slider/Range/Range');
import DragNDrop = require('Controls/DragNDrop/Controller');

/**
 * Slider with two movable points for choosing range.
 *
 * @public
 * @extends Core/Control
 * @class Controls/_slider/Range
 * @author Колесов В.А.
 */

const _private = {
   _round: function(val, prec) {
      return parseFloat(val.toFixed(prec));
   },
   _getRatio: function(pos, left, width) {
      return (pos - left) / width;
   },
   _calcValue: function(minValue, maxValue, ratio) {
      const rangeLength = maxValue - minValue;
      const val = Math.max(Math.min(ratio, 1), 0) * rangeLength;
      return minValue + val;
   },
   _checkBuildOptions: function(opts) {
      if (opts.minValue === undefined || opts.maxValue === undefined) {
         Env.IoC.resolve('ILogger').error('Slider', 'You must set minValue and maxValue for slider.');
      }
      if (opts.minValue >= opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'minValue must be less than maxValue.');
      }
      if (opts.startValue < opts.minValue || opts.startValue > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'startValue must be in the range [minValue..maxValue].');
      }
      if (opts.endValue < opts.minValue || opts.endValue > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'endValue must be in the range [minValue..maxValue].');
      }
      if (opts.scaleStep < 0) {
         Env.IoC.resolve('ILogger').error('Slider', 'scaleStep must positive.');
      }
   },
   _prepareScale: function(self, minValue, maxValue, scaleStep) {
      self._scaleArr = [];
      if (scaleStep) {
         const scaleRange = maxValue - minValue;
         self._scaleArr.push({value: minValue, position: 0});
         for (let i = minValue + scaleStep; i <= maxValue - scaleStep / 2; i += scaleStep) {
            self._scaleArr.push({value: i, position: (i - minValue) / scaleRange * 100});
         }
         self._scaleArr.push({value: maxValue, position: 100});
      }
   },

   // returns name of the closest to value point
   _getClosestPoint(value, startValue, endValue) {
      const startPointDistance = Math.abs(value - startValue);
      const endPointDistance = Math.abs(value - endValue);
      if (startPointDistance === endPointDistance){
         return value < startValue ? 'start' : 'end';
      } else {
         return startPointDistance < endPointDistance ? 'start' : 'end';
      }
   },
   _setStartValue(self, val) {
      self._startValue = val;
      self._notify('startValueChanged', [val]);
   },
   _setEndValue(self, val) {
      self._endValue = val;
      self._notify('endValueChanged', [val]);
   },
   _render(self, minValue, maxValue, startValue, endValue) {
      const rangeLength = maxValue - minValue;
      const left =  Math.min(Math.max((startValue - minValue), 0), rangeLength) / rangeLength * 100;
      const right =  Math.min(Math.max((endValue - minValue), 0), rangeLength) / rangeLength * 100;
      const width = right - left;
      self._pointEndPos = right;
      self._pointStartPos = left;
      self._linePos = left;
      self._lineWidth = width ;

   }
};

const Range = Control.extend({

   _template: template,
   _value: undefined,
   _pointStartPos: undefined,
   _pointEndPos: undefined,
   _lineWidth: undefined,
   _linePos: undefined,
   _scaleArr: undefined,
   _startValue: undefined,
   _endValue: undefined,
   _beforeMount(options) {
      _private._checkBuildOptions(options);
      _private._prepareScale(this, options.minValue, options.maxValue, options.scaleStep);
      this._endValue = options.endValue || options.maxValue;
      this._startValue = options.startValue || options.minValue;
      this._value = undefined;
      this._pointStartPos = 0;
      this._pointEndPos = 100;
      this._lineWidth = 100;
      this._linePos = 0;
   },

   _beforeUpdate(options) {
      if (options.scaleStep !== this._options.scaleStep ||
            options.minValue !== this._options.minValue ||
            options.maxValue !== this._options.maxValue ||
            options.startValue !== this._options.startValue ||
            options.endValue !== this._options.endValue) {
         _private._prepareScale(this, options.minValue, options.maxValue, options.scaleStep);
         _private._checkBuildOptions(options);
      }
      this._endValue =  Math.min(options.maxValue, options.endValue) || options.maxValue;
      this._startValue =  Math.max(options.minValue, options.startValue) || options.minValue;
      _private._render(this, this._options.minValue, this._options.maxValue, this._startValue, this._endValue);
   },
   /**
    * Handler for the mousedown event.
    */
   _onMouseDownHandler(event) {
      if (!this._options.readOnly) {
         const nativeEvent = event.nativeEvent;
         this._startElemPosition = event.nativeEvent.clientX;
         const box = this._children.area.getBoundingClientRect();
         const ratio = _private._getRatio(nativeEvent.pageX, box.left + window.pageXOffset, box.width);
         this._value = _private._calcValue(this._options.minValue, this._options.maxValue, ratio);;
         this._value = _private._round(this._value, this._options.precision);
         const pointName = _private._getClosestPoint(this._value, this._startValue, this._endValue);
         if (pointName === 'start') {
            _private._setStartValue(this, this._value);
         }
         if (pointName === 'end') {
            _private._setEndValue(this, this._value);
         }
         const target = pointName === 'start' ? this._children.pointStart : this._children.pointEnd;
         this._children.dragNDrop.startDragNDrop(target, event);
      }
   },
   /**
    * Handler for the dragmove event.
    */
   _onDragMoveHandler(e, dragObject) {
      if (!this._options.readOnly) {
         const box = this._children.area.getBoundingClientRect();
         const ratio = _private._getRatio(dragObject.position.x, box.left + window.pageXOffset, box.width);
         this._value = _private._calcValue(this._options.minValue, this._options.maxValue, ratio);
         this._value = _private._round(this._value, this._options.precision);
         if (dragObject.entity === this._children.pointStart) {
            _private._setStartValue(this, this._value);
         }
         if (dragObject.entity === this._children.pointEnd) {
            _private._setEndValue(this, this._value);
         }
      }
   },
   /**
    * Handler for the dragend event.
    */
   _onDragEndHandler() {
      if (!this._options.readOnly) {
         this._startElemPosition = undefined;
      }
   }
});

Range.getDefaultOptions = function() {
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
       * @cfg {Number} sets the current start value of slider
       */
      startValue: undefined,
      /**
       * @cfg {Number} sets the current end value of slider
       */
      endValue: undefined,
      /**
       * @cfg {Number} Number of characters in decimal part.
       */
      precision: 0
   };
};

Range._theme = ['Controls/_slider/slider'];

Range._private = _private;
export default Range;
