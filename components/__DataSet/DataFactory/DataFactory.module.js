/*global $ws, define, require*/
define('js!SBIS3.CONTROLS.DataFactory', [
], function () {
   'use strict';

   /**
    * Фабрика типов - на основе сырых данных модели, создает объекты
    * переданного типа
    * @class SBIS3.CONTROLS.DataFactory
    * @public
    * @author Ярослав Ганшин
    */
   var DataFactory = /** @lends SBIS3.CONTROLS.DataFactory.prototype */{
      /***
       * Приводит значение к переданному типу
       * возможные типы:
          DataSet - набор записей
          Record - одна запись из выборки
          Time  - время
          Date - дата
          DateTime - дата и время
          Link - связь
          Integer - число целое
          Double - число вещественное
          Money - деьги
          Enum  - перечисляемое
          Flags - поле флагов
          Identity - иденификатор
          TimeInterval - временной интервал
          Text - текст
          String - строка
          Boolean - логическое
         если передать тип не из списка значение не изменится.
       * @param value - значение
       * @param type - тип
       * @param strategy - стратегия, нужен для создания модели или датасета
       * @param meta - дополнительные параметры конфигурации типа данных
       * @returns {*} - приведенные
       */
      cast: function (value, type, strategy, meta) {
         switch(type) {
            case 'Identity':
               return meta.isArray ?
                  value[0] === null ? null : value.join(meta.separator, value) :
                  value;
            case 'DataSet':
               return this.makeDataSet(value, strategy);
            case 'Record':
               return this.makeRecord(value, strategy);
            case 'Time':
            case 'Date':
            case 'DateTime':
               return value === undefined || value === null ? value : Date.fromSQL('' + value);
            case 'Money':
               if (meta && meta.precision > 3) {
                  return $ws.helpers.bigNum(value).toString(meta.precision);
               }
               return value === undefined ? null : value;
            case 'Enum':
               return new $ws.proto.Enum({
                  availableValues: meta.source, //список вида {0:'one',1:'two'...}
                  currentValue: value //число
               });
            case 'Flags':
               return this.makeFlags(value, meta);
            case 'TimeInterval':
               if(value instanceof $ws.proto.TimeInterval) {
                  return value.toString();
               }
               return $ws.proto.TimeInterval.toString(value);
            case 'Boolean':
               if (value === null) {
                  return value;
               }
               return !!value;
            default:
               return value;
         }
      },
      
      /**
       * Сериализует значение перед вставкой в данные
       * @param value - значение
       * @param type - тип
       * @param strategy - стратегия, нужен для создания модели или датасета
       * @param meta - дополнительные параметры конфигурации типа данных
       * @returns {*}
       */
      serialize: function (value, type, strategy, meta) {
         switch(type) {
            case 'Identity':
               return meta.isArray ?
                  value === null ?
                     [null] :
                     typeof value === 'string' ?
                        value.split(meta.separator) :
                        [value]:
                  value;

            case 'DataSet':
               if (strategy && strategy.serializeDataSet) {
                  return strategy.serializeDataSet(value);
               }
               throw 'strategy is not defined or doesn\'t have method serializeDataSet';

            case 'Record':
               if (strategy && strategy.serializeRecord) {
                  return strategy.serializeRecord(value);
               }
               throw 'strategy is not defined or doesn\'t have method serializeRecord';

            case 'Date':
            case 'DateTime':
            case 'Time':
               var serializeMode;
               switch(type) {
                  case 'DateTime':
                     serializeMode = true;
                     break;
                  case 'Time':
                     serializeMode = false;
                     break;
               }
               return value instanceof Date ? value.toSQL(serializeMode) : value;

            case 'Flags':
               if (strategy && strategy.serializeFlags) {
                  return strategy.serializeFlags(value);
               }
               throw 'strategy is not defined or doesn\'t have method serializeFlags';

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
               if(value instanceof $ws.proto.TimeInterval) {
                  return value.toString();
               }
               return $ws.proto.TimeInterval.toString(value);

            case 'Enum':
               if(value instanceof $ws.proto.Enum) {
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
       * @param strategy - стратегия модели
       * @returns {*}
       */
      makeRecord: function(data, strategy) {
         return $ws.single.ioc.resolve('SBIS3.CONTROLS.Record', {
            raw: data,
            strategy: strategy
         });
      },
      /***
       * создает DataSet
       * @param data - данные из поля с типом DataSet
       * @param strategy - стратегия Датасета
       * @returns {*}
       */
      makeDataSet: function(data, strategy) {
         return $ws.single.ioc.resolve('SBIS3.CONTROLS.DataSet', {
            compatibilityMode: true,
            strategy: strategy,
            data: data,
            meta: strategy.getMetaData(data)
         });
      },
      /***
       * Создает модель, по метаданным
       * @param value - массив флагов
       * @param meta - параметры поля
       * @returns {*}
       */
      makeFlags: function(value, meta) {
         return this.makeRecord(meta.makeData(value), meta.strategy);
      }
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.DataFactory', function() {
      return DataFactory;
   });

   return DataFactory;
});