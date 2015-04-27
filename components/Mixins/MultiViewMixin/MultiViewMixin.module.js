define('js!SBIS3.CONTROLS.MultiViewMixin', ['html!SBIS3.CONTROLS.MultiViewMixin'], function(dotTplFn) {
   'use strict';

   var MultiView = {
      _dotTplFn : dotTplFn,
      $protected: {
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

      around : {
         _getItemTemplate: function(parentFnc, item) {
            var resultTpl, dotTpl;
            switch (this._options.viewMode) {

               case 'table': resultTpl = parentFnc.call(this, item); break;
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


         _getItemsContainer: function(parentFnc){
            if (this._options.viewMode == 'table') {
               return parentFnc.call(this);
            }
            else {
               return $('.controls-MultiView__itemsContainer', this._container.get(0));
            }
         },

         _addItemAttributes: function (parentFnc, container, key) {
            switch (this._options.viewMode) {
               case 'list': container.addClass('controls-MultiView__listItem'); break;
               case 'tile': container.addClass('controls-MultiView__tileItem'); break;
            }
            parentFnc.call(this, container, key);
         }
      }

   };

   return MultiView;

});