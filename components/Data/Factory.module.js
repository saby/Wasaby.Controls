/*global $ws, define*/
define('js!SBIS3.CONTROLS.Data.Factory', [
   'js!SBIS3.CONTROLS.Data.Source.Memory',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Model'
], function () {
   'use strict';

   /**
    * Фабрика типов - на основе сырых данных модели, создает объекты
    * переданного типа
    * @class SBIS3.CONTROLS.Data.Factory
    * @public
    * @author Ярослав Ганшин
    */
   var Factory = /** @lends SBIS3.CONTROLS.Data.Factory.prototype */{
      /***
       * Приводит значение к переданному типу
       * возможные типы:
       * DataSet - набор записей
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
       * @param value - значение
       * @param type - тип
       * @param adapter - адаптер, нужен для создания модели или датасета
       * @param meta - дополнительные параметры конфигурации типа данных
       * @returns {*} - приведенные
       */
      cast: function (value, type, adapter, meta) {
         if ((value !== null && typeof value !== 'undefined') || type === 'Enum') {
            switch (type) {
               case 'DataSet':
                  return this.makeDataSet(value, adapter);
               case 'Model':
                  return this.makeModel(value, adapter);
               case 'Time':
               case 'Date':
               case 'DateTime':
                  return Date.fromSQL(value);
               case 'Link':
               case 'Integer':
                  return (typeof(value) === 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));
               case 'Double':
                  return (typeof(value) === 'number') ? value : (isNaN(parseFloat(value)) ? null : parseFloat(value));
               case 'Money':
                  if (meta && meta.precision) {
                     return $ws.helpers.bigNum(value).toString(meta.precision);
                  }
                  return value;

               case 'Enum':
                  return new $ws.proto.Enum({
                     availableValues: meta.source, //список вида {0:'one',1:'two'...}
                     currentValue: value //число
                  });
               case 'Flags':
                  return this.makeFlags(value, meta);
               case 'Identity':
                  return $ws.helpers.parseIdentity(value);
               case 'TimeInterval':
                  if (value instanceof $ws.proto.TimeInterval) {
                     return value.toString();
                  }
                  return $ws.proto.TimeInterval.toString(value);

               case 'Text':
               case 'String':
                  return value + "";
               case 'Boolean':
                  return !!value;
               default:
                  return value;
            }
         }
         return value;
      },

      /**
       * сериализует значение перед вставкой в данные
       * @param value - значение
       * @param type - тип
       * @param adapter - адаптер, нужен для создания модели или датасета
       * @param meta - дополнительные параметры конфигурации типа данных
       * @returns {*}
       */
      serialize: function (value, type, adapter, meta) {
         if ((value === null || typeof value === 'undefined') && type !== '') {
            return value;
         }
         switch (type) {
            case 'DataSet':
               if (adapter && adapter.serializeDataSet)
                  return adapter.serializeDataSet(value);
               throw 'Adapter is not defined or doesn\'t have method serializeDataSet';

            case 'Model':
               if (adapter && adapter.serializeModel)
                  return adapter.serializeModel(value);
               throw 'Adapter is not defined or doesn\'t have method serializeModel';

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
               return value instanceof Date ? value.toSQL(serializeMode) : null;

            case 'Flags':
               if (adapter && adapter.serializeFlags)
                  return adapter.serializeFlags(value);
               throw 'Adapter is not defined or doesn\'t have method serializeFlags';

            case 'Integer':
               return (typeof(value) === 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));

            case 'String':
               return value === null ? null : value + "";

            case 'Link':
               return value === null ? null : parseInt(value, 10);

            case 'Money':
               if (meta.precision) {
                  return $ws.helpers.bigNum(value).toString(meta.precision);
               }
               return value;

            case 'TimeInterval':
               if (value instanceof $ws.proto.TimeInterval) {
                  return value.toString();
               }
               return $ws.proto.TimeInterval.toString(value);

            case 'Enum':
               if (value instanceof $ws.proto.Enum) {
                  return value.getCurrentValue();
               }
               return value;

            default:
               return value;
         }
      },

      /***
       * создает модель
       * @param data - данные из поля с типом Модель
       * @param adapter - адаптер модели
       * @returns {*}
       */
      makeModel: function (data, adapter) {
         return $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Model', {
            data: data,
            adapter: adapter
         });
      },

      /***
       * создает DataSet
       * @param data - данные из поля с типом DataSet
       * @param adapter - адаптер Датасета
       * @returns {*}
       */
      makeDataSet: function (data, adapter) {
         return $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Source.DataSet', {
            source: $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Source.Memory', {
               model: $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.ModelConstructor'),
               data: data,
               adapter: adapter
            }),
            data: {
               items: data,
               total: adapter.forTable().getCount(data)
            },
            itemsProperty: 'items',
            totalProperty: 'total'
         });
      },

      /***
       * Создает модель, по метаданным
       * @param value - массив флагов
       * @param meta - параметры поля
       * @returns {*}
       */
      makeFlags: function (value, meta) {
         return this.makeModel(meta.makeData(value), meta.adapter);
      }
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Factory', function () {
      return Factory;
   });

   return Factory;
});