define('js!SBIS3.CONTROLS.DateRangeSlider',[
   'js!SBIS3.CONTROLS.DateRangeSliderBase',
   'js!SBIS3.CONTROLS.DateRangeChoosePickerMixin',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.Link'
], function (DateRangeSliderBase, DateRangeChoosePickerMixin, DateUtil) {
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
            autoValue: true,

            /**
             * @cfg {Boolean} включает или отключает отображение замка.
             */
            showLock: false
         },

         _locked: true
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
      },

      _onClickHandler: function(event) {
         var target = $(event.target);
         DateRangeSlider.superclass._onClickHandler.apply(this, arguments);
         if (this.isEnabled()) {
            if (target.hasClass('controls-DateRangeSlider__lock')) {
               this._onLockBtnClick();
            }
         }
      },

      _onLockBtnClick: function () {
         this.toggleLocked();
      },

      isLocked: function () {
         return this._locked;
      },
      setLocked: function (value) {
         var btnContainer;
         if (value === this._locked) {
            return;
         }
         this._locked = value;
         if (this.isShowLock()) {
            btnContainer = this.getContainer().find('.controls-DateRangeSlider__lock');
            this._updateLockButtonClasses(btnContainer);
            this._notify('onLockedChanged', value);
         }
      },
      toggleLocked: function () {
         this.setLocked(!this.isLocked());
      },

      isShowLock: function () {
         return this._options.showLock;
      },
      setShowLock: function (value) {
         var btnContainer;
         if (value === this._options.showLock) {
            return;
         }
         this._options.showLock = value;
         if (value) {
            btnContainer = $('<span class="controls-DateRangeSlider__lock icon-16"></span>');
            this._updateLockButtonClasses(btnContainer);
            this.getContainer().find('.controls-DateRangeSlider__value-wrapper').prepend(btnContainer);
         } else {
            this.getContainer().find('.controls-DateRangeSlider__lock').remove();
         }
      },

      _updateLockButtonClasses: function (btnContainer) {
         if (this._locked) {
            btnContainer.removeClass('icon-Unlock icon-disabled');
            btnContainer.addClass('controls-DateRangeSlider__lock-locked icon-Lock icon-primary');
         } else {
            btnContainer.removeClass('.controls-DateRangeSlider__lock-locked icon-Lock icon-primary');
            btnContainer.addClass('icon-Unlock icon-disabled');
         }
      }
   });

   return DateRangeSlider;
});
