define('js!SBIS3.CONTROLS.DateRangeRelationController', [
   'Core/Abstract',
   'Core/helpers/date-helpers'
], function(cAbstract, dateHelpers) {

   var DateRangeController = cAbstract.extend({
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.DateRangeSlider[]} массив из контролов диапазонов дат.
             */
            dateRanges: null,
            /**
             * @cfg {Number} шаг в месяцах с которым устанавливаются периоды в контролах. Если не установлен, то в контролах
             * устанавливаются смежные периоды.
             */
            step: null,

            /**
             * @cfg {Boolean} только по разрядности. Т.е., выбирая новый период в одном контроле, новые значения присвоятся
             * в других контролах только если произошла смена разрядности или нарушено условие I < II < III < IV< ... .
             */
            onlyByCapacity: false,

            /**
             * @cfg {Boolean} включает или отключает отображение замка на всех связанных контроллах.
             * Если равен null, то оставляет отображение замочка без изменений.
             */
            showLock: null
         },
         _updating: false
      },
      /**
       * Устанавливает связи между контролами для выбора интервалов дат.
       */
      bindDateRanges: function () {
         var dateRanges = arguments.length ? arguments : this._options.dateRanges,
            i;

         for (i = 0; i < dateRanges.length; i++) {
            dateRanges[i].subscribe('onRangeChange', this._onRangeChanged.bind(this, i));
            dateRanges[i].subscribe('onLockedChanged', this._onLockedChanged.bind(this, i));
         }
         if (typeof this._options.showLock  === 'boolean') {
            for (i = 0; i < dateRanges.length; i++) {
               dateRanges[i].setLocked(!this._options.onlyByCapacity);
               dateRanges[i].setShowLock(this._options.showLock);
            }
         }
         this._updateControls(0);
      },

      _onRangeChanged: function (controlNumber, e, start, end, oldStart, oldEnd) {
         this._updateControls(controlNumber, start, end, oldStart, oldEnd);
      },

      _onLockedChanged: function (controlNumber, e, locked) {
         var dateRanges = this._options.dateRanges;
         if (this._updating) {
            return;
         }
         this._updating = true;
         for (var i = 0; i < dateRanges.length; i++) {
            if (i !== controlNumber) {
               dateRanges[i].setLocked(locked);
            }
         }
         this._options.onlyByCapacity = !locked;
         this._updating = false;
      },

      _updateControls: function (controlNumber, start, end, oldStart, oldEnd) {
         var changedControl, periodType, periodLength, step, capacityChanged, control, lastDate, i;

         if (this._updating) {
            return;
         }
         this._updating = true;

         changedControl = this._options.dateRanges[controlNumber];

         start = start || changedControl.getStartValue();
         end = end || changedControl.getEndValue();

         periodType = dateHelpers.getPeriodType(start, end);
         periodLength = dateHelpers.getPeriodLengthInMonthByType(periodType);
         capacityChanged = oldStart && oldEnd && dateHelpers.getPeriodType(oldStart, oldEnd) !== periodType;
         step = this._options.onlyByCapacity ? periodLength : this._options.step || periodLength;

         if (!periodLength) {
            this._updating = false;
            return;
         }
         if (step < periodLength) {
            step = periodLength;
         }

         // Перебираем и устанавливаем даты в контролых от текущего до первого
         lastDate = start;
         for (i = 1; i <= controlNumber; i++) {
            control = this._options.dateRanges[controlNumber - i];
            if (this._options.onlyByCapacity && !capacityChanged && lastDate > control.getEndValue()) {
               break;
            }
            control.setRange(this._slideStartDate(start, -step*i), this._slideEndDate(start, -(step*i) + periodLength - 1));
            lastDate = control.getStartValue();
         }
         // Перебираем и устанавливаем даты в контролых от текущего до последнего
         lastDate = end;
         for (i = 1; i < this._options.dateRanges.length - controlNumber; i++) {
            control = this._options.dateRanges[controlNumber + i];
            if (this._options.onlyByCapacity && !capacityChanged && lastDate < control.getStartValue()) {
               break;
            }
            control.setRange(this._slideStartDate(start, step*i), this._slideEndDate(start, step*i + periodLength - 1));
            lastDate = control.getEndValue();
         }
         // var firstStart = this._slideStartDate(start, -(controlNumber*step));
         // for (var i = 0; i < this._options.dateRanges.length; i++) {
         //    if (i === controlNumber) {
         //       continue;
         //    }
         //    this._options.dateRanges[i].setRange(this._slideStartDate(firstStart, step*i), this._slideEndDate(firstStart, step*i + periodLength - 1));
         // }

         this._updating = false;
      },

      _slideStartDate: function (date, monthDelta) {
         return new Date(date.getFullYear(), date.getMonth() + monthDelta, 1);
      },
      _slideEndDate: function (date, monthDelta) {
         return new Date(date.getFullYear(), date.getMonth() + monthDelta + 1, 0);
      }
   });

   return DateRangeController;

});