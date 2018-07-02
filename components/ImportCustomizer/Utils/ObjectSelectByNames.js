/**
 * Вспомогательная функция. Выбрать из объекта только указанные в списке свойства
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Utils/ObjectSelectByNames
 */
define('SBIS3.CONTROLS/ImportCustomizer/Utils/ObjectSelectByNames',
   [
   ],

   function () {
      'use strict';

      /**
       * Выбрать из объекта только указанные в списке свойства. Является аналогом Lodash pick, но в отличие от него принимает в качестве элемтов массива properties не только строки, но также и объекты вида имя-значение, где имя будет использовано в качестве имени свойства в результате, а значение - в качестве имени свойства в исходном объекте-источнике
       *
       * @private
       * @param {object} source Объект-источник
       * @param {Array<string|object>} properties Список выбираемых свойства
       * @return {object}
       */
      return function (source, properties) {
         if (!source || typeof source !== 'object') {
            throw new Error('Source must be an object');
         }
         if (!properties || !Array.isArray(properties || !properties.length)) {
            throw new Error('Properties must be none empty array');
         }
         return properties.reduce(function (result, what) {
            if (what) {
               var type = typeof what;
               if (type === 'object') {
                  for (var to in what) {
                     var from = what[to];
                     if (from && typeof from === 'string') {
                        result[to] = source[from];
                     }
                  }
               }
               else
               if (type === 'string') {
                  result[what] = source[what];
               }
            }
            return result;
         }, {});
      };
   }
);
