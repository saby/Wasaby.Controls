define('js!SBIS3.CONTROLS.ScrollContainer', [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!SBIS3.CORE.BaseCompatible/Mixins/WsCompatibleConstructor',
      'tmpl!SBIS3.CONTROLS.ScrollContainer',
      'js!SBIS3.CONTROLS.Scrollbar',
      'Core/detection',
      'Core/core-functions',
      'js!SBIS3.CORE.FloatAreaManager',
      'js!SBIS3.StickyHeaderManager',
      "Core/core-instance",
      'Core/compatibility',
      'Core/constants',
      'css!SBIS3.CONTROLS.ScrollContainer'
   ],
   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             WsCompatibleConstructor,
             template,
             Scrollbar,
             cDetection,
             functions,
             FloatAreaManager,
             StickyHeaderManager,
             cInstance,
             compatibility,
             constants) {
      'use strict';


      /**
       * Контрол представляющий из себя контейнер для контента с тонким скроллом.
       * Тонкий скролл {@link SBIS3.CONTROLS.Scrollbar}
       *
       * @class SBIS3.CONTROLS.ScrollContainer
       * @demo SBIS3.CONTROLS.Demo.MyScrollContainer
       * @extends SBIS3.CONTROLS.CompoundControl
       * @author Черемушкин Илья Вячеславович
       *
       * @example
       * Использование ScrollContainer с вложенным в него ListView, и настройкой автоподгрузки вниз.
       * @remark Для  работы ScrollContainer требуется установить height или max-height.
       * Если установить height, то тонкий скролл появится, когда высота контента станет больше установленной
       * вами высоты ScrollContainer. Если установить max-height, то ScrollContainer будет растягивать по
       * мере увеличения контента. Когда размер контента превысит max-height, тогда появится тонкий скролл.
       * <pre class="brush: html">
       *    <component data-component="SBIS3.CONTROLS.ScrollContainer" class="myScrollContainer">
       *       <option name="content">
       *          <component data-component="SBIS3.CONTROLS.ListView">
       *             <option name="displayProperty">title</option>
       *             <option name="idProperty">id</option>
       *             <option name="infiniteScroll">down</option>
       *             <option name="infiniteScrollContainer">.myScrollContainer</option>
       *             <option name="pageSize">7</option>
       *          </component>
       *       </option>
       *    </component>
       * </pre>
       *
       * @cssModifier controls-ScrollContainer__light Устанавливает светлый тонкий скролл
       * @cssModifier controls-ScrollContainer__hiddenScrollbar Скрыть ползунок
       *
       * @control
       * @public
       *
       * @initial
       * <component data-component='SBIS3.CONTROLS.ScrollContainer' name="MyScrollContainer>
       *     <option name="content">
       *         <component data-component="SBIS3.CONTROLS.ListView" name="ContentList">
       *             <option name="idProperty">key</option>
       *             <option name="displayProperty">title</option>
       *         </component>
       *     </option>
       * </component>
       */
      var ScrollContainer = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, WsCompatibleConstructor], {
         _template: template,

         _controlName: 'SBIS3.CONTROLS.ScrollContainer',
         _useNativeAsMain: true,
         _doNotSetDirty: true,

         constructor: function (cfg) {

            this._options = {
               /**
                * @cfg {Content} Контент в ScrollContainer
                * @remark
                * Контент в ScrollContainer - это пользовательская верстка, которая будет скроллироваться.
                * @example
                * <pre class="brush: html">
                *    <option name="content">
                *       <component data-component="SBIS3.CONTROLS.ListView">
                *          <option name="displayProperty">title</option>
                *          <option name="idProperty">id</option>
                *          <option name="infiniteScroll">down</option>
                *          <option name="infiniteScrollContainer">.controls-Scroll__container</option>
                *          <option name="pageSize">7</option>
                *       </component>
                *    </option>
                * </pre>
                * @see getContent
                */
               content: '',
               /**
                * @cfg {Boolean} Включает фиксацию заголовоков в рамках контенера ScrollContainer
                */
               stickyContainer: false,

               activableByClick: false,

               isPaging: false,

               navigationToolbar: {
                  begin: false,
                  prev: false,
                  pages: false,
                  next: false,
                  end: false
               }
            };
            this._content = null;
            this._headerHeight = 0;
            this._ctxSync = {
               selfToPrev: {},
               selfCtxRemoved: {},
               selfNeedSync: 0,
               prevToSelf: {},
               prevCtxRemoved: {},
               prevNeedSync: 0
            };
            this.deprecatedContr(cfg);
         },

         _containerReady: function() {
            var showScrollbar;
            if (window && this._container && (typeof this._container.length === "number")) {

               this._content = $('> .controls-ScrollContainer__content', this.getContainer());
               showScrollbar = !(cDetection.isMobileIOS || cDetection.isMobileAndroid);
               this._bindOfflainEvents();
               //Под android оставляем нативный скролл
               if (showScrollbar){
                  this._hideScrollbar = this._hideScrollbar.bind(this);
                  this._touchStartHandler = this._touchStartHandler.bind(this);
                  this._initScrollbar = this._initScrollbar.bind(this);
                  this._container[0].addEventListener('touchstart', this._touchStartHandler, true);
                  this._container.one('mousemove', this._initScrollbar);
                  this._container.one('wheel', this._initScrollbar);
                  if (cDetection.IEVersion >= 10) {
                     // Баг в ie. При overflow: scroll, если контент не нуждается в скроллировании, то браузер добавляет
                     // 1px для скроллирования и чтобы мы не могли скроллить мы отменим это действие.
                     this._content[0].onmousewheel = function(event) {
                        if (this._content[0].scrollHeight - this._content[0].offsetHeight === 1) {
                           event.preventDefault();
                        }
                     }.bind(this);
                  }
                  this._hideNativeScrollbar();
               }
               this._subscribeOnScroll();

               this._addGradient();

               // Что бы до инициализации не было видно никаких скроллов
               this._content.removeClass('controls-ScrollContainer__content-overflowHidden');

               // task: 1173330288
               // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
               FloatAreaManager._scrollableContainers[this.getId()] = this.getContainer().find('.controls-ScrollContainer__content');

               this._initPaging();
            }
         },

         _addGradient: function() {
         	var maxScrollTop = this._getScrollHeight() - this._container.height();
            
            this._container.toggleClass('controls-ScrollContainer__bottom-gradient', maxScrollTop > 0 && this._getScrollTop() < maxScrollTop);
         },

         _touchStartHandler: function() {
            this._initScrollbar();
            this._showScrollbar();
         },

         _initScrollbar: function(){
            if (!this._scrollbar) {
               this._scrollbar = new Scrollbar({
                  element: $('> .controls-ScrollContainer__scrollbar', this._container),
                  contentHeight: this._getScrollHeight(),
                  position: this._getScrollTop(),
                  parent: this
               });

               this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
            }
         },

         // Показать скролл на touch устройствах
         _showScrollbar: function() {
            // Покажем скролл и подпишемся на touchend чтобы его снять. Подписываемся у document, потому что палец может
            // уйти с элемента, но при этом скроллинг продолжается.
            this._container.toggleClass('controls-ScrollContainer__showScrollbar', true);
            document.addEventListener('touchend', this._hideScrollbar, true);
         },

         //Скрыть скролл на touch устройствах
         _hideScrollbar: function() {
            // Скроем скролл и отпишемся от touchend.
            this._container.toggleClass('controls-ScrollContainer__showScrollbar', false);
            document.removeEventListener('touchend', this._hideScrollbar);
         },

         bothIsNaN: function(a, b){
            return (typeof a === "number") && (typeof b === "number") && isNaN(a) && isNaN(b);
         },

         nullOrUndefined: function(a){
            return a === null || a === undefined;
         },

         compare: function(a, b){
            /**
             * Если одно из значений null или undefined то сравниваем с типами, чтобы null!==undefined
             * Если оба значения не null и не undefined, то сравниваем без типов, чтобы 1=="1"
             */
            var temp = (this.nullOrUndefined(a) || this.nullOrUndefined(b))?(a===b):(a==b);
            return this.bothIsNaN(a,b) || temp;
         },

         fixOpacityField: function(name){
            if (this.compare(this._ctxSync.selfToPrev[name], this._ctxSync.prevToSelf[name])){
               /**
                * Если данные пролетают сквозь контекст самоятоятельно, то не нужно их синхронизировать
                */
               delete this._ctxSync.selfToPrev[name];
               delete this._ctxSync.prevToSelf[name];
               this._ctxSync.selfNeedSync--;
               this._ctxSync.prevNeedSync--;
            }
         },

         setContext: function(ctx){
            BaseCompatible.setContext.call(this, ctx);
            /**
             * Добавим проксирование данных для EngineBrowser
             * Этот костыль будет выпилен в 3.17.20
             */
            if (this.getParent()) {
               var
                  self = this,
                  selfCtx = this._context,
                  prevContext = this._context.getPrevious(),
                  onFieldChange = function(ev, name, value) {
                     //if (this.getValueSelf(name) !== undefined)
                     {
                        if (!self.compare(value, prevContext.getValueSelf(name)) &&
                           !self.compare(value, self._ctxSync.selfToPrev[name])) {
                           self._ctxSync.selfToPrev[name] = value;
                           self._ctxSync.selfNeedSync++;
                           self.fixOpacityField(name);
                        }
                     }
                  },
                  prevOnFieldChange = function(ev, name, value) {
                     //if (prevContext.getValueSelf(name) !== undefined)
                     {
                        if (!self.compare(value, selfCtx.getValueSelf(name)) &&
                           !self.compare(value, self._ctxSync.prevToSelf[name])){
                           self._ctxSync.prevToSelf[name] = value;
                           self._ctxSync.prevNeedSync++;
                           self.fixOpacityField(name);
                        }
                     }
                  },
                  onFieldsChanged = function() {
                     if (self._ctxSync.selfNeedSync) {
                        self._ctxSync.selfNeedSync = 0;
                        prevContext.setValueSelf(self._ctxSync.selfToPrev);
                        self._ctxSync.selfToPrev = {};
                     }
                  },
                  prevOnFieldsChanged = function() {
                     if (self._ctxSync.prevNeedSync) {
                        self._ctxSync.prevNeedSync = 0;
                        selfCtx.setValueSelf(self._ctxSync.prevToSelf);
                        self._ctxSync.prevToSelf = {};
                     }
                  },
                  onFieldRemove = function(ev, name, value) {
                     self._ctxSync.selfCtxRemoved[name] = false;
                     if (prevContext.getValueSelf(name) !== undefined &&
                        !self._ctxSync.prevCtxRemoved[name]) {
                        self._ctxSync.prevCtxRemoved[name] = true;
                        prevContext.removeValue(name);
                     }
                  },
                  prevOnFieldRemove = function(ev, name, value) {
                     self._ctxSync.prevCtxRemoved[name] = false;
                     if (selfCtx.getValueSelf(name) !== undefined && !self._ctxSync.selfCtxRemoved[name]) {
                        self._ctxSync.selfCtxRemoved[name] = true;
                        selfCtx.removeValue(name);
                     }
                  };

               this._context.subscribe('onFieldChange', onFieldChange);
               prevContext.subscribe('onFieldChange', prevOnFieldChange);
               this._context.subscribe('onFieldsChanged', onFieldsChanged);
               prevContext.subscribe('onFieldsChanged', prevOnFieldsChanged);
               this._context.subscribe('onFieldRemove', onFieldRemove);
               prevContext.subscribe('onFieldRemove', prevOnFieldRemove);

               this.once('onDestroy', function(){
                  this._context.unsubscribe('onFieldChange', onFieldChange);
                  prevContext.unsubscribe('onFieldChange', prevOnFieldChange);
                  this._context.unsubscribe('onFieldsChanged', onFieldsChanged);
                  prevContext.unsubscribe('onFieldsChanged', prevOnFieldsChanged);
                  this._context.unsubscribe('onFieldRemove', onFieldRemove);
                  prevContext.unsubscribe('onFieldRemove', prevOnFieldRemove);
               });
            }
         },

         _subscribeOnScroll: function(){
            this._content.on('scroll', this._onScroll.bind(this));
         },

         _onScroll: function(event) {
            var scrollTop = this._getScrollTop();

            if (this._scrollbar){
               this._scrollbar.setPosition(scrollTop);
            }
            if (this._paging) {
               this._calcPagingSelectedKey(scrollTop);
            }
            this.getContainer().toggleClass('controls-ScrollContainer__top-gradient', scrollTop > 0);
            this.getContainer().toggleClass('controls-ScrollContainer__bottom-gradient', scrollTop < this._getScrollHeight() -  this._container.height());
         },

         _calcPagingSelectedKey: function(position) {
            var page = position / this._container.height();
            if (!(page % 1)) {
               page += 1;
            } else {
               page = Math.ceil(page);
               if (page + 1 === this._paging.getPagesCount()) {
                  page += 1;
               }
            }
            if (this._page !== page) {
               this._page = page;
               this._paging.setSelectedKey(page);
            }
         },

         _hideNativeScrollbar: function(){
            var scrollbarWidth, style;
            if (!cDetection.webkit && !cDetection.chrome){
               /**
                * Скрытие нативного скролла в IE, Firefox происходит через отрицательный margin = длине скролла.
                */
               scrollbarWidth = this._getBrowserScrollbarWidth();
               if (scrollbarWidth) {
                  style = {
                     marginRight: -scrollbarWidth
                  };
                  this._content.css(style);
               }
            }
         },

         _getBrowserScrollbarWidth: function() {
            var outer, outerStyle, scrollbarWidth;
            outer = document.createElement('div');
            outerStyle = outer.style;
            outerStyle.position = 'absolute';
            outerStyle.width = '100px';
            outerStyle.height = '100px';
            outerStyle.overflow = 'scroll';
            outerStyle.top = '-9999px';
            document.body.appendChild(outer);
            scrollbarWidth = outer.offsetWidth - outer.clientWidth;
            document.body.removeChild(outer);
            return scrollbarWidth;
         },

         _scrollbarDragHandler: function(event, position){
            if (position != this._getScrollTop()){
               this._scrollTo(position);
               if (this._paging) {
                  this._calcPagingSelectedKey(position);
               }
            }
         },

         _onResizeHandler: function(){
            var headerHeight, scrollbarContainer;
            AreaAbstractCompatible._onResizeHandler.apply(this, arguments);
            if (this._scrollbar){
               this._scrollbar.setContentHeight(this._getScrollHeight());
               this._scrollbar.setPosition(this._getScrollTop());
               if (this._options.stickyContainer) {
                  headerHeight = StickyHeaderManager.getStickyHeaderHeight(this._content);
                  if (this._headerHeight !== headerHeight) {
                     scrollbarContainer = this._scrollbar._container;
                     scrollbarContainer.css('margin-top', headerHeight);
                     scrollbarContainer.height('calc(100% - ' + headerHeight + 'px)');
                     this._headerHeight = headerHeight;
                  }
               }
            }
            //ресайз может позваться до инита контейнера
            if (this._content) {
               this._addGradient();
            }

            if (this._paging) {
               /**
                * Меняем количество страниц, если высота не 0.
                * Если высота стала 0, то менять количество страниц не нужно, потому что определить сколько их нельзя, а
                * значит и определить на сколько прокручивать при переходе на другую страницу нельзя.
                */
               if (this._container.height()) {
                  this._setPagesCount(Math.ceil(this._getScrollHeight() / this._container.height()));
               }
            }
         },

         _getScrollTop: function(){
            return this._content[0].scrollTop;
         },

         _scrollTo: function(value){
            this._content[0].scrollTop = value;
         },

         _getScrollHeight: function(){
            var height;
            height = this._content[0].scrollHeight;
            // Баг в IE версии 10 и старше, если повесить стиль overflow-y:scroll, то scrollHeight увеличивается на 1px,
            // поэтому мы вычтем его.
            if (cDetection.IEVersion >= 10) {
               height -= 1;
            }
            // TODO: придрот для правильного рассчета с модификатором __withHead
            // он меняет высоту скроллабара - из за этого получаются неверные рассчеты
            // убрать вместе с этим модификатором, когда будет шаблон страницы со ScrollContainer и фиксированой шапкой
            if (this.getContainer().hasClass('controls-ScrollContainer__withHead')){
               height -= 24;
            }
            return height;
         },

         destroy: function(){
            if (this._content) {
               this._content.off('scroll', this._onScroll);
            }
            this._container.off('mousemove', this._initScrollbar);
            this._container[0].removeEventListener('touchstart', this._touchStartHandler);

            BaseCompatible.destroy.call(this);
            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            delete FloatAreaManager._scrollableContainers[ this.getId() ];
         },
         //region retail_offlain
         _bindOfflainEvents: function() {
            if (constants.browser.retailOffline) {
               this._content[0].addEventListener('touchstart', function (event) {
                  this._startPos = this._content.scrollTop() + event.targetTouches[0].pageY;
               }.bind(this), true);
               // На движение пальцем - сдвигаем положение
               this._content[0].addEventListener('touchmove', function (event) {
                  this._moveScroll(this._startPos - event.targetTouches[0].pageY);
                  event.preventDefault();
               }.bind(this));
            }
         },
         _moveScroll: function(top) {
            this._content.scrollTop(top);
         },
         //endregion retail_offlain

         _initPaging: function() {
            if (this._options.isPaging) {
               requirejs(['js!SBIS3.CONTROLS.Paging'], function(paging) {
                  this._paging = new paging({
                     element: this._container.find('.js-controls-ScrollContainer__paging'),
                     className: 'controls-ScrollContainer__paging controls-ListView__scrollPager',
                     visiblePath: this._options.navigationToolbar,
                     parent: this
                  });
                  this._setPagesCount(Math.ceil(this._getScrollHeight() / this._container.height()));
                  this._paging.subscribe('onSelectedItemChange', this._pageChangeHandler.bind(this));
                  this._page = 1;
               }.bind(this));
            }
         },

         _setPagesCount: function(count) {
            this._paging.setPagesCount(count);
            if (count === 1) {
               this._paging.hide();
            } else {
               this._paging.show();
            }
         },

         _pageChangeHandler: function(event, nPage) {
            var scrollTop = this._container.height() * (nPage - 1);
            if (this._page !==  nPage) {
               this._page = nPage;
               this._scrollTo(scrollTop);
            }
         }
      });

      return ScrollContainer;
   });
