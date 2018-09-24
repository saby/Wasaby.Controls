define('Controls/Date/PeriodLiteDialog', [
   'Core/Control',
   'Core/core-merge',
   'Core/helpers/Date/format',
   'Core/helpers/Date/getCurrentPeriod',
   'Controls/Date/interface/IPeriodLiteDialog',
   'Controls/Utils/Date',
   'wml!Controls/Date/PeriodLiteDialog/PeriodLiteDialog',
   'wml!Controls/Date/PeriodLiteDialog/Item',
   'wml!Controls/Date/PeriodLiteDialog/ItemFull',
   'wml!Controls/Date/PeriodLiteDialog/ItemMonths',
   'wml!Controls/Date/PeriodLiteDialog/ItemQuarters',
   'wml!Controls/Date/PeriodLiteDialog/ItemWrapper',
   'wml!Controls/Date/PeriodLiteDialog/MonthCaption',
   'css!theme?Controls/Date/PeriodLiteDialog/PeriodLiteDialog'
], function(
   BaseControl,
   coreMerge,
   formatDate,
   getCurrentPeriod,
   IPeriodSimpleDialog,
   dateUtils,
   componentTmpl,
   itemTmpl,
   itemFullTmpl,
   itemMonthsTmpl,
   itemQuartersTmpl,
   ItemWrapper,
   monthCaptionTemplate
) {

   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Date/PeriodLiteDialog
    * @extends Core/Control
    * @mixes Controls/Date/interface/IPeriodLiteDialog
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Date/PeriodLiteDialog
    *
    */

   var _private = {

      _getDefaultYear: function(options) {

         var start = options.startValue,
            currentYear = (new Date()).getFullYear(),
            startValueYear;

         if (!options.chooseYears || options.chooseHalfyears || options.chooseQuarters || options.chooseMonths) {
            return start ? start.getFullYear() : undefined;
         }

         startValueYear = start ? start.getFullYear() : null;

         if (!startValueYear) {
            return currentYear;
         }

         if (startValueYear >= currentYear) {
            return startValueYear;
         } else if (currentYear - startValueYear >= 5) {
            return startValueYear + 4;
         } else {
            return currentYear;
         }
      },

      getQuarterData: function(quarterNumber, monthName, monthIndex) {
         return {
            number: quarterNumber * 3 + monthIndex,
            name: monthName
         };
      },
      getYearModel: function(year) {
         return [{
            name: 'I',
            quarters: [{
               name: 'I',
               months: [ new Date(year, 0, 1), new Date(year, 1, 1), new Date(year, 2, 1) ],
               number: 0
            }, {
               name: 'II',
               months: [ new Date(year, 3, 1), new Date(year, 4, 1), new Date(year, 5, 1) ],
               number: 1
            }]
         }, {
            name: 'II',
            quarters: [{
               name: 'III',
               months: [ new Date(year, 6, 1), new Date(year, 7, 1), new Date(year, 8, 1) ],
               number: 2
            }, {
               name: 'IV',
               months: [ new Date(year, 9, 1), new Date(year, 10, 1), new Date(year, 11, 1) ],
               number: 3
            }]
         }];
      }
   };

   var Component = BaseControl.extend({
      _template: componentTmpl,
      _defaultItemTemplate: itemTmpl,
      _itemTmplByType: null,
      _monthCaptionTemplate: null,

      _year: null,

      _yearHovered: false,
      _halfyearHovered: false,

      _formatDate: formatDate,

      // constructor: function() {
      //    this._dayFormatter = this._dayFormatter.bind(this);
      //    Component.superclass.constructor.apply(this, arguments);
      // },

      _beforeMount: function(options) {

         this._monthCaptionTemplate = monthCaptionTemplate;

         if (options.chooseHalfyears && options.chooseQuarters && options.chooseMonths) {
            this._itemTmplByType = itemFullTmpl;
         } else if (options.chooseMonths) {
            this._itemTmplByType = itemMonthsTmpl;
         } else if (options.chooseQuarters) {
            this._itemTmplByType = itemQuartersTmpl;
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

         this._caption = options.captionFormatter(options.startValue, options.endValue, options.emptyCaption);

         this._months = _private.getYearModel(this._year);
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
         this._months = _private.getYearModel(this._year);
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
         period = getCurrentPeriod(periodType);
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
         this._notify('sendResult', [month, dateUtils.getEndOfMonth(month)], { bubbling: true });
      },

      _getWidthCssClass: function() {
         if (this._options.chooseHalfyears) {
            return 'controls-PeriodLiteDialog__width-big';
         }
         if (this._options.chooseQuarters || this._options.chooseMonths) {
            return 'controls-PeriodLiteDialog__width-medium';
         }
         return '';
      },

      _getYearCssClasses: function() {
         var css = [];
         if (this._options.chooseYears) {
            css.push('controls-PeriodLiteDialog__year-clickable');
         }
         if (this._options.chooseMonths && this._options.chooseQuarters && this._options.chooseHalfyears) {
            css.push('controls-PeriodLiteDialog__year-medium');
         }
         return css.join(' ');
      }

   });

   Component._private = _private;

   Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

   Component.getDefaultOptions = function() {
      return coreMerge({
         itemTemplate: ItemWrapper
      }, IPeriodSimpleDialog.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
   };

   return Component;
});
