/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyBL', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';
   return IDataStrategy.extend({
      $protected: {
      },
      $constructor: function () {
      },
      /**
       * Найти название поля, которое является идентификатором
       * @param data ответ БЛ
       * @returns {String}
       */
      getKey: function (data) {
         var s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['t'] == 'Идентификатор') {
               index = i;
               break;
            }
         }
         return s[index]['n'];
      },

      /**
       * Метод для обхода по сырым данным
       * @param {Object} data ответ БЛ, по которому производится обход
       * @param {function} iterateCallback пользовательская функция обратного вызова
       * @param context контекст
       */
      each: function (data, iterateCallback, context) {
         var d = data.d,
            s = data.s,
            length = d.length;
         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, {s: s, d: d[i]});
         }
      },

      /**
       * Получить сырые данные для записи по ключевому полю
       * @param {Object} data массив "сырых" данных
       * @param {String} keyField название поля-идентификатора
       * @param {Number} key искомый идентификатор
       * @returns {Object} соответствующие "сырые" данные для записи
       */
      getByKey: function (data, keyField, key) {
         var d = data.d,
            s = data.s,
            item,
            length = d.length;
         for (var i = 0; i < length; i++) {
            if (d[i][0][0] == parseInt(key, 10)) {
               item = d[i];
            }
         }
         return {d: item, s: s};
      },

      /**
       * Установить значение поля записи
       * @param {Object} data массив "сырых" данных
       * @param {String} field название поля, в которой производится запись значения
       * @param {Object} value новое значение
       * @returns {Object} новый объект "сырых" данных
       */
      setValue: function (data, field, value) {
         var d = data.d,
            s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['n'] == field) {
               index = i;
               break;
            }
         }
         d[index] = value;
         return data;
      },

      /**
       * Получить значение поля записи
       * @param {Object} data "сырые" данные записи
       * @param {String} field название поля для получения значения
       * @returns {*}
       */
      value: function (data, field) {
         var d = data.d,
            s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['n'] == field) {
               index = i;
               break;
            }
         }
         return d[index];
      },

      prepareFilterParam:function(filter){
         console.log(filter)
         // настройка объекта фильтрации для отправки на БЛ
         var filterParam = {
            d: [],
            s: []
         };

         if (filter.length) {
            $ws.helpers.forEach(filter, function (value) {
               if (!Object.isEmpty(value)) {
                  for (var j in value) {
                     if (value.hasOwnProperty(j)) {
                        if (typeof value[j] == 'boolean') {
                           filterParam.s.push({
                              n: j,
                              t: 'Логическое'
                           });
                        }
                        else {
                           filterParam.s.push({
                              n: j,
                              t: 'Строка'
                           });
                        }
                        filterParam.d.push(value[j]);
                     }
                  }
               }
            });
         }

         return filterParam;
      },

      prepareSortingParam:function(sorting){
         // настройка сортировки
         var sortingParam = null;
         if (sorting) {
            var sort = [];
            $ws.helpers.forEach(sorting, function (value) {
               var fl;
               if (!Object.isEmpty(value)) {
                  for (var i in value) {
                     if (value.hasOwnProperty(i)) {
                        fl = (value[i] == 'ASC');
                        sort.push([i, fl, !fl]);
                     }
                  }
               }
            });
            sortingParam = {
               s: [
                  {'n': 'n', 't': 'Строка'},
                  {'n': 'o', 't': 'Логическое'},
                  {'n': 'l', 't': 'Логическое'}
               ],
               d: sort
            };
         }
         return sortingParam;
      },

      prepareRecordForUpdate:function(record){
         // поддержим формат запросов к БЛ
         var  rawData = record.getRaw();
         return {
            s: rawData.s,
            d: rawData.d,
            //FixME: можно ли раскомментить
            /*_key: 2,*/
            _type: 'record'
         };
      }

   });
});