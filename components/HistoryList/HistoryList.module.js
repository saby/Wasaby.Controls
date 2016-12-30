/**
 * Created by gersa_000 on 30.10.2016.
 */
define('js!SBIS3.CONTROLS.HistoryList',
   [
      'js!SBIS3.CONTROLS.HistoryController',
      'js!WS.Data/Collection/IList',
      'js!WS.Data/Collection/IEnumerable',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Entity/Record',
      'Core/Serializer',
      'Core/helpers/generate-helpers',
      'Core/helpers/collection-helpers'
   ],

   function(HistoryController, IList, IEnumerable, RecordSet, Record, Serializer, genHelpers) {

      'use strict';

      var MAX_LENGTH = 10;
      var DATA_FIELD = 'data';
      var ID_FIELD = 'id';
      var FORMAT = [ {name: DATA_FIELD, type: 'record'},  {name: ID_FIELD, type: 'string'} ];

      function getEmptyRecordSet() {
         return new RecordSet({format: FORMAT, idProperty: ID_FIELD});
      }

      function prepareItem(item) {
         var model = new Record({ idProperty: ID_FIELD, format: FORMAT }),
             rawData = {};

         rawData[DATA_FIELD] = item;
         rawData[ID_FIELD] = genHelpers.randomId();

         model[item instanceof Record ? 'set' : 'setRawData'](rawData);

         return model;
      }

      /**
      * Список - коллекция истории c доступом по индексу. Данные хронятся в определённом формате, всего два поля
      * 1) id - уникальный идентификатор записи в истории
      * 2) data - данные, которые сохраняются в список истории, сохраняются в виде записи WS.Data/Entity/Record
      * @extends Core/Abstract
      * @mixes WS.Data/Collection/IList
      * @mixes WS.Data/Collection/IIndexedCollection
      * @mixesWS.Data/Collection/IEnumerable
      * @public
      * @author Герасимов Александр
      */

      var HistoryList = HistoryController.extend([IList, IEnumerable], {
         $protected: {
            _options: {
               serialize: function (serialize, value) {
                  var serializer = new Serializer();

                  if (serialize) {
                     return JSON.stringify(value, serializer.serialize);
                  } else {
                     return value ? JSON.parse(value, serializer.deserialize) : getEmptyRecordSet();
                  }
               },
               emptyValue: getEmptyRecordSet(),
               maxLength: MAX_LENGTH
            }
         },

         //region WS.Data/Collection/IList

         prepend: function (item) {
            if(this._addItemWithMethod('prepend', item)) {
               this.saveHistory();
            }
         },

         append: function(item) {
            if(this._addItemWithMethod('append', item)) {
               this.saveHistory();
            }
         },

         assign: function(items) {
            this.clear();

            for(var i = 0, len = items.length; i < len; i++) {
               this._addItemWithMethod('append', items[i]);
            }

            this.saveHistory();
         },

         clear: function() {
            if(this.getCount()) {
               this.getHistory().clear();
               this.saveHistory();
            }
         },

         remove: function(item) {
            var result = this.getHistory().removeAt(this._getIndex(item));

            if(result) {
               this.saveHistory();
            }
            return result;
         },

         removeAt: function(index) {
            var result = this.getHistory().removeAt(index);

            if(result) {
               this.saveHistory();
            }
            return result;
         },

         at: function(index) {
            return this.getHistory().at(index);
         },

         getIndex: function(item) {
            return this._getIndex(item);
         },

         getCount : function() {
            return this.getHistory().getCount();
         },

         //endregion WS.Data/Collection/IList

         //region WS.Data/Collection/IEnumerable

         each: function(callback, context) {
            this.getHistory().each(callback, context);
         },

         getEnumerator: function() {
            return this.getHistory().getEnumerator();
         },

         //endregion WS.Data/Collection/IEnumerable

         //region Protected methods

         /**
          * Т.к. данные записываются как :
          * data: данные
          * id: randomId
          * то индекс надо искать именно по data, поэтому нужна своя реализация метода getIndex.
          * @private
          */
         _getIndex: function(item) {
            item = prepareItem(item);

            var data = item.get(DATA_FIELD),
                index = -1;

            this.each(function(rec, i) {
               if(index === -1 && rec.get(DATA_FIELD).isEqual(data)) {
                  index = i;
               }
            });

            return index;
         },

         /**
          * Особая логика сохранение данных в историю:
          * 1) Не больше 10
          * 2) При добавлении одинаковых записей они всплывают вверх по стэку
          * @private
          */
         _addItemWithMethod: function(method, item) {
            var historyList = this.getHistory(),
                index = this._getIndex(item),
                changed = false;

            item = prepareItem(item);

            if(index !== -1 && index !== 0) {
               historyList.prepend([item]);
               historyList.removeAt(index + 1);
               changed = true;
            }

            if(index === -1) {
               if (historyList.getCount() >= this._options.maxLength) {
                  historyList.removeAt(this._options.maxLength - 1);
               }
               historyList[method]([item]);
               changed = true;
            }

            return changed;
         }

         //endregion Protected methods
      });

      return HistoryList;

   });