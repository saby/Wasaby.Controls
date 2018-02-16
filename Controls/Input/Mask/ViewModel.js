define('Controls/Input/Mask/ViewModel',
   [
      'Core/core-simpleExtend'
   ],
   function(simpleExtend) {

      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Журавлев Максим Сергеевич
       */
      var ViewModel = simpleExtend.extend({
         constructor: function(options) {

         },

         /**
          * Обновить опции.
          * @param newOptions Новые опции.
          */
         updateOptions: function(newOptions) {

         },

         /**
          * Подготовить данные.
          * @param splitValue значение разбитое на части before, insert, after, delete.
          * @param inputType тип ввода.
          * @returns {{value: (String), position: (Integer)}}
          */
         prepareData: function(splitValue, inputType) {

         }
      });

      return ViewModel;
   }
);