define('SBIS3.CONTROLS/Date/RangeSliderBase',[
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/Date/RangeSliderBase/DateRangeSliderBase',
   'tmpl!SBIS3.CONTROLS/Date/RangeSliderBase/resources/LockIcon',
   'SBIS3.CONTROLS/Mixins/RangeMixin',
   'SBIS3.CONTROLS/Mixins/DateRangeMixin',
   'SBIS3.CONTROLS/Mixins/PickerMixin',
   'SBIS3.CONTROLS/Mixins/FormWidgetMixin',
   'Controls/Calendar/Utils',
   'SBIS3.CONTROLS/Link',
   'css!SBIS3.CONTROLS/Date/RangeSliderBase/DateRangeSliderBase'
], function (CompoundControl, dotTplFn, lockIconTemplate, RangeMixin, DateRangeMixin, PickerMixin, FormWidgetMixin, dateControlsUtils) {
   'use strict';

   /**
    * Базовый класс для контролов выглядящих как ссыслка с возможностью листать периоды в большую и меньшую сторону.
    *
    * SBIS3.CONTROLS/Date/RangeSliderBase
    * @class SBIS3.CONTROLS/Date/RangeSliderBase
    * @extends Lib/Control/CompoundControl/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
    * @mixes SBIS3.CONTROLS/Mixins/RangeMixin
    * @mixes SBIS3.CONTROLS/Mixins/DateRangeMixin
    * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
    *
    * @author Миронов А.Ю.
    *
    * @control
    * @public
    * @category Date/Time
    */
   var DateRangeSlider = CompoundControl.extend([PickerMixin, RangeMixin, DateRangeMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS/Date/RangeSliderBase.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            lockIconTemplate: lockIconTemplate,
            // year: null,
            /**
             * @cfg {String} тип комопонента
             * normal - стандартный вид
             * link - в виде ссылки
             */
            type: 'normal',

            /**
             * @cfg {Boolean} отобразить управляющую стрелку для переключения на следующий период
             */
            showNextArrow: true,
            /**
             * @cfg {Boolean} отобразить управляющую стрелку для переключения на предыдущий период
             */
            showPrevArrow: true,

            /**
             * @cfg {Boolean} включает или отключает отображение замка.
             */
            showLock: false,

            /**
             * @cfg {String} текст который используется если период не выбран
             */
            emptyCaption: rk('Период не указан'),

            /**
             * @cfg {String} Шаблон строки месяца. В шаблон передается дата первого числа рисуемого месяца и функция
             * форматирования дат {@link Core/helpers/Date/format}
             */
            monthTemplate: null,

            /**
             * @cfg {Function} Функция форматирования заголовка.
             */
            captionFormatter: null,

            locked: true
         },
         _cssRangeSlider: {
            value: 'controls-DateRangeSlider__value',
            yearState: 'controls-DateRangeSlider__yearState'
         }
      },

      init: function () {
         var container = this.getContainer();

         DateRangeSlider.superclass.init.call(this);

         if (this._options.type === 'normal') {
            container.find(['.', this._cssRangeSlider.value].join('')).click(this.showPicker.bind(this));
         } else {
            this.getChildControlByName('Link').subscribe('onActivated', this.showPicker.bind(this));
         }

         container.find('.controls-DateRangeSlider__prev').click(this._onPrevBtnClick.bind(this));
         container.find('.controls-DateRangeSlider__next').click(this._onNextBtnClick.bind(this));
      },

      _modifyOptions: function() {
         var opts = DateRangeSlider.superclass._modifyOptions.apply(this, arguments);
         opts.captionFormatter = opts.captionFormatter || dateControlsUtils.formatDateRangeCaption;
         opts._caption = this._getCaption(opts);
         opts._isMinWidth = this._isMinWidth(opts);
         opts._prevNextButtonsEnabledClass = opts.enabled ? ' controls-DateRangeSlider__prevNextButtons-enabled' : ' controls-DateRangeSlider__prevNextButtons-disabled';
         opts._valueEnabledClass = opts.enabled ? ' controls-DateRangeSlider__value-enabled' : ' controls-DateRangeSlider__value-disabled';
         return opts;
      },

      _isMinWidth: function (opts) {
         // Минимальную высоту устанавливаем если контрол находится в режиме выбора не только года и включены стрелки влево или вправо
         return (opts.showMonths || opts.showQuarters || opts.showHalfyears) && (opts.showPrevArrow || opts.showNextArrow);
      },

      setStartValue: function() {
         var changed = DateRangeSlider.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            this._updateValueView();
         }
         return changed;
      },

      setEndValue: function() {
         var changed = DateRangeSlider.superclass.setEndValue.apply(this, arguments);
         if (changed) {
            this._updateValueView();
         }
         return changed;
      },

      _onPrevBtnClick: function () {
         if (this.isEnabled() && this.getStartValue() && this.getEndValue()) {
            this.setPrev();
            this._updateValueView();
         }
      },

      _onNextBtnClick: function () {
         if (this.isEnabled() && this.getStartValue() && this.getEndValue()) {
            this.setNext();
            this._updateValueView();
         }
      },

      _updateValueView: function () {
         var caption = this._getCaption();
         if (this._options.type === 'normal') {
            this.getContainer().find(['.', this._cssRangeSlider.value].join('')).text(caption);
         } else {
            this.getChildControlByName('Link').setCaption(caption);
         }
         //Сбрасываем валидацию после изменения значения
         this.clearMark();
      },

      _getCaption: function (opts) {
         opts = opts || this._options;
         return opts.captionFormatter(
            opts.startValue,
            opts.endValue,
            opts.showUndefined ? opts.emptyCaption : null
         );
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
         return this._options.locked;
      },
      setLocked: function (value) {
         var btnContainer;
         if (value === this._options.locked) {
            return;
         }
         this._options.locked = value;
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
            btnContainer = $(this._options.lockIconTemplate(this._options));
            this.getContainer().find('.controls-DateRangeSlider__value-wrapper').prepend(btnContainer);
         } else {
            this.getContainer().find('.controls-DateRangeSlider__lock').remove();
         }
      },

      _updateLockButtonClasses: function (btnContainer) {
         if (this.isLocked()) {
            btnContainer.removeClass('icon-Unlock icon-disabled');
            btnContainer.addClass('controls-DateRangeSlider__lock-locked icon-Lock icon-primary');
         } else {
            btnContainer.removeClass('.controls-DateRangeSlider__lock-locked icon-Lock icon-primary');
            btnContainer.addClass('icon-Unlock icon-disabled');
         }
      },

      _setEnabled: function () {
         var container = this.getContainer();
         DateRangeSlider.superclass._setEnabled.apply(this, arguments);
         container.find('.controls-DateRangeSlider__prev, .controls-DateRangeSlider__next')
            .toggleClass('controls-DateRangeSlider__prevNextButtons-disabled', !this.isEnabled())
            .toggleClass('controls-DateRangeSlider__prevNextButtons-enabled', this.isEnabled());
         container.find('.controls-DateRangeSlider__value')
            .toggleClass('controls-DateRangeSlider__value-disabled', !this.isEnabled())
            .toggleClass('controls-DateRangeSlider__value-enabled', this.isEnabled());
      },
      markControl: function () {
         DateRangeSlider.superclass.markControl.apply(this, arguments);
         this.getContainer().toggleClass('controls-DateRangeSlider__validation-error', this.isMarked());
      },
      clearMark: function() {
         DateRangeSlider.superclass.clearMark.apply(this, arguments);
         this.getContainer().toggleClass('controls-DateRangeSlider__validation-error', this.isMarked());
      }
   });

   return DateRangeSlider;
});
