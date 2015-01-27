/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyArray', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';
   return IDataStrategy.extend({
      $protected: {
      },
      $constructor: function () {
      },
      /**
       * Метод для обхода по сырым данным
       * @param data
       * @param iterateCallback
       * @param context
       */
      each: function (data, iterateCallback, context) {
         var
            length = data.length;
         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, data[i]);
         }
      },

      /**
       * Получить сырые данные для записи по ключевому полю
       * @param data
       * @param keyField
       * @param key
       * @returns {*}
       */
      getByKey: function (data, keyField, key) {
         var item,
            length = data.length;
         for (var i = 0; i < length; i++) {
            if (data[i][keyField] == parseInt(key, 10)) {
               item = data[i];
            }
         }
         return item;
      },

      /**
       * Установить значение поля записи
       * @param data
       * @param field
       * @param value
       * @returns {*}
       */
      setValue: function (data, field, value) {
         data = data || {};
         data[field] = value;
         return data;
      },

      /**
       * Получить значение поля записи
       * @param data
       * @param field
       * @returns {*}
       */
      value: function (data, field) {
         return data[field];
      }

   });
});