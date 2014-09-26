define('js!SBIS3.CONTROLS.MonthPicker', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';
   /**
    * Контрол выбор месяца и года с выпадающей вниз панелью.
    * Не наследуется от поля ввода, потому что там в принципе не требуется текстовый ввод
    * @class SBIS3.CONTROLS.MonthPicker
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS._PickerMixin
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    * @category Date\Time
    */

   var MonthPicker = Control.Control.extend(/** @lends SBIS3.CONTROLS.MonthPicker.prototype */{
      $protected: {
         _options: {
            /**
             * @typedef {Object} ModeEnum
             * @variant month только месяц
             * @variant year месяц и год
             */
            /**
             * @cfg {ModeEnum} ввод только месяца или месяца и года (month/year)
             */
            mode: 'month',
            /**
             * @cfg {String} формат визуального отображения месяца
             */
            monthFormat: ''
         }
      },

      $constructor: function() {

      },
      /**
       * Установить режим ввода (Месяц/Месяц и Год)
       * @param {String} mode
       */
      setMode: function(mode) {

      },
      /**
       * Установить текущий месяц/год
       */
      setToday: function() {

      },
      /**
       * Уставновить следующий месяц/год
       */
      setNext: function() {

      },
      /**
       * Уставновить предыдущий месяц/год
       */
      setPrev: function() {

      }
   });

   return MonthPicker;

});