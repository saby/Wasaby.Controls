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

   /**
    * Дефолтный набор опций при установке рекордов в датасет
    * add - нужно ли добавлять новые рекорды
    * remove - нужно ли удалять рекорды, которые были в датасете, но не входят в новый список рекордов
    * merge - если рекорд уже находится в датасете, необходимо ли перезаписывать его свойства
    */
   var setOptions = {add: true, remove: true, merge: true};
   // Дефолтный набор опций при добавлении рекордов в датасет
   var addOptions = {add: true, remove: false};

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
         this._childRecordsMap = {};
         this._pkIndex = this.getStrategy().rebuild(this._rawData, this._keyField);
      },

      /**
       * Возвращает рекорд по его идентификатору
       * @param {Number} key
       * @returns {js!SBIS3.CONTROLS.Record}
       */
      getRecordByKey: function (key) {
         if (key == null) {
            return void 0;
         }

         if (this._pkIndex === null) {
            this._rebuild();
         }

         var index = this.getRecordIndexByKey(key);

         if (index !== undefined) {
            return this.at(index);
         }
         return undefined;
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

      // полная установка рекордов в DataSet
      setRecords: function (records, options) {
         options || (options = {});
         options = $ws.core.merge(options, setOptions, {preferSource: true});
         var singular = !(records instanceof Array);
         records = singular ? (records ? [records] : []) : $ws.core.clone(records);
         var i, l, key, record, existing;
         var at = options.at;
         var toAdd = [], toRemove = [], recordMap = {};
         var add = options.add, merge = options.merge, remove = options.remove;

         for (i = 0, l = records.length; i < l; i++) {
            record = records[i];
            key = record.getKey();

            // если уже есть такой элемент, предотвратит его добавление и
            // если проставлена опция, то смержит свойства в текущий рекорд

            if (existing = this.getRecordByKey(key)) {
               if (remove) {
                  recordMap[key] = true;
               }

               if (merge) {
                  //FixME: надо смержить свойства как то в existing.... + отслеживать состояние
                  // заменить сырые данные
                  this.getStrategy().replaceAt(this._rawData, this.getRecordIndexByKey(key), record.getRaw());
               }

               records[i] = existing;

               // если это новый рекорд, добавим его в 'toAdd'
            } else if (add) {
               //this._addReference(record);
               toAdd.push(record);
            }

            record = existing || record;
            recordMap[key] = true;
         }

         if (remove) {
            this.each(function (rec) {
               var key = rec.getKey();
               if (!recordMap[key]) {
                  toRemove.push(key);
               }
            }, 'all');

            if (toRemove.length) {
               this.removeRecord(toRemove);
            }
         }

         if (toAdd.length) {

            for (i = 0, l = toAdd.length; i < l; i++) {
               this._prepareRecordForAdd(toAdd[i]);
               this.getStrategy().addRecord(this._rawData, toAdd[i], at);
            }

         }

         this._rebuild();

         // вернем добавленный (или смерженный) рекорд (или массив рекордов)
         return singular ? records[0] : records;
      },

      // добавляет рекорд (массив рекордов) в DataSet. Если рекорд уже представлен в DataSet, то
      // рекорд будет пропущен, только если не передана опция {merge: true}, в этом случае атрибуты
      // будут совмещены в существующий рекорд
      addRecords: function (records, options) {
         this.setRecords(records, $ws.core.merge($ws.core.merge({merge: false}, options), addOptions));
      },

      _prepareRecordForAdd: function (record) {
         //FixME: потому что метод создать не возвращает тип поля "идентификатор"
         record._keyField = this._keyField;

         var key = record.getKey();
         // не менять условие if! с БЛ идентификатор приходит как null
         if (key === undefined) {
            record.set(this._keyField, key = record._cid);
         }
         return record;
      },

      _addReference: function (record, options) {
         //FixME: потому что метод создать не возвращает тип поля "идентификатор"
         record._keyField = this._keyField;

         var key = record.getKey();
         // не менять условие if! с БЛ идентификатор приходит как null
         if (key === undefined) {
            record.set(this._keyField, key = record._cid);
         }

         /*
          this.getStrategy().addRecord(this._rawData, record);
          // не менять условие! с БЛ идентификатор приходит как null
          if (record.getKey() === undefined) {
          record.set(this._keyField, record._cid);
          }
          var index = this.getStrategy().getLength(this._rawData);
          this._childRecordsMap[index - 1] = record;
          this._pkIndex[record.getKey()] = index - 1;
          */
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

         var length = this.getStrategy().getLength(this._rawData);

         for (var i = 0; i < length; i++) {
            var record = this.at(i);
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

   });
})
;