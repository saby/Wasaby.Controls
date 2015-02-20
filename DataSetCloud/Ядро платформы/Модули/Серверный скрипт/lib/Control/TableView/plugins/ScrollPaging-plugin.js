/**
 * Created with JetBrains PhpStorm.
 * User: ad.chistyakova
 * Date: 03.03.2014
 * Time: 12:55
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.ScrollPaging', [ 'js!SBIS3.CORE.TableView',  'js!SBIS3.CORE.HierarchyView', 'js!SBIS3.CORE.TreeView' ], function(TableView) {

/**
 * @class   $ws.proto.TableView.ScrollPlugin
 * @extends $ws.proto.TableView
 * @plugin
 */
$ws.proto.TableView.ScrollPlugin = TableView.extendPlugin(/** @lends $ws.proto.TableView.ScrollPlugin.prototype */{
   $withoutCondition: [ '_onDataLoaded' ],
   $protected: {
      _options: {
         display: {
            /**
             * @cfg {Boolean} Отрабатывать пейджинг по скроллу - подгружать данные по скроллу
             * <wiTag group="Управление">
             * @group Paging
             */
            scrollPaging : false,
            /**
             * @cfg {Boolean} Использовать ли заданные в браузере количество запрашиваемых записей с БЛ
             * true - при запросе со скролл-рекордсете будут уходить заданные в браузере
             * false - в запрос будут уходить количество записей, рассчитанное по размерам экрана
             */
            constantRecordsPerPage: false
         }
      },
      _ready: undefined,                           //deferred готовности рекордсета
      _scrollRecordSet: undefined,                 //Рекордсет для получения данных
      _scrollDeferred: undefined,
      _firstLoad : true,
      _nowLoading: false,
      _loadingIndicator: undefined,                 //Индикатор подгрузки данных
      _onBeforeBodyMarkupChangedHandler: undefined,
      _allowLoading: true                          //Разрешение догрузки по скроллу
   },
   $condition: function() {
      return (!this.isDestroyed() && !this.isTree() && this._options.display.scrollPaging);
   },
   $constructor: function() {
      this._onRecordUpdated = this._onRecordUpdated.callBefore(this._onBeforeRecordUpdated);
      this.reload = this.reload.callBefore(this._reload);
      this._scrollDeferred = new $ws.proto.Deferred();
      this._addLoadingIndicator();
      if (this.isHierarchy()) {
         this._expandAll = this._expandAll.callNext(this._expandAllScroll);
         this._clearExpandAll = this._clearExpandAll.callNext(this._clearExpandAllScroll);
      }
   },
   /**
    * Получить рекордсет скролла
    * @returns {$ws.proto.Deferred} возвращает Deferred скролл рекордсета
    */
   getScrollRecordSet: function(){
      return this._scrollDeferred.isReady() ? new $ws.proto.Deferred().callback(this._scrollRecordSet) : this._scrollDeferred;
   },
   _checkScrollPaging: function() {
      return false;
   },
   _configChecking: function(){
      //Отключаем контрол пейджинг
      this._options.display.showPaging = false;
      this._options.display.showRecordsCount = false;
      this._options.display.usePaging = 'parts';
      this._options.cssClass += ' ws-browser-ignore-local-page-size';
      //$ws._const.Browser.minHeight - минимальная высота строки - сейчас 24
      this._options.display.recordsPerPage = this._options.display.constantRecordsPerPage ?
            this._options.display.recordsPerPage :
            parseInt(($(window).height() / $ws._const.Browser.minHeight ) + 10 , 10);
   },
   /**
    * Мы достигли дна... и снизу постучали!
    * @returns {boolean}
    * @private
    */
   _isBottomOfPage : function(target) {
      var docBody = target || document.body,
            docElem = target || document.documentElement,
            clientHeigth = Math.min (docBody.clientHeight, docElem.clientHeight),
            scrollTop = Math.max (docBody.scrollTop, docElem.scrollTop),
            scrollHeight = Math.max (docBody.scrollHeight, docElem.scrollHeight),
            parent = this.getTopParent();
      if (!clientHeigth) {
         clientHeigth = Math.max (docBody.clientHeight, parent ? parent.getContainer().height() : 0);
      }
      return (clientHeigth + scrollTop >= scrollHeight - $ws._const.Browser.minHeight);
   },
  /**
   *  Общая проверка и загрузка данных для всех событий по скроллу
   */
   _checkForLoad: function(result){
      if (result && !this._nextLoad()) {
         this._removeLoadingIndicator();
      }
   },
   _onContainerScroll: function(event){
      var scrollTop = $(event.target).scrollTop(),
      //на самом деле loadingIndicator десь должен быть всегда, но подстраховаться не помешает
          check = this._loadingIndicator ? scrollTop + $ws._const.Browser.minHeight >= this._loadingIndicator.offset().top : false;
      //Проверка на обычный скролл в контейнере браузера
      this._checkForLoad(check);
   },
   _onWindowScroll: function(){
      //Может тут проверить на открыту. всплывашку RFA? и не грузить данные лишний раз....
      this._checkForLoad(this._isBottomOfPage());
   },
   _onFAScroll: function(event, scrollOptions) {
      this._checkForLoad(scrollOptions.clientHeight + scrollOptions.scrollTop >= scrollOptions.scrollHeight);
   },
   _initScrollRecordSet: function(){
      var cfg = $ws.core.merge( {}, this._options.dataSource, {clone: true}),
          self = this;
      cfg.usePages = 'parts';
      cfg.handlers = {
         'onBeforeLoad': this._onBeforeNextLoad.bind(this),
         'onAfterLoad': this._onNextDataLoaded.bind(this)
      };
      cfg.firstRequest = false;
      cfg.waitForPrevQuery = true;
      cfg.context = self.getRecordSet().getContext(); //А НАДО ЛИ??
      if (!this._currentRecordSet.hasNextPage(true)) {
         this._nowLoading = false;
         this._removeLoadingIndicator();
      }
      this._ready = $ws.core.attachInstance('Source:RecordSet', cfg).addCallback(function(instance){
         var topParent = this.getTopParent();
         this._scrollRecordSet = instance;
         //синхронизируем фильтры текущего рекордсета и скроллрекордсета перед первой загрузкой, но не чистим filterParams
         this._scrollRecordSet.setQuery($ws.core.merge(this._scrollRecordSet.getUpdatedQuery(), this._currentRecordSet.getQuery()), false, undefined, true);
         this._scrollDeferred.callback(instance);
         $(window).bind('scroll.wsScrollPaging', this._onWindowScroll.bind(this));
         //Обработка открывающихся стек-панелей
         $ws.single.EventBus.globalChannel().subscribe('onBeforeBodyMarkupChanged',
               self._onBeforeBodyMarkupChangedHandler = self._onBeforeBodyMarkupChanged.bind(self));
         //Если скролл сможет появляться и у контейнера, подпишимся на его скролл()
         if (!this._isHeightGrowable()) {
            this.getContainer().find('.ws-browser-container').bind('scroll', this._onContainerScroll.bind(this));
         }
         if ($ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')){
            //Если браузер лежит на всплывающей панели и имеет автовысоту, то скролл появляется у контейнера всплывашки (.parent())
            topParent.subscribe('onScroll', this._onFAScroll.bind(this));
         }
         this._currentRecordSet.subscribe('onPageChange', function(event, pageNum){
            // нужен из-за LoadNode, но так же срабатывает, когда ставим сами( плохой хак на страницу, но лучше пока нет
            if (pageNum > 0) {
               self._scrollRecordSet.setPage(pageNum, true);
            }
         });
         this._loadBeforeScrollAppears();
         return instance;
      }.bind(this));
   },
   _onBeforeBodyMarkupChanged:function(event, changeEventArg){
      if ($ws.helpers.isElementVisible(this.getContainer())) {
         if (changeEventArg.floatAreaStack) {
            $(window).unbind('.wsScrollPaging');
            $(changeEventArg.contentScrollBlock).bind('scroll.wsScrollPaging', this._onContainerScroll.bind(this));
         } else {
            $(window).bind('scroll.wsScrollPaging', this._onWindowScroll.bind(this));
            $(changeEventArg.contentScrollBlock).unbind('.wsScrollPaging');
         }
      }
   },
   /**
    * Загрузка данных в скролл-рекордсет
    * @returns {boolean} true - если загрузка будет, false в противном случае
    * @private
    */
   _nextLoad: function(){
      var  pageNum;
      if (this.isHierarchy() && this._turn !== '') {
         return false;
      }
      //Пока решили не трогать isRecordFloatAreaOpen
      if (this._allowLoading && $ws.helpers.isElementVisible(this.getContainer()) &&
            !this._nowLoading && this._scrollRecordSet &&
            (this._scrollRecordSet.hasNextPage(true) || (this._firstLoad && this._currentRecordSet.hasNextPage(true)))) {
         pageNum = this._scrollRecordSet.getPageNumber() + 1;
         this._scrollRecordSet.setPage(pageNum, false, false);
         this._addLoadingIndicator();
         return true;
      }
      this.getContainer().addClass('ws-ScrollPaging__dataLoaded');
      return false;
   },
   /**
    * Разрешить или запретить подгрузку данных по скроллу.
    * @param {Boolean} allow - true - разрешить, false - запретить
    * @param {Boolean} [noLoad] - true - не загружать сразу
    */
   setAllowScrollLoading: function(allow, noLoad){
      this._allowLoading = allow;
      if (allow) {
         if (!noLoad && this._nextLoad()) {
            this._addLoadingIndicator();
            return;
         }
      }
      this._removeLoadingIndicator();
   },
   /**
    * При начале загрузки добавляет индикатор в меню
    */
   _onBeforeNextLoad: function(){
      this._nowLoading = true;
      this.getContainer().removeClass('ws-DataViewAbstract__dataLoaded ws-ScrollPaging__dataLoaded');
   },
   /**
    * Обработчик загрузки данных в рекордсете
    * @param {Object} event Объект события
    * @param {$ws.proto.RecordSet} recordSet Рекордсет, в котором произошла загрузка
    * @param {Boolean} isSuccess Успешно ли прошла загрузка
    * @param {Error} error Ошибка, которая могла появиться во время загрузки
    * @private
    */
   _onNextDataLoaded: function(event, recordSet, isSuccess, error){
      var records,
         length;
      this._nowLoading = false;
      if(isSuccess){
         records = recordSet.getRecords();
         this._firstLoad = false;
         this.getContainer().addClass('ws-DataViewAbstract__dataLoaded');
         //почему-то люди считают нормальным то, что в основной рекордсет не загрузились данные, а по скроллу вдруг начали подгружаться...
         //поэтому тут нам придется проверить были ли записи в основном рекодсете и скрыть текст отсутствия записей
         if(!this._currentRecordSet.getRecordCount() && records.length){
            if (this._emptyDataText) {
               this._emptyDataBlock.addClass('ws-hidden');
            }
         }
         //для табличного представления будем дорисовывать сами
         this._currentRecordSet.appendRecords(records, !this.isHierarchyMode());
         if (!this.isHierarchyMode() && this._onBeforeRenderActions()) {
            this._drawLoadedRecords(records);
         }
         length = this._currentRecordSet.getRecords().length;
         if (length) {
            this._currentRecordSet.setPageSize(length, true);
         }
         this._loadBeforeScrollAppears();
      }
      if (!isSuccess || (!this._currentRecordSet.hasNextPage(true) && !this._scrollRecordSet.hasNextPage(true))) {
         this._removeLoadingIndicator();
      }
   },
   _drawLoadedRecords: function(records){
      var container;

      this._scrollRecordSet.rewind();
      if (!records.length) {
         return;
      }
      this._createRecordsTemplate(records).addCallback(function (tableBody) {
         this._body.find('tr:last').removeClass('ws-browser-no-table-row-last');

         //Сделаем временный tbody для правильной работы пользовательского рендера
         container = this._getBodyContainer().html(tableBody);
         this._applyRowRender(this._scrollRecordSet, container);
         this._body.append(container.children());
         container.find('tr:last').addClass('ws-browser-no-table-row-last');
         this.recalcBrowserOnDOMChange();
      }.bind(this));
   },
   _onDataLoaded : function(event, recordSet, isSuccess, error){
      if (isSuccess) {
         if (!this._scrollRecordSet) {
            this._initScrollRecordSet();
         }
         else {
            this._scrollRecordSet.rewind();
         }
      }
   },
   _loadBeforeScrollAppears: function() {
      //Костыльное решение. Оказывается, если я попросила 50 записей и мне отдали 2 - это нормально
      //Так что пока не появится скролл догружаем данные по очереди
      //TODO убрать, когда появится лучшее решение + не забыть убрать css-класс
      if (this._currentRecordSet.getRecords().length <= parseInt(($(window).height() /  $ws._const.Browser.minHeight ) + 10 , 10)){
         /*this._options.display.recordsPerPage*/
         if (this._nextLoad()) {
            this._addLoadingIndicator();
         } else {
            this._removeLoadingIndicator();
         }
      } else {
         if (!this._nowLoading) {
            this._removeLoadingIndicator();
         }
      }
   },
   _addLoadingIndicator: function(){
      if (!this._loadingIndicator ) {
         this._loadingIndicator = $('<img />', {
            'src': $ws.helpers.getImagePath('AreaAbstract|ajax-loader-indicator.gif'),
            'class': 'ws-browser-scroll-loading-indicator'
         }).appendTo(this._browserContainer);
      } else {
         this._loadingIndicator.removeClass('ws-hidden');
      }
   },
   _showLoadingIndicatorInTime: function(){
      //Тут  повявляется основной индикатор из браузера. По таймауту. Чтобы не было двух ромашек убираем эту.
      if (this._loadingIndicator) {
         this._loadingIndicator.addClass('ws-hidden');
      }
   },
   _clearTimeOutLoadingIndicator: function(){
      if (this._nowLoading) {
         this._addLoadingIndicator();
      }
   },
   /**
    * Удаляет индикатор загрузки
    * @private
    */
   _removeLoadingIndicator: function(){
      if( this._loadingIndicator && !this._nowLoading){
         this._loadingIndicator.addClass('ws-hidden');
      }
   },
   _resetScrollRecordSet : function(){
      this._scrollRecordSet.setPage(1, true, false);
      this._currentRecordSet.setPageSize(this._options.display.recordsPerPage, true);
   },
   _reload: function () {
      this._nowLoading = true;
      if (this._currentRecordSet && this._currentRecordSet.getRecordCount() < this._options.display.recordsPerPage) {
         this._currentRecordSet.setPageSize(this._options.display.recordsPerPage, true);
      }
   },
   _folderEnterScroll: function(id, res) {
      this._removeLoadingIndicator();
      this._scrollRecordSet.abort(true);
      this._resetScrollRecordSet();
      //Загрузка будет в методе _folderEnter HV
      //this._scrollRecordSet.loadNode(id, false, 0, false);
   },
   _onBeforeRecordUpdated: function(full, parents){

      //чтобы скролл продолжал отрабатывать или догрузить последнюю запись
      if (!this._scrollRecordSet.hasNextPage(true)) {
         this._currentRecordSet.setPageSize(this._currentRecordSet.getRecords().length + 1, true);
      }
   },
   _setPageSize: function(pageCount, noLoad){
      this._scrollRecordSet.setPageSize(pageCount, noLoad);
   },
   _runQuery : function(filter, doClear) {
      var self = this,
         afterLoadHandler = function(){
            //filter может прийти неправильный, синхронизируем с текущим фильтром в рекордсете
            self._resetScrollRecordSet();
            //Загрузим ниже
            self.setAllowScrollLoading(true, true);
            self._nowLoading = !self._currentRecordSet.hasNextPage(true) ? false : self._nowLoading;
            self._scrollRecordSet.setQuery(self._currentRecordSet.getQuery(), doClear, undefined, !self._currentRecordSet.hasNextPage(true));
            self._removeLoadingIndicator();
            self._currentRecordSet.unsubscribe('onAfterLoad', afterLoadHandler);
         },
         onAbort = function(){
            self._nowLoading = false;
            self._scrollRecordSet.abort(true);
            self._currentRecordSet.unsubscribe('onAfterLoad', afterLoadHandler);
            self._currentRecordSet.unsubscribe('onAbort', onAbort);
            //TODO возможно потеряются фильтры?
            //Не нужно загружать свалившийся аборт.
            self.setAllowScrollLoading(true, true);
         };
      if (this._scrollRecordSet) {
         //обнуляем запомненные страницы
         this.setAllowScrollLoading(false);
         this._resetScrollRecordSet();
         //Сейчас удаление индикатора вызывается в loadBeforeScrollAppears, но после того как уберем костыль, проследить
         this._addLoadingIndicator();
         //Фильтр нам все равно надо ставить, а не вызывая загрузку данных мы это сделать не можем.
         // Но обязятельно вызывать загрузку после перезагрузки основного рекордсета (иначе записи потеряются)
         this._currentRecordSet.subscribe('onAfterLoad', afterLoadHandler);
         this._currentRecordSet.subscribe('onAbort', onAbort);
      }
   },
   _onResizeHandler: function() {

   },
   _expandAllScroll: function(withFolders, noLoad){
      this._nowLoading = true;
   },
   _clearExpandAllScroll: function(noLoad){
      this._nowLoading = false;
   },
   destroy: function() {
      if (this._scrollRecordSet) {
         //TODO правильный unbind для всех скроллов!

         $(window).unbind('.wsScrollPaging');
         $ws.single.EventBus.globalChannel().unsubscribe('onBeforeBodyMarkupChanged', this._onBeforeBodyMarkupChangedHandler);
         this._scrollRecordSet.destroy();
      }
      if( this._loadingIndicator ){
         this._loadingIndicator.remove();
         this._loadingIndicator = undefined;
      }
   }
});

});