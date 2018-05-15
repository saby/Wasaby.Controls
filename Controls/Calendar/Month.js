define('Controls/Calendar/Month', [
   'Core/Control',
   'Core/core-merge',
   'Core/detection',
   'WS.Data/Type/descriptor',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'tmpl!Controls/Calendar/Month/Month',
   'Controls/Calendar/interface/IMonth',
   'Controls/Calendar/Month/Model',
   'i18n!SBIS3.CONTROLS/Calendar',
   'css!SBIS3.CONTROLS/Date/MonthView/MonthView'
], function(
   BaseControl,
   coreMerge,
   detection,
   types,
   DateUtil,
   monthTmpl,
   IMonth,
   MonthViewModel
) {

   'use strict';

   /**
    * Календарь отображающий 1 месяц.
    * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора периода с помощью мыши.
    * 
    * @class Controls/Calendar/Month
    * @extends Core/Control
    * @mixes Controls/Calendar/interface/IMonth
    * @mixes Controls/Calendar/interface/IRangeSelectable
    * @mixes Controls/Calendar/interface/IDateRangeSelectable
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Calendar/Month
    *
    */

   var Component = BaseControl.extend({
      _template: monthTmpl,
      _monthViewModel: MonthViewModel,

      // constructor: function() {
      //    this._dayFormatter = this._dayFormatter.bind(this);
      //    Component.superclass.constructor.apply(this, arguments);
      // },

      // _beforeMount: function(options) {
      //    this._view = options.view || 'Controls/Calendar/MonthView';
      // },

      _onRangeChangedHandler: function(event, startValue, endValue) {
         this._notify('startValueChanged', [startValue]);
         this._notify('endValueChanged', [endValue]);
      }

      // _startValueChangedHandler: function(event, value) {
      //    this._notify('startValueChanged', [value]);
      // },
      //
      // _endValueChangedHandler: function(event, value) {
      //    this._notify('endValueChanged', [value]);
      // }

   });

   Component.getDefaultOptions = function() {
      return coreMerge({}, IMonth.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IMonth.getOptionTypes());
   };

   return Component;
});
