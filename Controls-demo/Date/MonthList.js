define('Controls-demo/Date/MonthList', [
   'Core/Control',
   'Types/formatter',
   'Controls-demo/Date/MonthListSource',
   'wml!Controls-demo/Date/MonthList',
   'wml!Controls-demo/Date/MonthListDay',
   'css!Controls-demo/Date/MonthList'
], function(
   BaseControl,
   formatter,
   MonthListSource,
   template,
   dayTemplate
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _dayTemplate: dayTemplate,
      _startValue: new Date(1900, 0, 1),
      _endValue: new Date(1900, 0, 31),
      _month: new Date(2018, 0, 1),
      _selectionProcessing: false,
      _selectionHoveredValue: null,
      _selectionBaseValue: null,
      _source: null,

      _yearHeader: null,
      _monthHeader: null,

      _formatter: formatter,

      _beforeMount: function() {
         this._source = new MonthListSource();
         this._updateYearHeader(this._month);
         this._updateMonthHeader(this._month);
      },

      _yearPositionChangedHandler: function(event, date) {
         this._updateYearHeader(date);
      },

      _updateYearHeader: function(date) {
         this._yearHeader = formatter.date(date, 'YYYY');
      },

      _monthPositionChangedHandler: function(event, date) {
         this._updateMonthHeader(date);
      },

      _updateMonthHeader: function(date) {
         this._monthHeader = this._formatMonth(date);
      },

      _formatMonth: function(date) {
         return date ? formatter.date(date, formatter.date.FULL_MONTH) : '';
      }
   });
   return ModuleClass;
});
