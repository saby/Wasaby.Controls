define('js!SBIS3.CONTROLS.DateRangeSliderBase',[
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.DateRangeSliderBase',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'Core/helpers/date-helpers',
   'js!SBIS3.CONTROLS.Link',
   'css!SBIS3.CONTROLS.DateRangeSliderBase'
], function (CompoundControl, dotTplFn, RangeMixin, DateRangeMixin, PickerMixin, dateHelpers) {
   'use strict';

   /**
    * Базовый класс для контролов выглядящих как ссыслка с возможностью листать периоды в большую и меньшую сторону.
    *
    * SBIS3.CONTROLS.DateRangeSliderBase
    * @class SBIS3.CONTROLS.DateRangeSliderBase
    * @extends $ws.proto.CompoundControl
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.RangeMixin
    * @mixes SBIS3.CONTROLS.DateRangeMixin
    * @author Миронов Александр Юрьевич
    *
    * @control
    * @public
    * @category Date/Time
    */
   var DateRangeSlider = CompoundControl.extend([PickerMixin, RangeMixin, DateRangeMixin], /** @lends SBIS3.CONTROLS.DateRangeSliderBase.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
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

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'left'
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

         this.subscribe('onRangeChange', this._updateValueView.bind(this));
      },

      _modifyOptions: function() {
         var opts = DateRangeSlider.superclass._modifyOptions.apply(this, arguments);
         opts._caption = dateHelpers.getFormattedDateRange(opts.startValue, opts.endValue, {shortYear: true, contractToHalfYear: true, contractToQuarter: true});
         return opts;
      },

      _onPrevBtnClick: function () {
         this.setPrev();
         this._updateValueView();
      },

      _onNextBtnClick: function () {
         this.setNext();
          this._updateValueView();
      },

      _updateValueView: function () {
         var caption = dateHelpers.getFormattedDateRange(this.getStartValue(), this.getEndValue(), {shortYear: true, contractToHalfYear: true, contractToQuarter: true});
         if (this._options.type === 'normal') {
            this.getContainer().find(['.', this._cssRangeSlider.value].join('')).text(caption);
         } else {
            this.getChildControlByName('Link').setCaption(caption);
         }

      }
   });

   return DateRangeSlider;
});
