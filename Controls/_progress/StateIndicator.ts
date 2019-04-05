import Control = require('Core/Control');
import entity = require('Types/entity');
import env = require('Env/Env');
import template = require('wml!Controls/_progress/StateIndicator/StateIndicator');

var defaultColors = [
      'controls-StateIndicator__sector1',
      'controls-StateIndicator__sector2',
      'controls-StateIndicator__sector3'
   ],
   DEFAULT_EMPTY_COLOR_CLASS = 'controls-StateIndicator__emptySector',
   _private = {

      /**
       * Chooses colors to be applied to indicator sectors
       * @param {Array.<IndicatorCategory>} data Current data
       * @return {Array.<String>} Colors to be applied to indicator sectors
       */
      setColors: function(data) {
         var colors = [];
         for (var i = 0; i < data.length; i++) {
            colors[i] = data[i].className ? data[i].className : (defaultColors[i] ? defaultColors[i] : '');
         }
         return colors;
      },

      /**
       * Calculates sector categories corresponding to options
       * @param {Object} opts Options
       * @param {Array.<String>} _colors Colors will be used
       * @param {Number} _numSectors number of indicator sectors
       * @return {Array.<String>} Colors to apply to indicator sectors
       */
      calculateColorState: function(opts, _colors, _numSectors) {
         var
            sectorSize = (opts.scale <= 0 || opts.scale > 100 ?  10 : Math.floor(opts.scale)),
            colorValues = [],
            curSector = 0,
            totalSectorsUsed = 0,
            maxSectorsPerValue = 0,
            longestValueStart, i, j, itemValue, itemNumSectors, excess;

         for (i = 0; i < Math.min(opts.data.length); i++) {
            // do not draw more colors, than we know
            if (i < _colors.length) {
               // convert to number, ignore negative ones
               itemValue = Math.max(0, + opts.data[i].value || 0);
               itemNumSectors = Math.floor(itemValue / sectorSize);
               if (itemValue > 0 && itemNumSectors === 0) {
                  // if state value is positive and corresponding sector number is zero, increase it by 1 (look specification)
                  itemNumSectors = 1;
               }
               if (itemNumSectors > maxSectorsPerValue) {
                  longestValueStart = curSector;
                  maxSectorsPerValue = itemNumSectors;
               }
               totalSectorsUsed += itemNumSectors;
               for (j = 0; j < itemNumSectors; j++) {
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
      },

      /**
       * Checks if options are valid
       * @param {Object} opts Options
       */
      checkData: function(opts) {
         var sum = 0;

         if (isNaN(opts.scale)) {
            env.IoC.resolve('ILogger').error('StateIndicator', 'Scale [' + opts.scale + '] is incorrect, it is non-numeric value');
         }
         if (opts.scale > 100 || opts.scale < 1) {
            env.IoC.resolve('ILogger').error('StateIndicator', 'Scale [' + opts.scale + '] is incorrect, it must be in range (0..100]');
         }

         sum = opts.data.map(Object).reduce(function(sum, d) {
               return sum + Math.max(d.value, 0);
            }, 0);

         if (isNaN(sum)) {
            env.IoC.resolve('ILogger').error('StateIndicator', 'Data is incorrect, it contains non-numeric values');
         }
         if (sum > 100) {
            env.IoC.resolve('ILogger').error('StateIndicator', 'Data is incorrect. Values total is greater than 100%');
         }
      }
   };
/// <amd-module name="Controls/_progress/StateIndicator" />
/**
 * Progress state indicator
 * <a href="/demo/demo-ws4-stateindicator">Demo-example</a>.
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
 *   <Controls.progress:StateIndicator data="{{[{value: 10, className: '', title: 'done'}]]}}"/>
 * </pre>
 */
var StateIndicator = Control.extend(
   {
      /**
       * @event itemEnter appears when mouse enters sectors of indicator
       * @param {Env/Event:Object} eventObject event descriptor.
       *
       */
      _template: template,
      _colorState: [],
      _colors: [],
      _numSectors: 10,

      _beforeMount: function(opts) {
       	this.applyNewState(opts);
      },

      _beforeUpdate: function(opts) {
         if (opts.data!==this._options.data||opts.scale!==this._options.scale)
            this.applyNewState(opts);
      },

      _mouseEnterIndicatorHandler: function(e) {
         this._notify('itemEnter', [e.target]);
      },

      /**
       * Processes and applies new options
       * @param {Object} opts Options
       */
      applyNewState: function(opts) {
         _private.checkData(opts);
         this._numSectors = Math.floor(100 / (opts.scale <= 0 || opts.scale > 100 ?  10 : opts.scale));
         this._colors = _private.setColors(opts.data);
         this._colorState  = _private.calculateColorState(opts, this._colors, this._numSectors);
      },

   });

StateIndicator.getDefaultOptions = function getDefaultOptions() {
   return {
      theme: "default",
      scale: 10,
      data: [{value:0, title:'', className:''}],
   };
};

StateIndicator.getOptionTypes = function getOptionTypes() {
   return {
      scale: entity.descriptor(Number),
      data: entity.descriptor(Array),
   };
};

StateIndicator._theme = ['Controls/_progress/progress'];

StateIndicator._private = _private;
export default StateIndicator;


