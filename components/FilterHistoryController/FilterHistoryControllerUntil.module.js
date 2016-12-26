/**
 * Created by am.gerasimov on 19.10.2016.
 */
define('js!SBIS3.CONTROLS.FilterHistoryControllerUntil',
    [
       'Core/core-functions',
       'Core/helpers/collection-helpers',
       'Core/IoC'
    ], function(cFunctions, colHelpers, IoC) {

   'use strict';

   var TPL_FIELD = 'itemTemplate';
   var HISTORY_TPL_FIELD = 'historyItemTemplate';

   return {
      prepareStructureToSave: function(structure) {
         /* Все правки надо делать с копией, чтобы не портить оригинальную структуру */
         var structureCopy = cFunctions.clone(structure);

         colHelpers.forEach(structureCopy, function(elem) {
            /* Хак для испрвления даты, при записи на бл история приводится к строке через метод JSON.stringify,
             а метод stringify сериализует дату, учитывая сдвиг (GMT/UTC)
             и в итоге мы можем получить не ту дату */
            if(elem.value) {
               if(elem.value instanceof Date) {
                  elem.value = elem.value.toSQL();
               }
            }
            /* Надо удалить из истории шаблоны, т.к. история сохраняется строкой */
            if(elem.hasOwnProperty(TPL_FIELD)) {
               delete elem[TPL_FIELD];
            }

            if(elem.hasOwnProperty(HISTORY_TPL_FIELD)) {
               delete elem[HISTORY_TPL_FIELD];
            }
         });

         return structureCopy;
      },

      /* Подготавливает переданную стуктруту для установки в кнопку фильтров,
       оригинальная структура кнопки фильтров может меняться прикладными разработчиками,
       и чтобы не нарушать целостность этой структуры, структура из истории аккуртано вмерживается
       в оригинальную, заменяя лишь value и resetValue, и при необходимости сбрасывает value в resetValue */
      prepareStructureToApply: function(structure, currentStructure) {
         /* Чтобы не портить текущую историю, сделаем копию (иначе не применится фильтр) */
         var currentStructureCopy = cFunctions.clone(currentStructure);

         this.prepareNewStructure(currentStructureCopy, structure);

         /* Сбрасывает поле в структуре к reset значению,
            или удаляет, если нет reset значения */
         function resetField(fieldName, structElem) {
            var resetFieldName = 'reset' + fieldName.ucFirst(),
                resVal = structElem[resetFieldName];

            if(structElem.hasOwnProperty(fieldName)) {
               if(structElem.hasOwnProperty(resetFieldName) && !colHelpers.isEqualObject(structElem[fieldName], resVal)) {
                  structElem[fieldName] = resVal;
               } else {
                  delete structElem[fieldName];
               }
            }
         }

         /* Алгоритм следующий:
          1) Пробегаемся по структуре (она первична, в ней можно менять только фильтры, саму струкруту менять нельзя!!) и ищем
          элементы в структуре из истории с таким же internalValueField
          2) Если нашли, то смержим эти элементы
          3) Если не нашли, и есть значение в value, то сбросим этот фильтр */
         colHelpers.forEach(currentStructureCopy, function(elem) {
            var elemFromHistory = colHelpers.find(structure, function(structureElem) {
               return elem.internalValueField === structureElem.internalValueField;
            }, false);

            if(elemFromHistory) {
               /* Меняем только value и caption, т.к. нам нужны только значения для фильтрации из историии,
                остальные значения структуры нам не интересны + их могут менять, и портить их неправильно тем, что пришло из истории неправильно */
               if(elemFromHistory.value !== undefined) {
                  elem.value = elemFromHistory.value;
               } else {
                  /* Если при мерже структур возникла ситуация, когда в структуре из истории значения нет,
                     а в исходной структуре значение есть, то в исходной структуре его надо сбросить в resetValue или удалить.
                     Иначе применение истории может не заменить некоторые фильтры. */
                  resetField('value', elem);
               }

               if(elemFromHistory.caption !== undefined) {
                  elem.caption = elemFromHistory.caption;
               } else {
                  resetField('caption', elem);
               }

               if(elemFromHistory.visibilityValue !== undefined) {
                  elem.visibilityValue = elemFromHistory.visibilityValue;
               }
            } else if(elem.value && elem.resetValue && !colHelpers.isEqualObject(elem.value, elem.resetValue)) {
               resetField('value', elem);
            }
         });
         return currentStructureCopy;
      },

      prepareNewStructure: function(currentStructure, newStructure) {
         var toDelete = [],
             hasStructureElem = false,
             log = function() {
                IoC.resolve('ILogger').log('FilterHistoryController', 'В стукрутре из истории присутствуют null элементы');
             }.once(); //Чтобы не писать кучу раз в консоль предупреждение

         colHelpers.forEach(newStructure, function(newStructureElem, key) {
            var elemFromCurrentStructure = colHelpers.find(currentStructure, function(elem) {
               /* По неустановленной причине, в структуре из истории могут появляться null'ы,
                скорее всего, это прикладная ошибка, но надо от этого защититься (повторяется только на некоторых фильтрах ЭДО) */
               if(!newStructureElem) {
                  log();
                  return false;
               } else {
                  hasStructureElem = newStructureElem.internalValueField === elem.internalValueField;

                  if(hasStructureElem) {
                     if(elem.hasOwnProperty(TPL_FIELD)) {
                        newStructureElem[TPL_FIELD] = elem[TPL_FIELD];
                     }
                     if(elem.hasOwnProperty(HISTORY_TPL_FIELD)) {
                        newStructureElem[HISTORY_TPL_FIELD] = elem[HISTORY_TPL_FIELD];
                     }
                  }
                  return hasStructureElem;
               }
            });

            if(!elemFromCurrentStructure) {
               toDelete.push(key);
            }
         });

         colHelpers.forEach(toDelete, function(elem) {
            delete newStructure[elem];
         });
      }
   };
});