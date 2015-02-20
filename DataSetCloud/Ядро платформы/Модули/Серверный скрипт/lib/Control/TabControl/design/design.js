define([], function(){
   return {
      'options' : [
         {
            action : 'resize'
         },
         {
            action : "titleClick",
            className : "ws-TabButtons__button",
            event: "mousedown"
         },
         {
            action : "titleCaptionClick",
            className : "ws-TabButtons__button",
            event : 'dblclick'
         }
      ],
      'titleClick' : function(tab) {
         var id = $(tab).data("tab-id");
         this.setCurrentTab(id);
      },
      titleCaptionClick : function(tab) {
         var self = this,
            id = $(tab).data("tab-id");
         var caption = prompt("Заголовок", $(tab).find('.ws-TabButtons__buttonTitle').text());
         if (caption !== '' && caption !== null && caption !== undefined) {
            var optionName = 'ws-config.items[' + this._getTabIndexById(id) + '].title';
            $ws.single.EventBus.channel("modelChange").notify("onComponentPropertyChanged", self.GDI, optionName, caption);
         }
      }
   }
});