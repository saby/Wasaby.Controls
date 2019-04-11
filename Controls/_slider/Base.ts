import Control = require('Core/Control');
import Env = require('Env/Env');
import entity = require('Types/entity');
import template = require('wml!Controls/_slider/sliderTemplate');
import utils from 'Controls/_slider/Utils';
import DragNDrop = require('Controls/DragNDrop/Controller');
import Range from './Range';

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
   /**
    * Basic slider with single movable point for choosing value.
    *
    * <a href="/materials/demo/demo-ws4-sliderbase">Demo-example</a>.
    * @public
    * @extends Core/Control
    * @class Controls/_slider/Base
    * @author Колесов В.А.
    * @demo Controls-demo/Slider/Base/SliderBaseDemo
    */

   /**
    * Slider with two movable points for choosing range.
    *
    * @public
    * @extends Core/Control
    * @class Controls/_slider/Range
    * @author Колесов В.А.
    * @demo Controls-demo/Slider/Range/SliderRangeDemo
    */

   /**
    * @name Controls/_slider/Range#size
    * @cfg {Boolean} sets the size of slider point
    * @example
    * Slider with diameter of point = 12px
    * <pre class="brush:html">
    *   <Controls.slider:Base size="s"/>
    * </pre>
    */

   /**
    * @name Controls/_slider/Range#borderVisible
    * @cfg {Boolean} sets the stroke around control
    * @example
    * Slider with border
    * <pre class="brush:html">
    *   <Controls.slider:Base borderVisible="{{true}}"/>
    * </pre>
    */

   /**
    * @name Controls/_slider/Range#minValue
    * @cfg {Number} sets the minimum value of slider
    * @remark must be less than maxValue
    * @example
    * Slider with border
    * <pre class="brush:html">
    *   <Controls.slider:Base minValue="{{10}}"/>
    * </pre>
    * @see maxValue
    */

   /**
    * @name Controls/_slider/Range#maxValue
    * @cfg {Number} sets the maximum value of slider
    * @remark must be greater than minValue
    * @example
    * Slider with border
    * <pre class="brush:html">
    *   <Controls.slider:Base maxValue="{{100}}"/>
    * </pre>
    * @see minValue
    */

   /**
    * @name Controls/_slider/Range#scaleStep
    * @cfg {Number} The scaleStep option determines the step in the scale grid under the slider
    * @remark Scale displayed only if borderVisible is false and scaleStep is positive.
    * @example
    * Slider with scale step of 20
    * <pre class="brush:html">
    *   <Controls.slider:Base scaleStep="{{20}}"/>
    * </pre>
    */

   /**
    * @name Controls/_slider/Range#value
    * @cfg {Number} sets the current value of slider
    * @remark Must be in range of [minValue..maxValue]
    * @example
    * Slider with the point placed at position 40;
    * <pre class="brush:html">
    *   <Controls.slider:Base value="{{40}}"/>
    * </pre>
    */

   /**
    * @name Controls/_slider/Range#precision
    * @cfg {Number} Number of characters in decimal part.
    * @remark Must be non-negative
    * @example
    * Slider with integer values;
    * <pre class="brush:html">
    *   <Controls.slider:Base precision="{{0}}"/>
    * </pre>
    */

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
      size: 'm',
      borderVisible: false,
      minValue: undefined,
      maxValue: undefined,
      scaleStep: undefined,
      value: undefined,
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
