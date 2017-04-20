define('js!SBIS3.CONTROLS.ScrollContainer', [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!SBIS3.CONTROLS.ScrollContainer/ScrollContainer.compatible',
      'tmpl!SBIS3.CONTROLS.ScrollContainer',
      'js!SBIS3.CONTROLS.Scrollbar',
      'Core/detection',
      'Core/core-functions',
      'js!SBIS3.CORE.FloatAreaManager',
      'js!SBIS3.StickyHeaderManager',
      'css!SBIS3.CONTROLS.ScrollContainer'
   ],
   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             ScrollContainerCompatible,
             template,
             Scrollbar,
             cDetection,
             functions,
             FloatAreaManager,
             StickyHeaderManager) {

      var ScrollContainer = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, ScrollContainerCompatible], {
         _template: template,

         _controlName: 'SBIS3.CONTROLS.ScrollContainer',

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

               activableByClick: false
            };
            this._content = null;

            this.deprecatedContr(cfg);
         },


         _containerReady: function(){
            this.reviveInners();

            try {
               this._content = $('> .controls-ScrollContainer__content', this.getContainer());
               this._content.unbind();
               this._showScrollbar = !cDetection.isMobileSafari && !cDetection.isMobileAndroid;
               //Под android оставляем нативный скролл
               if (this._showScrollbar) {
                  this._initScrollbar = this._initScrollbar.bind(this);
                  this._container[0].addEventListener('touchstart', this._initScrollbar, true);
                  this._container.one('mousemove', this._initScrollbar);
                  this._container.one('wheel', this._initScrollbar);
                  this._hideScrollbar();
               }
               this._subscribeOnScroll();

               // Что бы до инициализации не было видно никаких скроллов
               this._content.removeClass('controls-ScrollContainer__content-overflowHidden');


               // task: 1173330288
               // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
               FloatAreaManager._scrollableContainers[this.getId()] = this.getContainer().find('.controls-ScrollContainer__content');
            }
            catch (e) {
            }
         },


         _subscribeOnScroll: function () {
            this._content.on('scroll', this._onScroll.bind(this));
         },

         _onScroll: function () {
            var scrollTop = this._getScrollTop();
            if (this._scrollbar) {
               this._scrollbar.setPosition(scrollTop);
            }
            this.getContainer().toggleClass('controls-ScrollContainer__top-gradient', scrollTop > 0);
         },

         _hideScrollbar: function () {
            if (!cDetection.webkit && !cDetection.chrome) {
               var style = {
                  marginRight: -this._getBrowserScrollbarWidth()
               };
               this._content.css(style);
            }
         },

         _getBrowserScrollbarWidth: function () {
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

         _scrollbarDragHandler: function (event, position) {
            if (position != this._getScrollTop()) {
               this._scrollTo(position);
            }
         },

         _onResizeHandler: function () {
            if (this._scrollbar) {
               if (cDetection.IEVersion >= 10) {
                  this._notHideScrollbar();
               }
               this._scrollbar.setContentHeight(this._getScrollHeight());
               this._scrollbar.setPosition(this._getScrollTop());
               if (this._options.stickyContainer) {
                  this._scrollbar.setContentHeaderHeight(StickyHeaderManager.getStickyHeaderHeight(this._content));
               }
            }
         },

         _notHideScrollbar: function () {
            /**
             * По умолчанию на контенте висит стиль overflow-y: scroll.
             * В ie при overflow-y: scroll добавляется 1px для скроллирования.
             * Поэтому, что бы не появлялся лишний скролл, в ie используем overflow-y: auto.
             * Скрывая скролл через отрицательный правый маржин, мы рассчитываем,
             * что скролл всегда есть, из за overflow-y: scroll.
             * Но в ie, из за overflow-y: auto, его может не быть - тогда из за отрицательного маржина
             * контент уедет вправо. В связи с этим мы вешаем класс, который убирает отрицательный маржин когда нет скролла.
             */
            this._container.toggleClass('controls-ScrollContainer_no-scrollbar', this._getScrollHeight() <= this._content[0].offsetHeight);
         },

         _getScrollTop: function () {
            return this._content[0].scrollTop;
         },

         _scrollTo: function (value) {
            this._content[0].scrollTop = value;
         },

         _initScrollbar: function () {
            if (!this._scrollbar) {
               this._scrollbar = new Scrollbar({
                  element: $('> .controls-ScrollContainer__scrollbar', this._container),
                  contentHeight: this._getScrollHeight(),
                  parent: this
               });

               if (cDetection.IEVersion >= 10) {
                  this._content.css('overflow-y', 'auto');
                  this._notHideScrollbar();
               }
               this._container[0].removeEventListener('touchstart', this._initScrollbar);
               this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
            }
         },

         _getScrollHeight: function () {
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
            if (this.getContainer().hasClass('controls-ScrollContainer__withHead')) {
               height -= 24;
            }
            return height;
         },

         destroy: function () {
            this._content.off('scroll', this._onScroll);
            this._container.off('mousemove', this._initScrollbar);

            AbstractCompatible.destroy.call(this);

            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            delete FloatAreaManager._scrollableContainers[this.getId()];

         }
      });

      return ScrollContainer;
   });
