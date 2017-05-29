/*global define*/
define('js!WS.Data/Factory', [
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-instance',
   'Core/TimeInterval',
   'Core/helpers/collection-helpers',
   'Core/helpers/string-helpers'
], function (
   Di,
   Utils,
   CoreInstance,
   CoreTimeInterval,
   CollectionHelpers,
   StringHelpers
) {
   'use strict';

   /**
    * Фабрика типов - перобразует исходные значения в типизированные и наоборот.
    * @class WS.Data/Factory
    * @public
    * @author Мальцев Алексей
    */

   /**
    * @faq Почему я вижу ошибки от WS.Data/Di::resolve?
    * Для корректной работы с зависимости сначала надо загрузить {@link WS.Data/Entity/Model} и {@link WS.Data/Source/RecordSet}, а уже потом {@link WS.Data/Factory}
    */

   var Factory = {
      /**
       * @typedef {String} SimpleType
       * @variant integer Целое число
       * @variant real Действительное число
       * @variant double Действительное число с размером больше real
       * @variant boolean Логический
       * @variant money Деньги
       * @variant link Ссылка
       * @variant date Дата
       * @variant time Время
       * @variant datetime Дата-время
       * @variant timeinterval Временной интервал
       * @variant array Массив со значениями определенного типа
       */

      /**
       * Возвращает типизированное значение из исходного.
       * @param {*} value Исходное значение
       * @param {Function|SimpleType} Type Тип значения
       * @param {Object} [options] Опции
       * @return {*} Типизированное значение
       * @static
       */
      cast: function (value, Type, options) {
         options = options || {};
         if (this._isNullable(Type, value, options)) {
            return value;
         }

         if (typeof Type === 'string') {
            switch (Type.toLowerCase()) {
               case 'recordset':
                  Type = Di.resolve('collection.$recordset');
                  break;
               case 'record':
                  Type = Di.resolve('entity.$model');
                  break;
               case 'enum':
                  Type = Di.resolve('types.$enum');
                  break;
               case 'flags':
                  Type = Di.resolve('types.$flags');
                  break;
               case 'link':
               case 'integer':
                  return (typeof(value) === 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));
               case 'real':
               case 'double':
                  return (typeof(value) === 'number') ? value : (isNaN(parseFloat(value)) ? null : parseFloat(value));
               case 'boolean':
                  return !!value;
               case 'money':
                  var precision = this._getPrecision(options.format);
                  if (precision > 3) {
                     return StringHelpers.prepareMoneyByPrecision(value, precision);
                  }
                  return value === undefined ? null : value;
               case 'date':
               case 'time':
               case 'datetime':
                  return value instanceof Date ? value : Date.fromSQL('' + value);
               case 'timeinterval':
                  if (value instanceof CoreTimeInterval) {
                     return value.toString();
                  }
                  return CoreTimeInterval.toString(value);
               case 'array':
                  var kind = this._getKind(options.format);
                  if (!(value instanceof Array)) {
                     value = [value];
                  }
                  return CollectionHelpers.map(value, function (val) {
                     return this.cast(val, kind, options);
                  }, this);
               default:
                  return value;
            }
         }

         if (typeof Type === 'function') {
            if (value instanceof Type) {
               return value;
            }
            if (Type.prototype._wsDataEntityIProducible) {//it's equal to CoreInstance.instanceOfMixin(Type.prototype, 'WS.Data/Entity/IProducible')
               return Type.prototype.produceInstance.call(
                  Type.prototype,
                  value,
                  options
               );
            }
            return new Type(value);
         }

         throw new TypeError('Unknown type ' + Type);
      },

      /**
       * Возвращет исходное значение из типизированного.
       * @param {*} value Типизированное значение
       * @param {Object} [options] Опции
       * @return {*} Исходное значение
       * @static
       */
      serialize: function (value, options) {
         options = options || {};
         var type = this._getTypeName(options.format);

         if (this._isNullable(type, value, options)) {
            return value;
         }

         if (value && typeof value === 'object') {
            if (value && value._wsDataEntityFormattableMixin) {//it's equal to CoreInstance.instanceOfMixin(value, 'WS.Data/Entity/FormattableMixin')
               return value.getRawData(true);
            }  else if (CoreInstance.instanceOfModule(value, 'WS.Data/Types/Flags')) {
               return this._serializeFlags(value);
            } else if (CoreInstance.instanceOfModule(value, 'WS.Data/Types/Enum')) {
               return value.get();
            } else if (value && value._wsDataCollectionIList) {
               return this._convertListToRecordSet(value);
            }
         }

         switch (type) {
            case 'integer':
               return typeof(value) === 'number' ?
                  value :
                  (isNaN(value = value - 0) ? null : parseInt(value, 10));
            case 'link':
               return parseInt(value, 10);
            case 'money':
               var precision = this._getPrecision(options.format);
               if (precision > 3) {
                  return StringHelpers.prepareMoneyByPrecision(value, precision);
               }
               return value;
            case 'date':
            case 'time':
            case 'datetime':
               var serializeMode;
               switch (type) {
                  case 'datetime':
                     serializeMode = Date.SQL_SERIALIZE_MODE_DATETIME;
                     break;
                  case 'time':
                     serializeMode = Date.SQL_SERIALIZE_MODE_TIME;
                     break;
               }
               if (!value) {
                  value = Date.fromSQL('' + value);
               }
               return value instanceof Date ? value.toSQL(serializeMode) : value;
            case 'timeinterval':
               if (value instanceof CoreTimeInterval) {
                  return value.toString();
               }
               return CoreTimeInterval.toString(value);
            case 'array':
               var kind = this._getKind(options.format);
               if (!(value instanceof Array)) {
                  value = [value];
               }
               return CollectionHelpers.map(value, function (val) {
                  return this.serialize(val, {format: kind});
               }, this);
            default:
               return value;
         }
      },

      /**
       * Возвращает название типа поля
       * @param {WS.Data/Format/Field|WS.Data/Format/UniversalField|String} format Формат поля
       * @return {String}
       * @protected
       * @static
       */
      _getTypeName: function (format) {
         var type;
         if (typeof format === 'object') {
            type = format.getType ? format.getType() : format.type;
         } else {
            type = format;
         }
         return ('' + type).toLowerCase();
      },

      /**
       * Возвращает точность для поля типа "Вещественное число"
       * @param {WS.Data/Format/Field|WS.Data/Format/UniversalField|String} format Формат поля
       * @return {Number}
       * @protected
       * @static
       */
      _getPrecision: function (format) {
         if (!format) {
            return 0;
         }
         return (format.getPrecision ? format.getPrecision() : format.meta && format.meta.precision) || 0;
      },

      /**
       * Возвращает словарь для поля типа "Словарь"
       * @param {WS.Data/Format/Field|WS.Data/Format/UniversalField|String} format Формат поля
       * @return {Array}
       * @protected
       */
      _getDictionary: function (format) {
         return (format.getDictionary ? format.getDictionary() : format.meta && format.meta.dictionary) || [];
      },

      /**
       * Возвращает тип элементов для поля типа "Массив"
       * @param {WS.Data/Format/Field|WS.Data/Format/UniversalField|String} format Формат поля
       * @return {String}
       * @protected
       * @static
       */
      _getKind: function (format) {
         return (format.getKind ? format.getKind() : format.meta && format.meta.kind) || '';
      },

      /**
       * Сериализует поле флагов
       * @param {WS.Data/Types/Flags} data
       * @return {Array.<Boolean>}
       * @protected
       * @static
       */
      _serializeFlags: function (data) {
         var d = [];
         data.each(function (name) {
            d.push(data.get(name));
         });
         return d;
      },

      /**
       * Возвращает признак, что значение типа может быть null
       * @param {String} type Тип значения.
       * @param {*} value Значение.
       * @param {Object} [options] Опции.
       * @return {Boolean}
       * @protected
       * @static
       */
      _isNullable: function (type, value, options) {
         if (value === undefined || value === null) {
            switch (type) {
               case 'identity':
                  return false;
               case 'enum':
                  return this._isEnumNullable(value, options);
            }

            if (typeof type === 'function') {
               var inst = Object.create(type.prototype);
               if (CoreInstance.instanceOfModule(inst, 'WS.Data/Types/Enum')) {
                  return this._isEnumNullable(value, options);
               }
            }

            return true;
         }
         return false;
      },

      /**
       * Возвращает признак, что значение типа Enum может быть null
       * @param {*} value Значение.
       * @param {Object} options Опции.
       * @return {Boolean}
       * @protected
       * @static
       */
      _isEnumNullable: function (value, options) {
         var dict = this._getDictionary(options.format);
         if (value === null && !dict.hasOwnProperty(value)) {
            return true;
         }
         if (value === undefined) {
            return true;
         }
         return false;
      },
      /**
       * Конвертирует список записей в рекордсет
       * @param {WS.Data/Collection/List} list Список
       * @return {WS.Data/Collection/RecordSet}
       * @protected
       */
      _convertListToRecordSet: function(list) {
         var adapter = 'adapter.json',
             record,
             count = list.getCount(),
             i;

         for (i = 0; i < count; i++) {
            record = list.at(i);
            if (record && CoreInstance.instanceOfModule(record, 'WS.Data/Entity/Record')) {
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

         return rs.getRawData(true);
      }
   };

   Di.register('factory', Factory, {instantiate: false});

   return Factory;
});
