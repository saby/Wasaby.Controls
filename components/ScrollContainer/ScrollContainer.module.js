define('js!SBIS3.CONTROLS.ScrollContainer',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.ScrollContainer',
      'is!browser?js!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mCustomScrollbar.min',
      'is!browser?css!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mCustomScrollbar.min',
      'is!browser?js!SBIS3.CONTROLS.ScrollContainer/resources/custom-scrollbar-plugin/jquery.mousewheel-3.0.6.min'
   ],
   function(CompoundControl, dotTplFn) {

      'use strict';

      /**
       * Контрол представляющий из себя контейнер для контента с кастомным скроллом
       * Работает с плагином http://manos.malihu.gr/jquery-custom-content-scroller/
       * @class SBIS3.CONTROLS.ScrollContainer
       * @extends SBIS3.CONTROLS.CompoundControl
       * @public
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

            _scroll: null,

            _hasScroll: false
         },

         $constructor: function() {
            this._publish('onScroll');
         },

         init: function() {
            Scroll.superclass.init.call(this);
            //Подписка на события при которых нужно инициализировать скролл
            this._container.bind('mousemove touchstart', this._create.bind(this));
         },

         /**
          * Инциализация кастомного скролла
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
          * Возвращает дотиг ли скролл верха контента
          * @returns {*|boolean}
          */
         isScrollOnTop: function() {
            return this.hasScroll() && this._scroll.mcs.topPct === 0;
         },

         /**
          * Возвращает дотиг ли скролл низа контента
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
          * Сдвигает скролл на указанную величину
          * @param option величина сдвига скролла
          */
         scrollTo: function(option) {
            this.getContainer().mCustomScrollbar('scrollTo', option, {scrollInertia: 0});
         },

         /**
          * Возвращает видимость скролла на странице
          * @returns {boolean|*}
          */
         hasScroll: function() {
            var
               scroll = this._scroll,
               heightContainer = this._container.height(),
               heightChildContainer = this._container.children().height();
            this.updateScroll();
            if (!scroll) {
               this._hasScroll = heightChildContainer > heightContainer;
            }
            return this._hasScroll;
         },

         /**
          * Возвращает положение контролла относительно контейнера с контентом
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
            this.superclass.destroy.call(this);
         }
      });

      return Scroll;
   });