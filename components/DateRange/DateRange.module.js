/*global define*/
define('js!SBIS3.CONTROLS.DateRange', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.DateRange',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.DatePicker',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CORE.DateRangeChoose'
], function (CompoundControl, dotTplFn, DateUtil) {
   'use strict';
   /**
    * SBIS3.CONTROLS.DateRange
    * @class SBIS3.CONTROLS.DateRange
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDateRange
    */
   var DateRange = CompoundControl.extend(/** @lends SBIS3.CONTROLS.DateRange.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
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
         _calendarIsShow: false
      },
      $constructor: function () {
         this._publish('onDateRangeChange', 'onStartDateChange', 'onEndDateChange');
      },

      init: function () {
         DateRange.superclass.init.call(this);

         var self = this;

         this._datePickerStart = this.getChildControlByName('DateRange__DatePickerStart');
         this._datePickerStart.subscribe('onDateChange', function(e, date) {
            //передаем false, чтобы не зацикливать событие
            self._setStartDate(date, false);
            self._notifyOnPropertyChanged('startDate');
         });
         this._datePickerEnd = this.getChildControlByName('DateRange__DatePickerEnd');
         this._datePickerEnd.subscribe('onDateChange', function(e, date) {
            self._setEndDate(date, false);
            self._notifyOnPropertyChanged('endDate');
         });

         this._dateRangeButton = this.getChildControlByName('DateRange__Button');
         this._dateRangeButton.subscribe('onActivated', this._onDateRangeButtonActivated.bind(this));

         this._dateRangeChoose = this.getChildControlByName('DateRange__DateRangeChoose');
         this._dateRangeChoose.subscribe('onMenuHide', this._onMenuHide.bind(this));
         this._dateRangeChoose.subscribe('onChange', this._onRangeChooseChange.bind(this));
         this._dateRangeChoose.setVisible(false);

         //приводим даты к Date-типу
         this._options.startDate = DateUtil.valueToDate(this._options.startDate);
         this._options.endDate   = DateUtil.valueToDate(this._options.endDate);
         this._setStartDate(this._options.startDate);
         this._setEndDate(this._options.endDate);
      },

      _setDate: function(newDate, datePicker, currentDate, type, useSetDate) {
         var date = DateUtil.valueToDate(newDate);
         var changed = false;
         if ( ! date) {
            if (type === 'start') {
               this._options.startDate = null;
            } else {
               this._options.endDate = null;
            }
            changed = true;
         }
         //дата изменилась
         if ( ! changed && ((DateUtil.isValidDate(currentDate) && date.getTime() !== currentDate.getTime()) || ( ! currentDate))) {
            if (type === 'start') {
               this._options.startDate = date;
            } else {
               this._options.endDate = date;
            }
            changed = true;
         }
         this._dateRangeChoose.setRange(this._options.startDate, this._options.endDate);
         //useSetDate чтобы не зацикливать событие от setDate и setText
         if ( ! useSetDate) {
            return changed;
         }
         if (date) {
            datePicker.setDate(date);
         } else {
            datePicker.setText('');
         }
         return changed;
      },

      /**
       * Установить начальную дату.
       * @param {Date|String} newDate
       * @param {Boolean} useSetDate true - будет вызывать setDate у DatePicker-a
       * @private
       * @return {Boolean} true - если дата изменилась
       */
      _setStartDate: function(newDate, useSetDate) {
         if (useSetDate === undefined) {
            useSetDate = true;
         }
         return this._setDate(newDate, this._datePickerStart, this._options.startDate, 'start', useSetDate);
      },

      /**
       * Установить начальную дату.
       * @param {Date|String} newDate Начальная дата диапазона.
       * @see startDate
       */
      setStartDate: function(newDate) {
         if (this._setStartDate(newDate)) {
            this._notifyOnPropertyChanged('startDate');
            this._notify('onStartDateChange', this._options.startDate);
            this._notify('onDateRangeChange', this._options.startDate, this._options.endDate);
         }
      },

      /**
       * Получить начальную дату.
       * @return {Date} Начальная дата диапазона.
       * @see startDate
       */
      getStartDate: function() {
         return this._options.startDate;
      },

      /**
       * Установить конечную дату.
       * @param {String} newDate Конечная дата диапазона.
       * @see endDate
       */
      setEndDate: function(newDate) {
         if (this._setEndDate(newDate)) {
            this._notifyOnPropertyChanged('endDate');
            this._notify('onEndDateChange', this._options.endDate);
            this._notify('onDateRangeChange', this._options.startDate, this._options.endDate);
         }
      },

      _setEndDate: function(newDate, useSetDate) {
         if (useSetDate === undefined) {
            useSetDate = true;
         }
         return this._setDate(newDate, this._datePickerEnd, this._options.endDate, 'end', useSetDate);
      },

      /**
       * Получить конечную дату.
       * @return {Date} Конечная дата диапазона.
       * @see endDate
       */
      getEndDate: function() {
         return this._options.endDate;
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

      _onMenuHide: function() {
         this._calendarIsShow = false;
      },

      _onRangeChooseChange: function(event, start, end) {
         this._datePickerStart.setDate(start);
         this._datePickerEnd.setDate(end);
      }
   });
   return DateRange;
});