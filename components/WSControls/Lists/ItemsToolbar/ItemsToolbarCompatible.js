/**
 * Created by am.gerasimov on 13.07.2017.
 */
define('js!WSControls/Lists/ItemsToolbar/ItemsToolbarCompatible',
   [
      'js!SBIS3.CONTROLS.ItemsToolbar',
      'WS.Data/Utils'
   ], function (ItemsToolbar, dataUtils) {
   
   /* Слой совместимости между старым тулбаром и новым ListView.
      Новый тулбар будем позиционировать с строке, а не позициаонировать с помощью координат.
      Весь "плохой" код для совместимости вынесен сюда. */
   var ItemsToolbarCompatible = ItemsToolbar.extend({
      setActiveItem: function(cfg) {
         this.activeItem = cfg;
         
         if(cfg.hoveredIndex !== -1) {
            var projItem = cfg.display.at(cfg.hoveredIndex),
                item = projItem.getContents(),
                itemContainer = cfg.parentContainer.find('[data-hash=' + projItem.getHash() + ']'),
                parentContainerCords = cfg.parentContainer[0].getBoundingClientRect();
            
            this.show({
               record: item,
               id: dataUtils.getItemPropertyValue(item, this._options.idProperty),
               container: itemContainer,
               size: {
                  height: itemContainer[0].offsetHeight,
                  width: itemContainer[0].offsetWidth
               },
               position : {
                  top: itemContainer[0].getBoundingClientRect().top - parentContainerCords.top,
                  left: itemContainer[0].getBoundingClientRect().left - parentContainerCords.left
               }
            });
         } else {
            this.hide();
         }
      },
      getActiveItem: function () {
         return this.activeItem;
      }
   });
   
   return ItemsToolbarCompatible;
});