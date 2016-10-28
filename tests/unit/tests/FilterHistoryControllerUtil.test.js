/**
 * Created by am.gerasimov on 28.10.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.FilterHistoryControllerUntil'], function (FilterHistoryControllerUntil) {

   'use strict';
   describe('SBIS3.CONTROLS.FilterHistoryControllerUntil', function () {
      var structure, secondStructure;

      beforeEach(function() {
         structure = [
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
               value: "Все"
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
            }
         ];
      });

      afterEach(function() {
         structure = undefined;
         secondStructure = undefined;
      });

      describe('.prepareStructureToApply', function() {
         it('should merge structures', function() {

            assert.deepEqual(
                secondStructure,
                FilterHistoryControllerUntil.prepareStructureToApply(secondStructure, structure)
            );

            assert.deepEqual(
                structure,
                FilterHistoryControllerUntil.prepareStructureToApply(structure, secondStructure)
            );
         })
      });

   });
});