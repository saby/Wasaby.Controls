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
             }.once(), //Чтобы не писать кучу раз в консоль предупреждение
             checkTpl = function (tplName, curStructure, newStructure) {
                if(curStructure.hasOwnProperty(tplName)) {
                   newStructure[tplName] = curStructure[tplName];
                } else if (newStructure.hasOwnProperty(tplName)) {
                   delete newStructure[tplName]
                }
             };

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
                     checkTpl(TPL_FIELD, elem, newStructureElem);
                     checkTpl(HISTORY_TPL_FIELD, elem, newStructureElem);
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
      },

      /* Нечестный способ удалить значения структуры по ключам фильтра.
         Из биндов определяет, какой элемент структуры на какое поле фильтра забинден,
         и если это поле есть в переданном массиве сбрасывает элемент структуры к resetValue.
         Почему это требуется: люди используют историю фильтрации, но не хотят сохранять фильтр полностью,
         т.к. некоторые фильтры могут зависеть от определённых условий. Полностью заменять фильтр нельзя, там могут
         быть уже проставленные фильтр из контекста или прикладным программистом.
         Другого способо до серверной отрисовки пока нет. */
      resetStructureElementsByFilterKeys: function(filterButton, structure, keys) {
         var filterStructure = structure || cFunctions.clone(filterButton.getFilterStructure()),
             bindings = colHelpers.find(filterButton.getProperty('bindings'), function(binding) {
                return binding.propName === 'filterStructure'
             }),
             valueBind;

         /* Возвращает поле фильтра по бинду */
         function getFilterName(fullName) {
            var arr = fullName.split('/');
            return arr[arr.length - 1];
         }

         /* Получает среди биндингов объект, в котором описан бинд value */
         function getValueBind(bindObj) {
            var subBind = bindObj.subBindings;
            for (var i = 0, len = subBind.length; i < len; i++) {
               if(subBind[i].propName === 'value') {
                  return subBind[i];
               }
            }
         }

         /* Если вдруг биндов нет */
         if(!bindings || !bindings.subBindings || !bindings.subBindings.length) {
            return;
         }

         bindings = bindings.subBindings;

         for(var i = 0, len = bindings.length; i < len; i++) {
            valueBind = getValueBind(bindings[i]);

            if(valueBind) {
               if (Array.indexOf(keys, getFilterName(valueBind.fieldName)) !== -1) {
                  resetField('value', filterStructure[bindings[i].index]);
               }
            }
         }
      }
   };
});