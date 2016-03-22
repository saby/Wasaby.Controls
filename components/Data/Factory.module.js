/*global $ws, define*/
define('js!SBIS3.CONTROLS.Data.Factory', [
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Types.Flags',
   'js!SBIS3.CONTROLS.Data.Types.Enum'
], function (Di, Flags, Enum) {
   'use strict';

   /**
    * Фабрика типов - на основе сырых данных создает объекты переданного типа
    * @class SBIS3.CONTROLS.Data.Factory
    * @public
    * @author Ярослав Ганшин
    */

   /**
    * @faq Почему я вижу ошибки от SBIS3.CONTROLS.Data.Di::resolve?
    * Для корректной работы с зависимости сначала надо загрузить {@link SBIS3.CONTROLS.Data.Model} и {@link SBIS3.CONTROLS.Data.Source.RecordSet}, а уже потом {@link SBIS3.CONTROLS.Data.Factory}
    */

   var Factory = /** @lends SBIS3.CONTROLS.Data.Factory.prototype */{
      /**
       * Переводит сырые данные в указанный формат
       * @param {*} value Значение в формате сырых данных
       * @param {SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*} Приведенные к нужному формату сырые данные
       */
      cast: function (value, format, adapter) {
         if (value === undefined || value === null) {
            return value;
         }

         switch (this._getType(format)) {
            case 'Identity':
               return value instanceof Array ?
                  value[0] === null ? null : value.join(format.meta && format.meta.separator, value) :
                  value;
            case 'RecordSet':
               return this._makeRecordSet(value, adapter);
            case 'Record':
               return Di.resolve('model', {
                  rawData: value,
                  adapter: adapter
               });
            case 'Time':
            case 'Date':
            case 'DateTime':
               return Date.fromSQL('' + value);
            case 'Link':
            case 'Integer':
               return (typeof(value) === 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));
            case 'Real':
            case 'Double':
               return (typeof(value) === 'number') ? value : (isNaN(parseFloat(value)) ? null : parseFloat(value));
            case 'Money':
               if (format.meta && format.meta.precision > 3) {
                  return $ws.helpers.prepareMoneyByPrecision(value, format.meta.precision);
               }
               return value === undefined ? null : value;
            case 'Enum':
               return new Enum({
                  dictionary: format.meta && format.meta.dictionary || [],
                  currentValue: value
               });
            case 'Flags':
               return new Flags({
                  dictionary: format.meta && format.meta.dictionary || [],
                  values: value
               });
            case 'TimeInterval':
               if (value instanceof $ws.proto.TimeInterval) {
                  return value.toString();
               }
               return $ws.proto.TimeInterval.toString(value);
            case 'Boolean':
               return !!value;
            case 'Array':
               var self = this,
                  kind = format.meta && format.meta.kind;
               return $ws.helpers.map(value, function (val) {
                  return self.cast(val, kind, adapter);
               });
            default:
               return value;
         }
      },

      /**
       * Переводит обертку над сырыми данными в сырые данные
       * @param {*} value Обертка над сырыми данными
       * @param {SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат данных
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*}
       */
      serialize: function (value, format, adapter) {
         var type = this._getType(format);
         switch (type) {
            case 'Identity':
               if (value === null) {
                  return [value];
               }
               break;
         }

         if (value === undefined || value === null) {
            return value;
         }

         switch (type) {
            case 'Identity':
               return (
                  typeof value === 'string' ?
                     value.split(format.meta && format.meta.separator) :
                     [value]
               );
            case 'RecordSet':
               return this._serializeRecordSet(value);
            case 'Record':
               return this._serializeRecord(value);
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
            case 'Link':
               return parseInt(value, 10);
            case 'Money':
               if (format.meta && format.meta.precision > 3) {
                  return $ws.helpers.prepareMoneyByPrecision(value, format.meta.precision);
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
               var self = this,
                  kind = format.meta && format.meta.kind;
               return $ws.helpers.map(value, function (val){
                  return self.serialize(val, kind, adapter);
               });
            default:
               return value;
         }
      },

      /**
       * Возвращает тип поля
       * @param {SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @returns {String}
       * @protected
       */
      _getType: function (format) {
         if (typeof format === 'object') {
            return format.type;
         } else {
            return format;
         }
      },

      /**
       * Создает RecordSet по сырым данным
       * @param {*} data Сырые данные
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       * @protected
       */
      _makeRecordSet: function (data, adapter) {
         adapter.setProperty(
            data,
            'total',
            adapter.forTable(data).getCount()
         );

         return Di.resolve('collection.recordset', {
            rawData: data,
            adapter: adapter,
            totalProperty: 'total'
         });
      },

      /**
       * Сериализует RecordSet
       * @param {*} data Данные
       * @returns {*}
       * @protected
       */
      _serializeRecordSet: function (data) {
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet') ||
            $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Source.DataSet')
         ) {
            return data.getRawData();
         } else if (data instanceof $ws.proto.RecordSet ||
            data instanceof $ws.proto.RecordSetStatic
         ) {
            return data.toJSON();
         }
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.List')) {
            $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.Factory::_serializeRecordSet()', 'Serialization of SBIS3.CONTROLS.Data.Collection.List is no more available. Use SBIS3.CONTROLS.Data.Collection.RecordSet instead.');
         }

         throw new TypeError('SBIS3.CONTROLS.Data.Factory::_serializeRecordSet(): data should be an instance of SBIS3.CONTROLS.Data.Collection.RecordSet or SBIS3.CONTROLS.Data.Source.DataSet');
      },

      /**
       * Сериализует запись
       * @param {*} data Запись
       * @returns {*}
       * @protected
       */
      _serializeRecord: function (data) {
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Record')) {
            return data.getRawData();
         } else if (data instanceof $ws.proto.Record) {
            return data.toJSON();
         }
         if (data instanceof Object) {
            $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.Factory::_serializeRecord()', 'Serialization of plain Object is no more available. Use SBIS3.CONTROLS.Data.Record instead.');
         }
         throw new TypeError('SBIS3.CONTROLS.Data.Factory::_serializeRecord(): data should be an instance of SBIS3.CONTROLS.Data.Record');
      },

      /**
       * Сериализует поле флагов
       * @param {*} data
       * @returns {*}
       * @protected
       */
      _serializeFlags: function (data) {
         if (
            $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Types.Flags') ||
            $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Model')
         ) {
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

   Di.register('factory', Factory, {instantiate: false});

   return Factory;
});