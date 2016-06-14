/**
 * Created by am.gerasimov on 08.02.2016.
 */
define('js!SBIS3.CONTROLS.DEMO.DemoSuggestMemory', [
   'js!SBIS3.CONTROLS.Data.Source.Memory',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis'],
    function (Memory, Sbis) {
   'use strict';

   var DemoSuggestMemory = Memory.extend({
      $protected: {
         _options: {
            data: {
               _type: 'recordset',
               d: [
                  [0, 'Инженер-программист', '1-ая категория'],
                  [1, 'Инженер-программист', '2-ая категория'],
                  [2, 'Инженер-программист', '3-ая категория'],
                  [3, 'Инженер-программист', 'Стажер'],
                  [4, 'Инженер-программист', 'Ведущий'],
                  [5, 'Инженер-программист', 'Руководитель']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'},
                  {n: 'ТекущаяКатегория', t: 'Текст'}
               ]
            },
            idProperty: 'Ид'
         }
      },
      $constructor: function() {
         this.setAdapter(new Sbis());
      },
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

         var tableAdapter = this._options.adapter.forTable(
             this._options.adapter.forTable(data).getEmpty()
         );
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
               var fieldValue = this._options.adapter.forRecord(item).get(filterField);
               filterMatch = fieldValue && fieldValue.toLowerCase().indexOf(where[filterField].toLowerCase()) !== -1;
               if (!filterMatch) {
                  break;
               }
            }

            if (filterMatch) {
               tableAdapter.add(item);
            }
         }, this);

         return tableAdapter.getData();
      }
   });


   return DemoSuggestMemory;
});
