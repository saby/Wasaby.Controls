/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataSource', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
      },
      $constructor: function () {
      },

      //FixMe: видимо тут ничего не передаем?!
      create: function () {
         /*Method must be implemented*/
      },

      /**
       * Прочитать запись
       * @param id - идентификатор записи
       * //TODO - не понятен тип возвращаяемого значения
       */
      read: function (id) {
         /*Method must be implemented*/
      },

      /**
       * Обновить запись
       * @param record - измененная запись //TODO - под вопросом
       */
      update: function (record) {
         /*Method must be implemented*/
      },

      /**
       * Удалить запись
       * @param id - идентификатор записи
       */
      remove: function (id) {
         /*Method must be implemented*/
      },
      /**
       * Вызов списочного метода
       * @param filter - [{property: 'id', value: 2}]
       * @param sorting - [{property1: 'id', direction: 'ASC'},{property2: 'name', direction: 'DESC'}]
       * @param offset - number
       * @param limit - number
       */
      query: function (filter, sorting, offset, limit) {
         /*Method must be implemented*/
      }

   });
});