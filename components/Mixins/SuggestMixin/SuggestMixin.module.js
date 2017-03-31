define('js!SBIS3.CONTROLS.SuggestMixin', [
   "Core/core-functions",
   "Core/core-merge",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.PickerMixin",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "Core/helpers/functional-helpers"
], function ( cFunctions, cMerge, Deferred,PickerMixin, colHelpers, cInstance, fHelpers) {
   'use strict';


   var DEFAULT_SHOW_ALL_CONFIG = {
      template: 'js!SBIS3.CONTROLS.SuggestShowAll',
      componentOptions: {}
   };

   var DEFAULT_LIST_CONFIG = {
      allowEmptySelection: false,
      itemsDragNDrop: false,
      emptyHTML: 'Не найдено',
      scrollPaging: false,
      element: function() { return this._getListContainer(); },
      filter: function() { return this.getProperty('listFilter'); },
      parent: function() { return this._picker; }
   };

   /**
    * Миксин автодополнения. Позволяет добавить функционал автодополнения любому контролу или набору контролов.
    * Управляет {@link list} контролом, который будет использоваться для отображения элементов коллекции.
    *
    * @remark
    * Автодополнение - это функционал отображения возможных результатов поиска по введенным символам.
    * Получает готовый экземпляр {@link list контрола}, который будет использоваться для отображения элементов коллекции, либо название компонента и опции.
    * Данный экземпляр контрола вставляется в контейнер, предоставляемый {@link SBIS3.CONTROLS.PickerMixin}.
    * Также предусмотрена возможность {@link usePicker не менять контейнер}, в этом случае поведение PickerMixin блокируется.
    *
    * Работает исключительно через контекст (т.е. все контролы, которые взаимодействовуют в автодополнением, должны быть заbindены на контекст):
    * - отслеживает изменения полей контекста, указанных в {@link listFilter}, формирует фильтр, и отправляет его в {@link list контрол списка сущностей}, вызывая SBIS3.CONTROLS.DSMixin::reload();
    * - отслеживает выбор элемента в {@link list контроле списка сущностей}, разбрасывает значения полей выбранного элемента, указанных в {@link resultBindings}, по полям контектста.
    *
    * Кнопку отображения всех элементов коллекции нужно самостоятельно положить в {@link list} и указать ей имя "showAllButton'
    *
    * Для показа автодополнения при получения контролом фокуса, используется {@link autoShow}.
    *
    * В контроле, к которому подмешивается, обязательно требует миксины:
    * {@link SBIS3.CONTROLS.PickerMixin}
    * {@link SBIS3.CONTROLS.DataBindMixin}
    * {@link SBIS3.CONTROLS.ChooserMixin}
    *
    * @mixin SBIS3.CONTROLS.SuggestMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var SuggestMixin = /** @lends SBIS3.CONTROLS.SuggestMixin.prototype */{
      /**
       * @event onFilterBuild Происходит после построения фильтра.
       * Событие происходит после построения фильтра, который будет передан в контрол, отображающий список значений для автодополнения.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} filter Собранный фильтр.
       * @param {Object} bindings Карта соответствия поле контекста -> поле фильтра.
       */

      /**
       * @event onListReady Происходит при готовности контрола списка сущностей.
       * Событие происходит после создания экземпляра класса контрола, отображающего список значений для автодополнения и
       * проведения настроек по его привязке.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CORE.Control} list Контрол списка сущностей.
       */

      /**
       * @event onListItemSelect Происходит перед применением выбранной записи к полям контекста.
       * Событие происходит просле выбора пользователем записи в контроле списка сущностей, перед моментом присваивания
       * значений из полей записи полями контекста.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Record} item Выбранная запись.
       * @param {Object} bindings Карта соответствия: поле контекста -> поле записи.
       */

      $protected: {
         _options: {
            /**
             * @cfg {Number} Устанавливает время задержки перед выполнением поиска. Значение задаётся в миллисекундах.
             * @remark
             * Временная пауза перед началом поиска дается на формирование пользователем корректного запроса к списку
             * значений для автодополнения. Это позволяет предотвратить выполнение лишних запросов к источнику данных.
             * Ввод или удаление символа вновь активирует режим задержки перед началом поиска.
             *
             * Чтобы настроить минимальное количество символов, с ввода которых начинается поиск результатов,
             * используйте опцию {@link startChar}.
             *
             * Подробнее о функционале автодополнения вы можете прочитать в описании к классу {@link SBIS3.CONTROLS.SuggestMixin}.
             * @example
             * <pre class="brush: xml">
             *     <!-- Установлена задержка в одну секунду -->
             *     <option name="delay">1000</option>
             * </pre>
             * @see startChar
             */
            delay: 500,

            /**
             * @cfg {Number} Устанавливает минимальное количество введенных символов, которые необходимы для начала поиска результатов автодополнения.
             * @remark
             * После ввода минимального количества символов происходит временная задержка перед началом поиска,
             * которая устанавливается через опцию {@link delay}.
             * Подробнее о функционале автодополнения вы можете прочитать в описании к классу {@link SBIS3.CONTROLS.SuggestMixin}.
             * @example
             * <pre class="brush: xml">
             *     <option name="startChar">1</option>
             * </pre>
             * @see delay
             */
            startChar: 3,
            /**
             * @cfg {Boolean} Устанавливает режим работы автодополнения, в котором выводится список всех возможных значений при переходе фокуса на контрол.
             * * true Режим включен.
             * * false Режим выключен.
             * @remark file SuggestMixin-autoShow.md
             * @example
             * <pre class="brush: xml">
             *     <option name="autoShow">true</option>
             * </pre>
             * @see list
             * @see listFilter
             * @see startChar
             * @see SBIS3.CONTROLS.ListView#showPaging
             * @see SBIS3.CONTROLS.DSMixin#pageSize
             * @see SBIS3.CONTROLS.DataGridView#showHead
             */
            autoShow: false,
            /**
             * @cfg {Boolean} Использовать выпадающий блок
             * * true если контрол списка сущностей находится внутри выпадающего блока.
             * * false если контрол списка сущностей находится вне выпадающего блока.
             */
            usePicker: true,
            /**
             * @typedef {Array} BindingsSuggest
             * @property {String} contextField Поле контекста.
             * @property {String} itemField Поле записи.
             */
            /**
             * @cfg {BindingsSuggest[]} Соответствие полей для подстановки в результат выбора
             * Соответствие полей выбранной записи и полей контекста.
             * @example
             * <pre>
             *    resultBindings: [{
             *       contextField: 'ФИО',
             *       itemField: 'РП.ФИО'
             *    }]
             * </pre>
             * @editor InternalOptions?
             */
            resultBindings: [],

            /**
             * @cfg {SBIS3.CORE.Control[]} Набор контролов, в которых отслеживается получение фокуса
             * @group Data
             */
            observableControls: [],

            /**
             * @typedef {Object} ListControl
             * @property {String} component Класс контрола, который будет использоваться для отображения списка сущностей.
             * По умолчанию используется {@link SBIS3.CONTROLS.ListView}. Однако можно указать любой другой контрол, который
             * наследует функционал {@link SBIS3.CONTROLS.DSMixin}, {@link SBIS3.CONTROLS.Selectable} и {@link SBIS3.CONTROLS.MultiSelectable}.
             * @property {Object} options Опции контрола, которые будут использованы при его построении.
             */
            /**
             * @cfg {ListControl} Устанавливает конфигурацию выпадающего блока, отображающего список значений для автодополнения.
             * @remark file SuggestMixin-list.md
             * @example
             * <pre class="brush:xml">
             *     <options name="list">
             *        <option name="component" value="js!SBIS3.CONTROLS.DataGridView"></option> <!-- Указываем класс контрола, на его основе строятся результаты автодополнения -->
             *        <options name="options">
             *           <option name="idProperty" value="@Пользователь"></option> <!-- Указываем ключевое поле -->
             *           <options name="columns" type="array"> <!-- Производим настройку колонок -->
             *              <options>
             *                 <option name="title">№</option>
             *                 <option name="field">@Пользователь</option>
             *              </options>
             *              <options>
             *                 <option name="title">Фамилия</option>
             *                 <option name="field">Фамилия</option>
             *              </options>
             *           </options>
             *        </options>
             *     </options>
             * </pre>
             * @group Data
             * @see autoShow
             * @see listFilter
             * @see getList
             * @see startChar
             * @see SBIS3.CONTROLS.DSMixin#idProperty
             * @see SBIS3.CORE.FieldLink/Columns.typedef
             * @see SBIS3.CONTROLS.DataGridView#showHead
             */
            list: {
               component: 'js!SBIS3.CONTROLS.ListView',
               options: {}
            },

            /**
             * @cfg {Object} Устанавливает параметры фильтрации для списка значений автодополнения.
             * @remark
             * Опция используется как дополнение опции {@link list} - настройки выпадающего блока.
             * С помощью опции определяют поле источника данных, по значениям которого будет произведена фильтрация.
             * Параметры фильтрации не делают статическими, их значения устанавливаются динамически с помощью привязки к полю контекста.
             * Значение в поле контекста изменяется со стороны какого-либо поля ввода.
             * Пример фильтрации списка значений:
             * ![](/SuggestMixin03.png)
             * Значение поля ввода привязывается к полю контекста опцией {@link SBIS3.CONTROLS.TextBoxBase#text}, с помощью атрибута bind.
             * Минимальное количество введенных символов, необходимое для начала поиска результатов автодополнения, определяется опцией {@link startChar}.
             * Установить фильтр для списка значений можно с помощью метода {@link setListFilter}
             * Подробнее о функционале автодополнения вы можете прочитать в описании к классу {@link SBIS3.CONTROLS.SuggestMixin}.
             * @example
             * <pre class="brush:xml">
             *     <option name="text" bind="myTextField" value=""></option> <!-- Привязываем значения поля связи к полю myTextField в контексте -->
             *     <options name="listFilter">
             *        <option name="ФИО" bind="myTextField" oneWay="true"></option> <!-- Односторонняя привязка к полю myTextField по значениям из поля "ФИО" -->
             *     </options>
             * </pre>
             * @see setListFilter
             * @see list
             * @see startChar
             * @see SBIS3.CONTROLS.TextBoxBase#text
             */
	        listFilter: {},
            /**
             * @typedef {Object} showAll
             * @property {String} template Шаблон, который отобразится в диалоге всех записей
             * @property {Object} componentOptions Опции опции которые прокинутся в компонент, отображаемый на диалоге всех записей
             */
            /**
             * @cfg {showAll} Конфигурация диалога всех записей
             * @example
             * <pre>
             *    <options name="showAllConfig">
             *       <option name="template" value="js!SBIS3.CONTROLS.SuggestShowAll"></option>
             *       <options name="componentOptions">
             *          <option name="showSelectButton" type="Boolean" value="true"></option>
             *       </options>
             *    </options>
             * </pre>
             */
            showAllConfig: {},
            /**
             * @cfg {Boolean} Показывать ли выпадающий блок, при пустом списке
             * @variant true Показывать выпадающий блок при пустом списке.
             * @variant false Не показывать выпадающий блок при пустом списке.
             */
            showEmptyList: true
         },
         _resultBindings: {},                   /* {Object} Соответствие полей для подстановки в контекст */
         _delayTimer: null,                     /* {Object|null} Таймер задержки загрузки picker-а */
         _loadingIndicator: undefined,          /* {Object} Индикатор загрузки */
         _list: undefined,                      /* {SBIS3.CONTROLS.DSMixin}{SBIS3.CONTROLS.Selectable|SBIS3.CONTROLS.MultiSelectable} Контрол списка сущностей */
         _listContainer: undefined,             /* {jQuery} Контейнер для контрола списка сущностей */
         _loadDeferred: null,                   /* {Deferred|null} Деферред загрузки данных для контрола списка сущностей */
         _showAllButton: undefined,              /* {SBIS3.CORE.Control} Кнопка открытия всех записей */
         _listReversed: false
      },

      $constructor: function () {
         if (!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.PickerMixin')) {
            throw new Error('Mixin SBIS3.CONTROLS.PickerMixin is required.');
         }

         this._publish('onFilterBuild', 'onListReady', 'onListItemSelect');

         this._showAllButtonHandler = this._showAllButtonHandler.bind(this);
         this._initBindingRules();
      },

      after: {
         init: function () {
            this._connectBindings();
         },
         destroy: function () {
            this._clearDelayTimer();
            this._loadingIndicator = undefined;
            if (this._list) {
               this._list.destroy();
            }
         }
      },

      around: {
         _modifyOptions: function(parentFnc, opts) {
            var options = parentFnc.call(this, opts);
            options.className += ' controls-Suggest';
            return options;
         }
      },

      /**
       * Инициализирует правила проброса данных (контекст -> фильтр, запись -> контекст)
       * @private
       */
      _initBindingRules: function () {
         //TODO избавиться
         var convertToObject = function (bindings) {
            var result = {};
            for (var i = 0, len = bindings.length; i < len; i++) {
               var item = bindings[i];
               result[item.contextField] = item.itemField;
            }

            return result;
         };
         this._resultBindings = convertToObject(this._options.resultBindings);
      },

      /**
       * Устанавливает фильтр для списка значений автодополнения.
       * @param {Object} filter Новый фильтр.
       * @param {Boolean} silent "Тихая" установка, не вызывает запроса на БЛ и не изменяет состояние выпадающего блока.
       * @example
       * <pre>
       *     self.setListFilter({'Раздел': res});
       * </pre>
       * @see listFilter
       * @see list
       */
      setListFilter: function(filter, silent) {
         var self = this,
             changedFields = [],
             items = this._getListItems();

         colHelpers.forEach(filter, function(value, key) {
            if(value !== self._options.listFilter[key]) {
               changedFields.push(key);
            }
         });

         this._options.listFilter = filter;
         this._notifyOnPropertyChanged('listFilter');

         /* Если в контролах, которые мы отслеживаем, нет фокуса или изменение фильтра произошло после внуренних изменений
            то почистим датасет, т.к. фильтр сменился и больше ничего делать не будем */
         if(!this._isObservableControlFocused() || silent) {
            if(items && items.getCount()) {
               items.clear();
            }
            if(this._list) {
               this._list.setFilter(this._options.listFilter, true);

               if(this.isPickerVisible()) {
                  this.hidePicker();
               }
            }
            return;
         }

         if(!changedFields.length) {
            return;
         }

         for(var i = 0, len = changedFields.length; i < len; i++) {
            if(String(this._options.listFilter[changedFields[i]]).length >= this._options.startChar) {
               this._startListSearch();
               return;
            }
         }
         /* Если введено меньше символов чем указано в startChar, то скроем автодополнение */
         this._resetSearch();
      },

      // TODO использовать searchMixin 3.7.3.100
      _startListSearch: function() {
         var self = this,
             list = this.getList();

         this._clearDelayTimer();

         if(list.getDataSource()) {
            this._delayTimer = setTimeout(function () {
               self._showLoadingIndicator();
               self._loadDeferred = list.reload(self._options.listFilter).addCallback(function () {
                  if (self._checkPickerState(!self._options.showEmptyList)) {
                     self.showPicker();
                  }
               });
            }, this._options.delay);
         }
      },

      _resetSearch: function() {
         if(this._loadDeferred) {
            this._loadDeferred.cancel();
            this._loadDeferred = null;

         }
         /* Т.к. list может быть компонентом, который не наследован от DSmixin'a и метода _cancelLoading там может не быть,
          надо это проверить, но в любом случае, надо деферед отменить, чтобы не сработал показ пикера */
         if(this._list && this._list._cancelLoading) {
            this._list._cancelLoading();
         }
         this._hideLoadingIndicator();
         this._clearDelayTimer();
         this.hidePicker();
      },

      /**
       * Устанавливает связи между компонентами
       * @private
       */
      _connectBindings: function () {
         var self = this;

         //Подписываемся на события в отслеживаемых контролах
         colHelpers.forEach(this._options.observableControls, function (control) {
            this.subscribeTo(control, 'onFocusIn', self._observableControlFocusHandler.bind(self));

            /* Если фокус уходит на список - вернём его обратно в контрол, с которого фокус ушёл */
            this.subscribeTo(control, 'onFocusOut', function(e, destroyed, focusedControl) {
               /* Если фокус ушёл на список, или на дочерний контрол списка - возвращаем обратно в поле ввода */
               if(self._list && (self._list === focusedControl || ~Array.indexOf(self._list.getChildControls(), focusedControl))) {
                  focusedControl.setActive(false, false, false, this);
                  this.setActive(true);
               }
            });
         }, this);

      },

      /**
       * Обрабочик на приход фокуса в отслеживаемый компонент
       */
      _observableControlFocusHandler: function() {
         if(this._options.autoShow) {
            this._checkPickerState(true) ? this.showPicker() : this._startListSearch();
         }
      },

      /**
       * Показывает индикатор загрузки
       * @private
       */
      _showLoadingIndicator: function () {
         if (this._loadingIndicator === undefined) {
            var holder = this._getLoadingContainer() || this.getContainer();
            this._loadingIndicator = $('<div class="controls-Suggest__loadingIndicator">').appendTo(holder.addClass('controls-Suggest__loadingContainer'));
         }
         this._loadingIndicator.removeClass('ws-hidden');
      },

      /**
       * Прячет индикатор загрузки
       * @private
       */
      _hideLoadingIndicator: function () {
         if (this._loadingIndicator) {
            this._loadingIndicator.addClass('ws-hidden');
         }
      },

      /**
       * Метод должен возвращать контейнер для индикатора загрузки
       * @private
       */
      _getLoadingContainer : function() {
         /* Method must be implemented */
      },

      /**
       * Возвращает экземпляр класса контрола, отображающего список значений для автодополнения.
       * @returns {SBIS3.CORE.Control}
       * @example
       * <pre>
       *     this.getList().setDataSource(new SbisSourse({
       *        resource: 'Сотрудник',
       *        queryMethodName: 'СписокПерсонала',
       *        formatMethodName: 'Сотрудник.FieldLinkFormat'
       *     }), true);
       * </pre>
       * @see list
       */
      getList: function () {
         var options, component, dataSource;

         if (!this._list) {
            if (cInstance.instanceOfMixin(this._options.list, 'SBIS3.CONTROLS.DSMixin')) {
               /* Если передали в опции готовый инстанс, то ничего создавать не надо */
               this._list = this._options.list;
               this._initList();
               return this._list;
            } else {
               //Набор "Сделай сам"
               options = cFunctions.clone(this._options.list.options);
               component = require(this._options.list.component);

               colHelpers.forEach(DEFAULT_LIST_CONFIG, function(value, key) {
                  if(!options.hasOwnProperty(key)) {
                     options[key] = typeof value === 'function' ? value.call(this) : value;
                  }
               }, this);

               /* Сорс могут устанавливать не через сеттер, а через опцию */
               if(options.dataSource !== undefined) {
                  dataSource = options.dataSource;
                  delete options.dataSource
               } else if(this._options.dataSource) {
                  dataSource = this._options.dataSource
               }

               this._list = new component(options);

               /* Устанавливаем сорс после инициализации компонента (если есть опция), иначе будет лишний запрос */
               if(dataSource) {
                  this._list.setDataSource(dataSource, true);
               }

               this._initList();

               return this._list;
            }
         } else {
            return this._list;
         }
      },
      /**
       * @param {Boolean} autoShow Устанавливает режим работы автодополнения: отображать ли список всех возможных значений при переходе фокуса на контрол.
       * @see list
       * @see listFilter
       * @see startChar
       */
      setAutoShow: function(autoShow) {
         this._options.autoShow = Boolean(autoShow);
         this._notifyOnPropertyChanged('autoShow');
      },

      /**
       * Возвращает режим работы автодополнения: отображать ли список всех возможных значений при переходе фокуса на контрол.
       * @returns {Boolean}
       * @see list
       * @see listFilter
       * @see startChar
       */
      getAutoShow: function() {
         return this._options.autoShow;
      },

      /**
       * Инициализирует контрол списка сущностей
       * @private
       */
      _initList: function () {
         var self = this;

         this.subscribeTo(this._list, 'onDataLoad', this._onListDataLoad.bind(this))
             .subscribeTo(this._list, 'onItemsReady', this._onListDataLoad.bind(this))
             .subscribeTo(this._list, 'onDataLoadError', function() {
                self._hideLoadingIndicator();
                /* https://inside.tensor.ru/opendoc.html?guid=700c5bec-d003-4489-ab94-e14df6ee16fb&des=
                   Ошибка в разработку 27.12.2016 Не закрывается сообщение "о недоступном сервисе сообщений" в реестре Мои/Общие, если открыть…

                   При возниконовении ошибки отключаем отображение автодополнения по приходу фокуса,
                   иначе будет зацикливание и интерфейс заблокируется.*/
                self.setAutoShow(false);
             })
             .subscribeTo(this._list, 'onDrawItems', this._onListDrawItems.bind(this))
             .subscribeTo(this._list, 'onItemActivate', (function (eventObject, itemObj) {
                self.setActive(true);
               /* По задаче:
                https://inside.tensor.ru/opendoc.html?guid=7ce2bd66-bb6b-4628-b589-0e10e2bb8677&description=
                Ошибка в разработку 03.11.2016 В полях связи не скрывается список с историей после выбора из него значения. Необходимо закрывать...

                В стандарте не описано поведение автодополнения при выборе из него,
                поэтому жду как опишут и согласуют. Для выпуска 200 решили, что всегда будем скрывать при выборе */
               self.hidePicker();
                self._onListItemSelect(itemObj.id, itemObj.item);
            }));

         this._notify('onListReady', this._list);
      },


      _getShowAllConfig: function(){
         /* Если передали конфигурацию диалога, то используем его, иначе используем дефолтный */
         /* Если передали конфигурацию диалога, то используем его, иначе используем дефолтный */
         if(!Object.isEmpty(this._options.showAllConfig)) {
            return this._options.showAllConfig;
         } else {
            return cMerge({
               componentOptions: {
                  chooserMode: this._options.chooserMode
               }
            }, DEFAULT_SHOW_ALL_CONFIG);
         }
      },

      /**
       * Возвращает контейнер для контрола списка сущностей
       * @returns {jQuery}
       */
      _getListContainer: function () {
         if (this._listContainer === undefined) {
            if (!this._picker) {
               this._initializePicker();
            }

            this._listContainer = $('<div/>').appendTo(
               this._picker.getContainer()
            );
         }

         return this._listContainer;
      },

      /**
       * Вызывается после загрузки данных контролом списка сущностей
       * @private
       */
      _onListDataLoad: function(e, dataSet) {
         var list = this.getList();

         this._hideLoadingIndicator();
         this._listReversed = false;

         if(list.hasChildControlByName('showAllButton')) {
            var items = dataSet || list.getItems(),
                button = list.getChildControlByName('showAllButton'),
                showButton;

            /* Изменяем видимость кнопки в зависимости от:
             1) Записей не найдено вовсе - показываем (по стандарту).
             2) Записи найдены, но есть ещё. */
            if(!items || !items.getCount()) {
               showButton = true;
            } else {
               showButton = list._hasNextPage(items.getMetaData().more);
            }

            if(showButton) {
               /* Чтобы не подписываться лишний раз */
               if(Array.indexOf(button.getEventHandlers('onActivated'), this._showAllButtonHandler) === -1) {
                  this.subscribeTo(button, 'onActivated', this._showAllButtonHandler);
               }
               button.show();
            } else {
               this.unsubscribeFrom(button, 'onActivated', this._showAllButtonHandler);
               button.hide();
            }
         }
      },

      _showAllButtonHandler: function() {
         var showAllConfig = this._getShowAllConfig();

         this.hidePicker();
         this._showChooser(showAllConfig.template, showAllConfig.componentOptions, showAllConfig.selectionType || null);
      },

      /**
       * Возвращает dataSet списка, если список уже инициализирован
       * @returns {WS.Data/Collection/List|undefined}
       * @private
       */
      _getListItems: function() {
         return this._list ? this._list.getItems() : undefined;
      },

      /**
       * Вызывается после отрисовки данных контролом списка сущностей
       * @private
       */
      _onListDrawItems: function () {
         if (this._picker) {
            this._picker.getContainer().height('auto');
            this._picker.recalcPosition(true, true);
         }
      },

      /**
       * Вызывается после выбора записи в контроле списка сущностей
       * @private
       */
      _onListItemSelect: function (id, item) {
         var def = new Deferred(),
             items = this._getListItems();

         if (id === null || id === undefined) {
            return;
         }

         if(item) {
            def.callback(item);
         } else if (items) {
            def.callback(items.getRecordById(id));
         } else {
            this.getList().getDataSource().read(id).addCallback(function (item) {
               def.callback(item);
            });
         }

         def.addCallback(this._onListItemSelectNotify.bind(this, item));
      },
      _onListItemSelectNotify: function (item) {
         var ctx = this._getBindingContext(),
             toSet = {};
         this._notify('onListItemSelect', item, this._resultBindings);
         /* Соберём все изменения в пачку,
          чтобы контекст несколько раз не пересчитывался */
         for (var field in this._resultBindings) {
            if (this._resultBindings.hasOwnProperty(field)) {
               toSet[field] = item.get(this._resultBindings[field]);
            }
         }
         ctx.setValue(toSet, false, this._list);
      },

      /**
       * Очищает таймер задержки открытия списка
       * @private
       */
      _clearDelayTimer: function() {
         if (this._delayTimer) {
            clearTimeout(this._delayTimer);
            this._delayTimer = null;
         }
      },

      /**
       * Проверяет, если ли фокус в отслеживаемых контролах
       * @returns {*}
       * @private
       */
      _isObservableControlFocused: function() {
         return colHelpers.find(this._options.observableControls, function(ctrl) {
            return ctrl.isActive();
         }, this, false)
      },

      /**
       * Проверяет необходимость изменения состояния пикера
       * @private
       */
      _checkPickerState: function (checkItemsCount) {
         var items = this._getListItems(),
             hasItems = checkItemsCount ? items && items.getCount() : true;

         return Boolean(
             this._options.usePicker &&
             hasItems &&
             this._isObservableControlFocused()
         );
      },

      _setPickerContent: function () {
         this._picker.getContainer().addClass('controls-Suggest__picker');
         /* Заглушка, picker автодополнения не должен вызывать расчёты авторазмеров, т.к. создаётся абсолютом в body */
         this._picker._notifyOnSizeChanged = fHelpers.nop;
      },

      showPicker: function () {
         /* Проверяем, что пикер не отображается,
            т.к. такой проверки на отображение в попапе нет (скорее всего по причине перерасчёта z-index'ов),
            а если позвать show при открытом пикере, то там произойдёт перерасчёт скрола, и становится невозможно выбрать запись. */
         if (this._options.usePicker && !this.isPickerVisible() && this.isEnabled()) { // Не отображаем автодополнение в задизейбленом состоянии
            PickerMixin.showPicker.apply(this, arguments);
         }
      },

      _reverseList: function() {
         var items = this._getListItems(),
             itemsArray = [];

         if(items) {
            items.each(function (rec) {
               itemsArray.push(rec);
            });

            this._listReversed = !this._listReversed;
            items.assign(itemsArray.reverse());
         }
      }
   };

   return SuggestMixin;
});
