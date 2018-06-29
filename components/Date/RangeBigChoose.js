define('SBIS3.CONTROLS/Date/RangeBigChoose',[
   "Core/constants",
   "Core/detection",
   "Lib/Control/CompoundControl/CompoundControl",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/DateRangeBigChoose",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/header",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/yearsPanel",
   "SBIS3.CONTROLS/Mixins/RangeMixin",
   "SBIS3.CONTROLS/Mixins/DateRangeMixin",
   "SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin",
   'SBIS3.CONTROLS/Utils/ControlsValidators',
   "SBIS3.CONTROLS/Utils/DateUtil",
   'SBIS3.CONTROLS/Utils/DateControls',
   'Core/dom/wheel',
   'Core/helpers/Object/isEmpty',
   'SBIS3.CONTROLS/Date/RangeBigChoose/resources/Utils',
   "SBIS3.CONTROLS/Button",
   'SBIS3.CONTROLS/WSControls/Buttons/Button',
   "SBIS3.CONTROLS/Button/IconButton",
   'SBIS3.CONTROLS/Button/StateButton',
   "SBIS3.CONTROLS/Link",
   "SBIS3.CONTROLS/Date/Box",
   'SBIS3.CONTROLS/Date/RangeSliderBase',
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePicker",
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePicker",
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/Validators",
   "browser!SBIS3.CONTROLS/ListView/resources/SwipeHandlers",
   'i18n!SBIS3.CONTROLS/Date/RangeBigChoose',
   'css!SBIS3.CONTROLS/Date/RangeBigChoose/DateRangeBigChoose',
   'SBIS3.CONTROLS/ScrollContainer'

], function(
   constants,
   detection,
   CompoundControl,
   dotTplFn,
   headerTpl,
   yearsPanelTpl,
   RangeMixin,
   DateRangeMixin,
   RangeSelectableViewMixin,
   ControlsValidators,
   DateUtil,
   DateControlsUtil,
   wheel,
   isEmpty,
   rangeBigChooseUtils
) {
   'use strict';

   var
      css_classes = {
         displayedYear: 'controls-DateRangeBigChoose__displayedYear',
         currentYear: 'controls-DateRangeBigChoose__currentYear',
         selectionProcessing: 'controls-DateRangeBigChoose__selectionProcessing',

         // Ключи должны совпадать с соотыветствующими selectionTypes
         range_containers: {
            years: 'controls-DateRangeBigChoose__yearsRange'
            // months: 'controls-DateRangeBigChoose__months-month',
            // months: 'controls-DateRangeBigChoose__dates-months'
         }
      },
      headerTypes = {
         link: 'link',
         inputField: 'inputField'
      },
      selectionTypes = {
         years: 'years',
         days: 'days'
      },
      states = {
         month: 'month',
         year: 'year'
      };
    /**
     *
     * @class SBIS3.CONTROLS/Date/RangeBigChoose
     * @extends Lib/Control/CompoundControl/CompoundControl
     * @author Миронов А.Ю.
     *
     * @mixes SBIS3.CONTROLS/Mixins/RangeMixin
     * @mixes SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin
     *
     * @public
     * @control
     *
     * @author Миронов Александр Юрьевич
     */
   var DateRangeBigChoose = CompoundControl.extend([RangeSelectableViewMixin, RangeMixin, DateRangeMixin], /** @lends SBIS3.CONTROLS/Date/RangeBigChoose.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
             /**
              * @cfg {String}
              */
            mask: 'DD.MM.YY',
             /**
              * @cfg {Array}
              */
            startValueValidators: [],
             /**
              * @cfg {Array}
              */
            endValueValidators: [],

            quantum: {},

            minQuantum: 'day',

            headerType: headerTypes.link,

            emptyCaption:  rk('Период не указан'),

            headerTpl: headerTpl,
            yearsPanelTpl: yearsPanelTpl,

            /**
             * [текст, условие, если true, если false]
             * @param prefix
             * @param style
             * @param cfgArr
             * @private
             */
            _prepareCssClass: function (prefix, style, cfgArr) {
               var cssClass = prefix;
               if (style) {
                  cssClass += '-' + style;
               }
               return cfgArr.reduce(function (previousValue, currentValue, index) {
                  var valueToAdd = currentValue[0] ? currentValue[1] : currentValue[2];
                  if (valueToAdd) {
                     previousValue += '-' + valueToAdd;
                  }
                  return previousValue;
               }, cssClass);
            },

            _prepareRangeCssClasses: function (prefix, scope) {
               var textColorClass = prefix,
                  backgroundColorClass = 'controls-DateRangeBigChoose__years-yearsRangeItem__backgroundColor',
                  // cursorClass = 'controls-MonthView__cursor',
                  css = [];

               if (scope.year.selected) {
                  backgroundColorClass += '-selected';
                  if (scope.year.selectedStart || scope.year.selectedEnd) {
                     if (scope.year.selectionProcessing) {
                        backgroundColorClass += '-startend-unfinished';
                     }
                  }
               } else {
                  backgroundColorClass += '-unselected';
               }

               if (scope.year.displayed) {
                  css.push(css_classes.displayedYear);
               }
               if (scope.year.current) {
                  css.push(css_classes.currentYear);
               }
               if (scope.year.selected) {
                  css.push('controls-RangeSelectable__item-selected');
                  css.push(prefix + '-selected');
               }
               if (scope.year.selectedUnfinishedStart || scope.year.selectedUnfinishedEnd) {
                  css.push(prefix + '-selectedUnfinishedEdge');
               }
               if (scope.year.selectedInner) {
                  css.push(prefix + '-selectedInner');
               }

               if (scope.year.selectedStart && !scope.year.selectedUnfinishedStart) {
                  css.push('controls-RangeSelectable__item-selectedStart');
                  css.push(prefix + '-selectedStart');
               }
               if (scope.year.selectedEnd &&
                     (!scope.year.selectionProcessing || (scope.year.selectedEnd !== scope.year.selectedStart  && !scope.year.selectedUnfinishedEnd))) {
                  css.push('controls-RangeSelectable__item-selectedEnd');
                  css.push(prefix + '-selectedEnd');
               }
               if (scope.year.selectedUnfinishedStart) {
                  css.push(prefix + '-selectedUnfinishedStart');
               }
               if (scope.year.selectedUnfinishedEnd) {
                  css.push(prefix + '-selectedUnfinishedEnd');
               }

               if (scope.year.displayed) {
                  textColorClass += '-displayed';
               } else if (scope.year.current) {
                  textColorClass += '-current';
               }
               css.push(textColorClass, backgroundColorClass);
               return css.join(' ');
            },
            _state: states.year,

            activableByClick: false
         },
          _keysWeHandle: [
             constants.key.tab,
             constants.key.enter,
             constants.key.esc
          ],
         // _currentYear: null,
         _selectionType: null,
         _toggleStateBtn: null,
         _currentYearBtn: null,
         _yearButtons: [],

         _startDatePicker: null,
         _endDatePicker: null,
         _monthRangePicker: null,
         _dateRangePicker: null
      },

      selectionTypes: selectionTypes,

      $constructor: function () {
      },

      init: function () {
         var self = this,
            container = this.getContainer();

         var rangeButtonHandlerWrapper = function (func) {
            // var container = this.hasOwnProperty('getContainer')? this.getContainer(): $(this);
            func.call(self, $(this).attr('data-item'));
         };

         DateRangeBigChoose.superclass.init.call(this);

         this._startDatePicker = this.getChildControlByName('DatePickerStart');
         this._endDatePicker = this.getChildControlByName('DatePickerEnd');

         this.getChildControlByName('HomeButton').subscribe('onActivated', this._onHomeButtonClick.bind(this));

         this.getChildControlByName('ApplyButton').subscribe('onActivated', this._onApplyButtonClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose__header-period-text', this._onHeaderButtonClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose__closeButton', this._onCloseButtonClick.bind(this));

         this.getChildControlByName('PrevYearButton').subscribe('onActivated', this._onPrevOrNextYearBtnClick.bind(this, -1));
         this.getChildControlByName('NextYearButton').subscribe('onActivated', this._onPrevOrNextYearBtnClick.bind(this, 1));
         if (rangeBigChooseUtils.isStateButtonDisplayed(this._options)) {
            this.getChildControlByName('StateButton').subscribe('onActivated', this._onStateBtnClick.bind(this));
         }

         container.find('.controls-DateRangeBigChoose__months-toStart').click(this._toStartMonth.bind(this));
         container.find('.controls-DateRangeBigChoose__months-toEnd').click(this._toEndMonth.bind(this));

         this._initRangeButtonControl(selectionTypes.years, 'YearsRangeBtn', 6);

         // this._initRangeButtonControl(selectionTypes.months, 'MonthRangeBtn', 12);
         this._initRangeContainers();

         this._monthRangePicker = this.getChildControlByName('MonthRangePicker');
         this._dateRangePicker = this.getChildControlByName('MonthDateRangePicker');
         this._monthRangePicker.subscribe('onRangeChange', this._onInnerComponentRangeChange.bind(this));
         this._dateRangePicker.subscribe('onRangeChange', this._onInnerComponentRangeChange.bind(this));
         this._dateRangePicker.subscribe('onActivated', this._onDateRangePickerActivated.bind(this));
         this._dateRangePicker.subscribe('onSelectionStarted', this._datePickerSetActive.bind(this, this._endDatePicker));
         this._monthRangePicker.subscribe('onSelectionStarted', this._datePickerSetActive.bind(this, this._endDatePicker));
         this._monthRangePicker.subscribe('onSelectionEnded', this._onSelectionEnded.bind(this));
         this._monthRangePicker.subscribe('onYearChanged', this._onMonthRangePickerYearChanged.bind(this));
         this._monthRangePicker.subscribe('onPeriodMouseEnter', this._onMonthRangePickerOnItemMouseEnter.bind(this));
         this._monthRangePicker.subscribe('onPeriodMouseLeave', this._onMonthRangePickerOnItemMouseLeave.bind(this));
         this._dateRangePicker.subscribe('onSelectionEnded', this._onDateRangeSelectionEnded.bind(this));
         this._dateRangePicker.subscribe('onMonthChanged', this._onDateRangePickerYearChanged.bind(this));
         this._dateRangePicker.subscribe('onDisplayedRangeChanged', this._dateOnDisplayedRangeChanged.bind(this));
         this._dateRangePicker.subscribe('onPeriodMouseLeave', this._datePickersResetActive.bind(this));

         this.subscribe('onSelectionEnded', this._onSelectionEnded.bind(this));

         this._monthRangePicker.subscribe('onMonthActivated', function (e, month) {
            if (!this._monthRangePicker.isSelectionProcessing()) {
               self.applyMonthState(month);
            }
         }.bind(this));
         this._monthRangePicker.subscribe('onSelectionStarted', function (e) {
            this.getContainer().addClass(css_classes.selectionProcessing);
         }.bind(this));
         this._monthRangePicker.subscribe('onSelectionEnded', function (e) {
            this.getContainer().removeClass(css_classes.selectionProcessing);
         }.bind(this));

         wheel(container.find('.controls-DateRangeBigChoose__months-month-picker'), this._onMonthPickerWheel.bind(this));
         wheel(container.find('.controls-DateRangeBigChoose__dates-dates'), this._onDatesPickerWheel.bind(this));
         // if (constants.browser.isMobileIOS) {
         //    container.find('.controls-DateRangeBigChoose__months-month-picker').on('swipeVertical', this._onMonthPickerSwipe.bind(this));
         //    container.find('.controls-DateRangeBigChoose__dates-dates').on('swipeVertical', this._onDatesPickerSwipe.bind(this));
         //    container.find('.controls-DateRangeBigChoose__months-month-picker').on('touchmove', function(event){event.preventDefault()});
         //    container.find('.controls-DateRangeBigChoose__dates-dates').on('touchmove', function(event){event.preventDefault()});
         // }

         this._startDatePicker.subscribe('onTextChange', this._onDatePickerStartDateChanged.bind(this));
         this._startDatePicker.subscribe('onClick', this._onDatePickersFocusIn.bind(this));
         this._endDatePicker.subscribe('onTextChange', this._onDatePickerEndDateChanged.bind(this));
         this._endDatePicker.subscribe('onClick', this._onDatePickersFocusIn.bind(this));

         this._startDatePicker.subscribe('onInputFinished', function() {
            self._endDatePicker.setActive(true);
         });

         this._startDatePicker.addValidators(this._options.startValueValidators);
         this._endDatePicker.addValidators(this._options.endValueValidators);

         this.subscribe('onRangeChange', this._onRangeChange.bind(this));
   
         if (this._options.yearStateEnabled) {
            this.applyYearState();
         } else {
            this.applyMonthState(this._options.startValue? this._options.startValue: new Date());
         }

         this._updateHomeButton();
      },

      _modifyOptions: function (options) {
         var mask;

         options = DateRangeBigChoose.superclass._modifyOptions.apply(this, arguments);

         // Всегда отображаем поля ввода дат без времени.
         // Используем только ту часть маски которая отвечает за дату.
         mask = options.mask.match(/^[YMD/\-.]+/);
         if (mask) {
            options.mask = mask[0];
         } else {
            throw new Error('The mask option does not satisfy any valid mask for this control');
         }

         options.displayedYear = options.startValue ? options.startValue.getFullYear() : (new Date()).getFullYear();
         // options.displayedPeriod = options.startValue ? options.startValue : DateUtil.normalizeMonth(new Date());
         options.yearPanelLastYear = options.displayedYear;
         options.yearPanelData = this._getYearsRangeItems(options.displayedYear + 1, options, true);
         options.weekdaysCaptions = DateControlsUtil.getWeekdaysCaptions();
         // options._state = options.selectionType === RangeSelectableViewMixin.selectionTypes.range ? states.year: states.month;
         if (isEmpty(options.quantum) && options.selectionType === RangeSelectableViewMixin.selectionTypes.single) {
            options.quantum.days = [1];
         }
         options.yearSelectionEnabled = true;
         options.yearStateEnabled = true;
         options.monthStateEnabled = true;
         if (!isEmpty(options.quantum)) {
            options.yearSelectionEnabled = 'years' in options.quantum;
         }
         options.yearStateEnabled = rangeBigChooseUtils.isYearStateEnabled(options);
         options.monthStateEnabled = rangeBigChooseUtils.isMonthStateEnabled(options);

         if (options.minQuantum === 'month') {
            options.startValueValidators.push({
               'validator': ControlsValidators.startOfMonth,
               'option': 'date'
            });
            options.endValueValidators.push({
               'validator': ControlsValidators.endOfMonth,
               'option': 'date'
            });
         }

         return options;
      },

      _keyboardHover: function (e) {
         switch (e.which) {
            case constants.key.enter:
               this._onApplyButtonClick();
               return false;
            case constants.key.esc:
               this._onCloseButtonClick();
               return false;
         }
         return DateRangeBigChoose.superclass._keyboardHover.apply(this, arguments);
      },

      _onMonthRangePickerYearChanged: function (event, year) {
         this._options.displayedYear = year;
         this._options._displayedPeriod = new Date(year, 0);
         this._updateHomeButton();
         this._clearYearsBarSelection();
         if (year > this._options.yearPanelLastYear) {
            this._updateYearsBar(year);
         } else if (year < this._options.yearPanelLastYear - 5) {
            this._updateYearsBar(year + 5);
         }
      },

      _onMonthRangePickerOnItemMouseEnter: function (event, date) {
         if (this._monthRangePicker.isSelectionProcessing()) {
            if (this.getStartValue() > date) {
               this._endDatePickerResetActive();
               this._datePickerSetActive(this._startDatePicker, DateUtil.getStartOfMonth(date));
            } else {
               this._startDatePickerResetActive();
               this._datePickerSetActive(this._endDatePicker, DateUtil.getEndOfMonth(date));
            }
         }
      },
       _onMonthRangePickerOnItemMouseLeave: function (event, date) {
         if (this._monthRangePicker.isSelectionProcessing()) {
            this._datePickersResetActive();
         }
      },

      _dateOnDisplayedRangeChanged: function (event, start, end) {
         if (this._dateRangePicker.isSelectionProcessing()) {
            if (this.getStartValue() > start) {
               this._endDatePickerResetActive(end);
               this._datePickerSetActive(this._startDatePicker, start);
            } else {
               this._startDatePickerResetActive(start);
               this._datePickerSetActive(this._endDatePicker, end);
            }
            this.getChildControlByName('DateRangeHeader').setRange(start, end);
         } else {
            this._datePickerSetActive(this._startDatePicker);
         }
      },

       _onDateRangePickerYearChanged: function () {
         this.getContainer().find('.controls-DateRangeBigChoose__dates-header-year').html(this._dateRangePicker.getMonth().getFullYear());
       },

       _onSelectionEnded: function () {
         if (this._startDatePicker.validate() && this._endDatePicker.validate()) {
            this._updateHeaderInputsVisibility();
            this._startDatePickerResetActive();
            this._endDatePickerResetActive();
            this._notify('onChoose', this.getStartValue(), this.getEndValue());
         }
       },
       _onDateRangeSelectionEnded: function () {
         this._monthRangePicker._clearMonthSelection();
         this._onSelectionEnded();
       },

      _setDisplayedPeriod: function (startDate) {
         this._options._displayedPeriod = startDate;
      },

      _isHomeButtonVisible: function (options) {
         var today = new Date();
         options = options || this._options;
         return (options._state === states.year && !DateUtil.isYearsEqual(today, options._displayedPeriod)) ||
            (options._state === states.month && !DateUtil.isMonthsEqual(today, options._displayedPeriod));
      },

      _updateHomeButton: function () {
         this.getChildControlByName('HomeButton').toggle(this._isHomeButtonVisible());
      },

      _onHomeButtonClick: function () {
         var now = DateUtil.normalizeMonth(new Date());
         this.cancelSelection();
         this._dateRangePicker.cancelSelection();
         this._setCurrentYear(now.getFullYear(), true);
         this._monthRangePicker.setYear(now.getFullYear());
         this._dateRangePicker.setMonth(now);
         this._updateYearsBar(now.getFullYear());
      },

      _onApplyButtonClick: function () {
         if (this._startDatePicker.validate() && this._endDatePicker.validate()) {
            if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range && this.isSelectionProcessing()) {
               this._onRangeItemElementClick(this.getStartValue());
            }
            this.cancelSelection();
            this._dateRangePicker.cancelSelection();
            this._updateHeaderInputsVisibility();
            this._startDatePickerResetActive();
            this._endDatePickerResetActive();
            if (this._options._state === states.month) {
               this._monthRangePicker._clearMonthSelection();
            }
            this._notify('onChoose', this.getStartValue(), this.getEndValue());
         }
      },

      _onHeaderButtonClick: function () {
         this._toggleHeaderInputsVisibility(true);
         this._startDatePicker.setActive(true);
      },

      _toggleHeaderInputsVisibility: function (isInputVisible) {
         if ((isEmpty(this._options.quantum) ||
               ('days' in this._options.quantum && Object.keys(this._options.quantum).length === 1))
            ) {
            this.getChildControlByName('DateRangeHeader').toggle(!isInputVisible);
            this.getContainer().find('.controls-DateRangeBigChoose__header-period-input').toggleClass('ws-hidden', !isInputVisible);
         } else {
            this._notify('onCancel', this.getStartValue(), this.getEndValue());
         }
      },

      _updateHeaderInputsVisibility: function () {
         this._toggleHeaderInputsVisibility(this._options.headerType === headerTypes.inputField);
      },

      _onCloseButtonClick: function () {
         this.cancelSelection();
         this._dateRangePicker.cancelSelection();
         this._notify('onCancel', this.getStartValue(), this.getEndValue());
         this._updateHeaderInputsVisibility();
      },

      _toStartMonth: function () {
         var start = this.getStartValue();
         if (start) {
            start = start.getFullYear();
            this._setCurrentYear(start);
            this._updateYearsBar(start);
         }
      },

      _toEndMonth: function () {
         var end = this.getEndValue();
         if (end) {
            end = end.getFullYear();
            this._setCurrentYear(end);
            this._updateYearsBar(end);
         }
      },

      _onDatePickerStartDateChanged: function(e, text) {
         var date = this._startDatePicker.getDate(),
            oldStartDate = this.getStartValue(),
            endDate = this._endDatePicker.getDate();

         this.cancelSelection();
         this._dateRangePicker.cancelSelection();
         this._monthRangePicker._clearMonthSelection();

         if ((!date && text !== '') || this._isDatesEqual(date, oldStartDate)) {
            return;
         }

         if (endDate && date && date > endDate) {
            // setRange не вызываем, диапазон установится в обработчике _onDatePickerEndDateChanged
            // TODO: когда будет возможность установить свойство без генерации событий надо будет убрать этот хак.
            if (this.getSelectionType() !== RangeSelectableViewMixin.selectionTypes.range) {
               this._endDatePicker.setDate(date);
            } else {
               return;
            }
         } else {
            if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range) {
               this.setStartValue(date);
            } else {
               this.setRange(date, date);
            }

         }
         // Отображаемый год меняем только если начало периода определено, а конец не определен
         if (date && !endDate) {
            this._setCurrentYear(date.getFullYear(), true);
            if (this._options._state === states.year) {
               this._monthRangePicker.setYear(date.getFullYear());
            } else {
               this._dateRangePicker.setMonth(date);
            }
         }
      },

      _onDatePickerEndDateChanged: function(e, text) {
         var date = this._endDatePicker.getDate(),
            startDate = this._startDatePicker.getDate(),
            oldEndDate = this.getEndValue();

         this.cancelSelection();
         this._dateRangePicker.cancelSelection();
         this._monthRangePicker._clearMonthSelection();

         if ((!date && text !== '') || this._isDatesEqual(date, oldEndDate)) {
            return;
         }

         if (startDate && date && date < startDate) {
            // date = startDate
            return;
         }
         this.setRange(startDate, date);
         if (!date) {
            return;
         }
         this._setCurrentYear(date.getFullYear(), true);
         if (this._options._state === states.year) {
            this._monthRangePicker.setYear(date.getFullYear());
         } else {
            this._dateRangePicker.setMonth(date);
         }
      },

      _onDatePickersFocusIn: function() {
         this.cancelSelection();
         this._dateRangePicker.cancelSelection();
      },

      setStartValue: function (start, silent) {
         var changed = DateRangeBigChoose.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            if (this.getSelectionType() !== RangeSelectableViewMixin.selectionTypes.range && start) {
               this._dateRangePicker.setMonth(start);
               this._setCurrentYear(start.getFullYear(), true);
               this._updateYearsBar(start.getFullYear());
            }
            this.getChildControlByName('DateRangeHeader').setStartValue(start);
         }
         return changed;
      },

      setRange: function (start, end, silent) {
         var oldStart, oldEnd, changed;

         if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range) {
            oldStart = this.getStartValue();
            oldEnd = this.getEndValue();
            changed = DateRangeBigChoose.superclass.setRange.apply(this, arguments);
            start = this.getStartValue();
            end = this.getEndValue();
            if (start && !this._isDatesEqual(start, oldStart) && !this._isDatesEqual(end, oldEnd)) {
               // this._dateRangePicker.setMonth(start);
               this._setCurrentYear(start.getFullYear(), true);
            }
         } else {
            changed = DateRangeBigChoose.superclass.setRange.apply(this, arguments);
         }
         return changed;
      },

      /**
       * Обработчик вызывающийся при изменении выбранного диапазона. Обновляет диапазоны во внутренних компонентах.
       * @param e
       * @param startValue
       * @param endValue
       * @private
       */
      _onRangeChange: function (e, startValue, endValue) {
         var start = this._startDatePicker.getDate(),
            end = this._endDatePicker.getDate(),
            year;

         if ((start != startValue) ||
            (start && startValue && (start.toSQL() !==  startValue.toSQL()))) {
            this._startDatePicker.setDate(startValue, true);
            this._startDatePicker.validate();
         }
         if ((end != endValue) ||
            (end && endValue && (end.toSQL() !==  endValue.toSQL()))) {
            this._endDatePicker.setDate(endValue, true);
            this._endDatePicker.validate();
         }

         if (this._options._state === states.year) {
            this._monthRangePicker.setRange(startValue, endValue, true);
         } else if (this._options._state === states.month) {
            this._dateRangePicker.setRange(startValue, endValue, true);
         }

         if (this.getRangeSelectionType() === selectionTypes.years) {
            year = parseInt(endValue.getFullYear(), 10);
            this._setCurrentYear(year);
         }
         this._updateRangeIndicators();
      },

      _updateRangeIndicators: function () {
         var start = this.getStartValue(),
            end = this.getEndValue();

         if (start && start.getFullYear() < this._getCurrentYear()) {
            this.getContainer().find('.controls-DateRangeBigChoose__months-toStart').removeClass('ws-hidden');
         } else {
            this.getContainer().find('.controls-DateRangeBigChoose__months-toStart').addClass('ws-hidden');
         }
         if (end && end.getFullYear() > this._getCurrentYear()) {
            this.getContainer().find('.controls-DateRangeBigChoose__months-toEnd').removeClass('ws-hidden');
         } else {
            this.getContainer().find('.controls-DateRangeBigChoose__months-toEnd').addClass('ws-hidden');
         }
      },

      _onInnerComponentRangeChange: function (e, startValue, endValue) {
         // this._clearAllSelection();
         this._clearYearsBarSelection();
         this._setRangeSelectionType(null);
         this.setRange(startValue, endValue);
      },

      updateViewAfterShow: function () {
         // При построении компонента нам надо установить скрол исходя из высоты одного из внутренних элементов.
         // Но при построении контрола лежащего в пикере, контейнер пикера скрыт,
         // и мы не можем правильно узнать эту высоту. У нас нет средств что бы можно было отследить без задержек,
         // когда компонент стал видим в пикере. Сейчас скрол обновляется через setTimout.
         // В результате в ie и ff видно как компонент обновляется после открытия.
         // Вызываем эту функцию из компонента открывающего пикер сразу же после открытия.
         // Контрол лежит во флоат арии и можно конечно подписаться на событие 'onShow' родительского компонента..
         // Но лазить к родителям архитектурно не очень правильно. Чисто теоретически большой выбор периода можно
         // открыть не в плавающей панели.
         if (this._options._state === states.month) {
            this._dateRangePicker._updateScrollPosition();
         } else {
            this._monthRangePicker._updateScrollPosition();
         }
      },

      applyMonthState: function (month) {
         var container = this.getContainer();
         container.find('.controls-DateRangeBigChoose__dates').removeClass('ws-hidden');
         container.find('.controls-DateRangeBigChoose__months').addClass('ws-hidden');
         this.cancelSelection();
         this._options._state = states.month;
         this._dateRangePicker.cancelSelection();
         this._dateRangePicker.setRange(this.getStartValue(), this.getEndValue(), true);
         this._dateRangePicker.setMonth(month);
         this._dateRangePicker._updateScrollPosition();
         this._setCurrentYear(month.getFullYear(), true);
         this._updateYearsBar(month.getFullYear());
         if (rangeBigChooseUtils.isStateButtonDisplayed(this._options)) {
            this.getChildControlByName('StateButton').setChecked(true);
         }
      },

      applyYearState: function (monthNumber) {
         this.cancelSelection();
         var container = this.getContainer();
         this._options._state = states.year;
         this._setDisplayedPeriod(new Date(this._getCurrentYear(), 0));
         container.find('.controls-DateRangeBigChoose__dates').addClass('ws-hidden');
         container.find('.controls-DateRangeBigChoose__months').removeClass('ws-hidden');
         this._monthRangePicker.setRange(this.getStartValue(), this.getEndValue());
         this.getChildControlByName('MonthRangePicker').setYear(this._getCurrentYear());
         if (rangeBigChooseUtils.isStateButtonDisplayed(this._options)) {
            this.getChildControlByName('StateButton').setChecked(false);
         }
      },

      _initRangeButtonControl: function (selectionType, baseButtonName, buttonsCount) {
         var container = this.getContainer(),
            control;
         if (selectionType === selectionTypes.years) {
            container.on('click', '.controls-DateRangeBigChoose__years-yearsRange-btn', selectionType,
               this._onRangeBtnContainerClick.bind(this));
            if (!detection.isMobileIOS) {
               container.on('mouseenter', '.controls-DateRangeBigChoose__years-yearsRange-btn', selectionType,
                  this._onRangeBtnContainerEnter.bind(this));
            }
         } else {
            for (var i = 0; i < buttonsCount; i++) {
               control = this.getChildControlByName(baseButtonName + i);
               control.subscribe('onActivated', this._onRangeBtnClick.bind(this, selectionType));
               // control.getContainer().mouseenter(this._onRangeBtnEnter.bind(this, selectionType));
            }
         }

      },

      _initRangeContainers: function () {
         var classes = [],
             container = this.getContainer();
         for (var cls in css_classes.range_containers) {
            if (css_classes.range_containers.hasOwnProperty(cls)) {
               container.on(
                  'mouseleave',
                  ['.', css_classes.range_containers[cls]].join(''),
                  this._onRangeControlMouseLeave.bind(this, cls)
               );
            }
         }
      },

       /**
        * Вызывается при нажатии на кнопки вперед или назад на панели годов.
        * @param direction {Number} 1 - вперед, -1 незад
        * @private
        */
      _onPrevOrNextYearBtnClick: function (direction) {
         var year = this._options.yearPanelData[this._options.yearPanelData.length - 1].caption;
         this._updateYearsBar(year + direction);
         if (this.getStartValue() && this.getEndValue()) {
            this._drawCurrentRangeSelection();
         }
         this._updateRangeIndicators();
      },

      _onMonthPickerWheel: function (event) {
         // var direction = event.wheelDelta > 0 ? -1 : 1,
         //    year = this._getCurrentYear() + direction;
         // this._onPrevOrNextYearBtnClick(direction);
         // this._setCurrentYear(year);
         // this._updateYearsBar(year);
         // this._updateRangeIndicators();
      },

      _onDatesPickerWheel: function (event) {
         // var direction = event.wheelDelta > 0 ? -1 : 1,
         //    month = this._dateRangePicker.getMonth();
         // month = new Date(month.getFullYear(), month.getMonth() + direction, 1);
         // if ((month.getMonth() === 0 && direction > 0) || (month.getMonth() === 11 && direction < 0)) {
         //    this._setCurrentYear(month.getFullYear());
         //    this._updateYearsBar(month.getFullYear());
         // }
         // this._dateRangePicker.setMonth(month);
      },

      _onMonthPickerSwipe: function (event) {
         //TODO: избавиться от дублирования кода _onMonthPickerWheel
         // var
         //    direction = event.direction === 'bottom' ? -1 : 1,
         //    year = this._getCurrentYear() + direction;
         // this._onPrevOrNextYearBtnClick(direction);
         // this._setCurrentYear(year);
         // this._updateYearsBar(year);
         // this._updateRangeIndicators();
      },

      _onDatesPickerSwipe: function (event) {
         //TODO: избавиться от дублирования кода _onDatesPickerWheel
         // var
         //    direction = event.direction === 'bottom' ? -1 : 1,
         //    month = this._dateRangePicker.getMonth();
         // month = new Date(month.getFullYear(), month.getMonth() + direction, 1);
         // if ((month.getMonth() === 0 && direction > 0) || (month.getMonth() === 11 && direction < 0)) {
         //    this._setCurrentYear(month.getFullYear());
         //    this._updateYearsBar(month.getFullYear());
         // }
         // event.preventDefault();
         // event.stopImmediatePropagation();
         // this._dateRangePicker.setMonth(month);
      },

      _onStateBtnClick: function () {
         if (this._options._state === states.year) {
            this.applyMonthState(new Date(this._getCurrentYear(), 0));
         } else {
            this.applyYearState();
         }
      },

      _getCurrentYear: function () {
         return this._options.displayedYear;
      },
      _setCurrentYear: function (value, dontUpdatePickers) {
         if (value === this.getLinkedContext().getValue('currentYear')){
            return;
         }
         this.getLinkedContext().setValue('currentYear', value);
         this._options.displayedYear = value;
         if (!dontUpdatePickers) {
            this.getChildControlByName('MonthRangePicker').setYear(value);
         }
         this._updateRangeIndicators();
         this._setDisplayedPeriod(new Date(value, 0));
         this._updateHomeButton();
      },

      setEndValue: function (end, silent) {
         // Выделение происходит разными периодами а интерфейс должен возвращать выделение днями,
         // поэтому всегда устанавливаем конец на последний день этого периода.
         if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range) {
            switch(this.getRangeSelectionType()) {
               case selectionTypes.years:
                  end = new Date(end.getFullYear() + 1, 0, 0);
                  break;
            }
         }
         this.getChildControlByName('DateRangeHeader').setEndValue(end);
         return DateRangeBigChoose.superclass.setEndValue.call(this, end, silent);
      },

      _onDateRangePickerActivated: function (e, month) {
         this.setRange(new Date(month.getFullYear(), month.getMonth(), 1), new Date(month.getFullYear(), month.getMonth() + 1, 0));
      },

      // Логика связанная с панелями выбора диапазонов

      /**
       * Устанавливает способ которым выбирается диапазон.
       * @param value {String} текстовый идентификатор способа, которым устанавливается диапазон.
       */
      _setRangeSelectionType: function (value) {
         this._selectionType = value;
      },
      /**
       * Возвращает текстовый ижентификатор способа, которым был выбран диапазон.
       * @returns {String}
       */
      getRangeSelectionType: function () {
         return this._selectionType;
      },

      _onRangeBtnContainerClick: function (event) {
         var selectionType = event.data,
            itemId = this._getItemIdByItemContainer($(event.target)),
            item = this._getSelectedRangeItemByItemId(itemId, selectionType);
         if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range && this._options.yearSelectionEnabled) {
            this._selectionToggle(item, selectionType);
         } else if (selectionType === selectionTypes.years) {
            this._setCurrentYear(itemId);
         }
         this._monthRangePicker._clearMonthSelection();
      },

      // Выбор периода по годам, полугодиям, кварталам и месяцам
      _onRangeBtnClick: function (selectionType, e) {
         var itemId = this._getItemIdByItemContainer(e.getTarget().getContainer()),
            item = this._getSelectedRangeItemByItemId(itemId, selectionType);
         if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range) {
            // if (selectionType !== selectionTypes.years) {
            //    this._setYearBarState(YEAR_CHOOSER_STATE_1YEAR);
            // }
            if (selectionType === selectionTypes.years && this._options._state === states.month) {
               this._setCurrentYear(item.getFullYear());
               // this._toggleChooseYear();
               return;
            }
            this._selectionToggle(item, selectionType);
         } else {
            if (selectionType === selectionTypes.years) {
               this._setCurrentYear(itemId);
               // this._toggleChooseYear();
            }
         }
         this.setActive(true);
      },

      // _onRangeBtnEnter: function (selectionType, e) {
      //    var itemId;
      //    if (selectionType === this.getRangeSelectionType()) {
      //       itemId = this._getItemIdByItemContainer($(e.currentTarget));
      //       this._onRangeItemElementMouseEnter(this._getSelectedRangeItemByItemId(itemId, selectionType));
      //    }
      // },
      _onRangeBtnContainerEnter: function (event) {
         var selectionType = event.data,
            itemId = this._getItemIdByItemContainer($(event.target)),
            item = this._getSelectedRangeItemByItemId(itemId, selectionType);
         if (selectionType === this.getRangeSelectionType()) {
            this._onRangeItemElementMouseEnter(item);
         }
         if (this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range){
            if (this.isSelectionProcessing()) {
               if (this.getStartValue() > item) {
                  this._endDatePickerResetActive();
                  this._datePickerSetActive(this._startDatePicker, item);
               } else {
                  this._startDatePickerResetActive();
                  this._datePickerSetActive(this._endDatePicker, DateUtil.getEndOfYear(item));
               }
            }
         }
      },

      _datePickerSetActive: function (picker, date) {
         var range;
         if (date instanceof Date) {
             picker.setDate(date, true);
             range = this._getUpdatedRange(date, this.getStartValue(), this.getEndValue());
             this.getChildControlByName('DateRangeHeader').setRange(range[0], range[1]);
         }
         picker.setActive(true);
      },
      _startDatePickerResetActive: function (date) {
         this._startDatePicker.setDate(date || this.getStartValue(), true);
         this.getChildControlByName('DateRangeHeader').setRange(this.getStartValue(), this.getEndValue());
      },
      _endDatePickerResetActive: function (date) {
         this._endDatePicker.setDate(date || this.getEndValue(), true);
         this.getChildControlByName('DateRangeHeader').setRange(this.getStartValue(), this.getEndValue());
      },
      _datePickersResetActive: function () {
         this._startDatePickerResetActive();
         this._endDatePickerResetActive();
         this.getChildControlByName('DateRangeHeader').setRange(this.getStartValue(), this.getEndValue());
      },

      _getItemIdByItemContainer: function (container) {
         var itemContainer, item;
         itemContainer = container.closest('.controls-RangeSelectable__item');
         item = parseInt(itemContainer.attr(this._selectedRangeItemIdAtr), 10);
         return item;
      },

      _onRangeControlMouseLeave: function (selectionType, e) {
         if (this.getRangeSelectionType() === selectionType) {
            DateRangeBigChoose.superclass._onRangeControlMouseLeave.call(this);
         }
         if (this.isSelectionProcessing()) {
            this._startDatePickerResetActive();
            this._endDatePickerResetActive();
         }
      },

      _getSelectedRangeItemByItemId: function (itemId, selectionType) {
         var year = this._getCurrentYear();
         // Преобразуем item из числового идентификатора в дату
         switch(selectionType) {
            case selectionTypes.years:
               return new Date(itemId, 0, 1);
         }
      },

      _getItemSelector: function (rangeSelector) {
         return ['.', rangeSelector, ' .', this._SELECTABLE_RANGE_CSS_CLASSES.item].join('');
      },

      _selectionToggle: function (item, selectionType) {
         var containerCssClass, start, end, range;

         switch(selectionType) {
            case selectionTypes.years:
               containerCssClass = css_classes.range_containers.years;
               // if (this.isSelectionProcessing()) {
               //    this._toggleChooseYear();
               // }
               break;
         }

         if (this.getRangeSelectionType() !== selectionType) {
            this.cancelSelection();
            this._setRangeSelectionType(selectionType);
            this._$items =  this.getContainer().find(this._getItemSelector(containerCssClass));
         }

         range = this._updateRange(item, item);
         if (this._options.quantum && 'years' in this._options.quantum && this._options.quantum.years.length === 1) {
            this.setRange(range[0], range[1]);
            this._setRangeSelectionType(selectionTypes.years);
            this._updateYearsBar();
            this._onSelectionEnded();
            this._monthRangePicker._clearMonthSelection();
         } else {
            this._onRangeItemElementClick(range[0], range[1]);
         }
         start = this.getStartValue();
         end = this.getEndValue();
         if (this.isSelectionProcessing()) {
            this.getContainer().addClass(css_classes.selectionProcessing);
            if (selectionType === selectionTypes.years) {
               // При клике на год меняется ототбражаемый год в календаре, необходимо обновить выделение текущего года
               // в панеле выбора интервала годов
               this._updateYearsBar();
            }
         } else {
            this.getContainer().removeClass(css_classes.selectionProcessing);
            if (selectionType !== selectionTypes.years){
               this._cancelRangeBarsSelection();
            }
         }
      },

      _updateRange: function (startDate, endDate) {
         if (isEmpty(this._options.quantum)) {
            return this._normalizeRange(startDate, endDate);
         }

         var quantum = this._options.quantum,
            lastQuantumLength, years, i;

         if ('years' in quantum) {
            for (i = 0; i < quantum.years.length; i++) {
               lastQuantumLength = quantum.years[i];
               years = endDate.getFullYear() - startDate.getFullYear() + 1;
               if (lastQuantumLength >= years) {
                  return this._getYearRange(startDate, endDate, lastQuantumLength);
               }
            }
         }

         return this._getYearRange(startDate, endDate, lastQuantumLength);
      },

      _getYearRange: function (startDate, endDate, quantum) {
         var date = new Date(startDate);
         if (startDate <= endDate) {
            date.setYear(date.getFullYear() + quantum - 1);
            return [endDate, date]
         } else {
            date.setYear(date.getFullYear() - quantum + 1);
            return [date, endDate]
         }
      },

      _getSelectedRangeItemsIds: function (start, end) {
         var items = [],
            showStart = true, showEnd = true,
            startYear, endYear;

         if (this.getRangeSelectionType() === selectionTypes.years) {
            endYear = parseInt(this.getChildControlByName('YearsRangeBtn5').getCaption());
            startYear = endYear - 6;
         } else {
            startYear = this._getCurrentYear();
            endYear = startYear;
         }

         if (start.getFullYear() > endYear || end.getFullYear() < startYear) {
            return {items: items, start: null, end: null};
         }
         if (start.getFullYear() < startYear) {
            start = new Date(startYear, 0, 1);
            showStart = false;
         }
         if (end.getFullYear() > endYear) {
            end = new Date(endYear, 11, 1);
            showEnd = false;
         }

         while (start <= end) {
            if (!this.getRangeSelectionType()) {
               break
            }
            items.push(this._selectedRangeItemToString(start));
            switch(this.getRangeSelectionType()) {
               case selectionTypes.years:
                  start = new Date(start.getFullYear() + 1, 0, 1);
                  break;
            }
         }
         return {
            items:items,
            start: showStart ? items[0] : null,
            end: showEnd ? items[items.length - 1] : null
         };
      },

      _selectedRangeItemToString: function (item) {
         switch(this.getRangeSelectionType()) {
            case selectionTypes.years:
               return item.getFullYear().toString();
         }
      },

      _getQuarterByDate: function (date) {
         return (date.getMonth() / 3 | 0) + 1;
      },

      _getHalfyearByDate: function (date) {
         return (date.getMonth() / 6 | 0) + 1;
      },

      /**
       * Отменяет начатый пользователем процесс выделения.
       */
      cancelSelection: function () {
         if (this.isSelectionProcessing()) {
            this._cancelRangeBarsSelection();
         }

         this._setRangeSelectionType(null);
         this._monthRangePicker.cancelSelection();
         // this._dateRangePicker.cancelSelection();
      },
      _cancelRangeBarsSelection: function () {
         this._setRangeSelectionType(null);
         this._rangeSelection = false;
         this._rangeSelectionEnd = null;
         this._clearYearsBarSelection();
      },

      _isDatesEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getTime() === date2.getTime());
      },
      _isMonthEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth());
      },

      _drawRangeSelection: function () {
         switch(this.getRangeSelectionType()) {
            case selectionTypes.years:
               this._updateYearsBar();
               return;
         }
         return DateRangeBigChoose.superclass._drawRangeSelection.apply(this, arguments);
      },

      _clearYearsBarSelection: function () {
         this._updateYearsBar(null, true);
      },

      _updateYearsBar: function (lastYear, withoutSelection) {
         if (this.getRangeSelectionType() !== selectionTypes.years) {
            withoutSelection = true;
         }
         lastYear = lastYear || this._options.yearPanelData[this._options.yearPanelData.length - 1].caption;
         this._options.yearPanelLastYear = lastYear;
         this._options.yearPanelData = this._getYearsRangeItems(lastYear, this._options, withoutSelection);
         this.getContainer().find('.' + css_classes.range_containers.years).replaceWith(yearsPanelTpl(this._options));
      },

      _getYearsRangeItems: function (lastYear, options, withoutSelection) {
         options = options || this._options;

         var items = [],
            buttonsCount = 6,
            currentYear = (new Date()).getFullYear(),
            selectionRangeEndItem = this._getSelectionRangeEndItem(),
            range = this._getUpdatedRange(options.startValue, options.endValue, selectionRangeEndItem),
            startYear = range[0].getFullYear(),
            endYear = range[1].getFullYear(),
            hoverYear = selectionRangeEndItem && selectionRangeEndItem.getFullYear(),
            item, year;

         lastYear = lastYear || options.yearPanelData[buttonsCount - 1].caption;

         for (var i = 0; i < buttonsCount; i++) {
            year = lastYear - buttonsCount + 1 + i;
            item = {
               caption: year,
               isDisplayed: false,
               isCurrent: false
               // selected: false,
               // selectedStart: false,
               // selectedEnd: false
            };
            item.displayed = year === options.displayedYear;
            item.current = year === currentYear;
            if (!withoutSelection) {
               item.selectionProcessing = this._rangeSelection;
               item.selected = (year >= startYear && year <= endYear);
               item.selectedStart = (year === startYear);
               item.selectedEnd = (year === endYear);
               item.selectedUnfinishedStart = (year === startYear && year === hoverYear && startYear !== endYear);
               item.selectedUnfinishedEnd = (year === endYear && year === hoverYear && startYear !== endYear);
               item.selectedInner = (year > startYear && year < endYear);
            }
            items.push(item);
         }
         return items;
      }
   });

   DateRangeBigChoose.headerTypes = headerTypes;

   return DateRangeBigChoose;
});
