define('js!SBIS3.CONTROLS.DateRangeChoose',[
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.DateRangeChoose',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeMixin',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.Link'
], function (CompoundControl, dotTplFn, RangeMixin, DateRangeMixin, DateUtil) {
   'use strict';

   var DateRangeChoose = CompoundControl.extend([DateRangeMixin, RangeMixin], {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            year: null,

            showMonths: true,
            showQuarters: true,
            showHalfyears: true,

            checkedMonthStart: null,
            checkedMonthEnd: null,

            _months: [
               {
                  name: 'I',
                  quarters: [
                     {name: 'I', months: ['Январь', 'Февраль', 'Март']},
                     {name: 'II', months: ['Апрель', 'Май', 'Июнь']}
                  ]

               },
               {
                  name: 'II',
                  quarters: [
                     {name: 'III', months: ['Июль', 'Август', 'Сентябрь']},
                     {name: 'VI', months: ['Октябрь', 'Ноябрь', 'Декабрь']}
                  ]
               }
            ]
         },
         _cssDateRangeChoose: {
            selected: 'controls-DateRangeChoose__selected',

            currentValue: 'controls-DateRangeChoose__currentValue',

            yearButton: 'controls-DateRangeChoose__year',

            showMonths: 'controls-DateRangeChoose__showMonths',
            showQuarters: 'controls-DateRangeChoose__showQuarters',
            showHalfYears: 'controls-DateRangeChoose__showHalfYears',
            showCheckboxes: 'controls-DateRangeChoose__showCheckboxes',

            halfYear: 'controls-DateRangeChoose__halfYear',
            halfYearCaption: 'controls-DateRangeChoose__halfYear-caption',

            quarter: 'controls-DateRangeChoose__quarter',
            quarterCaption: 'controls-DateRangeChoose__quarter-caption',

            month: 'controls-DateRangeChoose__month',
            monthCaption: 'controls-DateRangeChoose__month-caption',

            checkbox: 'controls-DateRangeChoose__checkBox',

            yearsModeWrapper: 'controls-DateRangeChoose__yearsMode-wrapper'
         },
         _RANGE_ID_FIELD: 'data-range-id'
      },

      $constructor: function () {
         this._publish('onChoose');
         this._options.checkedMonthStart = this._normalizeDate(this._options.checkedMonthStart);
         this._options.checkedMonthEnd = this._normalizeDate(this._options.checkedMonthEnd);
      },

      init: function () {
         var self = this,
            container = this.getContainer();

         DateRangeChoose.superclass.init.call(this);

         this._updateMode();

         if (!this.getYear()) {
            this.setYear((new Date()).getFullYear());
         } else {
            this._updateYearView();
         }

         if (this._options.checkedMonthStart || this._options.checkedMonthEnd) {
            container.addClass(this._cssDateRangeChoose.showCheckboxes);
         }

         container.find(['.', this._cssDateRangeChoose.currentValue].join('')).click(this._onHeaderClick.bind(this));

         // TODO: вынести в отдельные функции
         container.find(['.', this._cssDateRangeChoose.halfYearCaption].join('')).mouseenter(
            function (e) {
               $(e.target).closest(['.', this._cssDateRangeChoose.halfYear].join('')).addClass(this._cssDateRangeChoose.selected);
            }.bind(this)
         ).mouseleave(
            function (e) {
               $(e.target).closest(['.', this._cssDateRangeChoose.halfYear].join('')).removeClass(this._cssDateRangeChoose.selected);
            }.bind(this)
         );

         container.find(['.', this._cssDateRangeChoose.quarterCaption].join('')).mouseenter(
            function (e) {
               $(e.target).closest(['.', this._cssDateRangeChoose.quarter].join('')).addClass(this._cssDateRangeChoose.selected);
            }.bind(this)
         ).mouseleave(
            function (e) {
               $(e.target).closest(['.', this._cssDateRangeChoose.quarter].join('')).removeClass(this._cssDateRangeChoose.selected);
            }.bind(this)
         );

         container.find(['.', this._cssDateRangeChoose.yearButton].join('')).click(this._onYearClick.bind(this));

         container.find('.controls-DateRangeChoose__year-prev').click(this._onPrevYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__year-next').click(this._onNextYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__yearsMode-prev').click(this._onPrevYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__yearsMode-next').click(this._onNextYearBtnClick.bind(this));

         container.find(['.', this._cssDateRangeChoose.halfYearCaption].join('')).click(this._onHalfYearClick.bind(this));
         container.find(['.', this._cssDateRangeChoose.quarterCaption].join('')).click(this._onQuarterClick.bind(this));
         container.find(['.', this._cssDateRangeChoose.monthCaption].join('')).click(this._onMonthClick.bind(this));

         container.find(['.', this._cssDateRangeChoose.yearsModeWrapper, '>*'].join('')).click(this._onYearsModeWrapperClick.bind(this));

         this.getChildControlByName('HomeButton').subscribe('onActivated', this._onHomeClick.bind(this));

         this.subscribe('onRangeChange', this._onRangeChanged.bind(this));
         this._updateRangeTitle();
         this._updateCheckMarks();
         this._updateYears();
      },

      /**
       * Устнавливает текущий год
       * @param year
       */
      setYear: function (year) {
         this._options.year = year;
         this._updateYearView();
         this._updateCheckMarks();
      },
      /**
       * Возвращает текущий год
       * @returns {Number}
       */
      getYear: function () {
         return this._options.year;
      },

      _updateYearView: function () {
         this.getContainer().find(['.', this._cssDateRangeChoose.yearButton].join('')).text(this.getYear());
      },

      _onHomeClick: function () {
         var periodType = 'year', period;
         if (this._options.showMonths) {
            periodType = 'month';
         } else if (this._options.showQuarters) {
            periodType = 'quarter';
         } else if (this._options.showHalfyears) {
            periodType = 'halfyear'
         }
         period = $ws.helpers.getCurrentPeriod(periodType)
         this.setRange(period[0], period[1]);
         this.setYear((new Date()).getFullYear());
         this._notify('onChoose', period[0], period[1]);
      },

      _onRangeChanged: function (e, start, end) {
         this._updateRangeTitle();
      },

      _onHeaderClick: function () {
         this._notify('onChoose', this.getStartValue(), this.getEndValue());
      },

      _onYearClick: function () {
         var year = this.getYear(),
            start = new Date(year, 0, 1),
            end = new Date(year, 11, 31);
         this.setRange(start, end);
         this._notify('onChoose', start, end);
      },

      _onPrevYearBtnClick: function () {
         var year = this.getYear() - 1;
         this.setYear(year);
         this._updateYears();
      },

      _onNextYearBtnClick: function () {
         var year = this.getYear() + 1;
         this.setYear(year);
         this._updateYears();
      },

      _onHalfYearClick: function (e) {
         var rangeId = parseInt($(e.target).closest(['.', this._cssDateRangeChoose.halfYear].join('')).attr(this._RANGE_ID_FIELD), 10),
            year = this.getYear(),
            start = new Date(year, rangeId * 6, 1),
            end = new Date(year, (rangeId + 1)*6, 0);
         this.setRange(start, end);
         this._notify('onChoose', start, end);
      },

      _onQuarterClick: function (e) {
         var rangeId = parseInt($(e.target).closest(['.', this._cssDateRangeChoose.quarter].join('')).attr(this._RANGE_ID_FIELD), 10),
            year = this.getYear(),
            start = new Date(year, rangeId * 3, 1),
            end = new Date(year, (rangeId + 1)*3, 0);
         this.setRange(start, end);
         this._notify('onChoose', start, end);
      },

      _onMonthClick: function (e) {
         var rangeId =  parseInt($(e.target).closest(['.', this._cssDateRangeChoose.month].join('')).attr(this._RANGE_ID_FIELD), 10),
            year = this.getYear(),
            start = new Date(year, rangeId, 1),
            end = new Date(year, rangeId + 1, 0);
         this.setRange(start, end);
         this._notify('onChoose', start, end);
      },

      _updateMode: function () {
         var css = [];
         if (this._options.showMonths) {
            css.push(this._cssDateRangeChoose.showMonths);
         }
         if (this._options.showQuarters) {
            css.push(this._cssDateRangeChoose.showQuarters);
         }
         if (this._options.showHalfyears) {
            css.push(this._cssDateRangeChoose.showHalfYears);
         }
         this.getContainer().addClass(css.join(' '))
      },

      _updateRangeTitle: function () {
         this.getContainer().find(
            ['.', this._cssDateRangeChoose.currentValue].join('')
         ).text(
            $ws.helpers.getFormattedDateRange(this.getStartValue(), this.getEndValue(), {shortYear: true, contractToHalfYear: true, contractToQuarter: true})
         );
      },

      _updateCheckMarks: function () {
         var self = this,
            checkedMonthStart = this._options.checkedMonthStart,
            checkedMonthEnd = this._options.checkedMonthEnd,
            year = this.getYear(),
            startIndex, endIndex,
            containers;

         if (!checkedMonthStart && !checkedMonthEnd) {
            return;
         }

         checkedMonthStart = checkedMonthStart? checkedMonthStart.getMonth(): 0;
         checkedMonthEnd = checkedMonthEnd? checkedMonthEnd.getMonth(): 11;
         if (!this._options.showMonths) {
            containers = this.getContainer().find(['.', this._cssDateRangeChoose.quarter].join(''));
            startIndex = Math.floor(checkedMonthStart/4);
            endIndex = Math.floor(checkedMonthEnd/4);
         } else {
            containers = this.getContainer().find(['.', this._cssDateRangeChoose.month].join(''));
            startIndex = checkedMonthStart;
            endIndex = checkedMonthEnd;
         }

         containers.each(function (index) {
            if (index >= startIndex && index <= endIndex) {
               $(this).find(['>.', self._cssDateRangeChoose.checkbox].join('')).removeClass('icon-disabled').addClass('icon-done');
            } else {
               $(this).find(['>.', self._cssDateRangeChoose.checkbox].join('')).removeClass('icon-done').addClass('icon-disabled');
            }
         });
      },

      // Режим года
      _onYearsModeWrapperClick: function (e) {
         var year = this.getYear(),
            start = new Date(year + parseInt($(e.target).attr('data-range-id'), 10), 0, 1),
            end = new Date(year + parseInt($(e.target).attr('data-range-id'), 10), 11, 31);
         this.setRange(start, end);
         this._notify('onChoose', start, end);
      },

      _updateYears: function () {
         var self = this,
            currentYear = (new Date()).getFullYear(),
            year, containers;
         if (this._options.showMonths || this._options.showQuarters || this._options.showHalfyears) {
            return;
         }
         containers = this.getContainer().find(['.', this._cssDateRangeChoose.yearsModeWrapper, '>*'].join(''));
         containers.removeClass('controls-DateRangeChoose__yearsMode-bold');
         containers.each(function (index) {
            year = self.getYear() + index;
            if (currentYear === year) {
               $(this).addClass('controls-DateRangeChoose__yearsMode-bold');
            }
            $(this).text(year);
         });
      }
   });

   return DateRangeChoose;
});
