define('SBIS3.CONTROLS/ComponentBinder/DateRangeRelationController', [
   'Core/Abstract',
   'Core/helpers/Date/getPeriodType',
   'Core/helpers/Date/getPeriodLengthInMonthByType',
   'Core/helpers/Date/periodTypes',
   'Controls/Utils/DateRangeUtil'
], function(cAbstract, getPeriodType, getPeriodLengthInMonthByType, periodTypes, dateRangeUtil) {

   /**
    * Контроллер, позволяющий связывать контролы выбора периодов
    * @author Александр Миронов
    * @class SBIS3.CONTROLS/ComponentBinder/DateRangeRelationController
    * @extends Core/Abstract
    */
   var DateRangeController = cAbstract.extend(/**@lends SBIS3.CONTROLS/ComponentBinder/DateRangeRelationController.prototype*/{
      /**
       * @event onDatesChange Происходит при изменении значения хотя бы одного из синхронизируемых контролов.
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
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
            showLock: null,

            lockButton: null
         },
         _updating: false,
         _steps: []
      },
      /**
       * Устанавливает связи между контролами для выбора интервалов дат.
       */
      bindDateRanges: function () {
         var dateRanges = arguments.length ? arguments : this._options.dateRanges,
            i;

         if (this._options.lockButton) {
            this._options.lockButton.setChecked(!this._options.onlyByCapacity);
            this._options.lockButton.subscribe('onCheckedChange', this._onLockedChanged.bind(this, -1))
         }

         for (i = 0; i < dateRanges.length; i++) {
            dateRanges[i].subscribe('onRangeChange', this._onRangeChanged.bind(this, i));
            dateRanges[i].subscribe('onLockedChanged', this._onLockedChanged.bind(this, i));
         }
         this._updateSteps(true);
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
         if (this._updatingLock) {
            return;
         }
         this._updateLocked(controlNumber, locked);
         this._updateSteps(locked);
         this._options.onlyByCapacity = !locked;
      },

      _updateLocked: function (controlNumber, locked) {
         var dateRanges = this._options.dateRanges,
            i;
         if (this._updatingLock) {
            return;
         }
         this._updatingLock = true;
         if (this._options.lockButton) {
            this._options.lockButton.setChecked(locked);
         }
         for (i = 0; i < dateRanges.length; i++) {
            if (i !== controlNumber) {
               dateRanges[i].setLocked(locked);
            }
         }
         this._updatingLock = false;
      },

      _updateSteps: function (locked) {
         var dateRanges = this._options.dateRanges;
         if (locked) {
            for (var i = 0; i < dateRanges.length - 1; i++) {
               this._steps[i] = this._getMonthCount(dateRanges[i].getStartValue(), dateRanges[i+1].getStartValue());
            }
         }
      },

      _updateControls: function (controlNumber, start, end, oldStart, oldEnd) {
         var selectionType = 'months',
            changedControl, periodType, periodLength, oldPeriodType, oldPeriodLength,
            step, capacityChanged, control, lastDate, i;

         var getStep = function (number) {
            var s = this._options.onlyByCapacity ? periodLength : this._steps[number] || periodLength;
            if (selectionType === 'days') {
               return periodLength;
            }
            if (s < periodLength) {
               s = periodLength;
            }
            return s;
         }.bind(this);

         if (this._updating) {
            return;
         }
         this._updating = true;

         changedControl = this._options.dateRanges[controlNumber];

         start = start || changedControl.getStartValue();
         end = end || changedControl.getEndValue();
         oldStart = oldStart || changedControl.getStartValue();
         oldEnd = oldEnd || changedControl.getEndValue();
         if (!start || !end) {
            this._updating = false;
            return;
         }

         periodType = getPeriodType(start, end);
         oldPeriodType = (oldStart && oldEnd) ? getPeriodType(oldStart, oldEnd) : null;
         capacityChanged = oldPeriodType !== periodType;

         if (periodType === periodTypes.day || periodType === periodTypes.days) {
            selectionType = 'days';
            periodLength = dateRangeUtil.gePeriodLengthInDays(start, end);
            this._options.onlyByCapacity = true;
            this._updateLocked(controlNumber, false);
         } else {
            periodLength = periodType ? dateRangeUtil.getPeriodLengthInMonths(start, end) : null;
            this._autoRelation(controlNumber, capacityChanged);
         }

         if (oldPeriodType === periodTypes.day || oldPeriodType === periodTypes.days) {
            oldPeriodLength = dateRangeUtil.gePeriodLengthInDays(oldStart, oldEnd);
         } else {
            oldPeriodLength = oldPeriodType ? dateRangeUtil.getPeriodLengthInMonths(oldStart, oldEnd) : null;
         }

         if (this._options.lockButton) {
            this._options.lockButton.setEnabled(selectionType === 'months');
         }

         // Если изменилась разрядность и используется
         // тип связи с установленным шагом и разрядность увеличилась,
         // или тип связи смежные периоды
         // то сбрасываем установленные шаги.
         if (capacityChanged && !this._options.onlyByCapacity && ((this._options.step && oldPeriodLength && periodLength > oldPeriodLength) || !this._options.step)) {
            this._resetSteps();
         }

         // Перебираем и устанавливаем даты в контролых от текущего до первого
         lastDate = start;
         step = 0;
         for (i = 1; i <= controlNumber; i++) {
            step += getStep(controlNumber - i);
            control = this._options.dateRanges[controlNumber - i];
            if (this._options.onlyByCapacity && !capacityChanged && lastDate > control.getEndValue()) {
               break;
            }
            control.setRange(
               this._slideStartDate(start, -step, selectionType),
               this._slideEndDate(start, -step + periodLength - 1, selectionType)
            );
            lastDate = control.getStartValue();
         }

         // Перебираем и устанавливаем даты в контролых от текущего до последнего
         lastDate = end;
         step = 0;
         for (i = 1; i < this._options.dateRanges.length - controlNumber; i++) {
            step += getStep(controlNumber + i - 1);
            control = this._options.dateRanges[controlNumber + i];
            if (this._options.onlyByCapacity && !capacityChanged && lastDate < control.getStartValue()) {
               break;
            }
            control.setRange(
               this._slideStartDate(start, step, selectionType),
               this._slideEndDate(start, step + periodLength - 1, selectionType)
            );
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
         this._notify('onDatesChange');
      },

      _autoRelation: function (updatedControlNumber, capacityChanged) {
         if (!this._options.onlyByCapacity) {
            return;
         }

         // Временно ограничиваем эту логику. Если связано больше 2х контролов, то не меняем тип связи.
         if (this._options.dateRanges.length > 2) {
            return;
         }

         var updatedControl = this._options.dateRanges[updatedControlNumber],
            updatedStartValue = updatedControl.getStartValue(),
            updatedEndValue = updatedControl.getEndValue(),
            updatedPeriodType = getPeriodType(updatedStartValue, updatedEndValue);

         var updateRelation = function (controlNumber) {
            var control = this._options.dateRanges[controlNumber],
               startValue = control.getStartValue(),
               step;

            // связывание включаем только если переключаемся в режим годов и это означает что смещение между периодами
            // кратно годам в любом случае, либо если разрядность не изменилась и шаг между периодами кратен годам.
            if (updatedPeriodType === periodTypes.year || updatedPeriodType === periodTypes.years ||
                  (!capacityChanged &&
                   updatedStartValue.getFullYear() !== startValue.getFullYear() &&
                   updatedStartValue.getMonth() === startValue.getMonth() &&
                   updatedStartValue.getDate() === startValue.getDate())) {
               this._options.onlyByCapacity = false;
               this._updateLocked(-1, true);

               // обновляем шаги для рассчета периодов в других контролах.
               // если разрядность изменилась, то включаются смежные периоды и шаг должен быть равен этому периоду.
               if (capacityChanged) {
                  step = getPeriodLengthInMonthByType(updatedPeriodType);
               } else {
                  step = Math.abs(updatedStartValue.getFullYear() - startValue.getFullYear()) * 12;
               }
               this._resetSteps(step);
            }
         }.bind(this);

         if (updatedControlNumber < this._options.dateRanges.length - 1) {
            updateRelation(updatedControlNumber + 1);
         }
         if (this._options.onlyByCapacity && updatedControlNumber > 0) {
            updateRelation(updatedControlNumber - 1);
         }
      },

      _resetSteps: function (step) {
         this._steps = [];
         for (var i = 0; i < this._options.dateRanges.length - 1; i++) {
            this._steps.push(step || this._options.step);
         }
      },

      _slideStartDate: function(date, delta, selectionType) {
         if (selectionType === 'days') {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
         }
         return new Date(date.getFullYear(), date.getMonth() + delta, 1);
      },
      _slideEndDate: function(date, delta, selectionType) {
         if (selectionType === 'days') {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
         }
         return new Date(date.getFullYear(), date.getMonth() + delta + 1, 0);
      },

      _getMonthCount: function (start, end) {
         return end.getFullYear()*12 + end.getMonth() - start.getFullYear()*12 - start.getMonth();
      },

      shiftNext: function() {
         this._shift(1);
      },

      shiftPrev: function() {
         this._shift(-1);
      },

      _shift: function(delta) {
         var dateRanges = this._options.dateRanges,
            range;
         for (var i = 0; i < dateRanges.length; i++) {
            range = dateRangeUtil.shiftPeriod(dateRanges[i].getStartValue(), dateRanges[i].getEndValue(), delta);
            dateRanges[i].setRange(range[0], range[1], true);
         }
         this._notify('onDatesChange');
      },
   });

   return DateRangeController;

});
