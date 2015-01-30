/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataStrategyArray',
   'js!SBIS3.CONTROLS.DataStrategyBL'
], function (Record, DataStrategyArray, DataStrategyBL) {
   'use strict';

   /**
    * Класс "Набор данных"
    */

   return $ws.proto.Abstract.extend({
      $protected: {
         /**
          * @cfg {} реализация стратегии работы с данными
          */
         _strategy: null,
         /**
          * @cfg {Object} исходные данные для посторения
          */
         _rawData: undefined,
         /**
          * @cfg {String} название поля-идентификатора записи
          */
         _keyField: undefined,
         _options: {
            data: undefined,
            /**
             * @cfg {String} название поля-идентификатора записи
             */
            keyField: '',
            /**
             * @cfg {String} назвение класса, реализующего интерфейс IDataStrategy
             */
            strategy: 'DataStrategyBL' // пока по дефолту оставим так
         }
      },
      $constructor: function () {

         if (this._options.data) {
            this._prepareData(this._options.data);
         }

         //FixME: сделаем глобальный объект со всеми стратегиями и свитч будет не нужен?
         // создаем объект, реализующий интерфейс IDataStrategy, чтобы DataSet мог работать с "сырыми" данными
         switch (this._options.strategy) {
            case 'DataStrategyBL':
               this._strategy = new DataStrategyBL();
               this._keyField = this._strategy.getKey(this._rawData);
               break;
            case 'DataStrategyArray':
               this._strategy = new DataStrategyArray();
               if (this._options.keyField) {
                  this._keyField = this._options.keyField;
               }
               break;
         }

      },

      /**
       * Заполнение массива исходных данных
       * @param {Array} data
       * @private
       */
      _prepareData: function (data) {
         var self = this;
         self._rawData = data;
      },

      /**
       * Получить исходные "сырые" данные
       * @returns {Object} исходные "сырые" данные
       */
      getRawData: function () {
         return this._rawData;
      },

      /**
       * Метод получения значения идентификатора записи
       * @param {js!SBIS3.CONTROLS.Record} record
       * @returns {Number} идентификатор записи
       */
      getKey: function (record) {
         return record.get(this._keyField);
      },

      /**
       * Метод получения записи по ее идентификатору
       * @param {Number} key
       * @returns {js!SBIS3.CONTROLS.Record}
       */
      getRecord: function (key) {
         var record = new Record(this._strategy);
         record.setRaw(this._strategy.getByKey(this._rawData, this._keyField, key));
         return record;
      },

      /**
       * Метод получения объекта стратегии работы с данными
       * @returns {Object}
       */
      getStrategy: function () {
         return this._strategy;
      }

   });
});