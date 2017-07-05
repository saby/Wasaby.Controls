define('js!WSControls/Lists/resources/utils/ItemsUtil', [
   'js!WS.Data/Display/Display',
   'Core/core-instance'
], function(Display, cInstance) {
   var DataSourceUtil = {

      getDefaultDisplayFlat: function(items, cfg) {
         var projCfg = {};
         projCfg.idProperty = cfg.idProperty;
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
               method = function (item, index, projItem) {
                  //делаем id группы строкой всегда, чтоб потом при обращении к id из верстки не ошибаться
                  return item.get(field) + '';
               }
            }
            else {
               method = cfg.groupBy.method
            }
            projCfg.group = method;
         }
         if (cfg.loadItemsStrategy == 'merge') {
            projCfg.unique = true;
         }
         return Display.getDefaultDisplay(items, projCfg);
      }
   };
   return DataSourceUtil;
});
