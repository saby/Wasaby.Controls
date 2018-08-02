define('Controls/Date/PeriodDialog', [
   'Core/Control',
   'Core/core-merge',
   'Core/helpers/Date/getFormattedDateRange',
   'Core/helpers/date-helpers',
   'Core/helpers/i18n/locales',
   'Controls/Date/interface/IRangeSelectable',
   'Controls/Date/Mixin/EventProxy',
   'Controls/Date/model/DateRange',
   'Controls/Date/PeriodDialog/MonthsRange',
   'Controls/Date/PeriodDialog/Utils',
   'Controls/Utils/Date',
   'tmpl!Controls/Date/PeriodDialog/PeriodDialog',
   'tmpl!Controls/Date/PeriodDialog/header',
   'css!Controls/Date/PeriodDialog/PeriodDialog'
], function(
   BaseControl,
   coreMerge,
   getFormattedDateRange,
   dateHelpers,
   locales,
   IRangeSelectable,
   EventProxyMixin,
   DateRangeModel,
   MonthsRange,
   periodDialogUtils,
   dateUtils,
   componentTmpl,
   headerTmpl
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
         fixedPeriodClick: function(self, start, end) {
            self._rangeModel.startValue = start;
            self._rangeModel.endValue = end;
            self._headerRangeModel.startValue = start;
            self._headerRangeModel.endValue = end;
            self._monthRangeSelectionProcessing = false;
         },
         selectionChanged: function(self, start, end) {
            self._headerRangeModel.startValue = start;
            self._headerRangeModel.endValue = end;
         },
         rangeChanged: function(self, start, end) {
            self._rangeModel.startValue = start;
            self._rangeModel.endValue = end;
            self._headerRangeModel.startValue = start;
            self._headerRangeModel.endValue = end;
         }
      },
      HEADER_TYPES = {
         link: 'link',
         input: 'input'
      },
      STATES = {
         year: 'year',
         month: 'month'
      };

   var Component = BaseControl.extend([EventProxyMixin], {
      _template: componentTmpl,
      _headerTmpl: headerTmpl,

      _rangeModel: null,
      _headerRangeModel: null,
      _yearRangeModel: null,

      _displayedDate: null,

      _HEADER_TYPES: HEADER_TYPES,
      _headerType: HEADER_TYPES.link,

      _homeButtonVisible: true,

      _STATES: STATES,
      _state: STATES.year,

      _monthRangeSelectionViewType: MonthsRange.SELECTION_VEIW_TYPES.days,
      _monthRangeSelectionProcessing: false,

      _dateRangeSelectionProcessing: false,

      _yearStateEnabled: true,
      _monthStateEnabled: true,

      _yearRangeSelectionType: null,

      _beforeMount: function(options) {
         this._displayedDate = dateUtils.getStartOfMonth(new Date(1900, 0));

         this._rangeModel = new DateRangeModel();
         this._rangeModel.update(options);

         this._headerRangeModel = new DateRangeModel();
         this._headerRangeModel.update(options);

         this._yearRangeModel = new DateRangeModel();

         this._monthStateEnabled = periodDialogUtils.isMonthStateEnabled(options);
         this._yearStateEnabled = periodDialogUtils.isYearStateEnabled(options);

         if (!this._yearStateEnabled && this._monthStateEnabled) {
            this._state = STATES.month;
         }

         this._yearRangeSelectionType = options.selectionType;
         this._yearRangeQuantum = {};
         this._monthRangeSelectionType = options.selectionType;
         this._monthRangeQuantum = {};

         if (options.selectionType === 'quantum') {
            if ('years' in options.quantum) {
               this._yearRangeSelectionType = options.selectionType;
               this._yearRangeQuantum = { 'years': options.quantum.years };
            } else {
               this._yearRangeSelectionType = 'disable';
            }
            if ('months' in options.quantum) {
               this._monthRangeSelectionType = options.selectionType;
               this._monthRangeQuantum = { 'months': options.quantum.months };
            } else {
               this._monthRangeSelectionType = 'disable';
            }
         }
      },

      _beforeUpdate: function(options) {
         this._rangeModel.update(options);
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
         this._headerRangeModel.destroy();
         this._yearRangeModel.destroy();
      },

      _toggleState: function() {
         this._state = this._state === STATES.year ? STATES.month : STATES.year;
      },

      _yearsRangeChanged: function(e, start, end) {
         _private.rangeChanged(this, start, end ? dateUtils.getEndOfYear(end) : null);
      },

      _yearsSelectionChanged: function(e, start, end) {
         _private.selectionChanged(this, start, end ? dateUtils.getEndOfYear(end) : null);
      },

      _yearsSelectionStarted: function(e, start, end) {
         this._monthRangeSelectionViewType = MonthsRange.SELECTION_VEIW_TYPES.days;
         this._monthRangeSelectionProcessing = false;
      },

      _monthsRangeChanged: function(e, start, end) {
         _private.rangeChanged(this, start, end ? dateUtils.getEndOfMonth(end) : null);
         this._yearRangeModel.startValue = null;
         this._yearRangeModel.endValue = null;
      },

      _monthsSelectionChanged: function(e, start, end) {
         _private.selectionChanged(this, start, end ? dateUtils.getEndOfMonth(end) : null);
      },

      _monthRangeMonthClick: function(e, date) {
         this._toggleState();

         // TODO: промотать месяца в режиме дней до месяца который выбрали.
      },

      _monthRangeFixedPeriodClick: function(e, start, end) {
         _private.fixedPeriodClick(this, start, end);
      },

      _dateRangeChanged: function(e, start, end) {
         _private.rangeChanged(this, start, end);
         this._monthRangeSelectionProcessing = false;
      },

      _dateRangeSelectionChanged: function(e, start, end) {
         _private.selectionChanged(this, start, end);
      },

      _dateRangeFixedPeriodClick: function(e, start, end) {
         _private.fixedPeriodClick(this, start, end);
      }

   });

   Component._private = _private;

   Component.SELECTION_TYPES = IRangeSelectable.SELECTION_TYPES;

   Component.getDefaultOptions = function() {
      return coreMerge({

         /**
          * @name Controls/Date/PeriodDialog#emptyCaption
          * @cfg {String} Text that is used if the period is not selected
          */
         emptyCaption: rk('Не указан'),

      }, IRangeSelectable.getDefaultOptions());
   };

   // Component.getOptionTypes = function() {
   //    return coreMerge({}, IRangeSelectable.getOptionTypes());
   // };

   return Component;
});
