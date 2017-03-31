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
   "js!SBIS3.CONTROLS.Link",
   'css!SBIS3.CONTROLS.DateRangeChoose'
], function ( Deferred, IoC, ConsoleLogger,CompoundControl, dotTplFn, RangeMixin, DateRangeMixin, DateUtil, cInstance, eHelpers, dateHelpers) {
   'use strict';

   var DateRangeChoose = CompoundControl.extend([RangeMixin, DateRangeMixin], {
      /**
       * @typedef {Object} customPeriod
       * @property {String} label Заголовок который будет отбражаться в контроле.
       * @property {Date} startValue Начальное значение периода
       * @property {Date} endValue КОнечное значение периода
       */
      /**
       * @typedef {[Date, Date]} Period
       * Массив содержащий даты начала и конца периода
       */

      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            year: null,

            showMonths: true,
            showQuarters: true,
            showHalfyears: true,
            showYears: true,

            /**
             * @cfg {Boolean} Отображать кнопку "Период не указан"
             */
            showUndefined: false,

            /**
             * @cfg {customPeriod} Конфигурация кастомной кнопки снизу для выбора периода заданного на прикладной стороне
             */
            customPeriod: null,

            checkedStart: null,
            checkedEnd: null,

            /**
             * @cfg {String} CSS класс который будет установлен у выделенных иконок. По умолчанию - зеленая галочка.
             */
            checkedIconCssClass: 'icon-Yes icon-done',
            /**
             * @cfg {String} CSS класс который будет установлен у не выделенных иконок. По умолчанию - серая галочка.
             */
            uncheckedIconCssClass: 'icon-Yes icon-disabled',
            /**
             * @cfg {String} Подсказка которая будет отображаться у выделенных иконок. По умолчанию тултипа нет.
             */
            checkedIconTitle: null,
            /**
             * @cfg {String} Подсказка которая будет отображаться у не выделенных иконок. По умолчанию тултипа нет.
             */
            uncheckedIconTitle: null,

            /**
             * @cfg {Function} устанавливает функцию которая будет вызвана во время перерисовки компонента.
             * @remark
             * Аргументы функции:
             * <ol>
             *    <li>periods - Массив содержащий массивы из начала и конца периода</li>
             * </ol>
             * Функция должна вернуть массив элементов типа Boolean либо объект содержащих информацию об отображаемой
             * иконке {@link Icon} или Deferred, стреляющий таким объектом.
             * Если функция возвращает true, то будет отрисована иконка соответствующая опциям {@Link checkedIconCssClass} и
             * {@Link checkedIconTitle}. Если возвращает false, то иконки будут соответствовать опциям
             * {@Link uncheckedIconCssClass} и {@Link uncheckedIconTitle}. По умолчанию это зеленые и серые галочки.
             * Функция может вернуть объект содержащий онформацию о кастомных оконках.
             * { iconClass: 'icon-Yes icon-done',
             *   title: 'Период отчетности закрыт'
             *   }
             *
             * @see updateIcons
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
            this.updateIcons();
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
         container.on('mouseleave mouseenter', ['.', this._cssDateRangeChoose.yearButton].join(''), this._onMouseOver.bind(this));

         container.find('.controls-DateRangeChoose__year-prev').click(this._onPrevYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__year-next').click(this._onNextYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__yearsMode-prev').click(this._onNextYearBtnClick.bind(this));
         container.find('.controls-DateRangeChoose__yearsMode-next').click(this._onPrevYearBtnClick.bind(this));
         eHelpers.wheel(container.find(['.', this._cssDateRangeChoose.yearsModeWrapper].join('')), this._onMouseWheel.bind(this));

         container.find(['.', this._cssDateRangeChoose.halfYearCaption].join('')).click(this._onHalfYearClick.bind(this));
         container.find(['.', this._cssDateRangeChoose.quarterCaption].join('')).click(this._onQuarterClick.bind(this));
         container.find(['.', this._cssDateRangeChoose.month].join('')).click(this._onMonthClick.bind(this));

         container.find(['.', this._cssDateRangeChoose.yearsModeWrapper, '>*'].join('')).click(this._onYearsModeWrapperClick.bind(this));

         this.getChildControlByName('HomeButton').subscribe('onActivated', this._onHomeClick.bind(this));

         this.subscribe('onRangeChange', this._onRangeChanged.bind(this));
         this._updateRangeTitle();
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
         this.updateIcons();
      },
      /**
       * Возвращает текущий год
       * @returns {Number}
       */
      getYear: function () {
         return this._options.year;
      },

      _onMouseOver: function (e) {
         // TODO: перевести все на единую пописку
         var target = $(event.target),
            closestCssClass;
         if (target.hasClass(this._cssDateRangeChoose.yearButton)) {
            if (!this._options.showYears) {
               return;
            }
            closestCssClass = 'controls-DateRangeChoose';
         }
         switch (e.type) {
            case 'mouseenter':
               this._addSelectedClassOnMouseEnter(closestCssClass, e);
               break;
            case 'mouseleave':
               this._removeSelectedClassOnMouseLeave(closestCssClass, e);
               break;
         }
      },

      _onClickHandler: function(event) {
         var target = $(event.target);
         DateRangeChoose.superclass._onClickHandler.apply(this, arguments);
         if (this.isEnabled()) {
            if (target.hasClass('controls-DateRangeChoose__undefined-period')) {
               this._onUndefinedPeriodClick();
            } else if (target.hasClass('controls-DateRangeChoose__custom-period')) {
               this._onCustomPeriodClick();
            }
         }
      },

      _onUndefinedPeriodClick: function () {
         this.setRange();
         this._notify('onChoose');
      },

      _onCustomPeriodClick: function () {
         this.setRange(this._options.customPeriod.startValue, this._options.customPeriod.endValue);
         this._notify('onChoose', this._options.customPeriod.startValue, this._options.customPeriod.endValue);
      },

      _addSelectedClassOnMouseEnter: function (closestCssClass, e) {
         $(e.target).closest(['.', closestCssClass].join('')).addClass(this._cssDateRangeChoose.selected);
      },
      _removeSelectedClassOnMouseLeave: function (closestCssClass, e) {
         $(e.target).closest(['.', closestCssClass].join('')).removeClass(this._cssDateRangeChoose.selected);
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
            dateHelpers.getFormattedDateRange(this.getStartValue(), this.getEndValue(),
               {contractToMonth: true, fullNameOfMonth: true, contractToQuarter: true, contractToHalfYear: true, emptyPeriodTitle: rk('Период не указан')})
         );
      },

      /**
       * Обновляет иконки. Для получения данных вызывается хендлер {@link iconsHandler} установленный через опции.
       * @see iconsHandler
       */
      updateIcons: function () {
         var iconsHandler = this._options.iconsHandler || this._getIcons,
            periods, icons;

         if (!this._options.checkedStart && !this._options.checkedEnd && !this._options.iconsHandler) {
            return;
         }
         periods = this._getIconsPeriods();

         icons = iconsHandler.call(this, periods[0], periods[1]);
         if (!(icons && icons instanceof Deferred)) {
            icons = (new Deferred()).callback(icons);
         }

         icons.addCallback(this._setIcons.bind(this));
      },

      /**
       * @typedef {Object} Icon
       * @property {String} iconClass Класс который будет установлен у контейнера иконки.
       * @property {String} title Заголовок, отображаемый в всплывающей подсказке.
       *
       * @remark
       * { iconClass: 'icon-Yes icon-done',
       *   title: 'Период отчетности закрыт'
       *   }
       */
      /**
       * Устанавливает иконки отбражаемые напротив периодов.
       * @param icons {Icon[]}
       * @protected
       * @see iconsHandler
       * @see updateIcons
       * @see _getIconsPeriods
       */
      _setIcons: function (icons) {
         var self = this,
            containers, container, iconCssClass, iconTitle;
         if (this._options.showMonths) {
            containers = this.getContainer().find(['.', this._cssDateRangeChoose.month].join(''));
         } else if (this._options.showQuarters) {
            containers = this.getContainer().find(['.', this._cssDateRangeChoose.quarter].join(''));
         } else {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DateRangeChoose', 'Not implemented.');
            return;
         }
         if (icons.length !== containers.length) {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DateRangeChoose', 'Передано не коректное количество иконок в функцию _setIcons.');
         }
         containers.each(function (index) {
            if (typeof(icons[index]) === "boolean") {
               if (icons[index]) {
                  iconCssClass = self._options.checkedIconCssClass;
                  iconTitle = self._options.checkedIconTitle || '';
               } else {
                  iconCssClass = self._options.uncheckedIconCssClass;
                  iconTitle = self._options.uncheckedIconTitle || '';
               }
            } else {
               iconCssClass = icons[index].iconClass;
               iconTitle = icons[index].title;
            }
            container = $(this).find(['>.', self._cssDateRangeChoose.checkbox].join(''));
            container.removeClass().addClass([self._cssDateRangeChoose.checkbox, 'icon-16', iconCssClass].join(' '));
            container.prop('title', iconTitle);
         });
      },

      /**
       * Возвращает массив содержащий массив периодов соответсвующих иконкам и тип этих периодов.
       * @returns {[Period[], String]}
       * @protected
       * @see iconsHandler
       * @see updateIcons
       * @see _setIcons
       */
      _getIconsPeriods: function () {
         var periods = [],
            step, pType;
         if (this._options.showMonths) {
            step = 1;
            pType = 'month';
         } else if (this._options.showQuarters) {
            step = 3;
            pType = 'quarter';
         } else {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DateRangeChoose', 'Not implemented.');
            return;
         }
         for (var i = 0; i < 12; i += step) {
            periods.push([new Date(this.getYear(), i, 1), new Date(this.getYear(), i + step, 0)]);
         }
         return [periods, pType];
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
         if (!checkedStart && !checkedEnd) {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DateRangeChoose', 'checkedStart and/or checkedEnd options must be set.');
            return [];
         }
         checkedStart = checkedStart? checkedStart.getTime(): 0;
         checkedEnd = checkedEnd? checkedEnd.getTime(): Infinity;
         return Math.max(start.getTime(), checkedStart) <= Math.min(end.getTime(), checkedEnd);
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
            start = this.getStartValue(),
            selectedYear = start ? start.getFullYear() : null,
            year, containers;
         if (this._options.showMonths || this._options.showQuarters || this._options.showHalfyears) {
            return;
         }
         containers = this.getContainer().find(['.', this._cssDateRangeChoose.yearsModeWrapper, '>*'].join(''));
         containers.removeClass('controls-DateRangeChoose__yearsMode-bold');
         if (selectedYear) {
            containers.each(function (index) {
               year = self.getYear() - index;
               if (selectedYear === year) {
                  $(this).addClass('controls-DateRangeChoose__yearsMode-bold');
               }
               $(this).text(year);
            });
         }
      },
      /**
       * Обновляет состояние компонента при повторном открытии
       * @private
       */
      _onShow: function () {
         if (!this._options.showYears || this._options.showHalfyears || this._options.showQuarters || this._options.showMonths) {
            return;
         }

         var start = this.getStartValue(),
            currentYear = (new Date()).getFullYear(),
            selectedYear = start ? start.getFullYear() : null,
            startYear;

         if (!selectedYear) {
            return;
         }

         if (selectedYear >= currentYear) {
            startYear = selectedYear;
         } else if (currentYear - selectedYear >= 5){
            startYear = selectedYear + 4;
         } else {
            startYear = currentYear;
         }

         this.setYear(startYear);
      }
   });

   return DateRangeChoose;
});
