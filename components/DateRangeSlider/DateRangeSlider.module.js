define('js!SBIS3.CONTROLS.DateRangeSlider',[
   'js!SBIS3.CONTROLS.DateRangeSliderBase',
   'js!SBIS3.CONTROLS.DateRangeChoosePickerMixin',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'Core/helpers/date-helpers',
   'js!SBIS3.CONTROLS.Link'
], function (DateRangeSliderBase, DateRangeChoosePickerMixin, DateUtil, dateHelpers) {
   'use strict';

   /**
    * Контрол позволяющий выбирать диапазон дат равный месяцу, кварталу, полугодию или году.
    *
    * Если контрол работает с одним типом диапазона(например можно выбрать только месяца, или только кварталы),
    * то можно задавать в опциях и свойствах либо начальную, либо конечную дату периода.
    * Вторая дата вычислится автоматически исходя из типа диапазона который можно выбрать.
    * Это позволяет привязывать одну из дат к контексту не заботясь о второй.
    *
    * SBIS3.CONTROLS.DateRangeSlider
    * @class SBIS3.CONTROLS.DateRangeSlider
    * @extends $ws.proto.DateRangeSliderBase
    * @mixes SBIS3.CONTROLS.DateRangeChoosePickerMixin
    * @author Миронов Александр Юрьевич
    * @demo SBIS3.CONTROLS.Demo.MyDateRangeSlider
    *
    * @control
    * @public
    * @category Date/Time
    */
   var DateRangeSlider = DateRangeSliderBase.extend([DateRangeChoosePickerMixin], /** @lends SBIS3.CONTROLS.DateRangeSlider.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} автоподстановка второго значения
             * Значение по умолчанию true
             * @deprecated
             */
            // Добавил опцию что бы исключить ошибки при переходе к автоизменению второго значения в текущей версии.
            // Пока что не уверен стоит ли выпиливать ее в будущих версиях.
            // Этот функционал скорее всего будет пересен с миксин DateRangeChoosePickerMixin, и тогда опция будет
            // полезна что бы можно было отключить это поведдение по умолчанию для некоторых компонентов.
            autoValue: true
         }
      },

      $constructor: function () {
         // this._publish('onChangeHoveredItem');
      },

      init: function () {
         var container = this.getContainer();

         DateRangeSlider.superclass.init.call(this);

         if (!this._options.showMonths && !this._options.showQuarters && !this._options.showHalfyears) {
            this.getContainer().addClass(this._cssRangeSlider.yearState);
         }
      },

      _modifyOptions: function (opts) {
         var start, end;
         opts = DateRangeSlider.superclass._modifyOptions.apply(this, arguments);
         // Поскольку контрол работает только с фиксированными диапазонами, позволим разработчикам
         // не конфигурировать одну из дат. Сделаем это за них если они этого не сделали.
         start = opts.startValue;
         end = opts.endValue;
         if (start && !end) {
            if (opts.showMonths && DateUtil.isStartOfMonth(start)) {
               opts.endValue = DateUtil.getEndOfMonth(start);
            } else if (opts.showQuarters && DateUtil.isStartOfQuarter(start)) {
               opts.endValue = DateUtil.getEndOfQuarter(start);
            } else if (opts.showHalfyears && DateUtil.isStartOfHalfyear(start)) {
               opts.endValue = DateUtil.getEndOfHalfyear(start);
            } else if (DateUtil.isStartOfYear(start)) {
               opts.endValue = DateUtil.getEndOfYear(start);
            }
         } else if (end && !start) {
            if (opts.showMonths && DateUtil.isEndOfMonth(end)) {
               opts.startValue = DateUtil.getStartOfMonth(end);
            } else if (opts.showQuarters && DateUtil.isEndOfQuarter(end)) {
               opts.startValue = DateUtil.getStartOfQuarter(end);
            } else if (opts.showHalfyears && DateUtil.isEndOfHalfyear(end)) {
               opts.startValue = DateUtil.getStartOfHalfyear(end);
            } else if (DateUtil.isEndOfYear(end)) {
               opts.startValue = DateUtil.getStartOfYear(end);
            }
         }
         opts._caption = dateHelpers.getFormattedDateRange(opts.startValue, opts.endValue, {shortYear: true, contractToHalfYear: true, contractToQuarter: true});
         return opts;
      },

      _getRangeTypeIfSingle: function () {
         var opts = {'showMonths': 'month', 'showQuarters': 'quarter', 'showHalfyears': 'halfyear', 'showYears': 'year'},
            rTypes = 0,
            rType, lastType;
         for (rType in opts) {
            if (opts.hasOwnProperty(rType)) {
               if (this._options[rType]) {
                  rTypes += 1;
                  lastType = opts[rType];
               }
            }
         }
         return rTypes === 1 && lastType;
      },

      _getStartValueByControlPeriodType: function (end, periodType) {
         if (periodType === 'month' && DateUtil.isEndOfMonth(end)) {
            return DateUtil.getStartOfMonth(end);
         } else if (periodType === 'quarter' && DateUtil.isEndOfQuarter(end)) {
            return DateUtil.getStartOfQuarter(end);
         } else if (periodType === 'halfyear' && DateUtil.isEndOfHalfyear(end)) {
            return DateUtil.getStartOfHalfyear(end);
         } else if (periodType === 'year' && DateUtil.isEndOfYear(end)) {
           return DateUtil.getStartOfYear(end);
         }
      },

      _getEndValueByControlPeriodType: function (start, periodType) {
         if (periodType === 'month' && DateUtil.isStartOfMonth(start)) {
            return DateUtil.getEndOfMonth(start);
         } else if (periodType === 'quarter' && DateUtil.isStartOfQuarter(start)) {
            return DateUtil.getEndOfQuarter(start);
         } else if (periodType === 'halfyear' && DateUtil.isStartOfHalfyear(start)) {
            return DateUtil.getEndOfHalfyear(start);
         } else if (periodType === 'year' && DateUtil.isStartOfYear(start)) {
            return DateUtil.getEndOfYear(start);
         }
      },

      setStartValue: function (value, silent) {
         var sType = this._getRangeTypeIfSingle(),
            changed;
         if (this._options.autoValue && sType) {
            changed = DateRangeSlider.superclass.setStartValue.call(this, value, true);
            if (changed) {
               if (!silent) {
                  this._notifyOnStartValueChanged();
               }
               if (this.setEndValue(this._getEndValueByControlPeriodType(value, sType), true)) {
                  if (!silent) {
                     this._notifyOnEndValueChanged();
                  }
               }
               if (!silent) {
                  this._notifyOnRangeChanged();
               }
            }
         } else {
            changed = DateRangeSlider.superclass.setStartValue.apply(this, arguments);
         }
         return changed
      },

      setEndValue: function (value, silent) {
         var sType = this._getRangeTypeIfSingle(),
            changed;
         if (this._options.autoValue && sType) {
            changed = DateRangeSlider.superclass.setEndValue.call(this, value, true);
            if (changed) {
               if (!silent) {
                  this._notifyOnEndValueChanged();
               }
               if (this.setStartValue(this._getStartValueByControlPeriodType(value, sType), true)) {
                  if (!silent) {
                     this._notifyOnStartValueChanged();
                  }
               }
               if (!silent) {
                  this._notifyOnRangeChanged();
               }
            }
         } else {
            changed = DateRangeSlider.superclass.setEndValue.apply(this, arguments);
         }
         return changed
      },

      showPicker: function () {
         if (this.isEnabled()) {
            DateRangeSlider.superclass.showPicker.apply(this, arguments);
         }
      }
   });

   return DateRangeSlider;
});
