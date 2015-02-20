define(
   [],
   function(){
   return {
      'options' : [
         {
            action : 'resize'
         },
         {
            action : 'changeCaption',
            event : 'dblclick'
         }
      ],
      'changeCaption' : function(container, ActiveDocument) {
         var caption = prompt("Текст на кнопке", $(this._container).text());
         if (caption !== '' && caption !== null && caption !== undefined) {
            ActiveDocument.get().setSelectComponentProperty("ws-config.caption", caption);
         }
      }
   }

});