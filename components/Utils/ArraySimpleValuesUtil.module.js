/**
 * Created by am.gerasimov on 15.08.2016.
 */
/**
 * Утилита для простых операция с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 */
define('js!SBIS3.CONTROLS.ArraySimpleValuesUtil', [
   "Core/constants"
], function( constants) {

   'use strict';

   return {
      hasInArray: function(array, elem) {
         return this.invertTypeIndexOf(array, elem) !== -1;
      },

      indexOf: function(array, value) {
         return array.indexOf(value);
      },

      invertTypeIndexOf: function(array, elem) {
         var index = this.indexOf(array, elem);

         if(index === -1) {
            elem = (typeof elem === 'string') ? Number(elem) : String(elem);
            index = this.indexOf(array, elem);
         }

         return index;
      }
   };
});