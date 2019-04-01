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
   _round(val, prec) {
      return parseFloat(val.toFixed(prec));
   },
   _calcValue(pos) {
      const box = this._children.area.getBoundingClientRect();
      const rangeLength = this._options.maxValue - this._options.minValue;
      const ratio = (pos - box.left - window.pageXOffset) / box.width;
      const val = Math.max(Math.min(ratio, 1), 0) * rangeLength;
      return this._options.minValue + val;
   },
   _checkBuildOptions(opts) {
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
   _prepareScale(opts) {
      this._scaleArr = [];
      if (opts.scaleStep) {
         const scaleRange = opts.maxValue - opts.minValue;
         this._scaleArr.push({value: opts.minValue, position: 0});
         for (let i = opts.minValue + opts.scaleStep; i <= opts.maxValue - opts.scaleStep / 2; i += opts.scaleStep) {
            this._scaleArr.push({
               value: i,
               position: (i - opts.minValue) / scaleRange * 100
            });
         }
         this._scaleArr.push({
            value: opts.maxValue,
            position: 100
         });
      }
   },
   _getPoint() {
      if (this._value === this._endValue) {
         return this._children.pointEnd;
      } else if (this._value === this._startValue) {
         return this._children.pointStart;
      } else if (this._value > this._endValue) {
         return this._children.pointEnd;
      } else if (this._value < this._startValue) {
         return this._children.pointStart;
      } else if (this._value > (this._endValue + this._startValue) / 2) {
         return this._children.pointEnd;
      } else {
         return this._children.pointStart;
      }
   },
   _setStartValue(val) {
      this._startValue = val;
      this._notify('startValueChanged', [val]);
   },
   _setEndValue(val) {
      this._endValue = val;
      this._notify('endValueChanged', [val]);
   },
   _render(options) {
      const rangeLength = options.maxValue - options.minValue;
      const left =  Math.min(Math.max((this._startValue - options.minValue), 0), rangeLength) / rangeLength * 100;
      const right =  Math.min(Math.max((this._endValue - options.minValue), 0), rangeLength) / rangeLength * 100;
      const width = right - left;
      this._pointEndPos = right;
      this._pointStartPos = left;
      this._linePos = left;
      this._lineWidth = width ;

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
      _private._prepareScale.call(this, options);
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
         _private._prepareScale.call(this, options);
         _private._checkBuildOptions(options);
      }
      this._endValue =  Math.min(options.maxValue, options.endValue) || options.maxValue;
      this._startValue =  Math.max(options.minValue, options.startValue) || options.minValue;
      _private._render.call(this, options);
   },
   /**
    * Handler for the mousedown event.
    */
   _onMouseDownHandler(event) {
      if (!this._options.readOnly) {
         const nativeEvent = event.nativeEvent;
         this._startElemPosition = event.nativeEvent.clientX;
         this._value = _private._calcValue.call(this, nativeEvent.pageX);
         this._value = _private._round(this._value, this._options.precision);
         const target = _private._getPoint.call(this);
         if (target === this._children.pointStart) {
            _private._setStartValue.call(this, this._value);
         }
         if (target === this._children.pointEnd) {
            _private._setEndValue.call(this, this._value);
         }
         this._children.dragNDrop.startDragNDrop(target, event);
      }
   },
   /**
    * Handler for the dragmove event.
    */
   _onDragMoveHandler(e, dragObject) {
      if (!this._options.readOnly) {
         this._value = _private._calcValue.call(this, dragObject.position.x);
         this._value = _private._round(this._value, this._options.precision);
         if (dragObject.entity === this._children.pointStart) {
            _private._setStartValue.call(this, this._value);
         }
         if (dragObject.entity === this._children.pointEnd) {
            _private._setEndValue.call(this, this._value);
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
