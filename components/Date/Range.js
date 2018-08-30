/*global define*/
define('SBIS3.CONTROLS/Date/Range', [
   'Lib/Control/CompoundControl/CompoundControl',
   'SBIS3.CONTROLS/Mixins/PickerMixin',
   'tmpl!SBIS3.CONTROLS/Date/Range/DateRange',
   'SBIS3.CONTROLS/Mixins/FormWidgetMixin',
   'SBIS3.CONTROLS/Mixins/RangeMixin',
   'SBIS3.CONTROLS/Mixins/DateRangeMixin',
   'SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin',
   'SBIS3.CONTROLS/Utils/ControlsValidators',
   'i18n!SBIS3.CONTROLS/Date/Range',
   'SBIS3.CONTROLS/Date/Box',
   'SBIS3.CONTROLS/Button/IconButton',
   'css!SBIS3.CONTROLS/Date/Range/DateRange',
   'css!SBIS3.CONTROLS/FormattedTextBox/FormattedTextBox',
   'css!SBIS3.CONTROLS/Date/Box/DateBox'
], function (CompoundControl, PickerMixin, dotTplFn, FormWidgetMixin, RangeMixin, DateRangeMixin, DateRangeBigChoosePickerMixin, ControlsValidators) {
   'use strict';
   /**
    * Класс контрола выбора диапазона дат.
    * @class SBIS3.CONTROLS/Date/Range
    * @extends Lib/Control/CompoundControl/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/RangeMixin
    * @mixes SBIS3.CONTROLS/Mixins/DateRangeMixin
    * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
    * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
    *
    * @author Миронов А.Ю.
    * @demo Examples/DateRange/MyDateRange/MyDateRange
    *
    * @ignoreEvents onChange
    *
    * @control
    * @public
    * @category Date/Time
    */
   var DateRange = CompoundControl.extend([RangeMixin, DateRangeMixin, PickerMixin, DateRangeBigChoosePickerMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS/Date/Range.prototype */{
      /**
       * @event onDateRangeChange При изменении диапазона дат как через поле ввода, так и через календарь.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Date|String} startDate Начальная дата диапазона.
       * @param {Date|String} endDate Конечная дата диапазона.
       */
      /**
       * @event onStartDateChange При изменении начальной даты диапазона как через поле ввода, так и через календарь.
       * @remark
       * Событие также происходит при использовании метода {@link setStartDate}.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Date|String} startDate Начальная дата диапазона.
       * @see setStartDate
       */
      /**
       * @event onStartDateChange При изменении конечной даты диапазона как через поле ввода, так и через календарь.
       * @remark
       * Событие также происходит при использовании метода {@link setEndDate}.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Date|String} endDate Конечная дата диапазона.
       * @see setEndDate
       */

      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {String} Формат отображения данных
             * @remark
             * На базе формата, заданного в этой опции, будет создана html-разметка, в соответствии с которой
             * определяется весь функционал.
             * Необходимо выбрать одну из масок в массиве допустимых значений.
             * Допустимые символы в маске:
             * <ol>
             *    <li>D(day) - календарный день.</li>
             *    <li>M(month) - месяц.</li>
             *    <li>Y(year) - год.</li>
             *    <li>H(hour) - час.</li>
             *    <li>I - минута</li>
             *    <li>S(second) - секунда.</li>
             *    <li>U - доля секунды.</li>
             *    <li>".", "-", ":", "/" - разделители.</li>
             * </ol>
             * @example
             * <pre>
             *     <option name="mask">HH:II:SS.UUU</option>
             * </pre>
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:II:SS.UUU'
             * @variant 'HH:II:SS'
             * @variant 'HH:II'
             * @variant 'DD.MM.YYYY HH:II:SS.UUU'
             * @variant 'DD.MM.YYYY HH:II:SS'
             * @variant 'DD.MM.YYYY HH:II'
             * @variant 'DD.MM.YY HH:II:SS.UUU'
             * @variant 'DD.MM.YY HH:II:SS'
             * @variant 'DD.MM.YY HH:II'
             * @variant 'DD.MM HH:II:SS.UUU'
             * @variant 'DD.MM HH:II:SS'
             * @variant 'DD.MM HH:II'
             * @variant 'YYYY-MM-DD HH:II:SS.UUU'
             * @variant 'YYYY-MM-DD HH:II:SS'
             * @variant 'YYYY-MM-DD HH:II'
             * @variant 'YY-MM-DD HH:II:SS.UUU'
             * @variant 'YY-MM-DD HH:II:SS'
             * @variant 'YY-MM-DD HH:II'
             * @variant 'YYYY'
             * @variant 'MM/YYYY'
             * @see date
             * @see isCalendarIconShow
             */
            mask: 'DD.MM.YY',

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
         _calendarIsShow: false
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

         this._updateRequiredValidators();
         this._addDefaultValidator();
         this.subscribe('onFocusOut', this._focusOutHandler.bind(this));
      },

      _setPickerConfig: function() {
         var config = DateRange.superclass._setPickerConfig.apply(this, arguments);
         config.className = 'controls-DateRangeBigChoose__picker';
         return config;
      },

      /**
       * Прокидывает валидаторы SBIS3.CONTROLS/Utils/ControlsValidators:required со свойств начала и конца периода
       * на соответствующие поля ввода
       * @private
       */
      _updateRequiredValidators: function () {
         this._options.validators = this._options.validators.filter(function (validator) {
            if ((validator.option === 'startValue' || validator.option === 'startDate') && validator.validator &&
               validator.validator === ControlsValidators.required) {
               validator.option = 'text';
               this._datePickerStart.addValidators([validator]);
               return false;
            } else if ((validator.option === 'endValue' || validator.option === 'endDate') && validator.validator &&
               validator.validator === ControlsValidators.required) {
               validator.option = 'text';
               this._datePickerEnd.addValidators([validator]);
               return false;
            }
            return true;
         }, this);
      },

      _addDefaultValidator: function() {
         //Добавляем к прикладным валидаторам стандартный, который проверяет что дата начала периода меньше даты конца.
         this.addValidators([{
            validator: function() {
               return !(this._options.startValue && this._options.endValue && this._options.endValue < this._options.startValue);
            }.bind(this),
            errorMessage: rk('Дата начала периода не может быть больше даты окончания')
         }]);
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

      _getDateRangeBigChooseConfig: function (element) {
         var config = DateRange.superclass._getDateRangeBigChooseConfig.apply(this, arguments);
         config.headerType = this._chooserClass.headerTypes.inputField;
         return config;
      },

      _onDateRangeButtonActivated: function() {
         this.togglePicker();
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

      _focusOutHandler: function (event, destroyed) {
         if (!destroyed){
            this.validate();
         }
      }
   });
   return DateRange;
});
