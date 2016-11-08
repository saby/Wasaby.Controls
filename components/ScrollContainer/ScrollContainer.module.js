define('js!SBIS3.CONTROLS.ScrollContainer',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.ScrollContainer',
      'Core/detection',
      'is!browser?js!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mCustomScrollbar.full',
      'is!browser?css!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mCustomScrollbar',
      'is!browser?js!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mousewheel-3.1.13'
   ],
   function(CompoundControl, dotTplFn, cDetection) {

      'use strict';

      /**
       * Контрол представляющий из себя контейнер для контента с кастомным скроллом
       * Работает с плагином http://manos.malihu.gr/jquery-custom-content-scroller/
       * @class SBIS3.CONTROLS.ScrollContainer
       * @demo SBIS3.CONTROLS.Demo.MyScrollContainer
       * @extends SBIS3.CONTROLS.CompoundControl
       * @control
       * @public
       * @initial
       * <component data-component="SBIS3.CONTROLS.ScrollContainer">
       *    <option name="content">
       *       <component data-component="SBIS3.CONTROLS.ListView">
       *          <option name="displayField">title</option>
       *          <option name="keyField">id</option>
       *          <option name="infiniteScroll">down</option>
       *          <option name="infiniteScrollContainer">#Scroll</option>
       *          <option name="pageSize">7</option>
       *       </component>
       *    </option>
       * </component>
       * @author Крайнов Дмитрий Олегович
       */
      var Scroll = CompoundControl.extend({

         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               /**
                * @cfg {String} Html-разметка
                * Html код будет добавлен в контейнер с кастомным скроллом который появится если высота
                * контента превысит высоту контейнера.
                * @example
                * <pre>
                *    <option name="content">
                *       <component data-component="SBIS3.CONTROLS.ListView">
                *          <option name="displayField">title</option>
                *          <option name="keyField">id</option>
                *          <option name="infiniteScroll">down</option>
                *          <option name="infiniteScrollContainer">.controls-Scroll__container</option>
                *          <option name="pageSize">7</option>
                *       </component>
                *    </option>
                * </pre>
                * @see getContent
                */
               content: ''
            },

            /**
             * {jQuery} Кастомный скролл
             */
            _scroll: undefined,

            /**
             * {Boolean} Должен ли быть скролл на контейнере
             */
            _hasScroll: false,

            /**
             * {jQuery} Контент
             */
            _content: undefined,
            _createOnMove: undefined,
            _initScrollOnBottom: false
         },

         $constructor: function() {
            this._publish('onTotalScroll');
         },

         init: function() {
            Scroll.superclass.init.call(this);
            this._content = $('.controls-ScrollContainer__content', this.getContainer());
            //Подписка на события (наведение курсора на контейнер) при которых нужно инициализировать скролл.
            this._createOnMove = this._create.bind(this);
            this.getContainer().on('mousemove touchstart', this._createOnMove);
         },

         /**
          * Возвращает контент находящийся в контейнере
          * @see content
          */
         getContent: function() {
            return this._options.content;
         },

         /**
          * Инициализация кастомного скролла
          * @private
          */
         _create: function() {
            var self = this;
            if (!cDetection.isMobileIOS && !cDetection.isAndroidMobilePlatform ) {
               //Инициализируем кастомный скролл
               this.getContainer().mCustomScrollbar({
                  theme: 'minimal-dark',
                  scrollInertia: 200,
                  updateOnContentResize: false,
                  alwaysTriggerOffsets: false,
                  callbacks: {
                     onInit: function(){
                        self._scroll = this;
                     },
                     onOverflowY: function(){
                        self._hasScroll = true;
                     },
                     onOverflowYNone: function(){
                        self._hasScroll = false;
                     },
                     onTotalScrollOffset: 30,
                     onTotalScrollBackOffset: 30,
                     onTotalScroll: function(){
                        self._notify('onTotalScroll', 'bottom', self.getScrollTop());
                     },
                     onTotalScrollBack: function(){
                        self._notify('onTotalScroll', 'top', self.getScrollTop());
                     },
                     whileScrolling: function(){
                        self._notify('onScroll', self.getScrollTop());
                     }
                  },
                  setTop: this._initScrollOnBottom ? "-999999px" : 0
               });
               this.getContainer().off('mousemove touchstart', this._createOnMove);
            }
         },

         setInitOnBottom: function(state){
            if (state && !this._scroll){
               this.getContainer()[0].scrollTop = this.getContainer()[0].scrollHeight;
            }
            this._initScrollOnBottom = state;
         },

         /**
          * Доcтиг ли скролл верха контента
          * @returns {*|boolean}
          * @see iScrollOnBottom
          * @see hasScroll
          */
         isScrollOnTop: function() {
            return this._scroll && this.hasScroll() && !this.getScrollTop();
         },

         /**
          * Доcтиг ли скролл низа контента
          * @returns {*|boolean}
          * @see isScrollOnTop
          * @see hasScroll
          */
         isScrollOnBottom: function() {
            var
               container = this._container,
               scroll = container.find('.mCSB_dragger_bar'),
               scrollTools = container.find('.mCSB_scrollTools_vertical');

            //Высота скроллбара === высоте скролла (dragger) + проскролленное расстояние
            return this._scroll && this.hasScroll() && scrollTools.height() === (scroll.height() + this.getScrollTop());
         },

         getScrollHeight: function(){
            return this._content.height();
         },

         /**
          * Сдвигает скролл на указанную величину
          * @param offset величина сдвига скролла
          */
         scrollTo: function(offset) {
            if (this._scroll){
               this.getContainer().mCustomScrollbar('scrollTo', offset, {scrollInertia: 0});
            } else {
               this.getContainer()[0].scrollTop = typeof offset === 'string' ? (offset === 'top' ? 0 : this.getContainer()[0].scrollHeight) : offset
            }
         },

         /**
          * Скролит к переданному jQuery элементу
          * @param {jQuery} target
          */
         scrollToElement: function(target) {
            this.getContainer().mCustomScrollbar('scrollTo', target, {scrollInertia: 0});
         },

         /**
          * Должен ли быть скролл на контенте
          * @returns {boolean|*}
          */
         hasScroll: function() {
            this._updateScroll();

            /**
             * Из-за ленивой инициализации подгружаются все данные, так как скролла нет,
             * поэтому нужно смотреть на размер контейнера и контента
             * и если контейнер переполнен, то сказать что скролл есть,
             * а если в контейнере есть место, то сказать что скролла нет,
             * а уже потом при наведении на контрол скролл инициализируется.
             */
            if (!this._scroll) {
               return this._content.height() > this._container.height();
            }

            return this._hasScroll;
         },

         /**
          * Вернёт верхнее положение скролла в пискселях
          * Если скролл на момент вызова не инициализированн вернёт 0
          * @returns {.mcs.draggerTop|*}
          */
         getScrollTop: function() {
            var scroll = this._scroll;
            return scroll ? parseInt($('.mCSB_dragger', this.getContainer()).css('top')) : 0;
         },

         /**
          * Обновляет скролл
          */
         _updateScroll: function() {
            this.getContainer().mCustomScrollbar('update');
         },

         /**
          * Разрушает скролл
          */
         destroy: function() {
            this.getContainer().mCustomScrollbar('destroy');
            this.getContainer().off('mousemove touchstart', this._createOnMove);
            this._createOnMove = undefined;
            this._scroll = undefined;
            this._hasScroll = undefined;
            this._content = undefined;

            Scroll.superclass.destroy.call(this);
         }
      });

      return Scroll;
   });