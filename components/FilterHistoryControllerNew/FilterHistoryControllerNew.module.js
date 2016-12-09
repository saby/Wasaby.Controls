/**
 * Created by gersa_000 on 30.10.2016.
 */
define('js!SBIS3.CONTROLS.FilterHistoryControllerNew',
   [
      'js!SBIS3.CONTROLS.HistoryController',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Entity/Model',
      'Core/Serializer',
      'Core/helpers/generate-helpers',
      'Core/core-functions'
   ],

   function(HistoryController, RecordSet, Model, Serializer, genHelpers, cFunctions) {

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

      var FilterHistoryControllerNew = HistoryController.extend({
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

         addFilterToHistory: function (filerObj) {
            if(!Object.isValid(filerObj)) {
               throw new Error ('filter must be instance of Object');
            }

            var historyList = this.getHistory(),
                toSave = new Model({
                   idProperty: ID_FIELD,
                   format: FORMAT
                }),
                rawData = {},
                hasEqualFilter = false;

            rawData[DATA_FIELD] = cFunctions.clone(filerObj);
            rawData[ID_FIELD] = genHelpers.randomId();

            toSave.setRawData(rawData);

            historyList.each(function (val, index) {
               if(!hasEqualFilter && val.get(DATA_FIELD).isEqual(toSave.get(DATA_FIELD))) {
                  historyList.add(val, 0);
                  historyList.removeAt(index + 1);
                  hasEqualFilter = true;
               }
            });

            if(!hasEqualFilter) {
               if (historyList >= MAX_FILTERS_AMOUNT) {
                  historyList.removeAt(MAX_FILTERS_AMOUNT - 1);
               }

               historyList.prepend([toSave]);
            }

            this.saveHistory();
         }
      });

      return FilterHistoryControllerNew;

   });