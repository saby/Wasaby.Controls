define([], function () {
   'use strict';

   /**
    * Абстрактный декоратор
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator
    * @public
    * @author Мальцев Алексей Александрович
    */
   var AbstractDecorator = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Декоратор включен
             */
            enabled: true,

            /**
             * @cfg {String} Метод контрола, позволяющий определить, надо ли подключать декоратор
             */
            enabledGetter: ''
         }
      },

      $constructor: function () {
      },

      destroy: function () {
      },

      setConditions: function(){
      },

      checkCondition: function(){
      },

      /**
       * Обновляет настройки декоратора
       * @param {Object} control Экземпляр контрола
       */
      update: function (control) {
         if (this._options.enabledGetter) {
            this._options.enabled = control[this._options.enabledGetter]();
         }
      },

      /**
       * Применяет декоратор
       * @param {*} value Объект для декорирования
       * @returns {*}
       */
      apply: function (value) {
         return value;
      },

      /**
       * Возвращает признак активности декоратора
       * @returns {Boolean}
       */
      isEnabled: function () {
         return this._options.enabled;
      }

   });

   return AbstractDecorator;
});
