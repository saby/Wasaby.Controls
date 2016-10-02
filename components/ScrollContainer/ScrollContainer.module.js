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

            /**
             * {Number} Высота контейнера
             */
            _heightContainer: undefined,

            /**
             * {Number} Высота контента
             */
            _heightContent: undefined
         },

         $constructor: function() {
            this._publish('onTotalScroll');
         },

         init: function() {
            Scroll.superclass.init.call(this);

            //Подписка на события (наведение курсора на контейнер) при которых нужно инициализировать скролл.
            this.getContainer().bind('mousemove touchstart', this._create.bind(this));

            /**
             * Первое изменение _hasScroll свидетельствует о переполнении контейнера и поэтому нам
             * нужно запустить обработчик который скроет часть контента который не влезает в контейнер
             */
            this._hasScroll.once('onChange', this._onChangeHasScrollHandler.bind(this));
         },

         /**
          * Возвращает контент находящийся в контейнере
          * @see content
          */
         getContent: function() {
            return this._options.content;
         },

         _onResizeHandler: function() {
            this._heightContainer = this._container.height();
         },

         _onChangeHasScrollHandler: function() {
            /**
             * Вешаем класс который скроет часть контента не влезающий в контейнер
             */
            this.getContainer().addClass('controls-ScrollContainer__overflow-hidden')
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
                     self._notify('onTotalScroll', 'bottom', self.getScrollTop());
                  },
                  onTotalScrollBack: function(){
                     self._notify('onTotalScroll', 'top', self.getScrollTop());
                  }
               }
            });

            //Отписываемся от событий инициализации
            this._container.unbind('mousemove touchstart');
         },

         /**
          * Дотиг ли скролл верха контента
          * @returns {*|boolean}
          * @see iScrollOnBottom
          * @see hasScroll
          */
         isScrollOnTop: function() {
            return this.hasScroll() && !this.getScrollTop();
         },

         /**
          * Дотиг ли скролл низа контента
          * @returns {*|boolean}
          * @see isScrollOnTop
          * @see hasScroll
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
            this._updateScroll();

            /**
             * Из-за ленивой инициализации подгружаются все данные, так как скролла нет,
             * поэтому нужно смотреть на размер контейнера и контента
             * и если контейнер переполнен, то сказать что скролл есть,
             * а если в контейнере есть место, то сказать что скролла нет,
             * а уже потом при наведении на контрол скролл инициализируется.
             */
            if (!this._scroll) {
               heightContainer = this._heightContainer;
               heightContent = this._content.height();

               this._hasScroll = this._content.height() > this._heightContainer;
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
         _updateScroll: function() {
            this.getContainer().mCustomScrollbar('update');
         },

         /**
          * Разрушение контрола
          */
         destroy: function() {
            this.getContainer().mCustomScrollbar('destroy');

            this._scroll = undefined;
            this._hasScroll = undefined;
            this._contentContainer = undefined;
            this._heightContainer = undefined;
            this._heightContent = undefined;

            Scroll.superclass.destroy.call(this);
         }
      });

      return Scroll;
   });