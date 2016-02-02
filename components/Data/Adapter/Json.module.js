/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Json', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonTable',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonRecord',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Abstract, JsonTable, JsonRecord, Di) {
   'use strict';

   /**
    * Адаптер для данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.Json
    * @extends SBIS3.CONTROLS.Data.Adapter.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Json = Abstract.extend(/** @lends SBIS3.CONTROLS.Data.Adapter.Json.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Json',

      forTable: function (data) {
         return new JsonTable(data);
      },

      forRecord: function (data) {
         return new JsonRecord(data);
      }
   });

   Di.register('adapter.json', Json);

   return Json;
});

