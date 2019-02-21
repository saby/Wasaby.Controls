define('Controls/ProcessStateIndicator', [
   'Core/Control',
   'Types/entity',
   'wml!Controls/ProcessStateIndicator/ProcessStateIndicator',
   'css!Controls/ProcessStateIndicator/ProcessStateIndicator',
], 
function(Control, entity, template ) {
   'use strict'; 

   var defaultColors = [
      'controls-ProcessStateIndicator__sector1', 
      'controls-ProcessStateIndicator__sector2', 
      'controls-ProcessStateIndicator__sector3'
   ];

   var DEFAULT_EMPTY_COLOR_CLASS = 'controls-ProcessStateIndicator__emptySector';

   var setColors = function setColors(_colors, _numValues) {
      var colors = [];
      if(_numValues > Math.max(_colors.length,defaultColors.length)) {
         throw new Error('Number of values is greater than number of colors');
      } 
      for (var i = 0; i < _numValues; i++) {
         colors[i] = _colors[i] ? _colors[i] : defaultColors[i];
      }
      return colors;
   }

   var calculateColorState = function calculateColorState(_numSectors, _numValues, _state, _colors) {
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
      for(i = 0; i < Math.min(_numValues, state.length); i++) {
         // Больше чем знаем цветов не рисуем
         if (i < _colors.length) {
            // Приводим к числу, отрицательные игнорируем 
            itemValue = Math.max(0, +state[i] || 0);
            itemNumSectors = Math.floor(itemValue / sectorSize);
            if (itemValue > 0 && itemNumSectors === 0) {
               // Если значение элемента не нулевое, 
               // а количество секторов нулевое (из-за округления) то увеличим до 1 (см. спецификацию)
               itemNumSectors = 1;
            }
            if (itemNumSectors > maxSectorsPerValue) {
               longestValueStart = curSector;
               maxSectorsPerValue = itemNumSectors
            }
            totalSectorsUsed += itemNumSectors;
            for(j = 0; j < itemNumSectors; j++) {
               colorValues[curSector++] = i+1;
            }
         }
      }
      
      // Если собрали больше секторов чем есть - урежем самый длинный на величину превышения
      if (totalSectorsUsed > _numSectors) {
         excess = totalSectorsUsed - _numSectors;
         colorValues.splice(longestValueStart, excess);
      }
      
      return colorValues;
   }

   function checkState(state) {
      var sum;
      
      if (!(state instanceof Array)) {
         state = [ state ]
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

   var ProcessStateIndicator = Control.extend(
      {
         _template: template,
         _colorState: [], 
         _realNumSectors: 10,
         _colors: [],
            
         _beforeUpdate: function(opts) {
            //Подгоняем количество секторов индикатора под размер области (см. спецификацию)
            var indicatorWidth = this._container.clientWidth - 6;
            this._realNumSectors = Math.min(Math.floor((indicatorWidth - 6 ) / 8),opts.numSectors);
            
            
         },

         _mouseOverIndicatorHandler: function(e) {
            var itemIndex = this._container.getElementsByClassName('controls-ProcessStateIndicator__box').index(e.target);
            this._notify('onItemOver', + e.target.getAttribute('data-item'), itemIndex)
         },

         _afterMount: function() {
            this._mouseOverIndicatorHandler = this._mouseOverIndicatorHandler.bind(this);
            this._container.getElementsByClassName('controls-ProcessStateIndicator__box', 'mouseover', this._mouseOverIndicatorHandler);
         }, 
               
         _afterUpdate(opts) {

            checkState(opts.state);
            var colorState,
            indicatorBoxes = this._container.getElementsByClassName('controls-ProcessStateIndicator__box');
            this._colors = setColors(this._options.colors, this._options.numValues);
            this._colorState = colorState = calculateColorState(this._realNumSectors, this._options.numValues, this._options.state, this._colors);
            for (var i = 0; i < indicatorBoxes.length; i++) {
               indicatorBoxes[i].className = (colorState[i] && (this._colors[colorState[i] - 1]) || DEFAULT_EMPTY_COLOR_CLASS) + ' controls-ProcessStateIndicator__box';
               indicatorBoxes[i].setAttribute('data-item', colorState[i]);
            }
         },

      });

   ProcessStateIndicator.getDefaultOptions = function getDefaultOptions() {
      return {
         numSectors: 10,
         numValues: 1,
         state: [0],
         colors: [],
      };
   };

   ProcessStateIndicator.getOptionTypes = function getOptionTypes() {
      return {
         numSectors: entity.descriptor(Number),
         numValues: entity.descriptor(Number),
         state: entity.descriptor(Array),
         colors: entity.descriptor(Array),
      };
   };

   ProcessStateIndicator.calculateColorState = calculateColorState;   
   ProcessStateIndicator.setColors = setColors;
   return ProcessStateIndicator;

});
