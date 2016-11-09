define('js!SBIS3.CONTROLS.ScrollContainer', [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.Scrollbar',
      'html!SBIS3.CONTROLS.ScrollContainer',
      'Core/detection'
   ],
   function(CompoundControl, Scrollbar, dotTplFn, Detection) {

      'use strict';

      /**
       * Контрол представляющий из себя контейнер для контента с кастомным скроллом
       * Кастомный скролл SBIS3.CONTROLS.Scrollbar
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
      
      var BROWSER_SCROLLBAR_WIDTH = 0;
      
      var ScrollContainer = CompoundControl.extend({

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
            _content: null
         },


         $constructor: function() {},

         init: function() {
            ScrollContainer.superclass.init.call(this);
            this._publish('onScroll');
            this._content = $('.controls-ScrollContainer__content', this.getContainer());
            if (!Detection.isMobileIOS){
               BROWSER_SCROLLBAR_WIDTH = this._getBrowserScrollbarWidth();
               this._hideScrollbar();
               this._subscribeScrollEvents();
               this._initScrollbar();
            }
         },

         _hideScrollbar: function(){
            var currentPadding = this._content.css('padding-right').replace(/[^0-9.]+/g, ''),
               style = {
                  right: -BROWSER_SCROLLBAR_WIDTH  
               }
            this._content.css(style);
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

         _subscribeScrollEvents: function(){
            this.getContent().on('scroll', this._scrollHandler.bind(this));
         },

         _scrollHandler: function(){
            var scrollTop = this.getScrollTop();
            this._notify('onScroll', scrollTop);
            // Положение скролла отличается от scrollTop в viewportRatio раз
            this._scrollbar.setPosition(scrollTop);
         },

         _scrollbarDragHandler: function(event, position){
            if (position != this.getScrollTop()){
               this.scrollTo(position);
            }
         },

         // Отношение видимой части к полной высоте контента
         _getViewportRatio: function(){
            if (!this._viewportRatio){
               this._viewportRatio = this.getContainer().height() / this.getScrollHeight();
            }
            return this._viewportRatio;
         },

         _initScrollbar: function(){
            this._scrollbar = this.getChildControlByName('scrollbar');
            this._scrollbar.setContentHeight(this.getScrollHeight());
            this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
         },

         /**
          * Возвращает контент находящийся в контейнере
          * @see content
          */
         getContent: function() {
            return this._content;
         },

         /**
          * Доcтиг ли скролл верха контента
          * @returns {*|boolean}
          * @see iScrollOnBottom
          * @see hasScroll
          */
         isScrollOnTop: function() {
            return this.getScrollTop() === 0;
         },

         /**
          * Доcтиг ли скролл низа контента
          * @returns {*|boolean}
          * @see isScrollOnTop
          * @see hasScroll
          */
         isScrollOnBottom: function() {

         },

         getScrollHeight: function() {
            return this.getContent()[0].scrollHeight;
         },

         /**
          * Сдвигает скролл на указанную величину
          * @param option величина сдвига скролла
          */
         scrollTo: function(position) {
            this._content[0].scrollTop = position;
         },

         /**
          * Должен ли быть скролл на контенте
          * @returns {boolean|*}
          */
         hasScroll: function() {},

         /**
          * Вернёт верхнее положение скролла в пискселях
          * Если скролл на момент вызова не инициализированн вернёт 0
          * @returns {.mcs.draggerTop|*}
          */
         getScrollTop: function() {
            return this._content[0].scrollTop;
         },

         destroy: function() {}
      });

      return ScrollContainer;
   });