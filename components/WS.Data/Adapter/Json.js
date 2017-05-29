/* global define */
define('js!WS.Data/Adapter/Json', [
   'js!WS.Data/Adapter/Abstract',
   'js!WS.Data/Adapter/JsonTable',
   'js!WS.Data/Adapter/JsonRecord',
   'js!WS.Data/Di'
], function (
   Abstract,
   JsonTable,
   JsonRecord,
   Di
) {
   'use strict';

   /**
    * Адаптер для данных в формате JSON.
    * Работает с данными, представленными в виде обычных JSON объектов.
    * Примеры можно посмотреть в модулях {@link WS.Data/Adapter/JsonRecord} и {@link WS.Data/Adapter/JsonTable}.
    * @class WS.Data/Adapter/Json
    * @extends WS.Data/Adapter/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Json = Abstract.extend(/** @lends WS.Data/Adapter/Json.prototype */{
      _moduleName: 'WS.Data/Adapter/Json',

      forTable: function (data) {
         return new JsonTable(data);
      },

      forRecord: function (data) {
         return new JsonRecord(data);
      },

      getKeyField: function () {
         return undefined;
      }
   });

   Di.register('adapter.json', Json);

   return Json;
});

