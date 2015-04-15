define('js!SBIS3.CONTROLS.MultiView', ['js!SBIS3.CONTROLS.DataGrid', 'html!SBIS3.CONTROLS.MultiView'], function(DataGrid, dotTpl) {
   'use strict';

   var MultiView = DataGrid.extend(/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      $protected: {
         _dotTplFn : dotTpl,
         _options: {
            /**
             * @cfg {Object} Режим отображения
             * @variant table таблица
             * @variant list список
             * @variant tile плитка
             */
            viewMode : 'table',

            descriptionField : null,

            imageField : null,

            listTemplate : null,
            tileTemplate : null
         }
      },

      $constructor: function() {
         this._drawViewMode(this._options.mode);
      },

      setViewMode: function(mode) {
         this._options.viewMode = mode;
         this._drawViewMode(mode);
         this._redraw();
      },

      _drawViewMode : function(mode) {
         if (this._options.viewMode == 'table') {
            $('.controls-DataGrid__table', this._container.get(0)).removeClass('ws-hidden');
            $('.controls-MultiView__itemsContainer', this._container.get(0)).addClass('ws-hidden');
         }
         else {
            $('.controls-MultiView__itemsContainer', this._container.get(0)).removeClass('ws-hidden');
            $('.controls-DataGrid__table', this._container.get(0)).addClass('ws-hidden');
         }
      },

      _getItemTemplate: function(item) {
         var resultTpl;
         switch (this._options.viewMode) {

            case 'table': resultTpl = MultiView.superclass._getItemTemplate.apply(this, arguments); break;
            case 'list': {
               if (this._options.listTemplate) {
                  dotTpl = doT.template(this._options.itemTemplate)
               }
               else {
                  dotTpl = doT.template('<div>{{=it.item.get(it.field)}}</div>')
               }
               resultTpl = dotTpl({item : item, field : this._options.descriptionField});
               break;
            }
            case 'tile' : {
               if (this._options.tileTemplate) {
                  dotTpl = doT.template(this._options.tileTemplate)
               }
               else {
                  dotTpl = doT.template('<div><img class="controls-MultiView__tileImg" src="{{=it.item.get(it.image)}}"/><div class="controls-MultiView__tileText">{{=it.item.get(it.field)}}</div></div>')
               }
               resultTpl = dotTpl({item : item, field : this._options.descriptionField, image : this._options.imageField});
               break;
            }

         }
         return resultTpl;
      },

      _getItemsContainer: function(){
         if (this._options.viewMode == 'table') {
            return MultiView.superclass._getItemsContainer.apply(this, arguments);
         }
         else {
            return $('.controls-MultiView__itemsContainer', this._container.get(0));
         }
      },

      _addItemClasses: function (container, key) {
         switch (this._options.viewMode) {
            case 'list': container.addClass('controls-MultiView__listItem'); break;
            case 'tile': container.addClass('controls-MultiView__tileItem'); break;
         }
         MultiView.superclass._addItemClasses.apply(this, arguments);
      }

   });

   return MultiView;

});