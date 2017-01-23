/*global define*/
define('js!SBIS3.CONTROLS.DateRange', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.PickerMixin',
   'html!SBIS3.CONTROLS.DateRange',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.FormWidgetMixin',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeMixin',
   'js!SBIS3.CONTROLS.DateRangeBigChoose',
   'i18n!SBIS3.CONTROLS.DateRange',
   'js!SBIS3.CONTROLS.DateBox',
   'js!SBIS3.CONTROLS.IconButton',
   'css!SBIS3.CONTROLS.DateRange',
   'css!SBIS3.CONTROLS.FormattedTextBox'
], function (CompoundControl, PickerMixin, dotTplFn, DateUtil, FormWidgetMixin, RangeMixin, DateRangeMixin, DateRangeBigChoose) {
   'use strict';
   /**
    * Класс контрола выбора диапазона дат.
    * @class SBIS3.CONTROLS.DateRange
    * @extends $ws.proto.CompoundControl
    * @mixes SBIS3.CONTROLS.RangeMixin
    * @mixes SBIS3.CONTROLS.DateRangeMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @author Миронов Александр Юрьевич
    * @demo SBIS3.CONTROLS.Demo.MyDateRange
    *
    * @ignoreEvents onChange
    *
    * @control
    * @public
    * @category Date/Time
    */
   var DateRange = CompoundControl.extend([RangeMixin, DateRangeMixin, PickerMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS.DateRange.prototype */{
      /**
       * @event onDateRangeChange При изменении диапазона дат как через поле ввода, так и через календарь.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Date|String} startDate Начальная дата диапазона.
       * @param {Date|String} endDate Конечная дата диапазона.
       */
      /**
       * @event onStartDateChange При изменении начальной даты диапазона как через поле ввода, так и через календарь.
       * @remark
       * Событие также происходит при использовании метода {@link setStartDate}.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Date|String} startDate Начальная дата диапазона.
       * @see setStartDate
       */
      /**
       * @event onStartDateChange При изменении конечной даты диапазона как через поле ввода, так и через календарь.
       * @remark
       * Событие также происходит при использовании метода {@link setEndDate}.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Date|String} endDate Конечная дата диапазона.
       * @see setEndDate
       */

      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Date|String} Устанавливает начальную дату диапазона.
             * @remark
             * Опцию устанавливают вместе с {@link endtDate}, либо обе даты остаются не заданными.
             * @see endtDate
             * @see setStartDate
             * @see getStartDate
             */
            startDate: null,
            /**
             * @cfg {Date|String} Устанавливает конечную дату диапазона.
             * @remark
             * Опцию устанавливают вместе с {@link startDate}, либо обе даты остаются не заданными.
             * @see startDate
             * @see setEndDate
             * @see getEndDate
             */
            endDate: null,

            /**
             * @cfg {String} Режим уведомления о смене даты. Значение по умолчанию textChange.
             * @variant 'complete' события onDateChange и onTextChange стреляют только при окончании работы с полем даты(уход фокуса, выбор даты из календаря или нажатие клавиши insert).
             * @variant 'dateChange' события onDateChange и onTextChange стреляют при каждом изменении значения даты.
             * @variant 'textChange' события onDateChange и onTextChange стреляют при каждом изменении значения текста.
             */
            notificationMode: 'textChange'
         },
         _datePickerStart: null,
         _datePickerEnd: null,
         _dateRangeButton: null,
         _dateRangeChoose: null,
         _calendarIsShow: false,
         _chooseControlClass: DateRangeBigChoose
      },

      _modifyOptions: function(options) {
         options.startDate = this._normalizeDate(options.startDate);
         options.endDate = this._normalizeDate(options.endDate);
         options.startValue = this._normalizeDate(options.startValue) || options.startDate;
         options.endValue = this._normalizeDate(options.endValue) || options.endDate;
         return options;
      },

      $constructor: function () {
         this._publish('onDateRangeChange', 'onStartDateChange', 'onEndDateChange');
      },

      init: function () {
         DateRange.superclass.init.call(this);

         var self = this;

         this._datePickerStart = this.getChildControlByName('DateRange__DatePickerStart');
         this._datePickerStart.subscribe('onDateChange', function(e, date) {
            self.clearMark();
            self.setStartValue(date, false, true);
         });
         this._datePickerStart.subscribe('onInputFinished', function() {
            self._datePickerEnd.setActive(true);
         });
         this._datePickerEnd = this.getChildControlByName('DateRange__DatePickerEnd');
         this._datePickerEnd.subscribe('onDateChange', function(e, date) {
            self.clearMark();
            self.setEndValue(date, false, true);
         });

         this._dateRangeButton = this.getChildControlByName('DateRange__Button');
         this._dateRangeButton.subscribe('onActivated', this._onDateRangeButtonActivated.bind(this));

         this.subscribe('onStartValueChange', function (event, value) {
            self._notify('onStartDateChange', value);
         });

         this.subscribe('onEndValueChange', function (event, value) {
            // Временно делаем, что бы возвращаемая конечная дата содержала время 23:59:59.999
            value = this._normalizeEndDate(value);
            self._notify('onEndDateChange', value);
         });

         this.subscribe('onRangeChange', function (event, startValue, endValue) {
            self._notify('onDateRangeChange', startValue, endValue);
            // if (self._dateRangeChooseControl) {
            //    self._dateRangeChooseControl.setRange(startValue, endValue);
            // }
         });

         this._addDefaultValidator();
         this.subscribe('onFocusOut', this._focusOutHandler.bind(this));
      },

      _setPickerConfig: function() {
         return {
            corner: 'tl',
            bodyBounds: true,
            horizontalAlign: {
               side: 'left',
               offset: -133
            },
            verticalAlign: {
               side: 'top',
               offset: -11
            }
         }
      },

      _addDefaultValidator: function() {
         //Добавляем к прикладным валидаторам стандартный, который проверяет что дата начала периода меньше даты конца.
         this._options.validators.push({
            validator: function() {
               return !(this._options.startValue && this._options.endValue && this._options.endValue < this._options.startValue);
            }.bind(this),
            errorMessage: rk('Дата начала периода не может быть больше даты окончания')
         });
      },

      setStartValue: function(value, silent, _dontUpdatePicker) {
         var changed = DateRange.superclass.setStartValue.call(this, value, silent);
         // Валидация работает через options, а свойство startDate дублирует и хранит значение в startValue.
         // По этому сохраняем значения в this._options.startDate что бы иметь возможность валидировать свойство startDate.
         this._options.startDate = this.getStartDate();
         if (!_dontUpdatePicker) {
            this._updateDatePicker(this._datePickerStart, this.getStartValue());
         }
         return changed;
      },

      setEndValue: function(value, silent, _dontUpdatePicker) {
         var changed = DateRange.superclass.setEndValue.call(this, value, silent);
         // Валидация работает через options, а свойство endDate дублирует и хранит значение в endValue.
         // По этому сохраняем значения в this._options.endDate что бы иметь возможность валидировать свойство endDate.
         this._options.endDate = this.getEndDate();
         if (!_dontUpdatePicker) {
            this._updateDatePicker(this._datePickerEnd, this.getEndValue());
         }
         return changed;
      },

      _updateDatePicker: function(datePicker, value) {
         datePicker.setDate(value);
      },

      showPicker: function () {
         if (this._dateRangeChooseControl) {
            this._dateRangeChooseControl.applyYearState();
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
       * Установить начальную дату диапазона.
       * @remark
       * При выполнении метода происходят события {@link onStartDateChange} и {@link onDateRangeChange}.
       * @param {Date|String} newDate Начальная дата диапазона.
       * @see startDate
       * @see getStartDate
       * @see onStartDateChange
       * @see onDateRangeChange
       */
      setStartDate: function(newDate) {
         if (this.setStartValue(newDate)) {
            this._notifyOnPropertyChanged('startDate');
            this._notify('onStartDateChange', this._options.startValue);
            this._notify('onDateRangeChange', this._options.startValue, this._options.endValue);
         }
      },

      /**
       * Возвращает начальную дату.
       * @return {Date|String} Начальная дата диапазона.
       * @see startDate
       * @see setStartDate
       */
      getStartDate: function() {
         return this.getStartValue();
      },

      /**
       * Установить конечную дату диапазона.
       * @remark
       * При выполнении метода происходят события {@link onEndDateChange} и {@link onDateRangeChange}.
       * @param {Date|String} newDate Конечная дата диапазона.
       * @see endDate
       * @see getEndDate
       * @see onEndDateChange
       * @see onDateRangeChange
       */
      setEndDate: function(newDate) {
         if (this.setEndValue(newDate)) {
            this._notifyOnPropertyChanged('endValue');
            this._notify('onEndDateChange', this._options.endValue);
            this._notify('onDateRangeChange', this._options.startValue, this._options.endValue);
         }
      },

      /**
       * Возвращает конечную дату диапазона.
       * @return {Date|String} Конечная дата диапазона.
       * @see endDate
       * @see setEndDate
       */
      getEndDate: function() {
         return this._normalizeEndDate(this.getEndValue());
      },

      _normalizeEndDate: function (date) {
         // Временно делаем, что бы возвращаемая конечная дата содержала время 23:59:59.999
         if (date) {
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
            date.setSQLSerializationMode(this._getSQLSerializationMode());
         }
         return date;
      },

      _focusOutHandler: function () {
         this.validate()
      }
   });
   return DateRange;
});
