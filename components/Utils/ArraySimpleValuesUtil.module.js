/**
 * Created by am.gerasimov on 15.08.2016.
 */
/**
 * Утилита для простых операция с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 */
define('js!SBIS3.CONTROLS.ArraySimpleValuesUtil', [], function() {

   'use strict';

   return {
      hasInArray: function(array, elem) {
         return this.invertTypeIndexOf(array, elem) !== -1;
      },

      invertTypeIndexOf: function(array, elem) {
         var index = array.indexOf(elem);

         if(index === -1) {
            elem = (typeof elem === 'string') ? Number(elem) : String(elem);
            index = array.indexOf(elem);
         }

         return index;
      }
   };
});