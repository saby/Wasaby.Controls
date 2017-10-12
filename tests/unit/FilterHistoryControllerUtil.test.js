/**
 * Created by am.gerasimov on 28.10.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.FilterHistoryControllerUntil'], function (FilterHistoryControllerUntil) {

   'use strict';
   describe('SBIS3.CONTROLS.FilterHistoryControllerUntil', function () {
      var structure, secondStructure;
      var date = new Date(2016, 11, 11);
      date.setSQLSerializationMode(false);

      beforeEach(function() {
         structure = [
            {
               caption: "Тест",
               internalCaptionField: "Тест_CaptionField",
               internalValueField: "Тест_ValueField",
               resetValue: null,
               value: "Тест_Value",
               itemTemplate: null,
               historyItemTemplate: null
            },
            {
               internalCaptionField: "FilterDatePeriodText",
               internalValueField: "FilterDatePeriod",
               resetValue: "Все",
               value: new Date(2016, 11, 11),
               itemTemplate: null,
               historyItemTemplate: null
            },
            {
               internalCaptionField: "FilterDatePeriodTextTime",
               internalValueField: "FilterDatePeriodTime",
               resetValue: "Все",
               value: date,
               itemTemplate: null,
               historyItemTemplate: null
            }
         ];

         secondStructure = [
            {
               internalCaptionField: "Тест_CaptionField",
               internalValueField: "Тест_ValueField",
               resetValue: null,
               value: null
            },
            {
               caption: "За сегодня",
               internalCaptionField: "FilterDatePeriodText",
               internalValueField: "FilterDatePeriod",
               resetValue: "Все",
               value: "Сегодня"
            },
            {
               caption: "Завтра",
               internalCaptionField: "FilterDatePeriodTextTomorrow",
               internalValueField: "FilterDatePeriodTomorrow",
               resetValue: "Все",
               value: "Сегодня"
            }
         ];
      });

      afterEach(function() {
         structure = undefined;
         secondStructure = undefined;
      });

      describe('.prepareStructureToSave', function() {
         it('should prepare structures', function() {

            var resultStructure =  [
               {
                  caption: "Тест",
                  internalCaptionField: "Тест_CaptionField",
                  internalValueField: "Тест_ValueField",
                  resetValue: null,
                  value: "Тест_Value"
               },
               {
                  internalCaptionField: "FilterDatePeriodText",
                  internalValueField: "FilterDatePeriod",
                  resetValue: "Все",
                  value: "2016-12-11"
               },
               {
                  internalCaptionField: "FilterDatePeriodTextTime",
                  internalValueField: "FilterDatePeriodTime",
                  resetValue: "Все",
                  value: "00:00:00+03"
               }
            ];

            assert.deepEqual(
                resultStructure,
                FilterHistoryControllerUntil.prepareStructureToSave(structure)
            );
         })
      });

      describe('.prepareStructureToApply', function() {
         it('should prepare structure', function() {

            var resultStructure = [
               {
                  internalCaptionField: "Тест_CaptionField",
                  internalValueField: "Тест_ValueField",
                  resetValue: null,
                  value: null,
                  itemTemplate: null,
                  historyItemTemplate: null
               },
               {
                  caption: "За сегодня",
                  internalCaptionField: "FilterDatePeriodText",
                  internalValueField: "FilterDatePeriod",
                  resetValue: "Все",
                  value: "Сегодня",
                  itemTemplate: null,
                  historyItemTemplate: null
               }
            ];

            FilterHistoryControllerUntil.prepareNewStructure(structure, secondStructure);

            assert.deepEqual(
                resultStructure,
                secondStructure
            );
   
            var resultStructure = [
               {
                  internalCaptionField: "Тест_CaptionField",
                  internalValueField: "Тест_ValueField",
                  resetValue: null,
                  value: null,
                  itemTemplate: null,
                  historyItemTemplate: null
               },
               {
                  caption: "За сегодня",
                  internalCaptionField: "FilterDatePeriodText",
                  internalValueField: "FilterDatePeriod",
                  resetValue: "Все",
                  value: "Сегодня",
                  itemTemplate: null,
                  historyItemTemplate: null
               }
            ];
   
            FilterHistoryControllerUntil.prepareNewStructure(secondStructure, structure);
            
            assert.deepEqual(
               resultStructure,
               secondStructure
            );
         })
      });

      describe('.prepareNewStructure', function() {
         it('should prepare structure', function() {

            var resultStructure = [
               {
                  internalCaptionField: "Тест_CaptionField",
                  internalValueField: "Тест_ValueField",
                  resetValue: null,
                  value: null
               },
               {
                  caption: "За сегодня",
                  internalCaptionField: "FilterDatePeriodText",
                  internalValueField: "FilterDatePeriod",
                  resetValue: "Все",
                  value: "Сегодня",
                  itemTemplate: null,
                  historyItemTemplate: null
               }
            ];

            var newStructure =  [
               {
                  internalCaptionField: "Тест_CaptionField",
                  internalValueField: "Тест_ValueField",
                  resetValue: null,
                  value: null,
                  itemTemplate: null,
                  historyItemTemplate: null
               },
               {
                  caption: "За сегодня",
                  internalCaptionField: "FilterDatePeriodText",
                  internalValueField: "FilterDatePeriod",
                  resetValue: "Все",
                  value: "Сегодня"
               },
               {
                  caption: "Завтра",
                  internalCaptionField: "FilterDatePeriodTextTomorrow",
                  internalValueField: "FilterDatePeriodTomorrow",
                  resetValue: "Все",
                  value: "Сегодня"
               }
            ];

            var currentStructure = [
               {
                  caption: "Тест",
                  internalCaptionField: "Тест_CaptionField",
                  internalValueField: "Тест_ValueField",
                  resetValue: null,
                  value: "Тест_Value"
               },
               {
                  internalCaptionField: "FilterDatePeriodText",
                  internalValueField: "FilterDatePeriod",
                  resetValue: "Все",
                  value: new Date(2016, 11, 11),
                  itemTemplate: null,
                  historyItemTemplate: null
               }
            ];

            FilterHistoryControllerUntil.prepareNewStructure(currentStructure, newStructure);

            assert.deepEqual(
                resultStructure,
                newStructure
            );
         })
      });
      
      describe('.resetStructureElementsByFilterKeys', function() {
         var fb = {
            getFilterStructure: function () {return []},
            _options: {}
         };
         
         it('no bindings filterButton', function() {
            assert.equal(FilterHistoryControllerUntil.resetStructureElementsByFilterKeys(fb, []), false);
         })
      });

   });
});