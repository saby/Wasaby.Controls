define('js!SBIS3.CONTROLS.DateRangeMixin', [
   'js!SBIS3.CONTROLS.Utils.DateUtil'
], function (DateUtil) {
   /**
    * Миксин, добавляющий поведение хранения начального и конечного значений диапазона типа Date.
    * Реализует логику которая приводит значения диапазона к типу Date, а так же общие методы для работы
    * с этим типом диапазона.
    * Используется только совместно с SBIS3.CONTROLS.RangeMixin.
    * @mixin SBIS3.CONTROLS.DateRangeMixin
    * @public
    * @author Миронов Александр Юрьевич
    */
   var DateRangeMixin = /**@lends SBIS3.CONTROLS.DateRangeMixin.prototype  */{
      $protected: {
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.RangeMixin')) {
            throw new Error('RangeMixin mixin is required');
         }
      },

      around : {
         _modifyOptions: function (parentFnc, opts) {
            opts.startValue = this._normalizeDate(opts.startValue);
            opts.endValue = this._normalizeDate(opts.endValue);
            return parentFnc.call(this, opts)
         },
         setStartValue: function (parentFnc, value, silent) {
            value = this._normalizeDate(value);
            return parentFnc.call(this, value, silent);
         }
         ,

         setEndValue: function (parentFnc, value, silent) {
            value = this._normalizeDate(value);
            return parentFnc.call(this, value, silent);
         }
      },

      /**
       * Определяет тип периода: месяц, квартал, полугодие или год. Возвращает длинну этого периода в месяцах.
       * Если период не представляет из себя целый месяц, квартал или год, то возвращает 0.
       * @private
       */
      _getPeriodLengthInMonth: function (start, end) {
         var periodType = $ws.helpers.getPeriodType(start, end);
         if(periodType === 'month') {
            return 1;
         } else if(periodType === 'quarter') {
            return 3;
         } else if(periodType === 'halfyear') {
            return 6;
         } else if(periodType === 'year') {
            return 12;
         }
      },
      /**
       * Если выбран период из нескольких целых месяцев, кварталов, полугодий или годов,
       * то сдвигает его на такой же период вперед.
       * @private
       */
      setNext: function () {
         this._slidePeriod(this._getPeriodLengthInMonth(this.getStartValue(), this.getEndValue()));
      },
      /**
       * Если выбран период из нескольких целых месяцев, кварталов, полугодий или годов,
       * то сдвигает его на такой же период назад.
       * @private
       */
      setPrev: function () {
         this._slidePeriod(-this._getPeriodLengthInMonth(this.getStartValue(), this.getEndValue()));
      },
      /**
       * Сдвигает период на несколько целых месяцев
       * @param monthDelta - количество целых месяцев на которое сдвигается период
       * @private
       */
      _slidePeriod: function (monthDelta) {
         var start = this.getStartValue(),
            end = this.getEndValue();
         start = new Date(start.getFullYear(), start.getMonth() + monthDelta, 1);
         end = new Date(end.getFullYear(), end.getMonth() + monthDelta + 1, 0);
         this.setRange(start, end);
      },

      _normalizeDate: function(date) {
         date = DateUtil.valueToDate(date);
         if (!date) {
            date = null;
         }
         return date;
      }
   };

   return DateRangeMixin;
});
