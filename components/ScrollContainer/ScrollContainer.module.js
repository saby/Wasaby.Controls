define('js!SBIS3.CONTROLS.ScrollContainer', [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!SBIS3.CORE.BaseCompatible/Mixins/WsCompatibleConstructor',
      'tmpl!SBIS3.CONTROLS.ScrollContainer',
      'js!SBIS3.CONTROLS.Scrollbar',
      'Core/detection',
      'js!SBIS3.CORE.FloatAreaManager',
      'js!SBIS3.StickyHeaderManager',
      'Core/constants',
      'Core/EventBus',
      'Core/CommandDispatcher',
      'css!SBIS3.CONTROLS.ScrollContainer'
   ],
   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             WsCompatibleConstructor,
             template,
             Scrollbar,
             cDetection,
             FloatAreaManager,
             StickyHeaderManager,
             constants,
             EventBus,
             CommandDispatcher
   ) {
      'use strict';

      /**
       * Класс контрола "Контейнер для контента с тонким скроллом". В качестве тонкого скролла применяется класс контрола {@link SBIS3.CONTROLS.Scrollbar}.
       *
       * @class SBIS3.CONTROLS.ScrollContainer
       * @extends Core/core-extend
       * @author Зуев Дмитрий Владимирович
       *
       * @mixes Core/Abstract.compatible
       * @mixes SBIS3.CORE.Control/Control.compatible
       * @mixes SBIS3.CORE.AreaAbstract/AreaAbstract.compatible
       * @mixes SBIS3.CORE.BaseCompatible
       * @mixes SBIS3.CORE.BaseCompatible/Mixins/WsCompatibleConstructor
       *
       * @remark Для работы SBIS3.CONTROLS.ScrollContainer требуется установить CSS-свойства height или max-height:
       * <ul>
       *    <li>Когда установлено свойство height, тонкий скролл появится, если высота контента (см. {@link content}) станет больше установленной высоты SBIS3.CONTROLS.ScrollContainer.</li>
       *    <li>Когда установлено свойство max-height, то SBIS3.CONTROLS.ScrollContainer будет растягиваться по мере увеличения контента. Когда размер контента превысит max-height, тогда появится тонкий скролл.</li>
       * </ul>
       *
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
       * @cssModifier controls-ScrollContainer__light Устанавливает светлый тонкий скролл.
       * @cssModifier controls-ScrollContainer__hiddenScrollbar Скрывает отображение ползунка.
       * @cssModifier controls-ScrollContainer__flex Модификатор применяется в тех случаях, когда контрол встроен внутрь flex-контейнера.
       *
       * @demo SBIS3.CONTROLS.Demo.MyScrollContainer Использование SBIS3.CONTROLS.ScrollContainer с автоподгрузкой вниз и с вложенным в него списком, который создан на основе класса {@link SBIS3.CONTROLS.ListView}.
       *
       * @control
       * @public
       * @initial
       * <component data-component='SBIS3.CONTROLS.ScrollContainer' name="MyScrollContainer>
       *     <option name="content">
       *         <component data-component="SBIS3.CONTROLS.ListView" name="ContentList">
       *             <option name="idProperty">key</option>
       *             <option name="displayProperty">title</option>
       *         </component>
       *     </option>
       * </component>
       */
      var ScrollContainer = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, WsCompatibleConstructor], /** @lends SBIS3.CONTROLS.ScrollContainer.prototype */{
         _template: template,
         iWantVDOM: false,
         _controlName: 'SBIS3.CONTROLS.ScrollContainer',
         _useNativeAsMain: true,
         _doNotSetDirty: true,

         constructor: function (cfg) {

            this._options = {
               /**
                * @cfg {Content} Пользовательская разметка, отображаемая в SBIS3.CONTROLS.ScrollContainer и для которой будет отображён скролл.
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
                * @cfg {Boolean} Признак, который устанавливает фиксацию заголовоков в рамках контейнера SBIS3.CONTROLS.ScrollContainer.
                */
               stickyContainer: false,
               /**
                * @cfg {Boolean}
                */
               activableByClick: false,
               /**
                * @cfg {Boolean}
                */
               isPaging: false,
               /**
                * @cfg {Object}
                */
               navigationToolbar: {
                 /**
                  * @cfg {Boolean}
                  * @name SBIS3.CONTROLS.ScrollContainer#navigationToolbar.begin
                  */
                  begin: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS.ScrollContainer#navigationToolbar.prev
                   */
                  prev: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS.ScrollContainer#navigationToolbar.pages
                   */
                  pages: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS.ScrollContainer#navigationToolbar.next
                   */
                  next: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS.ScrollContainer#navigationToolbar.end
                   */
                  end: false
               },
               takeScrollbarHidden: true
            };
            this._content = null;
            this._headerHeight = 0;
            this._ctxSync = {
               selfToPrev: {},
               selfCtxRemoved: {},
               selfNeedSync: 0,
               prevToSelf: {},
               prevCtxRemoved: {},
               prevNeedSync: 0
            };
            this._isMobileIOS = cDetection.isMobileIOS;
            this.deprecatedContr(cfg);

            // на resizeYourself команду перерисовываем только себя, не трогая children.
            // Сейчас команда отправляется только из ListView когда его items изменились (а значит могли измениться размеры)
            CommandDispatcher.declareCommand(this, 'resizeYourself', function () {
               this._resizeInner();
            }.bind(this));
         },

         _containerReady: function() {
            var showScrollbar;
            if (window && this._container && (typeof this._container.length === "number")) {

               this._content = $('> .controls-ScrollContainer__content', this.getContainer());
               showScrollbar = !(cDetection.isMobileIOS || cDetection.isMobileAndroid);
               this._bindOfflainEvents();
               //Под android оставляем нативный скролл
               if (showScrollbar){
                  this._hideScrollbar = this._hideScrollbar.bind(this);
                  this._initScrollbar = this._initScrollbar.bind(this);
                  this._container.one('mouseenter', this._initScrollbar);
                  this._container.one('wheel', this._initScrollbar);

                  //--------------- Управление видимостью скролла ---------------//
                  // Сделано через EventBus.
                  //
                  // На странице в момент времени может быть виден либо один скролл, либо ноль.
                  // Поэтому канал слушают только контейнеры претендующие на скролл, а их количество не
                  // превышает максимальную вложенность контейнеров. Это количество связано с логикой работы.
                  //
                  // Контейнер с активным скроллом, в дальнейшем просто со скроллом, слушает канал,
                  // в который другие контейнеры кидают запросы на получение скролла, предварительно
                  // подписывась на прослушку ответа, а контейнер со скроллом кидает этот ответ.
                  // При переход от дочернего контейнера на родительский нельзя определить, на какой именно
                  // перешли, а можно лишь понять что дочернему не нужен скролл. В этом случае дочерний контейнер
                  // посылает запрос, а слушатели(родители) уже забирают его.
                  //
                  // TODO: возможно нужно переделать механизм работы на EventBus и Commands.
                  // Commands должны забрать на себя механизм обработки контейнер в контейнере.
                  // Так как сommands идут от потомка к родителю, поэтому канал будет слушать только контейнер со скроллом,
                  // а не все кто на него претендуют.
                  // Можно улучшить ленивую инициализацию скролла, например при навдении на дочерний контейнер создать, только
                  // у него, а сейчас создается и у родителя.
                  // Через Command этот механизм может стать быстрее.
                  // Пример проблемы существующего механизма: контейнер с двумя контейнерами.
                  // При переходе от одного дочернего к другому, происходит переход сначало к родителю, так как он
                  // претендует на скролл, а уже потом дочерний заберет у родителя, потому что на него навели курсор.
                  this._requestTakeScrollbarHandler = this._requestTakeScrollbarHandler.bind(this);
                  this._returnTakeScrollbarHandler = this._returnTakeScrollbarHandler.bind(this);
                  this._onMouseenter = this._onMouseenter.bind(this);
                  this._onMouseleave = this._onMouseleave.bind(this);
                  if (!this._options.takeScrollbarHidden) {
                     this._subscribeTakeScrollbar();
                  } else {
                     this._subscribeMouseEnterLeave();
                  }
                  /**
                   * Можно ли отобрать скролл.
                   * 0 - нельзя отбирать
                   * 1 - можно отобрать при переходе на контейнер курсора
                   * 2 - можно отобрать при скроллинге
                   * 3 - всегда отбирать
                   */
                  this._isTakeScrollbar = 3;
                  //---------------------------------------------------------------//
               }
               this._subscribeOnScroll();

               this.subscribeTo(EventBus.channel('stickyHeader'), 'onStickyHeadersChanged', this._stickyHeadersChangedHandler.bind(this));

               this._addGradient();

               // Что бы до инициализации не было видно никаких скроллов
               this._content.removeClass('controls-ScrollContainer__content-overflowHidden');

               // task: 1173330288
               // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
               FloatAreaManager._scrollableContainers[this.getId()] = this.getContainer().find('.controls-ScrollContainer__content');

               this._initPaging();
            }
         },

         _stickyHeadersChangedHandler: function() {
            if (this._scrollbar) {
               this._recalcSizeScrollbar();
            }
         },

         _addGradient: function() {
         	var maxScrollTop = this._getScrollHeight() - this._container.height();

            this._container.toggleClass('controls-ScrollContainer__bottom-gradient', maxScrollTop > 0 && this._getScrollTop() < maxScrollTop);
         },

         _initScrollbar: function(){
            if (!this._scrollbar) {
               this._scrollbar = new Scrollbar({
                  element: $('> .controls-ScrollContainer__scrollbar', this._container),
                  contentHeight: this._getScrollHeight(),
                  position: this._getScrollTop(),
                  parent: this
               });

               this._recalcSizeScrollbar();

               this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
            }
         },

         // Показать скролл
         _showScrollbar: function() {
            this._container.toggleClass('controls-ScrollContainer__scrollbar_show', true);
            this._scrollbar.once('onScrollbarStartDrag', this._setTakeScrollbar.bind(this, 0));
         },

         //Скрыть скролл
         _hideScrollbar: function() {
            this._container.toggleClass('controls-ScrollContainer__scrollbar_show', false);
            this._scrollbar.once('onScrollbarEndDrag', this._setTakeScrollbar.bind(this, 3));
         },

         bothIsNaN: function(a, b){
            return (typeof a === "number") && (typeof b === "number") && isNaN(a) && isNaN(b);
         },

         nullOrUndefined: function(a){
            return a === null || a === undefined;
         },

         compare: function(a, b){
            /**
             * Если одно из значений null или undefined то сравниваем с типами, чтобы null!==undefined
             * Если оба значения не null и не undefined, то сравниваем без типов, чтобы 1=="1"
             */
            var temp = (this.nullOrUndefined(a) || this.nullOrUndefined(b))?(a===b):(a==b);
            return this.bothIsNaN(a,b) || temp;
         },

         fixOpacityField: function(name){
            if (this.compare(this._ctxSync.selfToPrev[name], this._ctxSync.prevToSelf[name])){
               /**
                * Если данные пролетают сквозь контекст самоятоятельно, то не нужно их синхронизировать
                */
               delete this._ctxSync.selfToPrev[name];
               delete this._ctxSync.prevToSelf[name];
               this._ctxSync.selfNeedSync--;
               this._ctxSync.prevNeedSync--;
            }
         },

         setContext: function(ctx){
            BaseCompatible.setContext.call(this, ctx);
            /**
             * Добавим проксирование данных для EngineBrowser
             * Этот костыль будет выпилен в 3.17.20
             */
            if (this.getParent()) {
               var
                  self = this,
                  selfCtx = this._context,
                  prevContext = this._context.getPrevious(),
                  onFieldChange = function(ev, name, value) {
                     //if (this.getValueSelf(name) !== undefined)
                     {
                        if (!self.compare(value, prevContext.getValue(name)) &&
                           !self.compare(value, self._ctxSync.selfToPrev[name])) {
                           self._ctxSync.selfToPrev[name] = value;
                           self._ctxSync.selfNeedSync++;
                           self.fixOpacityField(name);
                        }
                     }
                  },
                  prevOnFieldChange = function(ev, name, value) {
                     //if (prevContext.getValueSelf(name) !== undefined)
                     {
                        if (!self.compare(value, selfCtx.getValue(name)) &&
                           !self.compare(value, self._ctxSync.prevToSelf[name])){
                           self._ctxSync.prevToSelf[name] = value;
                           self._ctxSync.prevNeedSync++;
                           self.fixOpacityField(name);
                        }
                     }
                  },
                  onFieldsChanged = function() {
                     if (self._ctxSync.selfNeedSync) {
                        self._ctxSync.selfNeedSync = 0;
                        prevContext.setValue(self._ctxSync.selfToPrev);
                        self._ctxSync.selfToPrev = {};
                     }
                  },
                  prevOnFieldsChanged = function() {
                     if (self._ctxSync.prevNeedSync) {
                        self._ctxSync.prevNeedSync = 0;
                        selfCtx.setValue(self._ctxSync.prevToSelf);
                        self._ctxSync.prevToSelf = {};
                     }
                  },
                  onFieldRemove = function(ev, name, value) {
                     self._ctxSync.selfCtxRemoved[name] = false;
                     if (prevContext.getValueSelf(name) !== undefined &&
                        !self._ctxSync.prevCtxRemoved[name]) {
                        self._ctxSync.prevCtxRemoved[name] = true;
                        prevContext.removeValue(name);
                     }
                  },
                  prevOnFieldRemove = function(ev, name, value) {
                     self._ctxSync.prevCtxRemoved[name] = false;
                     if (selfCtx.getValueSelf(name) !== undefined && !self._ctxSync.selfCtxRemoved[name]) {
                        self._ctxSync.selfCtxRemoved[name] = true;
                        selfCtx.removeValue(name);
                     }
                  };

               this._context.subscribe('onFieldChange', onFieldChange);
               prevContext.subscribe('onFieldChange', prevOnFieldChange);
               this._context.subscribe('onFieldsChanged', onFieldsChanged);
               prevContext.subscribe('onFieldsChanged', prevOnFieldsChanged);
               this._context.subscribe('onFieldRemove', onFieldRemove);
               prevContext.subscribe('onFieldRemove', prevOnFieldRemove);

               this.once('onDestroy', function(){
                  this._context.unsubscribe('onFieldChange', onFieldChange);
                  prevContext.unsubscribe('onFieldChange', prevOnFieldChange);
                  this._context.unsubscribe('onFieldsChanged', onFieldsChanged);
                  prevContext.unsubscribe('onFieldsChanged', prevOnFieldsChanged);
                  this._context.unsubscribe('onFieldRemove', onFieldRemove);
                  prevContext.unsubscribe('onFieldRemove', prevOnFieldRemove);
               });
            }
         },

         _subscribeOnScroll: function(){
            this._content.on('scroll', this._onScroll.bind(this));
         },

         _subscribeTakeScrollbar: function() {
            if (this._getScrollHeight() - this._container.height() > 1) {
               this._subscribeMouseEnterLeave();
            } else {
               this._unsubscribeMouseEnterLeave();
            }
         },

         _subscribeMouseEnterLeave: function() {
            this._container
               .on('mouseenter', this._onMouseenter)
               .on('mouseleave', this._onMouseleave);
         },

         _unsubscribeMouseEnterLeave: function() {
            this._container
               .off('mouseenter', this._onMouseenter)
               .off('mouseleave', this._onMouseleave);
         },

         _getScrollContainerChannel: function() {
            return EventBus.channel('ScrollContainerChannel');
         },

         _onScroll: function(event) {
            var scrollTop = this._getScrollTop();

            if (this._scrollbar){
               this._scrollbar.setPosition(scrollTop);
            }
            if (this._paging) {
               this._calcPagingSelectedKey(scrollTop);
            }
            this.getContainer().toggleClass('controls-ScrollContainer__top-gradient', scrollTop > 0);
            this.getContainer().toggleClass('controls-ScrollContainer__bottom-gradient', scrollTop < this._getScrollHeight() -  this._container.height());
         },

         _onMouseenter: function() {
            var EventBusChannel = this._getScrollContainerChannel();

            if (this._isHover) {
               return;
            }
            this._isHover = true;

            /**
             * При переходе курсора на контейнер разрешим отбирать скролл, только при скроллинге другого контейнера.
             * Давать доступ при переходе курсора на другой контейнер нельзя, потому что, если будет ситуация - контейнер
             * в контейнере, то при наведении на дочерний, после "всплытия" события, родительский сможет отобрать скролл.
             * Запрещать "всплытие" НЕЛЬЗЯ так как родительский контейнер должен подготовиться к принятию скролла, когда
             * уведем курсор с дочернего.
             */
            this._isTakeScrollbar = 2;

            /**
             * Начинаем слушать onReturnTakeScrollbar для принятия скролла в случае отказа владельца от него.
             */
            EventBusChannel.subscribe('onReturnTakeScrollbar', this._returnTakeScrollbarHandler);
            EventBusChannel.once('onReturnTakeScrollbar', this._subscribeOnMousemove.bind(this));
            /**
             * Проверяем есть ли обработчики на запрос скролла(видим ли скролл логически на странице).
             * true: дождемся ответа от владельца скролла можно ли его забрать.
             * false: забираем скролл.
             */
            if (EventBusChannel.hasEventHandlers('onRequestTakeScrollbar')) {
               // Запрашиваем скролл(оповещаем владельца скролла, что хотим забрать его) с параметром 1(переход курсора)
               EventBusChannel.notify('onRequestTakeScrollbar', 1);
            } else {
               EventBusChannel.notify('onReturnTakeScrollbar', true);
            }
         },

         _onMouseleave: function() {
            var EventBusChannel = this._getScrollContainerChannel();

            if (this._isTakeScrollbar) {
               EventBusChannel.notify('onRequestTakeScrollbar', 1);
               EventBusChannel.unsubscribe('onRequestTakeScrollbar', this._requestTakeScrollbarHandler);
               EventBusChannel.unsubscribe('onReturnTakeScrollbar', this._returnTakeScrollbarHandler);
            } else {
               this._isTakeScrollbar = 2;
            }

            this._isHover = false;
         },

         _subscribeOnMousemove: function() {
            /**
             * Нужно сменить права на скролл при движении мышки.
             * Из-за "всплытия" mouseenter мы не можем дать права на запрос скролла при переходе
             * курсора на элемент(см. _onMouseenter присвоение прав).
             * Но если "всплытия" не было, то нужна дать право на запрос скролла при переходе курсора на контейнер.
             * Пример: навели на родитльский контейнер, а потом на дочерний, ели не поменять права родительскому, то
             * дочерний не сможет забрать скролл.
             */
            this._container.one('mousemove', this._oneMousemove.bind(this));
         },

         _oneMousemove: function() {
            this._isTakeScrollbar = 3;
         },

         _requestTakeScrollbarHandler: function(event, isTakeScrollbar) {
            var EventBusChannel = this._getScrollContainerChannel();

            /**
             * При получении запроса на скролл проверим можем ли мы его отдать.
             * Для этого сравним повод запроса скролла и права на его отдачу.
             * Если хоть один из запросов удовлетворяет правам, то отдадим и скроем скролл,
             * и отпишемся от прослушивания запросов на скролл, потому что его у нас больше нет.
             * Если же скролл отдать нельзя, то отклоним запрос.
             */
            if (this._isTakeScrollbar & isTakeScrollbar) {
               EventBusChannel.unsubscribe('onRequestTakeScrollbar', this._requestTakeScrollbarHandler);
               this._hideScrollbar();
            } else {
               isTakeScrollbar = 0;
            }

            /**
             * Оповестим подписантов на ответ запроса скролла о принятом решении.
             */
            this._getScrollContainerChannel().notify('onReturnTakeScrollbar', isTakeScrollbar);
            // Если отдали скролл, то начнем слушать ответы, чтобы взять скролл, на случай ситуации контейнер в контейнере.
            if (isTakeScrollbar) {
               EventBusChannel.subscribe('onReturnTakeScrollbar', this._returnTakeScrollbarHandler);
            }
         },

         _returnTakeScrollbarHandler: function(event, isTakeScrollbar) {
            var EventBusChannel = this._getScrollContainerChannel();
            if (isTakeScrollbar) {
               /**
                * Забираем скролл, начинам слушать запросы и прекращаем слушать ответы на скролл.
                */
               EventBusChannel.subscribe('onRequestTakeScrollbar', this._requestTakeScrollbarHandler);
               EventBusChannel.unsubscribe('onReturnTakeScrollbar', this._returnTakeScrollbarHandler);
               this._showScrollbar();
            }
         },

         _setTakeScrollbar: function(isTakeScrollbar) {
            this._isTakeScrollbar = isTakeScrollbar;
         },

         _calcPagingSelectedKey: function(position) {
            var page = position / this._container.height();
            if (!(page % 1)) {
               page += 1;
            } else {
               page = Math.ceil(page);
               if (page + 1 === this._paging.getPagesCount()) {
                  page += 1;
               }
            }
            if (this._page !== page) {
               this._page = page;
               this._paging.setSelectedKey(page);
            }
         },

         _scrollbarDragHandler: function(event, position){
            if (position != this._getScrollTop()){
               this._scrollTo(position);
               if (this._paging) {
                  this._calcPagingSelectedKey(position);
               }
            }
         },

         _onResizeHandler: function(){
            AreaAbstractCompatible._onResizeHandler.apply(this, arguments);
            this._resizeInner();
         },

         _resizeInner: function () {
            if (this._scrollbar){
               this._scrollbar.setContentHeight(this._getScrollHeight());
               this._scrollbar.setPosition(this._getScrollTop());
               this._recalcSizeScrollbar();
            }
            //ресайз может позваться до инита контейнера
            if (this._content) {
               this._addGradient();
               /**
                * В firefox при высоте = 0 на дочерних элементах, нативный скролл не пропадает.
                * В такой ситуации content имеет высоту скролла, а должен быть равен 0.
                * Поэтому мы вешаем класс, который убирает нативный скролл, если произойдет такая ситуация.
                */
               if (cDetection.firefox) {
                  this._content.toggleClass('controls-ScrollContainer__content-overflowHidden', !this._getChildContentHeight());
               }
               if (cDetection.isIE) {
                  // Баг в ie. При overflow: scroll, если контент не нуждается в скроллировании, то браузер добавляет
                  // 1px для скроллирования.
                  this._content.toggleClass('controls-ScrollContainer__content-overflowHidden', (this._getScrollHeight() - this._container.height()) === 1);
               }
               if (!this._options.takeScrollbarHidden) {
                  this._subscribeTakeScrollbar();
               }
            }

            if (this._paging) {
               /**
                * Меняем количество страниц, если высота не 0.
                * Если высота стала 0, то менять количество страниц не нужно, потому что определить сколько их нельзя, а
                * значит и определить на сколько прокручивать при переходе на другую страницу нельзя.
                */
               if (this._container.height()) {
                  this._setPagesCount(Math.ceil(this._getScrollHeight() / this._container.height()));
               }
            }
         },
         _recalcSizeScrollbar: function() {
            var headerHeight, scrollbarContainer;
            if (this._options.stickyContainer) {
               headerHeight = StickyHeaderManager.getStickyHeaderHeight(this._content);
               if (this._headerHeight !== headerHeight) {
                  scrollbarContainer = this._scrollbar._container;
                  scrollbarContainer.css('margin-top', headerHeight);
                  scrollbarContainer.height('calc(100% - ' + headerHeight + 'px)');
                  this._headerHeight = headerHeight;
               }
            }
         },

         _getChildContentHeight: function() {
            var height = 0;
            Array.prototype.forEach.call(this._content.children(), function(item) {
               height += $(item).outerHeight(true);
            });

            return height;
         },

         _getScrollTop: function(){
            return this._content[0].scrollTop;
         },

         _scrollTo: function(value){
            this._content[0].scrollTop = value;
         },

         _getScrollHeight: function(){
            var height;
            height = this._content[0].scrollHeight;

            // TODO: придрот для правильного рассчета с модификатором __withHead
            // он меняет высоту скроллабара - из за этого получаются неверные рассчеты
            // убрать вместе с этим модификатором, когда будет шаблон страницы со ScrollContainer и фиксированой шапкой
            if (this.getContainer().hasClass('controls-ScrollContainer__withHead')){
               height -= 24;
            }
            return height;
         },

         destroy: function(){
            if (this._content) {
               this._content.off('scroll', this._onScroll);
            }
            this._container.off('mousemove', this._initScrollbar);
            this._unsubscribeMouseEnterLeave();
            this._getScrollContainerChannel()
               .unsubscribe('onReturnTakeScrollbar', this._returnTakeScrollbarHandler)
               .unsubscribe('onRequestTakeScrollbar',  this._requestTakeScrollbarHandler);

            BaseCompatible.destroy.call(this);
            // task: 1173330288
            // im.dubrovin по ошибке необходимо отключать -webkit-overflow-scrolling:touch у скролл контейнеров под всплывашками
            delete FloatAreaManager._scrollableContainers[ this.getId() ];
         },
         //region retail_offlain
         _bindOfflainEvents: function() {
            if (constants.browser.retailOffline) {
               this._content[0].addEventListener('touchstart', function (event) {
                  this._startPos = this._content.scrollTop() + event.targetTouches[0].pageY;
               }.bind(this), true);
               // На движение пальцем - сдвигаем положение
               this._content[0].addEventListener('touchmove', function (event) {
                  this._moveScroll(this._startPos - event.targetTouches[0].pageY);
                  event.preventDefault();
               }.bind(this));
            }
         },
         _moveScroll: function(top) {
            this._content.scrollTop(top);
         },
         //endregion retail_offlain

         _initPaging: function() {
            if (this._options.isPaging) {
               requirejs(['js!SBIS3.CONTROLS.Paging'], function(paging) {
                  this._paging = new paging({
                     element: this._container.find('.js-controls-ScrollContainer__paging'),
                     className: 'controls-ScrollContainer__paging controls-ListView__scrollPager',
                     visiblePath: this._options.navigationToolbar,
                     parent: this
                  });
                  if (this._container.height()) {
                     this._setPagesCount(Math.ceil(this._getScrollHeight() / this._container.height()));
                  }
                  this._paging.subscribe('onSelectedItemChange', this._pageChangeHandler.bind(this));
                  this._page = 1;
               }.bind(this));
            }
         },

         _setPagesCount: function(count) {
            this._paging.setPagesCount(count);
            if (count === 1) {
               this._paging.hide();
            } else {
               this._paging.show();
            }
         },

         _pageChangeHandler: function(event, nPage) {
            var scrollTop = this._container.height() * (nPage - 1);
            if (this._page !==  nPage) {
               this._page = nPage;
               this._scrollTo(scrollTop);
            }
         }
      });

      return ScrollContainer;
   });
