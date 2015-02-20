define(
   [],
   function(){
   return {
      'options' : [
         {
            action : 'resize',
				type : 'hor'
         },
         {
            action : 'changeCaption',
            event : 'dblclick'
         }
      ],
      'changeCaption' : function(container, ActiveDocument) {
         var caption = prompt("Текст на кнопке", this.getCaption());
         if (caption !== null && caption !== undefined) {
            ActiveDocument.get().setSelectComponentProperty("ws-config.caption", caption);
         }
      }
   }

});