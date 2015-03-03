/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.Record'
], function (Record) {
   'use strict';

   /**
    * Класс "Набор данных"
    */

   return $ws.proto.Abstract.extend({
      $protected: {
         _pkIndex: undefined,
         _childRecordsMap: [],
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
            keyField: ''

         }
      },
      $constructor: function () {

         if (this._options.data) {
            this._prepareData(this._options.data);
         }

         if (this._options.keyField) {
            this._keyField = this._options.keyField;
         } else {
            this._keyField = this.getStrategy().getKey(this._rawData);
         }

      },

      addRecord: function (record) {

      },

      /**
       * Удалить элемент из массива
       * @param {Number | Array} key идентификатор записи или массив идентификаторов
       */
      removeRecord: function (key) {
         var self = this;
         var mark = function (key) {
            var record = self.getRecordByKey(key);
            record.toggleStateDeleted(true);
         };

         if (key instanceof Array) {
            var length = key.length;
            for (var i = 0; i < length; i++) {
               mark(key[i]);
            }
         } else {
            mark(key);
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
         this._pkIndex = this.getStrategy().rebuild(this._rawData, this._keyField);
      },

      /**
       * Получить исходные "сырые" данные
       * @returns {Object} исходные "сырые" данные
       */
      getData: function () {
         return this._rawData;
      },

      /**
       * Метод получения записи по ее идентификатору
       * @param {Number} key
       * @returns {js!SBIS3.CONTROLS.Record}
       */
      getRecordByKey: function (primaryKey) {
         if (this._pkIndex === undefined) {
            this._rebuild();
         }
         return this.at(this._pkIndex[primaryKey]);
      },

      at: function (index) {
         if (this._childRecordsMap[index] === undefined) {
            var data = this.getStrategy().at(this._rawData, index);
            if (data) {
               this._childRecordsMap[index] = new Record({
                  strategy: this.getStrategy(),
                  raw: data,
                  keyField: this._keyField
               });
            } else if (index < 0 /* что если больше чем в наборе */) {
               return undefined;
            } else {
               throw new Error('No record at index ' + index);
            }
         }
         return this._childRecordsMap[index];
      },

      getRecordIndexByKey: function (key) {
         if (this._pkIndex === undefined) {
            this._rebuild();
         }
         return this._pkIndex[key];
      },

      /**
       * Метод получения объекта стратегии работы с данными
       * @returns {Object}
       */
      getStrategy: function () {
         return this._options.strategy;
      },

      each: function (iterateCallback, context) {
         if (this._pkIndex === undefined) {
            this._rebuild();
         }
         for (var key in this._pkIndex) {
            if (this._pkIndex.hasOwnProperty(key)) {
               iterateCallback.call(context, this.getRecordByKey(key));
            }
         }
      }

   });
});