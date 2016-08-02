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
            className: 'controls-DateRangeBigChoose-MonthView'
         }
      },
      $constructor: function () {
         this._publish('onActivated', 'onMonthActivated', 'onSelectionStarted', 'onSelectingRangeEndDateChange');
      },

      init: function () {
         MonthView.superclass.init.call(this);

         var self = this,
            container = this.getContainer();
         
         container.find('.' + this.MONTH_VIEW_CSS_CLASSES.CAPTION).click(function () {
            self._notify('onActivated');
         });
         
         container.find('.' + this.MONTH_VIEW_CSS_CLASSES.TABLE).click(function () {
            self._notify('onMonthActivated');
         });
      },

      _moveFocusToSelf: function(dontChangeDomFocus) {
         // Контрол не должен принимать на себя фокус
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
      }


   });
   return MonthView;
});
