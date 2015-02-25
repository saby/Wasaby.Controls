/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.StrategyHelper'
], function (Record, StrategyHelper) {
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
             * @cfg {String} название поля-идентификатора записи, при работе с БЛ проставляется автоматически
             */
            keyField: '',
            /**
             * @cfg {String} назвение класса, реализующего интерфейс IDataStrategy
             */
            strategyName: '' //FixME: что по умолчанию?
         }
      },
      $constructor: function () {

         if (this._options.data) {
            this._prepareData(this._options.data);
         }


         if (this._options.strategyName) {
            this._strategy = StrategyHelper.getStrategyObjectByName(this._options.strategyName);
         }

         if (this._options.keyField) {
            this._keyField = this._options.keyField;
         } else {
            this._keyField = this._strategy.getKey(this._rawData);
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