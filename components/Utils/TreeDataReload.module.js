define('js!SBIS3.CONTROLS.Utils.TreeDataReload', function() {

   'use strict';

   /**
    * Утилита для перезагрузки данных в дереве
    * @class SBIS3.CONTROLS.Utils.TreeDataReload
    * @author Авраменко А.С.
    * @public
    */

   return {
      /**
       * Метод позволяет сформировать список узлов для перезагрузки
       * @param {Object} config Конфигурация для формирования списка узлов.
       * В конфигурации необходимо передавать: direction, hierarchyRelation, item, items, nodeProperty.
       */
      prepareReloadableNodes: function(config) {
         var
            result = {},
            items = config.items,
            nodeProperty = config.nodeProperty,
            hierarchyRelation = config.hierarchyRelation;
         function recursivePrepareInside(item) {
            var
               itemId = item.getId(),
               relatedItems = hierarchyRelation.getChildren(item, items);
            result[itemId] = 0; // В этом месте можно передать, сколько записей загружено на текущий момент (для поддержки "ещё")
            relatedItems.forEach(function(elem) {
               if (elem.get(nodeProperty) !== null) {
                  recursivePrepareInside(elem);
               }
            });
         }
         if (config.direction === 'inside') {
            recursivePrepareInside(config.item);
         }
         return result;
      },

      /**
       * Обновляет всю иерархию элементов, удалив совпадающие узлы и примерживив новые данные
       * @param {Object} config Конфигурация для формирования списка узлов.
       * В конфигурации необходимо передавать: direction, hierarchyRelation, item, items, updatedItems.
       */
      applyUpdatedData: function(config) {
         var
            item = config.item,
            items = config.items,
            updatedItems = config.updatedItems,
            hierarchyRelation = config.hierarchyRelation,
            nodeProperty = config.nodeProperty,
            itemsToRemove = [];
         function recursivePrepareItemsToRemoveInside(item) {
            var
               relatedItems = hierarchyRelation.getChildren(item, items);
            relatedItems.forEach(function(elem) {
               if (elem.get(nodeProperty) !== null) {
                  recursivePrepareItemsToRemoveInside(elem);
               }
               if (!updatedItems.getRecordById(elem.getId())) {
                  itemsToRemove.push(elem);
               }
            });
         }
         if (config.direction === 'inside') {
            recursivePrepareItemsToRemoveInside(item);
         }
         if (itemsToRemove.length) {
            // Отключаем eventRaising только если имеются элементы для удаления, иначе проекция присылает вместо события
            // replace последовательность из событий remove и add, а в событии remove развернутые узлы сворачиваются.
            items.setEventRaising(false, true);
            itemsToRemove.forEach(function(elem) {
               items.remove(elem);
            });
         }
         items.merge(updatedItems, {
            remove: false
         });
         if (itemsToRemove.length) {
            items.setEventRaising(true, true);
         }
      }
   };

});