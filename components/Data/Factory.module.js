/*global $ws, define*/
define('js!SBIS3.CONTROLS.Data.Factory', [
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Types.Flags',
   'js!SBIS3.CONTROLS.Data.Types.Enum',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Di, Flags, Enum, Utils) {
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
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
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
                  value[0] === null ? null : value.join(this._getSeparator(format), value) :
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
               var precision = this._getPrecision(format);
               if (precision > 3) {
                  return $ws.helpers.prepareMoneyByPrecision(value, precision);
               }
               return value === undefined ? null : value;
            case 'Enum':
               return new Enum({
                  dictionary:  this._getDictionary(format),
                  currentValue: value
               });
            case 'Flags':
               return new Flags({
                  dictionary: this._getDictionary(format),
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
               var kind = this._getKind(format);
               return $ws.helpers.map(value, function (val) {
                  return this.cast(val, kind, adapter);
               }, this);
            default:
               return value;
         }
      },

      /**
       * Переводит обертку над сырыми данными в сырые данные
       * @param {*} value Обертка над сырыми данными
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат данных
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
                     value.split(this._getSeparator(format)) :
                     [value]
               );
            case 'RecordSet':
               return this._serializeRecordSet(value, adapter);
            case 'Record':
               return this._serializeRecord(value, adapter);
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
               var precision = this._getPrecision(format);
               if (precision > 3) {
                  return $ws.helpers.prepareMoneyByPrecision(value, precision);
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
               var kind = this._getKind(format);
               return $ws.helpers.map(value, function (val) {
                  return this.serialize(val, kind, adapter);
               }, this);
            default:
               return value;
         }
      },

      /**
       * Возвращает тип поля
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @returns {String}
       * @protected
       */
      _getType: function (format) {
         if (typeof format === 'object') {
            return format.getType ? format.getType() : format.type;
         } else {
            return format;
         }
      },

      /**
       * Возвращает разделитель для поля типа "Идентификатор"
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @returns {String}
       * @protected
       */
      _getSeparator: function (format) {
         return (format.getSeparator ? format.getSeparator() : format.meta && format.meta.separator) || '';
      },

      /**
       * Возвращает точность для поля типа "Вещественное число"
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @returns {Number}
       * @protected
       */
      _getPrecision: function (format) {
         return (format.getPrecision ? format.getPrecision() : format.meta && format.meta.precision) || 0;
      },

      /**
       * Возвращает словарь для поля типа "Словарь"
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @returns {Array}
       * @protected
       */
      _getDictionary: function (format) {
         return (format.getDictionary ? format.getDictionary() : format.meta && format.meta.dictionary) || [];
      },

      /**
       * Возвращает тип элементов для поля типа "Массив"
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField|String} format Формат поля
       * @returns {String}
       * @protected
       */
      _getKind: function (format) {
         return (format.getKind ? format.getKind() : format.meta && format.meta.kind) || '';
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
       * Конвертирует список записей в рекордсет
       * @param {SBIS3.CONTROLS.Data.Collection.List} list Список
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       * @protected
       */
      _convertListToRecordSet: function(list) {
         var adapter = 'adapter.json',
            record,
            count = list.getCount(),
            i;

         for (i = 0; i < count; i++) {
            record = list.at(i);
            if (record && $ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Record')) {
               adapter = record.getAdapter();
               break;
            }
         }

         var rs = Di.resolve('collection.recordset', {
            adapter: adapter
         });
         for (i = 0; i < count; i++) {
            rs.add(list.at(i));
         }

         return rs;
      },

      /**
       * Сериализует RecordSet
       * @param {*} data Данные
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*}
       * @protected
       */
      _serializeRecordSet: function (data, adapter) {
         if (!data) {
            return;
         }
         var itHaveRawData = $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet') ||
            $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Source.DataSet');

         if (!itHaveRawData && $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.List')) {
            data = this._convertListToRecordSet(data);
            itHaveRawData = true;
         }

         if (itHaveRawData) {
            this._checkAdapters(data.getAdapter(), adapter);
            return data.getRawData();
         } else if (data instanceof $ws.proto.RecordSet ||
            data instanceof $ws.proto.RecordSetStatic
         ) {
            return data.toJSON();
         }

         throw new TypeError('SBIS3.CONTROLS.Data.Factory::_serializeRecordSet(): data should be an instance of SBIS3.CONTROLS.Data.Collection.RecordSet or SBIS3.CONTROLS.Data.Source.DataSet');
      },

      /**
       * Сериализует запись
       * @param {*} data Запись
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter Адаптер для работы с сырыми данными
       * @returns {*}
       * @protected
       */
      _serializeRecord: function (data, adapter) {
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Record')) {
            this._checkAdapters(data.getAdapter(), adapter);
            return data.getRawData();
         } else if (data instanceof $ws.proto.Record) {
            return data.toJSON();
         }
         if (data instanceof Object) {
            Utils.logger.info('SBIS3.CONTROLS.Data.Factory::_serializeRecord(): serialization of plain Object is no more available. Use SBIS3.CONTROLS.Data.Record instead.');
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
      },

      /**
       * Проверяет совместимость адаптеров
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} source Адаптер источника
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} target Адаптер приемника
       * @protected
       */
      _checkAdapters: function (source, target) {
         var targetProto = Object.getPrototypeOf(target);
         if (!targetProto.isPrototypeOf(source)) {
            throw new TypeError('The source adapter "' + source._moduleName + '" is incompatible with the target adapter "' + target._moduleName + '"');
         }
      }
   };

   Di.register('factory', Factory, {instantiate: false});

   return Factory;
});