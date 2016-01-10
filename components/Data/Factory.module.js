/*global $ws, define*/
define('js!SBIS3.CONTROLS.Data.Factory', [
   'js!SBIS3.CONTROLS.Data.Types.Flags',
   'js!SBIS3.CONTROLS.Data.Types.Enum'
], function (Flags, Enum) {
   'use strict';

   /**
    * Фабрика типов - на основе сырых данных создает объекты переданного типа
    * @class SBIS3.CONTROLS.Data.Factory
    * @public
    * @author Ярослав Ганшин
    */

   /**
    * @faq Почему я вижу ошибки от $ws.single.ioc?
    * Для корректной работы с зависимости сначала надо загрузить {@link SBIS3.CONTROLS.Data.Model} и {@link SBIS3.CONTROLS.Data.Source.RecordSet}, а уже потом {@link SBIS3.CONTROLS.Data.Factory}
    */

   var Factory = /** @lends SBIS3.CONTROLS.Data.Factory.prototype */{
      /**
       * Приводит сырые данные к переданному типу.
       * Возможные типы:
       * RecordSet - набор записей
       * Model - одна запись из выборки
       * Time  - время
       * Date - дата
       * DateTime - дата и время
       * Link - связь
       * Integer - число целое
       * Double - число вещественное
       * Money - деьги
       * Enum  - перечисляемое
       * Flags - поле флагов
       * Identity - иденификатор
       * TimeInterval - временной интервал
       * Text - текст
       * String - строка
       * Boolean - логическое
       * Если передать тип не из списка, то значение не изменится.
       * @param {*} value Значение
       * @param {String} type Тип значения
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @param {Object} meta Мета данные типа
       * @returns {*} Приведенные к нужному типу сырые данные
       */
      cast: function (value, type, adapter, meta) {
         switch (type) {
            case 'Identity':
               return meta.isArray ?
                  value[0] === null ? null : value.join(meta.separator, value) :
                  value;
            case 'RecordSet':
               return this._makeRecordSet(value, adapter);
            case 'Model':
               return this._makeModel(value, adapter);
            case 'Time':
            case 'Date':
            case 'DateTime':
               return value === undefined || value === null ? value : Date.fromSQL('' + value);
            case 'Link':
            case 'Integer':
               return (typeof(value) === 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));
            case 'Double':
               return (typeof(value) === 'number') ? value : (isNaN(parseFloat(value)) ? null : parseFloat(value));
            case 'Money':
               if (meta && meta.precision > 3) {
                  return $ws.helpers.bigNum(value).toString(meta.precision);
               }
               return value === undefined ? null : value;
            case 'Enum':
               return new Enum({
                  data: meta.source, //массив строк
                  currentValue: value //число
               });
            case 'Flags':
               return this._makeFlags(value, meta);
            case 'TimeInterval':
               if (value instanceof $ws.proto.TimeInterval) {
                  return value.toString();
               }
               return $ws.proto.TimeInterval.toString(value);
            case 'Text':
            case 'String':
               return value;
            case 'Boolean':
               if (value === null) {
                  return value;
               }
               return !!value;
            case 'Array':
               if (value === null) {
                  return value;
               }
               var self = this;
               return $ws.helpers.map(value, function (val) {
                  return self.cast(val, meta.elementsType, adapter, meta);
               });
            default:
               return value;
         }
      },

      /**
       * Переводит типизированное значение в сырые данные
       * @param {*} value Типизированное значение
       * @param {String} type Тип значения
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @param {Object} meta Мета данные типа
       * @returns {*}
       */
      serialize: function (value, type, adapter, meta) {
         switch (type) {
            case 'Identity':
               return meta.isArray ?
                  value === null ?
                     [null] :
                     typeof value === 'string' ?
                        value.split(meta.separator) :
                        [value]:
                  value;

            case 'RecordSet':
               return this._serializeRecordSet(value, adapter);
            case 'Model':
               return this._serializeModel(value, adapter);

            case 'Date':
            case 'DateTime':
            case 'Time':
               var serializeMode;
               switch (type) {
                  case 'DateTime':
                     serializeMode = true;
                     break;
                  case 'Time':
                     serializeMode = false;
                     break;
               }
               return value instanceof Date ? value.toSQL(serializeMode) : value;

            case 'Flags':
               return this._serializeFlags(value);

            case 'Integer':
               return (typeof(value) === 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));

            case 'String':
               return value === null ? null : value + '';

            case 'Link':
               return value === null ? null : parseInt(value, 10);

            case 'Money':
               if (meta && meta.precision > 3) {
                  return $ws.helpers.bigNum(value).toString(meta.precision);
               }
               return value;

            case 'TimeInterval':
               if (value instanceof $ws.proto.TimeInterval) {
                  return value.toString();
               }
               return $ws.proto.TimeInterval.toString(value);

            case 'Enum':
               if (value instanceof Enum) {
                  return value.get();
               } else if (value instanceof $ws.proto.Enum) {
                  return value.getCurrentValue();
               }
               return value;
            case 'Array':
               var self = this;
               return $ws.helpers.map(value, function (val){
                  return self.serialize(val, meta.elementsType, adapter, meta);
               });
            default:
               return value;
         }
      },

      /**
       * Создает модель по сырым данным
       * @param {*} data Сырые данные
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @private
       */
      _makeModel: function (data, adapter) {
         return $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Model', {
            rawData: data,
            adapter: adapter
         });
      },

      /**
       * Создает RecordSet по сырым данным
       * @param {*} data Сырые данные
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       * @private
       */
      _makeRecordSet: function (data, adapter) {
         adapter.setProperty(
            data,
            'total',
            adapter.forTable(data).getCount()
         );

         return $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Collection.RecordSet', {
            model: $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.ModelConstructor'),
            adapter: adapter,
            rawData: data,
            totalProperty: 'total'
         });
      },

      /**
       * Создает поле флагов по сырым данным
       * @param {Array} value Массив флагов
       * @param {Object} meta Мета данные флагов
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @private
       */
      _makeFlags: function (value, meta) {
         return new Flags ({
            data: meta.makeData(value)
         });
      },

      /**
       * Сериализует RecordSet
       * @param {*} data Данные
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*}
       * @private
       */
      _serializeRecordSet: function (data, adapter) {
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet') || $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Source.DataSet') || $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.DataSet') ) {
            return data.getRawData();
         } else if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.List')) {
            return this._serializeList(data, adapter);
         } else if (data instanceof $ws.proto.RecordSet || data instanceof $ws.proto.RecordSetStatic) {
            return data.toJSON();
         } else {
            if (adapter && adapter.serialize) {
               return adapter.serialize(data);
            }
         }
         throw new Error('Adapter is not defined or doesn\'t have method serialize()');
      },

      /**
       * Сериализует List
       * @param {SBIS3.CONTROLS.Data.Collection.List} data Список
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*}
       * @private
       */
      _serializeList: function (data, adapter) {
         var items = data.toArray(),
            otherData = [],
            getTableAdapter = function(item) {
               if (tableAdapter === undefined) {
                  tableAdapter = adapter.forTable(
                     adapter.forTable(item ? item.getRawData() : undefined).getEmpty()
                  );
               }
               return tableAdapter;
            },
            tableAdapter,
            item,
            i,
            length;

         for (i = 0, length = items.length; i < length; i++) {
            item = items[i];
            if (typeof items === 'object' && $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')) {
               getTableAdapter(item).add(item.getRawData());
            } else {
               otherData.push(item);
            }
         }

         if (otherData.length) {
            adapter.setProperty(getTableAdapter().getData(), 'other', otherData);
         }

         return getTableAdapter().getData();
      },

      /**
       * Сериализует модель
       * @param {*} data Модель
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*}
       * @private
       */
      _serializeModel: function (data, adapter) {
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Model')) {
            return data.getRawData();
         } else if (data instanceof $ws.proto.Record) {
            return data.toJSON();
         } else {
            if (adapter && adapter.serialize) {
               return adapter.serialize(data);
            }
         }
         throw new Error('Adapter is not defined or doesn\'t have method serialize()');
      },

      /**
       * Сериализует поле флагов
       * @param {*} data
       * @returns {*}
       * @private
       */
      _serializeFlags: function (data) {
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Flags') || $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Model')) {
            var d = [];
            data.each(function (name) {
               d.push(data.get(name));
            });
            return d;
         }  else if (data instanceof $ws.proto.Record) {
            var dt = [],
               s = {},
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
         } else if ($ws.helpers.type(data) === 'array') {
            return data;
         } else {
            return null;
         }
      }
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Factory', function () {
      return Factory;
   });

   return Factory;
});