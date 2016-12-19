define('js!SBIS3.CONTROLS.CompositeViewMixin', [
   'Core/constants',
   'html!SBIS3.CONTROLS.CompositeViewMixin',
   "Core/IoC",
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/CompositeItemsTemplate',
   'js!SBIS3.CONTROLS.Link'
], function(constants, dotTplFn, IoC, CompositeItemsTemplate) {
   'use strict';
   /**
    * Миксин добавляет функционал, который позволяет контролу устанавливать режимы отображения элементов коллекции по типу "Таблица", "Плитка" и "Список".
    * @mixin SBIS3.CONTROLS.CompositeViewMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var canServerRenderOther = function(cfg) {
      return !(cfg.itemTemplate || cfg.listTemplate || cfg.tileTemplate)
   },
   buildTplArgs = function(cfg) {
      var parentOptions = cfg._buildTplArgsDG(cfg);
      if ((cfg.viewMode == 'list') || (cfg.viewMode == 'tile')) {
         parentOptions.image = cfg.imageField;
         parentOptions.description = cfg.displayField;

      }
      return parentOptions;
   };
   var MultiView = /** @lends SBIS3.CONTROLS.CompositeViewMixin.prototype */{
      _dotTplFn : dotTplFn,
      $protected: {
         _tileWidth: null,
         _folderWidth: null,
         _options: {
            _canServerRender: true,
            _canServerRenderOther : canServerRenderOther,
            _compositeItemsTemplate : CompositeItemsTemplate,
            _buildTplArgs : buildTplArgs,
            /**
             * @cfg {String} Устанавливает режим отображения элементов коллекции
             * @variant table Режим отображения "Таблица"
             * @variant list Режим отображения "Список"
             * @variant tile Режим отображения "Плитка"
             */
            viewMode : 'table',
            /**
             * @cfg {String} Устанавливает файловое поле элемента коллекции, которое предназначено для хранения изображений.
             * @remark
             * Файловое поле используется в шаблоне для построения отображения элементов коллекции.
             * Использование опции актуально для режимов отображения "Список" и "Плитка".
             * Если для этих режимов используется пользовательский шаблон (задаётся опциями {@link listTemplate} и {@link tileTemplate}), то опция также неактуальна.
             * @see SBIS3.CONTROLS.DSMixin#displayField
             * @see tileTemplate
             * @see listTemplate
             */
            imageField : null,
            /**
             * @cfg {String} Шаблон отображения строки в режиме "Список".
             * В шаблоне допускается использование директив шаблонизатора для доступа к значениям полей текущей записи.
             * Шаблоны представляют собой обычные XHTML-файлы, которые помещают рядом с компонентом в директории resources.
             * @example
             * Шаблон для отображения только картинки, наименования и идентификатора.
             * <pre>
             *    <div>
             *       <img class="docs-MyCompositeView__list-image" src="{{=it.item.get('Изображение')}}" />
             *       <div class="docs-MyCompositeView__list-title">{{=it.item.get('Наименование')}}</div>
             *       <div class="docs-MyCompositeView__list-id">{{=it.item.get('@СписокИмущества')}}</div>
             *    </div>
             * </pre>
             * @see tileTemplate
             * @see SBIS3.CONTROLS.ListView#itemTemplate
             */
            listTemplate : null,
            /**
             * @cfg {String} Шаблон отображения строки в режиме "Плитка".
             * В шаблоне допускается использование директив шаблонизатора для доступа к значениям полей текущей записи.
             * Шаблоны представляют собой обычные XHTML-файлы, которые помещают рядом с компонентом в директории resources.
             * @example
             * Шаблон для отображения только картинки, наименования и идентификатора.
             * <pre>
             *    <div>
             *       <img class="docs-MyCompositeView__tile-image" src="{{=it.item.get('Изображение')}}" />
             *       <div class="docs-MyCompositeView__tile-title">{{=it.item.get('Наименование')}}</div>
             *       <div class="docs-MyCompositeView__tile-id">{{=it.item.get('@СписокИмущества')}}</div>
             *    </div>
             * </pre>
             * @see listTemplate
             * @see SBIS3.CONTROLS.ListView#itemTemplate
             */
            tileTemplate : null
         }
      },

      $constructor: function() {
         this._drawViewMode(this._options.mode);
         this._container.addClass('controls-CompositeView-' + this._options.viewMode);
         var self = this;

         this.subscribe('onDrawItems', function(){
            if (self._options.viewMode == 'tile'){
               self._calculateTileWidth();
            }
         });
         //TODO:Нужен какой то общий канал для ресайза окна
         $(window).bind('resize', function(){
            if (self._options.viewMode == 'tile'){
               self._calculateTileWidth();
            }
         });

         if (this._options.tileTemplate) {
            IoC.resolve('ILogger').log('CompositeView', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Задан tileTemplate');
         }
         if (this._options.listTemplate) {
            IoC.resolve('ILogger').log('CompositeView', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Задан listTemplate');
         }
      },
      _updateHeadAfterInit: function() {
         this._redrawHead();
      },
      /**
       * Устанавливает режим отображения данных.
       * @param {String} mode Режим отображения данных: table (таблица), list (список) и tile (плитка).
       * Подробнее о каждом режиме отображения вы можете прочитать в описании к опции {@link viewMode}.
       * @see viewMode
       * @see getViewMode
       */
      setViewMode: function(mode) {
         var dragndrop = this.getItemsDragNDrop();
         this.setItemsDragNDrop(false);
         this._options.viewMode = mode;
         this.setItemsDragNDrop(dragndrop);
         this._options.openedPath = {};
         this._drawViewMode(mode);
      },
      /**
       * Возвращает признак, по которому можно определить установленный режим отображения данных.
       * @returns {String} Режим отображения данных: table (таблица), list (список) и tile (плитка).
       * Подробнее о каждом режиме отображения вы можете прочитать в описании к опции {@link viewMode}.
       * @see viewMode
       * @see setViewMode
       */
      getViewMode: function(){
         return this._options.viewMode;
      },

      _drawViewMode : function(mode) {
         this._container.toggleClass('controls-CompositeView-table', mode == 'table')
                        .toggleClass('controls-CompositeView-list', mode == 'list')
                        .toggleClass('controls-CompositeView-tile', mode == 'tile');
         if (this._options.viewMode == 'table') {
            $('.controls-DataGridView__table', this._container.get(0)).removeClass('ws-hidden');
            $('.controls-CompositeView__itemsContainer', this._container.get(0)).addClass('ws-hidden');
         }
         else {
            $('.controls-CompositeView__itemsContainer', this._container.get(0)).removeClass('ws-hidden');
            $('.controls-DataGridView__table', this._container.get(0)).addClass('ws-hidden');
         }
      },
      _isAllowInfiniteScroll : function(){
         var allow = this._allowInfiniteScroll && (this._options.viewMode === 'table' || !this._options.showPaging);
         //TODO сделать красивее. тут отключать индикатор - это костыль
         if (!allow){
            this._hideLoadingIndicator();
         }
         return allow;
      },
      _calculateTileWidth: function(){
         var itemsContainer = this._getItemsContainer(),
            tiles = $('.controls-CompositeView__tileItem:not(.controls-ListView__item-type-node)', itemsContainer),
            folders = $('.controls-ListView__type-true', itemsContainer);
         if (!this._tileWidth) {
            this._tileWidth = $(tiles[0]).width();
         }
         if (!this._folderWidth) {
            this._folderWidth = $(folders[0]).width();
         }
         this._calcWidth(tiles, this._tileWidth);
         this._calcWidth(folders, this._folderWidth);
      },

      _calcWidth: function(tiles, oldWidth){
         if (tiles.length){
            var itemsContainerWidth =  this._getItemsContainer().outerWidth(),
               tilesCount = Math.floor(itemsContainerWidth / oldWidth),
               newTileWidth = itemsContainerWidth / tilesCount;

            if (itemsContainerWidth - tiles.length * oldWidth < oldWidth) {
               tiles.outerWidth(newTileWidth);
            }
         }
      },

      around : {
         _getItemTemplate: function(parentFnc, itemProj) {
            var resultTpl, dotTpl, item = itemProj.getContents();
            switch (this._options.viewMode) {
               case 'table':
                  resultTpl = parentFnc.call(this, itemProj);
                  break;
               case 'list':
                  {
                     if (this._options.listTemplate) {
                        dotTpl = this._options.listTemplate;
                     } else {
                        dotTpl = '<div style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply(it.item.get(it.description))}}</div>';
                     }
                     resultTpl = dotTpl;
                     break;
                  }
               case 'tile':
                  {
                     if (this._options.tileTemplate) {
                        dotTpl = this._options.tileTemplate;
                     } else {
                        var src;
                        if (!item.get(this._options.imageField)) {
                           src = constants.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultItem.png';
                        } else {
                           src = '{{=it.item.get(it.image)}}';
                        }
                        dotTpl = '<div class="controls-CompositeView__verticalItemActions js-controls-CompositeView__verticalItemActions"><div class="controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox"></div><img class="controls-CompositeView__tileImg" src="' + src + '"/><div class="controls-CompositeView__tileTitle" style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply(it.item.get(it.description))}}</div></div>';
                     }
                     resultTpl = dotTpl;
                     break;
                  }

            }
            return resultTpl;
         },


         _buildTplArgs : function(parentFnc, item) {
            var parentOptions = parentFnc.call(this, item);
            if ((this._options.viewMode == 'list') || (this._options.viewMode == 'tile')) {
               parentOptions.image = this._options.imageField;
               parentOptions.description = this._options.displayField;
            }
            return parentOptions;
         },

         expandNode: function(parentFunc, key) {
            if(this.getViewMode() === 'table') {
               parentFunc.call(this, key);

            }
         },

         collapseNode: function(parentFunc, key) {
            if(this.getViewMode() === 'table') {
               parentFunc.call(this, key);
            }
         },

         _getItemsContainer: function(parentFnc){
            if (this._options.viewMode == 'table') {
               return parentFnc.call(this);
            }
            else {
               return $('.controls-CompositeView__itemsContainer', this._container.get(0));
            }
         },

         _addItemAttributes: function (parentFnc, container, key) {
            switch (this._options.viewMode) {
               case 'list': container.addClass('controls-CompositeView__listItem'); break;
               case 'tile': container.addClass('controls-CompositeView__tileItem'); break;
            }
            parentFnc.call(this, container, key);
         },

         //TODO заглушка для CompositeView
         _isSlowDrawing: function(parentFnc, easy) {
            var flag = parentFnc.call(this, easy);
            if (this._options.viewMode == 'list') {
               if (this._options.listTemplate) {
                  flag = true;
               }
            }

            if (this._options.viewMode == 'tile') {
               if (this._options.tileTemplate) {
                  flag = true;
               }
            }
            return flag;
         },

         /**
          * Устанавливает Шаблон отображения строки в режиме "Список".
          * @see listTemplate
          */
         setListTemplate : function(tpl) {
            this._options.listTemplate = tpl;
         },


         /**
         * Устанавливает Шаблон отображения строки в режиме "Плитка".
         * @see tileTemplate
         */
         setTileTemplate : function(tpl) {
            this._options.tileTemplate = tpl;
         }
      }

   };

   return MultiView;

});