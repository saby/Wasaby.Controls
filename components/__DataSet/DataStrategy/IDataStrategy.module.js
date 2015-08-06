/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataStrategy', [], function () {
   'use strict';

   /**
    * Интерфейс предназначен для унификации работы с исходными данными датасорсов
    * @class SBIS3.CONTROLS.IDataStrategy
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.IDataStrategy.prototype */{
      $protected: {},
      $constructor: function () {
      },
      /**
       * Метод-итератор для обхода по сырым данным
       */
      each: function () {
         /*Method must be implemented*/
      },
      /**
       * Получить значение поля записи
       */
      value: function () {
         /*Method must be implemented*/
      },
       /**
        *
        */
      at: function () {
         /*Method must be implemented*/
      },
       /**
        *
        */
      replaceAt: function () {
         /*Method must be implemented*/
      },
      /**
       * Добавляет запись
       * @param {Array} data Массив "сырых" данных
       * @param {SBIS3.CONTROLS.Record} record Добавляемая запись
       * @param {Integer} [at] Позиция вставки (по умолчанию в конец)
       */
      addRecord: function () {
         /*Method must be implemented*/
      },
       /**
        *
        */
      rebuild: function () {
         /*Method must be implemented*/
      },

      /**
       * Установить значение поля записи
       */
      setValue: function () {
         /*Method must be implemented*/
      },
       /**
        *
        * @param {Object} data
        * @returns {{}}
        */
      getMetaData: function(data) {
         return {};
      },

      getParentKey: function (rawKey) {
         /*Method must be implemented*/
      },

      getEmptyRawData: function () {
         /*Method must be implemented*/
      }

   });
});