define('js!SBIS3.CONTROLS.RichEditorRoundToolbar/resources/handlers',
   [],

   function () {
      'use strict';

      return {
         toggle: function () {
            this.getParent().toggleToolbar();
         },
         styles: function () {
            this.getParent()._openStylesPanel(this);
         },
         list: function (event, key) {
            this.getParent()._execCommand(key);
         },
         link: function () {
            this.getParent()._insertLink();
         },
         image: function (event, originalEvent) {
            this.getParent()._startFileLoad(this._container);
         },
         smile: function (event, key) {
            this.getParent()._insertSmile(key);
         },
         history: function (e, key) {
            this.getParent()._setText(this.getItems().getRecordById(key).get('value'));
         },
         openHistory: function(){
            //TODO Лениво подгружаем данные и имитируем клик по иконке для открытия пикера
            //Убрать костыль с выполнением задачи https://online.sbis.ru/opendoc.html?guid=34fb484f-ef6f-4ac8-8f2a-f7c99ab7b35c
            var toolbar = this.getParent();
            toolbar._initHistory(function(){
               toolbar.getItemInstance('history').showPicker();
            });
         }
      };
   }
);