define('Controls/Date/PeriodLiteDialog', [
   'Core/Control',
   'Core/core-merge',
   'Core/helpers/Date/getFormattedDateRange',
   'Core/helpers/date-helpers',
   'Core/helpers/i18n/locales',
   'Controls/Date/interface/IPeriodSimpleDialog',
   'tmpl!Controls/Date/PeriodLiteDialog/PeriodLiteDialog',
   'tmpl!Controls/Date/PeriodLiteDialog/Item',
   'tmpl!Controls/Date/PeriodLiteDialog/ItemMonths',
   'tmpl!Controls/Date/PeriodLiteDialog/ItemQuarters',
   'css!Controls/Date/PeriodLiteDialog/PeriodLiteDialog'
], function(
   BaseControl,
   coreMerge,
   getFormattedDateRange,
   dateHelpers,
   locales,
   IPeriodSimpleDialog,
   componentTmpl,
   itemTmpl,
   itemTmplMonths,
   itemTmplQuarters
) {

   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Calendar/DateRangeLinkView
    * @extends Core/Control
    * @mixes Controls/Date/interface/IPeriodSimpleDialog
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Date/PeriodSimpleDialog
    *
    */

   var _private = {

      _getDefaultYear: function(options) {

         var start = options.startValue,
            currentYear, startValueYear;

         if (!options.showYears || options.showHalfyears || options.showQuarters || options.showMonths) {
            return start ? start.getFullYear() : undefined;
         }

         startValueYear = start ? start.getFullYear() : null;

         if (!startValueYear) {
            return (new Date()).getFullYear();
         }

         currentYear = (new Date()).getFullYear();

         if (startValueYear >= currentYear) {
            return startValueYear;
         } else if (currentYear - startValueYear >= 5) {
            return startValueYear + 4;
         } else {
            return currentYear;
         }
      },

      _getCaption: function(startValue, endValue, emptyCaption) {
         return getFormattedDateRange(
            startValue,
            endValue,
            {
               contractToMonth: true,
               fullNameOfMonth: true,
               contractToQuarter: true,
               contractToHalfYear: true,
               emptyPeriodTitle: emptyCaption
            }
         );
      },
      getQuarterData: function(quarterNumber, monthName, monthIndex) {
         return {
            number: quarterNumber * 3 + monthIndex,
            name: monthName
         };
      },
      getYearModel: function() {
         var longMonths = locales.current.config.longMonths;
         return [{
            name: 'I',
            quarters: [{
               name: 'I',
               months: longMonths.slice(0, 3).map(_private.getQuarterData.bind(this, 0)),
               number: 0
            }, {
               name: 'II',
               months: longMonths.slice(3, 6).map(_private.getQuarterData.bind(this, 1)),
               number: 1
            }]
         }, {
            name: 'II',
            quarters: [{
               name: 'III',
               months: longMonths.slice(6, 9).map(_private.getQuarterData.bind(this, 2)),
               number: 2
            }, {
               name: 'IV',
               months: longMonths.slice(9).map(_private.getQuarterData.bind(this, 3)),
               number: 3
            }]
         }];
      }
   };

   var Component = BaseControl.extend({
      _template: componentTmpl,
      _itemTmpl: null,

      _year: null,

      _yearHovered: false,
      _halfyearHovered: false,

      // constructor: function() {
      //    this._dayFormatter = this._dayFormatter.bind(this);
      //    Component.superclass.constructor.apply(this, arguments);
      // },

      _beforeMount: function(options) {

         if (options.chooseHalfyears && options.chooseQuarters && options.chooseMonths) {
            this._itemTmpl = itemTmpl;
         } else if (options.chooseMonths) {
            this._itemTmpl = itemTmplMonths;
         } else if (options.chooseQuarters) {
            this._itemTmpl = itemTmplQuarters;
         }

         if (options.year instanceof Date) {
            this._year = options.year.getFullYear();
         } else {
            this._year = _private._getDefaultYear(options);
            if (!this._year) {
               this._year = (new Date()).getFullYear();
            }
         }
         this._emptyCaption = options.emptyCaption;
         if (!this._emptyCaption) {
            if (options.chooseMonths && (options.chooseQuarters || options.chooseHalfyears)) {
               this._emptyCaption = rk('Период не указан');
            } else {
               this._emptyCaption = rk('Не указан');
            }
         }

         this._caption = _private._getCaption(options.startValue, options.endValue, options.emptyCaption);

         this._months = _private.getYearModel();
      },

      _beforeUpdate: function(options) {
         // this._caption = _private._getCaption(options);
      },

      /**
       * Sets the current year
       * @param year
       */
      setYear: function(year) {
         this._year = year;
         this._notify('yearChanged', [year]);
      },

      _onYearMouseEnter: function() {
         this._yearHovered = true;
      },

      _onYearMouseLeave: function() {
         this._yearHovered = false;
      },

      _onPrevYearBtnClick: function() {
         var year = this._year - 1;
         this.setYear(year);
      },

      _onNextYearBtnClick: function() {
         var year = this._year + 1;
         this.setYear(year);
      },

      _onHomeClick: function() {
         var periodType = 'year', period;
         if (this._options.chooseMonths) {
            periodType = 'month';
         } else if (this._options.chooseQuarters) {
            periodType = 'quarter';
         } else if (this._options.chooseHalfyears) {
            periodType = 'halfyear';
         }
         period = dateHelpers.getCurrentPeriod(periodType);
         this.setYear((new Date()).getFullYear());
         this._notify('sendResult', period, { bubbling: true });
      },

      _onWheel: function(event) {
         if (event.nativeEvent.wheelDelta > 0) {
            this._onNextYearBtnClick();
         } else {
            this._onPrevYearBtnClick();
         }
         event.preventDefault();
      },

      _onQuarterMouseEnter: function(event, quarter) {
         this._quarterHovered = quarter;
      },

      _onQuarterMouseLeave: function() {
         this._quarterHovered = null;
      },

      _onHalfYearMouseEnter: function(event, halfyear) {
         this._halfyearHovered = halfyear;
      },

      _onHalfYearMouseLeave: function() {
         this._halfyearHovered = null;
      },

      _onHeaderClick: function() {
         this._notify('close', [], {bubbling: true});
      },

      _onYearClick: function(event, year) {
         this._notify('sendResult', [new Date(year, 0, 1), new Date(year, 11, 31)], { bubbling: true });
      },

      _onHalfYearClick: function(event, halfYear) {
         var start = new Date(this._year, halfYear * 6, 1),
            end = new Date(this._year, (halfYear + 1) * 6, 0);
         this._notify('sendResult', [start, end], { bubbling: true });
      },

      _onQuarterClick: function(event, quarter) {
         var start = new Date(this._year, quarter * 3, 1),
            end = new Date(this._year, (quarter + 1) * 3, 0);
         this._notify('sendResult', [start, end], { bubbling: true });
      },

      _onMonthClick: function(event, month) {
         var start = new Date(this._year, month, 1),
            end = new Date(this._year, month + 1, 0);
         this._notify('sendResult', [start, end], { bubbling: true });
      }

   });

   Component._private = _private;

   Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

   Component.getDefaultOptions = function() {
      return coreMerge({}, IPeriodSimpleDialog.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
   };

   return Component;
});
