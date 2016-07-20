/*global define*/
define('js!SBIS3.CONTROLS.DateRangeBig', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.DateRangeBig',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.FormWidgetMixin',
   'js!SBIS3.CONTROLS.RangeMixin',
   'i18n!SBIS3.CONTROLS.DateRangeBig',
   'js!SBIS3.CONTROLS.DatePicker',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CORE.DateRangeChoose'
], function (CompoundControl, dotTplFn, DateUtil, FormWidgetMixin, RangeMixin) {
   'use strict';
   /**
    * SBIS3.CONTROLS.DateRangeBig
    * @class SBIS3.CONTROLS.DateRangeBig
    * @extends $ws.proto.CompoundControl
    * @author Миронов Александр Юрьевич
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDateRangeBig
    */
   var DateRangeBig = CompoundControl.extend([RangeMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS.DateRange.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
         },
         _datePickerStart: null,
         _datePickerEnd: null,
         _dateRangeButton: null,
         _dateRangeChoose: null,
         _calendarIsShow: false
      },
      $constructor: function () {
      },

      init: function () {
         DateRangeBig.superclass.init.call(this);

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

         this._dateRangeChoose = this.getChildControlByName('DateRange__DateRangeChoose');
         this._dateRangeChoose.subscribe('onMenuHide', this._onMenuHide.bind(this));
         this._dateRangeChoose.subscribe('onChange', this._onRangeChooseChange.bind(this));
         this._dateRangeChoose.setVisible(false);

         this.subscribe('onStartValueChange', function (event, value) {
            self._updateDatePicker(self._datePickerStart, value);
         });

         this.subscribe('onEndValueChange', function (event, value) {
            self._updateDatePicker(self._datePickerEnd, value);
         });

         this.subscribe('onRangeChange', function (event, startValue, endValue) {
            self._dateRangeChoose.setRange(startValue, endValue);
         });

         //TODO заплатка для 3.7.3.20 Нужно переделать контрол на PickerMixin
         var floatArea = this._getFloatArea();
         if (floatArea) {
            floatArea.subscribe('onClose', function() {
               self._dateRangeChoose._hideMenu();
            });
         }

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
         return DateRangeBig.superclass.setStartValue.call(this, value, silent);
      },

      setEndValue: function(value, silent) {
         value = this._normalizeDate(value);
         return DateRangeBig.superclass.setEndValue.call(this, value, silent);
      },

      setRange: function(startValue, endValue) {
         startValue = this._normalizeDate(startValue);
         endValue = this._normalizeDate(endValue);
         return DateRangeBig.superclass.setRange.call(this, startValue, endValue);
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

      _onDateRangeButtonActivated: function() {
         this._calendarIsShow = !this._calendarIsShow;
         if (this._calendarIsShow) {
            //TODO Если DateRangeChoose не отобразить, то позиция окна считается не верно. Нужно на что-то заменить
            this._dateRangeChoose.setVisible(true);
            this._dateRangeChoose._showMenu();
            this._dateRangeChoose.setVisible(false);
         } else {
            this._dateRangeChoose._hideMenu();
         }
      },

      //TODO заплатка для 3.7.3.20 Нужно переделать контрол на PickerMixin
      //ищем родительскую FloatArea
      _getFloatArea: function() {
         var par = this.getParent();
         while (par && !$ws.helpers.instanceOfMixin(par, 'SBIS3.CONTROLS.PopupMixin')) {
            par = par.getParent();
         }
         return (par && $ws.helpers.instanceOfMixin(par, 'SBIS3.CONTROLS.PopupMixin')) ? par : null;
      },

      _onMenuHide: function() {
         this._calendarIsShow = false;
      },

      _onRangeChooseChange: function(event, start, end) {
         this.setRange(start, end);
      }
   });
   return DateRangeBig;
});