/**
 * Created by am.gerasimov on 12.04.2017.
 */

/**
 * Утилита для работы компонентов с интерфейсами selectable / multiselectable и асинхронной загрузкой записей.
 */
define('js!SBIS3.CONTROLS.Utils.ItemsSelection', ['Core/core-instance'], function(cInstance) {
   
   var delayedEvents = {
      onSelectedItemsChange: 'getSelectedItems'
   };
   
   
   function isEmpty(val) {
      return val === null || val === undefined;
   }
   
   function isEmptyItem(item, idProperty, displayProperty) {
      return isEmpty(item.get(displayProperty)) || isEmpty(item.get(idProperty));
   }
   
   function checkItemForSelect(newItem, currentItem, idProp, displayProp, isEmptySelection) {
      var isModel = cInstance.instanceOfModule(newItem, 'WS.Data/Entity/Model'),
          hasRequiredFields;
   
      if (isModel) {
         /* Проверяем запись на наличие ключевых полей */
         hasRequiredFields = !isEmptyItem(newItem, idProp, displayProp);
      
         if (hasRequiredFields) {
            /* Если запись собралась из контекста, в ней может не быть поля с первичным ключем */
            if (!newItem.getIdProperty()) {
               newItem.setIdProperty(idProp);
            }
            /* Если передали пустую запись и текущая запись тоже пустая, то не устанавливаем её */
         } else if(currentItem && isEmptyItem(currentItem, displayProp, idProp) && isEmptySelection) {
            return false;
         }
      }
      
      return hasRequiredFields || newItem === null || (!hasRequiredFields && !isEmptySelection && isModel);
   }
   
   /**
    * Задержка для событий onSelectedItemsChange, onSelectedItemChange - они стреляют по загрузке треубемых записей
    * @param notify
    * @param notifyArgs
    * @param instance
    * @returns {*}
    */
   function delayedNotify(notify, notifyArgs, instance) {
      var event = notifyArgs[0],
          args = [event].concat(Array.prototype.slice.call(notifyArgs, 1));
      
      if(delayedEvents.hasOwnProperty(event)) {
         instance[delayedEvents[event]](true).addCallback(function(result) {
            notify.apply(instance, args);
            return result;
         });
      } else {
         return notify.apply(instance, args);
      }
   }
   
   /**
    * Инициализация selectorAction'a, подписка на необходимые события, обработка этих событий
    * @param action
    * @param ctrl
    */
   function initSelectorAction(action, ctrl) {
      ctrl.subscribeTo(action, 'onExecuted', function(event, meta, result) {
         ctrl.setActive(true);
         if(result) {
            ctrl.setSelectedItems(result);
         }
      });
   
      ctrl.subscribeTo(action, 'onExecute', function (event, meta) {
         //TODO нелогично называется событие - переименовать
         event.setResult(ctrl._notify('onChooserClick', meta));
      });
   }
   
   
   return {
      isEmptyItem: isEmptyItem,
      checkItemForSelect: checkItemForSelect,
      delayedNotify: delayedNotify,
      initSelectorAction: initSelectorAction
   }
});