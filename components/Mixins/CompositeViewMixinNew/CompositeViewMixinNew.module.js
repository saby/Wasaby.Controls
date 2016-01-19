define('js!SBIS3.CONTROLS.CompositeViewMixinNew', ['html!SBIS3.CONTROLS.DataGridControl.DataGridView', 'html!SBIS3.CONTROLS.ListControl.View'], function(DataGridViewTemplate, ListViewTemplate) {
   'use strict';
   /**
    * Позволяет контролу отображать данные в виде плитки/списка/таблицы
    * @mixin SBIS3.CONTROLS.CompositeViewMixin
    */
   var CompositeViewMixin = {
      $protected: {
         _tileWidth: null,
         _folderWidth: null,
         _options: {
            /**
             * @cfg {Object} Режим отображения
             * @variant table таблица
             * @variant list список
             */
            viewMode: 'table',

            imageField: null,
            listTemplate: null
         }
      },

      $constructor: function() {

      },

      setViewMode: function(mode) {
         this._options.viewMode = mode;
         this._drawViewMode(mode);
      },

      getViewMode: function() {
         return this._options.viewMode;
      },

      _getItemTemplateSelector: function(){
         var self = this;
         return function(){
            var template;
            switch(self.getViewMode()) {
               case 'list': 
                  template = self._options.listTemplate;
                  break;
               case 'table':
                  template = self._options.itemTemplate;
                  break;
               case 'tile':
                  template = self._options.tileTemplate;
            } 
            return template;
         };
      },

      _drawViewMode: function(mode){
         this._container.toggleClass('controls-CompositeView-table', mode == 'table')
                        .toggleClass('controls-CompositeView-list', mode == 'list')
                        .toggleClass('controls-CompositeView-tile', mode == 'tile');
         
         if (mode == 'table'){
            this._getView().setTemplate(DataGridViewTemplate);
         } else {
            this._getView().setTemplate(ListViewTemplate);
         }
      },

      around: {
         _getViewTemplate: function (parentFunc) {
            if (this._options.viewMode == 'table'){
               return parentFunc.call(this);
            } else {
               return ListViewTemplate;
            }
         }
      }

   };

   return CompositeViewMixin;

});