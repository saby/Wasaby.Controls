define('Controls/Date/PeriodDialog/MonthsRangeItem', [
   'Core/Control',
   'Core/core-merge',
   'Core/helpers/Date/format',
   'Core/helpers/Object/isEmpty',
   'Controls/Date/Mixin/EventProxy',
   'Controls/Date/Month/Model',
   'Controls/Date/Utils/RangeSelection',
   'Controls/Utils/Date',
   'wml!Controls/Date/PeriodDialog/MonthsRangeItem'
], function(
   BaseControl,
   coreMerge,
   formatDate,
   isEmpty,
   EventProxyMixin,
   modelViewModel,
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

   var _private = {
      },
      SELECTION_VEIW_TYPES = {
         days: 'days',
         months: 'months'
      };

   var Component = BaseControl.extend([EventProxyMixin], {
      _template: componentTmpl,
      _monthViewModel: modelViewModel,

      _SELECTION_VEIW_TYPES: SELECTION_VEIW_TYPES,

      _yearStructure: [{
         name: 'I',
         startMonth: 0,
         quarters: [{
            name: 'I', startMonth: 0
         }, {
            name: 'II', startMonth: 3
         }]
      }, {
         name: 'II',
         startMonth: 6,
         quarters: [{
            name: 'III', startMonth: 6
         }, {
            name: 'IV', startMonth: 9
         }]
      }],

      _formatDate: formatDate,

      _quarterSelectionEnabled: true,
      _monthsSelectionEnabled: true,
      _halfyearSelectionEnabled: true,
      _yearSelectionEnabled: true,

      _quarterHovered: null,
      _halfYearHovered: null,

      _selectionViewType: null,

      _monthClickable: true,

      // constructor: function() {
      //    this._dayFormatter = this._dayFormatter.bind(this);
      //    Component.superclass.constructor.apply(this, arguments);
      // },

      _beforeMount: function(options) {
         this._selectionViewType = options.selectionViewType;
         if (options.selectionType === 'single') {
            this._monthsSelectionEnabled = false;
            this._quarterSelectionEnabled = false;
            this._halfyearSelectionEnabled = false;
            this._yearSelectionEnabled = false;
         } else if (options.quantum && !isEmpty(options.quantum)) {
            this._monthsSelectionEnabled = 'months' in options.quantum;
            this._quarterSelectionEnabled = 'quarters' in options.quantum;
            this._halfyearSelectionEnabled = 'halfyears' in options.quantum;
            this._yearSelectionEnabled = 'years' in options.quantum;
         }
      },

      _beforeUpdate: function(options) {
         if (this._options.selectionViewType !== options.selectionViewType) {
            this._selectionViewType = options.selectionViewType;
         }
      },

      _onQuarterClick: function(e, date) {
         if (this._quarterSelectionEnabled) {
            this._selectionViewType = SELECTION_VEIW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);
            this._notify('fixedPeriodClick', [date, dateUtils.getEndOfQuarter(date)]);
         }
      },

      _onQuarterMouseEnter: function(e, index) {
         if (this._quarterSelectionEnabled) {
            this._quarterHovered = index;
         }
      },

      _onQuarterMouseLeave: function() {
         if (this._quarterSelectionEnabled) {
            this._quarterHovered = null;
         }
      },

      _onHalfYearClick: function(e, date) {
         if (this._halfyearSelectionEnabled) {
            this._selectionViewType = SELECTION_VEIW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);
            this._notify('fixedPeriodClick', [date, dateUtils.getEndOfHalfyear(date)]);
         }
      },

      _onHalfYearMouseEnter: function(e, index) {
         if (this._halfyearSelectionEnabled) {
            this._halfYearHovered = index;
         }
      },

      _onHalfYearMouseLeave: function() {
         if (this._halfyearSelectionEnabled) {
            this._halfYearHovered = null;
         }
      },

      _onMonthTitleClick: function(e, date) {
         if (this._monthsSelectionEnabled && !this._options.selectionProcessing) {
            this._selectionViewType = SELECTION_VEIW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);

            this._notify('itemClick', [date]);
         }
      },

      _onMonthTitleMouseEnter: function(e, date) {
         if (!this._options.selectionProcessing) {
            this._notify('itemMouseEnter', [date]);
         }
      },

      _onMonthTitleMouseLeave: function(e, date) {
         if (!this._options.selectionProcessing) {
            this._notify('itemMouseLeave', [date]);
         }
      },

      _onMonthBodyClick: function(e, date) {
         if (!this._options.selectionProcessing) {
            this._notify('monthClick', [date]);
         }
      },

      _onMonthClick: function(e, date) {
         if (this._options.selectionProcessing) {
            this._notify('itemClick', [date]);
         }
      },

      _onMonthMouseEnter: function(e, date) {
         if (this._options.selectionProcessing) {
            this._notify('itemMouseEnter', [date]);
         }
      },

      _onMonthMouseLeave: function(e, date) {
         if (this._options.selectionProcessing) {
            this._notify('itemMouseLeave', [date]);
         }
      },

      _prepareItemClass: function(itemValue) {
         var css = [],
            start = this._options.startValue,
            end = this._options.endValue;

         if (rangeSelectionUtils.isSelected(itemValue, start, end, this._options.selectionProcessing,
            this._options.selectionBaseValue, this._options.selectionHoveredValue)) {
            css.push('controls-PeriodDialog-MonthsRange__item-selected');
         } else {
            css.push('controls-PeriodDialog-MonthsRange__item');
         }

         if (this._selectionViewType === SELECTION_VEIW_TYPES.months) {
            css.push(rangeSelectionUtils.prepareSelectionClass(
               itemValue,
               start,
               end,
               this._options.selectionProcessing,
               this._options.selectionBaseValue,
               this._options.selectionHoveredValue,
               this._options.hoveredStartValue,
               this._options.hoveredEndValue,
               { periodQuantum: rangeSelectionUtils.PERIOD_QUANTUM.month }
            ));
         }

         css.push(rangeSelectionUtils.prepareHoveredClass(
            itemValue,
            this._options.hoveredStartValue,
            this._options.hoveredEndValue,
            { cssPrefix: 'controls-PeriodDialog-MonthsRange__' }
         ));

         return css.join(' ');
      },

   });

   Component._private = _private;

   Component.SELECTION_VEIW_TYPES = SELECTION_VEIW_TYPES;

   Component.getDefaultOptions = function() {
      return coreMerge({
         selectionViewType: SELECTION_VEIW_TYPES.days
      }, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
   };

   // Component.getOptionTypes = function() {
   //    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
   // };

   return Component;
});
