define('js!SBIS3.CONTROLS.RichEditorToolbar/resources/handlers',
   [],

   function () {
      'use strict';

      var onButtonClick = function() {
         this.getParent()._execCommand(this._options.name);
      };

      return {
         undo: onButtonClick,
         redo: onButtonClick,
         styles: function () {
            this.getParent()._openStylesPanel(this);
         },
         style: function (e, key) {
            this.getParent()._setFontStyle(key);
         },
         bold: onButtonClick,
         italic: onButtonClick,
         underline: onButtonClick,
         strikethrough: onButtonClick,
         mceBlockQuote: onButtonClick,
         align: function (event, key) {
            this.getParent()._setTextAlign(key);
         },
         color: function (event, key) {
            this.getParent()._setFontColor(key);
         },
         list: function (event, key) {
            this.getParent()._execCommand(key);
         },
         link: function () {
            this.setChecked(true);
            this.getParent()._insertLink(function(){
               this.setChecked(false);
            }.bind(this), this._container);
         },
         unlink: onButtonClick,
         image: function() {
            this.getParent()._openImagePanel(this);
         },
         smile: function (event, key) {
            this.getParent()._insertSmile(key);
         },
         paste: function (event, key) {
            this.getParent()._pasteFromBufferWithStyles(false, this._container, key === 'style');
         },
         source: function () {
            this.getParent()._toggleContentSource();
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
         },
         codesample: function () {
            this.getParent()._codeSample(this);
         }
      };
   }
);