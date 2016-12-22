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
      'Core/helpers/generate-helpers',
      'Core/core-functions'
   ],

   function(HistoryController, IList, RecordSet, Model, Serializer, genHelpers, cFunctions) {

      'use strict';

      var MAX_FILTERS_AMOUNT = 10;
      var DATA_FIELD = 'data';
      var ID_FIELD = 'id';
      var FORMAT = [
         {name: DATA_FIELD, type: 'record'},
         {name: ID_FIELD, type: 'string'}
      ];

      function getEmptyRecordSet() {
         return new RecordSet({format: FORMAT, idProperty: ID_FIELD});
      }

      function prepareData(data) {
         if(!Object.isValid(data)) {
            throw new Error ('data must be instance of Object');
         }

         var model = new Model({
                idProperty: ID_FIELD,
                format: FORMAT
             }),
             rawData = {};

         rawData[DATA_FIELD] = data;
         rawData[ID_FIELD] = genHelpers.randomId();

         model.set(rawData);

         return model;
      }

      var FilterHistoryControllerNew = HistoryController.extend([IList], {
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

         prepend: function (filerObj) {
            var historyList = this.getHistory(),
                newData = prepareData(filerObj),
                hasEqual = false;

            historyList.each(function (val, index) {
               if(!hasEqual && val.get(DATA_FIELD).isEqual(newData.get(DATA_FIELD))) {
                  historyList.add(val, 0);
                  historyList.removeAt(index + 1);
                  hasEqual = true;
               }
            });

            if(!hasEqualFilter) {
               if (historyList >= MAX_FILTERS_AMOUNT) {
                  historyList.removeAt(MAX_FILTERS_AMOUNT - 1);
               }

               historyList.prepend([toSave]);
            }

            this.saveHistory();
         },

         append: function() {

         }
      });

      return FilterHistoryControllerNew;

   });