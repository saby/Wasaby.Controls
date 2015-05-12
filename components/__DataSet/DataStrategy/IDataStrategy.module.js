/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataStrategy', [], function () {
   'use strict';

   /**
    * Интерфейс предназначен для унификации работы с исходными данными датасорсов
    * @author Мануйлов Андрей
    * @public
    */

   return $ws.core.extend({}, {
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
        * Метод добавления записи
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

      getEmptyRawData: function () {
         /*Method must be implemented*/
      }

   });
});