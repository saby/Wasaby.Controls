/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 17.04.13
 * Time: 17:02
 * To change this template use File | Settings | File Templates.
 */
/**
 * Модуль "Компонент Автодополнение".
 *
 * @description
 */
define('js!SBIS3.CORE.Suggest', 
   [
      'js!SBIS3.CORE.Control', 
      'js!SBIS3.CORE.DialogSelector', 
      'js!SBIS3.CORE.TableView', 
      'js!SBIS3.CORE.TDataSource',    
      'js!SBIS3.CORE.FloatAreaSelector',
      'js!SBIS3.CORE.Button',
      'is!browser?js!Ext/jquery-ui/jquery-ui-position',
      'css!SBIS3.CORE.Suggest',
      "js!SBIS3.CORE.KbLayoutRevert"
   ],
   function(Control, DialogSelector, TableView, TDataSource, FloatAreaSelector, Button) {

   'use strict';

   var SuggestTableView = TableView.extend({
      $protected: {
         _options: {
            parentSuggest: null,
            editDialogTemplate: '',
            editBranchDialogTemplate: '',
            minWidth: MIN_WIDTH,
            display: {
               showRecordsCount: false,
               showRoot: false,
               showPaging: false,
               showTiming: false,
               reload: false,
               autoResize: false,
               rootNode: null
            },
            dataSource: {
               firstRequest: false
            }
         }
      },
      $constructor: function() {
         if (!(this._options.parentSuggest instanceof $ws.proto.Suggest)) {
            throw new Error('Параметр parentSuggest должен содержать экземплар класса $ws.proto.Suggest');
         }
      },
      canAcceptFocus: function() {
         return this._options.parentSuggest.isVisible();
      },
      _notifyOnSizeChanged: function(){},
      getParentSuggest: function() {
         return this._options.parentSuggest;
      },
      getOpener: function() {
         return this._options.parentSuggest.getOpener();
      }
   });

   var
   //Количество записей, отображаемых в браузере со всеми вариантами на одной странице. Требуется замена в suggestShowAll.xml
      SHOW_ALL_ROWS_PER_PAGE = 20,
   //Задержка скрытия окна после ухода фокуса с поля ввода
      HIDE_TIMEOUT = 200,
   //Минимальная ширина контейнера
      MIN_WIDTH = 150,
   //Диалог по-умолчанию
      SHOW_ALL_TEMPLATE = 'suggestShowAll',
      ICON_WIDTH = 16;

   /**
    * @class $ws.proto.Suggest
    * @extends $ws.proto.Control
    * @control
    * @category Select
    */
   $ws.proto.Suggest = Control.Control.extend(/** @lends $ws.proto.Suggest.prototype */{
      /**
       * @event onDataLoaded После загрузки данных
       * <wiTag group="Данные">
       * Происходит после загрузки данных при поиске
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @example
       * <pre>
       *    suggest.subscribe('onDataLoaded', function(event){
       *       //по окончанию загрузки сменим ее статус
       *       $ws.single.ControlStorage.getByName('load status').html('Выберите значение');
       *    });
       * </pre>
       */
      /**
       * @event onSuggest При выборе значения.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @param {$ws.proto.Record} Выбранная запись
       * @param {Object} values Ассоциативный массив по типу 'имя поля': 'значение поля из записи'
       * @return Можно вернуть:
       * <ol>
       *    <li>false - выбор не будет обработан, значения из выбранной записи не будут проставлены, подстрочное поле не
       *    будет закрыто.</li>
       *    <li>true - выбор не будет обработан, но подстрочное поле будет закрыто.</li>
       * </ol>
       * @example
       * <pre>
       *    suggest.subscribe('onSuggest', function(event, record, values){
       *       if(record.get('Сотрудник.@Телефон') === null){
       *          $ws.core.alert('Переназначить задание можно только сотруднику, у которого есть телефон.');
       *          event.setResult(false);
       *       } else if(values['Телефон'].indexOf("(") !== 0){
       *          // если в начале номера не указан код города, то считаем, что допишем код Ярославля
       *          event.setResult(true);
       *          $ws.single.ControlStorage.getByName("Телефон").setValue('(852)' + values['Телефон']);
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onDataLoadStarted При начале загрузки данных
       * <wiTag group="Данные">
       * Происходит в момент начала загрузки данных.
       * Данное событие носит информационный характер. В нём нельзя поменять параметры вызова, т.к. они уже сформированы.
       * Также нельзя прервать загрузку.
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @example
       * <pre>
       *    suggest.subscribe('onDataLoadStarted', function(event){
       *       //в начале загрузки напишем ее статус
       *       $ws.single.ControlStorage.getByName('load status').html('Идет загрузка...');
       *    });
       * </pre>
       */
      /**
       * @event onMenuOpen При открытии меню
       * <wiTag <wiTag group="Управление">
       * Происходит в момент появленя подстрочного поля автодополнения
       * В этом событии нельзя повлиять на скрытие подстрочного поля.
       * @param {Object} eventObject Дескриптор события
       * @example
       * <pre>
       *    suggest.subscribe('onMenuOpen', function(event){
       *       // по открытию подстрочного поля выбора скроем кнопку поиска
       *       $ws.single.ControlStorage.getByName('search').hide();
       *    });
       * </pre>
       */
      /**
       * @event onMenuHide При скрытии меню
       * <wiTag group="Управление">
       * Происходит в момент скрытия подстрочного поля автодополнения.
       * В этом событии нельзя повлиять на скрытие подстрочного поля.
       * @param {Object} eventObject Дескриптор события.
       * @example
       * <pre>
       *    suggest.subscribe('onMenuHide', function(event){
       *       // по закрытию подстрочного поля выбора покажем кнопку поиска
       *       $ws.single.ControlStorage.getByName('search').show();
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            tabindex : false,
            /**
             * @cfg {Number} Количество отображаемых записей
             * <wiTag group="Отображение">
             * Задаёт сколько будет выведено результатов поиска.
             */
            rowsCount: 5,
            /**
             * @cfg {String[]} Имена параметров фильтрации
             * <wiTag group="Данные">
             * Задает с какими именами попадут в фильтр метода значения полей ввода
             * <pre>
             *    filter: [ 'ФильтрФИО', 'СтрокаПоиска' ]
             * </pre>
             * @editor InternalMultipleComponentChooser
             */
            filter: [],
            /**
             * @cfg {Number} Задержка
             * <wiTag group="Отображение">
             * Задержка перед началом поиска.
             */
            delay: 0,
            /**
             * @cfg {Number} Минимальная длина значения
             * <wiTag group="Данные">
             * Минимальная длина введённого значения, при которой следует начать поиск.
             */
            startChar: 3,
            /**
             * @cfg {String[]} Источники фильтров
             * <wiTag group="Данные">
             * Массив идентификаторов полей, ввод в которые необходимо обрабатывать
             * <pre>
             *    sourceField: [ $ws.single.ControlStorage.getByName('Поиск').getId() ]
             * </pre>
             * @editor InternalMultipleComponentChooser
             */
            sourceField: [],
            /**
             * @cfg {String[]} Результирующие поля
             * <wiTag group="Данные">
             * Массив идентификаторов полей, в которые необходимо проставить результат выбора
             * <pre>
             *    resultField: [ $ws.single.ControlStorage.getByName('ФИО').getId() ]
             * </pre>
             * @editor InternalMultipleComponentChooser
             */
            resultField: [],
            /**
             * @cfg {String[]} Поля выборки
             * <wiTag group="Данные">
             * Массив имен полей выборки, значения из которых необходимо прставить в результирующие поля
             * <pre>
             *    processField: [ 'РП.ФИО' ]
             * </pre>
             */
            processField: [],
            /**
             * @cfg {Object} Источник данных
             * <wiTag group="Данные">
             * Описание метода бизнес-логики, с помощью которого осуществляется поиск
             * Необходимо для работы без связанного браузера.
             * <pre>
             *    dataSource: {
             *       readerParams: {
             *          linkedObject: 'Пользователь',
             *          queryName: 'СписокПоСтруктуреПредприятияДляАвтодополнения'
             *       }
             *    }
             * </pre>
             *
             * @editor TDataSourceEditorNoMethods
             */
            dataSource: TDataSource,
            /**
             * @cfg {Object} Дополнительные параметры фильтрации
             * <wiTag group="Данные">
             * Дополнительные параметры, которые должны уйти в фильтре для метода помимо значений полей
             * Задаются аналогично параметрам фильтрации выборки
             *
             * <pre>
             *    filterParams: {
             *       // параметр фильтрации выводить ли заблокированных пользователей задается значением
             *       'Заблокированные': null,
             *       // параметр фильтрации Дата берется из функции
             *       'Дата': function(){
             *          return new Date();
             *       },
             *       // а подразделение, в котором нужно искать пользователей берется из поля контекста
             *       'Подразделение': {
             *          fieldName: 'Документ.НашаОрганизация'
             *       }
             *    }
             * </pre>
             * Дополнительные параметр фильтрации можно получить методом getParams и установить методом setParams
             * <pre>
             *    var params = suggest.getParams();
             *    if(params["Подразделение"] === null){
             *       params["Подразделение"] = $ws.single.GlobalContext().getValue("Организация");
             *       suggest.setParams(params);
             *    }
             * </pre>
             */
            filterParams: {},
            /**
             * @cfg {array|string} Связанное/ые представление/я данных
             * <wiTag group="Данные">
             * Идентификатор представления данных, в котором следует проводить поиск
             * <pre>
             *    linkedBrowser: $ws.single.ControlStorage.getByName("TableView").getId()
             * </pre>
             *
             * @editor InternalMultipleBrowserChooser
             */
            linkedBrowser: [],
            /**
             * @cfg {Boolean} Сохранять фильтр связанного представления
             * <wiTag group="Данные">
             * Сохранять фильтр связанного представления, добавляя параметры поиска или сбрасывать
             * Этот параметр поможет, если у связанного представления данных есть какие-то параметры, о которых не знает автодополнение
             */
            useBrowserFilter: false,
            display: {
               /**
                * @cfg {SBIS3.CORE.FieldLink/Columns.typedef[]} Конфигурация колонок
                * <wiTag group="Отображение">
                * Задает описание столбцов выборки, которые нужно показать в подстрочном поле
                * Задается аналогично описанию колонок в табличном представлении
                * <pre>
                *    columns: [
                *       {
                *          title: 'ФИО',
                *          field: 'РП.ФИО',
                *          width: 256
                *       },
                *       {
                *          title: 'Должность',
                *          field: 'Должность'
                *       }
                *    ]
                * </pre>
                */
               columns : [],
               /**
                * @cfg {Boolean} Отображать заголовок
                * <wiTag group="Отображение">
                * Отображать ли заголовки столбцов в подстрочном поле.
                * Возможные значения:
                * <ol>
                *    <li>true - отображать заголовки столбцов в подстрочном поле;</li>
                *    <li>false - не отображать заголовки столбцов.</li>
                * </ol>
                */
               showHead : true,
               /**
                * @cfg {Function} Функция отображения строки
                * <wiTag group="Отображение">
                * Функция пользовательского отбражения строки подстрочной подсказки.
                * В качестве аргументов приходит jQuery-элемент строки и запись {$ws.proto.Record} выборки.
                * @example
                * <pre>
                *    rowRender: function(row, record){
                *       if(record.get('Сотрудник.Уволен') === true)
                *          row.addClass('employee-fail');
                *    }
                * </pre>
                */
               rowRender : '',
               /**
                * @cfg {Boolean} Использовать ли загрузку по частям
                * Возможные значения:
                * <ol>
                *    <li>true - использовать загрузку по частям;</li>
                *    <li>false - использовать полную загрузку.</li>
                * </ol>
                * Только в случае дерева или иерархии.
                */
               partiallyLoad: false,
               /**
                * @cfg {String} Вид представления
                * <wiTag group="Отображение">
                * Вид отображения табличного браузера.
                * Возможно отображение в виде таблицы, иерархии, дерева и дерева папок.
                * Для простого табличного браузера принимает значение "table".
                */
               viewType: '',
               /**
                * @cfg {String} Поле иерархии
                * <wiTag group="Данные">
                * Имя поля, в котором хранятся данные о положении папки в иерархии (поле с типом иерархия в таблице).
                */
               hierColumn: 'Раздел',
               /**
                * @cfg {Boolean} Обрезать ли длинные строки
                */
               cutLongRows: false,
               /**
                *  @cfg {String} Используем пейджинг или нет
                *  @variant '' нет
                *  @variant 'parts' сокращенный - по результатам загрузки узнаёт, есть ли следующая страница, в hasNextPage boolean
                *  @variant 'full' полный - грузит информацию об общем количестве страниц, в hasNextPage number
                *  @variant 'auto' автоматически - теоретический параметр
                */
               usePaging: 'full',
               /**
                *  @cfg {Boolean} Показывать кнопку 'Добавить' или нет
                *  @variant 'true' Показать
                *  @variant 'false' Не показывать
                */
               useAddMoreButton: false
            },
            /**
             * @cfg {Function} Обработчик, срабатывающий при активации кнопки 'Добавить'
             */
            addMoreButtonHandler: '',
            /**
             * @cfg {Boolean}
             * автодополнение всегда лежит в body, а не в родительском контейнере.
             * при изменении размеров родителя автодополнение пересчитывать не надо
             */
            isContainerInsideParent: false,
            /**
             * @cfg {String} Ширина браузера
             */
            browserWidth: '500',
            /**
             * @cfg {Boolean} Выделять первую строку после загрузки
             * Важно! Если включена история при поиске,
             * то строка при показе истории не будет выделена,
             * когда показывается только история!
             */
            selectOnLoad: true,
            /**
             * @cfg {Boolean} Нужно ли распахивать дерево при использовании фильтра
             */
            expandTree: false,
            /**
             * @cfg {String} Максимальная высота браузера
             */
            maximumHeight: 'auto',
            /**
             * @cfg {Boolean} Автоматически показывать варианты при приходе фокуса
             */
            autoShow: false,
            /**
             * @cfg {Boolean} Автоматически подстраивать ширину
             */
            browserAutoWidth: false,
            /**
             * @cfg {String} Шаблон диалога показа всех записей
             * @editor ExternalComponentChooser
             */
            showAllTemplate: 'suggestShowAll',
            /**
             * @cfg {Boolean} При заходе в иерархическом браузере очищает поля ввода и фильтрацию
             */
            clearOnOpen: false,
            /**
             * @cfg {Boolean} Очищать результаты при невозможности поиска
             * <wiTag group="Данные">
             * Очищать ли браузер при недостатке букв в строке поиска
             */
            clearBrowser: false,
            /**
             * @cfg {Boolean} Сбрасывать ли текущую папку при поиске в иерархии
             */
            resetRoot: false,
            /**
             * @cfg {String} Режим выбора записей при клике в вспывашке на "показать все"
             * В новом диалоге или во всплывающей панели.
             * @variant newDialog в новом диалоге
             * @variant newFloatArea во всплывающей панели
             */
             selectRecordsMode : 'newDialog',
             /**
              * @cfg {Boolean} Задает необходимость использовать выбор из таблицы, настроеной пользователем
              * Если будет установлен в true, то набор данных автдополнения не будет установлен в таблицу, также не будет перенесена функция рендеринга
              */
             useUserBrowser: false,
            /**
             * @cfg {Boolean} Использовать механизм смены неверной раскладки @see $ws.single.KbLayoutRevert
             * Если будет установлен, то при неудачном поиске раскладка изменится
             */
             useKbLayoutRevert : false,
            /**
             * @cfg {String} Задаёт необходимость использования истории при поиске
             * В качестве значения принимает имя метода поиска в истории.
             * Концепция метода:
             * <ol>
             *    <li>Получить список истории выбора автодополнения по его привязке. Привязка - это путь до автодополнения вида "имя шаблона родителя автодополнения/имя автодополнения". Это сделано для большей уникальности ключа, чтобы несколько автодополнений на странице корректно сохраняли историю.
             *
             *    Получить список истории в методе БЛ можно используя метод пользовательских параметров "ПользовательскиеПараметры.ПолучитьСписокЗначений" этот метод принимает на вход параметр Путь, на выходе отдаёт ключи, по которым будут отбираться нужные записи.
             *
             *    Полученные выше значения, а их может быть не более 10, можно отфильтровать. Так как по сигнатуре метод истории аналогичен простому списочному методу, то в его параметрах есть Фильтр, который можно применить.</li>
             *    <li>Вернуть на выход список записей истории.</li>
             * </ol>
             * @example
             * <pre>
             *    historyMethod: 'Пользователь.СписокДляИстории'
             * </pre>
             * @see historyKeyField
             * @editor MethodBLChooser
             */
             historyMethod: '',
             /**
              * @cfg {String} Ключ поля для истории
              * Ключ поля, которое нужно отобразить в историю. Актуально при использовании поля связи.
              * @see historyMethod
              * @editor BLFieldsChooser
              */
             historyKeyField: '',
             /**
              * @cfg {String} Имя поля для описания в контексте
              */
             definition : false
         },
         _useDefinition: false,
         _currentInputValue: undefined,
         _currentBrowser: [],
         _currentRecordSet: null,
         _sources: [],
         _sourcesNames: {},
         _results : undefined,
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.down,
            $ws._const.key.up,
            $ws._const.key.left,
            $ws._const.key.right,
            $ws._const.key.esc,
            $ws._const.key.space,
            $ws._const.key.tab
         ],
         _timer: undefined,            //Таймер, по истечении которого отправляется запрос
         _filter: undefined,           //Заготовленный запрос для браузера, когда он подгрузится. После загрузки браузера не используется
         _hasMoreLabel: undefined,     //Элемент с информацией о том, что есть ещё записи
         _browserContainer: undefined, //Элемент, содержащий в себе браузер
         _hideTimer: undefined,        //Таймер на скрытие окна
         _isVisible: false,            //Показывается ли в данный момент автодополнение
         _loading: undefined,          //Индикатор загрузки
         _hasFocus: false,             //Имеют ли поля фокус
         _clearButtons: [],            //Кнопки для очистки полей
         _loaded: false,               //Флаг того, что запрос по последнему фильтру был полностью выполнен
         _currentField: 0,             //Номер текущего поля, именно около него нужно показывать меню
         _browserInit: [],             //Был ли проинициализирован браузер
         _containerConnectedToLinkedBrowser: false,
         _browserHandlers: [],          //Обработчики браузера
         _kbReverted : false,           // Флаг повторного запроса при автосмене раскладки
         _historyRecordSet: null,       //Набор данных для получения истории
         _historyBrowserContainer: undefined, // Контейнер для браузера истории
         _historyBlock: undefined,
         _ownerName: '',
         _sourcesOwner: {},              //Владелец/владельцы для полей ввода
         _windowChangeHandler: undefined,//Обработчик на изменение окна(scroll/resize)
         _addMoreButton: undefined,      //кнопка 'Добавить' у выпадающего меню
         _revertedValues: {},            //Объект, содержащий в себе значения после изменения раскладки
                                         //в виде 'номер поля: изменённое значение'
         _onTabClickLastActiveRecord: undefined,//Последняя активная запись, которая была при нажатии на 'Tab'
         _setDefinitionValueHandler: undefined,
         _onMouseWheelHandler: undefined, //Обработчик на событие скрола колёсиком мыши
         _hiddenRowsHeight: 0,            //высота скрытых строк у выпадающего меню
         _historyBrowser: undefined,
         _activeBrowser: undefined,        //текущий активный браузер(может быть браузер истории, а может быть обычный браузер саггеста)
         _needShowHistory: true
      },
      $constructor : function(){
         var self = this;
         this._options.linkedBrowser = Array.isArray(this._options.linkedBrowser) ? this._options.linkedBrowser : [this._options.linkedBrowser];
         this._ownerName = this.makeOwnerName();
         this._publish('onDataLoaded', 'onSuggest', 'onDataLoadStarted', 'onMenuHide', 'onMenuOpen');
         this._loading = $('<div />', {
            'class': 'ws-suggest-loading ws-hidden'
         });
         if(this._options.useKbLayoutRevert && this._options.delay < 500) {
            this._options.delay = 500;
         }
         if(!this._container){
            if(this._options.linkedBrowser.length) {
               for (var k = 0, browserLen = self._options.linkedBrowser.length; k < browserLen; k++) {
                  //TODO избавиться от @deprecated метода waitWithParentName(нужно поправить тесты)
                  $ws.single.ControlStorage.waitWithParentName(this._options.linkedBrowser[k]).addCallback(function (browser) {
                     self._container = browser.getContainer();
                     self._containerConnectedToLinkedBrowser = true;
                     BOOMR.plugins.WS.reportEvent("$ws.proto.Suggest", "constructor: автодополнению не задан контейнер. Цепляем его к контейнеру связанного браузера.");
                     return browser;
                  });
               }
            }
            if(!this._container){
               this._container = $('<div></div>');
               this._container[0].wsControl = this;
            }
         }
         this._container.addClass('ws-hidden');
         if(this._options.linkedBrowser.length){
            this._width = 0;
            this._height = 0;
         }
         else {
            this._container.css('z-index','');//Отпиливаем z-Index, потому что он почему то стал приходить из Джина
            this._container.addClass('ws-suggest-container')
               .bind('focus', this._moveFocus.bind(this))
               .css ({
                  width: parseInt(this._options.browserWidth, 10) - ($ws._const.browser.chrome ? 1 : 0) + 'px'
               });
            if(this._options.maximumHeight !== 'auto'){
               this._options.maximumHeight = parseInt(this._options.maximumHeight, 10);
               this._container.height(this._options.maximumHeight + 'px');
            }
            this._container.css('right', 'auto !important');
            this._browserContainer = $('<div />', {
                  'class': 'ws-suggest-browser'
               })
               .appendTo(this._container)
               .css ({
                  width: parseInt(this._options.browserWidth, 10) + 'px'
               });
            if(this._options.maximumHeight !== 'auto'){
               this._browserContainer.height(self._options.maximumHeight + 'px');
            }
            if(this._options.display.useAddMoreButton && typeof this._options.addMoreButtonHandler == 'function') {
               this._addMoreButton = $('<div />', {
                  'class': 'ws-suggest-addMoreContainer ws-hidden'
               });
               this._container.append(this._addMoreButton);
            }
            this._container.append(this._hasMoreLabel = $('<div class="ws-suggest-hasmore ws-hidden"></div>')).appendTo('body');
         }

         var controlsReady = new $ws.proto.ParallelDeferred();
         if(!(this._options.filter instanceof Array &&
            this._options.filter.length === this._options.sourceField.length)){
            throw new Error('filter must be an array with the same size, as sourceFiled');
         }
         this._initFields(this._options.sourceField, true, controlsReady);
         if(this._options.resultField.length){
            this._results = [];
            if(this._options.processField.length !== this._options.resultField.length)
               throw new Error('processField must be an array with the same size, as resultFiled');
            this._initFields(this._options.resultField, false, controlsReady);
         }

         controlsReady.done().getResult().addCallback(function(){
            self._reloadControls(self._sources, true);
            if (self._results === undefined) {
               self._results = self._sources;
            }
            else {
               self._reloadControls(self._results, false);
            }

            if(!self._options.filter)
               throw new Error('filter option must be set');
            if(!self._options.dataSource && !self._options.linkedBrowser.length)
               throw new Error('dataSource option must be set');

            if(!self._options.processField)
               self._options.processField = self._options.filter;

            if(!!self._options.linkedBrowser.length && !self._browserInit.length) {
               for (var k = 0, browserLen = self._options.linkedBrowser.length; k < browserLen; k++) {
                  self._init(k);
               }
            }
         });
         this._initSuggestEvents();
      },

      /**
       * Заменяет строки из массива контролами, айдишники которых равны этим самым строкам
       * @param {Array}    array    Массив с контролами/строками
       * @param {Boolean}  isSource Нужно ли подписываться на события контрола
       */
      _reloadControls: function(array, isSource){
         for (var i = 0, len = array.length; i < len; ++i) {
            if (typeof(array[i]) === 'string') {
               try {  //здесь могут доставаться контролы, которые уже уничтожены
                  array[i] = $ws.single.ControlStorage.getWithParentName(array[i]);
                  if (isSource) {
                     this._sourcesNames[this._options.filter[i]] = true;
                     this._sourcesOwner[i] = array[i].getOwner ? array[i].getOwner() : undefined;
                     this._initSourceEvents(i, array[i], this._options.linkedBrowser.length);
                  }
               }
               catch (e) {
               }
            }
         }
      },

      /**
       * Инициализирует массив с полями
       * @param {Array} array Массив с идентификаторами полей или с контролами полей
       * @param {Boolean} isSource Нужно ли подписываться на события полей
       * @param {$ws.proto.ParallelDeferred} deferred Деферред готовности всех полей
       */
      _initFields: function(array, isSource, deferred){
         for (var i = 0, len = array.length; i < len; ++i) {
            var field = array[i];
            if (typeof(field) === 'string') {
               this[isSource ? '_sources' : '_results'].push(array[i]);
               //TODO избавиться от @deprecated метода waitWithParentName(нужно поправить тесты)
               deferred.push($ws.single.ControlStorage.waitWithParentName(field));
            }
            else if (field instanceof Control.Control) {
               this[isSource ? '_sources' : '_results'].push(field);
               if (isSource) {
                  this._initSourceEvents(i, field, this._options.linkedBrowser.length && isSource);
               }
            }
            else if (isSource) {
               throw new Error('$ws.proto.Suggest: sourceField has illegal control with id = "' +
                  array[i] + '"');
            }
         }
      },
      /**
       * Обработчик на изменение размеров окна браузера
       */
      _moveMenuOnResize: function() {
         if(this._isVisible) {
            this._moveMenuToField(this._sources[this._currentField].getContainer());
         }
      },
      /**
       * Обработчик на скролл колёсиком мыши
       */
      _onMouseWheel: function(e) {
         if(this._isVisible) {
            var brContainer = this._browserContainer.find('.ws-browser-container'),
                scrollTop = brContainer[0].scrollTop,
                scrollHeight = brContainer[0].scrollHeight,
                height = brContainer.height(),
                delta = (e.type === 'DOMMouseScroll' ? e.originalEvent.detail * -40 : e.originalEvent.wheelDelta),
                up = delta > 0;

            if (!up && -delta > scrollHeight - height - scrollTop) {
               brContainer.scrollTop(scrollHeight);
               e.stopPropagation();
               e.preventDefault();
               return false;
            } else if (up && delta > scrollTop) {
               brContainer.scrollTop(0);
               e.stopPropagation();
               e.preventDefault();
               return false;
            }
         }
      },
      _initSuggestEvents: function() {
         this._windowChangeHandler = this._moveMenuOnResize.bind(this);
         this._onMouseWheelHandler = this._onMouseWheel.bind(this);

         if (this._options.definition) {
            this._setDefinitionValueHandler = this._setDefinitionValue.bind(this);
            this.getLinkedContext().subscribe('onFieldChange', this._setDefinitionValueHandler);
         }

         if(!this._options.linkedBrowser.length) {
            this.subscribe('onMenuOpen', function () {
               $ws._const.$win.bind('resize', this._windowChangeHandler);
               //DOMMouseScroll - FF плохо работает с mousewheel, поэтому используем DOMMouseScroll
               $('.ws-browser-container', this._browserContainer).bind('DOMMouseScroll mousewheel', this._onMouseWheelHandler);
               //перемещаем меню саггеста к полю ввода, но делаем это только если topParent - окно
               //потому что у окон position: fixed
               if($ws.helpers.instanceOfModule(this.getTopParent(), 'SBIS3.CORE.Window')) {
                  $ws._const.$win.bind('scroll', this._windowChangeHandler);
               }
            });

            this.subscribe('onMenuHide', function () {
               $ws._const.$win.unbind('resize', this._windowChangeHandler);
               $('.ws-browser-container', this._browserContainer).unbind('DOMMouseScroll mousewheel', this._onMouseWheelHandler);
               if($ws.helpers.instanceOfModule(this.getTopParent(), 'SBIS3.CORE.Window')) {
                  $ws._const.$win.unbind('scroll', this._windowChangeHandler);
               }
            });
         }
      },
      /**
       * Подписывается на события поля ввода
       * @param {Number} number Номер поля
       * @param {$ws.proto.FieldAbstract} source Поле, на которое подписываемся
       * @param {Boolean} drawClearButton Нужно ли рисовать кнопку очистки поля
       */
      _initSourceEvents: function(number, source, drawClearButton){
         var self = this,
            isFormat = ($ws.proto.FieldFormatAbstract && source instanceof $ws.proto.FieldFormatAbstract),
            input = this._findInput(source),
            owner = this._sourcesOwner[number];

         //проверяем поле ввода, поля связи на видимость после удаления записи
         if($ws.helpers.instanceOfModule(owner, 'SBIS3.CORE.FieldLink')) {
            owner.subscribe('onAfterDelete', function() {
               if(self._isCurrentSourceVisible()) {
                  self._focusIn(source);
               }
            });
            owner.subscribe('onLinkRemove', function() {
               if(self._options.historyMethod) {
                  if(!owner.getSelectedRecords().length) {
                     self._needShowHistory = true;
                  }
                  self._showMenu();
               }
            });
         }
         if ($ws.helpers.instanceOfModule(source, 'SBIS3.CORE.SearchString')) {
            source.setSuggest(this);
         }
         if (drawClearButton) {
            source.subscribe(isFormat ? 'onChangePure' : 'onValueChange', function(event, newValue){
               var
                  value = isFormat ? this.getStringValue() : newValue,
                  offset = input.position(),
                  parentWidth = input.parent().outerWidth(),
                  right = parentWidth - input.width() - offset.left,
                  top = offset.top + (input.height() - ICON_WIDTH)/2;
               if (!self._clearButtons[number]) {
                  self._clearButtons[number] = $('<div class="ws-suggest-clear" />').click(function(){
                     self._currentInputValue = source._curval;
                     source.setValue(null);
                     source.setActive(true);
                     self._clearButtons[number].hide();
                     self.show();
                     if(self._options.useKbLayoutRevert) {
                        self._revertedValues = {};
                     }
                  });
                  self._clearButtons[number].appendTo(input.parent());
                  input.addClass('ws-no-default-clear-button');
               }
               self._clearButtons[number]
                  .css({'top': top, 'right': right})
                  .toggle(self.isEnabled() && !!value);
            });
         }
         source.subscribe(isFormat ? 'onChangePure' : 'onChange', function(event, newValue){
            var value = isFormat ? this.getStringValue() : newValue,
               startProcessChanges = function() {
                  self._processChanges(self._findInput(this), !(self._options.linkedBrowser.length && value + '' === '' && !self._options.clearBrowser), false, value);
               };
            if(self._options.useKbLayoutRevert && (value === null || String.trim(value) === '')) {
               self._revertedValues = {};
            }
            if(self._options.enabled){
               if(self._options.delay) {
                  if(self._timer) {
                     clearTimeout(self._timer);
                  }
                  self._timer = setTimeout(startProcessChanges.bind(this), self._options.delay);
               } else {
                  startProcessChanges.call(this);
               }
            }
         });
         source.subscribe('onKeyPressed', function(event, e){
            //TODO временное решение. по уму автодополнение в момент своего разрушения должно отписываться не только от событий браузера, но и от событий полей ввода
            if(!self._isDestroyed) {
               self._initKeyboardMonitor(source, event, e);
            }
         });
         source.subscribe('onFocusIn', function(){
            if(self._isCurrentSourceVisible()) {
               self._focusIn(this);
            }
         });
         source.subscribe('onFocusOut', this._focusOut.bind(this));
         if(source.isActive()){
            this._focusIn(source);
         }
         // TODO переделать на другой механизм перемещение наверх панелек на окнах.
         var parent = source.findParent(function (parent) {
            return (parent && parent.moveToTop && !!$ws.helpers.find($ws._const.WINDOW_CLASSES, $ws.helpers.instanceOfModule.bind(undefined, parent)));
         });
         if (parent) {
            if($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.FieldEditAtPlace') && !self._options.linkedBrowser.length) {
               parent.subscribe('onCancel', function() {
                  self._hideMenu(0);
               });
            }
            parent.moveToTop = parent.moveToTop.callNext(function () {
               if (!this.isDestroyed() && this._isVisible && this._currentField === number) {
                  this._acquireZIndex();
               }
            }.bind(this));
         }
      },
      forceClearValue: function(){
         //Да, грязный хак, ставим значение, которое было при создании
         this._currentInputValue = undefined;
      },
      /**
       * Находит элемент, к которому нужно цеплять индикатор загрузки и кнопку очистки
       * @param {$ws.proto.FieldAbstract} field Поле, которое нужно обработать
       * @private
       */
      _findInput: function(field){
         var isFormat = $ws.proto.FieldFormatAbstract && field instanceof $ws.proto.FieldFormatAbstract,
            container = field.getContainer();
         return isFormat ? container.find('.input-field:first') : container.find('.ws-field input');
      },
      /**
       * @param {Number} numberOfBrowser Номер браузера, с которым ведём раборту на данный момент
       *
       * Создаёт рекордсет, находит/создаёт нужный браузер и т. д.
       */
      _init: function(numberOfBrowser){
         var self = this,
            columns = self._options.display.columns;
         // браузер, принимая пустой массив в display.columns, не рисует ни одной колонки.
         if (($ws.helpers.type(columns) === 'array') && (!columns.length)) {
            columns = '';
         }
         if (!self._options.linkedBrowser.length) {
            //если нет свзяного браузера, то создаём браузер
            return this._browserInit[0] = self._getRecordSet().addCallback(function (instance) {
               self._currentRecordSet = instance;

               var vertAlignment = self._options.maximumHeight === 'auto' ?  "Top" : "Stretch",
                   horzAlignment = self._options.browserAutoWidth ? "Left" : "Stretch",
                   browserConfig = {
                        parentSuggest: self,
                        verticalAlignment: vertAlignment,
                        horizontalAlignment: horzAlignment,
                        element: self._browserContainer,
                        //Прописываю без привязки к опциям Suggest, потому что если suggest disabled, то он даже не откроет браузер
                        allowChangeEnable: false,
                        enable: true,
                        isContainerInsideParent: self._isContainerInsideParent(),
                        parent: self.getParent(),
                        filterParams: self._options.filterParams,
                        autoWidth: self._options.browserAutoWidth,
                        autoHeight: self._options.maximumHeight === 'auto',
                        setCursorOnLoad: self._options.historyMethod ? false : self._options.selectOnLoad,
                        cssClassName: 'ws-browser-ignore-local-page-size',
                        display: {
                           columns: columns,
                           height: self._options.height,
                           width: self._options.width,
                           cutLongRows: self._options.display.cutLongRows,
                           showHead: self._options.showHead,
                           viewType: self._options.display.viewType,
                           hierColumn: self._options.display.hierColumn,
                           rowRender: self._options.display.rowRender,
                           partiallyLoad: self._options.display.partiallyLoad,
                           allowHorizontalScroll: !self._options.display.cutLongRows,
                           usePaging: self._options.display.usePaging,
                           recordsPerPage: self._options.rowsCount
                        },
                        handlers: {
                           'onRowActivated': self._onRowActivated.bind(self),
                           'onRowDoubleClick': self._onRowActivated.bind(self)
                        }
                     },
                     browserInstance = new SuggestTableView($ws.core.merge({
                      handlers: {
                         'onAfterRender': function(){
                            var searchResults = this,
                                count = 0,
                                visibleFlag,
                                row;
                            if (self._options.historyMethod && self._historyRecordSet) {
                               //уберем строки, которые уже есть в истории
                               self._historyRecordSet.each(function(record){
                                  row = searchResults.getContainer().find('[rowkey="' + record.getKey() + '"]');
                                  if(row.length){
                                     self._hiddenRowsHeight += row.get(0).clientHeight;
                                     row.addClass('ws-hidden');
                                     count++;
                                  }
                               });
                               visibleFlag = count === searchResults.getRecordSet().getRecordCount();
                               //скроем не только надпись но и браузер, если у нас все записи в истории
                               self._browserContainer.toggleClass('ws-hidden', visibleFlag);
                               if(!visibleFlag) {
                                  self._updateContainerSize();
                                  if(!self._historyRecordSet.getRecordCount()) {
                                     browserInstance.setActiveElement(self.getContainer().find('[rowkey]:first'));
                                  }
                               }
                            }
                         },
                         'onSetCursor': function(){
                            if(self._options.historyMethod && self._historyBrowser){
                               self._historyBrowser.setActiveElement(null);
                            }
                         }
                      }
                   }, browserConfig));

               if(self._options.historyMethod){
                  self._historyBlock = $('<div />', {
                     'class': 'ws-suggest-history-block'
                  }).prependTo(self._container);
                  //TODO отрефакторить
                  self._historyBrowserContainer = $('<div />', {
                     'class': 'ws-suggest-browser'
                  })
                  .appendTo(self._historyBlock)
                  .css ({
                     width: parseInt(self._options.browserWidth, 10) + 'px'
                  });
                  //вынести в отдельный метод
                  if(self._options.maximumHeight !== 'auto'){
                     self._historyBrowserContainer.height(self._options.maximumHeight + 'px');
                  }
                  else{
                     self._historyBrowserContainer.attr('VerticalAlignment', 'Top');
                  }
                  if(self._options.browserAutoWidth){
                     self._historyBrowserContainer.attr('HorizontalAlignment', 'Left');
                  }

                  self._historyBlock.append(self._historyBrowserContainer);
                  self._historyBrowser = new SuggestTableView($ws.core.merge(browserConfig,{
                     element: self._historyBrowserContainer,
                     //TODO учесть, что сначала выделение должно установиться на список истории
                     setCursorOnLoad: false,
                     handlers: {
                        'onSetCursor': function(){
                           browserInstance.setActiveElement(null);
                        },
                        'onAfterRender': function(){
                           //если ещё ничего не ввели и показалась история, то не будем выделять строку
                           if(self._options.selectOnLoad && self._currentInputValue && self._historyRecordSet.getRecordCount()){
                              self._historyBrowser.setActiveElement(self.getContainer().find('[rowkey]:first'));
                           }
                        }
                     }
                  }));
                  self._initHistoryRecordSet();
                  self._historyBrowser.setData(self._historyRecordSet);
               }

               self._currentBrowser[0] = browserInstance;
               self._initBrowser(0);
               self._currentBrowser[0].setData(self._currentRecordSet);
               return browserInstance;
            });
         }
         else {
            var deferred = new $ws.proto.Deferred().dependOn($ws.single.ControlStorage.waitWithParentName(self._options.linkedBrowser[numberOfBrowser]));
            if (!deferred) {
               throw new Error('Browser (id = "' + self._options.linkedBrowser[numberOfBrowser] + '") for $ws.proto.Suggest does not exist');
            }
            else {
               return this._browserInit[numberOfBrowser] = deferred.addCallback(function (instance) {
                  self._currentBrowser[numberOfBrowser] = instance;
                  self._currentBrowser[numberOfBrowser].recordSetReady().addCallback(self._onBrowserReady.bind(self, numberOfBrowser));
                  self._browserSubscribe('onRowActivated', self._onRowActivated, numberOfBrowser);
                  if (self._currentBrowser[numberOfBrowser].hasEvent('onConvert')) {
                     self._browserSubscribe('onConvert', self._onConvertReInit, numberOfBrowser);
                  }
                  self._initBrowser(numberOfBrowser);
                  return instance;
               });
            }
         }
      },
      /**
       * Подписывается у браузера на события, сохраняет обработчики, чтобы их потом проще было удалить
       * @param {String} event Название события
       * @param {Function} handler Обработчик
       * @param {Number} numberOfBrowser Номер браузера
       * @private
       */
      _browserSubscribe: function(event, handler, numberOfBrowser) {
         var self = this,
            bindedFunction = function() {
               Array.prototype.push.apply(arguments, [this]);
               handler.apply(self, arguments);
            };
         this._browserHandlers.push({
            eventName: event,
            handler: bindedFunction
         });
         this._currentBrowser[numberOfBrowser].subscribe(event, bindedFunction);
      },
      /**
       * Отписывает браузер от всего
       * @private
       */
      _browserUnsubscribe: function(numberOfBrowser) {
         var i,
            len,
            handlerInfo;
         for (i = 0, len = this._browserHandlers.length; i < len; ++i) {
            handlerInfo = this._browserHandlers[i];
            if (this._currentBrowser[numberOfBrowser].hasEvent(handlerInfo.eventName)) {
               this._currentBrowser[numberOfBrowser].unsubscribe(handlerInfo.eventName, handlerInfo.handler);
            }
         }
      },
      /**
       * Создаёт рекордсет по обработчику, который передали в конфиг
       * @param {Object} [filter] Фильтр
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _getRecordSetFromHandler: function(filter){
         var recordSet = this._options.dataSource(filter),
            result = new $ws.proto.Deferred();
         if(recordSet instanceof $ws.proto.Deferred || recordSet instanceof $ws.proto.RecordSet){
            if(recordSet instanceof $ws.proto.Deferred){
               return recordSet.addCallback(function(res){
                  if(!(res instanceof $ws.proto.RecordSet))
                     throw new Error("Необходимо отдать корректный набор данных!");
                  return res;
               });
            } else
               result.callback(recordSet);
            return result;
         } else
            throw new Error("Необходимо отдать корректный набор данных!");
      },
      /**
       * Отдаёт готовый рекордсет по нужным данным
       * @param {Object} [filter] Фильтр
       * @param {Object} [config] Опции
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _getRecordSet: function(filter, config){
         if(typeof(this._options.dataSource) === 'function'){
            return this._getRecordSetFromHandler(filter);
         }
         return this._createRecordSet(config);
      },
      _createRecordSet: function(config){
         var toMerge = config || {
               context: this._context,
               firstRequest: false,
               usePages: this._options.display.usePaging,
               rowsPerPage: this._options.rowsCount
            },
            dataSource = $ws.core.merge({}, this._options.dataSource);
         return $ws.core.attachInstance('Source:RecordSet', $ws.core.merge(dataSource, toMerge));
      },
      /**
       * Подписывание на события
       */
      _onBrowserReady: function(numberOfBrowser){
         this._currentRecordSet = this._currentBrowser[numberOfBrowser].getRecordSet();
         if (!this._options.linkedBrowser.length) {
            this._browserSubscribe('onFocusIn', this._moveFocus, numberOfBrowser);
         }
      },
      /**
       * При заход в папку очищаем фильтрацию
       * @param {$ws.proto.EventObject} event Событие
       * @param {String} key Открываемая папка
       * @param {$ws.proto.DataView|$ws.proto.DataViewAbstract} browser Браузер, на котором произошло событие
       * @private
       */
      _onFolderChange: function(event, key, browser){
         var filter,
             recordset = browser.getRecordSet();
         if(this._options.clearOnOpen){
            $ws.helpers.forEach(this._sources, function(source, index){
               source.setValue('');
               this.forceClearValue();
               if(this._clearButtons[index]){
                  this._clearButtons[index].hide();
               }
            }.bind(this));
            filter = this._getFilter();
            clearTimeout(this._timer);
            if(this._filter && !this._isFilterEqual(filter)){
               this._filter = $ws.core.merge({}, filter);
               if(this._options.useBrowserFilter){
                  filter = $ws.core.merge(filter, browser.getQuery(), { preferSource: true } );
               }
               filter['Разворот'] = 'Без разворота';
               filter[browser.getRecordSet().getHierarchyField()] = key;
               browser.setTextHighlight('');
               recordset.setPage(0, true);
               filter = this._prepareFilter(filter);
               browser.setQuery(filter, false);
               this.hide();
               event.setResult(false);

            }
         } else {
            filter = this._getFilter();
            filter = $ws.core.merge(filter, browser.getQuery(), { preferSource: true } );
            filter[recordset.getHierarchyField()] = key;
            event.setResult(filter);
         }
      },
      _prepareFilter: function(filter){
         //Если у нас есть история, то отдадим в фильтр значение ее параметра, чтобы можно было метод истории написать универсально
         if(this._options.historyMethod){
            filter['_ИмяПараметраДляИсторииВыбора'] = this._ownerName;
         }
         return filter;
      },
      /**
       * Обработчик смены фильтра в иерархическом браузере
       * @param {$ws.proto.EventObject} event Событие
       * @param {Object} filter Новый фильтр
       * @param {$ws.proto.DataView|$ws.proto.DataViewAbstract} browser Браузер, на котором произошло событие
       * @private
       */
      _onFilterChange: function(event, filter, browser){
         var values = this._getFilter(),
            recordSet = browser.getRecordSet();
         if(recordSet){
            if(filter[recordSet.getHierarchyField()] === browser.getRootNode() && this._options.expandTree){
               for(var i in values){
                  if(values.hasOwnProperty(i)){
                     if(values[i]){
                        browser.applyTurn('mixed', true);
                        filter['Разворот'] = 'С разворотом';
                        return;
                     }
                  }
               }
            }
         }
      },
      /**
       * @param {Number} numberOfBrowser Номер браузера, с которым ведём раборту на данный момент
       *
       * Делает первый запрос у рекордсета, когда браузер готов. Или не делает.
       */
      _initBrowser: function(numberOfBrowser){
         var browser = this._currentBrowser[numberOfBrowser];
         if (this._options.expandTree && browser.isTree()) {
            browser.setLoadChildFlag(true);
         }
         if (this._filter) {
            this._filter = this._prepareFilter(this._filter);
            browser.setQuery(this._filter);
            this._filter = undefined;
         }
         if (!this._options.linkedBrowser.length) {
            this._browserSubscribe('onLoadError', function (event) {
               event.setResult(true);
            }, numberOfBrowser);
         }
         this._browserSubscribe('onBeforeLoad', this._onDataLoadStarted, numberOfBrowser);
         this._browserSubscribe('onAfterLoad', this._onDataLoaded, numberOfBrowser);
         this._browserSubscribe('onBeforeRender', this._onBeforeRender, numberOfBrowser);
         this._browserSubscribe('onAfterRender', this._onAfterRender, numberOfBrowser);
         browser.getContainer().find('.ws-browser-container').bind('focus', function () {
            this._stopHideTimer();
         }.bind(this));
         if (this._hasFocus && this._options.autoShow) {
            this._processChanges(this._findInput(this._sources[0]), true);
         }
         if (browser.isHierarchy()) {
            this._browserSubscribe('onFolderEnter', this._onFolderChange, numberOfBrowser);
            this._browserSubscribe('onFilterChange', this._onFilterChange, numberOfBrowser);
         }
         this._notify('onReady');
      },
      _onAfterRender: function(event, browser) {
         if (this._needShowBrowser()) {
            browser._onResizeHandler();
         }
        this._showMenu();
      },
      /**
       * Пересчитывает размер контейнера в случае автоширины браузера
       */
      _updateContainerSize: function(){
         var scroll = false,
             browserContainer = this._browserContainer.find('.ws-browser-container');

         this._browserContainer.find('.ws-browser-scrollbar').height('100%');
         if(this._options.historyMethod){
            this._historyBrowserContainer.find('.ws-browser-scrollbar').height('100%');
         }
         if(this._options.maximumHeight !== 'auto'){
            var height = browserContainer.find('.ws-browser').outerHeight() + 1; //border-bottom
            if(height > this._options.maximumHeight){
               height = this._options.maximumHeight;
               scroll = true;
            }
            browserContainer.height(height);
            if(this._options.historyMethod){
               this._historyBrowserContainer.find('.ws-browser-container').height(height);
               this._historyBrowserContainer.height('auto');
            }
            this._browserContainer.height('auto');
            this._container.height('auto');
         }
         else{
            //Костыль! Проверить в dataViewAbstract метод setHeight, скорее всего хаки там уже не нужны
            if(this._options.historyMethod) {
               this._historyBrowserContainer.find('.ws-browser-container').height('auto');
            }
            if($ws._const.browser.isIE9){ //ie 9 hack
               this._container.find('*').each(function(){$(this).height();});
            }
         }
         if(this._options.browserAutoWidth){
            var width = this._currentBrowser[0].getContainer().find('.ws-browser').width();
            if(scroll){
               width += $ws.helpers.getScrollWidth();
            }
            this._container.width(width);
         }
         if(this._hiddenRowsHeight > 0 && this._isVisible) {
            browserContainer.height(browserContainer.height() - this._hiddenRowsHeight);
         } else if(this._hiddenRowsHeight === 0 && this._options.maximumHeight === 'auto') {
            browserContainer.height('auto');
         }
      },
      /**
       * Устанавливает фокус на первое поле ввода, снимает с браузера
       */
      _moveFocus: function(event){
         if (this._currentBrowser[0] && this._isVisible) {
            var moveFocusToField = this._sources[0] && this._sources[0].setActive;
            this._currentBrowser[0].setActive(false, false, false, moveFocusToField ? this._sources[0] : this);
            if (moveFocusToField) {
               this._sources[0].setActive(true);
            }
         }
      },
      /**
       * Обработчик прихода фокуса в поля ввода
       * @param {$ws.proto.Control} field В какой контрол перешёл фокус
       */
      _focusIn: function(field){
         var self = this;
         $ws.helpers.callbackWrapper(!this._browserInit.length &&  this._init(0), function(instance){
            if(!self._hasFocus){
               self._hasFocus = true;
               self._stopHideTimer();
               if(field.isEnabled()){
                  if(self._options.autoShow){
                     self._processChanges(self._findInput(self._sources[0]), true);
                  } else if(self._options.historyMethod){
                     //в случае использования истории мы должны показать ее и только ее в момент, когда на поле пришел фокус
                     //если же разработчик сам настроил автопоиск сразу, то все случится естественным образом
                     //при этом не показываем результаты последнего поиска
                     self._currentBrowser[0].clear();
                     self._hasMoreLabel.addClass('ws-hidden');
                     var filter = self._getFilter(false);
                     filter = $ws.core.merge(self._options.filterParams, filter);
                     filter = self._prepareFilter(filter);
                     self._historyRecordSet.setQuery(filter);
                  }
               }
            }
            for(var i = 0; i < self._sources.length; ++i){
               if(self._sources[i] === field){
                  self._currentField = i;
                  if(self._isVisible && field.isEnabled()){
                     self._moveMenuToField(self._sources[i].getContainer());
                  }
                  return instance;
               }
            }
            self._currentField = 0;
            return instance;
         });
      },
      /**
       * При уходе фокуса с полей ввода
       */
      _focusOut: function(event, focusFlag, target) {
         var
            findSuggest = function(object) {
               var
                  opener = object.getOpener && object.getOpener(),
                  topParent = object.getTopParent(),
                  suggest,
                  parent;
               if (opener) {
                  suggest = opener.getParentSuggest && opener.getParentSuggest() || opener;
                  return suggest instanceof $ws.proto.Suggest ? suggest : findSuggest(opener);
               } else {
                  parent = object.getParent && object.getParent();
                  if (!parent) {
                     //если нет парента, пробуем поискать через топ парент
                     opener = topParent.getOpener ? topParent.getOpener() :  null;
                     return opener ? findSuggest(opener) : false;
                  } else {
                     return parent ? findSuggest(parent) : false;
                  }
               }
            },
            self = this;

         this._hasFocus = false;
         if (target && findSuggest(target) !== this) {
            if (!this._options.linkedBrowser.length) {
               //Не выбираем запись в саггесте, если фокус ушёл на поле
               //Которое является фильтром для этого же саггеста
               if(this._sources.length && this._onTabClickLastActiveRecord) {
                  var isSuggestSource;
                  for (var i = 0, len = this._sources.length; i < len; i++) {
                     if (this._sources[i] === target) {
                        isSuggestSource = true;
                        break;
                     }
                  }
                  if(!isSuggestSource && this._isVisible) {
                     this._selectRecord(this._onTabClickLastActiveRecord, this._activeBrowser);
                     this._onTabClickLastActiveRecord = undefined;
                  }
               }
               this._needShowHistory = !$ws.helpers.instanceOfModule(target, 'SBIS3.CORE.Suggest');
               this._stopHideTimer();
               if($ws.helpers.instanceOfModule(target, 'SBIS3.CORE.CloseButton')) {
                  self._hideMenu(0);
               } else {
                  this._hideTimer = setTimeout(function () {
                     self._hideMenu(0);
                  }, HIDE_TIMEOUT);
               }
            }
         }
      },
      /**
       * Останавливает таймер скрытия окна
       */
      _stopHideTimer: function(){
         if(this._hideTimer){
            clearTimeout(this._hideTimer);
         }
      },
      /**
       * Извещает о показе/скрытии меню. Делает это через родителя, иначе событие не дойдёт
       * @param {Boolean} showed Показано ли меню
       * @private
       */
      _notifySubWindow: function(showed){
         var parent = this.getParent();
         if(parent){
            parent.getContainer().trigger('wsSubWindow' + (showed ? 'Open' : 'Close'));
         }
      },
      /**
       * @param {Number} numberOfBrowser Номер браузера
       * Скрывает меню
       */
      _hideMenu: function(numberOfBrowser){
         if (this._isVisible) {
            $ws.single.WindowManager.releaseZIndex(this._zIndex);
            this._zIndex = null;
            if(this._historyBrowser) {
               this._historyBrowser.setActiveElement(null);
            }
            this._container.addClass('ws-hidden');
            this._isVisible = false;
            this._hiddenRowsHeight = 0;
            this.abort(numberOfBrowser || 0);
            this._notify('onMenuHide');
            this._notifySubWindow(false);
         }
      },
      _onRowActivated: function(eventState, activeRow, currentRecord, browser){
         //обрабатываем результат выбора только если запись к нам пришла честная, так как если почему-то в наборе уже нет этой записи, то мы получим undefined
         //такое может быть если по какой-то причине таблица начала сразу же перезагружаться еще раз
         if(currentRecord instanceof $ws.proto.Record){
            //для истории актуально только то, что выбрал пользователь
            if(this._options.historyMethod){
               this.addRecordToHistory(currentRecord);
            }
            this.processSuggest(currentRecord);
         }
         eventState.setResult(!!browser);
      },
      /**
       * Добавляет запись в историю
       * @param {$ws.proto.Record} record
       */
      addRecordToHistory: function(record) {
         if(this._options.historyMethod && this._options.historyKeyField) {
            var keyField = this._options.historyKeyField,
               key = keyField && record.hasColumn(keyField) ? record.get(keyField) : record.getKey();
            $ws.single.UserConfig.setParamValue(this._ownerName, key + '');
         }
      },
      /**
       * Устанавливает связанный браузер
       * @param {$ws.proto.DataView|$ws.proto.DataViewAbstract} browser Новый браузер/браузеры
       */
      setBrowser: function(browser) {
         var filter = this._filter,
            curBrowser = Array.isArray(browser) ? browser : [browser];

         for (var i = 0, browserLen = this._options.linkedBrowser.length; i < browserLen; i++) {
            this._browserUnsubscribe(i);
         }
         for(i = 0, browserLen = curBrowser.length; i < browserLen; i++) {
            this._options.linkedBrowser[i] = curBrowser[i].getId();
            this._currentBrowser[i] = curBrowser[i];
            this._currentBrowser[i].recordSetReady().addCallback(this._onBrowserReady.bind(this, i));
            this._browserSubscribe('onRowActivated', this._onRowActivated, i);
            this._filter = undefined;
            this._initBrowser(i);
            if (filter) {
               this.show();
            }
         }
      },
      /**
       * Возвращает текущий связанный браузер
       */
      getBrowser: function() {
         return this._currentBrowser.length === 1 ? this._currentBrowser[0] : this._currentBrowser;
      },
      setUseDefinition: function(useDefinition){
         this._useDefinition = this._options.definition ? useDefinition : false;
         if (this._useDefinition) {
            this._findInput(this._sources[0]).val(this.getLinkedContext().getValue(this._options.definition));
         }
      },
      /**
       * Установить поле контекста для описания записи. Используется в $ws.proto.FieldLink
       * @param {String} definition
       */
      setDefinition: function(definition){
         this._options.definition = definition;
         //Если не были подпсианы раньше, подпишемся на изменение поля в контексте
         if (!this._setDefinitionValueHandler) {
            this._setDefinitionValueHandler = this._setDefinitionValue.bind(this);
            this.getLinkedContext().subscribe('onFieldChange', this._setDefinitionValueHandler);
         }
      },
      /**
       * Получить поле контекста для описания записи. Используется в $ws.proto.FieldLink
       * @param {String} definition
       */
      getDefinition: function(){
         return this._options.definition;
      },
      _setDefinitionValue: function(event, field, value){
         if (this._useDefinition && field === this._options.definition) {
            this._processChanges(this._findInput(this._sources[0]), undefined, undefined,value);
         }
      },
      /**
       * Обработчик "конвертации" браузера
       * @param {$ws.proto.EventObject} event Событие
       * @param {$ws.proto.HierarchyViewAbstract} newInstance Новый контрол
       * @private
       */
      _onConvertReInit: function(event, newInstance){
         this.setBrowser(newInstance);
      },
      /**
       * Перегруженный метод обработки клавишь.
       * Клавиши обрабатываются не нажатые на своем контейнере, А нажатые на контейнере источника.
       */
      _initKeyboardMonitor: function(source, eventState, e){
         if(e && e.which in this._keysWeHandle && (this._isVisible === true || this._notify('onKeyPressed', e) !== false)){
            this._keyboardHover(source, eventState, e);
         }
      },
      /**
       * Обрабатывает нажатия кнопок клавиатуры
       * @param {$ws.proto.Control} source источник события
       * @param {Object} eventState Событие ws
       * @param {Object} e Объект события
       */
      _keyboardHover : function(source, eventState, e){
         var self = this,
         //либо у нас есть связанные браузеры, либо 1 собственный
             browserLen = self._options.linkedBrowser.length || 1;
         for (var i = 0; i < browserLen; i++) {
            this._activeBrowser = this._currentBrowser[i];

            var activeRow = this._activeBrowser.getActiveRow(),
                multiline = source.getContainer().find('textarea').length > 0 && !this._isVisible;

            //Если у нас есть история выбора, а в обычном браузере активной записи не оказалось, то поищем в историии
            if((!activeRow || !activeRow.hasClass('ws-browser-row-selected')) && this._historyBrowser) {
               activeRow = this._historyBrowser.getActiveRow();
               if(activeRow.length) {
                  this._activeBrowser = this._historyBrowser;
               }
            }
            if (!this._options.enabled || e.altKey || e.shiftKey || e.ctrlKey && e.which !== $ws._const.key.space || !source.isEnabled()) {
               return false;
            }
            if (!multiline && (e.which === $ws._const.key.down || e.which === $ws._const.key.up)) {
               var next,
                  prev,
                  cur;

               if(e.which === $ws._const.key.down) {
                  if (this._activeBrowser === this._currentBrowser[i]) {
                     next = activeRow.length ? activeRow.next() : this._browserContainer.find('tr').eq(0);
                  } else {
                     //Если есть браузер истории, то при нажатии на стрелку вниз
                     //Надо так же проверить, может стоит уйти на браузер найденных записей
                     next = activeRow.length ? activeRow.next() : this._historyBrowserContainer.find('tr').eq(0);
                     if (!next.length && this._browserContainer.find('tr').length) {
                        next = this._browserContainer.find('tr').eq(0);
                        this._historyBrowser.setActiveElement(null);
                        this._activeBrowser = this._currentBrowser[i];
                     }
                  }
               } else if (this._historyBrowser && this._activeBrowser === this._historyBrowser) {
                  prev = activeRow.length ? activeRow.prev() : this._historyBrowserContainer.find('tr').filter(':last');
               } else {
                  prev = activeRow.length ? activeRow.prev() : self._browserContainer.find('tr').filter(':last');
                  //Если вдруг предыдущей записи не нашли, и у нас есть история, пробуем поискать там
                  if(!prev.length && this._historyBrowserContainer && this._historyBrowserContainer.find('tr').length) {
                     prev = this._historyBrowserContainer.find('tr').filter(':last');
                     this._currentBrowser[i].setActiveElement(null);
                     this._activeBrowser = this._historyBrowser;
                  }
               }
               cur = e.which === $ws._const.key.down ? next : prev;
               if (cur !== null && (self._options.selectOnLoad && cur.length || !self._options.selectOnLoad)) {
                  if(activeRow) {
                     activeRow.removeClass('ws-browser-row-selected');
                  }
                  this._activeBrowser.setActiveElement(cur.length ? cur : undefined);
                  if (this._options.linkedBrowser[i]) {
                     this._currentBrowser[i].setActive(true);
                  }
                  e.stopPropagation();
                  e.preventDefault();
                  return false;
               }
            }
            else if ((e.which === $ws._const.key.enter && this._activeBrowser.getRecordSet().getRecordCount() && !multiline) ||
               (e.which === $ws._const.key.space && e.ctrlKey)) {
               if (!self._isVisible) {
                  self.show();
               }
               else if (e.which === $ws._const.key.enter && !multiline) {
                  self._selectRecord(activeRow, this._activeBrowser);
               }
               e.stopPropagation();
               e.preventDefault();
            }
            else if (e.which === $ws._const.key.enter && !multiline) {
               self.show();
               e.stopPropagation();
               e.preventDefault();
            }
            else if (e.which === $ws._const.key.esc && self._isVisible) {
               e.stopImmediatePropagation();
               self.hide();
            }
            else if ((e.which === $ws._const.key.left || e.which === $ws._const.key.right) && this._currentBrowser[i].isTree()) {
               var rowkey = activeRow.attr('rowkey'),
                  isLeft = (e.which === $ws._const.key.left);
               if (isLeft === this._currentBrowser[i].isTreeFolderExpanded(rowkey) &&
                  this._currentBrowser[i].isRecordFolder(rowkey)) {
                  this._currentBrowser[i][isLeft ? 'hideBranch' : 'showBranch'](rowkey);
                  eventState.setResult(false);
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
               }
               eventState.setResult(true);
               return true;
            }
            else if (e.which === $ws._const.key.tab && this._isVisible && this._loaded) {
               this._onTabClickLastActiveRecord = activeRow;
               this._hideMenu();
            }
            return false;
         }
      },
      /**
       * Обработка выбора записи в браузере
       * @param activeRow
       * @param browser Браузер, в котором обрабатываем выбор записи
       * @private
       */
      _selectRecord: function(activeRow, browser) {
            if (activeRow && activeRow.length) {
               this.processSuggest(browser.getActiveRecord(activeRow));
               this._hideMenu(0);
            }
      },
      /**
       * <wiTag group="Управление">
       * Обрабатывает выбор записи.
       * @param {$ws.proto.Record} record Выбранная запись.
       * @example
       * <pre>
       *    suggest.subscribe('onSuggest', function(event, record){
       *       event.setResult(false);
       *       $ws.helpers.newRecordSet('Лицо', 'Список', {}, undefined, false).addCallback(function(recordSet){
       *          recordSet.readRecord(record.get("Сотрудник.@Лицо")).addCallback(function(record){
       *             suggest.processResult(record);
       *             suggest.hide();
       *          });
       *       });
       *    });
       * </pre>
       */
      processSuggest:function(record){
         var self = this,
            values = {},
            value,
            i, len;
         if (record instanceof $ws.proto.Record) {
            for (i = 0, len = self._options.processField.length; i < len; ++i) {
               value = record.get(self._options.processField[i]);
               values[self._options.processField[i]] = value;
            }
         }
         var res = self._notify('onSuggest', record, values);
         if (res === undefined) {
            for (i = 0, len = self._options.processField.length; i < len; ++i) {
               if (self._results && self._results[i]) {
                  self._results[i].setValue(values[self._options.processField[i]], true);
               }
            }
         }
         if (res !== false && !self._options.linkedBrowser.length) {
            self._sources[self._currentField].setActive(true);
            self._hideMenu(0);
         }
      },
      /**
       * Оповещает о начале загрузки рекордсета
       */
      _onDataLoadStarted:function(){
         this._notify('onDataLoadStarted');
      },
      /**
       * <wiTag group="Данные">
       * Получить текущий рекордсет автодополнения.
       * @returns {$ws.proto.RecordSet} Возвращает текущий набор данных автодополнения.
       * @example
       * <pre>
       *    suggest.getRecordSet().subscribe('onAfterLoad', function(event, isSuccess, error){
       *       // при ошибке загрузки данных в автодополнение выведем ошибку
       *       if(!isSuccess && error instanceof HTTPError && error.httpError !== 0)
       *          $ws.core.alert(error.message);
       *    });
       * </pre>
       */
      getRecordSet: function(numberOfBrowser){
         return this._currentBrowser[numberOfBrowser || 0].getRecordSet();
      },
      /**
       * Получить поле, у которого появилось автодополнение
       */
      getOpener: function () {
         return this._sources[this._currentField];
      },
      _acquireZIndex: function () {
         if (this._zIndex) {
            $ws.single.WindowManager.releaseZIndex(this._zIndex);
         }
         this._zIndex = $ws.single.WindowManager.acquireZIndex();
         this._container.css('z-index', this._zIndex);
      },
      /**
       *
       * Показывает меню
       */
      _showMenu: function(){
         if(this._needShowBrowser() && !this._isVisible && this._isCurrentSourceVisible()) {
            this._acquireZIndex();
            this._container.removeClass('ws-hidden');
            // у currentBrowser индекс 0, потому что высплывашки всего один браузер
            this._currentBrowser[0]._onResizeHandler();
            if(this._historyBrowser) {
               this._historyBrowser._onResizeHandler();
            }
            this._updateContainerSize();

            this._moveMenuToField(this._sources[this._currentField].getContainer());
            this._notify('onMenuOpen');
            this._isVisible = true;
            this._notifySubWindow(true);
         }
      },
      /**
       * Перемещает меню к полю
       * @param {jQuery} fieldContainer Поле, к которому нужно переместить меню
       * @private
       */
      _moveMenuToField: function(fieldContainer){
         //Проверяем, может ли меню развернуться вверх в случае надобности и не обрезаться
         var inputPosition = fieldContainer.offset().top,
            doFlip = this._container.height() < inputPosition;
         this._container.position({
            of: fieldContainer,
            my: 'left top',
            at: 'left bottom',
            collision: doFlip ? 'flip flip' : 'flip none'
         });
      },
      _needShowBrowser: function() {
         var result = !this._options.linkedBrowser.length;
         if (result) {
            var recordset = this._currentBrowser && this._currentBrowser[0].getRecordSet();
            result = !!(recordset && recordset.getRecordCount());
            if(!result && this._options.historyMethod){
               result = this._historyRecordSet && this._historyRecordSet.getRecordCount() && this._needShowHistory;
            }
         }
         return result;
      },

      _onBeforeRender: function(browser) {
         if(this._hasFocus){
            this._container.stop(true, true);
         }
         return true;
      },

      /**
       * Пытается найти в источниках данные, которые введены в ошибочной раскладке
       * меняет фильтр если найдет такие
       *
       * @returns {number} количество изменений в фильтре
       */
      _tryRevertKbLayout : function() {

         if(!this._options.useKbLayoutRevert) {
            return;
         }

         var self = this,
             changes = 0,
             sourceValue,
             sourceValueReverted,
             hasReverted,
             revertedFilter = {};

         $ws.helpers.forEach(this._sources, function(source, key) {
            sourceValue = source.getStringValue();
            hasReverted = self._revertedValues.hasOwnProperty(key);

            if(hasReverted) {
               var symbolsDifference = $ws.helpers.searchSymbolsDifference(sourceValue, self._revertedValues[key]);
               sourceValue = sourceValue.replace(symbolsDifference[0], '');
            }

            if(sourceValue !== null && String.trim(sourceValue) !== ''){
               sourceValueReverted = $ws.single.KbLayoutRevert.process(sourceValue);
               if(sourceValueReverted !== sourceValue) {
                  ++changes;
                  sourceValue = hasReverted ? symbolsDifference[0] + sourceValueReverted : sourceValueReverted;
                  self._revertedValues[key] = sourceValue;
                  revertedFilter[self._options.filter[key]] = sourceValue;
               }
            }
         });

         if(changes) {
            this._kbReverted = true;
            this._setVisibility(true);
            this._processChanges(self._findInput(this._sources[0]), false, revertedFilter);
         }

         return changes;
      },

      /**
       * Обрабатывает загрузку рекордсета - показывает/скрывает браузер, и т. д.
       */
      _onDataLoaded: function(event, browser){
         this._loaded = true;
         if (this._hasFocus && browser) {
            var recordset = browser.getRecordSet(),
               recordsCount = recordset.getRecordCount(),
               allRecords = recordset.hasNextPage(),
               self = this,
               hasAnotherRecords,
               text,
               filter = browser.getQuery();

            // поиск вернул 0 записей, пытаемся сменить ракладку и поискать снова
            if(!this._kbReverted &&  !recordsCount && this._tryRevertKbLayout()) {
               return;
            } else if (this._kbReverted && this._options.useKbLayoutRevert) {
               this._kbReverted = false;
               var source,
                  sourceOwner;
               if (!Object.isEmpty(self._revertedValues)) {
                  if (recordsCount) {
                     $ws.helpers.forEach(self._revertedValues, function (value, key) {
                        source = self._sources[key];
                        sourceOwner = source.getOwner();
                        //У поля связи в строках переопределен _notFormatedVal - он нормально значение переставить не может
                        if ($ws.helpers.instanceOfModule(sourceOwner, 'SBIS3.CORE.FieldLink')) {
                           sourceOwner.resetSuggestInputValue(value);
                        } else {
                           source.setValue(value);
                        }
                     });
                  }
               }
            }

            this._notify('onDataLoaded');

            if (!this._options.linkedBrowser.length) {
               if (this._options.maximumHeight !== 'auto')
                  this._container.height(this._options.maximumHeight);
               this._browserContainer.height(this._options.maximumHeight);
               if(this._options.historyMethod){
                  this._historyBrowserContainer.height(this._options.maximumHeight);
               }
               if(this._addMoreButton) {
                  if(this._options.maximumHeight !== 'auto') {
                     this._container.height(this._options.maximumHeight+26);
                  }
                  this._addMoreButton.empty();
                  this._addMoreButton.append($('<div class="ws-suggest-addMore"></div>'));
                  new Button({
                     element: this._addMoreButton.find('.ws-suggest-addMore'),
                     name: 'addButton',
                     image: 'sprite:icon-24 icon-AddButton icon-primary',
                     renderStyle: 'asLink',
                     toolTip: 'Добавить',
                     caption: 'Добавить',
                     displayCaptionForAddButton: true,
                     handlers: {
                        'onActivated' : this._options.addMoreButtonHandler
                     }
                  });
                  this._addMoreButton.removeClass('ws-hidden');
               }
            }
            if (this._options.display.usePaging === 'full') {
               hasAnotherRecords = (recordsCount < allRecords);
            }
            else {
               hasAnotherRecords = !!allRecords;
            }
            if (hasAnotherRecords) {
               if (!self._options.linkedBrowser.length) {
                  this._hasMoreLabel.empty();
                  if (self._options.maximumHeight !== 'auto')
                     this._container.height(self._options.maximumHeight + 24);
                  if (this._options.display.usePaging === 'full') {
                     text = 'Всего найдено ' + allRecords + ' запис' + $ws.helpers.wordCaseByNumber(allRecords, 'ей', 'ь', 'и') + '. ';
                  }
                  else {
                     text = '';
                  }
                  this._hasMoreLabel
                     .append(text)
                     .append(
                     $('<span class="ws-suggest-hasmore-link">Показать все.</span>')
                        .bind('click', this._showAllClick.bind(this, filter)))
                     .removeClass('ws-hidden');
               }
            }
            else if (!self._options.linkedBrowser.length) {
               this._hasMoreLabel.addClass('ws-hidden');
               if (self._options.maximumHeight !== 'auto') {
                  this._container.height(self._options.maximumHeight);
               }
            }
         }
         if (this._loading) {
            this._loading.addClass('ws-hidden');
         }
      },
      /**
       * Обработчик выбора записей в DialogSelector'е
       * @param {$ws.proto.EventObject} event Событие
       * @param {Array} selectedRecords Массив с записями
       * @protected
       */
      _onDialogChange: function(event, selectedRecords) {
         if (selectedRecords.length && selectedRecords[0]) {
            this.processSuggest(selectedRecords[0]);
         }
      },
      /**
       * Обработчик на кнопку "показать всё".
       * @param {Object} filter Текущий фильтр автодополнения
       * @returns {Boolean} Обработку события не нужно продолжать
       * @private
       */
      _showAllClick: function(filter) {
         var self = this,
            attachOptions,
            isDialog = this._options.selectRecordsMode === 'newDialog',
            typeOfSelector = isDialog ? DialogSelector : FloatAreaSelector;

         this.hide();
         attachOptions = {
            opener: this,
            template: this._options.showAllTemplate || SHOW_ALL_TEMPLATE,
            multiSelect: false,
            handlers: {
               onChange: function() {
                  self._onDialogChange.apply(self, arguments);
                  this.close();
               },
               onInit: function() {
                  if(!self._options.useUserBrowser){
                     this.getReadyDeferred().addCallback(function() {
                        var browser = this.getBrowser();
                        if (browser) {
                           //если нам почему-то веселые разработчики отдали старый браузер, но не сделаем для него ничего
                           if(self._options.display.usePaging !== 'full' && $ws.helpers.instanceOfModule(browser, 'SBIS3.CORE.DataViewAbstract')){
                              browser.setUsePaging(self._options.display.usePaging);
                           }
                           self._setupShowAllBrowser(browser, filter);
                        }
                     }.bind(this));
                  }
                  self._acquireZIndex();
               }
            }
         };
         if (!isDialog) {
            attachOptions.isStack = true;
            attachOptions.autoCloseOnHide = true;
         }
         new typeOfSelector(attachOptions);
         return false;
      },
      /**
       * Настраивает браузер на диалоге "показать всё"
       * @param {$ws.proto.Browser} browser Браузер, который мы будем обрабатывать
       * @param {Object} filter Фильтр браузера
       */
      _setupShowAllBrowser: function(browser, filter){
         var toMerge = {
            firstRequest: true,
            filterParams: filter,
            usePages: this._options.display.usePaging,
            rowsPerPage: SHOW_ALL_ROWS_PER_PAGE,
            context: this.getLinkedContext()
         };
         this._getRecordSet(filter, toMerge).addCallback(function(recordSet){
            browser.setColumns(this._currentBrowser[0].getColumns());
            if(this._options.display.rowRender){
               browser.setRowRender(this._options.display.rowRender);
            }
            browser.setData(recordSet);
         }.bind(this));
      },
      /**
       * <wiTag group="Данные">
       * Установить тип постраничной навигации для метода БЛ: полная или частичная
       * По умолчанию используется режим полной навигации.
       * @param {String} usePaging тип постраничной навигации:
       * <ul>
       *    <li>'full' - режим полной постраничной навигации</li>
       *    <li>'parts' - режим частичной постраничной навигации</li>
       * <ul>
       */
      setUsePaging: function(usePaging){
         this._options.display.usePaging = usePaging || 'full';
      },
      /**
       * <wiTag group="Данные">
       * Установить тип постраничной навигации для метода БЛ: полная или частичная
       * По умолчанию используется режим полной навигации.
       * @returns {String} usePaging тип постраничной навигации:
       * <ul>
       *    <li>'full' - режим полной постраничной навигации</li>
       *    <li>'parts' - режим частичной постраничной навигации</li>
       * <ul>
       */
      getUsePaging: function(){
         return this._options.display.usePaging;
      },
      /**
       * Возвращает, если ли фокус у саггеста
       * @returns {boolean|*}
       */
      isFocused: function() {
         return this._hasFocus;
      },
      /**
       * Просчитывает фильтр для запроса
       * @param {Number|Boolean} [validateLength] Нужно ли проверять длину
       * @returns {Object}
       */
      _getFilter: function(validateLength){
         var filter = {};
         for(var i = 0, len = this._options.filter.length; i < len; ++i){
            var isFormat = $ws.proto.FieldFormatAbstract && this._sources[i] instanceof $ws.proto.FieldFormatAbstract,
               value = isFormat ? this._sources[i].getStringValue() : this._sources[i].getValue();
            if(value !== null)
               value += "";
            if(value && typeof(value) === 'string' && ( value.length >= this._options.startChar || validateLength === false )){
               filter[this._options.filter[i]] = value;
            }
            else if(!filter[this._options.filter[i]]){
               filter[this._options.filter[i]] = '';
            }
         }
         return filter;
      },
      /**
       * Устанавливает подсветку найденного для браузера
       * @param {Object} filter Фильтр, который применяется к браузеру
       * @param {Number} numberOfBrowser Номер браузера, с которым мы работаем
       */
      _setBrowserHighlightning: function(filter, numberOfBrowser){
         var result = [];
         for(var i in filter){
            if(filter.hasOwnProperty(i)){
               var value = filter[i];
               if(value instanceof Object && 'fieldName' in value){
                  value = this.getLinkedContext().getValue(value['fieldName']);
               }
               if(value){
                  result.push(value);
               }
            }
         }
         if(this._currentBrowser[numberOfBrowser]){
            this._currentBrowser[numberOfBrowser].setTextHighlight(result.length ? result.join('|') : '');
         }
      },
      _initHistoryRecordSet: function(){
         var method = this._options.historyMethod.split('.'),
             self = this;
         this._historyRecordSet = new $ws.proto.RecordSet({
            context: this.getLinkedContext(),
            usePages: this._options.display.usePaging,
            //ограничим историю, чтобы возвращалось не больше 10 записей, на всякий случай
            rowsPerPage: 10,
            filterParams: {},
            requiredParams: [],
            readerType: 'ReaderUnifiedSBIS',
            readerParams: {
               linkedObject: method[0],
               queryName: method[1]
            },
            firstRequest: false,
            handlers: {
               'onAfterLoad': function(){
                  if(!self.isVisible()){
                     self._showMenu();
                  }
                  //скрываем блок истории, если у нас поле ввода скрыто
                  if(!self._isCurrentSourceVisible()) {
                     self._historyBlock.addClass('ws-hidden');
                  } else {
                     //если поле ввода видимо, то покажем только тогда, когда есть записи в истории
                     self._historyBlock.toggleClass('ws-hidden', !this.getRecordCount());
                  }
               }
            }
         });
      },
      /**
       * Проверяет видимость поля ввода
       * @returns {*}
       * @private
       */
      _isCurrentSourceVisible: function() {
         var source = this._sources[this._currentField],
             owner = this._sourcesOwner[this._currentField];

         //Для поля связи особо проверяем видимость
         if(owner && $ws.helpers.instanceOfModule(owner, 'SBIS3.CORE.FieldLink')) {
            return owner.getInputVisibility();
         }
         return source && $ws.helpers.isElementVisible(source.getContainer());
      },
      /**
       * Обрабатывает изменение полей ввода
       */
      _processChanges: function(input, validateLength, revertedFilter, value){
         var self = this,
            inputValue = value || value === '' ? value : input.attr('value');
         if(!revertedFilter && inputValue === self._currentInputValue && this._options.autoShow !== true){
            return;
         }
         if (this._useDefinition) {
            if (this.getLinkedContext().getValue(this._options.definition) !== inputValue) {
               this.getLinkedContext().setValue(this._options.definition, value);
            } else {
               input.val(value);
            }
            return;
         }
         self._currentInputValue = inputValue;
         for(var k = 0, browserLen = self._currentBrowser.length; k < browserLen; k++) {
            $ws.helpers.callbackWrapper(!self._browserInit.length && self._init(k) || self._browserInit[k], function (instance) {
               /*если начальная длина поиска поставлена в 0, то проводить сравнение длины не имеет смысла.
                если разработчик такую длину поставил, то, видимо, видел в этом какой-то скрытый смысл...*/
               if (parseInt(self._options.startChar, 10) === 0 && !self._options.clearBrowser)
                  validateLength = false;
               var recordset = instance.getRecordSet(k),
                  hasValues = false,
                  filter = self._options.useKbLayoutRevert && revertedFilter ? revertedFilter : self._getFilter(validateLength);
               for (var i in filter) {
                  if (!filter.hasOwnProperty(i)) {
                     continue;
                  }
                  if (filter[i] && self._sourcesNames[i]) {
                     hasValues = true;
                     break;
                  }
               }
               self._setBrowserHighlightning(filter, k);
               filter = $ws.core.merge(self._options.filterParams, filter);
               filter = recordset.prepareFilter(filter, true);
               if (hasValues || validateLength === false) {
                  self._container
                     .toggleClass('ws-control-inactive', false)
                     .toggleClass('ws-has-focus', true);
                  if (!self._isFilterEqual(filter) || !self._loaded) {
                     self.hide();
                     self._loaded = false;
                     self._filter = $ws.core.merge({}, filter);

                     //запрос для истории this._options.historyMethod
                     if(self._options.historyMethod){
                        if(!self._historyRecordSet){
                           self._initHistoryRecordSet();
                        }
                        filter = self._prepareFilter(filter);
                        self._historyRecordSet.setQuery(filter);
                     }

                     if (recordset !== null && recordset.getReader().getAdapter().getRPCClient() !== null)
                        recordset.abort(k);
                     if (self._options.linkedBrowser[k]) // если связанный браузер, то сбрасываем номер страницы к первой
                        instance.setPage(0, false);
                     if (self._options.expandTree) {
                        if (instance.isTree()) {
                           instance.applyTurnTree(hasValues, true);
                        }
                        else if (hasValues) {
                           instance.applyTurn('mixed', true);
                        }
                        else {
                           instance.clearTurn(true);
                        }
                     }
                     if (self._options.selectOnLoad === false) {
                        instance.setActiveRow(undefined);
                     }
                     var offset = input.length === 0 ? {} : input.position(),
                        clearButton = input.parent().find('.ws-suggest-clear'),
                        left = offset.left + input.width() - 16,
                        top = offset.top + (input.height() - ICON_WIDTH) / 2;
                     if (clearButton.length > 0 && clearButton.css("display") !== "none") {
                        left -= 16;
                     }
                     self._loading
                        .css({
                           top: top,
                           left: left
                        })
                        .appendTo(input.parent())
                        .removeClass('ws-hidden');

                     if (typeof(self._options.dataSource) == 'function') {
                        self._getRecordSetFromHandler(filter).addCallback(function (rs) {
                           self._currentRecordSet = rs;
                           instance.setData(rs);
                        });
                     }
                     else {
                        if (self._options.useBrowserFilter) {
                           var query = instance.getQuery(),
                              hierarchyField = instance.getRecordSet(k).getHierarchyField();
                           for (var field in query) {
                              if (query.hasOwnProperty(field)) {
                                 if (field === hierarchyField || field === 'Разворот') {
                                    delete query[field];
                                 }
                              }
                           }
                           filter = $ws.core.merge(filter, query, { preferSource: true });
                        }
                        if (self._options.resetRoot) {
                           instance.setRootNode(instance.getRootNode(), true);
                        }
                        if (hasValues && self._options.expandTree) {
                           filter['Разворот'] = 'С разворотом';
                        }
                        if (!hasValues && instance.isHierarchy()) {
                           filter['Разворот'] = 'Без разворота';
                        }
                        filter = self._prepareFilter(filter);
                        instance.setQuery(filter, true, false);
                     }
                  }
                  else {
                     self._showMenu();
                  }
               } else {
                  self._filter = {};
                  instance.setTextHighlight('');
                  if (self._options.clearBrowser) {
                     instance.clear();
                  }
                  self.hide();
               }
               return instance;
            });
         }
      },
      /**
       * Возвращает, равен ли новый фильтр старому
       * @param {Object} filter Новый фильтр
       * @returns {Boolean}
       */
      _isFilterEqual: function(filter){
         this._filter = this._filter || {};
         var equal = true,
            objectIn = function(object0, object1){
               for(var i in object0){
                  if(object0.hasOwnProperty(i)){
                     if(!object1.hasOwnProperty(i) || object1[i] !== object0[i]){
                        equal = false;
                        break;
                     }
                  }
               }
            };
         objectIn(filter, this._filter);
         objectIn(this._filter, filter);
         return equal;
      },
      /**
       * <wiTag group="Данные">
       * Изменяет дополнительные параметры фильтрации
       * @param {Object} params Новые дополнительные параметры
       * @example
       * <pre>
       *    suggest.setParams({
       *       'Заблокированные': false
       *    });
       * </pre>
       */
      setParams: function(params){
         this._options.filterParams = params;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает дополнительные параметры фильтрации метода бизнес-логики
       * @example
       * <pre>
       *    var params = suggest.getParams();
       *    if(params["Подразделение"] === null){
       *       params["Подразделение"] = $ws.single.GlobalContext().getValue("Организация");
       *       suggest.setParams(params);
       *    }
       * </pre>
       * @returns {Object}
       */
      getParams: function(){
         return this._options.filterParams;
      },

      /**
       * <wiTag group="Управление">
       * Принудительно запускает поиск
       * @example
       * <pre>
       *    $ws.single.ControlStorage.getByName('search').subscribe('onActivated', function(){
       *       // по клику на кнопку поиска покажем автодополнение
       *       $ws.single.ControlStorage.getByName('suggest').show();
       *    });
       * </pre>
       */
      _setVisibility : function(show){
         if (show) {
            this._processChanges(this._findInput(this._sources[0]), this._options.clearBrowser);
         } else {
            this._hideMenu(0);
         }
      },

      /**
       * Уничтожает контрол
       * <wiTag group="Управление" noShow>
       */
      destroy: function(){
         for(var k = 0, browserLen=this._currentBrowser.length; k < browserLen; k++) {
         if (this._options.linkedBrowser.length && this._currentBrowser.length) {
            // Браузер может быть уже убит ареей
            !this._currentBrowser[k].isDestroyed() && this._currentBrowser[k].destroy();
         } else {
               this._browserUnsubscribe(k);
            }
         }
         this._windowChangeHandler = undefined;
         if (this._options.definition) {
            this.getLinkedContext().unsubscribe('onFieldChange', this._setDefinitionValueHandler);
            this._setDefinitionValueHandler = undefined;
         }
         this._onMouseWheelHandler = undefined;
         this._currentBrowser = null;
         this._currentRecordSet = null;
         this._sources.length = 0;
         this._sourcesNames = {};
         this._results = undefined;
         this._historyBrowser = undefined;
         this._hiddenRowsHeight = undefined;
         this._timer = undefined;
         this._filter = undefined;
         this._addMoreButton = undefined;
         this._hasMoreLabel = undefined;
         this._browserContainer = undefined;
         this._hideTimer = undefined;
         if(this._isVisible){
            this._isVisible = false;
            this._notifySubWindow(false);
         }
         this._loading.remove();
         this._loading = undefined;
         if (this._containerConnectedToLinkedBrowser) {
            //Тут мы привязаны к контейнеру от чужого браузера - удалять его нельзя.
            //Очистим переменную, чтоб метод предка не удалил чужой контейнер
            this._container = undefined;
         }
         $ws.proto.Suggest.superclass.destroy.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Изменение активности автодополнения
       * Если автодополнение не активно, то поиска при вводе не происходит
       * @example
       * <pre>
       *    if(suggest.isEnabled())
       *       suggest.setEnabled(false);
       * </pre>
       * @param {Boolean} enable
       */
      _setEnabled: function(enable){
         if(this._isVisible){
            this.hide();
         }
         for(var i = 0, l = this._clearButtons.length; i < l; i++){
            if(this._clearButtons[i] && this._sources[i]){
               this._clearButtons[i].toggle(!!enable && !!this._sources[i].getValue());
            }
         }
         $ws.proto.Suggest.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * Включает/выключает автопоказ
       * @param {Boolean} active Включать или выключать
       * @example
       * <pre>
       *    suggest.setAutoShow(true);
       * </pre>
       */
      setAutoShow: function(active){
         this._options.autoShow = !!active;
      },
      /**
       * Добавляет новое поле, которое будет обрабатывать автодополнение
       * @param {$ws.proto.FieldAbstract} field Поле (контрол)
       * @param {String} filterName Имя параметра фильтрации, соотвествующее этому полю ввода
       * @param {Boolean} addToResults Флаг, отвечающий за необходимость заполнения результирующего поля
       * @example
       * <pre>
       *    if(dialog.getRecord().get('Сотрудник.Уволен') === false)
       *       suggest.addSource($ws.single.ControlStorage.getByName('ДатаПриема'), 'ДатаС');
       * </pre>
       */
      addSource: function(field, filterName, addToResults){
         var number = this._sources.length;
         this._sources.push(field);
         this._sourcesNames[filterName] = true;
         this._options.filter.push(filterName);
         this._options.sourceField.push(field.makeOwnerName());
         if (addToResults !== false){
            this._results.push(field);
            this._options.processField.push(filterName);
         }
         this._initSourceEvents(number, field, this._options.linkedBrowser !== null);
      },
      /**
       * Прервать поиск
       * <wiTag group="Данные">
       * Прерывает текущий запрос к браузеру, если он есть
       * @param {Number} numberOfBrowser Номер браузера, к которому прерываем запрос
       * @example
       * <pre>
       *    $ws.single.ControlStorage.getByName("Закладки").subscribe('onTabChange', function(){
       *       // при переходе на другую закладку прервем поиск
       *       suggest.abort();
       *    });
       * </pre>
       */
      abort: function(numberOfBrowser){
         if(this._currentBrowser[numberOfBrowser]) {
            var recordSet = this._currentBrowser[numberOfBrowser].getRecordSet(numberOfBrowser);
            if(recordSet) {
               recordSet.abort(numberOfBrowser);
               if(this._timer) {
                  clearTimeout(this._timer);
               }
               if(this._loading) {
                  this._loading.addClass('ws-hidden');
               }
            }
         }
      },
      /**
       * Очищать при открытии папки
       * <wiTag group="Данные">
       * Будет ли очищать фильтр при входе в папку в иерархии
       * @param {Boolean} clear очищать или нет фильтр
       * @example
       * <pre>
       *    if(table.isTree())
       *       suggest.setClearOnOpen();
       * </pre>
       */
      setClearOnOpen: function(clear){
         this._options.clearOnOpen = true;
      },

      canAcceptFocus: function() {
         return false;
      },
      /**
       * Задает параметр, отвечающий за смену раскладки в автодополнении
       * Раскладка меняется, если по запросу ничего не найдено
       * <wiTag group="Данные">
       * @param {Boolean} useKbLayoutRevert менять ли раскладку
       * @example
       * <pre>
       *    suggest.setUseKbLayoutRevert(true);
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
       *    //если в автодополнении не используется сменя раскладки при поиске, то установим ее
       *    if(!suggest.getUseKbLayoutRevert()){
       *       suggest.setUseKbLayoutRevert(true);
       *    }
       * </pre>
       */
      getUseKbLayoutRevert: function(){
         return this._options.useKbLayoutRevert;
      },
      /**
       * Получить имя метода получения истории в автодополнении
       * <wiTag group="Данные">
       * @return {String} historyMethod имя метода получения истории
       * @example
       * <pre>
       *    if(suggest.getHistoryMethod() !== 'Сотрудник.СписокИстории'){
       *       suggest.setHistoryMethod('Сотрудник.СписокИстории');
       *    }
       * </pre>
       */
      getHistoryMethod: function(){
         return this._options.historyMethod;
      },
      /**
       * Установить имя метода получения истории в автодополнении
       * <wiTag group="Данные">
       * @param {String} historyMethod имя метода получения истории
       * @example
       * <pre>
       *    if(suggest.getHistoryMethod() !== 'Сотрудник.СписокИстории'){
       *       suggest.setHistoryMethod('Сотрудник.СписокИстории');
       *    }
       * </pre>
       */
      setHistoryMethod: function(historyMethod){
         if(typeof historyMethod == 'string'){
            this._options.historyMethod = historyMethod;
         }
      }
   });

   return $ws.proto.Suggest;

});
