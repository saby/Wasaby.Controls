/**
 * Created by ad.chistyakova on 12.11.2015.
 */
define('js!SBIS3.CONTROLS.ScrollWatcher', [], function() {
   'use strict';
   $ws.proto.ScrollWatcher = $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.ScrollWatcher.prototype */{
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
             * будет срабатывать на checkOffset px раньше
             */
            checkOffset : 0
         },
         _type : 'window',                      //Тип "Отслеживателя": container, window, floatArea
         _isScrollUp: false,                       //Проверка, в какую сторону scroll. Первый скролл вверх не может быть.
         _lastScrollTop: 0,                        //Последний сохраненный скролл
         _onWindowScrollHandler : undefined,
         _floatAreaScrollHandler : undefined,
         _onContainerScrollHandler: undefined,
         _onBeforeBodyMarkupChangedHandler: undefined
      },

      $constructor: function() {
         var self = this,
             opener = this.getOpener(),
             topParent;
         this._publish('onScroll');
         this._type = (this._options.element ? 'container' : 'window');
         if (opener){
            topParent = opener.getTopParent();
            //Если уже определен тип отслежтивания в контейнере, то это имеет большее значение, чем то, находимся ли мы на floatArea или нет.
            this._type = $ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea') && this._inWindow() ? 'floatArea' : this._type
         }

         //В зависимости от настроек высоты подписываемся либо на скролл у окна, либо у контейнера
         if (this._inContainer()) {
            this._onContainerScrollHandler =  this._onContainerScroll.bind(this);
            this._options.element.bind('scroll.wsScrollWatcher', this._onContainerScrollHandler);
            $ws.helpers.wheel(this._options.element, function(event){
               $(self._options.element).scrollTop($(self._options.element).scrollTop() - event.wheelDelta/2);
            });

         } else if (this._inWindow()) {
            this._onWindowScrollHandler = this._onWindowScroll.bind(this);
            $(window).bind('scroll.wsScrollWatcher', this._onWindowScrollHandler);

         } else {//inFloatArea
            //Если браузер лежит на всплывающей панели и имеет автовысоту, то скролл появляется у контейнера всплывашки (.parent())
            this._floatAreaScrollHandler = this._onFAScroll.bind(this);
            topParent.subscribe('onScroll', this._floatAreaScrollHandler);
            topParent.subscribe('onDestroy', function(){
               self.destroy();
            });
         }
         //Обработка открывающихся стек-панелей
         $ws.single.EventBus.globalChannel().subscribe('onBeforeBodyMarkupChanged',
               self._onBeforeBodyMarkupChangedHandler = self._onBeforeBodyMarkupChanged.bind(self));

      },
      _onBeforeBodyMarkupChanged:function(event, changeEventArg){
         if ($ws.helpers.isElementVisible(this._getContainer())) {
            if (changeEventArg.floatAreaStack) {
               $(window).unbind('scroll', this._onWindowScrollHandler);
               $(changeEventArg.contentScrollBlock).bind('scroll.wsScrollPaging', this._onContainerScroll.bind(this));
            } else {
               $(window).bind('scroll', this._onWindowScrollHandler);
               $(changeEventArg.contentScrollBlock).unbind('.wsScrollPaging');
            }
         }
      },
      getOpener : function(){
         return this._options.opener;
      },
      _getContainer: function(){
         return this._options.element || $('body');
      },
      _inFloatArea: function(){
         return this._type === 'floatArea';
      },
      _inContainer: function(){
         return this._type === 'container';
      },
      _inWindow: function(){
         return this._type === 'window';
      },
      /**
       * Точка соприкосновения всех подписанных скроллов
       * Здесь проиходяит проверки - куда поскроллили, вызываются пользовательские функции проверки
       * @param isBottom Проверка на то, находимся ли мы внизу страницы. При этом isScrollUp не учитывается, потому что мы просто
       * вычисляем.
       * @param event
       * @private
       */
      _processScrollEvent: function (isBottom, event) {
         this._defineScrollDirection(event);
         if (this._isScrollUp ) {
            if (this._isOnTop(event)) {
               this._notify('onScroll', 'top', event);
            }
         } else if (isBottom) {
            this._notify('onScroll', 'bottom', event);
         }
      },
      _defineScrollDirection : function(event){
         var curScrollTop = $(event.target).scrollTop();
         //Это значит вызываем с тем же значением - перепроверять не надо.
         if (this._lastScrollTop === curScrollTop) {
            return;
         }
         this._isScrollUp = this._lastScrollTop > curScrollTop;
         this._lastScrollTop = curScrollTop;
      },
      _onWindowScroll: function (event) {
         var docBody = document.body,
               docElem = document.documentElement,
               clientHeight = Math.min(docBody.clientHeight, docElem.clientHeight),
               scrollTop = Math.max(docBody.scrollTop, docElem.scrollTop),
               scrollHeight = Math.max(docBody.scrollHeight, docElem.scrollHeight);
         this._processScrollEvent((clientHeight + scrollTop  >= scrollHeight - this._options.checkOffset), event);
      },
      _onFAScroll: function(event, scrollOptions) {
         this._processScrollEvent(scrollOptions.clientHeight + scrollOptions.scrollTop  >= scrollOptions.scrollHeight - this._options.checkOffset, event);
      },
      _onContainerScroll: function (event) {
         var elem = event.target;
         //если высота скролла меньше чем высота контейнера с текущим scrollTop, то мы где-то внизу.
         //offsetHeight - высота контейнра, scrollHeight - вся высота скролла,
         //elem.clientHeight === elem.offsetHeight если где-то не будет соблюдаться, то нужно взять offsetHeight
         this._processScrollEvent(elem.scrollTop + elem.clientHeight >= elem.scrollHeight - this._options.checkOffset, event);
      },
      _isOnTop : function(event){
         return event && this._isScrollUp && (this._lastScrollTop <= this._options.checkOffset);
      },
      /**
       * Проскроллить в контейнере
       * @param {String|Number} offset куда или насколько скроллить.
       * @variant top - доскроллить до верха контейнера
       * @variant bottom - доскроллить до низа контейнера
       * @variant {Number} - поскроллить на указанную величину
       */
      scrollTo:function(offset){
         var scrollable = this._getContainer()[0];
         scrollable.scrollTop = (typeof offset === 'string' ? (offset === 'top' ? 0 : scrollable.scrollHeight) : offset)
      },
      /**
       * Получить текущую высоту скролла отслеживаемого элемента
       * @returns {*}
       */
      getScrollHeight: function(){
         if (this._inContainer()){
            return this._options.element[0].scrollHeight;
         }
         if (this._inWindow()){
            return document.body.scrollHeight;
         }
         if (this._inFloatArea()) {
            return this.getOpener().getTopParent().getContainer().parent()[0].scrollHeight;
         }

      },
      /**
       * Получить текущую высоту скроллируемого контейнера
       * @returns {Number}
       */
      getContainerHeight: function(){
         if (this._inContainer()){
            return this._options.element[0].offsetHeight;
         }
         if (this._inWindow()){
            return $(window).height();
         }
         if (this._inFloatArea()) {
            return this.getOpener().getTopParent().getContainer().parent().height();
         }
      },
      /**
       * Есть ли у скроллируемого элемента скролл (т.е. данные, вылезшие за пределы контейнера по высоте)
       * @returns {boolean}
       */
      hasScroll: function(){
         return this.getScrollHeight() > this.getContainerHeight();
      },
      destroy: function(){
         if (this._inWindow()) {
            $(window).unbind('scroll.wsScrollWatcher', this._onWindowScrollHandler);
            this._onWindowScrollHandler = undefined;
         }
         if (this._onBeforeBodyMarkupChangedHandler) {
            $ws.single.EventBus.globalChannel().unsubscribe('onBeforeBodyMarkupChanged', this._onBeforeBodyMarkupChangedHandler);
         }
         $ws.proto.ScrollWatcher.superclass.destroy.call(this);
      }

   });
   return  $ws.proto.ScrollWatcher;
});