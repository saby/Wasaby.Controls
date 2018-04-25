/* global define */
define('Controls/Calendar/MonthView/MonthViewModel', [
   'Core/core-simpleExtend',
   'Core/core-merge',
   'WS.Data/Entity/VersionableMixin',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'Controls/Calendar/Utils'
], function(
   cExtend,
   coreMerge,
   VersionableMixin,
   DateUtil,
   calendarUtils
) {
   'use strict';

   /**
    * Модель для представления месяца.
    * @class Controls/Calendar/MonthView/MonthViewModel
    * @author Миронов А.Ю.
    */

   var ModuleClass = cExtend.extend([VersionableMixin], {
      _state: null,
      _modelArray: [],

      constructor: function(cfg) {
         ModuleClass.superclass.constructor.apply(this, arguments);

         this._state = this._normalizeState(cfg);
         this._validateWeeksArray();
      },

      updateOptions: function(options) {
         var state = this._normalizeState(options),
            changed = this._isStateChanged(state);
         this._state = state;
         if (changed) {
            this._validateWeeksArray();
            this._nextVersion();
         }
      },

      getMonthArray: function() {
         return this._modelArray;
      },

      _normalizeState: function(state) {
         return {
            month: DateUtil.normalizeDate(state.month),
            enabled: state.enabled
         };
      },

      _isStateChanged: function(state) {
         return !DateUtil.isDatesEqual(state.month, this._state.month);
      },

      _validateWeeksArray: function(state) {
         this._modelArray = this._getDaysArray(state);
      },

      _getDayObject: function(date, state) {
         state = state || this._state;

         var obj = {},
            today = DateUtil.normalizeDate(new Date()),
            firstDateOfMonth = DateUtil.getStartOfMonth(today),
            lastDateOfMonth = DateUtil.getEndOfMonth(today);

         obj.date = date;
         obj.day = date.getDate();
         obj.dayOfWeek = date.getDay() ? date.getDay() - 1 : 6;
         obj.isCurrentMonth = DateUtil.isMonthsEqual(date, state.month);
         obj.today = DateUtil.isDatesEqual(date, today);
         obj.month = date.getMonth();
         obj.firstDayOfMonth = DateUtil.isDatesEqual(date, firstDateOfMonth);
         obj.lastDayOfMonth = DateUtil.isDatesEqual(date, lastDateOfMonth);

         // obj.selectionEnabled = this._state.selectionType === DateRangeSelectionController.SELECTION_TYPES.range ||
         //    this._state.selectionType === DateRangeSelectionController.SELECTION_TYPES.single;

         obj.weekend = obj.dayOfWeek === 5 || obj.dayOfWeek === 6;
         obj.enabled = state.enabled;

         if (state.dayFormatter) {
            coreMerge(obj, state.dayFormatter(date) || {});
         }

         return obj;
      },

      _getDaysArray: function(state) {
         state = state || this._state;
         var weeks = calendarUtils.getWeeksArray(state.month);

         return weeks.map(function(weekArray) {
            return weekArray.map(function(day) {
               return this._getDayObject(day, state);
            }, this);
         }, this);
      },

      _prepareClass: function(scope) {
         // TODO: Попробовать переверстать на flex.
         scope = scope.value;

         var textColorClass = 'controls-MonthView__textColor',
            backgroundColorClass = 'controls-MonthView__backgroundColor',
            css = [];

         if (scope.isCurrentMonth) {
            textColorClass += '-currentMonthDay';
            backgroundColorClass += '-currentMonthDay';
         } else {
            textColorClass += '-otherMonthDay';
            backgroundColorClass += '-otherMonthDay';
         }

         if (scope.weekend) {
            textColorClass += '-weekend';
            backgroundColorClass += '-weekend';
         } else {
            textColorClass += '-workday';
            backgroundColorClass += '-workday';
         }

         if (scope.selected) {
            backgroundColorClass += '-selected';
            if (scope.selectedStart || scope.selectedEnd) {
               if (scope.selectionProcessing) {
                  backgroundColorClass += '-startend-unfinished';
               }
            }
         } else {
            backgroundColorClass += '-unselected';
         }

         if (scope.enabled) {
            textColorClass += '-enabled';
            backgroundColorClass += '-enabled';
         } else {
            textColorClass += '-disabled';
            backgroundColorClass += '-disabled';
         }

         css.push(textColorClass, backgroundColorClass);

         // Оставляем старые классы т.к. они используются в большом выборе периода до его редизайна
         // TODO: Выпилить старые классы
         if (scope.isCurrentMonth) {
            // if (scope.selectionEnabled) {
            if (scope.enabled) {
               css.push('controls-MonthView__cursor-item');
               if (!scope.selected) {
                  css.push('controls-MonthView__border-currentMonthDay-unselected');
               }
            }
            css.push('controls-RangeSelectable__item', 'controls-MonthView__selectableItem');
            if (scope.enabled && scope.selectionEnabled) {
               css.push('controls-MonthView__hover-selectableItem');
            }
            if (scope.selected) {
               css.push('controls-MonthView__item-selected');
            }

            if (scope.selectedUnfinishedStart) {
               css.push('controls-MonthView__item-selectedStart-unfinished');
            }
            if (scope.selectedUnfinishedEnd) {
               css.push('controls-MonthView__item-selectedEnd-unfinished');
            }
            if (scope.selected && scope.selectedStart && !scope.selectedUnfinishedStart) {
               css.push('controls-MonthView__item-selectedStart');
            }
            if (scope.selected && scope.selectedEnd && (!scope.selectionProcessing || (scope.selectedEnd !== scope.selectedStart && !scope.selectedUnfinishedEnd))) {
               css.push('controls-MonthView__item-selectedEnd');
            }
            if (scope.selectedInner) {
               css.push('controls-MonthView__item-selectedInner');
            }

            // }

            if (scope.today) {
               css.push('controls-MonthView__today');
            }
            css.push('controls-MonthView__dayNumber' + scope.day);
         }

         css.push(scope.isCalendar ? 'controls-MonthView__currentMonthDay' : 'controls-MonthView__' + scope.month);

         if (scope.weekend) {
            css.push('controls-MonthView__weekend');
         } else {
            css.push('controls-MonthView__workday');
         }

         if (scope.firstDayOfMonth) {
            css.push('controls-MonthView__firstDayOfMonth');
         }

         if (scope.lastDayOfMonth) {
            css.push('controls-MonthView__lastDayOfMonth');
         }

         return css.join(' ');
      }

   });

   return ModuleClass;
});
