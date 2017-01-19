define('js!SBIS3.CONTROLS.DateRangeChoose',[
   "Core/Deferred",
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CORE.CompoundControl",
   "tmpl!SBIS3.CONTROLS.DateRangeChoose",
   "js!SBIS3.CONTROLS.RangeMixin",
   "js!SBIS3.CONTROLS.DateRangeMixin",
   "js!SBIS3.CONTROLS.Utils.DateUtil",
   "Core/core-instance",
   "Core/helpers/event-helpers",
   "Core/helpers/date-helpers",
   "js!SBIS3.CONTROLS.IconButton",
   "js!SBIS3.CONTROLS.Link"
], function ( Deferred, IoC, ConsoleLogger,CompoundControl, dotTplFn, RangeMixin, DateRangeMixin, DateUtil, cInstance, eHelpers, dateHelpers) {
   'use strict';

   var DateRangeChoose = CompoundControl.extend([RangeMixin, DateRangeMixin], {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            year: null,

            showMonths: true,
            showQuarters: true,
            showHalfyears: true,
            showYears: true,

            checkedStart: null,
            checkedEnd: null,

            /**
             * @cfg {Function} устанавливает функцию которая будет вызвана во время перерисовки компонента.
             * @remark
             * Аргументы функции:
             * <ol>
             *    <li>periods - Массив содержащий массивы из начала и конца периода</li>
             * </ol>
             * Функция должна вернуть объект содержащий информацию об отображаемой иконке или Deferred,
             * стреляющий таким объектом.
             * { iconClass: 'icon-Yes icon-done',
             *   title: 'Период отчетности закрыт'
             *   }
             */
            iconsHandler: null,

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
                     {name: 'IV', months: ['Октябрь', 'Ноябрь', 'Декабрь']}
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
         this._options.checkedStart = this._normalizeDate(this._options.checkedStart);
         this._options.checkedEnd = this._normalizeDate(this._options.checkedEnd);
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

         if (this._options.showYears) {
            container.find(['.', this._cssDateRangeChoose.yearButton].join('')).click(this._onYearClick.bind(this));
         }

         container.find('.controls-DateRangeChoose__year-prev').click(this._onPrevYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__year-next').click(this._onNextYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__yearsMode-prev').click(this._onNextYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__yearsMode-next').click(this._onPrevYearBtnClick.bind(this));
         eHelpers.wheel(container.find(['.', this._cssDateRangeChoose.yearsModeWrapper].join('')), this._onMouseWheel.bind(this));

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
         this._updateYears();
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

      _onMouseWheel: function (event) {
         if (event.wheelDelta > 0) {
            this._onNextYearBtnClick();
         } else {
            this._onPrevYearBtnClick();
         }
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
         period = dateHelpers.getCurrentPeriod(periodType)
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
      },

      _onNextYearBtnClick: function () {
         var year = this.getYear() + 1;
         this.setYear(year);
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
            dateHelpers.getFormattedDateRange(this.getStartValue(), this.getEndValue(), {shortYear: true, contractToHalfYear: true, contractToQuarter: true})
         );
      },

      _updateCheckMarks: function () {
         var self = this,
            iconsHandler = this._options.iconsHandler || this._getIcons,
            periods = [],
            containers, step, pType, container, icons;

         if (!this._options.checkedStart && !this._options.checkedEnd && !this._options.iconsHandler) {
            return;
         }

         if (this._options.showMonths) {
            containers = this.getContainer().find(['.', this._cssDateRangeChoose.month].join(''));
            step = 1;
            pType = 'month';
         } else if (this._options.showQuarters) {
            containers = this.getContainer().find(['.', this._cssDateRangeChoose.quarter].join(''));
            step = 3;
            pType = 'quarter';
         } else {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DateRangeChoose', 'Not implemented.');
            return;
         }
         for (var i = 0; i < 12; i += step) {
            periods.push([new Date(this.getYear(), i, 1), new Date(this.getYear(), i + step, 0)]);
         }

         icons = iconsHandler.call(this, periods, pType);
         if (!(icons && icons instanceof Deferred)) {
            icons = (new Deferred()).callback(icons);
         }

         icons.addCallback(function (_icons) {
            containers.each(function (index) {
               container = $(this).find(['>.', self._cssDateRangeChoose.checkbox].join(''));
               container.removeClass().addClass([self._cssDateRangeChoose.checkbox, 'icon-16', _icons[index].iconClass].join(' '));
               container.prop('title', _icons[index].title);
            });
         });
      },

      _getIcons: function (periods) {
         var icons = [];
         for (var i = 0; i < periods.length; i++) {
            icons.push(this._getIcon(periods[i][0], periods[i][1]));
         }
         return icons;
      },

      _getIcon: function (start, end) {
         var checkedStart = this._options.checkedStart,
             checkedEnd = this._options.checkedEnd;
         if (!checkedStart && checkedEnd) {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DateRangeChoose', 'checkedStart and checkedEnd options must be set.');
            return [];
         }
         checkedStart = checkedStart? checkedStart.getTime(): 0;
         checkedEnd = checkedEnd? checkedEnd.getTime(): Infinity;
         if (Math.max(start.getTime(), checkedStart) <= Math.min(end.getTime(), checkedEnd)) {
            return {iconClass: 'icon-Yes icon-done', title: rk('Период отчетности закрыт')};
         } else {
            return {iconClass: 'icon-Yes icon-disabled', title: rk('Период отчетности закрыт')};
         }
      },

      // Режим года
      _onYearsModeWrapperClick: function (e) {
         var year = this.getYear(),
            start = new Date(year - parseInt($(e.target).attr('data-range-id'), 10), 0, 1),
            end = new Date(year - parseInt($(e.target).attr('data-range-id'), 10), 11, 31);
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
            year = self.getYear() - index;
            if (currentYear === year) {
               $(this).addClass('controls-DateRangeChoose__yearsMode-bold');
            }
            $(this).text(year);
         });
      }
   });

   return DateRangeChoose;
});
