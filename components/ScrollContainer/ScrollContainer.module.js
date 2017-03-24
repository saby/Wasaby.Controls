define('js!SBIS3.CONTROLS.ScrollContainer', [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.Scrollbar',
      'html!SBIS3.CONTROLS.ScrollContainer',
      'Core/detection',
      'js!SBIS3.CORE.FloatAreaManager',
      'js!SBIS3.StickyHeaderManager',
      'css!SBIS3.CONTROLS.ScrollContainer'
   ],
   function(CompoundControl, Scrollbar, dotTplFn, cDetection, FloatAreaManager, StickyHeaderManager) {

      'use strict';

      /**
       * Контрол представляющий из себя контейнер для контента с тонким скроллом.
       * Тонкий скролл {@link SBIS3.CONTROLS.Scrollbar}
       *
       * @class SBIS3.CONTROLS.ScrollContainer
       * @demo SBIS3.CONTROLS.Demo.MyScrollContainer
       * @extends SBIS3.CONTROLS.CompoundControl
       * @author Крайнов Дмитрий Олегович
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
       */
      var ScrollContainer = CompoundControl.extend( /** @lends SBIS3.CONTROLS.ScrollContainer.prototype */{

         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
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

               activableByClick: false
            },
            _content: null
         },

         $constructor: function() {
            // Что бы при встаке контрола (в качетве обертки) логика работы с контекстом не ломалась,
            // сделаем свой контекст прозрачным
            this._craftedContext = false;
            this._context = this._context.getPrevious();
         },

         _modifyOptionsAfter: function(finalConfig) {
            delete finalConfig.content;
         },

         init: function() {
            ScrollContainer.superclass.init.call(this);
            this._content = $('.controls-ScrollContainer__content', this.getContainer());
            this._showScrollbar = !cDetection.isMobileSafari && !cDetection.isMobileAndroid;
            //Под android оставляем нативный скролл
            if (this._showScrollbar){
               this._initScrollbar = this._initScrollbar.bind(this);
               this._container[0].addEventListener('touchstart', this._initScrollbar, true);
               this._container.one('mousemove', this._initScrollbar);
               this._hideScrollbar();
            }
            this._subscribeOnScroll();

            // Что бы до инициализации не было видно никаких скроллов
            this._content.removeClass('controls-ScrollContainer__content-overflowHidden');

            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            FloatAreaManager._scrollableContainers[this.getId()] = this.getContainer().find('.controls-ScrollContainer__content');
         },

         _subscribeOnScroll: function(){
            this._content.on('scroll', this._onScroll.bind(this));
         },

         _onScroll: function(){
            var scrollTop = this._getScrollTop();
            if (!this._scrollbar) {
               this._initScrollbar();
            }
            if (this._showScrollbar){
               this._scrollbar.setPosition(scrollTop);
            }
            this.getContainer().toggleClass('controls-ScrollContainer__top-gradient', scrollTop > 0);
         },

         _hideScrollbar: function(){
            if (!cDetection.webkit && !cDetection.chrome){
               var style = {
                     marginRight: -this._getBrowserScrollbarWidth()
                  };
               this._content.css(style);
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
            }
         },

         _onResizeHandler: function(){
            ScrollContainer.superclass._onResizeHandler.apply(this, arguments);
            if (this._scrollbar){
               this._scrollbar.setContentHeight(this._getScrollHeight());
               this._scrollbar.setPosition(this._getScrollTop());
               if (this._options.stickyContainer) {
                  this._scrollbar.setContentHeaderHeight(StickyHeaderManager.getStickyHeaderHeight(this._content));
               }
            }
         },

         _getScrollTop: function(){
            return this._content[0].scrollTop;
         },

         _scrollTo: function(value){
            this._content[0].scrollTop = value;
         },

         _initScrollbar: function(){
            this._scrollbar = new Scrollbar({
               element: $('> .controls-ScrollContainer__scrollbar', this._container),
               contentHeight: this._getScrollHeight(),
               parent: this
            });

            /**
             * В ie при overflow-y: scroll добавляется 1px для скроллирования. И когда скролла нет
             * мы можем скроллить область на 1px. Поэтому мы избавимся от нативного скролла.
             */
            if (cDetection.IEVersion >= 10) {
               this._content.css('overflow-y', 'auto');
            }
            if (!cDetection.isIE8){
               this._container[0].removeEventListener('touchstart', this._initScrollbar);
            }
            this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
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
            this._content.off('scroll', this._onScroll);
            this._container.off('mousemove', this._initScrollbar);
            ScrollContainer.superclass.destroy.call(this);
            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            delete FloatAreaManager._scrollableContainers[ this.getId() ];
         }
      });

      return ScrollContainer;
   });
