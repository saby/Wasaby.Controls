/**
 * Утилита для простых операция с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 */
define('Controls/Utils/ArraySimpleValuesUtil', [], function() {

   'use strict';

   return {
      hasInArray: function(array, elem) {
         return this.invertTypeIndexOf(array, elem) !== -1;
      },

      invertTypeIndexOf: function(array, elem) {
         var index = array.indexOf(elem);

         if (index === -1) {
            elem = (typeof elem === 'string') ? Number(elem) : String(elem);
            index = array.indexOf(elem);
         }

         return index;
      },

      addSubArray: function(array, items) {
         items.forEach(function(item) {
            if (!this.hasInArray(array, item)) {
               array.push(item);
            }
         }, this);
      },

      removeSubArray: function(array, items) {
         var index;
         items.forEach(function(item) {
            index = this.invertTypeIndexOf(array, item);
            if (index !== -1) {
               array.splice(index, 1);
            }
         }, this);
      },

      /**
       * Сравнивает два массива, возвращает разницу между ними
       * @param arrayOne
       * @param arrayTwo
       * @returns {{added: Array, removed: Array}}
       */
      getArrayDifference: function(arrayOne, arrayTwo) {
         var
            result = {},
            self = this;

         result.removed = arrayOne.filter(function(item) {
            return !self.hasInArray(arrayTwo, item);
         });

         result.added = arrayTwo.filter(function(item) {
            return !self.hasInArray(arrayOne, item);
         });

         return result;
      }

   };
});
