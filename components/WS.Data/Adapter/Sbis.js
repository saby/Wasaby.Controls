/* global define, require */
define('js!WS.Data/Adapter/Sbis', [
   'js!WS.Data/Adapter/Abstract',
   'js!WS.Data/Adapter/SbisTable',
   'js!WS.Data/Adapter/SbisRecord',
   'js!WS.Data/Adapter/SbisFieldType',
   'js!WS.Data/Di',
   'js!WS.Data/Collection/RecordSet',
   'js!WS.Data/Entity/Model'
], function (
   Abstract,
   SbisTable,
   SbisRecord,
   FIELD_TYPE,
   Di
) {
   'use strict';

   /**
    * Адаптер для данных в формате СБиС.
    * Работает с форматом данных, который использует БЛ СБИС.
    * Примеры можно посмотреть в модулях {@link WS.Data/Adapter/SbisRecord} и {@link WS.Data/Adapter/SbisTable}.
    * @class WS.Data/Adapter/Sbis
    * @extends WS.Data/Adapter/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Sbis = Abstract.extend(/** @lends WS.Data/Adapter/Sbis.prototype */{
      _moduleName: 'WS.Data/Adapter/Sbis',

      forTable: function (data) {
         return new SbisTable(data);
      },

      forRecord: function (data) {
         return new SbisRecord(data);
      },

      getKeyField: function (data) {
         //TODO: имя поля с ПК может лежать в this._data.k (при этом может принимать значение -1)
         var index, s;
         if(data && data.s) {
            s = data.s;
            for (var i = 0, l = s.length; i < l; i++) {
               if (s[i].n && s[i].n[0] === '@') {
                  index = i;
                  break;
               }
            }
            if (index === undefined && s.length) {
               index = 0;
            }
         }
         return index === undefined ? undefined : s[index].n;
      }
   });

   Sbis.FIELD_TYPE = FIELD_TYPE;

   Di.register('adapter.sbis', Sbis);

   return Sbis;
});
