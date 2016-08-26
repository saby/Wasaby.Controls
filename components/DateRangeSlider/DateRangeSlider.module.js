define('js!SBIS3.CONTROLS.DateRangeSlider',[
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.DateRangeSlider',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DateRangeChoose',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.Link'
], function (CompoundControl, dotTplFn, RangeMixin, DateRangeMixin, PickerMixin, DateRangeChoose, DateUtil) {
   'use strict';

   var DateRangeSlider = CompoundControl.extend([DateRangeMixin, RangeMixin, PickerMixin], {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            year: null,

            showMonths: true,
            showQuarters: true,
            showHalfyears: true,

            checkedMonthStart: null,
            checkedMonthEnd: null,

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'left',
                  // offset: -3
               },
               verticalAlign: {
                  side: 'top',
                  offset: -6
               }
            }
         },
         _cssRangeSlider: {
            value: 'controls-DateRangeSlider__value',
            pickerContainer: 'controls-DateRangeSlider__pickerContainer',
            yearState: 'controls-DateRangeSlider__yearState'
         }
      },

      $constructor: function () {
         // this._publish('onChangeHoveredItem');
         if (!this._options.startValue) {
            throw new Error('Ошибка создания контрола. Не задана опция startValue');
         }
         if (!this._options.endValue) {
            throw new Error('Ошибка создания контрола. Не задана опция endValue');
         }
      },

      init: function () {
         var self = this,
            container = this.getContainer();

         DateRangeSlider.superclass.init.call(this);

         if (!this.getYear()) {
            this.setYear((new Date()).getFullYear());
         }

         if (!this._options.showMonths && !this._options.showQuarters && !this._options.showHalfyears) {
            this.getContainer().addClass(this._cssRangeSlider.yearState);
         }

         container.find(['.', this._cssRangeSlider.value].join('')).click(this._onValueClick.bind(this));

         container.find('.controls-DateRangeSlider__prev').click(this._onPrevBtnClick.bind(this));
         container.find('.controls-DateRangeSlider__next').click(this._onNextBtnClick.bind(this));

         this.subscribe('onRangeChange', this._onRangeChanged.bind(this));
         this._updateValueView();
      },

      /**
       * Устнавливает текущий год
       * @param year
       */
      setYear: function (year) {
         this._options.year = year
      },
      /**
       * Возвращает текущий год
       * @returns {Number}
       */
      getYear: function () {
         return this._options.year;
      },

      _onRangeChanged: function (e, start, end) {
         this._updateValueView();
      },

      _onValueClick: function () {
         if (this._chooserControl) {
            this._chooserControl.setRange(this.getStartValue(), this.getEndValue());
         }
         this.showPicker();
      },

      _onPrevBtnClick: function () {
         var start = this.getStartValue(),
            end = this.getEndValue(),
            periodType = $ws.helpers.getPeriodType(start, end);
         if(periodType === 'month') {
            this._slideInterval(-1);
         } else if(periodType === 'quarter') {
            this._slideInterval(-3);
         } else if(periodType === 'halfyear') {
            this._slideInterval(-6);
         } else if(periodType === 'year') {
            this._slideInterval(-12);
         }
      },

      _onNextBtnClick: function () {
         var start = this.getStartValue(),
            end = this.getEndValue(),
            periodType = $ws.helpers.getPeriodType(start, end);
         if(periodType === 'month') {
            this._slideInterval(1);
         } else if(periodType === 'quarter') {
            this._slideInterval(3);
         } else if(periodType === 'halfyear') {
            this._slideInterval(6);
         } else if(periodType === 'year') {
            this._slideInterval(12);
         }
      },

      _slideInterval: function (monthDelta) {
         var start = this.getStartValue(),
            end = this.getEndValue();
         start = new Date(start.getFullYear(), start.getMonth() + monthDelta, 1);
         end = new Date(end.getFullYear(), end.getMonth() + monthDelta + 1, 0);
         this.setRange(start, end);
         this._updateValueView();
      },

      _updateValueView: function () {
         this.getContainer().find(
            ['.', this._cssRangeSlider.value].join('')
         ).text(
            $ws.helpers.getFormattedDateRange(this.getStartValue(), this.getEndValue(), {shortYear: true, contractToHalfYear: true, contractToQuarter: true})
         )
      },

      /**
       * Определение контента пикера. Переопределённый метод
       * @private
       */
      _setPickerContent: function() {
         var self = this,
            // Создаем пустой контейнер
            element = $(['<div class="', this._cssRangeSlider.pickerContainer, '"></div>'].join(' '));

         this._picker.getContainer().empty();
         // Преобразуем контейнер в контролл DateRangeChoose и запоминаем
         self._chooserControl = new DateRangeChoose({
            parent: this._picker,
            element: element,
            startValue: this.getStartValue(),
            endValue: this.getEndValue(),
            showMonths: this._options.showMonths,
            showQuarters: this._options.showQuarters,
            showHalfyears: this._options.showHalfyears,
            checkedMonthStart: this._options.checkedMonthStart,
            checkedMonthEnd: this._options.checkedMonthEnd
         });

         // Добавляем в пикер
         this._picker.getContainer().append(element);

         this._chooserControl.subscribe('onChoose', this._onChooserRangeChange.bind(this));
      },

      _onChooserRangeChange: function (e, start, end) {
         this.setRange(start, end);
         this.hidePicker();
      }
   });

   return DateRangeSlider;
});
