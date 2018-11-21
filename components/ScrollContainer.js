define('SBIS3.CONTROLS/ScrollContainer', [
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/ScrollContainer/Scrollbar',
      'tmpl!SBIS3.CONTROLS/ScrollContainer/ScrollContainer',
      'Core/helpers/Hcontrol/isElementVisible',
      'Core/detection',
      'Lib/StickyHeader/StickyHeaderManager/StickyHeaderManager',
      'Core/constants',
      'Core/EventBus',
      'Core/CommandDispatcher',
      'SBIS3.CONTROLS/ScrollContainer/ScrollWidthController',
      'Controls/Popup/Compatible/ManagerWrapper/Controller',
      'css!SBIS3.CONTROLS/ScrollContainer/ScrollContainer'
   ],
   function (CompoundControl,
             Scrollbar,
             template,
             isElementVisible,
             cDetection,
             StickyHeaderManager,
             constants,
             EventBus,
             CommandDispatcher,
             ScrollWidthController,
             ManagerWrapperController
   ) {
      'use strict';

      /**
       * Класс контрола "Контейнер для контента с тонким скроллом". В качестве тонкого скролла применяется класс контрола {@link SBIS3.CONTROLS/ScrollContainer/Scrollbar}.
       *
       * @class SBIS3.CONTROLS/ScrollContainer
       * @extends SBIS3.CONTROLS/CompoundControl
       * @author Журавлев М.С.
       *
       * @remark
       * Пример 1:
       * Для работы SBIS3.CONTROLS/ScrollContainer требуется установить CSS-свойства height или max-height:
       * <ul>
       *    <li>Когда установлено свойство height, тонкий скролл появится, если высота контента (см. {@link content}) станет больше установленной высоты SBIS3.CONTROLS.ScrollContainer.</li>
       *    <li>Когда установлено свойство max-height, то SBIS3.CONTROLS/ScrollContainer будет растягиваться по мере увеличения контента. Когда размер контента превысит max-height, тогда появится тонкий скролл.</li>
       * </ul>
       *
       * <pre class="brush: html">
       *    <component data-component="SBIS3.CONTROLS/ScrollContainer" class="myScrollContainer">
       *       <option name="content">
       *          <component data-component="SBIS3.CONTROLS/ListView">
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
       * Пример 2:
       * Для перерасчетов размеров SBIS3.CONTROLS/ScrollContainer необходимо:
       * <pre class="brush: html">
       * this._notifyOnSizeChanged(true)
       * </pre>
       * control - экземпляр класса любого родительского контрола, в котором есть ScrollContainer
       *
       * Чтобы зафиксировать блок внутри ScrollContainer, на блок нужно навесить класс "ws-sticky-header__block";
       * чтобы при скролле блок прилипал к верхней части контейнера, нужно на контейнер навесить класс "ws-sticky-header__parent".
       * Подробно фиксация блоков описана в разделе <a href="/doc/platform/developmentapl/interface-development/ready-solutions/fixed-header/">Фиксация шапки страниц и всплывающих панелей</a>.
       *
       * @cssModifier controls-ScrollContainer__light Устанавливает светлый тонкий скролл.
       * @cssModifier controls-ScrollContainer__hiddenScrollbar Скрывает отображение ползунка.
       * @cssModifier controls-ScrollContainer__flex Модификатор применяется в тех случаях, когда контрол встроен внутрь flex-контейнера.
       *
       * @demo Examples/ScrollContainer/MyScrollContainer/MyScrollContainer Использование SBIS3.CONTROLS/ScrollContainer с автоподгрузкой вниз и с вложенным в него списком, который создан на основе класса {@link SBIS3.CONTROLS/ListView}.
       *
       * @control
       * @public
       * @initial
       * <component data-component='SBIS3.CONTROLS/ScrollContainer' name="MyScrollContainer>
       *     <option name="content">
       *         <component data-component="SBIS3.CONTROLS/ListView" name="ContentList">
       *             <option name="idProperty">key</option>
       *             <option name="displayProperty">title</option>
       *         </component>
       *     </option>
       * </component>
       */
      var ScrollContainer = CompoundControl.extend(/** @lends SBIS3.CONTROLS/ScrollContainer.prototype */{
         _dotTplFn: template,
         $protected: {
            _options: {
               /**
                * @cfg {Content} Контент в ScrollContainer
                * @remark
                * Контент в ScrollContainer - это пользовательская верстка, которая будет скроллироваться.
                * @example
                * <pre class="brush: html">
                *    <option name="content">
                *       <component data-component="SBIS3.CONTROLS/ListView">
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

               activableByClick: false,
               /**
                * @cfg {Boolean}
                */
               isPaging: false,
               /**
                * @cfg {String}
                * @variant none тень отсутствует.
                * @variant standart.
                */
               shadowStyle: 'standart',
               /**
                * @cfg {Object}
                */
               navigationToolbar: {
                 /**
                  * @cfg {Boolean}
                  * @name SBIS3.CONTROLS/ScrollContainer#navigationToolbar.begin
                  */
                  begin: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS/ScrollContainer#navigationToolbar.prev
                   */
                  prev: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS/ScrollContainer#navigationToolbar.pages
                   */
                  pages: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS/ScrollContainer#navigationToolbar.next
                   */
                  next: false,
                  /**
                   * @cfg {Boolean}
                   * @name SBIS3.CONTROLS/ScrollContainer#navigationToolbar.end
                   */
                  end: false
               },
               takeScrollbarHidden: true
            },
            _content: null,

            /**
             * Indicates that user drags the scrollbar at the moment.
             */
            _scrollbarDragging: false
         },

         $constructor: function() {
            // Что бы при встаке контрола (в качетве обертки) логика работы с контекстом не ломалась,
            // сделаем свой контекст прозрачным
            this._headerHeight = 0;
            this._craftedContext = false;
            this._context = this._context.getPrevious();
            // на resizeYourself команду перерисовываем только себя, не трогая children.
            // Сейчас команда отправляется только из ListView когда его items изменились (а значит могли измениться размеры)
            CommandDispatcher.declareCommand(this, 'resizeYourself', function () {
               this._resizeInner();
            }.bind(this));
         },

         _modifyOptions: function(cfg) {
            var cfg = ScrollContainer.superclass._modifyOptions.apply(this, arguments);
            cfg._isMobileIOS = cDetection.isMobileIOS;
            return cfg;
         },

         _modifyOptionsAfter: function(finalConfig) {
            // удаляем опцию content только на сервере, на клиенте опция должна остаться
            if (typeof window === 'undefined') {
               delete finalConfig.content;
            }
         },

         init: function() {
            ScrollContainer.superclass.init.call(this);
            var showScrollbar;


               this._content = $('> .controls-ScrollContainer__content', this.getContainer());
               showScrollbar = !(cDetection.isMobileIOS || cDetection.isMobileAndroid);
               this._bindOfflainEvents();
               //Под android оставляем нативный скролл
               if (showScrollbar){
                  this._hideScrollbar = this._hideScrollbar.bind(this);
                  this._initScrollbar = this._initScrollbar.bind(this);
                  this._mouseEnterHandler = this._mouseEnterHandler.bind(this);
                  this._container.on('mouseenter', this._mouseEnterHandler);

                  /**
                   * Если при создании контрола курсор мыши будет находиться на нем, то мы ожидаем, что при смещении мыши сработает
                   * событие mouseenter, а потом mousemove. Но так не происходит. Событие mouseenter не срабатывает. Причина в том, что
                   * событие mouseenter срабатывает, когда мышь пересекает границы DOM элемента. В нашем сценарии такого не происходит.
                   * Чтобы учесть такую ситуации, мы выполним обработчик mouseenter единажды на mousemove. Чтобы не получилось, что обработчик
                   * выполнится 2 раза, мы должны будем отписать от mousemove, если произойдет mouseenter.
                   * Сценарий: https://online.sbis.ru/opendoc.html?guid=9ddf9803-d00c-44a9-ad5f-699d4575cada
                   */
                  this._container.one('mousemove', this._mouseEnterHandler);
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

               // Что бы до инициализации не было видно никаких скроллов
               this._content.removeClass('controls-ScrollContainer__content-overflowHidden');

               // Скрываем нативный скролл.
               this._hideBrowserScrollbar();
               this._hideBrowserScrollbar = this._hideBrowserScrollbar.bind(this);
               ScrollWidthController.add(this._hideBrowserScrollbar);

               this._initPaging();
               this._resizeInner();
         },

         _hideBrowserScrollbar: function(){
            var width = ScrollWidthController.width(),
               style = {
                  marginRight: -width
               };

            this._content.css(style);
         },

         _stickyHeadersChangedHandler: function() {
            if (this._scrollbar) {
               this._recalcSizeScrollbar();
            }
         },

         _toggleGradient: function() {
         	var maxScrollTop;

         	// Не устанавливаем тень у контейнера с 0 высотой.
         	if (this._getContainerHeight() && this._options.shadowStyle !== 'none') {
               // $elem[0].scrollHeight - integer, $elem.height() - float
               maxScrollTop = this._getScrollHeight() - this._getContainerHeight();
               // maxScrollTop > 1 - погрешность округления на различных браузерах.
               this._container.toggleClass('controls-ScrollContainer__bottom-gradient', maxScrollTop > 1 && this._getScrollTop() < maxScrollTop);
               this._container.toggleClass('controls-ScrollContainer__top-gradient', this._getScrollTop() > 0);
            }
         },

         _initScrollbar: function(){
            if (!this._scrollbar) {
               this._scrollbar = new Scrollbar({
                  element: $('> .controls-ScrollContainer__scrollbar', this._container),
                  contentHeight: this._getScrollHeight(),
                  position: this._getScrollTop(),
                  parent: this
               });

               this.subscribeTo(this._scrollbar, 'onScrollbarDrag', this._scrollbarDragHandler.bind(this));
               this.subscribeTo(this._scrollbar, 'onScrollbarStartDrag', this._setScrollbarDragging.bind(this, true));
               this.subscribeTo(this._scrollbar, 'onScrollbarEndDrag', this._setScrollbarDragging.bind(this, false));
               this._resizeInner();
            }
            this._toggleGradient();
         },

         _mouseEnterHandler: function() {
            if (!this._hasInitScrollbar) {
               this._initScrollbar();
               this._hasInitScrollbar = true;
            }

            if (this._hasOnMouseEnter) {
               this._onMouseenter();
            }

            /**
             * Отпишем обработчик mouseenter от события mousemove, потому что подписка осуществлялась на случай,
             * если mouseenter не сработал.
             */
            this._container.off('mousemove', this._mouseEnterHandler);
         },

         /**
          * Updates scrollbarDragging flag. Indicates that user drags the scrollbar at the moment.
          *
          * @param dragging
          * @private
          */
         _setScrollbarDragging: function (dragging) {
            this._scrollbarDragging = dragging;
         },

         /**
          * Return true if the user is dragging the scrollbar.
          */
         isScrollbarDragging: function () {
            return this._scrollbarDragging;
         },

         // Показать скролл
         _showScrollbar: function() {
            this._scrollbar._container.toggleClass('controls-ScrollContainer__scrollbar_show', true);
         },

         //Скрыть скролл
         _hideScrollbar: function() {
            this._scrollbar._container.toggleClass('controls-ScrollContainer__scrollbar_show', false);
         },

         _subscribeOnScroll: function(){
            this._content.on('scroll', this._onScroll.bind(this));
         },

         _subscribeTakeScrollbar: function() {
            if (this._getScrollHeight() - this._getContainerHeight() > 1) {
               this._subscribeMouseEnterLeave();
            } else {
               this._unsubscribeMouseEnterLeave();
            }
         },

         _subscribeMouseEnterLeave: function() {
            this._hasOnMouseEnter = true;
            this._container.on('mouseleave', this._onMouseleave);
         },

         _unsubscribeMouseEnterLeave: function() {
            this._hasOnMouseEnter = false;
            this._container.off('mouseleave', this._onMouseleave);
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
            this._toggleGradient();
            ManagerWrapperController.scrollHandler();
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
            var page = position / this._getContainerHeight();
            if (!(page % 1)) {
               page += 1;
            } else {
               page = Math.ceil(page);
               if (page + 1 === this._paging.getPagesCount()) {
                  page += 1;
               }
            }
            if (this._page !== page) {

               /**
                * Может быть так, что номер страницы, к которой нам нужно проскролить, будет больше, чем
                * количество страниц.
                * Например положив ListView и включив подгрузку данных. Если в момент подгрузки,
                * пока данные ещё не отрисовались и не произошел resize нажать на кнопку paging вперед, то номер страницы
                * будет больше общего числа страниц, потому что ещё не произошли пересчеты размеров. Поэтому мы возьмем
                * в качестве текущей страницы минимальное из переданного числа и текущего общего числа страниц.
                */
               page = Math.min(page, this._paging.getPagesCount());

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
            ScrollContainer.superclass._onResizeHandler.apply(this, arguments);
            this._resizeInner();
         },

         /**
          * Переключение активности нативного скролла.
          * @param flag активность нативного скролла.
          * @private
          */
         _toggleOverflowHidden: function(flag) {
            this._content.toggleClass('controls-ScrollContainer__content-overflowHidden', flag);
            /**
             * Класс controls-ScrollContainer__content-overflowHidden отключает нативный скролл на контенте.
             * Из-за того что скрытие нативного скролла происходит через смещение контента на ширину скролла,
             * нужно убирать смещение, если нативный скролл отключен или добавлять его в противном случае.
             */
            if (flag) {
               this._content.css({
                  marginRight: 0,
                  paddingRight: 0
               });
            } else {
               this._hideBrowserScrollbar();
            }
         },

         _resizeInner: function () {
            if (this._scrollbar){
               this._recalcSizeScrollbar();
               this._scrollbar.setContentHeight(this._getScrollHeight());
               this._scrollbar.setPosition(this._getScrollTop());
            }
            //ресайз может позваться до инита контейнера
            if (this._content) {
               this._toggleGradient();
               /**
                * В firefox при высоте дочерних элементав < высоты скролла(34px) и резиновой высоте контейнера через max-height, нативный скролл не пропадает.
                * В такой ситуации content имеет высоту скролла, а должен быть равен высоте дочерних элементав.
                * Поэтому мы вешаем класс, который убирает нативный скролл, если произойдет такая ситуация.
                */
               if (cDetection.firefox) {
                  this._toggleOverflowHidden(this._getScrollHeight() ===  Math.floor(this._container.height()) && this._getScrollHeight() < 35);
               }
               if (cDetection.isIE) {
                  // Баг в ie. При overflow: scroll, если контент не нуждается в скроллировании, то браузер добавляет
                  // 1px для скроллирования.
                  this._toggleOverflowHidden(((this._getScrollHeight() - Math.floor(this._container.height())) <= 1));
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
               var containerHeight = this._getContainerHeight();
               if (containerHeight) {
                  this._setPagesCount(Math.ceil(this._getScrollHeight() / containerHeight));
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
            var height = 0, $item;
            Array.prototype.forEach.call(this._content.children(), function(item) {
               $item = $(item);
               // Метод outerHeight не учитывает видимость элемента, нужно учесть.
               height += isElementVisible($item) ? $(item).outerHeight(true) : 0;
            });

            return height;
         },

         _getScrollTop: function(){
            // Округляем в большую сторону, чтобы при маштабировании работать в целых числах.
            return Math.ceil(this._content[0].scrollTop);
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

         _getContainerHeight: function() {
            return this._container.get(0).offsetHeight;
         },

         destroy: function(){
            if (this._content) {
               this._content.off('scroll', this._onScroll);
            }
            this._container.off('mouseenter', this._mouseEnterHandler);
            this._container.off('mousemove', this._mouseEnterHandler);
            this._container.off('mousemove', this._initScrollbar);
            ScrollWidthController.remove(this._hideBrowserScrollbar);
            this._unsubscribeMouseEnterLeave();
            this._getScrollContainerChannel()
               .unsubscribe('onReturnTakeScrollbar', this._returnTakeScrollbarHandler)
               .unsubscribe('onRequestTakeScrollbar',  this._requestTakeScrollbarHandler);

            ScrollContainer.superclass.destroy.call(this);
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
               requirejs(['SBIS3.CONTROLS/Paging'], function(paging) {
                  if (!this.isDestroyed()) {
                     this._paging = new paging({
                        element: this._container.children('.js-controls-ScrollContainer__paging'),
                        className: 'controls-ScrollContainer__paging controls-ListView__scrollPager',
                        visiblePath: this._options.navigationToolbar,
                        parent: this
                     });
                     var containerHeight = this._getContainerHeight();
                     if (containerHeight) {
                        this._setPagesCount(Math.ceil(this._getScrollHeight() / containerHeight));
                     }
                     this._paging.subscribe('onSelectedItemChange', this._pageChangeHandler.bind(this));
                     this._page = 1;
                  }
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
            var scrollTop = this._getContainerHeight() * (nPage - 1);
            if (this._page !==  nPage) {
               this._page = nPage;
               this._scrollTo(scrollTop);
            }
         }
      });

      return ScrollContainer;
   });
