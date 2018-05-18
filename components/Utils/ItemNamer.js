/**
 * Вспомогательный класс для "вычисления" уникального имени нового элемента набора
 *
 * @public
 * @class SBIS3.CONTROLS/Utils/ItemNamer
 */
define('SBIS3.CONTROLS/Utils/ItemNamer',
   [
   ],

   function () {
      'use strict';

      return /**@lends SBIS3.CONTROLS/Utils/ItemNamer.prototype*/{
         /**
          * "Вычислить" уникальное имени нового элемента набора
          *
          * @public
          * @param {string} value Начальное значение имени
          * @param {Array<object>} list Массив объектов, по которым нужно "вычислять" имя
          * @param {string} property Имя свойства, в котором находятся имена объектов
          * @return {string}
          */
         make: function (value, list, property) {
            if (!value || typeof value !== 'string') {
               throw new Error('Wrong value');
            }
            if (!list || !Array.isArray(list)) {
               throw new Error('Wrong list');
            }
            var collections;
            if (arguments.length === 2 && list.every(function (v) { return typeof v === 'object' && Object.keys(v).length === 2 && Array.isArray(v.list) && typeof v.property === 'string'; })) {
               collections = list;
            }
            else {
               if (!property || typeof property !== 'string') {
                  throw new Error('Wrong property');
               }
               collections = [{list:list, property:property}];
            }
            var reEnd = /\s+\(([0-9]+)\)\s*$/;
            var pattern = value.replace(reEnd, '');
            var previous = [];
            for (var i = 0; i < collections.length; i++) {
               var collection = collections[i];
               for (var j = 0, lst = collection.list, prop = collection.property; j < lst.length; j++) {
                  var v = lst[j][prop];
                  if (v.indexOf(pattern) === 0) {
                     if (v.length === pattern.length) {
                        previous.push(1);
                     }
                     else {
                        var ms = v.substring(pattern.length).match(reEnd);
                        if (ms) {
                           previous.push(parseInt(ms[1]));
                        }
                     }
                  };
               }
            }
            return previous.length ? pattern + ' (' + (Math.max.apply(Math, previous) + 1) + ')' : pattern;
         }
      };
   }
);
