define('Controls/Calendar/Controllers/DateRangeSelectionController', [
   'Core/core-merge',
   'Core/helpers/Object/isEmpty',
   'Controls/Calendar/Controllers/RangeSelectionController',
   'Controls/Calendar/interface/IDateRangeSelectable',
   'SBIS3.CONTROLS/Utils/DateUtil',
], function(coreMerge, isEmpty, RangeSelectionController, IDateRangeSelectable, DateUtil) {
   'use strict';

   var _private = {
      getDayRange: function(startDate, endDate, quantum) {
         var date = new Date(startDate);
         if (startDate <= endDate) {
            date.setDate(date.getDate() + quantum - 1);
            return [startDate, date];
         } else {
            date.setDate(date.getDate() - quantum + 1);
            return [date, startDate];
         }
      }
   };

   /**
    * Контроллер реализующий выделение элементов от одного до другого. В качестве элементов используются даты.
    * Поддерживает выделение квантами кратными дням, неделям, месяцам.
    *
    * Компонент которым управляет контроллер должен поддерживать опции startValue и endValue. Это значнеия элементов
    * от которого и до которого в данный момент выделен диапазон. Так же компонент должен поддерживать события
    * itemClick и itemMouseEnter. Эти события должны передавать в качестве параметра значения элементов с которыми
    * в данный момент происходит взаимодействие.
    *
    * @class Controls/Calendar/Controllers/DateRangeSelectionController
    * @extends Controls/Calendar/Controllers/RangeSelectionController
    * @author Миронов А.Ю.
    */
   var Component = RangeSelectionController.extend({
      _beforeMount: function(options) {
         var quantum = options.quantum || [];
         this._quantum = quantum;
         this._isSingleQuant = options.selectionType === Component.SELECTION_TYPES.quantum &&
               Object.keys(quantum).length === 1 &&
               Object.keys([Object.keys(quantum)[0]]).length === 1;

         Component.superclass._beforeMount.apply(this, arguments);
      },

      _prepareState: function(state) {
         if (state.hasOwnProperty('startValue')) {
            state.startValue = DateUtil.normalizeDate(state.startValue);
         }
         if (state.hasOwnProperty('endValue')) {
            state.endValue = DateUtil.normalizeDate(state.endValue);
         }
         if (state.hasOwnProperty('selectionBaseValue')) {
            state.selectionBaseValue = DateUtil.normalizeDate(state.selectionBaseValue);
         }
         if (state.hasOwnProperty('selectionHoveredValue')) {
            state.selectionHoveredValue = DateUtil.normalizeDate(state.selectionHoveredValue);
         }

         Component.superclass._prepareState.call(this, state);
      },

      _isExternalChanged: function(valueName, options, oldOptions) {
         return options.hasOwnProperty(valueName) &&
            DateUtil.isDatesEqual(oldOptions[valueName], this['_' + valueName]) &&
            !DateUtil.isDatesEqual(oldOptions[valueName], options[valueName]);
      },

      _itemClickHandler: function(event, item) {
         if (this._state.selectionType === Component.SELECTION_TYPES.quantum) {
            // this._processRangeSelection(item);
            if (this._isSingleQuant) {
               this._processSingleSelection(item);
            } else {
               this._processRangeSelection(item);
            }
         } else {
            Component.superclass._itemClickHandler.apply(this, arguments);
         }
      },

      _getDisplayedRangeEdges: function(item) {
         if (this._selectionType !== Component.SELECTION_TYPES.quantum || isEmpty(this._quantum)) {
            return Component.superclass._getDisplayedRangeEdges.apply(this, arguments);
         }

         var quantum = this._quantum,
            startDate = this.getSelectionBaseValue() || item,
            endDate = item,
            lastQuantumLength, lastQuantumType,
            days, start, end, i, date;

         if ('days' in quantum) {
            lastQuantumType = 'days';
            for (i = 0; i < quantum.days.length; i++) {
               lastQuantumLength = quantum.days[i];
               days = DateUtil.getDaysByRange(startDate, endDate) + 1;
               if (quantum.days[i] >= days) {
                  return _private.getDayRange(startDate, endDate, lastQuantumLength);
               }
            }
         }
         if ('weeks' in quantum) {
            lastQuantumType = 'weeks';
            for (i = 0; i < quantum.weeks.length; i++) {
               lastQuantumLength = quantum.weeks[i];
               if (startDate <= endDate) {
                  start = DateUtil.getStartOfWeek(startDate);
                  end = DateUtil.getEndOfWeek(startDate);
                  end.setDate(end.getDate() + (lastQuantumLength - 1) * 7);
               } else {
                  start = DateUtil.getStartOfWeek(startDate);
                  start.setDate(start.getDate() - (lastQuantumLength - 1) * 7);
                  end = DateUtil.getEndOfWeek(startDate);
               }
               if (endDate >= start && endDate <= end) {
                  return [start, end];
               }
            }
         }
         if ('months' in quantum) {
            lastQuantumType = 'months';
            for (i = 0; i < quantum.months.length; i++) {
               lastQuantumLength = quantum.months[i];
               if (startDate <= endDate) {
                  start = DateUtil.getStartOfMonth(startDate);
                  end = DateUtil.getEndOfMonth(startDate);
                  end.setMonth(end.getMonth() + (lastQuantumLength - 1));
               } else {
                  start = DateUtil.getStartOfMonth(startDate);
                  start.setMonth(start.getMonth() - (lastQuantumLength - 1));
                  end = DateUtil.getEndOfMonth(startDate);
               }
               if (endDate >= start && endDate <= end) {
                  return [start, end];
               }
            }
         }

         if (lastQuantumType === 'days') {
            return _private.getDayRange(startDate, endDate, lastQuantumLength);
         } else if (lastQuantumType === 'weeks') {
            date = new Date(startDate);
            date.setDate(date.getDate() + (lastQuantumLength - 1) * 7);
            if (startDate <= endDate) {
               return [DateUtil.getStartOfWeek(startDate), DateUtil.getEndOfWeek(date)];
            } else {
               return [DateUtil.getStartOfWeek(date), DateUtil.getEndOfWeek(startDate)];
            }
         } else if (lastQuantumType === 'months') {
            date = new Date(startDate);
            date.setMonth(date.getMonth() + lastQuantumLength - 1);
            if (startDate <= endDate) {
               return [DateUtil.getStartOfMonth(startDate), DateUtil.getEndOfMonth(date)];
            } else {
               return [DateUtil.getStartOfMonth(date), DateUtil.getEndOfMonth(startDate)];
            }
         }
      }
   });

   Component.SELECTION_TYPES = IDateRangeSelectable.SELECTION_TYPES;

   Component.getDefaultOptions = function() {
      return coreMerge({}, IDateRangeSelectable.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IDateRangeSelectable.getOptionTypes());
   };

   return Component;
});
