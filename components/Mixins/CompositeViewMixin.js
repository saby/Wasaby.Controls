define('SBIS3.CONTROLS/Mixins/CompositeViewMixin', [
   'Core/constants',
   'Core/Deferred',
   'Core/compatibility',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/CompositeViewMixin',
   'Core/IoC',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/CompositeItemsTemplate',
   'SBIS3.CONTROLS/Utils/TemplateUtil',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/TileTemplate',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/TileContentTemplate',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/ListTemplate',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/ListContentTemplate',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/ItemsTemplate',
   'tmpl!SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/InvisibleItemsTemplate',
   'tmpl!SBIS3.CONTROLS/ListView/resources/GroupTemplate',
   'tmpl!SBIS3.CONTROLS/DataGridView/resources/GroupTemplate',
   'Core/core-merge',
   'Core/core-instance',
   'SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/DimensionsUtil',
   'SBIS3.CONTROLS/Link'
], function(constants, Deferred, coreCompatibility, dotTplFn, IoC, CompositeItemsTemplate, TemplateUtil, TileTemplate, TileContentTemplate, ListTemplate, ListContentTemplate,
            ItemsTemplate, InvisibleItemsTemplate, ListViewGroupTemplate, DataGridGroupTemplate, cMerge, cInstance, DimensionsUtil) {
   'use strict';
   /**
    * Миксин добавляет функционал, который позволяет контролу устанавливать режимы отображения элементов коллекции по типу "Таблица", "Плитка" и "Список".
    * @mixin SBIS3.CONTROLS/Mixins/CompositeViewMixin
    * @public
    * @author Крайнов Д.О.
    */
   var
       TILE_MODE = { // Возможные результаты режима отображения плитки
          DYNAMIC: 'dynamic', // плитка с изменяемой шириной
          STATIC: 'static' // плитка с постоянной шириной
       },
      HOVER_MODE = {
         OUTSIDE: 'outside',
         INSIDE: 'inside',
         FIXED: 'fixed'
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
            parentOptions.minWidth = Math.floor(cfg.itemsHeight / 1.4); //Формат A4
            parentOptions.maxWidth = Math.ceil(cfg.itemsHeight * 1.5);
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

         switch (cfg.viewMode) {
            case 'tile':
               parentOptions.itemTpl = TemplateUtil.prepareTemplate(tileTpl);
               break;
            case 'list':
               parentOptions.itemTpl = TemplateUtil.prepareTemplate(listTpl);
               break;
         }
      }
      return parentOptions
   },
   buildTplArgs = function(cfg) {
      var parentOptions = cfg._buildTplArgsDG(cfg);
      var myOptions = cfg._buildTplArgsComposite(cfg);
      cMerge(parentOptions, myOptions);
      return parentOptions;
   },
   getGroupTemplate = function(cfg) {
      if (cfg.viewMode === 'table') {
         return DataGridGroupTemplate;
      }
      return ListViewGroupTemplate;
   };
   var MultiView = /** @lends SBIS3.CONTROLS/Mixins/CompositeViewMixin.prototype */{
       /**
        * @event onViewModeChanged Происходит при изменении режима отображения {@link mode}.
        * @param {Core/EventObject} Дескриптор события.
        */
      _dotTplFn : dotTplFn,
      $protected: {
         _tileWidth: null,
         _folderWidth: null,
         _options: {
            _getGroupTemplate: getGroupTemplate,
            _ListViewGroupTemplate: ListViewGroupTemplate,
            _DataGridGroupTemplate: DataGridGroupTemplate,
            _defaultTileContentTemplate: TileContentTemplate,
            _defaultTileTemplate: TileTemplate,
            _defaultListContentTemplate: ListContentTemplate,
            _defaultListTemplate: ListTemplate,
            _invisibleItemsTemplate: InvisibleItemsTemplate,
            _canServerRender: true,
            _canServerRenderOther : canServerRenderOther,
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
             * @cfg {String} Устанавливает отображение плитки по ховеру
             * @remark
             * Использование опции актуально для режима отображения {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/tiles/ "Плитка"}.
             * В зависимости от значения опции ширина плитки может меняться или оставаться неизменной при наведении на нее курсора.
             * @variant static ширина плитки остается неизменной.
             * @variant dynamic ширина плитки меняется.
             * @see viewNode
             */
            tileMode: '',
            /**
             * @cfg {String} Устанавливает режим расширения по ховеру
             * Использование опции актуально при режиме изменения ширины по ховеру элемента
             * @variant inside Ширина плитки увеличивается внутрь контейнера
             * @variant outside Ширина плитки увеличивается относительно центра элемента
             * @variant fixed Ширина плитки увеличивается относительно центра элемента. Данный режим используется когда
             * компонент обёрнут в SBIS3.CONTROLS.ScrollContainer и необходимо, чтобы при увеличении элементов,
             * они были видны за пределами SBIS3.CONTROLS.ScrollContainer. Для корректной работы опций записи, необходимо
             * так же установить опции itemsActionsInItemContainer {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/ListView/options/itemsActionsInItemContainer/} значение true.
             */
            hoverMode: '',
            /**
             * @cfg {String} Устанавливает файловое поле элемента коллекции, которое предназначено для хранения изображений.
             * @remark
             * Файловое поле используется в шаблоне для построения отображения элементов коллекции.
             * Использование опции актуально для режимов отображения "Список" и "Плитка".
             * Если для этих режимов используется пользовательский шаблон (задаётся опциями {@link listTemplate} и {@link tileTemplate}), то опция также неактуальна.
             * @see SBIS3.CONTROLS/Mixins/DSMixin#displayProperty
             * @see tileTemplate
             * @see listTemplate
             */
            imageField: null,
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
             * @deprecated Используйте опции {@link listContentTpl} или {@link listTpl}.
             */
            listTemplate : null,
            /**
             * @cfg {String} Шаблон отображения строки в режиме "Плитка".
             * @deprecated Используйте опции {@link tileContentTpl} или {@link tileTpl}.
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
             * @see SBIS3.CONTROLS/ListView#itemTemplate
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
             * @see SBIS3.CONTROLS/ListView#itemTemplate
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
             * @see SBIS3.CONTROLS/ListView#itemTemplate
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
             * @see SBIS3.CONTROLS/ListView#itemTemplate
             */
            listTpl: null
         }
      },

      $constructor: function() {
         //this._drawViewMode(this._options.mode);
         this._container.addClass('controls-CompositeView-' + this._options.viewMode);

         this._calculateTileHandler = this._calculateTile.bind(this);
         this.subscribeTo(this, 'onDrawItems', this._calculateTileHandler);
   
         //TODO:Нужен какой то общий канал для ресайза окна
         $(window).bind('resize', this._calculateTileHandler);
         this.subscribe('onAfterVisibilityChange', this._calculateTileHandler);
         if (this._options.hoverMode === HOVER_MODE.FIXED) {
            this._onScrollHandler = this._resetFixedItem.bind(this, true);
            //Все нижеперечисленные костыли, должны быть реализованы в композиции scrollContainer и плитки, но т.к.
            //до выпуска 3.18.310 осталось 2 дня, сами ищем scrollContainer сверху, и делаем с ним всё необходимое.
            this._scrollContainer = this._container.closest('.controls-ScrollContainer__content');
            this._scrollContainer.on('scroll', this._onScrollHandler);
            this._scrollContainer.css({
               'z-index': 'auto',//иначе блоки скролл контейнера(скроллбар, тени сверху и снизу) перекрывают расширяющуюся плитку
               'transform': 'none'//в ie навешен стиль transform: scale(1), который создаёт контекст позиционирования, и не даёт
                                  //показывать элементы за пределами, даже если он position: fixed(https://jsfiddle.net/hp6qbLcs/10/)
            });
         }
         
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
         if (this._options.hoverMode === HOVER_MODE.FIXED) {
            this._resetFixedItem(true);
         }
      },

      _setHoveredStyles: function(item) {
         if (!item && this._options.hoverMode === HOVER_MODE.FIXED) {
            this._resetFixedItem();
         } else if (item) {
            this._calculateHoveredStyles(item);
            this._hasItemsActions().addCallback(function(hasItemsActions) {
               item.toggleClass('controls-CompositeView__item-withoutItemsAction', !hasItemsActions);
            });
         }
      },

      _hasItemsActions: function() {
         var
            result,
            itemsActions = this.getItemsActions();

         if (itemsActions) {
            result = itemsActions.ready().addCallback(function() {
               return !!itemsActions.hasVisibleActions();
            });
         } else {
            result = Deferred.success(false);
         }

         return result;
      },

      _calculateHoveredStyles: function(item) {
         if (this._options.tileMode === TILE_MODE.DYNAMIC) {
            if (this._options.hoverMode === HOVER_MODE.FIXED) {
               this._setFixedHoveredStyles(item);
            } else {
               this._resetHoveredStyles(item);
               this._setDynamicHoveredStyles(item);
            }
         } else if (this._options.tileMode === TILE_MODE.STATIC && !this._container.hasClass('controls-CompositeView-tile__static-smallImage')) {
            if (this._options.hoverMode === HOVER_MODE.FIXED) {
               this._setFixedHoveredStyles(item);
            } else {
               this._resetHoveredStyles(item);
               this._setStaticHoveredStyles(item);
            }
         }
      },

      _setFixedHoveredStyles: function(item) {
         if (!this._fixedItem || this._fixedItem.item[0] !== item[0]) {
            item.removeClass('controls-CompositeView__resetHoveredStyle');
            this._resetHoveredStyles(item);
            this[this._options.tileMode === TILE_MODE.DYNAMIC ? '_setDynamicHoveredStyles' : '_setStaticHoveredStyles'](item);
         }
      },

      _setDynamicHoveredStyles: function(item) {
         var styles;
         if (this._options.hoverMode === HOVER_MODE.INSIDE) {
            styles = DimensionsUtil.calcInsideDimensions(item, this._getItemsContainer());
         } else {
            styles = DimensionsUtil.calcOutsideDimensions(item);
         }

         if (this._options.hoverMode === HOVER_MODE.FIXED) {
            //На старых страницах больше ниоткуда не взять динамическое значение isTouch при работе с компьютером
            //и телевизором одновременно.
            if (document.body.className.indexOf('ws-is-touch') === -1) {
               this._createFixedItem(item, styles);
            }
         } else {
            this._setDynamicStyles(item, styles);
         }
      },

      _setDynamicStyles: function(item, styles) {
         item.css(styles);
         var titleHeight = $('.controls-CompositeView__tileTitle', item).outerHeight(true) - (item.hasClass('controls-CompositeView__item-withTitle') ? 26 : 0);
         $('.controls-CompositeView__tileContainer', item).css('padding-bottom', titleHeight);
      },

      _createFixedItem: function(item, styles) {
         var
            position,
            itemClone;

         this._resetFixedItem();

         if (!this._fixedItem) {
            position = this._getPositionForFixedItem(item);

            if (position) {
               itemClone = item.clone();
               itemClone.empty();
               itemClone.insertAfter(item);

               this._setDynamicStyles(item, styles);
               item.css(position).css({
                  position: 'fixed',
                  width: item.width()
               });
               item.addClass('controls-CompositeView__tileItem-fixed');
               item.on('wheel', function() {
                  item.addClass('controls-CompositeView__resetHoveredStyle');
                  this._resetFixedItem(true);
               }.bind(this));

               this._fixedItem = {
                  item: item,
                  clone: itemClone
               };
            } else {
               item.addClass('controls-CompositeView__resetHoveredStyle');
            }
         }
      },

      _getPositionForFixedItem: function(item) {
         var
            result,
            margin = DimensionsUtil.getMargin(item),
            parenRect = item.closest('.controls-ScrollContainer')[0].getBoundingClientRect(),
            itemRect = item[0].getBoundingClientRect(),
            maxOuterHeight = itemRect.height / 3;

         if ((itemRect.top - parenRect.top) > -maxOuterHeight && (itemRect.bottom -  parenRect.bottom) < maxOuterHeight) {
            result = {
               left: itemRect.left - margin,
               top: itemRect.top - margin
            };
         }

         return result;
      },

      _resetFixedItem: function(force) {
         var item;
         if (this._fixedItem) {
            item = this._fixedItem.item;
            if (!item.hasClass('controls-ItemActions__activeItem') || force) {
               item.css({ position: 'relative', width: 'auto', left: '', top: '' }).removeClass('controls-CompositeView__tileItem-fixed').off('wheel');
               this._fixedItem.clone.remove();
               this._fixedItem = null;
            } else {
               var menu = this._itemsToolbar && this._itemsToolbar.getItemsActions()._itemActionsMenu;
               if (menu) {
                  this.subscribeTo(menu, 'onClose', this._onItemActionsMenuClose.bind(this));
               }
            }
         }
      },

      _onItemActionsMenuClose: function() {
         var
            hoveredItem = this.getHoveredItem(),
            hoveredItemContainer = hoveredItem && hoveredItem.container,
            isFixedOnHover = hoveredItemContainer && this._fixedItem && hoveredItemContainer[0] === this._fixedItem.item[0];

         if (!isFixedOnHover) {
            this._resetFixedItem();
         }
      },

      _setStaticHoveredStyles: function(item) {
         var
            boundingClientRect = item.get(0).getBoundingClientRect(),
            offset = $('.controls-CompositeView__tileTitle', item).outerHeight(true) - (item.hasClass('controls-CompositeView__item-withTitle') ? 26 : 0),
            margin = (Math.floor(item.outerHeight(true)) - Math.floor(boundingClientRect.height)) / 2,
            styles = {
               'padding-bottom': offset,
               'margin-bottom': -(offset - margin)
            };

         if (this._options.hoverMode === HOVER_MODE.FIXED) {
            if (!coreCompatibility.touch) {
               this._createFixedItem(item, styles);
            }
         } else {
            this._setDynamicStyles(item, styles);
         }
      },

      _resetHoveredStyles: function(item) {
         //Сбрасываем установленные ранее стили для ховера, т.к. элемент мог измениться и перерисоваться.
         item.css('padding', '').css('margin', '');
         $('.controls-CompositeView__tileContainer', item).css('padding', '').css('margin', '');
      },

      _updateHeadAfterInit: function() {
         if (this._options.viewMode == 'table') {
            this._redrawTheadAndTfoot();
            //В плиточных представлениях шапка перерисовывается дополнительно, в ней надо оживить компоненты
            //if проверка - для перестраховки
            if (this._thead) {
               this.reviveComponents(this._thead);
            }
         }
      },
      /**
       * Устанавливает режим отображения данных.
       * @param {String} mode Режим отображения данных: table (таблица), list (список) и tile (плитка).
       * Подробнее о каждом режиме отображения вы можете прочитать в описании к опции {@link viewMode}.
       * При изменении режима происходит событие {@link onViewModeChanged}.
       * @see viewMode
       * @see getViewMode
       * @see onViewModeChanged
       */
      setViewMode: function(mode) {
         if (this._options.viewMode === mode) {
            return;
         }
         var dragndrop = this.getItemsDragNDrop();
         this.setItemsDragNDrop(false);
         this._options.viewMode = mode;
         this.setItemsDragNDrop(dragndrop);
         this._drawViewMode(mode);
         if (mode === 'table') {
            this._updateAjaxLoaderPosition();
         }
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
             .toggleClass('controls-CompositeView-tile__dynamic', mode == 'tile' && tileMode == TILE_MODE.DYNAMIC)
             .toggleClass('controls-CompositeView-tile__new', mode == 'tile' && !!tileMode)
             .toggleClass('controls-CompositeView-tile__old', mode == 'tile' && !tileMode);
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
            folders = $('.controls-ListView__item-type-node', itemsContainer);
         if (!this._tileWidth) {
            this._tileWidth = $(tiles[0]).outerWidth(true);
         }
         if (!this._folderWidth) {
            this._folderWidth = $(folders[0]).outerWidth(true);
         }
         this._calcWidth(tiles, this._tileWidth);
         this._calcWidth(folders, this._folderWidth);
      },

      _calcWidth: function(tiles, oldWidth){
         if (tiles.length){
            var itemsContainerWidth =  Math.floor(this._getItemsContainer()[0].getBoundingClientRect().width),
               tilesCount = Math.floor(itemsContainerWidth / oldWidth),
               newTileWidth = itemsContainerWidth / tilesCount;

            tiles.outerWidth(newTileWidth, true);
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

      _hasInvisibleItems: function() {
         return this._options.viewMode === 'tile' && this._options.tileMode === TILE_MODE.STATIC;
      },

      after: {
         _modifyOptions: function(options) {
            //_modifyOptions в ListView сбрасывает значение опции itemsActionsInItemContainer в false если это ie.
            //Сбрасывается значение, для оптимизации и багов с табличной вёрсткой(tr, td). В случае плитки
            //табличной вёрстки нет, и мы можем выставить itemsActionsInItemContainer в true, для того,
            //чтбы при увеличении плитки за пределы overflow: hidden; опции записи были видны.
            if (options.hoverMode === HOVER_MODE.FIXED) {
               options.itemsActionsInItemContainer = true;
            }
            return options;
         }
      },

      around : {
         _getInsertMarkupConfig: function(parentFn, newItemsIndex, newItems, prevDomNode) {
            var result;
            if (this._options.viewMode === 'table') {
               result = parentFn.call(this, newItemsIndex, newItems, prevDomNode);
            } else {
               result = this._getInsertMarkupConfigICM.call(this, newItemsIndex, newItems, prevDomNode);
               //При добавлении элементов в конец списка, если там присутствуют пустышки для плитки, то элементы надо встаить
               //до этих пустышек, иначе образуется пустое пространство.
               if (this._hasInvisibleItems() && result.inside && !result.prepend) {
                  result.inside = false;
                  result.prepend = true;
                  //Искать первую пустышку надо непосредственно внутри переданного container. Иначе при добавлении
                  //листов, можем найти пустышку в контейнере для папок.
                  result.container = result.container.find('>.controls-CompositeView__tileItem-invisible').first();
               }
            }
            return result;
         },

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

         expandNode: function(parentFunc, key, hash) {
            if(this.getViewMode() === 'table') {
               return parentFunc.call(this, key, hash);
            }
         },

         collapseNode: function(parentFunc, key, hash) {
            if(this.getViewMode() === 'table') {
               return parentFunc.call(this, key, hash);
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
            if (this._scrollContainer) {
               this._scrollContainer.off('scroll', this._onScrollHandler);
            }
            parentFnc.call(this);
         },

         _onCollectionAddMoveRemove: function(parentFnc, event, action, newItems, newItemsIndex) {
            //TODO в плитке с деревом сложная логика при определении позиций контейнеров, которые необходимо вставлять
            //а случаи в которых это требуются редкие, но все же есть, вызовем пока что полную перерисовку до внедрения VDOM
            var args = Array.prototype.slice.call(arguments, 1);
            if (this._options.viewMode == 'table') {
               //надо убрать первый аргумент parentFnc а остальное прокинуть.
               //TODO убрать когда будем отказываться от before/after в миксинах
               parentFnc.apply(this, args);
            }
            else {

               var lastItemsIndex = this._getItemsProjection().getCount() - newItems.length;

               //TODO когда идет догрузка по скроллу, все перерисовывать слишком дорого - возникли тормоза в контактах, до VDOM вставляем такую проверку
               //1. Если это добавление в конец и на второй странице нет папок
               //2. Если это удаление
               // тогда можно отрисовать как обычно
               // в остальных случаях полная перерисовка
               if (((lastItemsIndex == newItemsIndex) && !(cInstance.instanceOfModule(newItems[0], 'WS.Data/Display/TreeItem') && newItems[0].isNode()) && !this._redrawOnCollectionChange) || action == 'rm') {
                  parentFnc.apply(this, args);
               }
               else {
                  /* Дополнение к комментарию выше:
                     во время одной пачки изменений может происходить несколько событий,
                     например, несколько add подряд.
                     И если мы перерисовали список один раз, то и на все последующие события данной пачки изменений,
                     мы тоже должны вызывать перерисовку. Иначе может возникнуть ситуация,
                     когда после перерисовки добавятся записи в конец и задублируются. */
                  this._redrawOnCollectionChange = true;
                  this.redraw();
               }

            }
         },

         _afterCollectionChange: function(parentFnc) {
            parentFnc.call(this);
            this._redrawOnCollectionChange = false;
         },

         _getItemsTemplateForAdd: function(parentFnc) {
            if (this._options.viewMode == 'table') {
               return parentFnc.call(this);
            }
            else {
               return ItemsTemplate;
            }
         }
      }

   };
   MultiView.TILE_MODE = TILE_MODE;
   return MultiView;

});
