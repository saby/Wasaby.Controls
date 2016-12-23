/**
 * Created by gersa_000 on 30.10.2016.
 */
define('js!SBIS3.CONTROLS.HistoryList',
   [
      'js!SBIS3.CONTROLS.HistoryController',
      'js!WS.Data/Collection/IList',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Entity/Model',
      'Core/Serializer',
      'Core/helpers/generate-helpers'
   ],

   function(HistoryController, IList, RecordSet, Model, Serializer, genHelpers) {

      'use strict';

      var MAX_FILTERS_AMOUNT = 10;
      var DATA_FIELD = 'data';
      var ID_FIELD = 'id';
      var FORMAT = [ {name: DATA_FIELD, type: 'record'},  {name: ID_FIELD, type: 'string'} ];

      function getEmptyRecordSet() {
         return new RecordSet({format: FORMAT, idProperty: ID_FIELD});
      }

      function prepareItem(item) {
         var model = new Model({
                idProperty: ID_FIELD,
                format: FORMAT
             }),
             rawData = {};

         rawData[DATA_FIELD] = item;
         rawData[ID_FIELD] = genHelpers.randomId();

         model.set(rawData);

         return model;
      }

      var HistoryList = HistoryController.extend([IList], {
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
               emptyValue: getEmptyRecordSet()
            }
         },

         prepend: function (item) {
            this._addItemWithMethod('prepend', item);
            this.saveHistory();
         },

         append: function(item) {
            this._addItemWithMethod('append', item);
            this.saveHistory();
         },

         assign: function(items) {
            this.clear();

            for(var i = 0, len = items.length; i < len; i++) {
               this._addItemWithMethod('append', items[i]);
            }

            this.saveHistory();
         },

         clear: function() {
            this.getHistory().clear();
            this.saveHistory();
         },

         at: function(index) {
            return this.getHistory().at(index);
         },

         remove: function(item) {
            var result = this.getHistory().remove(item);

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

         getIndex: function(item) {
            return this.getHistory().getIndex(item);
         },

         getCount : function() {
            return this.getHistory().getCount();
         },


         _addItemWithMethod: function(method, item) {
            var historyList = this.getHistory(),
               hasEqual = true;

            item = prepareItem(item);

            historyList.each(function (val, index) {
               if(!hasEqual && val.get(DATA_FIELD).isEqual(item.get(DATA_FIELD))) {
                  historyList.add(val, 0);
                  historyList.removeAt(index + 1);
                  hasEqual = true;
               }
            });

            if(!hasEqual) {
               if (historyList >= MAX_FILTERS_AMOUNT) {
                  historyList.removeAt(MAX_FILTERS_AMOUNT - 1);
               }

               historyList[method]([item]);
            }
         }
      });

      return HistoryList;

   });