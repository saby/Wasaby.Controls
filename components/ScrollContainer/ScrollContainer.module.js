define('js!SBIS3.CONTROLS.ScrollContainer', [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.Scrollbar',
      'html!SBIS3.CONTROLS.ScrollContainer',
      'Core/detection',
      'js!SBIS3.CORE.FloatAreaManager'
   ],
   function(CompoundControl, Scrollbar, dotTplFn, cDetection, FloatAreaManager) {

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
               content: '',
               activableByClick: false
            },
            _content: null
         },

         $constructor: function() {
            // Что бы при встаке контрола (в качетве обертки) логика работы с контекстом не ломалась,
            // сделаем свой контекст прозрачным
            this._context = this._context.getPrevious();
         },

         _modifyOptionsAfter: function(finalConfig) {
            delete finalConfig.content;
         },

         init: function() {
            ScrollContainer.superclass.init.call(this);
            this._content = $('.controls-ScrollContainer__content', this.getContainer());
            //Под android оставляем нативный скролл
            if (!cDetection.isMobileAndroid){
               this._initScrollbar = this._initScrollbar.bind(this)
               this._container[0].addEventListener('touchstart', this._initScrollbar, true);
               this._container[0].addEventListener('mousemove', this._initScrollbar, true);
               this._hideScrollbar();
               this._subscribeOnScroll();
            }

            // Что бы до инициализации не было видно никаких скроллов
            this._content.removeClass('controls-ScrollContainer__content-overflowHidden');

            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            FloatAreaManager._scrollableContainers[this.getId()] = this.getContainer();
         },

         _subscribeOnScroll: function(){
            this._content.on('scroll', this._onScroll.bind(this));
         },

         _onScroll: function(){
            if (this._scrollbar){
               this._scrollbar.setPosition(this._getScrollTop());
            }
         },

         _hideScrollbar: function(){
            if (!cDetection.safari && !cDetection.chrome){
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
               element: $('.controls-ScrollContainer__scrollbar', this._container),
               contentHeight: this._getScrollHeight(),
               parent: this
            });
            this._container[0].removeEventListener('touchstart', this._initScrollbar, true);
            this._container[0].removeEventListener('mousemove', this._initScrollbar, true);
            this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
         },

         _getScrollHeight: function(){
            // Баг в IE версии старше 10, если повесить стиль overflow-y:scroll, то scrollHeight увеличивается на 1px,
            // поэтому мы вычтем его.
            if (cDetection.IEVersion > 10) {
               return this._content[0].scrollHeight - 1;
            }
            return this._content[0].scrollHeight;
         },

         destroy: function(){
            this._content.off('scroll', this._onScroll);
            ScrollContainer.superclass.destroy.call(this);
            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            delete $ws.single.FloatAreaManager._scrollableContainers[ this.getId() ];
         }
      });

      return ScrollContainer;
   });
