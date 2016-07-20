define('js!SBIS3.CONTROLS.DateRangeBigChoose',[
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.DateRangeBigChoose',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.RangeSelectableViewMixin',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.DatePicker',
   'js!SBIS3.CONTROLS.DateRangeBig.DateRangePicker',
   'js!SBIS3.CONTROLS.DateRangeBig.MonthRangePicker'
], function (CompoundControl, dotTplFn, RangeMixin, RangeSelectableViewMixin, DateUtil) {
   'use strict';

   var
      YEAR_CHOOSER_STATE_1YEAR = 0,
      YEAR_CHOOSER_STATE_YEARS = 1,
      css_classes = {
         selected: 'controls-DateRangeBigChoose__selected',
         selectedInner: 'controls-DateRangeBigChoose__selectedInner',

         range_containers: {
            years: 'controls-DateRangeBigChoose__yearsRange',
            halfyears: 'controls-DateRangeBigChoose__months-halfyearRange',
            quarters: 'controls-DateRangeBigChoose__months-quarterRange',
            // months: 'controls-DateRangeBigChoose__months-month',
            daysMonth: 'controls-DateRangeBigChoose__dates-months'
         },

         rangeButton: 'controls-DateRangeBigChoose__rangeButton'
      },
      selectionTypes = {
         years: 'years',
         halfyear: 'halfyear',
         quarters: 'quarter',
         months: 'months',
         days: 'days',
         daysMonths: 'daysMonths'
      },
      states = {
         months: 'months',
         days: 'days'
      };

   var DateRangeBigChoose = CompoundControl.extend([RangeSelectableViewMixin, RangeMixin], {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
               
         },
         // _currentYear: null,
         _state: states.months,
         _selectionType: null,
         _toggleStateBtn: null,
         _currentYearBtn: null,
         _yearButtons: [],
         _yearChooserState: YEAR_CHOOSER_STATE_1YEAR
      },

      selectionTypes: selectionTypes,

      $constructor: function () {
      },

      init: function () {
         var self = this,
            container = this.getContainer();

         var rangeButtonHandlerWrapper = function (func) {
            var container = this.hasOwnProperty('getContainer')? this.getContainer(): $(this);
            func.call(self, $(this).attr('data-item'));
         };

         DateRangeBigChoose.superclass.init.call(this);
         
         if (this._options.startValue) {
            this._options.startValue = DateUtil.valueToDate(this._options.startValue);
         }

         if (this._options.endValue) {
            this._options.endValue = DateUtil.valueToDate(this._options.endValue);
         }
         
         this._setCurrentYear(this._options.startValue ? this._options.startValue.getFullYear() : (new Date()).getFullYear());
         
         this._toggleChooseYearBtn = this.getChildControlByName('ToggleChooseYearButton');
         this._currentYearBtn = this.getChildControlByName('CurrentYearButton');

         this._toggleChooseYearBtn.subscribe('onActivated', this._toggleChooseYear.bind(this));
         this._currentYearBtn.subscribe('onActivated', this._onCurrentYearBtnClick.bind(this));

         this.getChildControlByName('PrevYearButton').subscribe('onActivated', this._onPrevYearBtnClick.bind(this));
         this.getChildControlByName('NextYearButton').subscribe('onActivated', this._onNextYearBtnClick.bind(this));
         this.getChildControlByName('BackToYearButton').subscribe('onActivated', this._onBackToYearBtnClick.bind(this));

         this._initRangeButtonControl(selectionTypes.years, 'YearsRangeBtn', 6);
         this._initRangeButtonControl(selectionTypes.quarters, 'QuarterRangeBtn', 4);
         this._initRangeButtonControl(selectionTypes.halfyear, 'HalfyearRangeBtn', 2);

         this._initRangeButtonControl(selectionTypes.daysMonths, 'MonthRangeBtn', 12);

         container.find('.' + this.yearsRangeContainer + ' .' + this.rangeButton)
            .mouseenter(rangeButtonHandlerWrapper.bind(null, this._onYearsRangeBtnEnter));

         this.getChildControlByName('MonthDateRangePicker').subscribe('onRangeChange', this._onInnerComponentRangeChange.bind(this));

         this.getChildControlByName('MonthRangePicker').subscribe('onMonthActivated', function (e, month) {
            self.applyMonthState(month.getMonth());
         });

         this.subscribe('onRangeChange', this._onRangeChange.bind(this));
      },

      /**
       * Обработчик вызывающийся при изменении выбранного диапазона. Обновляет диапазоны во внутренних компонентах.
       * @param e
       * @param startValue
       * @param endValue
       * @private
       */
      _onRangeChange: function (e, startValue, endValue) {
         // Обновляем контекст, что бы обновились компоненты через биндинг
         // TODO: выпилить
         this.getLinkedContext().setValue('startValue', startValue);
         this.getLinkedContext().setValue('endValue', endValue);
         
         this.getChildControlByName('MonthRangePicker').setRange(startValue, endValue);
         // this.getChildControlByName('MonthDateRangePicker').setRange(startValue, endValue);
         this._setCurrentYear(parseInt(endValue.getFullYear(), 10));
      },

      _onInnerComponentRangeChange: function (e, startValue, endValue) {
         this._clearAllSelection();
         this.setRange(startValue, endValue);
      },

      applyMonthState: function (monthNumber) {
         var container = this.getContainer();
         this.state = states.months;
         container.find('.controls-DateRangeBigChoose__dates').removeClass('ws-hidden');
         container.find('.controls-DateRangeBigChoose__months').addClass('ws-hidden');
         this.getChildControlByName('BackToYearButton').show();
      },

      applyYearState: function (monthNumber) {
         var container = this.getContainer();
         this.state = states.months;
         container.find('.controls-DateRangeBigChoose__dates').addClass('ws-hidden');
         container.find('.controls-DateRangeBigChoose__months').removeClass('ws-hidden');
         this.getChildControlByName('BackToYearButton').hide();
      },

      _initRangeButtonControl: function (selectionType, baseButtonName, buttonsCount) {
         for (var i = 0; i < buttonsCount; i++) {
            this.getChildControlByName(baseButtonName + i).subscribe('onActivated', this._onRangeBtnClick.bind(this, selectionType));
         }
      },

      _onPrevYearBtnClick: function () {
         var year;
         if (this._yearChooserState === YEAR_CHOOSER_STATE_1YEAR) {
            this._setCurrentYear(this._getCurrentYear() - 1);
         } else {
            year = parseInt(this.getChildControlByName('YearsRangeBtn5').getCaption(), 10);
            this._updateYearsRange(year - 1);
         }

      },

      _onNextYearBtnClick: function () {
         var year;
         if (this._yearChooserState === YEAR_CHOOSER_STATE_1YEAR) {
            this._setCurrentYear(this._getCurrentYear() + 1);
         } else {
            year = parseInt(this.getChildControlByName('YearsRangeBtn5').getCaption(), 10);
            this._updateYearsRange(year + 1);
         }
      },

      _onBackToYearBtnClick: function () {
         this.applyYearState();
      },

      _getCurrentYear: function () {
         return this.getLinkedContext().getValue('currentYear');
      },
      _setCurrentYear: function (value) {
         this.getLinkedContext().setValue('currentYear', value);
         this.getChildControlByName('MonthRangePicker').setYear(value);
      },

      _toggleChooseYear: function (e) {
         var container = this.getContainer();
         if (this._yearChooserState === YEAR_CHOOSER_STATE_1YEAR) {
            this._yearChooserState = YEAR_CHOOSER_STATE_YEARS;
            this._cancelPreviousSelection();
            this._updateYearsRange(this._getCurrentYear());
            container.find('.controls-DateRangeBigChoose__years-year').addClass('ws-hidden');
            container.find('.controls-DateRangeBigChoose__yearsRange').removeClass('ws-hidden');
         } else {
            this._yearChooserState = YEAR_CHOOSER_STATE_1YEAR;
            container.find('.controls-DateRangeBigChoose__years-year').removeClass('ws-hidden');
            container.find('.controls-DateRangeBigChoose__yearsRange').addClass('ws-hidden');
         }
      },

      _onCurrentYearBtnClick: function () {
         this.setRange(new Date(this._getCurrentYear(), 0, 1), new Date(this._getCurrentYear() + 1, 0, 0));
      },

      _updateYearsRange: function (lastYear) {
         var buttonsCount = 6,
            btn, year;
         for (var i = 0; i < buttonsCount; i++) {
            year = lastYear - buttonsCount + 1 + i;
            btn = this.getChildControlByName('YearsRangeBtn' + i);
            btn.setCaption(year);
            btn.getContainer().attr(this._selectedRangeItemIdAtr, year)
         }
      },

      setEndValue: function (end, silent) {
         // Выделение происходит разными периодами а интерфейс должен возвращать выделение днями,
         // поэтому всегда устанавливаем конец на последний день этого периода.

         switch(this.getSelectionType()) {
            case selectionTypes.years:
               end = new Date(end.getFullYear() + 1, 0, 0);
               break;
            case selectionTypes.halfyear:
               end = new Date(end.getFullYear(), (end.getMonth()/6|0)*6 + 6, 0);
               break;
            case selectionTypes.quarters:
               end = new Date(end.getFullYear(), (end.getMonth()/3|0)*3 + 3, 0);
               break;
            case selectionTypes.daysMonths:
               end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
               break;
         }
         return DateRangeBigChoose.superclass.setEndValue.call(this, end, silent);
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
         var item = parseInt(e.getTarget().getContainer().attr(this._selectedRangeItemIdAtr), 10);

         this._selectionToggle(item, selectionType);
      },

      _onRangeBtnEnter: function (e) {

      },

      _getItemSelector: function (rangeSelector) {
         return ['.', rangeSelector, ' .', this._SELECTABLE_RANGE_CSS_CLASSES.item].join('');
      },

      _selectionToggle: function (item, selectionType) {
         var containerCssClass,
            year = this._getCurrentYear();

         // Преобразуем item из числового идентификатора в дату
         switch(selectionType) {
            case selectionTypes.years:
               containerCssClass = css_classes.range_containers.years;
               item = new Date(item, 0, 1);
               break;
            case selectionTypes.halfyear:
               containerCssClass = css_classes.range_containers.halfyears;
               item = new Date(year, (item - 1) * 6, 1);
               break;
            case selectionTypes.quarters:
               containerCssClass = css_classes.range_containers.quarters;
               item = new Date(year, (item - 1)* 3, 1);
               break;
            case selectionTypes.daysMonths:
               containerCssClass = css_classes.range_containers.daysMonth;
               item = new Date(year, item, 1);
               break;
         }

         if (this.getSelectionType() !== selectionType) {
            this._cancelPreviousSelection();
            this._setSelectionType(selectionType);
            this._$items =  this.getContainer().find(this._getItemSelector(containerCssClass));
         }

         this._onRangeItemElementClick(item);

         if (!this.isSelectionProcessing()){
            this._cancelPreviousSelection();
         }
      },

      _getSelectedRangeItems: function (start, end) {
         var items = [],
            curYear = this._getCurrentYear();
         if (start.getFullYear() > curYear || end.getFullYear() < curYear) {
            return items;
         }
         if (start.getFullYear() < curYear) {
            start = new Date(curYear, 0, 1);
         }
         if (end.getFullYear() > curYear) {
            end = new Date(curYear, 11, 1);
         }
         while (start <= end) {
            if (!this.getSelectionType()) {
               break
            }
            items.push(start);
            switch(this.getSelectionType()) {
               case selectionTypes.years:
                  start = new Date(start.getFullYear() + 1, 0, 1);
                  break;
               case selectionTypes.halfyear:
                  start = new Date(start.getFullYear(), (start.getMonth()/6|0)*6 + 6, 1);
                  break;
               case selectionTypes.quarters:
                  start = new Date(start.getFullYear(), (start.getMonth()/3|0)*3 + 3, 1);
                  break;
               case selectionTypes.daysMonths:
                  start = new Date(start.getFullYear(), start.getMonth() + 1, 1);
                  break;
            }
         }
         return items;
      },

      _selectedRangeItemToString: function (item) {
         switch(this.getSelectionType()) {
            case selectionTypes.years:
               return item.getFullYear().toString();
               break;
            case selectionTypes.halfyear:
               return this._getHalfyearByDate(item).toString();
               break;
            case selectionTypes.quarters:
               return this._getQuarterByDate(item).toString();
               break;
            case selectionTypes.daysMonths:
               return item.getMonth().toString();
               break;
         }
      },

      _getQuarterByDate: function (date) {
         return (date.getMonth() / 3 | 0) + 1;
      },

      _getHalfyearByDate: function (date) {
         return (date.getMonth() / 6 | 0) + 1;
      },

      _cancelPreviousSelection: function () {
         this._setSelectionType(null);
         this._rangeSelection = false;
         this._rangeSelectionEnd = null;
         this._clearAllSelection();
      },
      _clearAllSelection: function () {
         for (var css in css_classes.range_containers) {
            if (css_classes.range_containers.hasOwnProperty(css)) {
               this._$items = this.getContainer().find(this._getItemSelector(css_classes.range_containers[css]));
               this._clearRangeSelection();
            }
         }
         this._$items = null;
      }

   });
   return DateRangeBigChoose;
});
