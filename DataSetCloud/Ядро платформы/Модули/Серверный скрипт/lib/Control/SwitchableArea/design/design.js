define(['js!SBIS3.CORE.Menu'], function(Menu){
   return {
      'options' : [
         {
            action : 'resize'
         },
         {
            action : 'customs',
            customizationDialog : 'areaSelector',
            iconParams : 'returnConfigIcon'
         }
      ],
      returnConfigIcon : function(){
         return { title: 'Переключить область' };
      },
      areaSelector : function(control, event) {
         var areaCollection = control.getItems(),
            areaArray = [];
         for (var i = 0, l = areaCollection.length; i < l; i++){
            var areaId = areaCollection[i].getId(),
               areaIdForShow = /^ws-area-/.test(areaId) ? '' : ': ' + areaId;
            areaArray.push({
               caption: 'Область ' + (i + 1) + areaIdForShow,
               id: areaId,
               enabled: areaId !== control.getCurrentAreaId()
            });
         }
         var menu = new Menu({ data: areaArray });
         menu.subscribe('onActivated', function(e, id){
            control.setActiveArea(id);
         });
         menu.show({
            left: event.clientX,
            top: event.clientY
         });
      }
   };
});