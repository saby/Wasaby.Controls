define('js!SBIS3.CONTROLS.ScrollContainer',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.ScrollContainer',
      'is!browser?js!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mCustomScrollbar',
      'is!browser?css!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mCustomScrollbar.min',
      'is!browser?js!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mousewheel-3.0.6'
   ],
   function(CompoundControl, dotTplFn) {

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
                * @cfg {String} html-разметка на которую будет повешен скролл
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
             * {jQuery} Контейнер с контент
             */
            _contentContainer: undefined
         },

         $constructor: function() {
            this._publish('onScroll');
         },

         init: function() {
            Scroll.superclass.init.call(this);

            this._contentContainer = this._container.find('.controls-ScrollContainer__content');

            //Подписка на события при которых нужно инициализировать скролл
            this.getContainer().bind('mousemove touchstart', this._create.bind(this));
         },

         /**
          * Возвращает контент находящийся в контейнере
          */
         getContent: function() {
            return this._options.content;
         },

         /**
          * Устанавка нового контента
          * @param content контент
          */
         setContent: function(content) {
            this._options.content = content;
            this._contentContainer.html(content);
            this.reviveComponents();
            this.updateScroll();
         },

         /**
          * Инициализация кастомного скролла
          * @private
          */
         _create: function() {
            var self = this;

            //Инициализируем кастомный скролл
            this.getContainer().mCustomScrollbar({
               theme: 'minimal-dark',
               scrollInertia: 0,
               updateOnContentResize: false,
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
                     self._notify('onScroll', 'bottom', self.getScrollTop());
                  },
                  onTotalScrollBack: function(){
                     self._notify('onScroll', 'top', self.getScrollTop());
                  }
               }
            });

            //Отписываемся от событий инициализации
            this._container.unbind('mousemove touchstart');
         },

         /**
          * Дотиг ли скролл верха контента
          * @returns {*|boolean}
          */
         isScrollOnTop: function() {
            return this.hasScroll() && this._scroll.mcs.topPct === 0;
         },

         /**
          * Дотиг ли скролл низа контента
          * @returns {*|boolean}
          */
         isScrollOnBottom: function() {
            var
               container = this.getContainer(),
               scroll_cotainer = container.find('.mCSB_draggerContainer'),
               scroll = container.find('#mCSB_1_dragger_vertical');

            return this.hasScroll() && scroll_cotainer.height() === (scroll.height() + this.getScrollTop());
         },

         /**
          * Сдвиг скролла на указанную величину
          * @param option величина сдвига скролла
          */
         scrollTo: function(option) {
            this.getContainer().mCustomScrollbar('scrollTo', option, {scrollInertia: 0});
         },

         /**
          * Должен ли быть скролл на контенте
          * @returns {boolean|*}
          */
         hasScroll: function() {
            var
               scroll = this._scroll,
               heightContainer = this._container.height(),
               heightContent = this._contentContainer.height();

            this.updateScroll();

            /**
             * Из-за ленивой инициализации подгружаются все данные, так как скролла нет,
             * поэтому нужно смотреть на размер контейнера и контента
             * и если контейнер переполнен, то сказать что скролл есть,
             * а если в контейнере есть место, то сказать что скролла нет,
             * а уже потом при наведении на контрол скролл инициализируется.
             */
            if (!scroll) {
               this._hasScroll = heightContent > heightContainer;
            }
            /**
             * Если контейнер переполнился нужно повесить класс который скроет
             * часть контента который не влезает в контейнер
             */
            if (this._hasScroll) {
               this.getContainer().addClass('controls-ScrollContainer__overflow-hidden')
            }

            return this._hasScroll;
         },

         /**
          * Верхнее положение скролла в пискселях
          * @returns {.mcs.draggerTop|*}
          */
         getScrollTop: function() {
            if (this._scroll){
               return this._scroll.mcs.draggerTop;
            }
         },

         /**
          * Обновление скролла
          */
         updateScroll: function() {
            this.getContainer().mCustomScrollbar('update');
         },

         /**
          * Разрушение контрола
          */
         destroy: function() {
            this.getContainer().mCustomScrollbar('destroy');
            this._scroll = undefined;
            Scroll.superclass.destroy.call(this);
         }
      });

      return Scroll;
   });