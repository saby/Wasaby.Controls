/* global define */
define('Controls/Calendar/Month/Model', [
   'Core/core-merge',
   'Controls/Calendar/MonthView/MonthViewModel',
   'SBIS3.CONTROLS/Utils/DateUtil'
], function(
   coreMerge,
   MonthViewModel,
   DateUtil
) {
   'use strict';

   /**
    * Модель для представления месяца с поддержкой выделения.
    * @class Controls/Calendar/Month/MonthModel
    * @author Миронов А.Ю.
    */

   var ModuleClass = MonthViewModel.extend({

      _normalizeState: function(state) {
         var nState = ModuleClass.superclass._normalizeState.apply(this, arguments);
         nState.selectionProcessing = state.selectionProcessing;
         nState.startValue = DateUtil.normalizeDate(state.startValue);
         nState.endValue = DateUtil.normalizeDate(state.endValue);
         return nState;
      },

      _isStateChanged: function(state) {
         var isChanged = ModuleClass.superclass._isStateChanged.apply(this, arguments);
         return isChanged ||
            state.selectionProcessing !== this._state.selectionProcessing ||
            !DateUtil.isDatesEqual(state.startValue, this._state.startValue) ||
            !DateUtil.isDatesEqual(state.endValue, this._state.endValue);
      },

      _getDayObject: function(date, state) {
         state = state || this._state;

         var obj = ModuleClass.superclass._getDayObject.apply(this, arguments),
            startDate = state.startValue,
            endDate = state.endValue;

         obj.selectionProcessing = state.selectionProcessing;

         obj.selected = (startDate && endDate && date >= startDate && date <= endDate) ||
            (startDate && DateUtil.isDatesEqual(date, startDate) && !endDate) ||
            (!startDate && endDate && DateUtil.isDatesEqual(date, endDate));

         obj.selectedStart = DateUtil.isDatesEqual(date, startDate || endDate);
         obj.selectedEnd = DateUtil.isDatesEqual(date, endDate);

         obj.selectedInner = (date && startDate && endDate && date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime());

         return obj;
      }

   });

   return ModuleClass;
});
