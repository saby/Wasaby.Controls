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
         }
      };
   }
);