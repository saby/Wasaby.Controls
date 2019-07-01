import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {descriptor as EntityDescriptor} from 'Types/entity';
import {IoC} from 'Env/Env';
import stateIndicatorTemplate = require('wml!Controls/_progress/StateIndicator/StateIndicator');
import { SyntheticEvent } from 'Vdom/Vdom';

const defaultColors = [
   'controls-StateIndicator__sector1',
   'controls-StateIndicator__sector2',
   'controls-StateIndicator__sector3'
];
const DEFAULT_EMPTY_COLOR_CLASS = 'controls-StateIndicator__emptySector';
const defaultScaleValue = 10;
const maxPercentValue = 100;

export interface IIndicatorCategory {
   value: number;
   className: string;
   title: string;
}

export interface IStateIndicatorOptions extends IControlOptions {
   scale?: number;
   data?: IIndicatorCategory[];
}
/**
 * Progress state indicator
 * <a href="/materials/demo-ws4-stateindicator">Demo-example</a>.
 * @class Controls/_progress/StateIndicator
 * @extends Core/Control
 * @author Колесов В.А.
 *
 * @public
 * @demo Controls-demo/StateIndicator/StateIndicatorDemo
 */

/**
 * @name Controls/_progress/StateIndicator#scale
 * @cfg {Number} Defines percent count shown by each sector.
 * @remark
 * A positive number up to 100.
 * @example
 * Scale of 5 will set indicator with 20 sectors
 * <pre class="brush:html">
 *   <Controls.progress:StateIndicator scale="{{5}}"/>
 * </pre>
 */

/**
 * @typedef {Object} IndicatorCategory
 * @property {Number} value=0 Percents of the corresponding category
 * @property {String} className='' Name of css class, that will be applied to sectors of this category. If not specified, default color will be used
 * @property {String} title='' category note
 */

/**
 * @name Controls/_progress/StateIndicator#data
 * @cfg {Array.<IndicatorCategory>} Array of indicator categories
 * <pre class="brush:html">
 *   <Controls.progress:StateIndicator data="{{[{value: 10, className: '', title: 'done'}]}}"/>
 * </pre>
 */

/**
 * @event Controls/_progress/StateIndicator#itemEnter Occurs when mouse enters sectors of indicator
 * @param {Env/Event:Object} eventObject event descriptor.
 *
 */
class StateIndicator extends Control<IStateIndicatorOptions>{
   protected _template: TemplateFunction = stateIndicatorTemplate;
   private _colorState: number[];
   private _colors: string[];
   private _numSectors: number = 10;

   private _checkData(opts: IStateIndicatorOptions): void {
      let sum = 0;
      if (isNaN(opts.scale)) {
         IoC.resolve('ILogger').error('StateIndicator', 'Scale [' + opts.scale + '] is incorrect,' +
                              'it is non-numeric value');
      }
      if (opts.scale > maxPercentValue || opts.scale < 1) {
         IoC.resolve('ILogger').error('StateIndicator', 'Scale [' + opts.scale + '] is incorrect,' +
                              'it must be in range (0..100]');
      }

      sum = opts.data.map(Object).reduce((sum, d) => {
         return sum + Math.max(d.value, 0);
      }, 0);

      if (isNaN(sum)) {
         IoC.resolve('ILogger').error('StateIndicator', 'Data is incorrect,' +
                              'it contains non-numeric values');
      }
      if (sum > maxPercentValue) {
         IoC.resolve('ILogger').error('StateIndicator', 'Data is incorrect.' +
                               'Values total is greater than 100%');
      }
   }

   private _setColors(data: IIndicatorCategory[]): string[] {
      let colors: string[] = [];
      for (let i = 0; i < data.length; i++) {
         colors[i] = data[i].className ? data[i].className : (defaultColors[i] ? defaultColors[i] : '');
      }
      return colors;
   }

   private _calculateColorState(opts: IStateIndicatorOptions, _colors: string[], _numSectors: number): number[] {
      const colorValues = [];
      let correctScale: number = opts.scale;
      let sectorSize: number;
      let curSector = 0;
      let totalSectorsUsed = 0;
      let maxSectorsPerValue = 0;
      let longestValueStart;
      let itemValue;
      let itemNumSectors;
      let excess;

      if (opts.scale <= 0 || opts.scale > maxPercentValue) {
         correctScale = defaultScaleValue;
      }
      sectorSize = Math.floor(correctScale);
      for (let i = 0; i < Math.min(opts.data.length); i++) {
         // do not draw more colors, than we know
         if (i < _colors.length) {
            // convert to number, ignore negative ones
            itemValue = Math.max(0, + opts.data[i].value || 0);
            itemNumSectors = Math.floor(itemValue / sectorSize);
            if (itemValue > 0 && itemNumSectors === 0) {
               // if state value is positive and corresponding sector number is 0, increase it by 1 (look specification)
               itemNumSectors = 1;
            }
            if (itemNumSectors > maxSectorsPerValue) {
               longestValueStart = curSector;
               maxSectorsPerValue = itemNumSectors;
            }
            totalSectorsUsed += itemNumSectors;
            for (let j = 0; j < itemNumSectors; j++) {
               colorValues[curSector++] = i + 1;
            }
         }
      }
      // if we count more sectors, than we have in indicator, trim the longest value
      if (totalSectorsUsed  > _numSectors ) {
         excess = totalSectorsUsed - _numSectors;
         colorValues.splice(longestValueStart, excess);
      }
      return colorValues;
   }

   private _applyNewState(opts: IStateIndicatorOptions): void {
      let correctScale: number = opts.scale;
      this._checkData(opts);
      if (opts.scale <= 0 || opts.scale > maxPercentValue) {
         correctScale = defaultScaleValue;
      }
      this._numSectors = Math.floor(maxPercentValue / correctScale);
      this._colors = this._setColors(opts.data);
      this._colorState  = this._calculateColorState(opts, this._colors, this._numSectors);
   }

   private _mouseEnterIndicatorHandler(e: SyntheticEvent): void {
      this._notify('itemEnter', [e.target]);
   }

   protected _beforeMount(opts: IStateIndicatorOptions): void {
      this._applyNewState(opts);
   }

   protected _beforeUpdate(opts: IStateIndicatorOptions): void {
      if (opts.data !== this._options.data || opts.scale !== this._options.scale) {
         this._applyNewState(opts);
      }
   }

   static _theme: string[] = ['Controls/progress'];

   static getDefaultOptions(): object {
      return {
         theme: 'default',
         scale: 10,
         data: [{value: 0, title: '', className: ''}]
      };
   }

   static getOptionTypes(): object {
      return {
         scale: EntityDescriptor(Number),
         data: EntityDescriptor(Array),
      };
   }
}

export default StateIndicator;
