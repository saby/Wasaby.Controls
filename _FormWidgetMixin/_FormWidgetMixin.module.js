define('js!SBIS3.CONTROLS._FormWidgetMixin', [], function() {
   /**
    * Добавляет к любому контролу понятие значения
    * @mixin SBIS3.CONTROLS._FormWidgetMixin
    */
   var _FormWidgetMixin = /** @lends SBIS3.CONTROLS._FormWidgetMixin.prototype */{
      $protected: {
            /**
             * @cfg {*} Значение
             */
            value: null
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