define('Controls/Date/PeriodDialog/YearsRange', [
   'Core/Control',
   'Controls/Date/model/DateRange',
   'Controls/Date/Utils/RangeSelection',
   'Controls/Utils/Date',
   'wml!Controls/Date/PeriodDialog/YearsRange',
   'css!theme?Controls/Date/Utils/RangeSelection'
], function(
   BaseControl,
   DateRangeModel,
   rangeSelectionUtils,
   dateUtils,
   componentTmpl
) {

   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Date/PeriodDialog
    * @extends Core/Control
    * @mixes Controls/Date/interface/IPeriodDialog
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Date/PeriodLiteDialog
    *
    */

   var Component = BaseControl.extend({
      _template: componentTmpl,

      _year: null,
      _rangeModel: null,
      _model: null,
      _lastYear: null,

      // constructor: function() {
      //    this._dayFormatter = this._dayFormatter.bind(this);
      //    Component.superclass.constructor.apply(this, arguments);
      // },

      _beforeMount: function(options) {
         this._year = options.year ? options.year.getFullYear() : (new Date()).getFullYear();
         this._lastYear = this._year;
         this._rangeModel = new DateRangeModel();
         this._rangeModel.update(options);
         this._updateModel();
      },

      _beforeUpdate: function(options) {
         if (options.year !== this._options.year) {
            this._year = options._year;
         }
         this._rangeModel.update(options);
         this._updateModel();
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
      },

      _onPrevClick: function() {
         this._lastYear--;
      },

      _onNextClick: function() {
         this._lastYear++;
      },

      _onItemClick: function(e, date) {
         this._notify('itemClick', [date]);
      },

      _onItemMouseEnter: function(e, date) {
         this._notify('itemMouseEnter', [date]);
      },

      _onItemMouseLeave: function(e, date) {
         this._notify('itemMouseLeave', [date]);
      },

      _updateModel: function() {
         var items = [],
            buttonsCount = 6,
            currentYear = (new Date()).getFullYear(),
            item, year;

         for (var i = 0; i < buttonsCount; i++) {
            year = this._lastYear - buttonsCount + 1 + i;
            item = {
               caption: year,
               isDisplayed: year === this._year,
               isCurrent: year === currentYear,
               date: new Date(year, 0)
            };

            items.push(item);
         }
         this._model = items;
      },

      _prepareItemClass: function(itemValue) {
         var css = [];
         css.push(rangeSelectionUtils.prepareSelectionClass(
            itemValue,
            this._rangeModel.startValue,
            this._rangeModel.endValue,
            this._options.selectionProcessing,
            this._options.selectionBaseValue,
            this._options.selectionHoveredValue
         ));

         css.push(rangeSelectionUtils.prepareHoveredClass(
            itemValue,
            this._options.hoveredStartValue,
            this._options.hoveredEndValue
         ));

         if (dateUtils.isDatesEqual(itemValue, this._year)) {
            css.push('controls-PeriodDialog-Years__item-displayed');
         } else {
            css.push('controls-PeriodDialog-Years__rangeBtn-regular');
         }
         return css.join(' ');
      }

   });

   // Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

   // Component.getDefaultOptions = function() {
   //    return coreMerge({}, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
   // };

   // Component.getOptionTypes = function() {
   //    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
   // };

   return Component;
});
