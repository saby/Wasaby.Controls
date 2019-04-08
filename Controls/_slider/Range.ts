import Control = require('Core/Control');
import Env = require('Env/Env');
import entity = require('Types/entity');
import template = require('wml!Controls/_slider/sliderTemplate');
import utils from 'Controls/_slider/Utils';
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
   _checkOptions(opts) {
      utils.checkOptions(opts);
      if (opts.startValue < opts.minValue || opts.startValue > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'startValue must be in the range [minValue..maxValue].');
      }
      if (opts.endValue < opts.minValue || opts.endValue > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'endValue must be in the range [minValue..maxValue].');
      }
   },
   // returns name of the closest to value point
   _getClosestPoint(value, startValue, endValue) {
      const startPointDistance = Math.abs(value - startValue);
      const endPointDistance = Math.abs(value - endValue);
      if (startPointDistance === endPointDistance) {
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
      self._pointData[1].position = right;
      self._pointData[0].position = left;
      self._lineData.position = left;
      self._lineData.width = width ;
   },
   _needUpdate(oldOpts, newOpts){
      return (oldOpts.scaleStep !== newOpts.scaleStep ||
         oldOpts.minValue !== newOpts.minValue ||
         oldOpts.maxValue !== newOpts.maxValue ||
         oldOpts.startValue !== newOpts.startValue ||
         oldOpts.endValue !== newOpts.endValue);
   }
};

const Range = Control.extend({

   _template: template,
   _value: undefined,
   _lineData: undefined,
   _pointData: undefined,
   _scaleData: undefined,
   _startValue: undefined,
   _endValue: undefined,
   _beforeMount(options) {
      _private._checkOptions(options);
      this._scaleData = utils.getScaleData(options.minValue, options.maxValue, options.scaleStep);
      this._endValue = options.endValue || options.maxValue;
      this._startValue = options.startValue || options.minValue;
      this._value = undefined;
      this._pointData = [{name: 'pointStart', position: 0}, {name: 'pointEnd', position: 100}];
      this._lineData = {position: 0, width: 100};
   },
   _beforeUpdate(options) {
      if (_private._needUpdate(this._options, options)) {
         _private._checkOptions(options);
         this._scaleData = utils.getScaleData( options.minValue, options.maxValue, options.scaleStep);
      }
      this._endValue = options.endValue === undefined ? options.maxValue : Math.min(options.maxValue, options.endValue);
      this._startValue = options.startValue === undefined ? options.minValue : Math.max(options.minValue, options.startValue);
      _private._render(this, this._options.minValue, this._options.maxValue, this._startValue, this._endValue);
   },
   /**
    * Handler for the mousedown event.
    */
   _onMouseDownHandler(event) {
      if (!this._options.readOnly) {
         const box = this._children.area.getBoundingClientRect();
         const ratio = utils.getRatio(event.nativeEvent.pageX, box.left + window.pageXOffset, box.width);
         this._value = utils.calcValue(this._options.minValue, this._options.maxValue, ratio, this._options.precision);
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
         const ratio = utils.getRatio(dragObject.position.x, box.left + window.pageXOffset, box.width);
         this._value = utils.calcValue(this._options.minValue, this._options.maxValue, ratio, this._options.precision);
         if (dragObject.entity === this._children.pointStart) {
            _private._setStartValue(this, Math.min(this._value, this._endValue));
         }
         if (dragObject.entity === this._children.pointEnd) {
            _private._setEndValue(this, Math.max(this._value, this._startValue));
         }
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

Range.getOptionTypes = function() {
   return {
      size: entity.descriptor(String).oneOf([
         's',
         'm'
      ]),
      borderVisible: entity.descriptor(Boolean),
      minValue: entity.descriptor(Number).required,
      maxValue: entity.descriptor(Number).required,
      scaleStep: entity.descriptor(Number),
      startValue: entity.descriptor(Number),
      endValue: entity.descriptor(Number),
      precision: entity.descriptor(Number)
   };
}
Range._theme = ['Controls/_slider/slider'];

Range._private = _private;
export default Range;
