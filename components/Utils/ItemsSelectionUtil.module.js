/**
 * Created by am.gerasimov on 12.04.2017.
 */
define('js!SBIS3.CONTROLS.Utils.ItemsSelection', ['Core/core-instance'], function(cInstance) {
   
   var delayedEvents = {
      onSelectedItemsChange: 'getSelectedItems',
      onSelectedItemChange: 'getSelectedItem'
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
   
   function delayedNotify(notify, notifyArgs, instance) {
      var event = notifyArgs[0],
          args = Array.prototype.slice.call(notifyArgs, 1);
      
      if(delayedEvents.hasOwnProperty(event)) {
         instance[delayedEvents[event]](true).addCallback(function(result) {
            notify.apply(instance, [event].concat(args));
            return result;
         })
      } else {
         return notify.apply(instance, [event].concat(args));
      }
   }
   
   
   return {
      isEmptyItem: isEmptyItem,
      checkItemForSelect: checkItemForSelect,
      delayedNotify: delayedNotify
   }
});