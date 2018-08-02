define('Controls/Date/Utils/RangeSelection', [
   'Core/helpers/Object/isEmpty',
   'Controls/Utils/Date'
], function(
   isEmpty,
   DateUtil
) {
   'use strict';


   var Utils = {

      PERIOD_QUANTUM: {
         day: 'day',
         month: 'month',
         year: 'year'
      },

      /**
        * Returns a string containing css selection classes
        * @returns {String}
        */
      prepareSelectionClass: function(itemValue, startValue, endValue, selectionProcessing, baseSelectionValue,
         hoveredSelectionValue, hoveredStartValue, hoveredEndValue, cfg) {
         var css = [],
            periodQuantum = cfg ? cfg.periodQuantum : 'day',
            isPeriodsEqual,
            start,
            end,
            selected,
            isStart,
            isEnd,
            range;

         if (!(startValue || endValue) && !selectionProcessing) {
            return '';
         }

         range = this.getRange(startValue, endValue, selectionProcessing, baseSelectionValue, hoveredSelectionValue);
         start = range[0];
         end = range[1];

         selected = Utils.isSelected(itemValue, startValue, endValue, selectionProcessing, baseSelectionValue,
            hoveredSelectionValue);

         if (!selected) {
            return '';
         }

         css.push(selectionProcessing ? 'selection' : 'selected');

         if (periodQuantum === this.PERIOD_QUANTUM.year) {
            isPeriodsEqual = DateUtil.isYearsEqual;
         } else if (periodQuantum === this.PERIOD_QUANTUM.month) {
            isPeriodsEqual = DateUtil.isMonthsEqual;
         } else {
            isPeriodsEqual = DateUtil.isDatesEqual;
         }

         isStart = isPeriodsEqual(itemValue, start);
         isEnd = isPeriodsEqual(itemValue, end);

         if (isStart) {
            css.push('start');
         }
         if (isEnd && ((selectionProcessing && !isStart) || !selectionProcessing)) {
            css.push('end');
         }
         if (!isStart && !isEnd) {
            css.push('inner');
         }

         if (selectionProcessing) {
            if (isPeriodsEqual(itemValue, baseSelectionValue)) {
               css.push('base');
            }
            if (isPeriodsEqual(itemValue, hoveredSelectionValue)) {
               css.push('hovered');
            }
         } else if (this.isHovered(itemValue, hoveredStartValue, hoveredEndValue)) {
            css.push('hovered');
         }

         return ((cfg && cfg.cssPrefix) || 'controls-RangeSelection__') + css.join('-');
      },

      isHovered: function(itemValue, hoveredStartValue, hoveredEndValue) {
         return hoveredStartValue && hoveredEndValue && itemValue >= hoveredStartValue && itemValue <= hoveredEndValue;
      },

      prepareHoveredClass: function(itemValue, hoveredStartValue, hoveredEndValue, cfg) {
         if (this.isHovered(itemValue, hoveredStartValue, hoveredEndValue)) {
            return ((cfg && cfg.cssPrefix) || 'controls-RangeSelection__') + 'hovered';
         }
         return '';
      },

      isSelected: function(itemValue, startValue, endValue, selectionProcessing, baseSelectionValue,
         hoveredSelectionValue) {
         var range = this.getRange(startValue, endValue, selectionProcessing, baseSelectionValue,
               hoveredSelectionValue),
            start = range[0],
            end = range[1];
         return start && end && itemValue >= start && itemValue <= end;
      },

      getRange: function(startValue, endValue, selectionProcessing, baseSelectionValue, hoveredSelectionValue) {
         var range, start, end;

         if (selectionProcessing) {
            range = (baseSelectionValue > hoveredSelectionValue)
               ? [hoveredSelectionValue, baseSelectionValue] : [baseSelectionValue, hoveredSelectionValue];
            start = range[0];
            end = range[1];
         } else {
            start = startValue;
            end = endValue || start;
         }
         return [start, end];
      }
   };

   return Utils;
});
