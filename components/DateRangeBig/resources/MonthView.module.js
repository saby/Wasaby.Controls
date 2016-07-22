define('js!SBIS3.CONTROLS.DateRangeBig.MonthView', [
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
            
         }
      },
      $constructor: function () {
         this._publish('onActivated', 'onMonthActivated', 'onSelectionStarted', 'onSelectingRangeEndDateChange');
      },

      init: function () {
         MonthView.superclass.init.call(this);

         var self = this,
            container = this.getContainer();
         
         // container.addClass('controls-DateRangeBigChoose-MonthView');
         
         container.find('.' + this._CSS_CLASSES.CAPTION).click(function () {
            self._notify('onActivated');
         });
         
         container.find('.' + this._CSS_CLASSES.DAY_TABLE).click(function () {
            self._notify('onMonthActivated');
         });
      },

      /**
       * Перекрываем базовый функционал. Нам не надо что бы сбрасывалось выделение, когда пользователь убирает мышку с контрола.
       * @private
       */
      _onMouseLeave: function () {
      },

      startSelection: function (start, end, silent) {
         if (this.isSelectionProcessing()) {
            return;
         }
         this._startRangeSelection(start, end, silent);
      },

      _startRangeSelection: function (start, end, silent) {
         MonthView.superclass._startRangeSelection.call(this, start, end, silent);
         if (!silent) {
            this._notify('onSelectionStarted', start, end);
         }
      },

      _setSelectionRangeEndItem: function (date, silent) {
         var changed = MonthView.superclass._setSelectionRangeEndItem.call(this, date);
         if (changed && !silent) {
            this._notify('onSelectingRangeEndDateChange', this._rangeSelectionEnd, date);
         }
         return changed
      }


   });
   return MonthView;
});