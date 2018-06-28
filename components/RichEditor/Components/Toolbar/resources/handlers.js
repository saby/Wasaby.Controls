define('SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/handlers',
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
         blockquote: onButtonClick,
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
         checkImageLoader: function(){
            this.getParent()._checkImageLoader(this);
         },
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
         codesample: function () {
            this.getParent()._codeSample(this);
         }
      };
   }
);