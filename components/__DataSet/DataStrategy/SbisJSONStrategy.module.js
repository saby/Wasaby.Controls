/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.SbisJSONStrategy', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';
    /**
     *
     * Позволяет работать с массивом объектов на бизнес-логике.
     * @class SBIS3.CONTROLS.SbisJSONStrategy
     * @extends SBIS3.CONTROLS.IDataStrategy
     * @public
     * @author Крайнов Дмитрий Олегович
     */

   var SbisJSONStrategy = IDataStrategy.extend(/** @lends SBIS3.CONTROLS.SbisJSONStrategy.prototype */{
      $protected: {},
      $constructor: function () {
      },
      /**
       * Найти название поля, которое является идентификатором.
       * @param data ответ БЛ
       * @returns {String}
       */
      getKey: function (data) {
         var s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['n'][0] == '@') {
               index = i;
               break;
            }
         }
         if (index === undefined) {
            index = 0;
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
        *
        * @param {Object} data
        * @param {} index
        * @returns {{d: *, s: (*|exports.duration.s|Color.toHSL.s|Color.toHSV.s|s|col.s)}}
        */
      at: function (data, index) {
         var d = data.d,
            s = data.s;
         return {d: d[index], s: s};
      },
       /**
        * Метод перемещения записи.
        * @param {Object} data
        * @param index
        * @param newRaw
        */
      replaceAt: function (data, index, newRaw) {
         if (!data.s.length && newRaw.s.length) {
            data.s = newRaw.s;
         }
         data.d[index] = newRaw.d;
      },
       /**
        *
        * @param {Object} data
        * @param {String} keyField имя поля-идентификатора
        * @returns {Array}
        */
      rebuild: function (data, keyField) {
         var _indexId = [],
            d = data.d,
            length = d.length;
         for (var i = 0; i < length; i++) {
            //FixMe: допущение что ключ на первой позиции + там массив приходит
            if (d[i][0] instanceof  Array)
               _indexId[i] = d[i][0].length > 1 ? d[i][0].join(',') : d[i][0][0];
            else {
               _indexId[i] = d[i][0]
            }
         }
         return _indexId;
      },
       /**
        * Добавляет запись
        * @param {Array} data Массив "сырых" данных
        * @param {SBIS3.CONTROLS.Record} record Добавляемая запись
        * @param {Integer} [at] Позиция вставки (по умолчанию в конец)
        */
      addRecord: function (data, record, at) {
         var rawData = record.getRaw();
         var d = data['d'];

         if (!data.s.length && rawData.s.length) {
            data.s = rawData.s;
         }

         if (at !== undefined && at >= 0) {
            d.splice(at, 0, rawData['d']);
         } else {
            d.push(rawData['d']);
         }
      },
       /**
        *
        * @param {Object} data
        * @returns {exports.length|*|Function|length|.__defineGetter__.length|Number}
        */
      getCount: function (data) {
         return data['d'].length;
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
         return index === undefined ? undefined : d[index];
      },
      /**
       * Получить тип поля
       * @param {Object} data "сырые" данные записи
       * @param {String} field название поля для получения значения
       * @returns {*}
       */
      type: function (data, field) {
         var s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['n'] == field) {
               index = i;
               break;
            }
         }
         return s[index].t;
      },
        /**
         *
         * @param {Object} data
         * @returns {{more: *}}
         */
      getMetaData: function (data) {
         return {
            results: data.r,
            more: data.n,
            path: data.p
         };
      },
       /**
        *
        * @param record
        * @param rawKey
        * @returns {{d: Array, s: Array}}
        */
      getParentKey: function (record, rawKey) {
         // так как c БЛ приходит массив
         var key = record.get(rawKey);
         return key instanceof Array ? (key.length > 1 ? key.join(',') : key[0]) : key;
      },

      prepareFilterParam: function (filter) {
         // настройка объекта фильтрации для отправки на БЛ
         var filterParam = {
            d: [],
            s: []
         };

         if (!Object.isEmpty(filter)) {
            $ws.helpers.forEach(filter, function (value, index) {
               if (typeof value == 'boolean') {
                  filterParam.s.push({
                     n: index,
                     t: 'Логическое'
                  });
               } else if (value instanceof Array) {
                  filterParam.s.push({
                     n: index,
                     t: {n: 'Массив', t: 'Строка'}
                  });
               } else {
                  filterParam.s.push({
                     n: index,
                     t: 'Строка'
                  });
               }
               filterParam.d.push(value);
            });
         }

         return filterParam;
      },


      //TODO нужны ли эти методы в стратегии
       /**
        *
        * @param sorting
        * @returns {*}
        */
      prepareSortingParam: function (sorting) {
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
       /**
        *
        * @param offset
        * @param limit
        * @returns {*}
        */
      preparePagingParam: function (offset, limit) {
         var pagingParam = null;
         if (typeof(offset) != 'undefined' && offset != null && typeof(limit) != 'undefined' && limit != null) {
            var numPage = Math.floor(offset / limit);
            pagingParam = {
               'd': [
                  numPage,
                  limit,
                  offset >= 0 //Если offset отрицательный, то грузится последняя страница
               ],
               's': [
                  {'n': 'Страница', 't': 'Число целое'},
                  {'n': 'РазмерСтраницы', 't': 'Число целое'},
                  {'n': 'ЕстьЕще', 't': 'Логическое'}
               ]
            };
         }
         return pagingParam;
      },

       /**
        *
        * @param record
        * @returns {{s: (*|exports.duration.s|Color.toHSL.s|Color.toHSV.s|s|col.s), d: (*|multi.d|SBIS3.CONTROLS.FormattedTextBoxBase.$protected._controlCharactersSet.d|d.d|d), _type: string}}
        */
      prepareRecordForUpdate: function (record) {
         // поддержим формат запросов к БЛ
         var rawData = record.getRaw();
         return {
            s: rawData.s,
            d: rawData.d,
            //FixME: можно ли раскомментить
            /*_key: 2,*/
            _type: 'record'
         };
      },

      getEmptyRawData: function () {
         return {d: [], s: []};
      },

       preprareOrderParams: function(object, record, hierField, orderDetails){
          var params = {
             'Объект': object,
             'ИдО': record.getKey(),
             'ПорядковыйНомер': orderDetails.column || 'ПорНомер',
             'Иерархия': hierField
          };
          if(orderDetails.after){
             params['ИдОПосле'] = orderDetails.after;
          } else {
             params['ИдОДо'] = orderDetails.before;
          }
          return params;
       },
       setParentKey: function(record, hierField, parent) {
          record.set(hierField, [parent]);
       }

   });

   return SbisJSONStrategy;
});