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
         _pkIndex: null,
         _childRecordsMap: {},
         /**
          * @cfg {Object} исходные данные для посторения
          */
         _rawData: undefined,
         /**
          * @cfg {String} название поля-идентификатора записи
          */
         _keyField: undefined,
         _options: {
            strategy: null,
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

      /**
       * Удалить запись
       * @param {Number | Array} key идентификатор записи или массив идентификаторов
       */
      removeRecord: function (key) {
         var self = this;
         var mark = function (key) {
            var record = self.getRecordByKey(key),
               index = self.getRecordIndexByKey(key);
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
       * Возвращает рекорд по его идентификатору
       * @param {Number} key
       * @returns {js!SBIS3.CONTROLS.Record}
       */
      getRecordByKey: function (key) {
         if (this._pkIndex === null) {
            this._rebuild();
         }
         return this.at(this._pkIndex[key]);
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
         if (this._pkIndex === null) {
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

      addRecord: function (record) {
         record._keyField = this._keyField;
         this.getStrategy().addRecord(this._rawData, record);
         var index = this.getStrategy().getLength(this._rawData);
         // не меняем условие потому что с БЛ приходит null
         if (record.getKey() === undefined) {
            record.set(this._keyField, record._cid);
         }
         this._childRecordsMap[index - 1] = record;
         this._pkIndex[record._cid] = index - 1;
      },

      /**
       *
       * @param iterateCallback
       * @param status {'all'|'deleted'|'changed'} по умолчанию все, кроме удаленных
       */
      each: function (iterateCallback, status) {
         if (this._pkIndex === null) {
            this._rebuild();
         }
         for (var key in this._pkIndex) {
            if (this._pkIndex.hasOwnProperty(key)) {
               var record = this.getRecordByKey(key);
               switch (status) {
                  case 'all':
                     iterateCallback.call(this, record);
                     break;
                  case 'deleted':
                     if (record.getMarkStatus() == 'deleted') {
                        iterateCallback.call(this, record);
                     }
                     break;
                  case 'changed':
                     if (record.getMarkStatus() == 'changed') {
                        iterateCallback.call(this, record);
                     }
                     break;
                  default :
                     if (record.getMarkStatus() !== 'deleted') {
                        iterateCallback.call(this, record);
                     }
               }

            }
         }
      }

   });
})
;