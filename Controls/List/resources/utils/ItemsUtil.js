define('Controls/List/resources/utils/ItemsUtil', [
   'WS.Data/Display/Display',
   'Core/core-instance',
   'WS.Data/Utils',
   'WS.Data/Display/Enum'
], function(Display, cInstance, DataUtils) {
   var ItemsUtil = {

      getDefaultDisplayFlat: function(items, cfg) {
         var projCfg = {};
         projCfg.keyProperty = cfg.keyProperty;
         if (cfg.itemsSortMethod) {
            projCfg.sort = cfg.itemsSortMethod;
         }
         if (cfg.itemsFilterMethod) {
            projCfg.filter = cfg.itemsFilterMethod;
         }
         if (cfg.groupBy) {
            var method;
            if (!cfg.groupBy.method) {
               var field = cfg.groupBy.field;

               method = function(item, index, dispItem) {
                  //делаем id группы строкой всегда, чтоб потом при обращении к id из верстки не ошибаться
                  return ItemsUtil.getPropertyValue(item, field) + '';
               };
            } else {
               method = cfg.groupBy.method;
            }
            projCfg.group = method;
         }
         if (cfg.loadItemsStrategy == 'merge') {
            projCfg.unique = true;
         }
         return Display.getDefaultDisplay(items, projCfg);
      },

      getPropertyValue: function(itemContents, field) {
         if (!(itemContents instanceof Object)) {
            return itemContents;
         } else {
            return DataUtils.getItemPropertyValue(itemContents, field);
         }
      },

      //TODO это наверное к Лехе должно уехать
      getDisplayItemById: function(display, id, keyProperty) {
         var list = display.getCollection();
         if (cInstance.instanceOfModule(list, 'WS.Data/Collection/RecordSet')) {
            return display.getItemBySourceItem(list.getRecordById(id));
         } else {
            var resItem;
            display.each(function(item, i) {
               if (ItemsUtil.getPropertyValue(item.getContents(), keyProperty) == id) {
                  resItem = item;
               }
            });
            return resItem;
         }
      },

      getDefaultDisplayItem: function(display, item) {
         return display.createItem({contents: item});
      }
   };
   return ItemsUtil;
});
