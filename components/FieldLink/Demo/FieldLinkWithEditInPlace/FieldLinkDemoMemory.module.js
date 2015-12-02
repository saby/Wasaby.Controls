/**
 * Created by am.gerasimov on 19.11.2015.
 */
/* global define, $ws */
define('js!SBIS3.CONTROLS.DemoMemory', ['js!SBIS3.CONTROLS.Data.Source.Memory'], function (Memory) {
   'use strict';

   var DemoMemory = Memory.extend({
      /**
       * Применяет фильтр
       * @param {*} data Данные
       * @param {Object} where Фильтр
       * @returns {*}
       * @private
       */
      _applyWhere: function (data, where) {
         where = where || {};
         if (Object.isEmpty(where)) {
            return data;
         }

         var tableAdapter = this._options.adapter.forTable(),
             recordAdapter = this._options.adapter.forRecord(),
             newData = tableAdapter.getEmpty();
         this._each(data, function(item) {
            var filterMatch = true;

            //TODO: разбор выражений в filterField, вида 'date>'
            for (var filterField in where) {
               if (!where.hasOwnProperty(filterField)) {
                  continue;
               }
               //FIXME: избавиться от этого sbis-specified
               if (filterField == 'Разворот' || filterField == 'ВидДерева') {
                  continue;
               }
               var fieldValue = recordAdapter.get(item, filterField);
               filterMatch = fieldValue && fieldValue.toLowerCase().indexOf(where[filterField].toLowerCase()) !== -1;
               if (!filterMatch) {
                  break;
               }
            }

            if (filterMatch) {
               tableAdapter.add(newData, item);
            }
         }, this);

         return newData;
      }
   });


   return DemoMemory;
});
