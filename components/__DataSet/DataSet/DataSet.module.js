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
         _pkIndex: {},
         _childRecordsMap: [],
         _isFirstLoad: true,
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
         this._rawData = data;
      },

      _rebuild: function () {
         this._pkIndex = this._strategy.rebuild(this._rawData, this._keyField);
      },

      /**
       * Получить исходные "сырые" данные
       * @returns {Object} исходные "сырые" данные
       */
      getRawData: function () {
         return this._rawData;
      },

      //FixMe: убрать его?
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
      getRecordByPrimaryKey: function (primaryKey) {
         if (this._isFirstLoad) {
            this._rebuild();
            this._isFirstLoad=false;
         }
         return this.at(this._pkIndex[primaryKey]);
      },

      at: function (index) {
         if (this._childRecordsMap[index] === undefined) {
            var data = this._strategy.at(this._rawData, index);
            if (data) {
               this._childRecordsMap[index] = new Record({
                  'strategy': this._strategy,
                  'raw': data
               });
            } else if (index < 0) {
               return undefined;
            } else {
               throw new Error('No record at index ' + index);
            }
         }
         return this._childRecordsMap[index];
      },

      createRecord:function(){

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