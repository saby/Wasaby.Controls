/**
 * Created by ad.chistyakova on 12.11.2015.
 */
define('js!SBIS3.CONTROLS.ScrollWatcher', [
   "Core/Abstract",
   "Core/helpers/string-helpers",
   "js!SBIS3.CORE.LayoutManager",
   'Core/detection'
], function( cAbstract, strHelpers, LayoutManager, cDetection) {
   'use strict';

   /**
    * @class SBIS3.CONTROLS.ScrollWatcher
    * @extends $ws.proto.Abstract
    * @author Крайнов Дмитрий Олегович
    */
   var ScrollWatcher = cAbstract.extend(/** @lends SBIS3.CONTROLS.ScrollWatcher.prototype */{
      /**
       * @event onScroll Событие проиходит, когда срабатывает проверка на скроллею Например, когда достигли низа страницы
       * @remark
       *
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} type - какое именно событие произошло. Достигли дна окна, контейнера, всплывающей панели.
       * Или это наоборот доскроллили вверх
       * @param {jQuery} event - то самое соыбтие scroll, на которое подписан ScrollWatcher
       * @example
       * <pre>
       *     ScrollWatcher.subscribe('onScroll', function(event, type) {
       *        if (type === 'bottom') {
       *          $ws.core.alert('Вы достигли дна');
       *        }
       *     });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {jQuery} У какого элемента отслеживат скролл.
             * @remark
             * Если не передать, то подписка на скролл будет у window
             */
            element : undefined,
            /**
             * @cfg {Control} Контрол, от которого отслеживается скролл.
             * @remark
             * По нему будем искать находимся ли мы на floatArea.
             *
             */
            opener: undefined,
            /**
             * @cfg {Number} Определитель нижней границы. Если передать число > 0 то событие с типом "Достигли дна(до скроллили до низа\верха страницы)"
             * будет срабатывать на totalScrollOffset px раньше
             */
            totalScrollOffset : 0
         }
      },

      $constructor: function() {
         var topParent;
         this._publish('onTotalScroll', 'onScroll');
         var element = this._findScrollElement() || $(window);
         element.bind('scroll.wsScrollWatcher', this._onContainerScroll.bind(this));
      },

      // Ищем в порядке - пользовательский контейнер -> ws-scrolling-content -> ws-body-scrolling-content -> Window
      _findScrollElement: function() {
         if (!this._options.element.length) {
            var scrollingContent = this._options.opener.getContainer().closest('.ws-scrolling-content').not('.ws-body-scrolling-content'),
               element;
            if (scrollingContent.length) {
               element = scrollingContent;
            } else {
               scrollingContent = $('.ws-body-scrolling-content');
               if (scrollingContent.length){
                  element = scrollingContent;
               }
            }
            return element;
         } else {
            if (this._options.element.hasClass('controls-ScrollContainer')){
               this._options.element = $('.controls-ScrollContainer__content', this._options.element);
            }
            return this._options.element;
         }
      },

      /**
       * Точка соприкосновения всех подписанных скроллов
       * Здесь проиходяит проверки - куда поскроллили, вызываются пользовательские функции проверки
       * @param {number} curScrollTop - текущее положение скролла
       * @private
       */
      _processScrollEvent: function (curScrollTop) {
         this._notify('onScroll', curScrollTop);
         if (this.isScrollOnTop()) {
            this._notify('onTotalScroll', 'top', curScrollTop);
         } 
         if (this.isScrollOnBottom()) {
            this._notify('onTotalScroll', 'bottom', curScrollTop);
         }
      },

      _onContainerScroll: function (event) {
         var elem = event.target;
         this._processScrollEvent(elem.scrollTop);
      },

      getScrollContainer: function(){
         if (!this._options.element.length){
            var element = this._findScrollElement();
            if (element){
               this._options.element = element;
            }
         }
         return this._options.element.length ? this._options.element : $(window);
      },

      /**
       * Находится ли скролл внизу
       * @param  {Boolean} noOffset Учитывать опцию totalScrollOffset или только реальное положение скролла
       * @return {Boolean} Находится ли скролл внизу
       */
      isScrollOnBottom: function(noOffset){
         var element = this.getScrollContainer(),
         offset = noOffset ? 0 : this._options.totalScrollOffset;
         return this._isScrollOnBottom(element, offset)
      },

      _isScrollOnBottom: function(element, offset){
         offset = offset || 0;
         return element.scrollTop() + element.outerHeight() >= this.getScrollHeight(element[0]) - offset;
      },

      isScrollOnTop: function(){
         var element = this.getScrollContainer();
         return element.scrollTop() <= this._options.totalScrollOffset;
      },

      /**
       * Проскроллить в контейнере
       * @param {String|Number} offset куда или насколько скроллить.
       * @variant top - доскроллить до верха контейнера
       * @variant bottom - доскроллить до низа контейнера
       * @variant {Number} - поскроллить на указанную величину
       */
      scrollTo:function(offset){
         var element = this.getScrollContainer();
         element.scrollTop(typeof offset === 'string' ? (offset === 'top' ? 0 : this.getScrollHeight(element[0])) : offset);
      },

      /**
       * Скролит к переданному jQuery элементу
       * @param {jQuery} target
       */
      scrollToElement: function(target) {
         LayoutManager.scrollToElement(target);
      },

      /**
       * Получить текущую высоту скролла отслеживаемого элемента или element
       * @returns {*}
       */
      getScrollHeight: function(element) {
         element = element || this.getScrollContainer()[0];
         if (element.scrollHeight !== undefined){
            return element.scrollHeight;
         } else {
            // Get document height (cross-browser)
            if (element == window){
               var body = document.body,
                  html = document.documentElement;
               return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            }
         }
      },

      /**
       * Получить текущую высоту скроллируемого контейнера
       * @returns {Number}
       */
      getContainerHeight: function(){
         return this._options.element.height();
      },

      /**
       * Есть ли у скроллируемого элемента скролл (т.е. данные, вылезшие за пределы контейнера по высоте)
       * @returns {boolean}
       */
      hasScroll: function(offset){
         // FixMe: Считем, что если есть скролл в 10 пикселей, то его нет
         // вынужденная мера для айпада, из за хака с height: calc(100% + 1px)
         offset = offset || -10;
         var element = this.getScrollContainer();
         return this._hasScroll(element, offset);
      },

       /**
       * Есть ли у элемента скролл
       * @param  {DOMElement}  element [description]
       * @param  {Number} offset если высота скролла меньше offset вернет false
       * @return {Boolean} есть ли у элемента скролл высотой меньше offset
       */
      _hasScroll: function(element, offset){
         offset = offset || 0;
         var scrollHeight = this.getScrollHeight();
         return scrollHeight > this.getContainerHeight() - offset || scrollHeight > $(window).height() - offset;
      },

      destroy: function(){
         this._options.element.unbind('scroll.wsScrollWatcher');
         ScrollWatcher.superclass.destroy.call(this);
      }

   });

   return ScrollWatcher;
});