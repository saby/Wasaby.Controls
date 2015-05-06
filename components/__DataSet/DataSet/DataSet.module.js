/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.Record'
], function (Record) {
   'use strict';

   /**
    * Класс "Набор данных"
    * @author Мануйлов Андрей
    * @public
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

   var DataSet = $ws.proto.Abstract.extend({
      $protected: {
         _isLoaded: false,
         _byId: {},
         _indexId: [],
         /**
          * @cfg {Object} исходные данные для посторения
          */
         _rawData: undefined,
         /**
          * @cfg {String} название поля-идентификатора записи
          */
         _keyField: undefined,
         _options: {
             /**
              * @cfg {String}
              */
            strategy: null,
             /**
              * @cfg {Object}
              */
            data: undefined,
            /**
             * @cfg {String} Название поля-идентификатора записи
             * При работе с БЛ значение данной опции проставляется автоматически.
             */
            keyField: ''

         }
      },
      $constructor: function () {

         this._prepareData(this._options.data);

         if (this._options.keyField) {
            this._keyField = this._options.keyField;
         } else {
            this._keyField = this.getStrategy().getKey(this._rawData);
         }

      },

      /**
       * Метод удаления записи.
       * @param {Number | Array} key Идентификатор записи или массив идентификаторов.
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
         if (data) {
            this._rawData = data;
         } else {
            this._rawData = this.getStrategy().getEmptyRawData();
         }
      },
       /**
        *
        * @returns {*|exports.length|Function|length|.__defineGetter__.length|Number}
        */
      getCount: function () {
         return this.getStrategy().getCount(this._rawData);
      },

      _loadFromRaw: function () {
         this._indexId = this.getStrategy().rebuild(this._rawData, this._keyField);
         this._isLoaded = true;

         var length = this.getCount();
         var data;

         for (var i = 0; i < length; i++) {
            data = this.getStrategy().at(this._rawData, i);
            this._byId[this.getRecordKeyByIndex(i)] = new Record({
               strategy: this.getStrategy(),
               raw: data,
               keyField: this._keyField
            });
         }

      },

      /**
       * Метод получения записи по её идентификатору
       * @returns {js!SBIS3.CONTROLS.Record} Возвращает рекорд.
       * @see getRecordKeyByIndex
       */
      getRecordByKey: function (key) {
         //TODO: убрал проверку (key == null), так как с БЛ ключ приходит как null для записи из метода "Создать"
         if (!this._isLoaded) {
            this._loadFromRaw();
         }
         return this._byId[key];
      },
       /**
        *
        * @param index
        * @returns {*}
        */
      at: function (index) {
         return this.getRecordByKey(this.getRecordKeyByIndex(index));
      },
       /**
        *
        * @param index
        * @returns {*}
        * @see getRecordByKey
        */
      getRecordKeyByIndex: function (index) {
         if (!this._isLoaded) {
            this._loadFromRaw();
         }
         return this._indexId[index];
      },

      /**
       * Метод получения объекта стратегии работы с данными.
       * @returns {Object} Объект стратегии работы с данными.
       * @see strategy
       */
      getStrategy: function () {
         return this._options.strategy;
      },

      // полная установка рекордов в DataSet
      _setRecords: function (records, options) {
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
                  $ws.core.merge(existing.getRaw(), record.getRaw());
               }

               records[i] = existing;

               // если это новый рекорд, добавим его в 'toAdd'
            } else if (add) {
               toAdd.push(record);
               this._addReference(record);
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

               if (at) {
                  this._indexId.splice(at + i, 0, toAdd[i].getKey() || toAdd[i]._cid);
               } else {
                  this._indexId.push(toAdd[i].getKey() || toAdd[i]._cid);
               }
            }

         }

         // вернем добавленный (или смерженный) рекорд (или массив рекордов)
         return singular ? records[0] : records;
      },

      // добавляет рекорд (массив рекордов) в DataSet. Если рекорд уже представлен в DataSet, то
      // рекорд будет пропущен, только если не передана опция {merge: true}, в этом случае атрибуты
      // будут совмещены в существующий рекорд
      _addRecords: function (records, options) {
         this._setRecords(records, $ws.core.merge($ws.core.merge({merge: false}, options), addOptions));
      },

      /**
       * Получить массив записей в текущем датасете
       * @returns {Array}
       */
      _getRecords: function () {
         var records = [];
         this.each(function (rec) {
            records.push(rec);
         });
         return records;
      },

      /**
       * @param dataSetMergeFrom Датасет, из которого будет происходить мерж
       */
      // если будем добавлять больше одной записи, то нужно предваритьно составить из них датасет
      merge: function (dataSetMergeFrom, options) {
         this._setRecords(dataSetMergeFrom._getRecords(), options);
      },

      /**
       * Добавляет рекорд в конец набора
       * @param record
       */
      push: function (record) {
         this._addRecords(record);
      },

      /**
       * Добавляет рекорд в набор
       * @param record
       * @param at - позиция на которую нужно установить новый рекорд, если не задана то добавит в конец
       */
      insert: function (record, at) {
         this._addRecords(record, {at: at});
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

         this._byId[record._cid] = record;
         this._byId[key] = record;

      },

      /**
       *
       * @param iterateCallback
       * @param status {'all'|'deleted'|'changed'} по умолчанию все, кроме удаленных
       */
      each: function (iterateCallback, status) {
         if (!this._isLoaded) {
            this._loadFromRaw();
         }

         var length = this.getCount();

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

      },

      getMetaData: function () {
         return this.getStrategy().getMetaData(this._rawData);
      },

      filter: function (filterCallback) {
         var filterDataSet = new DataSet({
            strategy: this._options.strategy,
            keyField: this._keyField
         });

         this.each(function (record) {
            if (filterCallback(record)) {
               filterDataSet.push(record);
            }
         });

         return filterDataSet;
      }

   });
   return DataSet;
})
;