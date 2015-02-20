/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 15.04.13
 * Time: 16:42
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.PathSelector",
  ["js!SBIS3.CORE.Control", "i18n!SBIS3.CORE.PathSelector", "js!SBIS3.CORE.TDataSource", "html!SBIS3.CORE.PathSelector" , "css!SBIS3.CORE.PathSelector"],
  function( Control, rk, TDataSource, mainTplFn ) {

   "use strict";

   $ws._const.PathSelector = {
      delayMenuHide: 200   //Задержка исчезновения меню
   };

   /**
    * @class $ws.proto.PathSelector
    * @extends $ws.proto.Control
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.PathSelector'>
    * <option name='rootNodeView' value='icon'> <option>
    * <options name='path' type='array'>
    * <options>
    *    <option name='title' value='путь'></option>
    *    <option name='id' value='1'></option>
    * </options>
    * </options>
    * </component>
    */

   $ws.proto.PathSelector = Control.Control.extend(/** @lends $ws.proto.PathSelector.prototype */{
      /**
       * @event onPathChange При изменении пути
       * Событие происходит, когда пользователь производит клик на хлебные крошки и изменяет текущий узел.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number} id Идентификатор выбранного узла.
       * @example
       * При изменении пути скрывать отображение последнего узла и помещать текст его заголовка в html-элемент.
       * <pre>
       *    pathSelector.subscribe('onPathChange', function(event, id) {
       *       $('#div-title-text').text('Текущий раздел с идентификатором ' + id);
       *    });
       * </pre>
       * @see path
       */
      /**
       * @event onDrawPoint При создании узла пути
       * Событие происходит при создании узла пути.
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @param {Object} pathPoint Объект с описанием текущего узла.
       * @param {Boolean} last Является ли этот узел последним.
       * @return Можно вернуть jQuery-объект, который будет использоваться в качестве узла.
       * @example
       * Сохранить статистику о глубине просмотра при работе с pathSelector.
       * <pre>
       *    pathSelector.subscribe('onDrawPoint', function(eventObject) {
       *       var length = this.getPathLength(),
       *           //получаем пользовательские данные по полю maxLength
       *           userData = this.getUserData('maxLength');
       *       if (userData < length) {
       *          this.setUserData('maxLength', length);
       *       }
       *    });
       * </pre>
       * @see append
       * @see path
       */
      /**
       * @event onArrowClick При клике на стрелку
       * Событие происходит при клике на стрелку, расположенную возле узлов пути.
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @param {String} id Идентификатор узла, возле которого находится стрелка.
       * @return Результат обработчика события.
       * Если вернуть $ws.proto.Deferred, то PathSelector будет считать, что в callback этого deferred придёт массив с
       * описанием строк, которые нужно показать в меню.
       * @example
       * Структура массива с описанием строк:
       * <pre>
       *    array = [{
       *       id: 70,
       *       title: 'Телефония и контакты'
       *    },{
       *       id: 71,
       *       title: 'Обращения к системным администраторам'
       *    }];
       * </pre>
       */
      /**
       * @event onPointClick При клике на узел хлебных крошек
       * Переход в узел не произойдёт, если обработчик события вызовет event.setResult(true), но изменение в хлебных
       * крошках произойдёт в любом случае.
       * @param {Number} index Номер узла.
       * @param {String} id Идентфикатор узла.
       * @param {String} title Заголовок узла.
       * @example
       * Переопределить обработчик клика по узлу хлебных крошек.
       * Задать открытие ветки иерархического представления (hierarchyView) по id узла.
       * <pre>
       *    var hierarchyView,
       *        pathSelector = hierarchyView.getPathSelector(),
       *        pS;
       *    _onPointClick = function(eventObject, index, id, title) {
       *       if (id === 42) {
       *          //разворачиваем ветку
       *          hierarchyView.showBranch(42);
       *          //обязательно условие для переопределения обработчика клика по узлу
       *          event.setResult(true);
       *       }
       *    };
       *    pathSelector.addCallback(function(element) {
       *       pS = element;
       *       pS.subscribe('onPointClick', _onPointClick);
       *    });
       * </pre>
       * @see path
       */
      /**
       * @event onCreateMenu При создании меню
       * Событие происходит при создании меню возле узла хлебных крошек.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентфикатор узла.
       * @return В event.setResult() можно передать массив из объектов содержащих title и id, которые будут добавлены к
       * создаваемому меню. Обработать клики по ним можно через {@link $ws.proto.PathSelector.onPointClick}.
       * Добавить узел пути к создаваемому меню.
       * @example
       * <pre>
       *    var hierarchyView,
       *        pathSelector = hierarchyView.getPathSelector();
       *    _onPointClick = function(eventObject, index, id, title) {
       *       if (title === 'Встроенный') {
       *          //разворачиваем ветку
       *          hierarchyView.showBranch(42);
       *          //обязательно условие для переопределения обработчика клика по узлу
       *          event.setResult(true);
       *       }
       *    };
       *     _onCreateMenu = function(event, id) {
       *        event.setResult([{
       *           title: 'Встроенный',
       *           id: 43
       *        }]);
       *     };
       *     pathSelector.subscribe('onPointClick', _onPointClick);
       *     pathSelector.subscribe('onCreateMenu', _onCreateMenu);
       * </pre>
       * @see path
       */
      $protected: {
         _options: {
            /**
             * @cfg {Object} Источник данных
             * <wiTag group="Данные">
             * Описание метода бизнес-логики, с помощью которого осуществляется поиск записей.
             * Необходим для работы без связанного представления данных.
             * Для конфигурации обязательны следующие свойства: readerType, readerParams и filterParams.
             * @example
             * <pre>
             *    dataSource: {
             *       readerParams: {
             *          linkedObject: 'Пользователь',
             *          queryName: 'СписокПоСтруктуреПредприятияДляАвтодополнения'
             *       },
             *       readerType: 'ReaderUnifiedSBIS',
             *       filterParams: {
             *       'Город': 'Ярославль'
             *       }
             *    }
             * </pre>
             * @see filterParams
             * @see hierarchyField
             * @see titleColumn
             * @see setSource
             * @editor TDataSourceEditor
             */
            dataSource: TDataSource,
            /**
             * @cfg {Array} Данные о пути
             * Массив объектов, описывающих узлы пути. В каждом объекте возможны следующие свойства:
             * <ol>
             *    <li>{String} title Заголовок узла.</li>
             *    <li>{Number} id Идентификатор узла.</li>
             * </ol>
             * <wiTag group="Данные">
             * @example
             * Структура объекта с данными о пути.
             * <pre>
             *    path: [{
             *       //корневой узел
             *       title: '',
             *       id: null
             *    },{
             *       title: 'Техническая поддержка',
             *       id: 1
             *    },{
             *       title: 'Новые сотрудники',
             *       id: 2
             *    }];
             * </pre>
             * @see setPath
             * @see getPathLength
             * @see setPathElement
             * @see togglePathElement
             */
            path: [],
            /**
             * @cfg {String} Заголовок корневого узла
             * Используется в том случае, когда свойство {@link rootNodeView} = text.
             * <wiTag group="Отображение">
             * @see rootNodeId
             * @see rootNodeView
             * @see setRootName
             * @translatable
             */
            rootNodeCaption: rk('Корень'),
            /**
             * @cfg {Number} Идентификатор корневого узла
             * <wiTag group="Данные">
             * @see rootNodeCaption
             * @see rootNodeView
             * @see setRootNode
             */
            rootNodeId: null,
            /**
             * @cfg {String} Внешний вид корня
             * Поддерживается два значения:
             * <ol>
             *    <li>text - отображается текст.
             *    В этом случае необходимо задать этот текст опцией {@link rootNodeCaption}.</li>
             *    <li>icon - отображается иконка.
             *    В этом случае необходимо установить путь к иконке опцией {@link folderIcon}.</li>
             * </ol>
             * <wiTag group="Отображение">
             * @see rootNodeView
             * @see rootNodeId
             * @see setRootNodeView
             */
            rootNodeView: 'text',
            /**
             * @cfg {String} Имя поля источника данных
             * Это имя поля, значения которого будут использоваться в качестве заголовков узлов пути.
             * <wiTag group="Отображение">
             * @see dataSource
             */
            titleColumn: '',
            /**
             * @cfg {String} Путь к иконке папки
             * Используется в том случае, когда свойство {@link rootNodeView} = icon.
             * <wiTag group="Отображение">
             */
            folderIcon: 'img/browser/folder.gif',
            /**
             * @cfg {String} Поле иерархии
             * Имя поля источника данных, по которому устанавливается иерархическая связь между записями.
             * <wiTag group="Отображение">
             * @see dataSource
             * @see setHierarchyField
             */
            hierarchyField: 'Раздел',
            /**
             * @cfg {Object.<string, number|string>} Параметры фильтрации
             * Объект дополнительных параметров фильтрации источника данных.
             * В нём можно указать имя поля и значение, по которому следует отбирать записи.
             * <wiTag group="Отображение">
             * @example
             * Фильтровать записи по полям "Зарплата" и "Фамилия" со значениями 30000 и "Иванов" соответственно.
             * <pre>
             *    filterParams: {
             *       'Зарплата': 30000,
             *       'Фамилия': 'Иванов'
             *    }
             * </pre>
             * @see dataSource
             */
            filterParams: {}
         },
         _path: [],                                   //Массив с информацией о элементах пути
         _width: [],                                  //Массив с суммарными ширинами элементов
         _block: undefined,                           //Блок со всем содержимым
         _back: undefined,                            //Кнопка со стрелкой "назад", содержит в себе меню предыдущих узлов
         _points: [],                                 //Массив с элементами пути
         _showedPoints: 0,                            //Количество отображаемых в текущий момент узлов
         _menuShowed: undefined,                      //Показывается ли где-либо меню
         _pressedArrow: undefined,                    //Последняя нажатая стрелка
         _menuContainer: undefined,                   //Блок, содержащий всё меню
         _recordSet: undefined,                       //Рекордсет для получения данных
         _browserRecordSet: undefined,                //Рекордсет браузера. Можно вытащить данные из него в некоторых случаях
         _indicator: undefined,                       //Индикатор загрузки
         _paging: undefined,                          //Кнопка для загрузки следующей страницы
         _menuCache: {},                              //Данные для менюшек
         _loaded: {},                                 //Сколько страниц загружено у выбранной менюшки, в теории, 0 или undefined означает, что меню ещё не загружалось
         _rootElement: undefined,                     //Элемент корня. Используется для смены заголовка корня
         _ready: undefined,                           //deferred готовности рекордсета
         _menuMaxHeight: undefined,                   //Максимальная высота меню
         _hierarchyField: undefined                   //Текущее поле иерархии
      },
      _dotTplFn: mainTplFn,
      $constructor: function(){
         this._initConfig();
         this._initRecordSet();
         this._initBlock();
         this._initEvents();
         this.subscribe('onInit', this._build);
      },
      /**
       * Инициализирует конфиг
       */
      _initConfig: function(){
         //ws core extend bug
         if(this._options.rootNodeId === -1){
            this._options.rootNodeId = null;
         }
         this._initPath();
         this._hierarchyField = this._options.hierarchyField + '@';
         this._publish('onPathChange', 'onArrowClick', 'onDrawPoint', 'onPointClick');
      },
      _initPath: function(){
         //Узлы не содержат корень
         this._path = this._options.path;
         this._path.unshift({
            'title': this._options.rootNodeCaption,
            'id': this._options.rootNodeId
         });
      },
      _getPathContainer: function() {
           return this.getContainer().find('.ws-PathSelector__block');
      },
      /**
       * Инициализирует контейнер и начальные элементы пути
       */
      _initBlock: function(){
         this._container.removeAttr('tabindex');
         this._block = this._getPathContainer();
      },
      /**
       * Инициализирует рекордсет
       */
      _initRecordSet: function(){
         var cfg = this._options.dataSource;
         if(cfg.filterParams === undefined){
            cfg.filterParams = {};
         }
         cfg.filterParams = $ws.core.merge(this._options.filterParams, cfg.filterParams);
         cfg.filterParams["Разворот"] = "Без разворота";
         cfg.filterParams["ВидДерева"] = "Только узлы";
         cfg.usePages = '';
         cfg.handlers = {
            'onBeforeLoad': this._onBeforeLoad.bind(this),
            'onAfterLoad': this._onDataLoaded.bind(this)
         };
         cfg.firstRequest = false;
         cfg.waitForPrevQuery = true;
         this._ready = $ws.core.attachInstance('Source:RecordSet', cfg).addCallback(function(instance){
            this._recordSet = instance;
            return instance;
         }.bind(this));
      },
      /**
       * Подписывается на события
       */
      _initEvents: function(){
         var parent = this._block.get(0);
         this._block.bind('click', function(event){
            event.stopPropagation();
         });
         $('.ws-PathSelector__point', parent).live('click', this._onMouseClick.bind(this));
         $('.ws-PathSelector__arrow', parent).live('mouseup', this._onArrowClick.bind(this));
         $('.ws-PathSelector__point, .ws-PathSelector__arrow', parent).live('mouseover', this._onMouseOver.bind(this));
      },
      /**
       * Строит всё по this._path
       */
      _build: function(){
         var point;
         this._block.empty();
         this._points = [];
         this._back = $('<span class="ws-PathSelector__arrow ws-PathSelector__back ws-hidden"></span>');

         for(var i = 0, len = this._path.length; i < len; ++i){
            point = this._drawPoint(i, i === len - 1);
            if(i === 0){
               this._rootElement = point;
               this._back.appendTo(this._block);
            }
         }
         this._onResizeHandler();
      },
      /**
       * Обработчик нажатия на заголовок элемента
       * @param {Number} index   номер элемента
       * @param {String} id      идентфикатор узла
       * @param {String} title   заголовок узла
       * @param {jQuery} event   jQuery event click
       */
      _onPointClick: function(index, id, title, event){
         if(index !== undefined){
            var count = this._path.length - index - 1;
            for(var j = 0; j < count; ++j){
               var tempId = this._path.pop().id;
               this._menuCache[tempId] = undefined;
               delete this._menuCache[tempId];
               this._loaded[tempId] = 0;
            }
            if(this._path[index].id != id){
               this._path.push({id: id, title: title});
            }
         }
         else{
            this._path = [{id: id, title: title}];
         }
         this._build();
         this._onResizeHandler();
         this._notify('onPathChange', id, tempId);
      },
      /**
       * Обрабатывает клик по элементу пути
       * @param {Object} event jQuery-событие
       */
      _onMouseClick: function(event){
         if(this.isEnabled()){
            var target = $(event.target).closest('.ws-PathSelector__point'),
               index = target.data('index'),
               id = this._path[index].id,
               title = this._path[index].title;
            if(this._checkBeforePointCLick(index)){
               this._onPointClick(index, id, title, event);
            }
         }
      },
      _checkBeforePointCLick: function(index){
         return (index + 1 !== this._path.length);
      },
      /**
       * Обработчик нажатия клавиши мыши
       * @param {Object} event параметры события
       */
      _onArrowClick: function(event){
         if(this.isEnabled()){
            var target = $(event.target),
               index = target.data('index'),
               isBack = target.hasClass('ws-PathSelector__back');
            //Если нажатие клавиши мыши - добавляем класс, который отображает нажатие
            this._pressedArrow = target.addClass('ws-PathSelector__arrow__state-pressed');
            this._processMenu(isBack ? this._options.rootNodeId : this._path[index].id, target, isBack, event);
         }
      },
      /**
       * Обрабатывает показ меню, набирает скрытые строки
       * @param {Number} id идентификатор корневого узла меню
       * @param {jQuery} arrow элемент, у которого создавать меню
       * @param {Boolean} isBack нажимали ли стрелку "назад"
       */
      _processMenu: function(id, arrow, isBack, event){
         var rows;
         if(isBack){
            rows = [];
            for(var i = this._path.length - this._showedPoints - 1; i > 0; --i){
               rows.push(this._path[i]);
            }
         }
         this._processMenuForRows(rows, id, arrow);
      },
      /**
       * Показывает меню для указанного узла
       * @param {Array}    rows  если есть, значит это скрытые строки, которые нужно показать
       * @param {String}   id    идентификатор узла
       * @param {jQuery}   arrow элемент, у которого нужно показать меню
       */
      _processMenuForRows: function(rows, id, arrow){
         this._menuShowed = id;
         if(!this._menuContainer){
            //Если меню нет = создаём его
            this._createMenu(rows, arrow, id);
         }
         else{
            this._updateMenuPosition(arrow);
            this._menuShow();
            this._setMenuRows(rows, id);
         }
      },
      /**
       * Обрабатывает клик по пункту меню
       * @param {jQuery} event событие клика
       */
      _onMenuClick: function(event){
         var target = $(event.target).closest('.ws-PathSelector__menuAction'),
            id = target.data('id'),
            title = target.text();
         for(var i = 0, len = this._path.length; i < len; ++i){
            if(this._path[i].id === this._menuShowed){
               //Меню скрывается по потере фокуса. Специально активируем pathSelector
               this.setActive(true);
               this._onPointClick(i, id, title, event);
               break;
            }
         }
      },
      /**
       * Инициализирует события в меню
       */
      _initMenuEvents: function(){
         this._menuContainer.bind('blur', this._menuStartHide.bind(this));
         $('.ws-PathSelector__menuAction', this._menuContainer.get(0)).live('click', this._onMenuClick.bind(this));
      },
      _createMenu: function(rows, arrow, id){
         this._menuContainer = $('<div class="ws-PathSelector__menu" tabindex="-1"></div>')
            .appendTo($('body'));
         this._updateMenuPosition($(arrow));
         this._setMenuRows(rows, id);
         this._container.trigger('wsSubWindowOpen');
         this._initMenuEvents();

         setTimeout(function(){
            this._menuContainer.focus();
         }.bind(this), 0);
      },
      /**
       * Очищает последние выделенные элементы от классов выделения
       */
      _clearPressedArrow: function(){
         if(this._pressedArrow){
            this._pressedArrow.removeClass('ws-PathSelector__arrow__state-pressed');
            this._pressedArrow = undefined;
         }
      },
      /**
       * Обработчик наведения мыши
       * @param {Object} event параметры события
       */
      _onMouseOver: function(event){
         var target = $(event.target).closest('.ws-PathSelector__point, .ws-PathSelector__arrow'),
            index = target.data('index'),
            isBack = target.hasClass('ws-PathSelector__back'),
            id = isBack ? this._options.rootNodeId : this._path[index].id,
            arrow;
         if(this._menuShowed !== undefined && id !== this._menuShowed && (isBack || index < this._path.length - 1)){
            this._clearPressedArrow();
            arrow = isBack ? target : this._points[index][1];
            this._pressedArrow = arrow.addClass('ws-PathSelector__arrow__state-pressed');
            this._processMenu(id, arrow, isBack);
         }
      },
      /**
       * Возвращает html-код для элемента пути
       * @param {Number}   index номер элемента
       * @param {Boolean}  last  является ли он последним
       * @return {String}
       */
      _getPointContents: function(index, last){
         if(index === 0 && this._options.rootNodeView === 'icon') {
            var iconClass;
            if(this.isEnabled()){
               iconClass = 'icon-primary action-hover';
            }
            else{
               iconClass = 'icon-disabled';
            }
            return '<span class="ws-PathSelector__point icon-16 icon-Home2  ' + iconClass + (last ? ' ws-hidden' : '') + ' ws-PathSelector__rootIcon" title="Перейти в корень"></span>';
         }
         return '<span class="ws-PathSelector__point ws-PathSelector__pointText">' + this._getTextPoint(index) + '</span>';
      },
      _getTextPoint: function(index){
         return this._path[index].title  ? $ws.helpers.escapeHtml(this._path[index].title) : '';
      },
      /**
       * Создаёт элемент с текстом
       * @param {Number}   index номер элемента
       * @param {Boolean}  last  является ли элемент последним
       * @return {jQuery}
       */
      _drawText: function(index, last){
         var pathPoint = this._path[index],
            res = this._notify('onDrawPoint', pathPoint, last),
            point;
         if(res instanceof jQuery){
            point = res.addClass('ws-PathSelector__point ws-PathSelector-onDrawPoint');
         }
         else{
            point = $(this._getPointContents(index, last));
         }
         point.attr('data-index', index);
         if(last){
            point.addClass('ws-PathSelector__pointLast');
         }
         else{
            point.addClass('ws-PathSelector__pointNotLast');
         }
         return point;
      },
      /**
       * Рисует один элемент пути
       * @param {Object}   index элемент пути
       * @param {Boolean}  last  является ли элемент последним
       * @returns {jQuery}
       */
      _drawPoint: function(index, last){
         var point = this._drawText(index, last),
            arrow = $('<span class="ws-PathSelector__arrow"></span>');
         arrow.attr('data-index', index);
         if(last){
            arrow.addClass('ws-hidden');
         }
         this._block.append(point, arrow);
         this._points.push([point, arrow]);
         this._width[index] = (this._width[index - 1] || 0) + point.outerWidth() + arrow.outerWidth();
         return point;
      },
      /**
       * <wiTag group="Данные">
       * Получить идентификатор последнего узла.
       * @returns {Number} Идентификатор последнего узла.
       * @example
       * По клику на кнопку (button) проверить id последней крошки, и если он отличается от того, что был в прошлый раз,
       * то делаем что-то.
       * <pre>
       *    button.subscribe('onClick', function() {
       *       var browser,
       *          nodeId = browser.getPathSelector().getLastNodeId();
       *       if(nodeId != this._currentRootId) {
       *          this.doSomething();
       *          this._currentRootId = nodeId;
       *       }
       *    });
       * </pre>
       */
      getLastNodeId: function(){
         return this._path[this._path.length - 1].id;
      },
      /**
       * <wiTag group="Данные">
       * Получить набор с элементами пути.
       * @returns {Array} path Массив с элементами пути.
       * @example
       * <pre>
       *    var path = pathSelector.getPath()
       *    //если узлы пути не заданы
       *    if (!path.length) {
       *       //то установим их
       *       pathSelector.setPath([{
       *          //корневой узел
       *          title: '',
       *          id: null
       *       },{
       *          title: 'Техническая поддержка',
       *          id: 1
       *       },{
       *          title: 'Новые сотрудники',
       *          id: 2
       *       }])
       *    }
       * </pre>
       */
      getPath: function(){
         return this._path;
      },
      /**
       * <wiTag group="Управление">
       * Задать узлы пути.
       * Устанавливает элементы пути, аналогично _options.
       * @param {Array} path Массив с элементами пути.
       * Узлы пути отобразятся в том порядке, в котором они объявлены в массиве.
       * Корневой узел задавать не нужно, т.к. он добавляется автоматически.
       * Параметры корневого узла: {@link rootNodeCaption}, {@link rootNodeId}, {@link rootNodeView} и {@link folderIcon}.
       * @example
       * При готовности контрола (pathSelector) убрать все узлы пути, оставив только корень.
       * <pre>
       *     pathSelector.subscribe('onReady', function() {
       *        if (!this.isEmpty()) {
       *           this.setPath([]);
       *        }
       *     });
       * </pre>
       */
      setPath: function(path){
         this._path = path;
         this._path.unshift({
            'title': this._options.rootNodeCaption,
            'id': this._options.rootNodeId
         });
         this._build();
      },
      /**
       * <wiTag group="Управление">
       * Добавить новый узел пути.
       * @param {Object} pathPoint Объект с конфигурацией добавляемого узла (с полями title и id, аналогично одному
       * элементу из массива path).
       * @example
       * При готовности контрола (pathSelector) добавить узел пути.
       * <pre>
       *    pathSelector.subscribe('onReady', function() {
       *       this.setPath([]);
       *          title: 'Сотрудники',
       *          id: 1
       *       });
       *    });
       * </pre>
       * @see path
       * @see setPath
       * @see pop
       * @see isEmpty
       */
      append: function(pathPoint){
         this._container.find('.ws-PathSelector__pointLast').removeClass('ws-PathSelector__pointLast').addClass('ws-PathSelector__pointNotLast');
         this._container.find('.ws-path-arrow-block.ws-hidden').removeClass('ws-hidden');
         this._path.push(pathPoint);
         this._drawPoint(this._path.length - 1, true);
         if(this._path.length === 2 && !this._options.rootNodeCaption && this.isEnabled()){
            this._points[0][0].addClass('icon-primary action-hover').removeClass('ws-hidden');
         }
         this._onResizeHandler();
      },
      /**
       * <wiTag group="Управление">
       * Убрать последний элемент пути
       * @example
       * При клике на кнопку (btn) убрать последний узел пути.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       if (!pathSelector.isEmpty()) {
       *          //убираем последний узел пути
       *          pathSelector.pop();
       *       }
       *    });
       * </pre>
       * @see path
       * @see setPath
       * @see isEmpty
       * @see append
       */
      pop: function(){
         var count = this._points.length;
         this._points[count - 1][0].remove();
         this._points[count - 1][1].remove();
         this._points.pop();
         if(count >= 2){
            this._points[count - 2][0].removeClass('ws-PathSelector__pointNotLast').addClass('ws-PathSelector__pointLast');
            this._removeArrow(count);
            if(count === 2 && !this._options.rootNodeCaption){
               this._points[0][0].removeClass('icon-primary action-hover').addClass('ws-hidden');
            }
         }
         var id = this._path.pop().id;
         this._menuCache[id] = null;
         delete this._menuCache[id];
         this._loaded[id] = 0;
         this._onResizeHandler();
      },
      _removeArrow: function(count){
         this._points[count - 2][1].addClass('ws-hidden');
      },
      /**
       * <wiTag group="Данные">
       * Проверить признак находится ли в пути только корневой узел.
       * @returns {Boolean} true - в пути только корень, false - в пути не только корень.
       * @example
       * При клике на кнопку (btn) убрать последний узел пути.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       if (!pathSelector.isEmpty()) {
       *          //убираем последний узел пути
       *          pathSelector.pop();
       *       }
       *    });
       * </pre>
       * @see pop
       * @see path
       */
      isEmpty: function(){
         return this._path.length === 1;
      },
      /**
       * <wiTag group="Управление">
       * Установить корневой узел.
       * @param {Number} id Идентификатор узла.
       * @example
       * При готовности пути (pathSelector) установить корневой узел.
       * <pre>
       *    pathSelector.subscribe('onReady', function() {
       *       this.setRootNode(2);
       *    });
       * </pre>
       * @see rootNodeId
       * @see rootNodeView
       * @see rootNodeCaption
       * @see path
       * @see setPath
       */
      setRootNode: function(id){
         this._options.rootNodeId = id;
         this.setPath([]);
      },
      /**
       * <wiTag group="Управление">
       * Обновить последнюю стрелку.
       * Метод используется, к примеру, при измении записей на текущем уровне.
       * @example
       * При изменении записи иерархического представления (hierarchyView) обновлять последнюю стрелку пути (pathSelector).
       * <pre>
       *    hierarchyView.subscribe('onRecordChanged', function() {
       *       this.reload();
       *       pathSelector.updateLast();
       *    });
       * </pre>
       * @see path
       * @see setPath
       */
      updateLast: function(){
         var len = this._points.length;
         if(len){
            var id = this._path[len - 1].id;
            if(this._menuShowed === id){
               this._menuContainer.html('');
               this._menuContainer.append(this._indicator = $('<div class="ws-PathSelector__loading"></div>'));
            }
         }
      },
      /**
       * Обработчик изменения размера виджета
       */
      _onResizeHandler: function(){
         var width = this._container.width(),
               pointsCount = this._points.length,
               i,
               self = this,
               show = function(i, show){
                  for(var j = 0; j < 2; ++j){
                     if(i === pointsCount - 1 && j === 1){
                        continue;
                     }
                     self._points[i][j].toggleClass('ws-hidden', !show);
                  }
               };
         //Если суммарная ширина всех элементов больше доступной - часть надо будет скрыть
         if(pointsCount == 1){
            this._back.addClass('ws-hidden');
            show(0, false);
         }
         else{
            var firstWidth = this._width[0];
            if(this._width[pointsCount - 1] > width){
               this._back.removeClass('ws-hidden');
               this._points[0][1].addClass('ws-hidden');
               var last = pointsCount - 1;
               for(i = pointsCount - 2; i >= 1; --i){
                  if(firstWidth + this._width[pointsCount - 1] - this._width[i] < width){
                     last = i + 1;
                  }
               }
               for(i = 1; i < pointsCount - 1; ++i){
                  show(i, i >= last);
               }
               this._showedPoints = pointsCount - last - 1;
            }
            else{
               this._back.addClass('ws-hidden');
               for(i = 0; i < pointsCount - 1; ++i){
                  show(i, true);
               }
               this._showedPoints = pointsCount - 1;
            }
         }
      },
      /**
       * При начале загрузки добавляет индикатор в меню
       */
      _onBeforeLoad: function(){
         if(this._menuContainer){
            this._menuContainer.append(this._indicator = $('<div class="ws-PathSelector__loading"></div>'));
         }
      },
      /**
       * Обработчик загрузки данных в рекордсете
       * @param {Object} event Объект события
       * @param {$ws.proto.RecordSet} recordSet Рекордсет, в котором произошла загрузка
       * @param {Boolean} isSuccess Успешно ли прошла загрузка
       * @param {Error} error Ошибка, которая могла появиться во время загрузки
       * @private
       */
      _onDataLoaded: function(event, recordSet, isSuccess, error){
         if(this._indicator){
            this._indicator.remove();
            this._indicator = undefined;
         }
         if(isSuccess){
            var record,
                  id = this._recordSet.getLoadingId(),
                  recordsCount = this._recordSet.getRecordCount();
            if(!this._menuCache[id]){
               this._menuCache[id] = [];
            }
            if(this._menuContainer && id == this._menuShowed){
               this._menuContainer.empty();
            }
            if(recordsCount && this._loaded[id]){
               var nextId = undefined;
               for(var i = 0, len = this._path.length; i < len; ++i){
                  if(this._path[i].id == id){
                     nextId = (i + 1 < len ? this._path[i + 1].id : undefined);
                     break;
                  }
               }
               this._recordSet.rewind();
               while((record = this._recordSet.next()) !== false){
                  var title = record.get(this._options.titleColumn),
                      recordId = record.getKey();
                  if(record.get(this._hierarchyField) && record.get(this._options.hierarchyField) == id)
                     this._menuCache[id].push({'title': title, 'id': recordId});
               }
               if(this._menuContainer && id == this._menuShowed){
                  this._drawMenuArray(id, this._menuCache[id], nextId);
                  this._updateMenuHeight();
               }
            }
            else if(this._menuContainer && id == this._menuShowed && this._menuContainer.is(':visible')){
               this._menuContainer.hide();
               this._container.trigger('wsSubWindowClose');
            }
         }
         else{
            if(error.httpError === '403'){
               error.processed = true;
            }
         }
      },
      /**
       * Показывает меню
       */
      _menuShow: function(){
         if(!this._menuContainer.is(':visible')){
            this._menuContainer.show();
            this._container.trigger('wsSubWindowOpen');
         }

         var self = this;
         setTimeout(function(){
            self._menuContainer.focus();
         }, 0);
      },
      /**
       * Убирает меню
       */
      _menuHide: function(){
         if(!this._menuContainer){
            return;
         }
         this._menuShowed = undefined;
         if(this._menuContainer.is(':visible')){
            this._container.trigger('wsSubWindowClose');
         }
         this._menuContainer.hide();
         this._clearPressedArrow();
      },
      /**
       * При отведении мышки нужно остановить таймер, запустить его заново
       */
      _menuStartHide: function(){
         this._clearPressedArrow();
         this._menuHide();
      },
      /**
       * Обновляет позицию меню, располагает его у левой границы указанного и под ним
       * @param {jQuery} container нужный контейнер
       */
      _updateMenuPosition: function(container){
         var pos = container.offset();
         this._menuContainer.css({'left': pos.left,
                          'top': pos.top + container.outerHeight()});
      },
      /**
       * Создаёт элемент меню
       * @param {Number} menuId идентификатор отца для элемента меню
       * @param {String} title заголовок элемента меню
       * @param {Number} id идентификатор самого узла меню
       * @param {Boolean} isSelected является ли узел "выбранным"
       * @return {String}
       */
      _createMenuPoint: function(menuId, title, id, isSelected){
         var style = (this._options.folderIcon !== $ws._const.Browser.hierarchyIcons) ?
                   ' style="background-image: url(' + $ws._const.wsRoot + this._options.folderIcon + ');"' : '',
               text = title ? $ws.helpers.escapeHtml(title).replace(/ /g, '&nbsp') : '&nbsp';
         return '<div class="ws-PathSelector__menuAction' + (isSelected ? ' selected' : '') + '" data-id="' + id + '" title="' + text + '">' +
            '<span class="ws-PathSelector__menuIcon icon-16 icon-Folder icon-disabled"' + style + '></span>'
            +'<div class="ws-PathSelector__menuActionText">' + text + '</div></div>';
      },
      /**
       * Показывает сколлбар у меню, если необходимо
       */
      _updateMenuHeight: function(){
         if(this._menuMaxHeight === undefined){
            this._menuMaxHeight = parseInt(this._menuContainer.css('max-height'), 10);
         }
         if(this._menuContainer.get(0).scrollHeight > this._menuMaxHeight){
            this._menuContainer.css('overflow-y', 'scroll');
         }
      },
      /**
       * Дорисовывает в меню строки из массива
       * @param {Number}   id       идентификатор меню
       * @param {Array}    array    массив из объектов вида {'title': 'atata', 'id': 100500}
       * @param {Number}   nextId   идентификатор следующего узла
       */
      _drawMenuArray: function(id, array, nextId){
         var html = '';
         for(var i = 0, len = array.length; i < len; ++i){
            html += this._createMenuPoint(id, array[i].title, array[i].id, nextId == array[i].id);
         }
         this._menuContainer.html(html);
         this._updateMenuHeight();
      },
      /**
       * Возвращает описание строк для меню из массива идентификаторов записией, фильтрует данные
       * @param {Array} childs массив с идентификаторами записей
       * @return {Array} массив с объектами вида {id: ..., title: ...}
       */
      _getRowsFromChilds: function(childs){
         var record,
            rows = [];
         for(var i = 0, len = childs.length; i < len; ++i){
            if(this._browserRecordSet.contains(childs[i])){
               record = this._browserRecordSet.getRecordByPrimaryKey(childs[i]);
               if(record.get(this._hierarchyField)){
                  rows.push({
                     title: record.get(this._options.titleColumn),
                     id: record.getKey()
                  });
               }
            }
         }
         return rows;
      },
      /**
       * Получает необходимые строки одним из трёх способов: или из обработчика, или из рекордсета браузера, или из своего рекордсета
       * @param {String} id      идентификатор узла
       * @param {String} nextId  идентификатор следуюего узла
       */
      _loadNode: function(id, nextId){
         var childs,
            res;
         res = this._notify('onArrowClick', id);
         if (res === false) {
            this._menuHide();
            return;
         }
         if(res instanceof $ws.proto.Deferred){
            this._onBeforeLoad();
            res.addCallback(function(rows){
               this._drawMenuArray(id, rows);
            }.bind(this));
         }
         else if(this._browserRecordSet && !this._browserRecordSet.usePaging() && (childs = this._browserRecordSet.recordChilds(id)).length){
            this._drawMenuArray(id, this._getRowsFromChilds(childs), nextId);
         }
         else if(this._recordSet && !this._loaded[id]){
            this._loaded[id] = 1;
            this._recordSet.loadNode(id, true, 0);
         }
      },
      /**
       * Устанавливает содержимое меню
       * @param {Array}    rows  Массив с нужной информацией, аналогичен PathSelector
       * @param {Number}   id    Идентифкатор корня, который будет использован для получения записей
       */
      _setMenuRows: function(rows, id){
         this._menuContainer.html('').css('overflow-y', 'hidden');
         var nextId;
         for(var i = 0, len = this._path.length; i < len; ++i){
            if(this._path[i].id == id){
               nextId = (i + 1 < len ? this._path[i + 1].id : undefined);
               break;
            }
         }

         if(rows){
            this._drawMenuArray(id, rows, nextId);
         }
         else{
            if(this._recordSet && this._menuCache[id]){
               if(this._menuCache[id].length){
                  this._drawMenuArray(id, this._menuCache[id], nextId);
               }
               else if(this._menuContainer.is(':visible')){
                  this._menuContainer.hide();
                  this._container.trigger('wsSubWindowClose');
               }
            }
            else{
               this._loadNode(id, nextId);
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить параметры запроса источника данных.
       * @param {Object} query Параметры запроса.
       * @example
       * <pre>
       *    pathSelector.setQuery({
       *       'Должность': 'Инженер'
       *    });
       * </pre>
       * @see dataSource
       */
      setQuery: function(query){
         var myQuery = $ws.core.clone(query);
         this._loaded = {};
         this._menuCache = {};
         this._menuHide();
         myQuery['Разворот'] = 'Без разворота';
         myQuery['ВидДерева'] = 'Только узлы';
         myQuery[this._recordSet.getHierarchyField()] = this.getLastNodeId();
         this._recordSet.clear();
         this._recordSet.resetFilter(myQuery, true);
      },
      /**
       * <wiTag group="Данные">
       * Установить источник данных.
       * @param {Object} dataSource Источник данных.
       * @example
       * Задать источник данных для pathSelector.
       * <pre>
       *    var dataSource = {
       *       readerParams: {
       *          linkedObject: 'Пользователь',
       *          queryName: 'СписокПоСтруктуреПредприятияДляАвтодополнения'
       *       },
       *       readerType: 'ReaderUnifiedSBIS',
       *       filterParams: {
       *       'Город': 'Ярославль'
       *       }
       *    };
       *    pathSelector.setSource(dataSource);
       * </pre>
       * @see dataSource
       */
      setSource: function(dataSource){
         this._ready.addCallback(function(){
            this._recordSet.setSource(dataSource.readerType, dataSource.readerParams, dataSource.filterParams, false);
         }.bind(this));
      },
      destroy: function(){
         if(this._menu){
            if(this._menuContainer.is(':visible')){
               this._container.trigger('wsSubWindowClose');
            }
            this._menuContainer.empty().remove();
         }
         $ws.proto.PathSelector.superclass.destroy.apply(this, arguments);
      },
      /**
       * Пересчитывает ширину элементов
       */
      _updateWidths: function(){
         var right = 0;
         for(var i = 0, len = this._points.length; i < len; ++i){
            right += this._points[i][0].outerWidth() + this._points[i][1].outerWidth();
            this._width[i] = right;
         }
      },
      /**
       * Пересоздаёт первый элемент. Нужно в связи с тем, что вид первого узла можно менять методами
       * @protected
       */
      _rebuildFirstNode: function () {
         var text = this._drawText(0, this._path.length === 1);
         this._points[0][0].replaceWith(text);
         this._points[0][0] = text;
         this._updateWidths();
         this._onResizeHandler();
      },
      /**
       * <wiTag group="Управление">
       * Установить подпись корневого узла.
       * Свойство актуально, если {@link rootNodeView} = 'text'.
       * @param {String} name Текст подписи.
       * @example
       * При готовности контрола (pathSelector) установить подпись корневого узла.
       * <pre>
       *    pathSelector.subscribe('onReady', function() {
       *       this.setRootName('Начало');
       *    });
       * </pre>
       * @see rootNodeCaption
       * @see rootNodeId
       * @see rootNodeView
       */
      setRootName: function(name){
         this._options.rootNodeCaption = name;
         if(this._path[0]){
            this._path[0].title = name;
         }
         if(this._rootElement && this._options.rootNodeView === 'text'){
            this._rebuildFirstNode();
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить внешний вид корневого узла.
       * @param {String} type Тип корневого узла.
       * Возможные значения:
       * <ol>
       *    <li>text - корневой узел отображается текстом.</li>
       *    <li>icon - корневой узел отображается иконкой.</li>
       * </ol>
       * @example
       * При готовности контрола (pathSelector) установить отображение корневого узла как иконки.
       * <pre>
       *    pathSelector.subscribe('onReady', function() {
       *       this.setRootNodeView('icon');
       *    });
       * </pre>
       * @see rootNodeView
       * @see rootNodeCaption
       * @see folderIcon
       */
      setRootNodeView: function(type) {
         if (this._options.rootNodeView !== type) {
            this._options.rootNodeView = type;
            this._rebuildFirstNode();
         }
      },
      /**
       * <wiTag group="Управление">
       * Указать рекордсет представления данных.
       * @param {$ws.proto.RecordSet} recordSet
       * @example
       * <pre>
       *    $ws.helpers.newRecordSet('Сотрудник', 'Список', {}, undefined, false).addCallback(function(rs){
       *       pathFilter.setBrowserRecordSet(rs);
       *    });
       * </pre>
       */
      setBrowserRecordSet: function(recordSet){
         this._browserRecordSet = recordSet;
      },
      /**
       * Включает/выключает контрол
       * @param {Boolean} enable
       */
      _setEnabled: function(enable){
         if(enable !== this._options.enabled && !this._options.rootNodeCaption){
            this._points[0][0].toggleClass('icon-primary action-hover', enable).toggleClass('icon-disabled', !enable);
         }
         $ws.proto.PathSelector.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Установить поле иерархии источника данных.
       * @param {String} field Имя поля иерархии.
       * @example
       * При готовности контрола (pathSelector) установить иерархическое поле.
       * <pre>
       *    pathSelector.subscribe('onReady', function() {
       *       this.setHierarchyField('Узел');
       *    });
       * </pre>
       * @see hierarchyField
       * @see dataSource
       */
      setHierarchyField: function(field){
         this._options.hierarchyField = field;
         this._hierarchyField = field + '@';
      },
      /**
       * <wiTag group="Управление">
       * Получить количество узлов в хлебных крошках, включая корневой.
       * @returns {Number} Количество узлов.
       * @example
       * Сохранять статистику о глубине просмотра при работе с pathSelector.
       * <pre>
       *    pathSelector.subscribe('onDrawPoint', function(eventObject) {
       *       var length = this.getPathLength(),
       *           //получаем пользовательские данные по полю maxLength
       *           userData = this.getUserData('maxLength');
       *       if (userData < length) {
       *          this.setUserData('maxLength', length);
       *       }
       *    });
       * </pre>
       * @see path
       * @see getPathElement
       * @see togglePathElement
       */
      getPathLength : function() {
         return this._path.length;
      },
      /**
       * <wiTag group="Управление">
       * Получить узел хлебных крошек.
       * @param {Number} index Номер объекта, описывающего конфигурацию узла.
       * Возможны значения от 0 до {@link getPathLength()} - 1.
       * @returns {Object} Объект с описанием узла пути.
       * @example
       * При клике на кнопку (button) установить новый корневой узел.
       * <pre>
       *    button.subscribe('onClick', function() {
       *       var length = pathSelector.getPathLength(),
       *           lastElement = pathSelector.getPathElement(length-1),
       *           id = lastElement.id;
       *       pathSelector.setRootNode(id);
       *    });
       * </pre>
       * @see setRootNode
       * @see togglePathElement
       * @see path
       */
      getPathElement : function(index) {
         return this._path[index];
      },
      /**
       * <wiTag group="Управление">
       * Скрыть узел хлебных крошек.
       * @param {Number} index Номер объекта, описывающего конфигурацию узла.
       * Возможны значения от 0 до {@link getPathLength()} - 1.
       * @param {Boolean} [visibility] Показать (true) или скрыть (false).
       * Если не задать, то видимость узла будет переключаться в противоположное текущему состояние.
       * @example
       * При отрисовке последнего узла пути скрыть его отображение и поместить текст заголовка в html-элемент.
       * <pre>
       *    pathSelector.subscribe('onDrawPoint', function(eventObject, objectElement, lastElement) {
       *       if (lastElement) {
       *          this.togglePathElement(this.getPathLength()-1, false);
       *          //вносим в содержимое тега текст заголовка узла пути
       *          $('#div-title-text').text(objectElement.title);
       *       }
       *    });
       * </pre>
       * @see getPathLength
       * @see path
       */  
      togglePathElement : function(index, visibility) {
         if(!this._points[index]){
            return;
         }
         if(visibility === undefined){
            visibility = !this._points[index][0].is(":visible");
         }
         if(visibility && this._hiddenElements[index]) {
            delete this._hiddenElements[index];
         }
         else {
            this._hiddenElements[index] = this._path[index];
         }
         this._points[index][0].toggle(visibility);
         this._points[index][1].toggle(visibility);
      }
   });

   return $ws.proto.PathSelector;

});
