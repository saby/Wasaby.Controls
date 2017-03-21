define('js!SBIS3.CONTROLS.DateRangeBigChoose',[
   "Core/constants",
   "js!SBIS3.CORE.CompoundControl",
   "html!SBIS3.CONTROLS.DateRangeBigChoose",
   "js!SBIS3.CONTROLS.RangeMixin",
   "js!SBIS3.CONTROLS.RangeSelectableViewMixin",
   "js!SBIS3.CONTROLS.Utils.DateUtil",
   "Core/helpers/event-helpers",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.IconButton",
   "js!SBIS3.CONTROLS.Link",
   "js!SBIS3.CONTROLS.DateBox",
   "js!SBIS3.CONTROLS.DateRangeBigChoose.DateRangePicker",
   "js!SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker",
   "js!SBIS3.CORE.CloseButton",
   "js!SBIS3.CONTROLS.DateRangeBigChoose.Validators",
   "browser!js!SBIS3.CONTROLS.ListView/resources/SwipeHandlers",
   'i18n!SBIS3.CONTROLS.DateRangeBigChoose',
   'css!SBIS3.CONTROLS.DateRangeBigChoose'

], function ( constants,CompoundControl, dotTplFn, RangeMixin, RangeSelectableViewMixin, DateUtil, eHelpers) {
   'use strict';

   var
      YEAR_CHOOSER_STATE_1YEAR = 0,
      YEAR_CHOOSER_STATE_YEARS = 1,
      css_classes = {
         currentYear: 'controls-DateRangeBigChoose__currentYear',
         selectionProcessing: 'controls-DateRangeBigChoose__selectionProcessing',

         // Ключи должны совпадать с соотыветствующими selectionTypes
         range_containers: {
            years: 'controls-DateRangeBigChoose__yearsRange',
            halfyears: 'controls-DateRangeBigChoose__months-halfyearRange',
            quarters: 'controls-DateRangeBigChoose__months-quarterRange',
            // months: 'controls-DateRangeBigChoose__months-month',
            months: 'controls-DateRangeBigChoose__dates-months'
         }
      },
      selectionTypes = {
         years: 'years',
         halfyears: 'halfyears',
         quarters: 'quarters',
         months: 'months',
         days: 'days'
      },
      states = {
         month: 'month',
         year: 'year'
      };

   var DateRangeBigChoose = CompoundControl.extend([RangeSelectableViewMixin, RangeMixin], {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            mask: 'DD.MM.YY'
         },
          _keysWeHandle: [
             constants.key.tab,
             constants.key.enter,
             constants.key.esc
          ],
         // _currentYear: null,
         _state: states.year,
         _selectionType: null,
         _toggleStateBtn: null,
         _currentYearBtn: null,
         _yearButtons: [],
         _yearChooserState: YEAR_CHOOSER_STATE_1YEAR,

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
         
         if (this._options.startValue) {
            this._options.startValue = DateUtil.valueToDate(this._options.startValue);
         }

         if (this._options.endValue) {
            this._options.endValue = DateUtil.valueToDate(this._options.endValue);
         }
         
         this._setCurrentYear(this._options.startValue ? this._options.startValue.getFullYear() : (new Date()).getFullYear(), true);
         
         this._toggleChooseYearBtn = this.getChildControlByName('ToggleChooseYearButton');
         this._currentYearBtn = this.getChildControlByName('CurrentYearButton');

         this._toggleChooseYearBtn.subscribe('onActivated', this._toggleChooseYear.bind(this));

         this._currentYearBtn.subscribe('onActivated', this._onCurrentYearBtnClick.bind(this));
         this._currentYearBtn.getContainer().mouseenter(this._yearBtnMouseEnter.bind(this));
         this._currentYearBtn.getContainer().mouseleave(this._yearBtnMouseLeave.bind(this));

         this.getChildControlByName('HomeButton').subscribe('onActivated', this._onHomeButtonClick.bind(this));

         this.getChildControlByName('ApplyButton').subscribe('onActivated', this._onApplyButtonClick.bind(this));
         this.getChildControlByName('CloseButton').subscribe('onActivated', this._onCloseButtonClick.bind(this));

         this.getChildControlByName('PrevYearButton').subscribe('onActivated', this._onPrevOrNextYearBtnClick.bind(this, -1));
         this.getChildControlByName('NextYearButton').subscribe('onActivated', this._onPrevOrNextYearBtnClick.bind(this, 1));
         this.getChildControlByName('BackToYearButton').subscribe('onActivated', this._onBackToYearBtnClick.bind(this));

         container.find('.controls-DateRangeBigChoose__months-toStart').click(this._toStartMonth.bind(this));
         container.find('.controls-DateRangeBigChoose__months-toEnd').click(this._toEndMonth.bind(this));

         this._initRangeButtonControl(selectionTypes.years, 'YearsRangeBtn', 6);
         this._initRangeButtonControl(selectionTypes.quarters, 'QuarterRangeBtn', 4);
         this._initRangeButtonControl(selectionTypes.halfyears, 'HalfyearRangeBtn', 2);

         this._initRangeButtonControl(selectionTypes.months, 'MonthRangeBtn', 12);
         this._initRangeContainers();

         container.find('.' + this.yearsRangeContainer + ' .' + this._SELECTABLE_RANGE_CSS_CLASSES.item)
            .mouseenter(rangeButtonHandlerWrapper.bind(null, this._onYearsRangeBtnEnter));

         this._monthRangePicker = this.getChildControlByName('MonthRangePicker');
         this._dateRangePicker = this.getChildControlByName('MonthDateRangePicker');
         this._monthRangePicker.subscribe('onRangeChange', this._onInnerComponentRangeChange.bind(this));
         this._dateRangePicker.subscribe('onRangeChange', this._onInnerComponentRangeChange.bind(this));
         this._dateRangePicker.subscribe('onActivated', this._onDateRangePickerActivated.bind(this));

         this._monthRangePicker.subscribe('onMonthActivated', function (e, month) {
            if (!this._monthRangePicker.isSelectionProcessing() && !this.getSelectionType()) {
               self.applyMonthState(month);
            }
         }.bind(this));
         this._monthRangePicker.subscribe('onSelectionStarted', function (e) {
            this.getContainer().addClass(css_classes.selectionProcessing);
         }.bind(this));
         this._monthRangePicker.subscribe('onSelectionEnded', function (e) {
            this.getContainer().removeClass(css_classes.selectionProcessing);
         }.bind(this));

         eHelpers.wheel(container.find('.controls-DateRangeBigChoose__months-month-picker'), this._onMonthPickerWheel.bind(this));
         eHelpers.wheel(container.find('.controls-DateRangeBigChoose__dates-dates'), this._onDatesPickerWheel.bind(this));
         if (constants.browser.isMobileIOS) {
            container.find('.controls-DateRangeBigChoose__months-month-picker').on('swipeVertical', this._onMonthPickerSwipe.bind(this));
            container.find('.controls-DateRangeBigChoose__dates-dates').on('swipeVertical', this._onDatesPickerSwipe.bind(this));
            container.find('.controls-DateRangeBigChoose__months-month-picker').on('touchmove', function(event){event.preventDefault()});
            container.find('.controls-DateRangeBigChoose__dates-dates').on('touchmove', function(event){event.preventDefault()});
         }
         this._startDatePicker = this.getChildControlByName('DatePickerStart');
         this._endDatePicker = this.getChildControlByName('DatePickerEnd');
         this._startDatePicker.setDate(self.getStartValue());
         this._endDatePicker.setDate(self.getEndValue());
         this._startDatePicker.subscribe('onTextChange', this._onDatePickerStartDateChanged.bind(this));
         this._endDatePicker.subscribe('onTextChange', this._onDatePickerEndDateChanged.bind(this));

         this._startDatePicker.subscribe('onInputFinished', function() {
            self._endDatePicker.setActive(true);
         });

         this.subscribe('onRangeChange', this._onRangeChange.bind(this));

         if (this._options.rangeselect) {
            this.applyYearState();
         } else {
            this.applyMonthState(this._options.startValue? this._options.startValue: new Date());
         }
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

      _onHomeButtonClick: function () {
         var now = new Date();
         now.setDate(1);
         this._setCurrentYear(now.getFullYear(), true);
         this._monthRangePicker.setYear(now.getFullYear());
         this._dateRangePicker.setMonth(now);
         this._updateYearsRange(now.getFullYear());
         now = new Date();
         this.setRange(now, now);
      },

      _onApplyButtonClick: function () {
         if (this._startDatePicker.validate() && this._endDatePicker.validate()) {
            this.cancelSelection();
            this._dateRangePicker.cancelSelection();
            this._notify('onChoose', this.getStartValue(), this.getEndValue());
         }
      },
      _onCloseButtonClick: function () {
         this.cancelSelection();
         this._dateRangePicker.cancelSelection();
         this._notify('onCancel', this.getStartValue(), this.getEndValue());
      },

      _toStartMonth: function () {
         var start = this.getStartValue();
         if (start) {
            start = start.getFullYear();
            this._setCurrentYear(start);
            this._updateYearsRange(start);
         }
      },

      _toEndMonth: function () {
         var end = this.getEndValue();
         if (end) {
            end = end.getFullYear();
            this._setCurrentYear(end);
            this._updateYearsRange(end);
         }
      },

      _yearBtnMouseEnter: function () {
         if (this._state === states.year) {
            this.getContainer().addClass('controls-DateRangeBigChoose__yearHovered');
         }
      },

      _yearBtnMouseLeave: function () {
         if (this._state === states.year) {
            this.getContainer().removeClass('controls-DateRangeBigChoose__yearHovered');
         }
      },

      _onDatePickerStartDateChanged: function(e) {
         var date = this._startDatePicker.getDate(),
            oldStartDate = this.getStartValue(),
            endDate = this._endDatePicker.getDate();
         if (!date) {
            return;
         }
         if (oldStartDate && oldStartDate.getTime() === date.getTime()) {
            return;
         }
         if (endDate && date > endDate) {
            // setRange не вызываем, диапазон установится в обработчике _onDatePickerEndDateChanged
            // TODO: когда будет возможность установить свойство без генерации событий надо будет убрать этот хак.
            // this._endDatePicker.setDate(date);
            return;
         } else {
            if (this._options.rangeselect) {
               this.setStartValue(date);
            } else {
               this.setRange(date, date);
            }

         }
         if (!endDate) {
            this._setCurrentYear(date.getFullYear(), true);
            if (this._state === states.year) {
               this._monthRangePicker.setYear(date.getFullYear());
            } else {
               this._dateRangePicker.setMonth(date);
            }
         }
      },

      _onDatePickerEndDateChanged: function(e) {
         var date = this._endDatePicker.getDate(),
            startDate = this._startDatePicker.getDate(),
            oldEndDate = this.getEndValue();

         if (!date || (oldEndDate && date.getTime() === oldEndDate.getTime())) {
            return;
         }
         if (startDate && date < startDate) {
            // date = startDate
            return;
         }
         this.setRange(startDate, date);
         this._setCurrentYear(date.getFullYear(), true);
         if (this._state === states.year) {
            this._monthRangePicker.setYear(date.getFullYear());
         } else {
            this._dateRangePicker.setMonth(date);
         }
      },

      setStartValue: function (start, silent) {
         var changed = DateRangeBigChoose.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            if (!this._options.rangeselect && start) {
               this._dateRangePicker.setMonth(start);
               this._setCurrentYear(start.getFullYear(), true);
               this._updateYearsRange(start.getFullYear());
            }
         }
         return changed;
      },

      setRange: function (start, end, silent) {
         var oldStart, oldEnd, changed;

         if (this._options.rangeselect) {
            oldStart = this.getStartValue();
            oldEnd = this.getEndValue();
            changed = DateRangeBigChoose.superclass.setRange.apply(this, arguments);
            start = this.getStartValue();
            end = this.getEndValue();
            if (start && !this._isDatesEqual(start, oldStart) && !this._isDatesEqual(end, oldEnd)) {
               // this._dateRangePicker.setMonth(start);
               this._setCurrentYear(start.getFullYear(), true);
               // this._updateYearsRange(parseInt(start.getFullYear(), 10));
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
            this._startDatePicker.setDate(startValue);
         }
         if ((end != endValue) ||
            (end && endValue && (end.toSQL() !==  endValue.toSQL()))) {
            this._endDatePicker.setDate(endValue);
         }

         if (this._state === states.year) {
            this._monthRangePicker.setRange(startValue, endValue, true);
         } else if (this._state === states.month) {
            this._dateRangePicker.setRange(startValue, endValue, true);
         }

         if (this.getSelectionType() === selectionTypes.years) {
            year = parseInt(endValue.getFullYear(), 10)
            this._setCurrentYear(year);
            // this._updateYearsRange(year);
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
         this._clearAllSelection();
         this._setYearBarState(YEAR_CHOOSER_STATE_1YEAR);
         this._setSelectionType(null);
         this.setRange(startValue, endValue);
      },

      applyMonthState: function (month) {
         var container = this.getContainer();
         this.cancelSelection();
         this._state = states.month;
         this.getChildControlByName('BackToYearButton').show();
         this._dateRangePicker.cancelSelection();
         this._dateRangePicker.setRange(this.getStartValue(), this.getEndValue(), true);
         this._dateRangePicker.setMonth(month);
         container.find('.controls-DateRangeBigChoose__dates').removeClass('ws-hidden');
         container.find('.controls-DateRangeBigChoose__months').addClass('ws-hidden');
         this._dateRangePicker._updateMonthsPosition();
         this._setCurrentYear(month.getFullYear(), true);
         this._updateYearsRange(month.getFullYear());
      },

      applyYearState: function (monthNumber) {
         this.cancelSelection();
         var container = this.getContainer();
         this._state = states.year;
         container.find('.controls-DateRangeBigChoose__dates').addClass('ws-hidden');
         container.find('.controls-DateRangeBigChoose__months').removeClass('ws-hidden');
         this.getChildControlByName('BackToYearButton').hide();
         this._monthRangePicker.setRange(this.getStartValue(), this.getEndValue());
         this.getChildControlByName('MonthRangePicker').setYear(this._getCurrentYear());
      },

      _initRangeButtonControl: function (selectionType, baseButtonName, buttonsCount) {
         var control;
         for (var i = 0; i < buttonsCount; i++) {
            control = this.getChildControlByName(baseButtonName + i);
            control.subscribe('onActivated', this._onRangeBtnClick.bind(this, selectionType));
            control.getContainer().mouseenter(this._onRangeBtnEnter.bind(this, selectionType));
         }
      },

      _initRangeContainers: function () {
         var classes = [],
             container = this.getContainer();
         for (var cls in css_classes.range_containers) {
            if (css_classes.range_containers.hasOwnProperty(cls)) {
               container.find(
                   ['.', css_classes.range_containers[cls]].join('')
               ).mouseleave(
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
         var year, control;
         if (this._yearChooserState === YEAR_CHOOSER_STATE_1YEAR) {
            year = this._getCurrentYear();
            this._setCurrentYear(year + direction);
         } else {
            year = parseInt(this.getChildControlByName('YearsRangeBtn5').getCaption(), 10);
            this._updateYearsRange(year + direction);
         }
         if (this.getStartValue() && this.getEndValue()) {
            this._drawCurrentRangeSelection();
         }
         this._updateRangeIndicators();
      },

      _onMonthPickerWheel: function (event) {
         var direction = event.wheelDelta > 0 ? -1 : 1,
            year = this._getCurrentYear() + direction;
         this._onPrevOrNextYearBtnClick(direction);
         this._setCurrentYear(year);
         this._updateYearsRange(year);
         this._updateRangeIndicators();
      },

      _onDatesPickerWheel: function (event) {
         var direction = event.wheelDelta > 0 ? -1 : 1,
            month = this._dateRangePicker.getMonth();
         month = new Date(month.getFullYear(), month.getMonth() + direction, 1);
         if ((month.getMonth() === 0 && direction > 0) || (month.getMonth() === 11 && direction < 0)) {
            this._setCurrentYear(month.getFullYear());
            this._updateYearsRange(month.getFullYear());
         }
         this._dateRangePicker.setMonth(month);
      },

      _onMonthPickerSwipe: function (event) {
         //TODO: избавиться от дублирования кода _onMonthPickerWheel
         var
            direction = event.direction === 'bottom' ? -1 : 1,
            year = this._getCurrentYear() + direction;
         this._onPrevOrNextYearBtnClick(direction);
         this._setCurrentYear(year);
         this._updateYearsRange(year);
         this._updateRangeIndicators();
      },

      _onDatesPickerSwipe: function (event) {
         //TODO: избавиться от дублирования кода _onDatesPickerWheel
         var
            direction = event.direction === 'bottom' ? -1 : 1,
            month = this._dateRangePicker.getMonth();
         month = new Date(month.getFullYear(), month.getMonth() + direction, 1);
         if ((month.getMonth() === 0 && direction > 0) || (month.getMonth() === 11 && direction < 0)) {
            this._setCurrentYear(month.getFullYear());
            this._updateYearsRange(month.getFullYear());
         }
         event.preventDefault();
         event.stopImmediatePropagation();
         this._dateRangePicker.setMonth(month);
      },

      _onBackToYearBtnClick: function () {
         this.applyYearState();
      },

      _getCurrentYear: function () {
         return this.getLinkedContext().getValue('currentYear');
      },
      _setCurrentYear: function (value, dontUpdatePickers) {
         if (value === this.getLinkedContext().getValue('currentYear')){
            return;
         }
         this.getLinkedContext().setValue('currentYear', value);
         if (!dontUpdatePickers) {
            this.getChildControlByName('MonthRangePicker').setYear(value);
            this.getChildControlByName('MonthDateRangePicker').setMonth(new Date(value, 0, 1));
         }
         this._updateRangeIndicators();
      },

      _toggleChooseYear: function () {
         if (this._yearChooserState === YEAR_CHOOSER_STATE_1YEAR) {
            this._setYearBarState(YEAR_CHOOSER_STATE_YEARS);
         } else {
            this._setYearBarState(YEAR_CHOOSER_STATE_1YEAR);
         }
         this.setActive(true);
      },

      _setYearBarState: function (state) {
         var container = this.getContainer(),
            year = (new Date()).getFullYear(),
            currentYear = this._getCurrentYear();
         if (this._yearChooserState === state) {
            return;
         }
         if (state === YEAR_CHOOSER_STATE_YEARS) {
            this._yearChooserState = YEAR_CHOOSER_STATE_YEARS;
            this.cancelSelection();
            this._updateYearsRange(year > currentYear && year - currentYear <= 5? year: currentYear);
            container.find('.controls-DateRangeBigChoose__years-year').addClass('ws-hidden');
            container.find('.controls-DateRangeBigChoose__yearsRange').removeClass('ws-hidden');
         } else {
            this._yearChooserState = YEAR_CHOOSER_STATE_1YEAR;
            container.find('.controls-DateRangeBigChoose__years-year').removeClass('ws-hidden');
            container.find('.controls-DateRangeBigChoose__yearsRange').addClass('ws-hidden');
         }
      },

      _onCurrentYearBtnClick: function () {
         if (this.isRangeselect()) {
            this.setRange(new Date(this._getCurrentYear(), 0, 1), new Date(this._getCurrentYear() + 1, 0, 0));
         }
         this.setActive(true);
      },

      _updateYearsRange: function (lastYear) {
         var buttonsCount = 6,
            container, btn, year;
         for (var i = 0; i < buttonsCount; i++) {
            year = lastYear - buttonsCount + 1 + i;
            btn = this.getChildControlByName('YearsRangeBtn' + i);
            btn.setCaption(year);
            container = btn.getContainer();
            container.attr(this._selectedRangeItemIdAtr, year);
            if (year === this._getCurrentYear()) {
               container.addClass(css_classes.currentYear);
            } else {
               container.removeClass(css_classes.currentYear);
            }
         }
      },

      setEndValue: function (end, silent) {
         // Выделение происходит разными периодами а интерфейс должен возвращать выделение днями,
         // поэтому всегда устанавливаем конец на последний день этого периода.
         if (this._options.rangeselect) {
            switch(this.getSelectionType()) {
               case selectionTypes.years:
                  end = new Date(end.getFullYear() + 1, 0, 0);
                  break;
               case selectionTypes.halfyears:
                  end = new Date(end.getFullYear(), (end.getMonth()/6|0)*6 + 6, 0);
                  break;
               case selectionTypes.quarters:
                  end = new Date(end.getFullYear(), (end.getMonth()/3|0)*3 + 3, 0);
                  break;
               case selectionTypes.months:
                  end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
                  break;
            }
         }

         return DateRangeBigChoose.superclass.setEndValue.call(this, end, silent);
      },

      _onDateRangePickerActivated: function (e, month) {
         this.setRange(new Date(month.getFullYear(), month.getMonth(), 1), new Date(month.getFullYear(), month.getMonth() + 1, 0))
      },

      // Логика связанная с панелями выбора диапазонов

      /**
       * Устанавливает способ которым выбирается диапазон.
       * @param value {String} текстовый идентификатор способа, которым устанавливается диапазон.
       */
      _setSelectionType: function (value) {
         this._selectionType = value;
      },
      /**
       * Возвращает текстовый ижентификатор способа, которым был выбран диапазон.
       * @returns {String}
       */
      getSelectionType: function () {
         return this._selectionType;
      },

      // Выбор периода по годам, полугодиям, кварталам и месяцам
      _onRangeBtnClick: function (selectionType, e) {
         var itemId = this._getItemIdByItemContainer(e.getTarget().getContainer()),
            item = this._getSelectedRangeItemByItemId(itemId, selectionType);
         if (this._options.rangeselect) {
            if (selectionType !== selectionTypes.years) {
               this._setYearBarState(YEAR_CHOOSER_STATE_1YEAR);
            }
            if (!this.isSelectionProcessing() && selectionType === selectionTypes.months && this._dateRangePicker.isSelectionProcessing()) {
               // Панель дапазона месяцев выбирает отображаемый месяц для MonthDateRangePicker когда
               // в MonthDateRangePicker происходит выделение диапазона.
               this._dateRangePicker.setMonth(item);
               return;
            } else if (selectionType === selectionTypes.years && this._state === states.month) {
               this._setCurrentYear(item.getFullYear());
               this._toggleChooseYear();
               return;
            }
            this._selectionToggle(item, selectionType);
         } else {
            if (selectionType === selectionTypes.months) {
               this._dateRangePicker.setMonth(item);
            } else if (selectionType === selectionTypes.years) {
               this._setCurrentYear(itemId);
               this._toggleChooseYear();
            }
         }
         this.setActive(true);
      },

      _onRangeBtnEnter: function (selectionType, e) {
         var itemId;
         if (selectionType === this.getSelectionType()) {
            itemId = this._getItemIdByItemContainer($(e.currentTarget));
            this._onRangeItemElementMouseEnter(this._getSelectedRangeItemByItemId(itemId, selectionType));
         }
         // if (selectionType === selectionTypes.months) {
         //    itemId = this._getItemIdByItemContainer($(e.currentTarget));
         //    this._dateRangePicker.setMonth(this._getSelectedRangeItemByItemId(itemId, selectionType));
         // }
      },

      _getItemIdByItemContainer: function (container) {
         var itemContainer, item;
         itemContainer = container.closest('.controls-RangeSelectable__item');
         item = parseInt(itemContainer.attr(this._selectedRangeItemIdAtr), 10);
         return item;
      },

      _onRangeControlMouseLeave: function (selectionType, e) {
         if (this.getSelectionType() === selectionType) {
            DateRangeBigChoose.superclass._onRangeControlMouseLeave.call(this);
         }
      },

      _getSelectedRangeItemByItemId: function (itemId, selectionType) {
         var year = this._getCurrentYear();
         // Преобразуем item из числового идентификатора в дату
         switch(selectionType) {
            case selectionTypes.years:
               return new Date(itemId, 0, 1);
            case selectionTypes.halfyears:
               return new Date(year, (itemId - 1) * 6, 1);
            case selectionTypes.quarters:
               return new Date(year, (itemId - 1)* 3, 1);
            case selectionTypes.months:
               return new Date(year, itemId, 1);
         }
      },

      _getItemSelector: function (rangeSelector) {
         return ['.', rangeSelector, ' .', this._SELECTABLE_RANGE_CSS_CLASSES.item].join('');
      },

      _selectionToggle: function (item, selectionType) {
         var containerCssClass, start, end;

         switch(selectionType) {
            case selectionTypes.years:
               containerCssClass = css_classes.range_containers.years;
               if (this.isSelectionProcessing()) {
                  this._toggleChooseYear();
               }
               break;
            case selectionTypes.halfyears:
               containerCssClass = css_classes.range_containers.halfyears;
               break;
            case selectionTypes.quarters:
               containerCssClass = css_classes.range_containers.quarters;
               break;
            case selectionTypes.months:
               this._dateRangePicker.setMonth(item);
               // this._dateRangePicker.setMonth(item);
               containerCssClass = css_classes.range_containers.months;
               break;
         }

         if (this.getSelectionType() !== selectionType) {
            this.cancelSelection();
            this._setSelectionType(selectionType);
            this._$items =  this.getContainer().find(this._getItemSelector(containerCssClass));
         }

         this._onRangeItemElementClick(item);
         start = this.getStartValue();
         end = this.getEndValue();
         if (this.isSelectionProcessing()) {
            this.getContainer().addClass(css_classes.selectionProcessing);
            if (selectionType === selectionTypes.months) {
               this._dateRangePicker.startSelection(start, end);
            }
         } else {
            this.getContainer().removeClass(css_classes.selectionProcessing);
            this._cancelRangeBarsSelection();
            if (selectionType === selectionTypes.months) {
               this._dateRangePicker.cancelSelection();
               if (this._isMonthEqual(start, end)) {
                  this._dateRangePicker.setEndValue(end);
               }
            }
         }
      },

      _getSelectedRangeItemsIds: function (start, end) {
         var items = [],
            showStart = true, showEnd = true,
            startYear, endYear;

         if (this.getSelectionType() === selectionTypes.years) {
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
            if (!this.getSelectionType()) {
               break
            }
            items.push(this._selectedRangeItemToString(start));
            switch(this.getSelectionType()) {
               case selectionTypes.years:
                  start = new Date(start.getFullYear() + 1, 0, 1);
                  break;
               case selectionTypes.halfyears:
                  start = new Date(start.getFullYear(), (start.getMonth()/6|0)*6 + 6, 1);
                  break;
               case selectionTypes.quarters:
                  start = new Date(start.getFullYear(), (start.getMonth()/3|0)*3 + 3, 1);
                  break;
               case selectionTypes.months:
                  start = new Date(start.getFullYear(), start.getMonth() + 1, 1);
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
         switch(this.getSelectionType()) {
            case selectionTypes.years:
               return item.getFullYear().toString();
            case selectionTypes.halfyears:
               return this._getHalfyearByDate(item).toString();
            case selectionTypes.quarters:
               return this._getQuarterByDate(item).toString();
            case selectionTypes.months:
               return item.getMonth().toString();
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

         this._monthRangePicker.cancelSelection();
         // this._dateRangePicker.cancelSelection();
      },
      _cancelRangeBarsSelection: function () {
         this._setSelectionType(null);
         this._rangeSelection = false;
         this._rangeSelectionEnd = null;
         this._clearAllSelection();
      },
      _clearAllSelection: function () {
         var items = this._$items;
         for (var css in css_classes.range_containers) {
            if (css_classes.range_containers.hasOwnProperty(css)) {
               this._$items = this.getContainer().find(this._getItemSelector(css_classes.range_containers[css]));
               this._clearRangeSelection();
            }
         }
         this._$items = items;
         this.getContainer().removeClass(css_classes.selectionProcessing);
      },

      _isDatesEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getTime() === date2.getTime());
      },
      _isMonthEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth());
      }
   });
   return DateRangeBigChoose;
});
