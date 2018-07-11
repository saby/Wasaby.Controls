/**
 * Вспомогательная функция, позволяющая выбирать из коллекции/списка подходящие элементы
 *
 * @public
 */
define('SBIS3.CONTROLS/ExportCustomizer/Utils/CollectionSelectByIds',
   [
      'WS.Data/Collection/RecordSet'
   ],

   function (RecordSet) {
      'use strict';

      /**
       * Выбрать из коллекции/списка объектов только объекты с указанными идентификаторами. Если указана функция-преобразователь, то преобразовать с её помощью каждый полученный элемент
       *
       * @public
       * @param {Array<object>|WS.Data/Collection/RecordSet<object>} collection Коллекция/список объектов
       * @param {Array<string|number>} ids Список идентификаторов
       * @param {function} [mapper] Функция-преобразователь отобранных объектов (опционально)
       * @return {Array<*>}
       */
      return function collectionSelectByIds(collection, ids, mapper) {
         if (collection && ids && ids.length) {
            var isRecordSet = collection instanceof RecordSet;
            if (isRecordSet ? collection.getCount() : collection.length) {
               var needMap = typeof mapper === 'function';
               return ids.map(function (id, i) {
                  var item;
                  if (!isRecordSet) {
                     collection.some(function (v) { if (v.id === id) { item = v; return true; } });
                  }
                  else {
                     var model = collection.getRecordById(id);
                     if (model) {
                        item = model.getRawData();
                     }
                  }
                  return item && needMap ? mapper(item) : item;
               });
            }
         }
      };
   }
);
