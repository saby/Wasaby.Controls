/**
 * Created by am.gerasimov on 19.10.2016.
 */
define('SBIS3.CONTROLS/Filter/HistoryController/FilterHistoryControllerUntil',
    [
       'Core/core-clone',
       'Core/helpers/Object/isEqual',
       'Core/helpers/Object/find',
       'Core/helpers/String/ucFirst',
       'WS.Data/Chain',
       'Core/Date'
    ], function(coreClone, isEqualObject, objectFind, ucFirst, Chain, Date) {

   'use strict';

   var TPL_FIELD = 'itemTemplate';
   var HISTORY_TPL_FIELD = 'historyItemTemplate';

   /* Сбрасывает поле в структуре к reset значению,
      или удаляет, если нет reset значения */
   function resetField(fieldName, structElem) {
      var resetFieldName = 'reset' + ucFirst.call(fieldName),
          resVal = structElem[resetFieldName];

      if(structElem.hasOwnProperty(fieldName)) {
         if(structElem.hasOwnProperty(resetFieldName) && !isEqualObject(structElem[fieldName], resVal)) {
            structElem[fieldName] = resVal;
         } else {
            delete structElem[fieldName];
         }
      }
   }

   return {
      prepareViewFilter: function(view, noSaveFilters) {
         var
            /* View может не быть, если кнопку фильтров используют отдельно (например в торгах,
             там по кнопке фильтров фильтруется набор из несколькх view */
            viewFilter = coreClone(view ? view.getFilter() : {});

         if (noSaveFilters) {
            noSaveFilters.forEach(function (filter) {
               if (viewFilter[filter]) {
                  delete viewFilter[filter];
               }
            });
         }

         /* Т.к. в реестре задач (возможно где-то ещё)
          в поле фильтра с типом "Дата" ожидают строку даты со сдвигом(чтобы её обработать),
          а не стандартный ISO формат, то использую наш специальный метод для приведения даты в строку */
         for (var key in viewFilter) {
            if(viewFilter.hasOwnProperty(key)) {
               if(viewFilter[key] instanceof Date) {
                  viewFilter[key] = viewFilter[key].toSQL(Date.SQL_SERIALIZE_MODE_AUTO);
               }
            }
         }

         return viewFilter;
      },
      
      resetNoSaveStructureKeys: function(structure, doNotSaveKeys) {
         var structureCopy = coreClone(structure);
         
         structureCopy.forEach(function(elem) {
            if (doNotSaveKeys.indexOf(elem.filterField) !== -1) {
               resetField('value', elem);
               resetField('caption', elem);
            }
         });
         
         return structureCopy;
      },
      
      prepareStructureToSave: function(structure, doNotSaveKeys) {
         /* Все правки надо делать с копией, чтобы не портить оригинальную структуру */
         var structureCopy = coreClone(structure);

         for (var key in structureCopy) {
            if(structureCopy.hasOwnProperty(key)) {
               /* Хак для испрвления даты, при записи на бл история приводится к строке через метод JSON.stringify,
                а метод stringify сериализует дату, учитывая сдвиг (GMT/UTC)
                и в итоге мы можем получить не ту дату */
               if(structureCopy[key].value) {
                  if(structureCopy[key].value instanceof Date) {
                     structureCopy[key].value = structureCopy[key].value.toSQL(Date.SQL_SERIALIZE_MODE_AUTO);
                  }
               }
               /* Надо удалить из истории шаблоны, т.к. история сохраняется строкой */
               if(structureCopy[key].hasOwnProperty(TPL_FIELD)) {
                  delete structureCopy[key][TPL_FIELD];
               }

               if(structureCopy[key].hasOwnProperty(HISTORY_TPL_FIELD)) {
                  delete structureCopy[key][HISTORY_TPL_FIELD];
               }
            }
         }

         return structureCopy;
      },

      /* Подготавливает переданную стуктруту для установки в кнопку фильтров,
       оригинальная структура кнопки фильтров может меняться прикладными разработчиками,
       и чтобы не нарушать целостность этой структуры, структура из истории аккуртано вмерживается
       в оригинальную, заменяя лишь value и resetValue, и при необходимости сбрасывает value в resetValue */
      prepareStructureToApply: function(structure, currentStructure, doNotResetIfFound, doNotApplyKeys) {
         /* Чтобы не портить текущую историю, сделаем копию (иначе не применится фильтр) */
         var currentStructureCopy = coreClone(currentStructure);
         var needApply;
         doNotApplyKeys = doNotApplyKeys || [];

         this.prepareNewStructure(currentStructureCopy, structure, doNotApplyKeys);

         /* Алгоритм следующий:
          1) Пробегаемся по структуре (она первична, в ней можно менять только фильтры, саму струкруту менять нельзя!!) и ищем
          элементы в структуре из истории с таким же internalValueField
          2) Если нашли, то смержим эти элементы
          3) Если не нашли, и есть значение в value, то сбросим этот фильтр */
         for (var key in currentStructureCopy) {
            if(currentStructureCopy.hasOwnProperty(key)) {
               var elemFromHistory = objectFind(structure, function(structureElem) {
                  return currentStructureCopy[key].internalValueField === structureElem.internalValueField;
               }, false);
   
               needApply = doNotApplyKeys.indexOf(currentStructureCopy[key].filterField || currentStructureCopy[key].internalValueField) === -1;
               
               if(elemFromHistory) {
                  if (needApply) {
                     /* Меняем только value и caption, т.к. нам нужны только значения для фильтрации из историии,
                      остальные значения структуры нам не интересны + их могут менять, и портить их неправильно тем, что пришло из истории неправильно */
                     if (elemFromHistory.value !== undefined) {
                        currentStructureCopy[key].value = elemFromHistory.value;
                     } else {
                        /* Если при мерже структур возникла ситуация, когда в структуре из истории значения нет,
                         а в исходной структуре значение есть, то в исходной структуре его надо сбросить в resetValue или удалить.
                         Иначе применение истории может не заменить некоторые фильтры. */
                        resetField('value', currentStructureCopy[key]);
                     }
   
                     if (elemFromHistory.caption !== undefined) {
                        currentStructureCopy[key].caption = elemFromHistory.caption;
                     } else {
                        resetField('caption', currentStructureCopy[key]);
                     }
   
                     if (elemFromHistory.visibilityValue !== undefined) {
                        currentStructureCopy[key].visibilityValue = elemFromHistory.visibilityValue;
                     }
                  }
               } else if(!doNotResetIfFound && needApply && currentStructureCopy[key].hasOwnProperty('value') && currentStructureCopy[key].hasOwnProperty('resetValue') && !isEqualObject(currentStructureCopy[key].value, currentStructureCopy[key].resetValue) && doNotApplyKeys) {
                  resetField('value', currentStructureCopy[key]);
               }
            }
         }
         return currentStructureCopy;
      },

      prepareNewStructure: function(currentStructure, newStructure, noSaveFilters) {
         var toDelete = [],
             hasStructureElem = false,
             checkTpl = function (tplName, curStructure, newStructure) {
                if(curStructure.hasOwnProperty(tplName)) {
                   newStructure[tplName] = curStructure[tplName];
                } else if (newStructure.hasOwnProperty(tplName)) {
                   delete newStructure[tplName]
                }
             };
   
         noSaveFilters = noSaveFilters || [];
         
         for (var key in newStructure) {
            if (newStructure.hasOwnProperty(key)) {
               var elemFromCurrentStructure = objectFind(currentStructure, function(elem) {
                  /* По неустановленной причине, в структуре из истории могут появляться null'ы,
                   скорее всего, это прикладная ошибка, но надо от этого защититься (повторяется только на некоторых фильтрах ЭДО) */
                  if(!newStructure[key] || noSaveFilters.indexOf(newStructure[key].filterField) !== -1) {
                     return false;
                  } else {
                     hasStructureElem = newStructure[key].internalValueField === elem.internalValueField;

                     if(hasStructureElem) {
                        checkTpl(TPL_FIELD, elem, newStructure[key]);
                        checkTpl(HISTORY_TPL_FIELD, elem, newStructure[key]);
                     }
                     return hasStructureElem;
                  }
               });

               if(!elemFromCurrentStructure) {
                  toDelete.push(key);
               }
            }
         }

         toDelete.forEach(function(elem) {
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
         var filterStructure = structure || coreClone(filterButton.getFilterStructure()),
             bindings = objectFind(filterButton._options.bindings, function(binding) {
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
            return false;
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
      },
   
      minimizeStructureToSave: function(structure) {
         structure = this.prepareStructureToSave(structure);
         return Chain(structure).reduce(function(result, item) {
            var structureElem = {};
         
            structureElem.internalValueField = item.internalValueField;
         
            if (item.hasOwnProperty('value')) {
               structureElem.value = item.value;
            }
         
            if (item.hasOwnProperty('caption')) {
               structureElem.caption = item.caption;
            }
         
            if (item.hasOwnProperty('visibilityValue')) {
               structureElem.visibilityValue = item.visibilityValue;
            }
         
            result.push(structureElem);
            return result;
         }, []);
      }
   };
});