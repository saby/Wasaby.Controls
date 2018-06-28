/**
 * Вспомогательная функция. Изменить целевой объект target, установив новые значения из предоставленного набора values. Возвращает набор предыдущих значений для реально изменённых свойств
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
       * @param {object} descriptors Описание того, что и как изменить. Представляет из себя набор пар вида имя-описание изменения. Имя указывает на элемент в наборе новых значений, а описание изменения содержит логическое значение, указывающее на необходимость сравнения старого и нового значения как объектов
       * @return {object}
       */
      return function (target, values, descriptors) {
         if (!target || typeof target !== 'object') {
            throw new Error('Target must be an object');
         }
         if (!values || typeof values !== 'object') {
            throw new Error('Values must be an object');
         }
         if (!descriptors || typeof descriptors !== 'object') {
            throw new Error('Descriptors must be an object');
         }
         var changes;
         for (var name in values) {
            if (name in descriptors) {
               var value = values[name];
               var descriptor = descriptors[name];
               var isComplex = typeof descriptor === 'object';
               var prop = isComplex && 'target' in descriptor ? descriptor.target : name;
               var previous = target[prop];
               if (!(value == null && previous == null) && !((isComplex ? descriptor.asObject : descriptor) ? cObjectIsEqual(value, previous) : value === previous)) {
                  (changes = changes || {})[name] = previous;
                  target[prop] = value;
               }
            }
         }
         return changes || null;
      };
   }
);
