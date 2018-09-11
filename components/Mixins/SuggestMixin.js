define('SBIS3.CONTROLS/Mixins/SuggestMixin', [
   "Core/core-clone",
   "Core/core-merge",
   "Core/Deferred",
   "SBIS3.CONTROLS/Mixins/PickerMixin",
   "Core/core-instance",
   'Core/helpers/Object/find'
], function (coreClone, cMerge, Deferred, PickerMixin, cInstance, find) {
   'use strict';

   var DEFAULT_SHOW_ALL_TEMPLATE = 'SBIS3.CONTROLS/Suggest/SuggestShowAll';
   var DEFAULT_SHOW_ALL_CONFIG = {
      template: DEFAULT_SHOW_ALL_TEMPLATE,
      componentOptions: {}
   };
   var DEFAULT_LIST_CONFIG = {
      allowEmptySelection: false,
      itemsDragNDrop: false,
      emptyHTML: rk('Не найдено'),
      scrollPaging: false,
      element: function() { return this._getListContainer(); },
      filter: function() { return this.getProperty('listFilter'); },
      parent: function() { return this._picker; }
   };

   /**
    * Миксин, задающий контролу работу с автодополнением - функционал отображения возможных результатов поиска по введенным символам.
    *
    * Настройка автодополнения для "Поля связи" описана <a href="/doc/platform/developmentapl/interface-development/components/textbox/field-link/suggest/">здесь</a>.
    *
    * <h3>Алгоритм создания автодополнения и отображения результатов поиска</h3>
    *
    * 1. Возвращается экземпляр класса контрола, который задан в опции {@link list}.
    * 2. Полученный экземпляр вставляется в контейнер, предоставляемый {@link SBIS3.CONTROLS/Mixins/PickerMixin}.
    *
    * <h3>Расширенные возможности автодополнения</h3>
    *
    * * Кнопка "Показать все" в результатах автодополнения (см. <a href="/doc/platform/developmentapl/interface-development/components/textbox/field-link/suggest/#_5">настройка</a>)
    * * Отображение автодополнения при получении контролом фокуса (см. {@link autoShow})
    *
    * <h4>Требования к окружению</h4>
    *
    * Миксин будет работать при условии, что в контрол так же подмешаны следующие миксины:
    *
    * * {@link SBIS3.CONTROLS/Mixins/PickerMixin}
    * * {@link SBIS3.CONTROLS/Mixins/DataBindMixin}
    * * {@link SBIS3.CONTROLS/Mixins/ChooserMixin}
    *
    * @mixin SBIS3.CONTROLS/Mixins/SuggestMixin
    * @public
    * @author Крайнов Д.О.
    */

   var SuggestMixin = /** @lends SBIS3.CONTROLS/Mixins/SuggestMixin.prototype */{
      /**
       * @event onFilterBuild Происходит после построения фильтра.
       * Событие происходит после построения фильтра, который будет передан в контрол, отображающий список значений для автодополнения.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Object} filter Собранный фильтр.
       * @param {Object} bindings Карта соответствия поле контекста -> поле фильтра.
       */

      /**
       * @event onListReady Происходит при готовности контрола списка сущностей.
       * Событие происходит после создания экземпляра класса контрола, отображающего список значений для автодополнения и
       * проведения настроек по его привязке.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Lib/Control/Control} list Контрол списка сущностей.
       */

      /**
       * @event onListItemSelect Происходит перед применением выбранной записи к полям контекста.
       * Событие происходит просле выбора пользователем записи в контроле списка сущностей, перед моментом присваивания
       * значений из полей записи полями контекста.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Record} item Выбранная запись.
       * @param {Object} bindings Карта соответствия: поле контекста -> поле записи.
       */

      $protected: {
         _options: {
            /**
             * @cfg {Number} Задержка между запросами к источнику данных.
             * @deprecated Используйте опцию {@link SBIS3.CONTROLS/Mixins/SearchMixin#searchDelay}.
             */
            delay: 500,

            /**
             * @cfg {Number|null} Минимальное количество символов, после ввода которых контрол выполняет поиск данных.
             * @deprecated Используйте опцию {@link SBIS3.CONTROLS/Mixins/SearchMixin#startCharacter}.
             */
            startChar: 3,
            /**
             * @cfg {Boolean} Режим работы (значение true) автодополнения, когда при переходе фокуса на контрол выводится список всех возможных значений.
             * @see list
             * @see listFilter
             * @see SBIS3.CONTROLS/ListView#showPaging
             * @see SBIS3.CONTROLS/Mixins/DSMixin#pageSize
             * @see SBIS3.CONTROLS/DataGridView#showHead
             */
            autoShow: false,
            /**
             * @cfg {Boolean} Показывать ли автодополнение?
             * @remark
             * Признак, благодаря которому вы можете запретить показывать автодополнение.
             * Для этого установите usePicker=false
             * Как следствие, не будут создаваться контейнер визуального отображения автодополнения и контрол, заданный в опции {@link list}.
             * Также автодополнение не отправит запросы к источнику данных (бизнес-логика приложения), которые заданы в опции dataSource контрола list.
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
             * @cfg {Object} Конфигурация контрола, который отображает выпадающий список автодополнения.
             * @remark file SuggestMixin-list.md
             * @example
             * В следующем примере показана настройка контрола SBIS3.CONTROLS/FieldLink, для которого задана конфигурация автодополнения.
             * <pre class="brush:xml">
             * <SBIS3.CONTROLS.FieldLink
             *    name="showAllButtonField"
             *    class="docs-ShowAllButton"
             *    text="{{ myTextField|mutable }}"
             *    placeholder="Введите имя сотрудника"
             *    displayProperty="Фамилия"
             *    multiselect="{{ false }}"
             *    idProperty="@ТелефонныйСправочник3"
             *    chooserMode="dialog"
             *    pickerClassName="docs-ShowAllButton__myPicker">
             *    <ws:dictionaries>
             *        <ws:options template="Examples/DOCS/ShowAllDictionary">
             *           <ws:componentOptions showSelectButton="{{false}}"/>
             *        </ws:options>
             *    </ws:dictionaries>
             *    <ws:list component="SBIS3.CONTROLS/DataGridView">
             *        <ws:options
             *           itemsActions=""
             *           idProperty="@ТелефонныйСправочник3"
             *           pageSize="5"
             *           showHead="{{true}}"
             *           footerTpl="tmpl!SBIS3.DOCS.ShowAllButton/resources/myFooterTpl">
             *              <ws:columns>
             *                 <ws:Array>
             *                    <ws:Object field="@ТелефонныйСправочник3" title="№" width="50" />
             *                    <ws:Object field="Фамилия" title="Фамилия" width="150" />
             *                    <ws:Object field="Имя" title="Имя" width="100" />
             *                 </ws:Array>
             *              </ws:columns>
             *        </ws:options>
             *    </ws:list>
             *    <ws:listFilter Имя="{{ myTextField|bind }}" />
             * </SBIS3.CONTROLS.FieldLink>
             * </pre>
             * @group Data
             * @see autoShow
             * @see listFilter
             * @see getList
             * @see SBIS3.CONTROLS/Mixins/DSMixin#idProperty
             * @see Deprecated/Controls/FieldLink/Columns.typedef
             * @see SBIS3.CONTROLS/DataGridView#showHead
             */
            list: {
               /**
                * @cfg {String} Имя класса контрола, который используется для построения списка автодополнения.
                * @remark
                * Класс контрола должен быть расширен функционалом миксинов {@link SBIS3.CONTROLS/Mixins/DSMixin}, {@link SBIS3.CONTROLS/Mixins/Selectable} и {@link SBIS3.CONTROLS/Mixins/MultiSelectable}.
                *
                * Для класса {@link SBIS3.CONTROLS/FieldLink} по умолчанию установлен класс {@link SBIS3.CONTROLS/DataGridView}.
                */
               component: 'SBIS3.CONTROLS/ListView',
               /**
                * @cfg {Object} Конфигурация контрола, который установлен в опции component.
                */
               options: {}
            },

            /**
             * @cfg {Object} Параметры фильтрации, используемые автодополнением при запросе к бизнес-логике.
             * @remark
             * Параметры фильтрации передаются в <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/">списочный метод</a> (который вызывается автодополнением) в параметр Фильтр.
             * Использование опции актуально совместно с опцией {@link list}.
             * @example
             * В следующем примере установлено, что автодополнение будет вызывать списочный метод с параметром Фильтр.Имя.
             * В параметр передается значение, хранимое в контексте в поле myTextField.
             * Значение поля изменяется через опцию text - значения, вводимые в поле связи.
             * <pre class="brush:xml">
             * <!-- Значения в опции text связаны с полем контекста myTextField. -->
             * <SBIS3.CONTROLS.FieldLink
             *    name="showAllButtonField"
             *    class="docs-ShowAllButton"
             *    text="{{ myTextField|mutable }}"
             *    placeholder="Введите имя сотрудника"
             *    displayProperty="Фамилия"
             *    multiselect="{{ false }}"
             *    idProperty="@ТелефонныйСправочник3"
             *    chooserMode="dialog"
             *    pickerClassName="docs-ShowAllButton__myPicker">
             *    <ws:dictionaries>
             *        <ws:options template="Examples/DOCS/ShowAllDictionary">
             *           <ws:componentOptions showSelectButton="{{false}}"/>
             *        </ws:options>
             *    </ws:dictionaries>
             *    <ws:list component="SBIS3.CONTROLS/DataGridView">
             *        <ws:options
             *           itemsActions=""
             *           idProperty="@ТелефонныйСправочник3"
             *           pageSize="5"
             *           showHead="{{true}}"
             *           footerTpl="tmpl!Examples/DOCS/ShowAllButton/resources/myFooterTpl">
             *              <ws:columns>
             *                 <ws:Array>
             *                    <ws:Object field="@ТелефонныйСправочник3" title="№" width="50" />
             *                    <ws:Object field="Фамилия" title="Фамилия" width="150" />
             *                    <ws:Object field="Имя" title="Имя" width="100" />
             *                 </ws:Array>
             *              </ws:columns>
             *        </ws:options>
             *    </ws:list>
             *    <!-- Значение параметра фильтрации "Имя" связано с полем контекста myTextField. -->
             *    <ws:listFilter Имя="{{ myTextField|bind }}" />
             * </SBIS3.CONTROLS.FieldLink>
             * </pre>
             * @see setListFilter
             * @see list
             * @see SBIS3.CONTROLS/TextBox/TextBoxBase#text
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
             *       <option name="template" value="SBIS3.CONTROLS/Suggest/SuggestShowAll"></option>
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
         _list: undefined,                      /* {SBIS3.CONTROLS/Mixins/DSMixin}{SBIS3.CONTROLS/Mixins/Selectable|SBIS3.CONTROLS/Mixins/MultiSelectable} Контрол списка сущностей */
         _listContainer: undefined,             /* {jQuery} Контейнер для контрола списка сущностей */
         _loadDeferred: null,                   /* {Deferred|null} Деферред загрузки данных для контрола списка сущностей */
         _showAllButton: undefined,              /* {Lib/Control/Control} Кнопка открытия всех записей */
         _listReversed: false
      },
      $constructor: function () {
         if (!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS/Mixins/PickerMixin')) {
            throw new Error('Mixin SBIS3.CONTROLS/Mixins/PickerMixin is required.');
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
            options.cssClassName += ' controls-Suggest';
            options.pickerClassName += ' controls-Suggest__picker';
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

         for (var key in filter) {
            if(filter.hasOwnProperty(key)) {
               if (filter[key] !== self._options.listFilter[key]) {
                  changedFields.push(key);
               }
            }
         }

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
            }
            return;
         }

         if(!changedFields.length) {
            return;
         }

         for(var i = 0, len = changedFields.length; i < len; i++) {
            if(String(this._options.listFilter[changedFields[i]] || '').length >= this._options.startChar) {
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
                  } else {
                     self.hidePicker();
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
         this._options.observableControls.forEach(function (control) {
            this.subscribeTo(control, 'onFocusIn', self._observableControlFocusHandler.bind(self));

            /* Если фокус уходит на список - вернём его обратно в контрол, с которого фокус ушёл */
            this.subscribeTo(control, 'onFocusOut', function(e, destroyed, focusedControl) {
               /* Если фокус ушёл на список, или на дочерний контрол списка - возвращаем обратно в поле ввода */
               if (self._list && (self._list === focusedControl || ~self._list.getChildControls().indexOf(focusedControl))) {
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
         if (this._options.autoShow && !this.isPickerVisible() && this._options.usePicker) {
            this._startListSearch();
         }
      },

      /**
       * Показывает индикатор загрузки
       * @private
       */
      _showLoadingIndicator: function () {
         if (this._loadingIndicator === undefined) {
            var holder = this._getLoadingContainer() || this.getContainer();
            this._loadingIndicator = $('<div class="controls-Suggest__loadingIndicator controls-Suggest__loadingIndicator-position">').appendTo(holder.addClass('controls-Suggest__loadingContainer'));
         }
         //показываем ромашку, только когда пикер скрыт. В противном случае будет две ромашки: эта и ромашка в списке
         if (this._picker && !this._picker.isVisible()) {
            this._loadingIndicator.removeClass('ws-hidden');
         }
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
       * @returns {Lib/Control/Control}
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
            if (cInstance.instanceOfMixin(this._options.list, 'SBIS3.CONTROLS/Mixins/DSMixin')) {
               /* Если передали в опции готовый инстанс, то ничего создавать не надо */
               this._list = this._options.list;
               this._initList();
               return this._list;
            } else {
               //Набор "Сделай сам"
               options = coreClone(this._options.list.options);
               component = require(this._options.list.component);

               for (var key in DEFAULT_LIST_CONFIG) {
                  if(DEFAULT_LIST_CONFIG.hasOwnProperty(key)) {
                     if(!options.hasOwnProperty(key)) {
                        options[key] = typeof DEFAULT_LIST_CONFIG[key] === 'function' ? DEFAULT_LIST_CONFIG[key].call(this) : DEFAULT_LIST_CONFIG[key];
                     }
                  }
               }

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

                if (cInstance.instanceOfMixin(this._list, 'SBIS3.CONTROLS/Mixins/ItemsControlMixin')) {
                   this._list.setEmptyHtml(rk('Справочник недоступен'));
                }
                
             })
             .subscribeTo(this._list, 'onDrawItems', this._onListDrawItems.bind(this))
             .subscribeTo(this._list, 'onItemActivate', (function (eventObject, itemObj) {
                // хак. бывает что активируется уже активный компонент (потому что его потомок активный).
                // чтобы активность ушла с потомка на предка, нужно сбросить _isControlActive, тогда выполнится полноценный алгоритм активации.
                self._isControlActive = false;
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
      _onListDataLoad: function() {
         this._hideLoadingIndicator();
      },

      _showAllButtonHandler: function() {
         var showAllConfig = this._getShowAllConfig(),
             list = this.getList(),
             listConfig;
         
   
         listConfig = {
            filter: list.getFilter(),
            idProperty: list.getProperty('idProperty'),
            itemTpl: list.getProperty('itemTpl'),
            dataSource: list.getDataSource()
         };
         
         //Делаю такую проверку, т.к. люди кладут свои компоненты в качестве списка, и просто определяют метод getColumns
         if (list.getColumns) {
            listConfig.columns = list.getColumns();
         }
   
         /* Когда нет записей в списке автодополнения,
          должен открываться справочник без фильтра, чтобы отобразились все записи */
         if ((!list.getItems() || !list.getItems().getCount()) && this._options.searchParam) {
            delete listConfig.filter[this._options.searchParam];
         }
   
         if (!showAllConfig.componentOptions) {
            showAllConfig.componentOptions = {};
         }
         if (!showAllConfig.dialogOptions) {
            showAllConfig.dialogOptions = {};
         }

         showAllConfig.componentOptions.listConfig = listConfig;
         showAllConfig.dialogOptions.className = 'ws-float-area__block-layout';

         this.hidePicker();
         this.showSelector(showAllConfig);
      },
      
      _updateList: function() {
         var list = this.getList();
         if(list.hasChildControlByName('showAllButton')) {
            var items = list.getItems(),
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
               if(button.getEventHandlers('onActivated').indexOf(this._showAllButtonHandler) === -1) {
                  this.subscribeTo(button, 'onActivated', this._showAllButtonHandler);
               }
               /* Чтобы кнопка не принимала фокус по табу, иначе клик enter'a, когда автодополнение открыто,
                будет вызывать открытие справочника, а не выбор записи */
               button.setTabindex(0);
               button.show();
            } else {
               this.unsubscribeFrom(button, 'onActivated', this._showAllButtonHandler);
               button.hide();
            }
         }
         return true;
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
            //https://online.sbis.ru/opendoc.html?guid=f32e80af-8f8f-4377-b86f-38e4e6c11fc2
            var pickerContainer = this._picker.getContainer()[0];
            var scrollTop = pickerContainer.scrollTop;
            this._updateList();
            this._picker.getContainer().height('auto');
            this._picker.recalcPosition(true, true);
            pickerContainer.scrollTop = scrollTop;
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
         return find(this._options.observableControls, function(ctrl) {
            return ctrl.isActive();
         }, this, false);
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
         /* Заглушка, picker автодополнения не должен вызывать расчёты авторазмеров, т.к. создаётся абсолютом в body */
         this._picker._notifyOnSizeChanged = function() {};
      },

      showPicker: function () {
         /* Проверяем, что пикер не отображается,
            т.к. такой проверки на отображение в попапе нет (скорее всего по причине перерасчёта z-index'ов),
            а если позвать show при открытом пикере, то там произойдёт перерасчёт скрола, и становится невозможно выбрать запись. */
         if (this._options.usePicker && !this.isPickerVisible() && this.isEnabled()) { // Не отображаем автодополнение в задизейбленом состоянии
            PickerMixin.showPicker.apply(this, arguments);
         }
      },

      _reverseList: function(reverse) {
         if(this._listReversed === reverse) {
            return;
         }
         
         var list = this._list;
         this._listReversed = reverse;

         if(list && list.setItemsSortMethod) {
            if(reverse) {
               /* Не надо устанавливать сортировку если он уже установлена, т.к.
                  1) Повторное перестроение вызывает лишние перестроения
                  2) Может быть установлена прикладная сортировка, её ломать нельзя */
               if(!list.getProperty('itemsSortMethod')) {
                  list.setItemsSortMethod(function (a, b) { return b.collectionIndex - a.collectionIndex; });
               }
            } else{
               list.setItemsSortMethod(null);
            }
         }
      }
   };

   return SuggestMixin;
});
