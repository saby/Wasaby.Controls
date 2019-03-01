import Control = require('Core/Control');
import entity = require('Types/entity');
import template = require('wml!Controls/_progress/StateIndicator/StateIndicator');

var defaultColors = [
      'controls-StateIndicator__sector1', 
      'controls-StateIndicator__sector2', 
      'controls-StateIndicator__sector3'
   ],
   DEFAULT_EMPTY_COLOR_CLASS = 'controls-StateIndicator__emptySector',
   _private = {

      setColors: function(_colors, _numValues) {
         var colors = [];
         if (_numValues > Math.max(_colors.length, defaultColors.length)) {
            throw new Error('Number of values is greater than number of colors');
         } 
         for (var i = 0; i < _numValues; i++) {
            colors[i] = _colors[i] ? _colors[i] : defaultColors[i];
         }
         return colors;
      },

      calculateColorState: function(_numSectors, _numValues, _state, _colors) {
         var
            sectorSize = Math.floor(100 / _numSectors),
            state = _state || [],
            colorValues = [],
            curSector = 0,
            totalSectorsUsed = 0,
            maxSectorsPerValue = 0,
            longestValueStart, i, j, itemValue, itemNumSectors, excess;
            
         if (!(state instanceof Array)) {
            state = [ +state ];
         }
         for (i = 0; i < Math.min(_numValues, state.length); i++) {
            // Больше чем знаем цветов не рисуем
            if (i < _colors.length) {
               // convert to number, ignore negative ones
               itemValue = Math.max(0, +state[i] || 0);
               itemNumSectors = Math.floor(itemValue / sectorSize);
               if (itemValue > 0 && itemNumSectors === 0) {
                  // if state value is positive and corresponding sector number is zero? increase it by 1 (look specification)
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
         if (totalSectorsUsed > _numSectors) {
            excess = totalSectorsUsed - _numSectors;
            colorValues.splice(longestValueStart, excess);
         }   
         return colorValues;
      },

      checkState: function(state) {
         var sum;      
         if (!(state instanceof Array)) {
            state = [ state ];
         }
       
         sum = state.map(Number).reduce(function(sum, v) {
               return sum + Math.max(v, 0);
            }, 0);
            
         if (isNaN(sum)) {
            throw new Error('State [' + state + '] is incorrect, it contains non-numeric values');
         }
         if (sum > 100) {
            throw new Error('State [' + state + '] is incorrect. Values total is greater than 100%');
         }
         return sum;
      }
   };
   
var StateIndicator = Control.extend(
   {
      _template: template,
      _colorState: [],
      _colors: [],

      _beforeMount: function(opts) {
       	this.applyNewState(opts);
      },

      _beforeUpdate: function(opts) {
         this.applyNewState(opts);
      },

      _mouseOverIndicatorHandler: function(e, data) {
         this._notify('onItemOver', [e.target, data]);
      },

      applyNewState: function(opts) {
         _private.checkState(opts.state);
         this._colors = _private.setColors(opts.colors, opts.numValues);
         this._colorState  = _private.calculateColorState(opts.numSectors, opts.numValues, opts.state, this._colors);
      },

   });

StateIndicator.getDefaultOptions = function getDefaultOptions() {
   return {
      theme: "default"
      numSectors: 10,
      numValues: 1,
      state: [0],
      colors: [],
   };
};

StateIndicator.getOptionTypes = function getOptionTypes() {
   return {
      numSectors: entity.descriptor(Number),
      numValues: entity.descriptor(Number),
      state: entity.descriptor(Array),
      colors: entity.descriptor(Array),
   };
};

StateIndicator._theme = ['Controls/_progress/progress'];

StateIndicator._private = _private;
export default StateIndicator;


