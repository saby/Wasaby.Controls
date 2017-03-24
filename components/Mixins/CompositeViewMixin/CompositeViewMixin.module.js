define('js!SBIS3.CONTROLS.CompositeViewMixin', [
   'Core/constants',
   'Core/helpers/collection-helpers',
   'html!SBIS3.CONTROLS.CompositeViewMixin',
   'Core/IoC',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/CompositeItemsTemplate',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/TileTemplate',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/TileContentTemplate',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/ListTemplate',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/ListContentTemplate',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/ItemsTemplate',
   'html!SBIS3.CONTROLS.CompositeViewMixin/resources/InvisibleItemsTemplate',
   'Core/core-merge',
   'js!SBIS3.CONTROLS.Link'
], function(constants, collection, dotTplFn, IoC, CompositeItemsTemplate, TemplateUtil, TileTemplate, TileContentTemplate, ListTemplate, ListContentTemplate, ItemsTemplate, InvisibleItemsTemplate, cMerge) {
   'use strict';
   /**
    * Миксин добавляет функционал, который позволяет контролу устанавливать режимы отображения элементов коллекции по типу "Таблица", "Плитка" и "Список".
    * @mixin SBIS3.CONTROLS.CompositeViewMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var
       TILE_MODE = { // Возможные результаты режима отображения плитки
          DYNAMIC: 'dynamic', // плитка с изменяемой шириной
          STATIC: 'static' // плитка с постоянной шириной
       };
   var canServerRenderOther = function(cfg) {
      return !(cfg.itemTemplate || cfg.listTemplate || cfg.tileTemplate);
   },
   buildTplArgsComposite = function(cfg) {
      var parentOptions = cfg._buildTplArgsLV.call(this, cfg);
      if ((cfg.viewMode == 'list') || (cfg.viewMode == 'tile')) {
         var tileContentTpl, tileTpl, listContentTpl, listTpl;

         parentOptions.image = cfg.imageField;
         parentOptions.widthProperty = cfg.widthProperty;
         parentOptions.description = cfg.displayProperty;
         parentOptions.viewMode = cfg.viewMode;
         parentOptions._itemsTemplate = cfg._itemsTemplate;
         parentOptions.resourceRoot = constants.resourceRoot;
         parentOptions.tileMode =  cfg.tileMode;
         parentOptions.invisibleItemsTemplate = TemplateUtil.prepareTemplate(cfg._invisibleItemsTemplate);
         if (cfg.itemsHeight) {
            parentOptions.minWidth = cfg.itemsHeight / 1.4; //Формат A4
            parentOptions.maxWidth = cfg.itemsHeight * 1.5;
         }

         if (cfg.tileContentTpl) {
            tileContentTpl = cfg.tileContentTpl;
         }
         else {
            tileContentTpl = cfg._defaultTileContentTemplate;
         }
         parentOptions.tileContent = TemplateUtil.prepareTemplate(tileContentTpl);
         if (cfg.tileTpl) {
            tileTpl = cfg.tileTpl;
         }
         else {
            tileTpl = cfg._defaultTileTemplate;
         }
         parentOptions.tileTpl = TemplateUtil.prepareTemplate(tileTpl);
         parentOptions.defaultTileTpl = TemplateUtil.prepareTemplate(cfg._defaultTileTemplate);

         if (cfg.listContentTpl) {
            listContentTpl = cfg.listContentTpl;
         }
         else {
            listContentTpl = cfg._defaultListContentTemplate;
         }
         parentOptions.listContent = TemplateUtil.prepareTemplate(listContentTpl);
         if (cfg.listTpl) {
            listTpl = cfg.listTpl;
         }
         else {
            listTpl = cfg._defaultListTemplate;
         }
         parentOptions.listTpl = TemplateUtil.prepareTemplate(listTpl);
         parentOptions.defaultListTpl = TemplateUtil.prepareTemplate(cfg._defaultListTemplate);
      }
      return parentOptions
   },
   buildTplArgs = function(cfg) {
      var parentOptions = cfg._buildTplArgsDG(cfg);
      var myOptions = cfg._buildTplArgsComposite(cfg);
      cMerge(parentOptions, myOptions);
      return parentOptions;
   };
   var MultiView = /** @lends SBIS3.CONTROLS.CompositeViewMixin.prototype */{
      _dotTplFn : dotTplFn,
      $protected: {
         _tileWidth: null,
         _folderWidth: null,
         _options: {
            _defaultTileContentTemplate: TileContentTemplate,
            _defaultTileTemplate: TileTemplate,
            _defaultListContentTemplate: ListContentTemplate,
            _defaultListTemplate: ListTemplate,
            _invisibleItemsTemplate: InvisibleItemsTemplate,
            _canServerRender: true,
            _canServerRenderOther : canServerRenderOther,
            /*TODO для лечения тестов пришлось закоппипастить шаблон*/
            _itemsTemplate: ItemsTemplate,
            _compositeItemsTemplate : CompositeItemsTemplate,
            _buildTplArgs : buildTplArgs,
            _buildTplArgsComposite: buildTplArgsComposite,
            /**
             * @cfg {String} Устанавливает режим отображения элементов коллекции
             * @variant table Режим отображения "Таблица"
             * @variant list Режим отображения "Список"
             * @variant tile Режим отображения "Плитка"
             */
            viewMode : 'table',
            /**
             * @cfg {String} Устанавливает режим отображения в режиме плитки
             * @variant static
             * @variant dynamic
             */
            tileMode: '',
            /**
             * @cfg {String} Устанавливает файловое поле элемента коллекции, которое предназначено для хранения изображений.
             * @remark
             * Файловое поле используется в шаблоне для построения отображения элементов коллекции.
             * Использование опции актуально для режимов отображения "Список" и "Плитка".
             * Если для этих режимов используется пользовательский шаблон (задаётся опциями {@link listTemplate} и {@link tileTemplate}), то опция также неактуальна.
             * @see SBIS3.CONTROLS.DSMixin#displayProperty
             * @see tileTemplate
             * @see listTemplate
             */
            imageField : null,
            /**
             * @cfg {String} Устанавливает файловое поле элемента коллекции, которое предназначено для хранения ширины изображения.
             * @remark
             * Файловое поле используется для режима viewMode = tile и tileMode = dynamic.
             * @see viewMode
             * @see tileMode
             */
            widthProperty: null,
            /**
             * @cfg {Number} Высота элементов.
             * @remark
             * Необхоимо указывать для режима viewMode = tile и tileMode = dynamic.
             * @see viewMode
             * @see tileMode
             */
            itemsHeight: undefined,
            /**
             * @cfg {String} Шаблон отображения строки в режиме "Список".
             * @deprecated
             */
            listTemplate : null,
            /**
             * @cfg {String} Шаблон отображения строки в режиме "Плитка".
             * @deprecated
             */
            tileTemplate : null,
            /**
             * @cfg {String} Шаблон отображения внутреннего содержимого элемента в режиме "Плитка".
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
            tileContentTpl : null,
            /**
             * @cfg {String} Шаблон отображения элемента в режиме "Плитка".
             * Используется чтобы добавить атрибуты на элементы или полностью переопрделить шаблон
             * В шаблоне допускается использование директив шаблонизатора для доступа к значениям полей текущей записи.
             * Шаблоны представляют собой обычные XHTML-файлы, которые помещают рядом с компонентом в директории resources.
             * @example
             * Навешивание класса на элементы
             * <pre>
             *    {{it.className="myClass";}}{{=it.defaultTileTpl(it)}}
             * </pre>
             * @see listTemplate
             * @see SBIS3.CONTROLS.ListView#itemTemplate
             */
            tileTpl: null,
            /**
             * @cfg {String} Шаблон отображения внутреннего содержимого элемента в режиме "Список".
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
            listContentTpl : null,
            /**
             * @cfg {String} Шаблон отображения элемента в режиме "Список".
             * Используется чтобы добавить атрибуты на элементы или полностью переопрделить шаблон
             * В шаблоне допускается использование директив шаблонизатора для доступа к значениям полей текущей записи.
             * Шаблоны представляют собой обычные XHTML-файлы, которые помещают рядом с компонентом в директории resources.
             * @example
             * Навешивание класса на элементы
             * <pre>
             *    {{it.className="myClass";}}{{=it.defaultTileTpl(it)}}
             * </pre>
             * @see listTemplate
             * @see SBIS3.CONTROLS.ListView#itemTemplate
             */
            listTpl: null
         }
      },

      $constructor: function() {
         //this._drawViewMode(this._options.mode);
         this._container.addClass('controls-CompositeView-' + this._options.viewMode);

         this._calculateTileHandler = this._calculateTile.bind(this);
         this.subscribe('onDrawItems', this._calculateTileHandler);
         //TODO:Нужен какой то общий канал для ресайза окна
         $(window).bind('resize', this._calculateTileHandler);

         if (this._options.tileTemplate) {
            IoC.resolve('ILogger').log('CompositeView', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Задан tileTemplate');
         }
         if (this._options.listTemplate) {
            IoC.resolve('ILogger').log('CompositeView', 'Контрол ' + this.getName() + ' отрисовывается по неоптимальному алгоритму. Задан listTemplate');
         }
      },

      _calculateTile: function() {
         if (this._options.viewMode == 'tile' && !this._options.tileMode){
            this._calculateTileWidth();
         }
      },

      _setHoveredStyles: function(item) {
         if (item && !item.hasClass('controls-CompositeView__hoverStylesInit')) {
            this._calculateHoveredStyles(item);
            item.addClass('controls-CompositeView__hoverStylesInit');
         }
      },

      _calculateHoveredStyles: function(item) {
         if (this._options.tileMode === TILE_MODE.DYNAMIC) {
            this._setDynamicHoveredStyles(item);
         } else if (this._options.tileMode === TILE_MODE.STATIC && !this._container.hasClass('controls-CompositeView-tile__static-smallImage')) {
            this._setStaticHoveredStyles(item);
         }
      },

      _setDynamicHoveredStyles: function(item) {
         var
             margin,
             additionalWidth,
             additionalHeight;
         additionalWidth = item.outerWidth() / 2;
         margin = item.outerWidth(true) / 2 - additionalWidth;
         additionalHeight = item.outerHeight() / 2;
         item.css('padding', (additionalHeight / 2) + 'px ' + (additionalWidth / 2) + 'px').css('margin', '' + (-additionalHeight / 2) + 'px ' + (-(additionalWidth / 2 - margin)) + 'px');
      },

      _setStaticHoveredStyles: function(item) {
         var offset, margin;
         offset = $('.controls-CompositeView__tileTitle', item).outerHeight(true) - (item.hasClass('controls-CompositeView__item-withTitle') ? 25 : 0);
         margin = (item.outerHeight(true) - item.outerHeight()) / 2;
         item.css('padding-bottom', offset).css('margin-bottom', -(offset - margin));
         $('.controls-CompositeView__tileContainer', item).css('margin-bottom', offset);
      },

      _updateHeadAfterInit: function() {
         if (this._options.viewMode == 'table') {
            this._redrawTheadAndTfoot();
         }
      },
      /**
       * Устанавливает режим отображения данных.
       * @param {String} mode Режим отображения данных: table (таблица), list (список) и tile (плитка).
       * Подробнее о каждом режиме отображения вы можете прочитать в описании к опции {@link viewMode}.
       * @see viewMode
       * @see getViewMode
       */
      setViewMode: function(mode) {
         if (this._options.viewMode === mode) {
            return;
         }
         var dragndrop = this.getItemsDragNDrop();
         this.setItemsDragNDrop(false);
         this._options.viewMode = mode;
         this.setItemsDragNDrop(dragndrop);
         this._options.openedPath = {};
         this._drawViewMode(mode);
         this._notify('onViewModeChanged');
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

      _getItemsTemplate: function() {
         if (this._options.viewMode == 'table') {
            return this._options._itemsTemplate;
         }
         else {
            return TemplateUtil.prepareTemplate(this._options._compositeItemsTemplate);
         }
      },

      _drawViewMode : function(mode) {
         var tileMode = this._options.tileMode;
         this._container.toggleClass('controls-CompositeView-table', mode == 'table')
             .toggleClass('controls-CompositeView-list', mode == 'list')
             .toggleClass('controls-CompositeView-tile', mode == 'tile')
             .toggleClass('controls-CompositeView-tile__static', mode == 'tile' && tileMode == TILE_MODE.STATIC)
             .toggleClass('controls-CompositeView-tile__dynamic', mode == 'tile' && tileMode == TILE_MODE.DYNAMIC);
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
               parentOptions.description = this._options.displayProperty;
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

         destroy: function(parentFnc) {
            $(window).unbind('resize', this._calculateTileHandler);
            parentFnc.call(this);
         }
      }

   };
   MultiView.TILE_MODE = TILE_MODE;
   return MultiView;

});