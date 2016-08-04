/*global define*/
define('js!SBIS3.CONTROLS.DateRange', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.PickerMixin',
   'html!SBIS3.CONTROLS.DateRange',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.FormWidgetMixin',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeBigChoose',
   'i18n!SBIS3.CONTROLS.DateRange',
   'js!SBIS3.CONTROLS.DatePicker',
   'js!SBIS3.CONTROLS.Button'
], function (CompoundControl, PickerMixin, dotTplFn, DateUtil, FormWidgetMixin, RangeMixin, DateRangeBigChoose) {
   'use strict';
   /**
    * SBIS3.CONTROLS.DateRange
    * @class SBIS3.CONTROLS.DateRange
    * @extends $ws.proto.CompoundControl
    * @author Крайнов Дмитрий Олегович
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDateRange
    */
   var DateRange = CompoundControl.extend([RangeMixin, PickerMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS.DateRange.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'left',
                  offset: -142
               },
               verticalAlign: {
                  side: 'top',
                  offset: -8
               }
            },
            /**
             * @cfg {Date|String} Начальная дата диапазона
             * При задании задается вместе с endDate, либо обе даты остаются не заданными
             */
            startDate: null,
            /**
             * @cfg {Date|String} Конечная дата диапазона
             * При задании задается вместе с startDate, либо обе даты остаются не заданными
             */
            endDate: null
         },
         _datePickerStart: null,
         _datePickerEnd: null,
         _dateRangeButton: null,
         _dateRangeChoose: null,
         _calendarIsShow: false,
         _chooseControlClass: DateRangeBigChoose
      },
      $constructor: function () {
         this._publish('onDateRangeChange', 'onStartDateChange', 'onEndDateChange');
      },

      init: function () {
         DateRange.superclass.init.call(this);

         var self = this;

         this._datePickerStart = this.getChildControlByName('DateRange__DatePickerStart');
         this._datePickerStart.subscribe('onDateChange', function(e, date) {
            self.setStartValue(date);
         });
         this._datePickerEnd = this.getChildControlByName('DateRange__DatePickerEnd');
         this._datePickerEnd.subscribe('onDateChange', function(e, date) {
            self.setEndValue(date);
         });

         this._dateRangeButton = this.getChildControlByName('DateRange__Button');
         this._dateRangeButton.subscribe('onActivated', this._onDateRangeButtonActivated.bind(this));

         this.subscribe('onStartValueChange', function (event, value) {
            self._updateDatePicker(self._datePickerStart, value);
            self._notify('onStartDateChange', value);
         });

         this.subscribe('onEndValueChange', function (event, value) {
            self._updateDatePicker(self._datePickerEnd, value);
            self._notify('onEndDateChange', value);
         });

         this.subscribe('onRangeChange', function (event, startValue, endValue) {
            self._notify('onDateRangeChange', startValue, endValue);
            // if (self._dateRangeChooseControl) {
            //    self._dateRangeChooseControl.setRange(startValue, endValue);
            // }
         });

         // приводим даты к Date-типу и устанавливаем их в DatePicker-ах
         this.setStartValue(this._options.startDate);
         this.setEndValue(this._options.endDate);

         this._addDefaultValidator();
      },

      _addDefaultValidator: function() {
         //Добавляем к прикладным валидаторам стандартный, который проверяет что дата начала периода меньше даты конца.
         this._options.validators.push({
            validator: function() {
               return !(this._options.startDate && this._options.endDate && this._options.endDate < this._options.startDate);
            }.bind(this),
            errorMessage: rk('Дата начала периода не может быть больше даты окончания')
         });
      },

      setStartValue: function(value, silent) {
         value = this._normalizeDate(value);
         return DateRange.superclass.setStartValue.call(this, value, silent);
      },

      setEndValue: function(value, silent) {
         value = this._normalizeDate(value);
         return DateRange.superclass.setEndValue.call(this, value, silent);
      },

      _normalizeDate: function(date) {
         date = DateUtil.valueToDate(date);
         if (!date) {
            date = null;
         }
         return date;
      },

      _updateDatePicker: function(datePicker, value) {
         if (value) {
            datePicker.setDate(value);
         } else {
            datePicker.setText('');
         }
      },

      showPicker: function () {
         if (this._dateRangeChooseControl) {
            this._dateRangeChooseControl.setRange(this.getStartValue(), this.getEndValue());
         }
         DateRange.superclass.showPicker.call(this);
      },

      /**
       * Определение контента пикера. Переопределённый метод
       * @private
       */
      _setPickerContent: function() {
         this._createChooseControl();

         this._picker.getContainer().empty();
         // Добавляем в пикер
         this._picker.getContainer().append(this._dateRangeChooseControl.getContainer());
         // Нажатие на календарный день в пикере устанавливает дату
         this._dateRangeChooseControl.subscribe('onChoose', this._onRangeChooseChange.bind(this));
         this._dateRangeChooseControl.subscribe('onCancel', this._onRangeChooseClose.bind(this));
      },

      _createChooseControl: function () {
         var
            // Создаем пустой контейнер
            element = $('<div name= "DateRangeChoose" class="DateRange__choose"></div>');
         // Преобразуем контейнер в контролл DateRangeBigChoose и запоминаем
         this._dateRangeChooseControl = new this._chooseControlClass({
            parent: this._picker,
            element: element,
            startValue: this._datePickerStart.getDate(),
            endValue: this._datePickerEnd.getDate()
         });
      },

      _onDateRangeButtonActivated: function() {
         this.togglePicker();
      },

      _onRangeChooseChange: function(event, start, end) {
         this.setRange(start, end);
         this.hidePicker();
      },
      _onRangeChooseClose: function(event) {
         this.hidePicker();
      },

      /**
       * Установить начальную дату.
       * @param {Date|String} newDate Начальная дата диапазона.
       * @see startDate
       */
      setStartDate: function(newDate) {
         if (this._setStartValue(newDate)) {
            this._notifyOnPropertyChanged('startDate');
            this._notify('onStartDateChange', this._options.startValue);
            this._notify('onDateRangeChange', this._options.startValue, this._options.endValue);
         }
      },

      /**
       * Получить начальную дату.
       * @return {Date} Начальная дата диапазона.
       * @see startDate
       */
      getStartDate: function() {
         return this._options.startValue;
      },

      /**
       * Установить конечную дату.
       * @param {String} newDate Конечная дата диапазона.
       * @see endDate
       */
      setEndDate: function(newDate) {
         if (this.setEndValue(newDate)) {
            this._notifyOnPropertyChanged('endValue');
            this._notify('onEndDateChange', this._options.endValue);
            this._notify('onDateRangeChange', this._options.startValue, this._options.endValue);
         }
      },

      /**
       * Получить конечную дату.
       * @return {Date} Конечная дата диапазона.
       * @see endDate
       */
      getEndDate: function() {
         return this._options.endValue;
      }
   });
   return DateRange;
});
