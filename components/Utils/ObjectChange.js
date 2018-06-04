/**
 * Вспомогательная функция ^^^@@@DBG
 *
 * @public
 * @class SBIS3.CONTROLS/Utils/ObjectChange
 */
define('SBIS3.CONTROLS/Utils/ObjectChange',
   [
      'Core/helpers/Object/isEqual'
   ],

   function (cObjectIsEqual) {
      'use strict';

      /**
       * Изменить целевой объект target, установив новые значения из предоставленного набора values. Возвращает набор предыдущих значений для реально изменённых свойств. Есди ничего не изменено - будет возвращён null
       *
       * @public
       * @param {object} target Целевой оъект, который будет изменён
       * @param {object} values Набор новых значений, которые будут использованы для изменения целевого объектв
       * @param {object} descriptor Описание того, что и как изменить. Представляет из себя набор пар вида имя-логическое значение. Имя указывает на имя свойства целевого объекта, подлежащего изменению, а логическое значение указывает на необходимость сравнения старого и нового значения как объектов
       * @return {object}
       */
      return function (target, descriptor, values) {
         if (!target || typeof target !== 'object') {
            throw new Error('Target must be an object');
         }
         if (!descriptor || typeof descriptor !== 'object') {
            throw new Error('Descriptor must be an object');
         }
         if (!values || typeof values !== 'object') {
            throw new Error('Values must be an object');
         }
         var changes;
         for (var name in values) {
            if (name in descriptor) {
               var value = values[name];
               var previous = target[name];
               if (!(value == null && previous == null) && !(descriptor[name] ? cObjectIsEqual(value, previous) : value === previous)) {
                  (changes = changes || {})[name] = previous;
                  target[name] = value;
               }
            }
         }
         return changes || null;
      };
   }
);
