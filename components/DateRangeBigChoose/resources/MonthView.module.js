define('js!SBIS3.CONTROLS.DateRangeBigChoose.MonthView', [
   'js!SBIS3.CONTROLS.MonthView'
], function (MonthView) {
   'use strict';
   /**
    * SBIS3.CONTROLS.DateRangeBig.MonthView
    * @class SBIS3.CONTROLS.DateRangeBig.MonthView
    * @extends SBIS3.CONTROLS.MonthView
    * @author Миронов Александр Юрьевич
    * @control
    */
   var MonthView = MonthView.extend(/** @lends SBIS3.CONTROLS.DateRangeBig.MonthView.prototype */{
      $protected: {
         _options: {
            rangeselect: false,
            activableByClick: false,
            cssClassName: 'controls-DateRangeBigChoose-MonthView'
         }
      },
      $constructor: function () {
         this._publish('onActivated', 'onMonthActivated', 'onSelectionStarted', 'onSelectingRangeEndDateChange');
      },

      init: function () {
         MonthView.superclass.init.call(this);

         var self = this,
            container = this.getContainer();
         
         container.find('.' + this._MONTH_VIEW_CSS_CLASSES.CAPTION).click(function () {
            self._notify('onActivated');
         });
         
         container.find('.' + this._MONTH_VIEW_CSS_CLASSES.TABLE).click(function () {
            self._notify('onMonthActivated');
         });
      },

      /**
       * Перекрываем базовый функционал. Нам не надо что бы сбрасывалось выделение, когда пользователь убирает мышку с контрола.
       * @private
       */
      _onRangeControlMouseLeave: function () {
      },

      startSelection: function (start, end, silent) {
         if (this.isSelectionProcessing()) {
            return;
         }
         this._startRangeSelection(start, end, silent);
      },

      _setSelectionRangeEndItem: function (date, silent) {
         var changed = MonthView.superclass._setSelectionRangeEndItem.call(this, date);
         if (changed && !silent) {
            this._notify('onSelectingRangeEndDateChange', this._rangeSelectionEnd, date, this._getSelectionType());
         }
         return changed
      },

      _drawRangeSelection: function (start, end) {
         var ret = MonthView.superclass._drawRangeSelection.apply(this, arguments);
         this._updateBorders();
         return ret;
      },

      _updateBorders: function () {
         var self = this,
            rows = this.getContainer().find(['.', this._MONTH_VIEW_CSS_CLASSES.TABLE_ROW].join('')),
            borderTopClass = 'controls-DateRangeBigChoose-MonthView__border-top',
            borderBottomClass = 'controls-DateRangeBigChoose-MonthView__border-bottom',
            beforeTodayClass = 'controls-DateRangeBigChoose-MonthView__beforeToday',
            aboveTodayClass = 'controls-DateRangeBigChoose-MonthView__aboveToday',
            prevElement;
         this.getContainer().find(['.', borderTopClass].join('')).removeClass(borderTopClass);
         this.getContainer().find(['.', borderBottomClass].join('')).removeClass(borderBottomClass);

         if(rows && rows.length) {
            rows.each(function (trIndex, trElement) {
               trElement = $(trElement);
               trElement.children().each(function (tdIndex, tdElement) {
                  tdElement = $(tdElement);
                  if (tdElement.hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selected)) {
                     if (!prevElement) {
                        tdElement.addClass(borderTopClass);
                     } else {
                        if (!$(prevElement.children()[tdIndex]).hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selected) ||
                           $(prevElement.children()[tdIndex]).hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selectedStart)) {
                           tdElement.addClass(borderTopClass);
                        }
                        if (tdElement.hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd) &&
                           $(prevElement.children()[tdIndex]).hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selected)) {
                           $(prevElement.children()[tdIndex]).addClass(borderBottomClass);
                        }
                     }
                  } else {
                     if (prevElement && $(prevElement.children()[tdIndex]).hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selected)) {
                        $(prevElement.children()[tdIndex]).addClass(borderBottomClass);
                     }
                  }
                  if (tdElement.hasClass(self._MONTH_VIEW_CSS_CLASSES.TODAY)) {
                     if (tdIndex) {
                        $(trElement.children()[tdIndex - 1]).addClass(beforeTodayClass);
                     }
                     if (prevElement) {
                        $(prevElement.children()[tdIndex]).addClass(aboveTodayClass);
                     }
                  }
               });
               prevElement = trElement
            });
            prevElement.children().each(function (tdIndex, tdElement) {
               tdElement = $(tdElement);
               if (tdElement.hasClass(self._SELECTABLE_RANGE_CSS_CLASSES.selected)) {
                  tdElement.addClass(borderBottomClass);
               }
            });
         }
      }

   });
   return MonthView;
});
