/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 27.08.13
 * Time: 10:03
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.SearchString',
   [
      'js!SBIS3.CORE.Button',
      'js!SBIS3.CORE.FloatArea',
      'js!SBIS3.CORE.FieldString',
      'html!SBIS3.CORE.SearchString',
      'i18n!SBIS3.CORE.SearchString',
      'js!SBIS3.CORE.KbLayoutRevert',
      'css!SBIS3.CORE.SearchString',
      'css!SBIS3.CORE.LinkButton'
   ],
   function( Button, FloatArea, FieldString, dotTplFn, rk ) {

   'use strict';

    var FIELD_PADDING = 40;

   /**
    * @class $ws.proto.SearchString строка поиска
    * @extends $ws.proto.FieldString
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.SearchString' style='width: 100px'>
    * </component>
    * @category Fields
    * @designTime actions /design/design
    * @ignoreOptions password
    */
   $ws.proto.SearchString = FieldString.extend(/** @lends $ws.proto.SearchString.prototype */{
      /**
        * @event onBeforeApplyFilter Перед началом поиска
        * Событие происходит перед началом поиска по связанному представлению данных.
        * От результата, возвращаемого из данного события, зависят дальнейшие действия.
        *
        * Возможные результаты:
        * <ol>
        *    <li>false - поиск не начинать.</li>
        *    <li>true - начать поиск в соответствии с заданным фильтром.</li>
        *    <li>object - использовать значения объекта как дополнительные фильтры связанного представления данных.
        *    Начать поиск по записям с использованием заданного и дополнительных фильтров.
        *    </li>
        * </ol>
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Object} filter Объект с фильтрами, применёнными к связанному представлению данных.
        * @example
        * Перед началом поиска проверить наличие фильтров у связанного представления данных.
        * Если фильтров нет, то применить их.
        * <pre>
        *    searchString.subscribe('onBeforeApplyFilter', function(eventObject, filter) {
        *       if (Object.isEmpty(filter)) {
        *          eventObject.setResult({
        *             'Должность': 'Инженер',
        *            'Возраст': 30
        *          });
        *       }
        *    });
        * </pre>
        * @see linkedBrowser
        * @see filterName
        * @see useBrowserFilter
       */
      $protected: {
         _suggest: undefined,
         _buttons: [],
         _searchButton: null,
         _clearButton: null,
         _searchWindow: null,
         _currentBrowser: undefined,
         _wasSearched: false,
         _browserConverted: false,
         _searchFields: [],
         _filterStorage: [],
         _oldFilters: [],
         _paramWindowFirstShow: true,   //флаг первого показа окна доп. параметров, если в браузере после загрузки оказался нужный фильтр
         _allowSearch: true,
         _afterLoadHandler: undefined,
         _onConvertHandler: undefined,
         _onFolderEnterHandler: undefined,
         _windowPosition: undefined,
         _applyDebounced: null,
         _onChangeValidValue: undefined,    //последнее значение, при котором открывали окно дополнительных параметров
         _wasSuggestVisible: false,
         _wasAbort: false,
         _lastSearchedValue: undefined,
         _reverted: {},
         _options: {
            /**
             * 
             * @cfg {Boolean} Сбрасывать корень
             * <wiTag group="Управление">
             * Перед поиском в иерархических представлениях данных сбрасывается корень - поиск будет идти по всем папкам.
             */
            resetRoot: false,
            /**
             * @cfg {String} Связанное представление данных
             * Это строка формата "ИмяШаблона/ИмяСвязанногоПредставленияДанных".
             *
             * В качестве связанного представления данных могут выступать следующие контролы:
             * <ol>
             *    <li><a href='http://wi.sbis.ru/demo/TreeView'>дерево</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/TableView'>табличное представление</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/HierarchyView'>иерархическое представление</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/CustomView'>произвольное представление</a>.</li>
             * </ol>
             * <wiTag group="Данные">
             * @see setLinkedBrowser
             * @see getLinkedBrowser
             * @see name
             * @editor InternalBrowserChooser
             */
            linkedBrowser: '',
            /**
             * @cfg {String} Текст подсказки
             * <wiTag group="Отображение">
             * Текст всплывающей подсказки. По умолчанию установлено дублирование этого текста в качестве подсказки в
             * строку поиска - будет показана до момента ввода поискового параметра.
             * @see tooltipInside
             * @translatable
             */
            tooltip: rk('Введите параметры поиска'),
            /**
             * @cfg {String} Имя фильтра
             * <wiTag group="Управление">
             * Имя фильтра - это имя параметра фильтрации связанного представления данных.
             * Имя фильтра должно совпадать с именем поля связанного представления данных. По этому полю будет производиться поиск.
             * @see setFilterName
             * @see getFilterName
             * @see useBrowserFilter
             */
            filterName : '',
            /**
             * @cfg {String} Имя окна дополнительных параметров поиска
             * <wiTag group="Управление">
             * Окно дополнительных параметров поиска используется в тех случаях, когда одного фильтра недостаточно.
             * По умолчанию окно строится под строкой поиска: верхний левый угол окна крепится к её нижнему левому углу.
             * @see getParamsWindow
             * @see setWindowPosition
             * @editor ExternalComponentChooser
             */
            paramsWindow : '',
            /**
             * @cfg {Boolean} Учитывать фильтр представления данных
             * У связанного представления данных могут быть заданы свои фильтры. Их можно учитывать или нет.
             * Возможные значения:
             * <ol>
             *    <li>true - учитывать фильтры.</li>
             *    <li>false - не учитывать фильтры.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see linkedBrowser
             * @see filterName
             */
            useBrowserFilter: false,
            /**
             * @cfg {Boolean} Получать значение из контекста
             * Разрешить получение значения из контекста контрола.
             * Возможные значения:
             * <ol>
             *    <li>true - разрешить получение.</li>
             *    <li>false - запретить получение.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see setContextValueReceived
             */
            receiveContextValue: true,
            /**
             * @cfg {Boolean} Признак неактивности строки поиска при пустом представлении данных
             * Делать ли неактивной строку поиска в случае отсутствия записей в связанном представлении данных.
             * Возможные значения:
             * <ol>
             *    <li>true - сделать строку поиска неактивной.</li>
             *    <li>false - оставить строку поиска активной.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see linkedBrowser
             * @see enabled
             */
            disableAtEmptyBrowser: false,
            /**
             * @cfg {Number} Минимальная длина значения для начала автоматического поиска
             * <wiTag group="Управление">
             * Если данное значение больше 0, следовательно включен автоматический поиск, который активируется при достижении
             * минимальной длины вводимого поискового параметра, то есть поиск активируется без нажатия на кнопку лупы
             */
            startSearch: 0,
            /**
             * @cfg {Boolean} Сбрасывать поиск при заходе в папку
             */
            resetOnOpen: false,
            /**
             * @cfg {Boolean} Очищать параметры поиска на окне дополнительных параметров после изменения значения в строке поиска
             */
            clearParams: false,
            /**
             * @cfg {Boolean} Задает необходимость использовать механизм смены неверной раскладки
             * @see $ws.single.KbLayoutRevert
             */
            useKbLayoutRevert : false,
            /**
             * @cfg {Boolean} Дублировать ли текст {@link tooltip} внутрь строки поиска.
             * По умолчанию текст подсказки дублируется в строку поиска.
             * Возможные значения:
             * <ol>
             *    <li>true - дублировать.</li>
             *    <li>false - не дублировать.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see tooltip
             */
            tooltipInside: true
         }
      },
      $constructor: function(){
         if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9) {
            this._container.find('.ws-tooltip-container').width(this._container.width() - FIELD_PADDING);
         }
         this._applyDebounced = this.applySearch.debounce(750);
         this._publish('onBeforeApplyFilter', 'onResetFilter');
         this._declareCommands();
      },
      _dotTplFn: dotTplFn,
      _initEvents: function() {
         $ws.proto.SearchString.superclass._initEvents.apply(this, arguments);
         this.subscribe('onActivated', this._onActivatedHandler, true);
         this.subscribe('onValueChange', this._valueChangeHandler);
         this.subscribe('onKeyPressed', this._keyPressedHandler);
         this.subscribe('onChange', this._changeHandler);
         this.subscribe('onFocusOut', this._focusOutHandler);
         $(document).bind('mousedown.' + this.getId() + ' wsmousedown.' + this.getId(), this._mouseDownHandler);
         this._onConvertHandler = this._onConvert.bind(this);
      },
      /**
       * Обработчик на изменение значения строки поиска пользователем
       * @param {$ws.proto.EventObject} event дескриптор события
       * @param {String} value текущее значение
       * @private
       */
      _changeHandler: function(event, value){
         if (value === '') {
            if (this._currentBrowser && this._wasSearched) {
               this._currentBrowser.clearTextHighlight();
               this._resetFilter();
            } else {
               this.setValue(null);
            }
         } else if (this._options.startSearch > 0 && value.length >= this._options.startSearch) {
            //выполнить поиск, если поисковое значение достигло минимальной длины
            this._applyDebounced();
         }
      },
      /**
       * Обработчик на нажатие клавиш по строке поиска
       * @param {$ws.proto.EventObject} eventObject дескриптор события
       * @param {Event} e javaScript событие
       * @private
       */
      _keyPressedHandler: function(eventObject, e) {
         var currentActiveRow,
             newActiveRow,
             rowkey,
             isKeyUp,
             isKeyLeft;
         this._wasSuggestVisible = !!(this._suggest && this._suggest.isVisible());
         if (e.which === $ws._const.key.enter) {
            e.stopPropagation();
         } else if (this._currentBrowser) {
            //Если открыто автодополнение, то не обрабатываем нажатие клавиш на связанный браузер
            if (this._wasSuggestVisible) {
               return;
            }
            isKeyUp = e.which === $ws._const.key.up;
            isKeyLeft = e.which === $ws._const.key.left;
            currentActiveRow = this._currentBrowser.getActiveRow();
            //Если нет текущей активной записи, то активной записью станет первая
            newActiveRow = currentActiveRow ? $(currentActiveRow[(isKeyUp ? 'prev' : 'next') + 'All']().filter('[rowkey]')[0])
                                            : this._currentBrowser.getContainer().find('tr[rowkey]').eq(0);
            rowkey = newActiveRow.attr('rowkey');
            if (e.which === $ws._const.key.down || isKeyUp) {
               this._currentBrowser.setActiveRow(newActiveRow);
               this._currentBrowser.setActive(true);
               e.stopPropagation();
               e.preventDefault();
               return false;
            }
            if (this._currentBrowser.isTree() && (e.which === $ws._const.key.right || isKeyLeft)) {
               if (isKeyLeft === this._currentBrowser.isTreeFolderExpanded(rowkey) &&
                     this._currentBrowser.isRecordFolder(rowkey)) {
                  this._currentBrowser[isKeyLeft ? 'hideBranch' : 'showBranch'](rowkey);
                  eventObject.setResult(false);
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
               }
               eventObject.setResult(true);
               return true;
            }
         }
      },
      _fireOnActivated: function() {
         if (!this._wasSuggestVisible) {
            $ws.proto.SearchString.superclass._fireOnActivated.apply(this, arguments);
         } else {
            this._wasSuggestVisible = false;
         }
      },
      /**
       * Обработчик на изменение значения в строке поиска, обработка скрытия/появления крестика
       * @private
       */
      _valueChangeHandler: function() {
         if (String.trim(this.getStringValue()) === '') {
            this._hideCross();
         } else if (this._clearButton.getContainer().hasClass('ws-hidden')) {
            this._showCross();
         }
      },
      /**
       * Обработчик клика вне области строки поиска
       * @param {Event} e javaScript событие
       * @private
       */
      _mouseDownHandler: function(e) {
         //если у нас показано окно доп параметров, то по клику куда-то мимо потрудимся его закрыть
         if(this._searchWindow && this._searchWindow.isShow()){
            var element = $(e.target).closest('.ws-search-window, .ws-search-string');
            // если мы не нашли родителя, который живет в нашей строке поиска, то смело закрываем окно доп параметров
            if(element.length === 0){
               this._searchWindow.hide();
            }
         }
      },
      /**
       * Эта функция отлавливает уход фокуса со строки поиска и с окна доп параметров, чтобы окно доп параметров закрыть
       * @param {$ws.proto.EventObject} event дескриптор события
       * @param {Boolean} focus пришел или ушел фокус
       * @param {$ws.proto.Control} nextFocusControl следующий контрол, на который перешел фокус
       * @private
       */
      _focusOutHandler: function(event, focus, nextFocusControl){
         if(this._searchWindow && nextFocusControl){
            if(nextFocusControl.getTopParent() !== this._searchWindow && nextFocusControl !== this){
               this._searchWindow.hide();
            }
         }
      },
      _onPasteHandler: function() {
         if (!this._pasteProcessing && this.getStringValue() === this._onChangeValidValue) {
            this._onChangeResultHandler(true);
         }
      },
      _declareCommands: function(){
         $ws.single.CommandDispatcher.declareCommand(this, 'search', this._notifyOnActivated);
         $ws.single.CommandDispatcher.declareCommand(this, 'reset', this.resetSearch);
      },
      _notifyOnActivated: function(){
         this._notify('onActivated');
      },
      /**
       * Определить у строки поиска используемое на ней автодополнение
       * @example
       * При готовности автодополнения (suggest) определить его у строки поиска (searchString).
       * <pre>
       *    suggest.subscribe('onReady', function() {
       *       searchString.setSuggest(this);
       *    });
       * </pre>
       */
      setSuggest: function(suggest) {
         if ($ws.helpers.instanceOfModule(suggest, 'SBIS3.CORE.Suggest')) {
            this._suggest = suggest;
         }
      },
      /**
       * <wiTag group="Управление">
       * Начать поиск по заданным параметрам. При этом происходит событие {@link onActivated}.
       * @command search
       * @example
       * При нажатии клавиши Enter начать поиск. При нажатии клавиши Del сбросить результаты поиска.
       * <pre>
       *    //подписываемся на событие при нажатии клавиши
       *    searchString.subscribe('onKeyPressed', function(eventObject, event) {
       *       //проверяем код нажатой клавиши и разрешение на поиск
       *       if (event.which == $ws._const.key.enter && this.isAllowSearch()) {
       *          //начинаем поиск по заданным параметрам
       *          this.applySearch();
       *       } else if (event.which == $ws._const.key.del) {
       *          //сбрасываем результаты поиска
       *          this.resetSearch();
       *       }
       *    });
       * </pre>
       * @see resetSearch
       * @see isAllowSearch
       * @see onActivated
       */
      applySearch: function(){
         this._notifyOnActivated();
      },
      /**
       * <wiTag group="Управление">
       * Сбросить результат поиска. При этом происходит событие {@link onChange}.
       * @command reset
       * @example
       * При нажатии клавиши Enter начать поиск. При нажатии клавиши Del сбросить результаты поиска.
       * <pre>
       *    //подписываемся на событие при нажатии клавиши
       *    searchString.subscribe('onKeyPressed', function(eventObject, event) {
       *       //проверяем код нажатой клавиши и разрешение на поиск
       *       if (event.which == $ws._const.key.enter && this.isAllowSearch()) {
       *          //начинаем поиск по заданным параметрам
       *          this.applySearch();
       *       } else if (event.which == $ws._const.key.del) {
       *          //сбрасываем результаты поиска
       *          this.resetSearch();
       *       }
       *    });
       * </pre>
       * @see applySearch
       * @see isAllowSearch
       * @see onChange
       */
      resetSearch: function(){
         this._onChangeValidValue = undefined;
         if (this._searchWindow && this._searchWindow.isShow()) {
            this._searchWindow.hide();
         }
         if (this._wasSearched || String.trim(this.getStringValue()) !== '') {
            this._notify('onChange', '');
         }
      },
      _onContextValueReceived: function(){
         if (this._options.receiveContextValue) {
            $ws.proto.SearchString.superclass._onContextValueReceived.apply(this, arguments);
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить получение значений из контекста контрола.
       * @param {Boolean} value Разрешить (true) или запретить (false).
       * @example
       * При готовности строки поиска (searchString) запретить принимать значения из контекста.
       * <pre>
       *    searchString.subscribe('onReady', function() {
       *       this.setContextValueReceived(false);
       *    });
       * </pre>
       * @see receiveContextValue
       */
      setContextValueReceived: function(value){
         this._options.receiveContextValue = !!value;
      },
      init: function(){
         var self = this;
         this._buttons.push(this._searchButton = new Button({
            element: this._container.find('.ws-search-button'),
            renderStyle: 'asLink',
            img: 'sprite:icon-16 icon-Search icon-hover',
            tooltip: 'Выполнить поиск',
            handlers: {
               'onActivated': function(){
                  self._notifyOnActivated();
               }
            }
         }));
         this._buttons.push(this._clearButton = new Button({
            element: this._container.find('.ws-clear-button'),
            renderStyle: 'asLink',
            img: 'sprite:ico-Reset',
            tooltip: 'Очистить результаты поиска',
            handlers: {
               'onActivated': function(){
                  self.resetSearch();
               }
            }
         }));
         this.setLinkedBrowser(this._options.linkedBrowser);
         $ws.proto.SearchString.superclass.init.apply(this, arguments);
         //onValueChange не стреляет при инициализации, а возможно нужно крестик отобразить
         this._valueChangeHandler();
      },
      _clearSearchFields: function(){
         for (var i = 0, l = this._searchFields.length; i < l; i++) {
            this._searchFields[i].setValue(null, true);
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить связанное представление данных.
       * @param {String|$ws.proto.DataViewAbstract} linkedBrowser Строка формата "ИмяШаблона/ИмяСвязанногоПредставленияДанных"
       * или экземпляр класса представления данных.
       * @example
       * При готовности строки поиска (searchString) установить связанное представление данных.
       * <pre>
       *    searchString.subscribe('onReady', function() {
        *       if (this.getLinkedBrowser() === undefined) {
        *          this.setLinkedBrowser('Шаблон/Справочник');
        *       }
        *    });
       * </pre>
       * @see linkedBrowser
       * @see getLinkedBrowser
       */
      setLinkedBrowser: function(linkedBrowser) {

         var toSearch,
             name,
             self,
             def;

         if (linkedBrowser) {
            def = new $ws.proto.Deferred();
            self = this;
            toSearch = false;

            def.addCallback(function(browser) {

               if (self._currentBrowser) {
                  self._currentBrowser.unsubscribe('onAfterLoad', self._afterLoadHandler);
                  if (self._currentBrowser.isHierarchy()) {
                     self._currentBrowser.unsubscribe('onFolderEnter', self._onFolderEnterHandler);
                  }
                  toSearch = self._wasSearched;
                  if (!self._browserConverted) {
                     self._resetFilter(toSearch);
                     self._wasSearched = false;
                  }
                  self._browserConverted = false;
               }

               self._currentBrowser = browser;

               self._subscribeBrowser();
               // TODO Не нужно отправлять запрос при конвертации иерархического представления, пока не сделать без костылей, дерево не развернуто (от 29.09.2014, Алена Чистякова в курсе)
               if (toSearch) {
                  self._notifyOnActivated();
               }

            });

            if ($ws.helpers.instanceOfModule(linkedBrowser, 'SBIS3.CORE.DataViewAbstract')) {
               def.callback(linkedBrowser);
            } else {
               name = linkedBrowser;

               if (name.indexOf('/') > -1) {
                  name = linkedBrowser.split('/')[1];
               }

               this.getTopParent().waitChildControlByName(name).addCallback(function(instanse) {

                  def.callback(instanse);
                  return instanse;

               });
            }
         }

      },
      _subscribeBrowser: function() {

         var browser = this._currentBrowser;

         browser.once('onAfterLoad', this._checkFilter.bind(this));
         browser.subscribe('onAfterLoad', this._afterLoadHandler = this._onAfterLoadHandler.bind(this));
         if (browser.hasEvent('onConvert')) {
            browser.unsubscribe('onConvert', this._onConvertHandler);
            browser.subscribe('onConvert', this._onConvertHandler);
         }
         if (browser.isHierarchy()) {
            browser.subscribe('onFolderEnter', this._onFolderEnterHandler = this._onFolderEnter.bind(this));
         }

      },
      /**
       * Сбрасывать поиск при открытии папки
       * <wiTag group="Управление">
       * Будет ли сбрасываться поиск при входе в папку в иерархии
       * @param {boolean} reset сбрасывать или нет поиск
       * @example
       * <pre>
       *    if (dataView.isHierarchy()) {
       *       searchString.setResetOnOpen(true);
       *    }
       * </pre>
       */
      setResetOnOpen: function (reset) {
         reset = !!reset;
         if (this._currentBrowser && this._currentBrowser.isHierarchy()) {
            if (reset && !this._options.resetOnOpen) {
               this._currentBrowser.subscribe('onFolderEnter', this._onFolderEnterHandler = this._onFolderEnter.bind(this));
            } else if (!reset && this._options.resetOnOpen) {
               this._currentBrowser.unsubscribe('onFolderEnter', this._onFolderEnterHandler);
            }
         }
         this._options.resetOnOpen = reset;
      },
      /**
       * Очищать ли параметры поиска на окне дополнительных параметров после изменения значения в строке поиска
       * <wiTag group="Управление">
       * Будут ли очищаться параметры поиска на окне дополнительных параметров после изменения значения в строке поиска
       * @param {boolean} clear очищать или нет параметры
       * @example
       * <pre>
       *    if (!searchString.getLinkedBrowser()) {
       *       searchString.setClearParams(true);
       *    }
       * </pre>
       */
      setClearParams: function (clear) {
         this._options.clearParams = !!clear;
      },
      _onFolderEnter: function (e, node) {
         var filter;

         if (this._options.resetOnOpen && this._wasSearched) {
            filter = this._prepareResetFilter();
            filter[this._currentBrowser.getRecordSet().getHierarchyField()] = node;
            this._resetValues();
            e.setResult(filter);
         }
      },
      _onConvert: function (event, view) {
         this._browserConverted = true;
         this.setLinkedBrowser(view.makeOwnerName());
      },
      _checkFilter: function() {
         var filter = this._currentBrowser.getQuery(),
             filterName = this.getFilterName();

         if (filter[filterName]) {
            this.setValue(filter[filterName]);
            this._filterStorage.push(filterName);
            if (this._options.paramsWindow) {
               this._createParamsWindow(true);
            }
            this._wasSearched = true;
         }
      },
       /**
        * <wiTag group="Управление">
        * Получить экземпляр класса связанного представления данных.
        * @returns {undefined|*} Возвращается undefined, если связанного представления данных нет.
        * @example
        * При готовности строки поиска (searchString) установить связанное представление данных.
        * <pre>
        *    searchString.subscribe('onReady', function() {
        *       if (this.getLinkedBrowser() === undefined) {
        *          this.setLinkedBrowser('Шаблон/Справочник');
        *       }
        *    });
        * </pre>
        * @see linkedBrowser
        * @see setLinkedBrowser
        */
      getLinkedBrowser: function(){
         return this._currentBrowser;
      },
       /**
        * <wiTag group="Управление">
        * Установить имя фильтра для поиска по связанному представлению данных.
        * @param {String} filterName Имя фильтра.
        * @example
        * Проверить наличие фильтра для поиска по связанному представлению данных. Задать фильтр, если его нет.
        * <pre>
        *    searchString.subscribe('onReady', function() {
        *       if (this.getFilterName()) {
        *          this.setFilterName('Описание');
        *       }
        *    });
        * </pre>
        * @see linkedView
        * @see filterName
        * @see getFilterName
        */
      setFilterName: function(filterName){
         if (filterName) {
            this._options.filterName = filterName;
         }
      },
      /**
       * <wiTag group="Управление">
       * Разрешить изменение активности строки поиска, если связанное представление данных не имеет записей.
       * @param {Boolean} value Разрешить (true) и запретить (false).
       * @example
       * При готовности строки поиска (searchString) разрешить изменять активность.
       * <pre>
       *    searchString.subscribe('onReady', function() {
       *       this.setDisableAtEmptyBrowser(true);
       *    });
       * </pre>
       * @see disableEmptyBrowser
       */
      setDisableAtEmptyBrowser: function(value){
         this._options.disableAtEmptyBrowser = !!value;
      },
       /**
        * <wiTag group="Управление">
        * Получить имя фильтра, установленного для поиска по связанному представлению данных.
        * @returns {String} Имя фильтра.
        * @example
        * Проверить наличие фильтра для поиска по связанному представлению данных. Задать фильтр, если его нет.
        * <pre>
        *    searchString.subscribe('onReady', function() {
        *       if (this.getFilterName() == '') {
        *          this.setFilterName('Описание');
        *       }
        *    });
        * </pre>
        * @see linkedView
        * @see filterName
        * @see setFilterName
        */
      getFilterName: function(){
         return this._options.filterName;
      },
       /**
        *
        * @private
        */
      _onAfterLoadHandler: function(){
         if (this._options.disableAtEmptyBrowser && !this._wasSearched) {
            var recordsCount = this._currentBrowser.getRecordSet().getRecords().length;
            if (recordsCount === 0 && this._options.enabled) {
               this.setEnabled(false);
            } else if (recordsCount > 0 && !this._options.enabled) {
               this.setEnabled(true);
            }
         }
      },
      _prepareResetFilter: function() {
         var onResetResult,
             filter;

         if (this._wasSearched) {
            if (this._currentBrowser.isHierarchy()) {
               this._currentBrowser.clearTurn(true);
            }
            filter = this._currentBrowser.getQuery();
            for (var i = 0, l = this._filterStorage.length; i < l; i++) {
               var indexOldFilter;
               for (var j = 0, ln = this._oldFilters.length; j < ln; j++) {
                  if (this._oldFilters[j].hasOwnProperty(this._filterStorage[i])) {
                     indexOldFilter = j;
                     break;
                  }
               }
               if (typeof indexOldFilter === 'undefined') {
                  delete filter[this._filterStorage[i]];
               } else {
                  filter[this._filterStorage[i]] = this._oldFilters[j][this._filterStorage[i]];
                  indexOldFilter = undefined;
               }
            }
            if (this._currentBrowser.isTree()) {
               //в случае дерева getQuery вернет Раздел, который открывали последним...
               filter[this._currentBrowser.getRecordSet().getHierarchyField()] = this._currentBrowser.getRootNode();
            }
            if (this._options.resetRoot && this._currentBrowser.isHierarchyMode()) {
               this._currentBrowser.setRootNode(this._currentBrowser.getRootNode(), true);
            }
            onResetResult = this._notify('onResetFilter', $ws.core.clone(filter));
            if ($.isPlainObject(onResetResult)) {
               //позволяем переопределить фильтр при сбросе поиска
               filter = onResetResult;
            }
         }

         return filter;
      },
      /**
       * Очищает результаты поиска.
       * @param {Boolean} notClear очищать значения строки поиска и окна дополнительных параметров 
       * @private
       */
      _resetFilter: function (notClear) {
         var filter;

         if (this._wasSearched) {
            filter = this._prepareResetFilter();
            this._resetValues(notClear);
            this._currentBrowser.setQuery(filter, false).addCallback(function(){
               if (this._currentBrowser.isTree()) {
                  this._currentBrowser.applyTurnTree();
               }
            }.bind(this));
         }
      },
      _resetValues: function(notClear) {
         if (!notClear) {
            this.setValue(null);
            this._resetWindowParams();
         }
         this._wasSearched = false;
         this._reverted = {};
         this._onChangeValidValue = undefined;
         this._lastSearchedValue = undefined;
         this._filterStorage = [];
         this._oldFilters = [];
      },
      _resetWindowParams: function ( ) {
         var window = this._searchWindow;
         if (window) {
            if (window.isShow()) {
               window.hide();
            }
            this._clearSearchFields();
         }
      },
       /**
        * <wiTag group="Отображение">
        * Установить расположение окна дополнительных параметров поиска относительно начала отсчёта - верхнего левого угла.
        * Если не задавать расположение окна дополнительных параметров этим методом, то оно будет находиться под строкой
        * поиска: верхний левый его угол крепится к нижнему левому углу строки поиска.
        * @param {Object} offset Отступ относительно начала координат - верхнего левого угла. Задаётся объектом {left: number, top: number}.
        * @example
        * Установить окно дополнительных параметров после строки поиска, прикрепив его верхний левый край к верхнему правому краю строки.
        * <pre>
        *     searchString.subscribe('onInit', function(){
        *        var container = this.getContainer(),
        *           offset = container.offset();
        *        this.setWindowPosition({
        *           //верхний край
        *           top: offset.top,
        *           //левый край
        *           left: offset.left + container.width()
        *        });
        *     })
        * </pre>
        * @see paramsWindow
        * @see getParamsWindow
        */
      setWindowPosition: function (offset) {
         var win = this._searchWindow,
               left, top;
         if (this._options.paramsWindow && offset && typeof (left = offset.left) !== 'undefined' &&
               typeof (top = offset.top) !== 'undefined') {
            if (win) {
               win.setOffset({y: offset.top, x: offset.left});
            } else {
               this._windowPosition = offset;
            }
         }
      },
       /**
        * <wiTag group="Данные">
        * Получить окно дополнительных параметров поиска.
        * @returns {undefined|$ws.proto.Window} Возвращает экземпляр класса $ws.proto.Window.
        * @example
        *
        * <pre>
        *
        * </pre>
        * @see paramsWindow
        * @see setWindowPosition
        */
      getParamsWindow: function ( ) {
         return this._searchWindow;
      },
      _createParamsWindow: function (notDisplay) {
         var isSetPosition = typeof this._windowPosition !== 'undefined',
               offset = isSetPosition ? this._windowPosition : this._container.offset(),
               self = this,
               config;
         if (!isSetPosition) {
            offset.top += 24;
         }
         config = {
            template: this._options.paramsWindow,
            opener: this,
            border: false,
            cssClassName: 'ws-search-window',
            autoHide: false,
            offset: {
               y: offset.top,
               x: offset.left
            },
            animation: 'fade',
            animationLength: 0,
            handlers: {
               'onAfterShow': function(e){
                  e.setResult(this.getContainer().offset());
                  var childControls = this.getChildControls();
                  for(var i = 0, l = childControls.length; i < l; i++){
                     childControls[i].subscribe('onFocusOut', self._focusOutHandler.bind(self));
                  }
               },
               'onDestroy': function(){
                  self._searchWindow = undefined;
                  self._searchFields = [];
               }
            }
         };
         if (notDisplay) {
            config.handlers.onReady = function ( ) {
               self._initParams(this.getChildControls());
            };
            config.handlers.onBeforeShow = function ( ) {
               if(self._paramWindowFirstShow) {
                  self._paramWindowFirstShow = false;
                  this.hide();
               }
            };
         }
         this._searchWindow = new FloatArea(config);
      },
      _notifyOnChange: function(notFormattedValue){
         var onChangeResult;
         this._updateSelfContextValue(notFormattedValue);
         onChangeResult = this._notify('onChange', notFormattedValue);
         if (onChangeResult) {
            this._onChangeValidValue = notFormattedValue;
         }
         this._notifyOnValueChange(notFormattedValue);
         this._onChangeResultHandler(onChangeResult);
      },
      _onChangeResultHandler: function (result) {
         if (result && this._options.paramsWindow) {
            if (!this._searchWindow) {
               this._createParamsWindow();
            } else {
               if (this._searchWindow.isVisible()) {
                  this._searchWindow.moveToTop();
               } else {
                  this._searchWindow.show();
               }
            }
         } else if (this._searchWindow && this._searchWindow.isVisible()) {
            this._searchWindow.hide();
         }
      },
      _initParams: function (fields, extender, filter) {
         var currentFilter,
             filterName,
             field;
         if ($.isArray(fields)) {
            currentFilter = this._currentBrowser.getQuery();
            for (var i = 0, l = fields.length; i < l; i++) {
               field = fields[i];
               if ($ws.helpers.instanceOfModule(field, 'SBIS3.CORE.FieldString')) {
                  filterName = field.getName();
                  if (extender) {
                     this._setOldFilters(field, extender, filter);
                  } else if (currentFilter[filterName]) {
                     field.setValue(currentFilter[filterName], true);
                  }
                  this._filterStorage.push(filterName);
                  this._searchFields.push(field);
               }
            }
         }
      },
      _setOldFilters: function(field, extender, filter) {
         var value = field.getStringValue(),
             filterName = field.getName(),
             noOldValue = true;
         if (value !== '') {
            extender[filterName] = value;
         } else if (filter[filterName]) {
            for (var j = 0, ln = this._oldFilters.length; j < ln; j++) {
               if (this._oldFilters[j].hasOwnProperty(filterName)) {
                  filter[filterName] = this._oldFilters[j][filterName];
                  noOldValue = false;
                  break;
               }
            }
            if (noOldValue) {
               delete filter[filterName];
            }
         }
      },
       /**
        * Обработчик на выполнение поиска.
        * @private
        */
      _onActivatedHandler: function() {
          var stringValue = this.getStringValue(),
              checkOldFilters;

         if (this._options.enabled) {
            if (this._currentBrowser && this._options.filterName && String.trim(stringValue.trim()) !== '') {
               var filter = this._currentBrowser.getQuery();

               if (this._lastSearchedValue === stringValue) {
                  //если в прошлый раз искали по такому же значению, но в фильтре браузера другое
                  //просто сменим раскладку, искать ничего не будет
                  if (filter[this._options.filterName] !== stringValue && this._options.useKbLayoutRevert) {
                     this.setValue($ws.single.KbLayoutRevert.process(stringValue));
                  }
                  return;
               }

               var isTree = this._currentBrowser.isTree(),
                   extender = {},
                   onBeforeApplyFilterResult;
               if (!this._allowSearch) {
                  this._wasAbort = true;
                  this._currentBrowser.getRecordSet().abort();
               }
               if (this._options.clearParams && typeof this._onChangeValidValue !== 'undefined' && stringValue !== this._onChangeValidValue) {
                  //Если установлена опция очищения параметров доп. окна, при этом окно ранее открывалось и текущее
                  //значение в строке поиска отличается, то очистим дополнительные поля
                  this._clearSearchFields();
               }
               if (!this._wasSearched) {
                  this._wasSearched = true;
                  checkOldFilters = true;
               } else {
                  this._filterStorage = [];
               }
               extender[this._options.filterName] = stringValue;
               this._filterStorage.push(this.getFilterName());
               if (this._searchWindow) {
                  this._initParams(this._searchWindow.getChildControls(), extender, filter);
               }
               if (checkOldFilters) {
                  for (var j = 0, ln = this._filterStorage.length; j < ln; j++) {
                     if (filter.hasOwnProperty(this._filterStorage[j])) {
                        var oldFilter = {};
                        oldFilter[this._filterStorage[j]] = filter[this._filterStorage[j]];
                        this._oldFilters.push(oldFilter);
                     }
                  }
                  if (this._currentBrowser.isHierarchyMode()) {
                     this._oldFilters.push({'Разворот': filter['Разворот']});
                  }
               }
               filter = this._options.useBrowserFilter ? $ws.core.merge(filter, extender) : extender;
               onBeforeApplyFilterResult = this._notify('onBeforeApplyFilter', $ws.core.clone(filter));
               if (this._currentBrowser.isHierarchyMode()) {
                  filter['Разворот'] = 'С разворотом';
                  this._filterStorage.push('Разворот');
                  if (this._options.resetRoot) {
                     this._currentBrowser.setRootNode(this._currentBrowser.getRootNode(), true);
                  }
                  if (this._options.resetRoot || isTree) {
                     //если была открыта папка вызывается loadNode - он портит Раздел.
                     filter[this._currentBrowser.getRecordSet().getHierarchyField()] = this._currentBrowser.getRootNode();
                  }
               }
               if (onBeforeApplyFilterResult !== false) {
                  if ($.isPlainObject(onBeforeApplyFilterResult)) {
                     for (var key in onBeforeApplyFilterResult) {
                        if (onBeforeApplyFilterResult.hasOwnProperty(key) && !filter.hasOwnProperty(key)) {
                           this._filterStorage.push(key);
                        }
                     }
                     filter = onBeforeApplyFilterResult;
                  }
                  this._setBrowserHighlight(filter);
                  this._allowSearch = false;
                  this._lastSearchedValue = stringValue;
                  this._applySearch(filter);

                  if (this._searchWindow) {
                     this._searchWindow.hide();
                  }
               }
            } else if (stringValue !== '') {
               this._showCross();
            }
         }
      },
      /**
       * Подсветка текста в браузере
       * @param filter фильтр браузера
       * @private
       */
      _setBrowserHighlight: function(filter) {
         if (this._options.filterName && filter.hasOwnProperty(this._options.filterName)) {
            var value = filter[this._options.filterName];
            this._currentBrowser.setTextHighlight(typeof value === 'string' && value.length ? value : '');
         }
      },
      _applySearch: function(filter) {
         var filterCopy = $ws.core.clone(filter),
             self = this,
             reverted;
         /*К сожалению вынужден делать третий запрос, чтобы откатить фильтр к первоначальному
               sbisdoc://1+ОшРазраб+01.11.14+136602+2DBDF88C-35F7-4D89-A64B-3FFA3E7584F+*/
         this._currentBrowser.setQuery(filterCopy, true).addCallback(function() {
            //Результат колбэка оказался не числом в иерархии, поэтому пока проверяем так
            if (self._currentBrowser.getRecordSet().getRecordCount()) {
               self._afterSearchHandler();
            } else if (!self._wasAbort) {
               reverted = self._tryRevertKbLayout(filter);

               if (Object.keys(reverted || {}).length) {
                  self._lastSearchedValue = self.getStringValue();
                  self._currentBrowser.setQuery(filter, true).addCallback(function() {
                     //TODO: в будущем возможно придется проставить значения дополнительным параметрам поиска
                     if (self._currentBrowser.getRecordSet().getRecordCount()) {
                        self.setValue(reverted[self._options.filterName]);
                        self._reverted = reverted;
                        self._afterSearchHandler();
                     } else {
                        self._currentBrowser.setQuery(filterCopy, true).addCallback(function() {
                           self._wasAbort = false;
                           self._allowSearch = true;
                        });
                     }
                  });
               }
            } else {
               self._wasAbort = false;
               self._allowSearch = true;
            }
         });
      },
      _afterSearchHandler: function() {
         this._wasAbort = false;
         this._allowSearch = true;

         if (this._currentBrowser.isTree()) {
            this._currentBrowser.applyTurnTree(true);
         }
      },
      /**
       * Пытается найти в полях данные, которые введены в ошибочной раскладке
       * меняет фильтр если найдет такие
       * @param {Object} filter фильтр, который нужно изменить
       * @returns {Object|undefined} объект с измененными значениями
       */
      _tryRevertKbLayout : function(filter) {
         var reverted,
             currentValue,
             revertedValue;

         if (!this._options.useKbLayoutRevert) {
            return reverted;
         }

         reverted = {};

         /* Делаем пока замену раскладки только на строке поиска, окно дополнительных параметров не трогаем
          так как не понятно как обработать следующую ситуацию:
          потенциально ищем результаты на русском, в строку поиска ввели значение на английской раскладке,
          а в поле на окне дополнительных параметров значение на русской раскладке, в результате не найдем
          ничего, потому что раскладка на дополнительном поле сменится.

          Для того чтобы учитывать поля на окне, в forEach передать [ this ].concat(this._searchFields)
          */
         $ws.helpers.forEach([ this ], function(field) {

            var name = $ws.helpers.instanceOfModule(field, 'SBIS3.CORE.SearchString') ? this._options.filterName : field.getName(),
                hasRevertedValue = this._reverted.hasOwnProperty(name);

            currentValue = field.getStringValue();
            if (hasRevertedValue) {
               var symbolsDifference = $ws.helpers.searchSymbolsDifference(currentValue, this._reverted[name]);
               currentValue = currentValue.replace(symbolsDifference[0], '');
            }

            revertedValue = $ws.single.KbLayoutRevert.process(currentValue);

            if (revertedValue !== currentValue) {
               revertedValue = hasRevertedValue ? symbolsDifference[0] + revertedValue : revertedValue;
               reverted[name] = revertedValue;
               filter[name] = revertedValue;
            }

         }.bind(this));

         return reverted;
      },
      /**
       * <wiTag group="Управление">
       * Разрешён ли поиск.
       * @returns {Boolean} Признак: разрешён (true) или запрещён (false).
       * @example
       * При нажатии клавиши Enter начать поиск. При нажатии клавиши del сбросить результаты поиска.
       * <pre>
       *    //подписываемся на событие при нажатии клавиши
       *    searchString.subscribe('onKeyPressed', function(eventObject, event) {
       *       //проверяем код нажатой клавиши и разрешение на поиск
       *       if (event.which == $ws._const.key.enter && this.isAllowSearch()) {
       *          //начинаем поиск по заданным параметрам
       *          this.applySearch();
       *       } else if (event.which == $ws._const.key.del) {
       *          //сбрасываем результаты поиска
       *          this.resetSearch();
       *       }
       *    });
       * </pre>
       * @see applySearch
       * @see resetSearch
       */
      isAllowSearch: function(){
         return this._allowSearch;
      },
      /**
       * Показать крестик
       * @private
       */
      _showCross: function() {
         this._toggleCross();
      },
      /**
       * Скрыть крестик
       * @private
       */
      _hideCross: function() {
         this._toggleCross(true);
      },
      /**
       * Скрыть или показать крестик
       * @param {Boolean} toHide true - скрываем, false - показываем
       * @private
       */
      _toggleCross: function(toHide) {
         toHide = !!toHide;
         this._clearButton.getContainer().toggleClass('ws-hidden', toHide);
         this._container.toggleClass('ws-SearchString__cross-visible', !toHide);
      },
      _setEnabled: function(s){
         $ws.proto.SearchString.superclass._setEnabled.apply(this, arguments);
         if (this._searchButton && this._clearButton) {
            this._searchButton.setEnabled(s);
            this._clearButton.setEnabled(s);
         }
      },
      /**
       * Задает параметр, отвечающий за смену раскладки в строке поиска
       * Раскладка меняется, если по запросу ничего не найдено
       * <wiTag group="Данные">
       * @param {Boolean} useKbLayoutRevert менять ли раскладку
       * @example
       * <pre>
       *    searchString.setUseKbLayoutRevert(true);
       * </pre>
       */
      setUseKbLayoutRevert: function(useKbLayoutRevert){
         this._options.useKbLayoutRevert = !!useKbLayoutRevert;
      },
      /**
       * Получить признак того, что используется смена раскладки при поиске
       * <wiTag group="Данные">
       * @return {Boolean} useKbLayoutRevert меняется ли раскладка
       * @example
       * <pre>
       *    //если не используется смена раскладки при поиске, то установим ее
       *    if(!searchString.getUseKbLayoutRevert()){
       *       searchString.setUseKbLayoutRevert(true);
       *    }
       * </pre>
       */
      getUseKbLayoutRevert: function(){
         return this._options.useKbLayoutRevert;
      },
      destroy: function(){
         var window = this._searchWindow,
             button;
         for (var i = 0, l = this._buttons.length; i < l; i++) {
            button = this._buttons[i];
            if ($ws.helpers.instanceOfModule(button, 'SBIS3.CORE.Button')) {
               button.destroy();
               button = null;
            }
         }
         if ($ws.helpers.instanceOfModule(window, 'SBIS3.CORE.Window')) {
            window.destroy();
            window = null;
         }
         $ws.proto.SearchString.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.SearchString;

});
