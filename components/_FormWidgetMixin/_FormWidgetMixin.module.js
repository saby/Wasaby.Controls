define('js!SBIS3.CONTROLS._FormWidgetMixin', [], function() {
   /**
    * Добавляет к любому контролу методы для получения и установки “значения”.
    * Необходим для однообразной работы с набором контролов на диалоге, когда речь идет о сохранении набора данных в БЛ,
    * или заполнении контролов значениями из БЛ. В каждом контроле методы должны быть определены
    * @mixin SBIS3.CONTROLS._FormWidgetMixin
    */
   var _FormWidgetMixin = /** @lends SBIS3.CONTROLS._FormWidgetMixin.prototype */{
      $protected: {

      },

      $constructor: function() {

      },

      /**
       * Установить значение
       * @param val значение
       */
      setValue: function(val) {

      },
      /**
       * Получить значение
       */
      getValue: function() {

      }

   };

   return _FormWidgetMixin;

});