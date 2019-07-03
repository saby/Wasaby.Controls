import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IoC} from 'Env/Env';
import {descriptor as EntityDescriptor} from 'Types/entity';
import SliderTemplate = require('wml!Controls/_slider/sliderTemplate');
import {IScaleData, ILineData, IPointDataList, default as Utils} from './Utils';
import { SyntheticEvent } from 'Vdom/Vdom';

export interface ISliderRangeOptions extends IControlOptions {
   size?: string;
   borderVisible?: boolean;
   minValue: number;
   maxValue: number;
   scaleStep?: number;
   startValue: number;
   endValue: number;
   precision: number;
}

const maxPercentValue = 100;

/**
 * Slider with two movable points for choosing range.
 *
 * <a href="/materials/demo-ws4-sliderrange">Demo-example</a>.
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
 * @name Controls/_slider/Range#startValue
 * @cfg {Number} sets the current start value of slider
 * @remark Must be in range of [minValue..maxValue]
 * @example
 * Slider with the first point placed at position 40;
 * <pre class="brush:html">
 *   <Controls.slider:Base startValue="{{40}}"/>
 * </pre>
 * @see endValue
 */

/**
 * @name Controls/_slider/Range#endValue
 * @cfg {Number} sets the current end value of slider
 * @remark Must be in range of [minValue..maxValue]
 * @example
 * Slider with the second point placed at position 40;
 * <pre class="brush:html">
 *   <Controls.slider:Base endValue="{{40}}"/>
 * </pre>
 * @see startValue
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
class Range extends Control<ISliderRangeOptions> {
   protected _template: TemplateFunction = SliderTemplate;
   private _value: number = undefined;
   private _lineData: ILineData = undefined;
   private _pointData: IPointDataList = undefined;
   private _scaleData: IScaleData[] = undefined;
   private _startValue: number = undefined;
   private _endValue: number = undefined;

   private _render(minValue: number, maxValue: number, startValue: number, endValue: number): void {
      const rangeLength = maxValue - minValue;
      const left =  Math.min(Math.max((startValue - minValue), 0), rangeLength) / rangeLength * maxPercentValue;
      const right =  Math.min(Math.max((endValue - minValue), 0), rangeLength) / rangeLength * maxPercentValue;
      const width = right - left;
      this._pointData[1].position = right;
      this._pointData[0].position = left;
      this._lineData.position = left;
      this._lineData.width = width ;
   }

   private _checkOptions(opts: ISliderRangeOptions): void {
      Utils.checkOptions(opts);
      if (opts.startValue < opts.minValue || opts.startValue > opts.maxValue) {
         IoC.resolve('ILogger').error('Slider', 'startValue must be in the range [minValue..maxValue].');
      }
      if (opts.endValue < opts.minValue || opts.endValue > opts.maxValue) {
         IoC.resolve('ILogger').error('Slider', 'endValue must be in the range [minValue..maxValue].');
      }
   }

   private _needUpdate(oldOpts: ISliderRangeOptions, newOpts: ISliderRangeOptions): boolean {
      return (oldOpts.scaleStep !== newOpts.scaleStep ||
         oldOpts.minValue !== newOpts.minValue ||
         oldOpts.maxValue !== newOpts.maxValue ||
         oldOpts.startValue !== newOpts.startValue ||
         oldOpts.endValue !== newOpts.endValue);
   }

   protected _beforeMount(options: ISliderRangeOptions): void {
      this._checkOptions(options);
      this._scaleData = Utils.getScaleData(options.minValue, options.maxValue, options.scaleStep);
      this._endValue = options.endValue === undefined ? options.maxValue : Math.min(options.maxValue, options.endValue);
      this._startValue = options.startValue === undefined ?
                                                options.minValue : Math.max(options.minValue, options.startValue);
      this._value = undefined;
      this._pointData = [{name: 'pointStart', position: 0}, {name: 'pointEnd', position: 100}];
      this._lineData = {position: 0, width: 100};
      this._render(options.minValue, options.maxValue, this._startValue, this._endValue);
   }

   protected _beforeUpdate(options: ISliderRangeOptions): void {
      if (this._needUpdate(this._options, options)) {
         this._checkOptions(options);
         this._scaleData = Utils.getScaleData( options.minValue, options.maxValue, options.scaleStep);
      }
      this._endValue = options.endValue === undefined ? options.maxValue : Math.min(options.maxValue, options.endValue);
      this._startValue = options.startValue === undefined ?
                                                options.minValue : Math.max(options.minValue, options.startValue);
      this._render(options.minValue, options.maxValue, this._startValue, this._endValue);
   }

   private _setStartValue(val: number): void {
      this._startValue = val;
      this._notify('startValueChanged', [val]);
   }
   private _setEndValue(val: number): void {
      this._endValue = val;
      this._notify('endValueChanged', [val]);
   }

   private _getClosestPoint(value: number, startValue: number, endValue: number): string {
      const startPointDistance = Math.abs(value - startValue);
      const endPointDistance = Math.abs(value - endValue);
      if (startPointDistance === endPointDistance) {
         return value < startValue ? 'start' : 'end';
      } else {
         return startPointDistance < endPointDistance ? 'start' : 'end';
      }
   }

   private _onMouseDownHandler(event: SyntheticEvent<MouseEvent>): void {
      if (!this._options.readOnly) {
         const box = this._children.area.getBoundingClientRect();
         const ratio = Utils.getRatio(event.nativeEvent.pageX, box.left + window.pageXOffset, box.width);
         this._value = Utils.calcValue(this._options.minValue, this._options.maxValue, ratio, this._options.precision);
         const pointName = this._getClosestPoint(this._value, this._startValue, this._endValue);
         if (pointName === 'start') {
            this._setStartValue(this._value);
         }
         if (pointName === 'end') {
            this._setEndValue(this._value);
         }
         const target = pointName === 'start' ? this._children.pointStart : this._children.pointEnd;
         this._children.dragNDrop.startDragNDrop(target, event);
      }
   }

   private _onDragNDropHandler(e: SyntheticEvent<Event>, dragObject): void {
      if (!this._options.readOnly) {
         const box = this._children.area.getBoundingClientRect();
         const ratio = Utils.getRatio(dragObject.position.x, box.left + window.pageXOffset, box.width);
         this._value = Utils.calcValue(this._options.minValue, this._options.maxValue, ratio, this._options.precision);
         if (dragObject.entity === this._children.pointStart) {
            this._setStartValue(Math.min(this._value, this._endValue));
         }
         if (dragObject.entity === this._children.pointEnd) {
            this._setEndValue(Math.max(this._value, this._startValue));
         }
      }
   }

   static _theme: string[] = ['Controls/slider'];

   static getDefaultOptions(): object {
      return {
         theme: "default",
         size: 'm',
         borderVisible: false,
         minValue: undefined,
         maxValue: undefined,
         scaleStep: undefined,
         startValue: undefined,
         endValue: undefined,
         precision: 0
      };
   }

   static getOptionTypes(): object {
      return {
         size: EntityDescriptor(String).oneOf([
            's',
            'm'
         ]),
         borderVisible: EntityDescriptor(Boolean),
         minValue: EntityDescriptor(Number).required,
         maxValue: EntityDescriptor(Number).required,
         scaleStep: EntityDescriptor(Number),
         startValue: EntityDescriptor(Number),
         endValue: EntityDescriptor(Number),
         precision: EntityDescriptor(Number)
      };
   }
}
export default Range;
