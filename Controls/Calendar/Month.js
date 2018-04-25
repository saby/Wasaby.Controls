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
    * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора.
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
      _view: null,
      _monthViewModel: MonthViewModel,

      // constructor: function() {
      //    this._dayFormatter = this._dayFormatter.bind(this);
      //    Component.superclass.constructor.apply(this, arguments);
      // },

      _beforeMount: function(options) {
         this._view = options.view || 'Controls/Calendar/MonthView';

         // this._rangeSelectionController = new DaysRangeSelectionController(options);
         // this.subscribeTo(this._rangeSelectionController, 'rangeChanged', this._onModelRangeChangeHandler.bind(this));
         // this.subscribeTo(this._rangeSelectionController, 'selectionChanged', this._validateWeeksArray.bind(this));

         // this._updateView(options);
         // this._weeksArray = this._getDaysArray();
      },

      // _dayFormatter: function(date) {
      //    var obj = {},
      //       sController = this._children.selectionController,
      //       startDate = sController.getDisplayedStartValue(),
      //       endDate = sController.getDisplayedEndValue();
      //
      //    obj.selectionProcessing = sController.isSelectionProcessing();
      //
      //    obj.selected = (startDate && endDate && date >= startDate && date <= endDate) ||
      //       (startDate && DateUtil.isDatesEqual(date, startDate) && !endDate) ||
      //       (!startDate && endDate && DateUtil.isDatesEqual(date, endDate));
      //
      //    obj.selectedStart = DateUtil.isDatesEqual(date, startDate || endDate);
      //    obj.selectedEnd = DateUtil.isDatesEqual(date, endDate);
      //
      //    obj.selectedInner = (date && startDate && endDate && date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime());
      //
      //    if (this.dayFormatter) {
      //       coreMerge(obj, this.dayFormatter(date) || {});
      //    }
      //
      //    return obj;
      // },

      _onRangeChangedHandler: function() {
         this._notify('startValueChanged', [this._children.selectionController.getStartValue()]);
         this._notify('endValueChanged', [this._children.selectionController.getEndValue()]);
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
