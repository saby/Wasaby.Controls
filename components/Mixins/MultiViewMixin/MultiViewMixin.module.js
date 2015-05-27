define('js!SBIS3.CONTROLS.MultiViewMixin', ['html!SBIS3.CONTROLS.MultiViewMixin', 'html!SBIS3.CONTROLS.MultiViewMixin/resources/MultiView__folderTpl'], function(dotTplFn, folderTpl) {
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

            imageField : null,
            listTemplate : null,
            tileTemplate : null
         }
      },

      $constructor: function() {
         this._drawViewMode(this._options.mode);
         this._container.addClass('controls-MultiView-' + this._options.viewMode);
      },

      setViewMode: function(mode) {
         this._options.viewMode = mode;
         this._drawViewMode(mode);
      },

      getViewMode: function(){
         return this._options.viewMode;
      },

      _drawViewMode : function(mode) {
         this._container.toggleClass('controls-MultiView-table', mode == 'table')
                        .toggleClass('controls-MultiView-list', mode == 'list')
                        .toggleClass('controls-MultiView-tile', mode == 'tile');
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
                  if (item.get(this._options.hierField + '@')) {
                     dotTpl = folderTpl;
                  } else {
                     if (this._options.listTemplate) {
                        if (this._options.listTemplate instanceof Function) {
                           dotTpl = this._options.listTemplate;
                        } else {
                           dotTpl = doT.template(this._options.listTemplate);
                        }
                     }
                     else {
                        dotTpl = doT.template('<div>{{=it.item.get(it.description)}}</div>')
                     }
                  }
                  resultTpl = dotTpl({item : item, description : this._options.displayField, image : this._options.imageField});
                  break;
               }
               case 'tile' : {
                  if (item.get(this._options.hierField + '@')) {
                     dotTpl = folderTpl;
                  } else {
                     if (this._options.tileTemplate) {
                        if (this._options.tileTemplate instanceof Function) {
                           dotTpl = this._options.tileTemplate;
                        } else {
                           dotTpl = doT.template(this._options.tileTemplate);
                        }
                     }
                     else {
                        var src;
                        if (!item.get(this._options.imageField)) {
                           src = item.get(this._options.hierField + '@') ? $ws._const.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultFolder.png' : $ws._const.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/img/defaultItem.png';
                        } else {
                           src = '{{=it.item.get(it.image)}}'
                        }
                        dotTpl = doT.template('<div><div class="controls-ListView__itemCheckBox"></div><img class="controls-MultiView__tileImg" src="' + src + '"/><div class="controls-MultiView__tileTitle">{{=it.item.get(it.description)}}</div></div>')
                     }
                  }
                  resultTpl = dotTpl({item : item, description : this._options.displayField, image : this._options.imageField});
                  break;
               }

            }
            return resultTpl;
         },

         _getItemActionsPosition: function(parentFunc, item) {
            if (this._options.viewMode == 'table') {
               parentFnc.call(this, target);
            } else 
            return {
               top: item.position.top,
               right: this._container[0].offsetWidth - (item.position.left + item.size.width)
            };
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