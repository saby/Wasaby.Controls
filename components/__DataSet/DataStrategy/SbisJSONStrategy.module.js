/**
 * Created by as.manuylov on 10.11.14
 */
define('js!SBIS3.CONTROLS.SbisJSONStrategy', [
   'js!SBIS3.CONTROLS.IDataStrategy',
   'js!SBIS3.CONTROLS.DataFactory'
], function (IDataStrategy, Factory) {
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
         Factory = Factory || require('js!SBIS3.CONTROLS.DataFactory');
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
         var index = this._getFieldIndex(data, field),
            meta = data.s[index],
            type = this._getType(meta);
         data.d[index] = Factory.serialize(value, type.name, SbisJSONStrategy, type.meta);

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
            index = this._getFieldIndex(data, field);
         return index === -1 ? undefined : d[index];
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
               } else if(value instanceof Object && value._type) {
                  switch(value._type){
                     case "recordset":
                        filterParam.s.push({
                           n: index,
                           t: SbisJSONStrategy.FIELD_TYPE.DataSet
                        });
                        break;
                     case "record":
                        filterParam.s.push({
                           n: index,
                           t: SbisJSONStrategy.FIELD_TYPE.Record
                        });
                        break;
                     default :
                        throw new Error("Object type "+value._type+" isn't supported.")
                  }
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
       },

       getFullFieldData: function (data, name) {
          var index = this._getFieldIndex(data, name),
             meta = index >= 0 ? data.s[index] : undefined,
             value = index >= 0 ? data.d[index] : undefined,
             data = {meta: undefined, type: undefined};
          if (meta) {
             var type = this._getType(meta);
             data.meta = type.meta;
             data.type = type.name;
          }
          return data;
       },
       
       _getType: function (meta, key) {
          key = key || 't';
          var typeSbis = meta[key],
             type;
          if (typeof typeSbis === 'object') {
             return this._getType(typeSbis, 'n');
          }
          for (var fieldType in SbisJSONStrategy.FIELD_TYPE) {
             if (typeSbis === SbisJSONStrategy.FIELD_TYPE[fieldType]) {
                type = fieldType;
                break;
             }
          }
          var prepareMeta = this._prepareMetaInfo(type, $ws.core.clone(meta));
          return {'name': type, 'meta': prepareMeta};
       },
       
       _prepareMetaInfo: function (type, meta) {
          switch (type) {
             case 'Enum':
                meta.source = meta.s;
                break;
             case 'Money':
                meta.precision = meta.p;
                break;
             case 'Flags':
                meta.makeData = function (value) {
                   var st = [],
                      pairs = Object.sortedPairs(meta.s),
                      fData = [];
                   for (var pI = 0, pL = pairs.keys.length; pI < pL; pI++) {
                      st[pI] = [];
                      st[pI].type = SbisJSONStrategy.FIELD_TYPE.Boolean;
                      st[pI].n = pairs.values[pI];
                      st[pI].index = pairs.keys[pI]
                      fData[pI] = value[pI];
                   }
                   return {
                      d: fData,
                      s: st
                   };
                };
                meta.strategy = new SbisJSONStrategy();
                break;
          }
          return meta;
       },
       _getFieldIndex: function (data, name) {
          if (data && data.s) {
             for (var i = 0, count = data.s.length; i < count; i++) {
                if (data.s[i].n === name) {
                   return i;
                }
             }
          }
          return -1;
       }
   });
   
   SbisJSONStrategy.FIELD_TYPE = {
      DataSet: 'Выборка',
      Record: 'Запись',
      Integer: 'Число целое',
      String: 'Строка',
      Text: 'Текст',
      Double: 'Число вещественное',
      Money: 'Деньги',
      Date: 'Дата',
      DateTime: 'Дата и время',
      Time: 'Время',
      Array: 'Массив',
      Boolean: 'Логическое',
      Hierarchy: 'Иерархия',
      Identity: 'Идентификатор',
      Enum: 'Перечисляемое',
      Flags: 'Флаги',
      Link: 'Связь',
      Binary: 'Двоичное',
      UUID: 'UUID',
      RpcFile: 'Файл-rpc',
      TimeInterval: 'Временной интервал'
   };
   
   /**
    * Сериализует данные
    * @param {*} data
    * @returns {Object}
    * @static
    */
   SbisJSONStrategy.serialize = function (data) {
      var getType = function (val) {
            var type = typeof val;
            switch (type) {
               case 'boolean':
                  return SbisJSONStrategy.FIELD_TYPE.Boolean;
               case 'number':
                  if (val % 1 === 0) {
                     return SbisJSONStrategy.FIELD_TYPE.Integer;
                  }
                  return SbisJSONStrategy.FIELD_TYPE.Double;
               case 'string':
                  return SbisJSONStrategy.FIELD_TYPE.String;
               case 'object':
                  if (val instanceof Date) {
                     return SbisJSONStrategy.FIELD_TYPE.DateTime;
                  }
                  break;
            }
            return type;
         },
         serializeValue = function (value, type) {
            switch (type) {
               case SbisJSONStrategy.FIELD_TYPE.Time:
                  return value.toSQL();
            }
            return value;
         },
         makeS = function (obj) {
            var s = [];
            for (var key in obj) {
               if (!obj.hasOwnProperty(key)) {
                  continue;
               }
               s.push({
                  n: key,
                  t: getType(obj[key])
               });
            }
            return s;
         },
         makeD = function (obj, s) {
            var d = [];
            for (var i = 0, count = s.length; i < count; i++) {
               d.push(serializeValue(obj[s[i].n], s[i].t));
            }
            return d;
         },
         result,
         key;
      if (data instanceof Array) {
         var i,
            count;
         result = {
            s: [],
            d: []
         };
         for (i = 0, count = data.length; i < count; i++) {
            if (i === 0) {
               result.s = makeS(data[i]);
            }
            result.d.push(makeD(data[i], result.s));
         }
         return result;
      }
      else if (typeof data === 'object' && data !== null) {
         var allScalars = true;
         for (key in data) {
            if (!data.hasOwnProperty(key)) {
               continue;
            }
            var val = data[key];
            if (typeof val === 'object' && !(val instanceof Date)) {
               allScalars = false;
               break;
            }
         }
         result = {};
         if (allScalars) {
            result.s = makeS(data);
            result.d = makeD(data, result.s);
         }
         else {
            for (key in data) {
               if (!data.hasOwnProperty(key)) {
                  continue;
               }
               result[key] = SbisJSONStrategy.serialize(data[key]);
            }
         }
         return result;
      }
      else {
         return data;
      }
   };
   /**
    * Серелиализует датасет или рекордсет
    * @param data {SBIS3.CONTROLS.Data.Source.DataSet||$ws.proto.RecordSet}
    * @returns {*}
    */
   SbisJSONStrategy.serializeDataSet = function (data) {
      var DataSet;
      try {
         DataSet = require('js!SBIS3.CONTROLS.DataSet');
      } catch (e) {
      }
      if (DataSet && data instanceof DataSet) {
         return $ws.core.clone(data.getRawData());
      } else if (data instanceof $ws.proto.RecordSet || data instanceof $ws.proto.RecordSetStatic) {
         return data.toJSON();
      } else {
         return SbisJSONStrategy.serialize(data);
      }
   };
   /**
    * Серелиализует модель или рекорд
    * @param data {SBIS3.CONTROLS.Record||$ws.proto.Record}
    * @returns {*}
    */
   SbisJSONStrategy.serializeRecord = function (data) {
      var Record;
      try {
         Record = require('js!SBIS3.CONTROLS.Record');
      } catch (e) {
      }
      if (data instanceof Record) {
         return $ws.core.clone(data.getRaw());
      } else if (data instanceof $ws.proto.Record) {
         return data.toJSON();
      } else {
         return SbisJSONStrategy.serialize(data);
      }
   };
   /**
    * Сериализует поле флагов
    * @param data - {$ws.proto.Record||}
    * @returns {*}
    */
   SbisJSONStrategy.serializeFlags = function (data) {
      var Record;
      try {
         Record = require('js!SBIS3.CONTROLS.Record');
      } catch (e) {
      }
      var dt = [];
      if (data instanceof $ws.proto.Record) {
         var s = {},
            t = data.getColumns();
         for (var x = 0, l = t.length; x < l; x++) {
            s[data.getColumnIdx(t[x])] = t[x];
         }
         var sorted = Object.sortedPairs(s),
            rO = data.toObject();
         for (var y = 0, ly = sorted.keys.length; y < ly; y++) {
            dt.push(rO[sorted.values[y]]);
         }
         return dt;
      } else if (data instanceof Record) {
         data.each(function (value) {
            dt.push(value);
         });
         return dt;
      } else if (data instanceof Array) {
         return data;
      } else {
         return null;
      }
   };

   return SbisJSONStrategy;
});