import Control = require('Core/Control');
import Env = require('Env/Env');
import entity = require('Types/entity');
import template = require('wml!Controls/_slider/sliderTemplate');
import utils from 'Controls/_slider/Utils';
import DragNDrop = require('Controls/DragNDrop/Controller');
import Range from './Range';

/**
 * Basic slider with single movable point for choosing value.
 *
 * @public
 * @extends Core/Control
 * @class Controls/_slider/Base
 * @author Колесов В.А.
 */

var _private = {
   _checkOptions(opts) {
      utils.checkOptions(opts);
      if (opts.value < opts.minValue || opts.value > opts.maxValue) {
         Env.IoC.resolve('ILogger').error('Slider', 'value must be in the range [minValue..maxValue].');
      }
   },
   _setValue(self, val) {
      self._notify('valueChanged', [val], true);
   },
   _render(self, minValue, maxValue, value) {
      const rangeLength = maxValue - minValue;
      const right =  Math.min(Math.max((value - minValue), 0), rangeLength) / rangeLength * 100;
      self._pointData[0].position = right;
      self._lineData.width = right;
   },
   _needUpdate(oldOpts, newOpts) {
      return (oldOpts.scaleStep !== newOpts.scaleStep ||
         oldOpts.minValue !== newOpts.minValue ||
         oldOpts.maxValue !== newOpts.maxValue ||
         oldOpts.value !== newOpts.value);
   }
};

var Base = Control.extend({
   _template: template,
   _value: undefined,
   _lineData: undefined,
   _pointData: undefined,
   _scaleData: undefined,
   _beforeMount(options) {
      _private._checkOptions(options);
      this._scaleData = utils.getScaleData(options.minValue, options.maxValue, options.scaleStep);
      this._value = options.value || options.maxValue;
      this._pointData = [{name: 'point', position: 100}];
      this._lineData = {position: 0, width: 100};
   },
   _beforeUpdate(options) {
      if (_private._needUpdate(this._options, options)) {
         _private._checkOptions(options);
         this._scaleData = utils.getScaleData(options.minValue, options.maxValue, options.scaleStep);
      }
      _private._render(this, options.minValue, options.maxValue, options.value);
   },
   /**
    * Handler for the mousedown event.
    */
   _onMouseDownHandler(event) {
      if (!this._options.readOnly) {
         const box = this._children.area.getBoundingClientRect();
         const ratio = utils.getRatio(event.nativeEvent.pageX, box.left + window.pageXOffset, box.width);
         this._value = utils.calcValue(this._options.minValue, this._options.maxValue, ratio, this._options.precision);
         _private._setValue(this, this._value);
         this._children.dragNDrop.startDragNDrop(this._children.point, event);
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
         _private._setValue(this, this._value);
      }
   }
});

Base.getDefaultOptions = function() {
   return {
      theme: 'default',
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

Base.getOptionTypes = function() {
   return {
      size: entity.descriptor(String).oneOf([
         's',
         'm'
      ]),
      borderVisible: entity.descriptor(Boolean),
      minValue: entity.descriptor(Number).required,
      maxValue: entity.descriptor(Number).required,
      scaleStep: entity.descriptor(Number),
      value: entity.descriptor(Number),
      precision: entity.descriptor(Number)
   };
}

Base._theme = ['Controls/_slider/slider'];

Base._private = _private;
export default Base;
