/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 15:19
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FilterButton', ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.FilterFloatArea', 'html!SBIS3.CORE.FilterButton', 'css!SBIS3.CORE.FilterButton'], function( Control, FilterFloatArea, dotTplFn ) {

   'use strict';

   $ws._const.FilterButton = {
      defaultText: 'Нужно отобрать?',        //Текст, который в начале отображается на кнопке
      buttonsWidth: 46                       //Дополнительная ширина, требуемая на кнопку показа всплывающей панели и на кнопку очистки фильтра
   };

   /**
    * Некий эксперементальный класс, который позволяет решать проблему ожидания нескольких деферредов установки шаблона
    */
   var ContinuousDeferred = $ws.core.extend({}, {
      $protected: {
         _totalSteps: 0,
         _finishedSteps: 0,
         _callbacks: []
      },
      /**
       * Добавляет деферред к списку ожидаемых
       * @param {$ws.proto.Deferred} deferred Деферред, которого нужно дождаться перед выполнением колбеков
       */
      push: function(deferred){
         ++this._totalSteps;
         deferred.addBoth(this._checkCount.bind(this));
      },
      /**
       * Проверяет, выполнены ли все деферреды. Если да, то выполняет все колбеки
       * @param {*} res Какой-то результат выполнения деферреда. Мы не хотим, чтобы он потерялся
       * @returns {*}
       */
      _checkCount: function(res){
         if(++this._finishedSteps === this._totalSteps){
            for(var i = 0; i < this._callbacks.length; ++i){
               this._callbacks[i].callback();
            }
            this._callbacks = [];
         }
         return res;
      },
      /**
       * Переданный деферред стрельнёт колбеком тогда, когда все ожидаемые деферреды будут готовы
       * @param {$ws.proto.Deferred} deferred Деферред, который должен подождать остальных
       */
      wait: function(deferred){
         if(this._totalSteps !== this._finishedSteps){
            this._callbacks.push(deferred);
         }
         else{
            deferred.callback();
         }
      }
   }),
       DEFAULT_TEXT_WIDTH = 102,
       ARROW_WIDTH = 16;

   $ws.single.DependencyResolver.register('SBIS3.CORE.FilterButton', function(config){
      var deps = {};

      if(config){
         if(config.showHistory) {
            deps['js!SBIS3.CORE.RequestHistoryPlugin'] = 1;
         }
      }

      return Object.keys(deps);
   });

   /**
    * Кнопка фильтров.
    *
    * Общий порядок срабатывания при нажатии на кнопку "Отобрать":
    * 1) Кнопка сигналит "onActivated";
    * 2) Кнопка фильтров дожидается всех значений контролов (поле связи, к примеру);
    * 3) Дожидается деферредов singleFilterItem;
    * 4) Сигналит onChange;
    * 5) Дожидается деферредов filterLine;
    * 6) Вызывается setQuery у браузера.
    *
    * @class $ws.proto.FilterButton
    * @extends $ws.proto.Control
    * @control
    * @designTime actions /design/design
    * @category Decorate
    */

   $ws.proto.FilterButton = Control.Control.extend(/** @lends $ws.proto.FilterButton.prototype */{
      /**
       * @event onChange При смене фильтра
       * Событие срабатывает при смене фильтра.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} filter Новый фильтр.
       * @param {Object} stringFilter Фильтр со строковыми значениями контролов.
       * @return Если вернуть объект, то будет считаться новым фильтром.
       * @example
       * В зависимости от состояния чекбокса скроем или покажем всплывающую панель:
       * <pre>
       *     checkbox.subscribe('onChange', function (eventObject, checked) {
       *        $ws.single.ControlStorage.waitWithParentName(filterButton).addCallback(function(linkedControl){
       *           if (checked) {
       *              linkedControl.showFloatArea();
       *           } else {
       *              linkedControl.hideFloatArea();
       *           }
       *           return linkedControl;
       *        });
       *     });
       * </pre>
       */
      /**
       * @event onBeforeShow Перед показом панели
       * Событие срабатывает перед показом панели с фильтром.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *     filterButton.subscribe('onBeforeShow', function (eventObject) {
       *        //Получаем фильтр связанного представления
       *        var filter = this.getBrowser().getQuery();
       *        if (filter && filter['Группа'] === 'Семья') {
       *           //Установим значение связанному хлебному фильтру
       *           this.getPathFilter().setFilter('Группа', 'Семья');
       *        } else {
       *           //Иначе на всплывающей панели найдем строку ввода и скроем ее
       *           this.getFloatArea().getChildControlByName('Абонент').hide();
       *        }
       *     });
       * </pre>
       */
      /**
       * @event onRestoreFilter Перед восстановлением значений контролов
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} map Объект с "имя контрола" => "значение".
       * @return Если вернуть объект, то значения контролов восстанавливаются, исходя из указанного хэш-мэп.
       * @example
       * <pre>
       *     filterButton.subscribe('onRestoreFilter', function(event, map){
       *        //Если отображаем все группы абонентов, то показываем только активных
       *        if (map.dropDown === 'Все группы') {
       *           map['Статус'] = 'Активные';
       *        }
       *     });
       * </pre>
       */
      /**
       * @event onDrawLine Перед показом строки
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|jQuery} text Текст к линии.
       * @param {Boolean} isEmpty Пустой ли фильтр.
       * @return Если вернуть Boolean, то крестик будет показан в связи с этим значением.
       * @example
       * Скрыть надпись "Нужно отобрать", если этот текст не менялся:
       * <pre>
       *     filterButton.subscribe('onDrawLine', function (event, text) {
       *        var textContainer = this.getContainer ().find ('.ws-filter-button-text');
       *        if (text == "Нужно отобрать?")
       *        {
       *           textContainer.hide();
       *        }
       *        else
       *        {
       *           textContainer.show();
       *        }
       *     });
       * </pre>
       * @see filterLine
       */
      /**
       * @event onResetFilter При очистке фильтра
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {boolean} true - нажали на крестик. Другое значение - строку "Очистить фильтр"
       * @return Если вернуть Boolean, то крестик будет показан в связи с этим значением.
       * @example
       * <pre>
       *     filterButton.subscribe('onResetFilter', function(){
       *        var abonent = someArea.getChildControlByName('Абонент');
       *        //При сбросе фильтра, установим абоненту, расположенному на некой абстрактной области, значение по умолчанию
       *        abonent.setValue(abonent.getDefaultValue());
       *     });
       * </pre>
       * @see resetFilter
       */
      /**
       * @event onSetQuery При отправке запроса браузеру
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} filter Фильтр, который будет установлен в браузер.
       * @return Если вернуть false, то ничего выполнено не будет.
       * @example
       * <pre>
       *     filterButton.subscribe('onSetQuery', function(event, filter){
       *        if (!filter.hasOwnProperty('Статус')) {
       *           //Если не указан статус абонентов, то отбираем только активных
       *           filter['Статус'] = 'Активные';
       *        }
       *     });
       * </pre>
       */
      /**
       * @event onControlsReady Событие при готовности контролов панели фильтров
       * Можно вернуть в результате {$ws.proto.Deferred}, по коллбэку которого будет построена строка отображения фильтра
       * @param {Object} eventObject Объект события
       */
      $protected: {
         _options: {
             /**
              * @cfg {String} Имя шаблона для всплывающей панели
              * <wiTag group="Данные">
              * В данной опции задаётся имя шаблона для всплывающей панели, открываемой нажатием на кнопку фильтров.
              * Имена контролов, предназначенных для выбора значений фильтра, должны совпадать с именами параметров
              * фильтрации связанного представления данных.
              * @editor ExternalComponentChooser
              * @see setTemplate
              * @see getTemplateName
              * @se getFloatArea
              */
            template: '',
            /**
             * @cfg {String} Имя связанного представления данных
             * <wiTag group="Данные">
             * Передаётся в виде "ИмяКомпонентаСПредставлениемДанных/ИмяПредставленияДанных", если представление данных
             * находится не в том же компоненте, что и кнопка фильтров. Если же оба контрола в одном компоненте, то в
             * виде "/ИмяПредставленияДанных".
             * 
             * В качестве связанного представления данных могут выступать следующие контролы:
             * <ol>
             *    <li><a href='http://wi.sbis.ru/demo/TreeView'>дерево</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/TableView'>табличное представление</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/HierarchyView'>иерархическое представление</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/CustomView'>произвольное представление</a>.</li>
             * </ol>
             * @example
             * <pre>
             *     <option name="browserId">js!SBIS3.DemoCode.ИмяКомпонентаСПредставлениемДанных/имяПредставленияДанных</option>
             * </pre>    
             * @see setLinkedView
             * @see getBrowser
             * @editor InternalBrowserChooser
             */
            browserId: undefined,
             /**
              * @cfg {string} Имя связанного хлебного фильтра              
              * <wiTag group="Данные">             
              * Данная опция не является обязательной. Панель с фильтром может работать самостоятельно.
              * Хлебный фильтр не может самостоятельно привязаться к представлению данных - панель с фильтром служит
              * контролом-посредником. В случае наличия одинаковых фильтров выбор параметра фильтрации, сделанный через
              * панель с фильтром, отразится только в хлебном фильтре.
              * @see setLinkedPathFilter
              * @see getLinkedPathFilter
              * @editor InternalComponentChooser
              */
            pathFilterId : undefined,
             /**
              * @cfg {Function} Функция рендеринга компонента фильтра
              * <wiTag group="Данные">
              * Опция служит для формирования строки около кнопки, например, для замены стандартной фразы "Нужно отобрать?"
              * Обработчик получает следующие аргументы:
              * <ol>
              *    <li>name - имя контрола и поле в объекте фильтра;</li>
              *    <li>value - значение контрола;</li>
              *    <li>defaultValue - значение контрола по умолчанию;</li>
              *    <li>stringValue - строковое значение контрола, оно же - getStringValue().</li>
              * </ol>
              * Можно вернуть значение тут же. Но если же требуется сделать асинхронный запрос, то можно вернуть $ws.proto.Deferred.
              * Обработчик выполняется в контексте панели с фильтром, и может возвращать jQuery-объекты.
              * @example
              * Изменение формата вывода конкретной даты:
              * <pre>
              *    function(name, value){
              *       return value.getFullYear();
              *    }
              * </pre>
              * Изменение формата вывода с использованием $ws.proto.Deferred:
              * <pre>
              *    function(name, value){
              *       var res = new $ws.proto.Deferred();
              *       (new $ws.proto.BLObject(...)).call(....).addCallback(function(record){
              *          res.callback(record.get(...));
              *       });
              *       return res;
              *    }
              * </pre>
              * @see filterLine
              */
            singleFilterItem: undefined,
             /**
              * @cfg {Function} Функция рендеринга строки фильтров
              * <wiTag group="Данные">
              * Строка фильтров собирается из параметров фильтрации вместо начальной стандартной фразы "Нужно отобрать?"
              * Опция подходит для ручной обработки всей строки.
              * Принимает два параметра:
              * <ol>
              *    <li>filter - это хэш-мэп ключ:значение, в котором ключи - это имена фильтров, а значения -  это значения
              *    параметров фильтрации;</li>
              *    <li>stringFilter - это объект вида ключ:значение, в котором ключами являются имена параметров фильтрации,
              *    а значениями их строковые представления в строке визуализации кнопки фильтров.</li>
              * </ol>
              * Аналогично {@link singleFilterItem} может возвращать $ws.proto.Deferred.
              * Обработчик выполняется в контексте панели с фильтром, и может возвращать jQuery-объекты.
              * В данном обработчике поддерживается возможность изменения всплывающей подсказки для строки фильтрации в случае если
              * возвращается не jQuery-объект, для этого необходимо вернуть объект следующего вида:
              * <pre>
              *    {
              *       visual: 'Отображение для строки фильтрации',
              *       title: 'Всплывающая подсказка'
              *    }
              * </pre>
              * @example
              * Функция рендеринга с изменением стандартной фразы "Нужно отобрать?" на "Работающие":
              * <pre>
              *     onRenderCadresFilter : function (filter, stringFilter){
              *        return 'Работающие';
              *     },
              * </pre>
              * @see singleFilterItem
              */
            filterLine: undefined,
             /**
              * @cfg {Boolean} Нужно ли посылать значения по умолчанию
              * <wiTag group="Данные">
              * Опция задаёт необходимость отправки на бизнес-логику значений полей по умолчанию.
              * В фильтр НЕ попадают те значения, которые выбраны в качестве начальных. К примеру, может использоваться
              * для выпадающего списка, если есть значение по умолчанию "Все".
              * По умолчанию дефолтные значения не уходят на БЛ.
              * Значение по умолчанию, которое должно попадать в фильтр, следует добавлять обработчиком.
              * Возможные значения:
              * <ol>
              *    <li>true - установить значение по умолчанию;</li>
              *    <li>false - не устанавливать.</li>
              * </ol>
              * @see template
              */
            sendDefault: false,
            cssClass: "ws-filter-button clearfix",
            /**
             * @cfg {String} ограничить контекст для панели фильтров
             * <wiTag group="Управление">
             * Возможность установить для контекста данной области ограничения.
             * Работа только с текущим контекстом, игнорируется previousContext
             * Если значение set, то запись происходит только в текущий контекст, чтение не ограничено
             * Если значение setget, то запись происходит только в текущий контекст, чтение только из текущего контекста
             * @see context
             */
            contextRestriction: ''
         },
         _button: undefined,
         _text: undefined,
         _arrow: undefined,
         _filterLine: undefined,
         _floatAreaDeferred: undefined,
         _floatAreaReady: undefined,
         _floatArea: undefined,
         _clearButton: undefined,
         _handlerArea: undefined,
         _filter: {},
         _defaultValues: {},
         _filterChangeHandler: undefined,
         _destroyHandler: undefined,
         _browser: undefined,
         _pathFilter: undefined,
         _areaContext: undefined,
         _filterSetted: false,
         _controlChangedValues: 0,
         _changedControlsMap: {},
         _filterPath: {},
         _nonValidatedControls: 0,
         _buttonApply: undefined,
         _buttonClear: undefined,
         _filterView: undefined,
         _hadBeenFloatAreaShown: false,
         _clearFromCrossButton: false,
         _keysWeHandle: [
            $ws._const.key.space,
            $ws._const.key.enter
         ]
      },
      $constructor: function(){
         this._initFloatAreaDeferred();
         this._configChecking();
         this._publishEvents();
         this._createContainer();
         this._initEvents();
         this._declareCommands();
         this._initFilterChangeHandler();

         this._initLinkedControl(this._options.browserId, 'browser');
         this._initLinkedControl(this._options.pathFilterId, 'pathFilter');
      },
      destroy: function(){
         this.setLinkedView(null);
         this.setLinkedPathFilter(null);

         if (this._floatArea) {
            var area = this._floatArea;
            this._floatArea = null;
            area.destroy();
         }

         $ws.proto.FilterButton.superclass.destroy.apply(this, arguments);
      },

      /**
       * Создаёт деферред готовности внутреннего шаблона всплывающей панели
       */
      _initFloatAreaDeferred: function(){
         this._floatAreaReady = new ContinuousDeferred();
      },
      /**
       * Проверяет пришедшие настройкии на корректность
       * @private
       */
      _configChecking: function(){
         if(this._options.singleFilterItem && typeof this._options.singleFilterItem !== 'function'){
            $ws.single.ioc.resolve('ILogger').error("FilterButton", "Incorrect _options.singleFilterItem");
         }
         if(this._options.filterLine && typeof this._options.filterLine !== 'function'){
            $ws.single.ioc.resolve('ILogger').error("FilterButton", "Incorrect _options.filterLine");
         }
      },
      /**
       * Публикует события
       * @private
       */
      _publishEvents: function(){
         this._publish('onBeforeShow', "onRestoreFilter", "onDrawLine", "onResetFilter", "onSetQuery", 'onControlsReady');
      },
       /**
        * Функция создания контейнера
        */
      _dotTplFn: dotTplFn,
       /**
        * Инициализирует связанные с контейнером переменные
        * @private
        */
      _createContainer: function(){
         this._button = this._container.find('.ws-filter-button-block');
         this._text = this._container.find('.ws-filter-button-text');
         this._arrow = this._container.find('.ws-FilterButton__arrow');
         this._filterLine = this._container.find('.ws-FilterButton__filterLine');
         this._clearButton = this._container.find('.ws-filter-button-clear');
         this._handlerArea = this._container.find('.ws-filter-button-handler-area');
      },
      /**
       * Инциализирует события на блоках
       * @private
       */
      _initEvents: function(){
         var self = this;

         this._button.bind('click', this.toggleFloatArea.bind(this));
         this._text.bind('click', this.toggleFloatArea.bind(this));
         this._filterLine.bind({
            'mouseenter': function() {
               $(this).addClass('action-hover');

               //TODO: убрать, когда нормально заработает action-hover на контейнере
               self._arrow.removeClass('icon-primary').addClass('icon-hover');
            },
            'mouseleave': function() {
               $(this).removeClass('action-hover');

               //TODO: убрать, когда нормально заработает action-hover на контейнере
               self._arrow.removeClass('icon-hover').addClass('icon-primary');
            }
         });
         this._clearButton.bind('click', this.resetFilter.bind(this));
      },
      /**
       * Публикует команды
       * @private
       */
      _declareCommands: function(){
         $ws.single.CommandDispatcher.declareCommand(this, 'show', this.showFloatArea);
         $ws.single.CommandDispatcher.declareCommand(this, 'hide', this.hideFloatArea);
         $ws.single.CommandDispatcher.declareCommand(this, 'toggle', this.toggleFloatArea);
         $ws.single.CommandDispatcher.declareCommand(this, 'resetFilter', this.resetFilter);
         $ws.single.CommandDispatcher.declareCommand(this, 'applyFilter', this.applyFilter);
      },
      /**
       * Подготовка обработчикк смены фильтра браузера
       * @private
       */
      _initFilterChangeHandler: function(){
         var self = this;
         this._filterChangeHandlerBrowser = function(event, filter){
            self._changeFilter($ws.core.merge({}, filter));
            self._setPathFilter(filter);
         };
         this._filterChangeHandlerPathFilter = function(event, filter){
            var tmpFilter = $ws.core.merge(self._filter, filter);
            self._filterPath = filter;
            self._changeFilter(tmpFilter);
            self._setQuery(tmpFilter);
         };
         this._destroyHandler = function(){
            self._clearBrowser();
         };
         this._onConvertHandler = function(event, newView){
            self.setLinkedView(newView);
         };
      },
      _setPathFilter: function(filter, noSave){
         if (this._pathFilter){
            this._pathFilter.setQuery( (Object.isEmpty(this._filter) || noSave) ?
                                        $ws.core.merge({}, filter) :
                                        $ws.core.merge(this._pathFilter.getQuery(), this._filter),
                                        true, noSave);
         }
      },

      _initLinkedControl: function(controlName, linkedControlType) {

         var self = this,
             name = controlName;

         if (name) {

            if (name.indexOf('/') > -1) {
               name = name.split('/')[1];
            }

            this.getTopParent().waitChildControlByName(name).addCallback(function(linkedControl){

               if (!self._isDestroyed) {
                  if (linkedControlType === 'browser'){
                     self.setLinkedView(linkedControl);
                  }
                  else if (linkedControlType === 'pathFilter'){
                     self._text.html('');
                     self.setLinkedPathFilter(linkedControl);
                  }
               }

               return linkedControl;

            });
         }

      },
      /**
       * Запоминает и применяет указанный фильтр
       * @param {Object} filter Фильтр
       * @private
       */
      _setFilter: function(filter){
         var self = this;
         if(!this._filterSetted){
            this._filter = filter;
            if(!this._floatAreaDeferred){
               this._createFloatArea();
            }
            this._floatAreaReady.wait(new $ws.proto.Deferred().addCallback(function(){
               self._setControlsValues(filter);
               (function(){
                  var controlsReadyResult = self._notify('onControlsReady');
                  if(controlsReadyResult instanceof $ws.proto.Deferred){
                     return controlsReadyResult;
                  } else {
                     return new $ws.proto.Deferred().callback();
                  }
               })().addCallback(function(){
                  var stringFilter = {},
                     nonCleanableFilter = {};
                  filter = filter || {};
                  self._getFilters(filter, stringFilter, nonCleanableFilter).addCallback(function(){
                     self._applyFilter(filter, stringFilter, nonCleanableFilter);
                  });
               });
            }));
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить текущий фильтр.
       * Работает только, если нет связанного браузера. Если вам необходим этот метод для связанного браузера, то
       * используйте {@link $ws.proto.TableView#setQuery setQuery}на браузере.
       * @param {Object} filter Фильтр, который должна отображать кнопка фильтров.
       * @see getBrowser
       * @see getPathFilter
       * @see getFloatArea
       */
      setFilter: function(filter){
         if(this._browser){
            $ws.single.ioc.resolve('ILogger').error('FilterButton', "Incorrect setFilter: use browser's .setQuery instead");
         }
         else{
            this._setFilter(filter);
         }
      },
      /**
       * Обработчик смены фильтра
       * @param {Object} filter Новый фильтр
       * @private
       */
      _changeFilter: function(filter){
         if(!this._filterSetted){
            this._setFilter(filter);
         }
         else{
            this._filterSetted = false;
         }
      },
      /**
       * Создает контекст для области фильтров
       * @return {$ws.proto.Context}
       * @protected
       */
      _createAreaContext: function() {
         return new $ws.proto.Context({restriction: this._options.contextRestriction});
      },
      /**
       * Создаёт всплывающую панель
       * @private
       */
      _createFloatArea: function(){
         var self = this;
         this._areaContext = this._createAreaContext();
         if (this._browser) {
            this._areaContext.setPrevious(this._browser.getLinkedContext());
         }
         // TODO Убрать в 3.7 работу с Deferred
         this._floatAreaDeferred = new $ws.proto.Deferred();
         this._floatAreaReady.push(this._floatAreaDeferred);
         new FilterFloatArea({
            autoWidth: true,
            autoHeight: true,
            name: this.getName() + '-area',
            template: 'filterButton',
            target: this._container,
            side: 'right',
            opener : this,
            parent: null,
            filterArea: true,
            context: this._areaContext,
            autoShow: false,
            handlers: {
               onReady: function(){
                  //TODO: добавить тут удаление области, если кнопка удалена. Но аккуратно добавить, чтоб оно после onReady не глючило..
                  if (!self._isDestroyed) {
                     var deferred = new $ws.proto.Deferred();
                     self._floatArea = this;
                     self._initButtons();
                     self._floatAreaReady.push(deferred);
                     this.getChildControlByName('filtersTemplate')
                         .setTemplate(self._options.template)
                         .addCallback(self._initTemplatedArea.bind(self))
                         .addCallback(deferred.callback.bind(deferred));
                  }
               },
               onBeforeShow: function(){
                  if (!self._isDestroyed) {
                     if (self._floatAreaDeferred && self._floatAreaDeferred.isReady()) {
                        self._hadBeenFloatAreaShown = true;
                        self._notify('onBeforeShow');
                     }
                  }
               },
               onDestroy: function(){
                  self._floatArea = undefined;
                  self._floatAreaDeferred = undefined;
               }
            }
         });
      },
      /**
       * Если нет всплывающей панели, создаёт её, иначе дожидается её и использует
       * @param {String} callback Функция, которая должна быть вызвана, если всплывающая панель есть
       * @private
       */
      _useFloatArea: function(callback){
         var self = this;
         if(!this._floatAreaDeferred){
            this._createFloatArea();
         }
         this._floatAreaDeferred.addCallback(function(floatArea){
            if(self._filter){
               self._setControlsValues(self._filter, self._clearFromCrossButton);
            }
            floatArea[callback]();
            return floatArea;
         });
      },
      /**
       * <wiTag group="Управление">
       * Показать всплывающую панель.
       * @command show
       * @example
       * В зависимости от состояния чекбокса скроем или покажем всплывающую панель:
       * <pre>
       *     checkbox.subscribe('onChange', function (eventObject, checked) {
       *        $ws.single.ControlStorage.waitWithParentName(filterButton).addCallback(function(linkedControl){
       *           if (checked) {
       *              //покажем панель
       *              linkedControl.showFloatArea();
       *           } else {
       *              linkedControl.hideFloatArea();
       *           }
       *           return linkedControl;
       *        };
       *     });
       * </pre>
       * @see hideFloatArea
       * @see toggleFloatArea
       */
      showFloatArea: function(){
         if (this.isEnabled()) {
            this._useFloatArea('show');
            return true;
         }
         return false;
      },
      /**
       * <wiTag group="Управление">
       * Скрыть всплывающую панель.
       * @command hide
       * @example
       * В зависимости от состояния чекбокса скроем или покажем всплывающую панель:
       * <pre>
       *     checkbox.subscribe('onChange', function (eventObject, checked) {
       *        $ws.single.ControlStorage.waitWithParentName(filterButton).addCallback(function(linkedControl){
       *           if (checked) {
       *              linkedControl.showFloatArea();
       *           } else {
       *              //скроем панель
       *              linkedControl.hideFloatArea();
       *           }
       *           return linkedControl;
       *        });
       *     });
       * </pre>
       * @see showFloatArea
       * @see toggleFloatArea
       */
      hideFloatArea: function(){
         if(this._floatAreaDeferred){
            this._floatAreaDeferred.addCallback(function(floatArea){
               floatArea.hide();
               return floatArea;
            });
         }
         return true;
      },
      /**
       * <wiTag group="Управление">
       * Показать/скрыть всплывающую панель.
       * @command toggle
       * @example
       * По клику на кнопку скрыть/показать всплывающую панель:
       * <pre>
       *     btn.subscribe('onActivated', function (eventObject) {
       *        $ws.single.ControlStorage.waitWithParentName(filterButton).addCallback(function(linkedControl){
       *           //скроем/покажем всплывающую панель
       *           linkedControl.toggleFloatArea();
       *           return linkedControl;
       *        };
       *     });
       * </pre>
       * @see showFloatArea
       * @see hideFloatArea
       */
      toggleFloatArea: function(){
         if (this.isEnabled()) {
            this._useFloatArea('toggle');
            return true;
         }
         return false;
      },
      _setEnabled: function(enabled){
         $ws.proto.FilterButton.superclass._setEnabled.apply(this, arguments);
         if (!enabled) {
            this.hideFloatArea();
         }
      },
      /**
       * Инициализирует контролы. Подписывается на onChange для смены статуса кнопок "очистить" и "отобрать"
       * Выполняется всегда после готовности всплывающей панели
       * @private
       */
      _initControls: function(){
         var controls = this._floatArea.getChildControls();
         for(var i = 0; i < controls.length; ++i){
            this._initControl(controls[i]);
         }
      },
      _initControl: function(control){
         var self = this;
         if(this._filterControl(control)){
            if (control.hasEvent('onAddNewControl')) {
               control.subscribe('onAddNewControl', function(event, fl){
                  self._initControl(fl);
               });
            }
            control.subscribe('onChange', function(event){
               self._controlValueChange(this);
            });
            if(control.hasEvent('onValidate')){
               control.subscribe('onValidate', function(event, validationResult, errors, previous){
                  self._controlValidationChange(this, validationResult, previous);
               });
            }
         }
      },
      /**
       * Возвращает дефолтное значение контрола
       * @param {$ws.proto.Control} control Контрол, у которого необходимо возвращать дефолтное значение
       * @param {String} name Имя этого контрола
       * @return {*}
       * @private
       */
      _controlDefaultValue: function(control, name){
         return control.getDefaultValue ? control.getDefaultValue() : this._defaultValues[name];
      },
      /**
       * Обрабатывает смену значения у контрола
       * @param {$ws.proto.Control} control Контрол, у которого сменилось значение
       * @private
       */
      _controlValueChange: function(control){
         var name = control.getName();
         if(this._isValueEqual(this._controlDefaultValue(control, name), control.getValue())){
            if(this._changedControlsMap[name]){
               this._changedControlsMap[name] = false;
               if(--this._controlChangedValues === 0){
                  this._toggleButtonsState();
               }
            }
         }
         else if(!this._changedControlsMap[name]){
            this._changedControlsMap[name] = true;
            if(++this._controlChangedValues === 1){
               this._toggleButtonsState();
            }
         }
      },
      /**
       * Меняет состояние кнопки "Отобрать"
       * @private
       */
      _toggleApplyButton: function(){
         this._buttonApply.setEnabled(this._nonValidatedControls === 0);
      },
      /**
       * Меняет состояние кнопки "очистить
       * @param {Boolean} enabled Включать ли кнопку
       * @private
       */
      _toggleClearButton: function(enabled){
         this._buttonClear.setEnabled(enabled);
      },
      /**
       * Меняет состояние кнопок "Отобрать" и "Очистить"
       * @private
       */
      _toggleButtonsState: function(){
         this._toggleApplyButton();
         this._toggleClearButton(!!this._controlChangedValues);
      },
      /**
       * Обрабатывает смену состояния валидации у контрола
       * @param {$ws.proto.DataBoundControl} control Контрол, у которого произошла валидация
       * @param {Boolean} validationResult Результат валидации
       * @param {Boolean} previousValidation Результат предыдущей валидации
       * @private
       */
      _controlValidationChange: function(control, validationResult, previousValidation){
         if(validationResult !== previousValidation){
            if (!(validationResult && this._nonValidatedControls === 0)) {
               if (validationResult) {
                  --this._nonValidatedControls;
               } else {
                  ++this._nonValidatedControls;
               }
            }
            this._toggleApplyButton();
         }
      },
      /**
       * Инициализирует кнопки "Отобрать" и "Очистить"
       * @protected
       */
      _initButtons: function(){
         this._buttonApply = this._floatArea.getChildControlByName('applyFilter');
         this._buttonClear = this._floatArea.getChildControlByName('resetFilter');

         this._buttonApply.subscribe('onActivated', this._applyFilterAndClose.bind(this));
         this._buttonClear.subscribe('onActivated', this._clearControlsValues.bind(this));
      },
      /**
       * Собирает дефолтные значения контролов
       * Выполняется всегда после готовности всплывающей панели
       * @protected
       */
      _initTemplatedArea: function(){
         var self = this;
         if(!this._floatArea){
            return;
         }
         this._getFilter(true).addCallback(function(values){
            self._defaultValues = values;
            self._initControls();
            self._floatAreaDeferred.callback(self._floatArea);
            if(self._floatArea.isOpened()){
               self._notify('onBeforeShow');
            }
         });
      },
      /**
       * Меняет значение на контролах
       * Меняет фильтр так, что в нём остаются только те значения, что есть во всплывающей панели
       * Выполняется всегда после готовности всплывающей панели
       * @param {Object} filter Объект вида "имя контрола" -> "значение контрола"
       * @param {Boolean} [ignoreDisabled] Нужно ли игнорировать выключенные поля
       * @private
       */
      _setControlsValues: function(filter, ignoreDisabled, fromReset){
         var controls = this._floatArea.getChildControls(),
            curValFV,
            isClear = true,
            map = {},
            control,
            name,
            value,
            defaultValue,
            i, len,
            fromName, toName,
            isSubControl,
            setValue;
         this._changedControlsMap = {};
         this._controlChangedValues = 0;
         //Собираем значения
         for(i = 0, len = controls.length; i < len; ++i){
            control = controls[i];
            if(this._filterControl(control, true) && (control.isEnabled() || !ignoreDisabled)){
               value = defaultValue = undefined;
               name = control.getName();
               isSubControl = control.isSubControl();
               if(isSubControl){
                  if($ws.proto.FieldCheckbox && control instanceof $ws.proto.FieldCheckbox){
                     map[name] = control.getDefaultValue();
                  }
                  else if(!$ws.proto.FieldDate || !(control instanceof $ws.proto.FieldDate)){
                     map[name] = '';
                  }
               }
               else{
                  defaultValue = this._controlDefaultValue(control, name);
                  if($ws.proto.DateRange && control instanceof $ws.proto.DateRange){
                     fromName = control.getDateFromName();
                     toName = control.getDateToName();
                     if(filter[fromName] !== undefined || filter[toName] !== undefined){
                        value = [filter[fromName], filter[toName]];
                        if(typeof(value[0]) === 'string'){
                           value[0] = Date.fromSQL(value[0]);
                        }
                        if(typeof(value[1]) === 'string'){
                           value[1] = Date.fromSQL(value[1]);
                        }
                     }
                     else{
                        value = defaultValue;
                     }
                     map[fromName] = value[0];
                     map[toName] = value[1];
                  }
                  else if($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.GroupCheckBox') && !(filter[name] instanceof $ws.proto.Record) && filter[name] instanceof Object){
                     value = defaultValue.cloneRecord();
                     var object = filter[name];
                     for(var field in object){
                        if(object.hasOwnProperty(field) && value.hasColumn(field)){
                           value.set(field, object[field]);
                        }
                     }
                     map[name] = value;
                  }
                  else if($ws.proto.FieldRadio && control instanceof $ws.proto.FieldRadio && !(filter[name] instanceof $ws.proto.Enum) && typeof(filter[name]) === 'string'){
                     map[name] = value = defaultValue.clone();
                     value.set(filter[name]);
                  } else if($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FilterView')) {
                     this._filterView = control;
                     curValFV = control.getQuery() || {};
                     for (var j in curValFV) {
                        //Различные сравнения между набираемыми фильтрами, фильтрами кнопки и хлебного фильтра.
                        if (curValFV.hasOwnProperty(j) && ((filter[j] === curValFV[j]) && filter[j] !== undefined ||
                              (fromReset && this._filterPath[j] !== undefined && filter[j] !== this._filterPath[j] ))) {
                           isClear = false;
                           break;
                        }
                     }
                     if (isClear) {
                        control.dropFilters();
                     } else {
                        value = filter[name] !== undefined ? filter[name] : defaultValue;
                        $ws.core.merge(map, value);
                     }
                  } else{
                     value = filter[name] !== undefined ? filter[name] : defaultValue;
                     map[name] = value;
                  }
                  if(control.isEnabled() && !this._isValueEqual(value, defaultValue) || !isClear){
                     this._changedControlsMap[name] = true;
                     ++this._controlChangedValues;
                  }
               }
            }
         }
         var notifyResult = this._notify('onRestoreFilter', map);
         if(notifyResult && notifyResult instanceof Object){
            map = notifyResult;
         }
         //Ставим значения
         for(i = 0, len = controls.length; i < len; ++i){
            control = controls[i];
            if(this._filterControl(control, true) && (control.isEnabled() || !ignoreDisabled)){
               name = control.getName();
               setValue = false;
               if($ws.proto.DateRange && control instanceof $ws.proto.DateRange){
                  fromName = control.getDateFromName();
                  toName = control.getDateToName();
                  value = [map[fromName], map[toName]];
                  if(map[fromName] !== undefined && map[toName] !== undefined && !this._isValueEqual(value, control.getValue())){
                     setValue = true;
                  }
               }
               else if(name in map){
                  value = map[name];
                  if(value instanceof $ws.proto.Enum){
                     value = value.clone();
                  }
                  else if(value instanceof $ws.proto.Record){
                     value = value.cloneRecord();
                  }
                  //если у нас поле связи, то по несчастливому стечению обстоятельств значение еще могло не установиться, в это случае мы все равно сбросим значение и установимм заново
                  if(!this._isValueEqual(value, control.getValue()) || control.getValueDeferred && !control.getValueDeferred().isReady()){
                     if($ws.proto.FieldLink && control instanceof $ws.proto.FieldLink){
                        control.dropAllLinks(undefined, true);
                        if(control.getSelectedRecordDictionary() === undefined){
                           control.setCurrentDictionary(0);
                        }
                     }
                     setValue = true;
                  }
               }
               if(setValue){
                  // FIXME использование 2 и 3 параметра в setValue
                  control.setValue(value, undefined, true);
                  if(control.clearMark){
                     control.clearMark();
                  }
               }
            }
         }
         // Мы перед этим очистили валидацию на всех контролах
         this._nonValidatedControls = 0;
         this._toggleButtonsState();
      },
      /**
       * Очищает значение на контролах
       * Выполняется всегда после готовности всплывающей панели
       * @param {event||Boolean} fromReset - вызвали при нажатию на крестик, или из функции resetFilter. Если bool, то пробрасываем дальше
       * //Иначе это из нажатия на "Очистить фильтр"
       * @private
       */
      _clearControlsValues: function(fromReset){
         fromReset = typeof fromReset === 'boolean' ? fromReset :  undefined;
         this._setControlsValues({}, true, fromReset);
         this._notifyOnReset(fromReset);
      },
      /**
       * Извещает об очистке фильтра
       * @private
       */
      _notifyOnReset: function(fromReset){
         var result = this._notify('onResetFilter', fromReset);
         if(typeof(result) === 'boolean'){
            this._toggleClearButton(true);
         }
      },
      /**
       * Фильтрует контролы в области - отбираем только подходящие для получения фильтра
       * @param {$ws.proto.Control} control Контрол
       * @param {Boolean} [isSubControl] Нужно ли находить контролы с isSubControl() === true
       * @return {Boolean}
       * @private
       */
      _filterControl: function(control, isSubControl){
         return control && control.getName && control.getValue && control.setValue && !control.isDestroyed() &&
               (isSubControl && !($ws.proto.FieldCheckbox && control instanceof $ws.proto.FieldCheckbox) || !control.isSubControl());
      },
      /**
       * Собирает фильтр с контролов
       * Выполняется всегда после готовности всплывающей панели
       * @param {Boolean} isDefault Нужно ли брать значения по умолчанию, или текущие
       * @return {$ws.proto.Deferred}
       * @private
       */
      _getFilter: function(isDefault){
         var result = {},
            deferred = new $ws.proto.ParallelDeferred(),
            controls = this._floatArea.getChildControls(),
            getValue = function(control){
               if(!control.hasEvent('onInit')){
                  return;
               }
               var name = control.getName();
               if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FilterView')) {
                   result = $ws.core.merge(result, control.getValue());
               } else {
                  result[name] = (control.getDefaultValue && isDefault) ? control.getDefaultValue() : control.getValue();
               }
               if($ws.proto.DateRange && control instanceof $ws.proto.DateRange){
                  result[control.getDateFromName()] = control.getRangeStart();
                  result[control.getDateToName()] = control.getRangeEnd();
               }
            };
         for(var i = 0, len = controls.length; i < len; ++i){
            var control = controls[i];
            if(this._filterControl(control)){
               if(control.getValueDeferred){
                  deferred.push(control.getValueDeferred().addBoth(getValue.bind(undefined, control)));
               }
               else{
                  getValue(control);
               }
            }
         }
         return deferred.done().getResult().addCallback(function(){
            return result;
         });
      },
      /**
       * Нужно ли посылать дефолтное значение для указанного контрола
       */
      _isSendDefaultValue: function(control){
         return this._options.sendDefault && (
            ($ws.proto.FieldDate && control instanceof $ws.proto.FieldDate) ||
            ($ws.proto.DateRange && control instanceof $ws.proto.DateRange) ||
            ($ws.proto.FieldDropdown && control instanceof $ws.proto.FieldDropdown) ||
            ($ws.proto.FieldLink && control instanceof $ws.proto.FieldLink)
         );
      },
      /**
       * Текстовое значение группы флагов
       * @param {$ws.proto.GroupCheckBox} control Группа флагов
       * @param {$ws.proto.Record} defaultValue Значение по-умолчанию
       * @return {String}
       * @private
       */
      _getStringValueFromCheckboxGroup: function(control, defaultValue){
         var value = control.getValue();
         if(!value || !(value instanceof $ws.proto.Record)){
            return '';
         }
         var object = value.toObject(),
            defaults = defaultValue.toObject(),
            show = [],
            hide = [];
         for(var key in object){
            if(object.hasOwnProperty(key)){
               if(object[key] !== defaults[key]){
                  var caption = control.getFlagCaption(key);
                  if(object[key] && object[key] !== 'false'){
                     show.push(caption);
                  }
                  else{
                     hide.push(caption);
                  }
               }
            }
         }
         if(show.length || hide.length){
            return (show.length ? 'Показывать: ' + show.join(', ') : '') + (show.length && hide.length ? ', ' : '') + (hide.length ? 'Не показывать: ' + hide.join(', ') : '');
         }
         return '';
      },
      /**
       * Текстовое значение чекбокса
       * @param {$ws.proto.FieldCheckbox} control Чекбокс
       * @return {String}
       * @private
       */
      _getStringValueFromCheckbox: function(control){
         var value = control.getValue(),
            caption = control.getCaption();
         if(value){
            return caption;
         }
         return 'Не ' + caption.charAt(0).toLowerCase() + caption.substring(1);
      },
      /**
       * Текстовое значение переключателя
       * @param {$ws.proto.Switcher} control Переключатель
       * @return {String}
       * @private
       */
      _getStringValueFromSwitcher: function(control){
         var value = control.getValue();
         if(value){
            return control.getTextOn();
         }
         return control.getTextOff();
      },
      _getStringValueFromFilterView: function(control){
         return control.getTextValues();
      },
      /**
       * Получает два фильтра: со значениями и с текстом для каждого значения с учётом дефолтных значений и обработчиков.
       * Да, похоже на предыдущий метод. Нет, не придумал, как отрефакторить
       * Выполняется всегда после готовности всплывающей панели
       * @param {Object} filter Фильтр со значениями
       * @param {Object} stringFilter Фильтр с текстом
       * @param {Object} nonCleanableFilter Фильтр, который нельзя очистить пользователю
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _getFilters: function(filter, stringFilter, nonCleanableFilter){
         var controls = this._floatArea.getChildControls(),
            getValueDeferred = new $ws.proto.ParallelDeferred(),
            deferred = new $ws.proto.ParallelDeferred(),
            self = this,
            getControlValue = function(control, name){
               if(!control.hasEvent('onInit')){
                  return;
               }
               var value = control.getValue(),
                  isSubControl = control.isSubControl(),
                  stringValue,
                  defaultValue = self._controlDefaultValue(control, name);
               if((value !== undefined || ($ws.proto.DateRange && control instanceof $ws.proto.DateRange)) &&
                  (!self._isValueEqual(defaultValue, value) || self._isSendDefaultValue(control))){
                  if(!isSubControl){
                     if($ws.proto.FieldDate && control instanceof $ws.proto.FieldDate){
                        if(typeof value === 'string'){
                           value = Date.fromSQL(value);
                        }
                        stringValue = value ? $ws.render.defaultColumn.timestamp(value) : '';
                     }
                     else if( $ws.helpers.instanceOfModule(control, 'SBIS3.CORE.GroupCheckBox') ){
                        stringValue = self._getStringValueFromCheckboxGroup(control, defaultValue);
                     }
                     else if( $ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FieldCheckbox') ){
                        stringValue = self._getStringValueFromCheckbox(control);
                     }
                     else if( $ws.helpers.instanceOfModule(control, 'SBIS3.CORE.Switcher') ){
                        stringValue = self._getStringValueFromSwitcher(control);
                     }
                     else if( $ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FilterView') ){
                        stringValue = self._getStringValueFromFilterView(control);
                     }
                     else if(control.getStringValue){
                        stringValue = control.getStringValue();
                     }
                     else{
                        stringValue = value instanceof Array ? value.join(', ') : value;
                     }
                     if(self._options.singleFilterItem){
                        stringValue = self._options.singleFilterItem.apply(self, [name, value, defaultValue, stringValue]);
                        if(stringValue instanceof $ws.proto.Deferred){
                           (function(name, deferred){
                              deferred.addCallback(function(value){
                                 stringFilter[name] = value;
                              });
                           })(name, stringValue);
                           deferred.push(stringValue);
                        }
                     }
                     if(stringValue && !(stringValue instanceof $ws.proto.Deferred)){
                        stringFilter[name] = stringValue;
                     }
                  }
                  //                    ↓ для fielddate в диапозоне дат, значения кладём как обычно, stringvalue для них нет.
                  if(stringValue || (isSubControl && $ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FieldDate'))){
                     var object = (control.isEnabled() && !self._isValueEqual(defaultValue, value)) ? filter : nonCleanableFilter;
                     if($ws.proto.DateRange && control instanceof $ws.proto.DateRange){
                        object[control.getDateFromName()] = control.getRangeStart();
                        object[control.getDateToName()] = control.getRangeEnd();
                     }
                     else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FilterView')){
                        $ws.core.merge(object, value);
                     } else {
                        object[name] = value;
                     }
                  }
                  if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FilterView')) {
                     self._filterView = control;
                     if (self._hadBeenFloatAreaShown) {
                        control.forceRemoveEmptyFilters();
                     }
                  }
               }
            };
         for(var i = 0, len = controls.length; i < len; ++i){
            var control = controls[i];
            if(this._filterControl(control)){
               var name = control.getName();
               if(control.getValueDeferred){
                  getValueDeferred.push(control.getValueDeferred().addBoth(getControlValue.bind(undefined, control, name)));
               }
               else{
                  getControlValue(control, name);
               }
            }
         }
         getValueDeferred.done().getResult().addCallback(function(){
            deferred.done();
         });
         return deferred.getResult();
      },
      /**
       * Сравнивает два значения контрола, возвращает true, если они равны
       * @param {*} value0 Первое значение
       * @param {*} value1 Второе значение
       * @returns {Boolean}
       * @private
       */
      _isValueEqual: function(value0, value1){
         if(value0 instanceof Date && value1 instanceof Date){
            return value0.getTime() === value1.getTime();
         }
         if(typeof(value0) === 'string' && value1 instanceof Date){
            return this._isValueEqual(Date.fromSQL(value0), value1);
         }
         if(typeof(value1) === 'string' && value0 instanceof Date){
            return this._isValueEqual(value0, Date.fromSQL(value1));
         }
         //группа чекбоксов хранит значения в записи, а мы почему-то не умеели это понимать и сравнивать
         if ($ws.proto.Record && value0 instanceof $ws.proto.Record && value1 instanceof $ws.proto.Record){
            return value0.equals(value1);
         }
         if(value0 instanceof Array && value1 instanceof Array){
            if(value0.length !== value1.length){
               return false;
            }
            for(var i = 0; i < value0.length; ++i){
               if(!this._isValueEqual(value0[i], value1[i])){
                  return false;
               }
            }
            return true;
         }
         if(value0 instanceof Object && value0.equals){
            return value0.equals(value1);
         }
         return value0 == value1;
      },
      /**
       * Собирает строчку из строкового фильтра
       * @param {Object} filter Фильтр
       * @param {Object} stringFilter Фильтр
       * @returns {jQuery|String}
       * @private
       */
      _getTextFromFilter: function(filter, stringFilter){
         var result = '',
            children = false;
         if(!Object.isEmpty(stringFilter) && !Object.isEmpty(filter)){
            if(this._pathFilter) {
               this._filterPath = $ws.core.merge(this._filterPath, this._pathFilter.getQuery());
            }
            for(var i in stringFilter){
               if(stringFilter.hasOwnProperty(i) && stringFilter[i]){
                  if(!this._filterPath.hasOwnProperty(i) && (!filter.hasOwnProperty(i) || filter[i] !== undefined)){
                     if(children){
                        result.append('<span>, </span>');
                     }
                     else{
                        children = true;
                        result = $('<span></span>');
                     }
                     if(typeof(stringFilter[i]) === 'string'){
                        result.append('<span>' + $ws.helpers.escapeHtml(stringFilter[i]) + '</span>');
                     }
                     else{
                        result.append(stringFilter[i]);
                     }
                  }
               }
            }
         }
         return result;
      },
      /**
       * Обновляет текст на кнопке. Если текст есть, то показывает крестик, иначе просто пишет дефолтный текст
       * @param {jQuery|String} data Текст, который нужно отобразить на кнопке
       * @param {Boolean} isEmpty Пустой ли фильтр
       * @param {String} [tooltip] Всплывающая подсказка
       * @private
       */
      _setButtonText: function(data, isEmpty, tooltip){
         var result,
             title;

         if (typeof(data) === 'string') {
            //Удалим все html-теги, оставим только текст для подсказки
            title = data ? data.replace(/<\/?[^>]+>/g,'') : '';
         } else {
            title = data.text();
         }

         this._handlerArea.addClass('ws-hidden');

         if (!data) {
            //Для pf - не нужно отображать строку "Нужно отображать"
            data = this._pathFilter ? '' : $ws._const.FilterButton.defaultText;
            //Бывет, что из-за FDD считается не пустой фильтр. Очевидно, если data пришла пустая, то isEmpty = true
            isEmpty = true;
         }

         this._text.attr('title', tooltip || title).css('max-width', '').toggleClass('ws-hidden', !data);
         this._handlerArea.css('max-width', '');
         this._arrow.toggleClass('ws-hidden', isEmpty);

         result = this._notify('onDrawLine', data, isEmpty);

         if(typeof(result) === 'boolean'){
            isEmpty = !result;
         }

         this._clearButton.toggleClass('ws-hidden', isEmpty);
         this._container.toggleClass('ws-FilterButton__clearButton-visible', !isEmpty);
         if (this._options.maxWidth !== Number.POSITIVE_INFINITY) {
            this._setMaxWidth(this._text, isEmpty);
         }
         this._text.html(data);
      },
      /**
       * <wiTag group="Отображение">
       * Установить максимальную ширину на контейнер кнопки фильтров.
       * Актуально, если используется автоширина.
       * @param {number} maxWidth значение максимальной ширины.
       * @example
       * По готовности панели с фильтром установить ей максимальную ширину, равную ширине родителя
       * <pre>
       *     filterButton.subscribe('onReady', function (eventObject) {
       *        this.setMaxWidth(this.getParent().getContainer().width());
       *     });
       * </pre>
       */
      setMaxWidth: function(maxWidth) {
         if (this._options.autoWidth && maxWidth > $ws._const.FilterButton.buttonsWidth) {
            this._options.maxWidth = maxWidth;
            this._setMaxWidth(this._handlerArea.hasClass('ws-hidden') ? this._text : this._handlerArea);
         }
      },
      _setMaxWidth: function(container, isEmpty) {
         var width = this._options.maxWidth,
             maxWidth = this._options.autoWidth && width !== Number.POSITIVE_INFINITY ? width : this._container.width(),
             isDefaultLine = container.hasClass('ws-filter-button-text');

         maxWidth -= ($ws._const.FilterButton.buttonsWidth + (isDefaultLine && !this._arrow.hasClass('ws-hidden') ? ARROW_WIDTH : 0));

         if (isEmpty) {
            maxWidth = '';
         } else if (maxWidth <= 0) {
            maxWidth = DEFAULT_TEXT_WIDTH;
         }

         container.css('max-width', maxWidth);
      },
      _onResizeHandler: function() {
         var container = this._handlerArea.hasClass('ws-hidden') ? this._text : this._handlerArea,
             hasText = container.text();
         this._setMaxWidth(container, !hasText);
         $ws.proto.FilterButton.superclass._onResizeHandler.apply(this, arguments);
      },
      /**
       * Устанавливает на кнопку контейнер
       * @param {jQuery} container Новый контейнер
       * @param {Boolean} isEmpty Пустой ли фильтр
       * @private
       */
      _setButtonContainer: function(container, isEmpty){
         this._text.addClass('ws-hidden')
            .html('');
         this._arrow.addClass('ws-hidden');
         this._handlerArea.removeClass('ws-hidden')
            .html('')
            .append(container);
         this._setMaxWidth(this._handlerArea, isEmpty);
         this._clearButton.toggleClass('ws-hidden', isEmpty);
         this._container.toggleClass('ws-FilterButton__clearButton-visible', !isEmpty);
      },
      /**
       * Обработчик смены фильтра - меняет строку около кнопки, сигналит события
       * Возвращает фильтр (возможно, изменённый)
       * @param {Object} filter Объект с фильтром
       * @param {Object} stringFilter Фильтр со строковыми значениями
       * @param {Object} nonCleanableFilter Фильтр, который нельзя очистить
       * @param {Boolean} noLoad обработка фильтров без загрузки - не стреляем onChange
       * @returns {Object|$ws.proto.Deferred}
       * @private
       */
      _applyFilter: function(filter, stringFilter, nonCleanableFilter, noLoad){
         var isEmpty = Object.isEmpty(filter) || Object.isEmpty(stringFilter),
            result = noLoad ? undefined : this._notify('onChange', $ws.core.merge(filter, nonCleanableFilter), stringFilter),
            self = this;
         return $ws.helpers.callbackWrapper(result, function(updatedFilter){
            var changedFilter = filter;
            if(updatedFilter !== false){
               if(updatedFilter instanceof Object){
                  changedFilter = updatedFilter;
               }
               self._setLineData(changedFilter, stringFilter, isEmpty, noLoad);
            }
            return changedFilter;
         });
      },
      /**
       * Устанваливает данные в строку из фильтров
       * @param {Object} filter Фильтр
       * @param {Object} stringFilter Строковый фильтр
       * @param {Boolean} isEmpty Пустой ли фильтр
       * @param {Boolean} noSaveHistory если переставляли фильтр с параметром noLoad не переписываем историю,
       * иначе дублируются фильтры\значения
       * @private
       */
      _setLineData: function(filter, stringFilter, isEmpty, noSaveHistory){
         var
            result,
            tooltip,
            self = this,
            stringFilterCopy = $ws.core.merge({}, stringFilter),
            setting = function(result){
               var text;
               if(result instanceof Object && ('jquery' in result)){
                  self._setButtonContainer(result, isEmpty);
                  if(!noSaveHistory) {
                     self._processData(result, filter, stringFilterCopy);
                  }
                  return;
               }
               else if(typeof(result) === 'string'){
                  text = result;
               }
               else{
                  text = self._getTextFromFilter(filter, stringFilter);
               }
               if(!noSaveHistory) {
                  self._processData(text, filter, stringFilterCopy);
               }
               if (!self._options.pathFilterId || (self._options.pathFilterId &&  !(!isEmpty && !text))){
                  self._setButtonText(text, (Object.isEmpty(filter) || Object.isEmpty(stringFilter)), tooltip);
               }
            };
         if (this._options.filterLine) {
            result = this._options.filterLine.apply(this, [filter, stringFilter]);

            if ($.isPlainObject(result)) {
               tooltip = $ws.helpers.escapeTagsFromStr(result.title, []);
               result = result.visual;
            }
         }

         $ws.helpers.callbackWrapper(result, setting);
      },
      _processData: function (data, filter, stringFilter) {
      },
      /**
       * Устанавливает у браузера новый фильтр
       * @param {Object} filter Фильтр для браузера
       * @param {Object} prevFilter - предыдущий фильтр кнопки
       * @private
       */
      _setQuery: function(filter, prevFilter){
         if(this._browser){
            this._filterSetted = true;
            var i,
               query = this._browser.getQuery(true),
               hierarchyField = this._browser.getRecordSet().getHierarchyField(),
               self = this,
               historyFiltersFV = {};
            for(i in query){
               if(query.hasOwnProperty(i) && !this._defaultValues.hasOwnProperty(i)){
                  if(!filter.hasOwnProperty(i) && i !== hierarchyField && i !== 'Разворот'){
                     filter[i] = query[i];
                  }
               }
            }
            var browserFilter = $.extend({}, filter);
            for(i in browserFilter){
               if(browserFilter.hasOwnProperty(i)){
                  if(browserFilter[i] instanceof $ws.proto.Record){
                     browserFilter[i] = browserFilter[i].toObject();
                  }
                  else if(browserFilter[i] instanceof $ws.proto.Enum){
                     browserFilter[i] = browserFilter[i].getCurrentValue();
                  }
               }
            }
            if (this._filterView) {
               //Если в filterView когда-то были фильтры и их сбросили, удаляем их из браузера
               historyFiltersFV = $ws.core.merge({}, this._filterView.getFiltersHistory());
               $ws.core.merge(historyFiltersFV, this._filterView.getQuery());
               for (var k in historyFiltersFV) {
                  if (historyFiltersFV.hasOwnProperty(k) && historyFiltersFV[k] === undefined) {
                     delete browserFilter[k];
                  }
               }
            }
            if(this._notify('onSetQuery', browserFilter) !== false){
               this._browser.setQuery(browserFilter).addCallback(function(){
                  var context = !self._options.contextRestriction ? self.getLinkedContext() : null;
                  if (context) {
                     //Елифантьев О.Н.: "Таня, не буду это в фикс версию чинить  В setValueSelf ниглде не сказано что туда можно объекта  Меняйте по месту в кнопке фильтров  setValue({ ... }, true, ...)"
                     context.setValue(browserFilter, true);
                     for (var i in prevFilter) {
                        if (prevFilter.hasOwnProperty(i) && !browserFilter.hasOwnProperty(i)) {
                           context.removeValue(i, true);
                        }
                     }
               }
               });
            }
         }
         else{
            if(this._notify('onSetQuery', filter) !== false){
               this._setPathFilter(filter);
            }
         }
      },
      /**
       * Запоминает значения контролов
       * Выполняется всегда после готовности всплывающей панели
       * @private
       */
      _rememberValues: function(){
         this._getFilter(false).addCallback(function(values){
            this._filter = values;
         }.bind(this));
      },
      /**
       * <wiTag group="Управление">
       * Очистить фильтр и очистить значение контролов.
       * @command
       * @example
       * Если значение выпадающего списка на панели с фильтром не установлено, то установить его и выполнить фильтрацию,
       * иначе сбросить фильтр:
       * <pre>
       *     btn.subscribe('onActivated', function (eventObject) {
       *        $ws.single.ControlStorage.waitWithParentName(filterButton).addCallback(function(linkedControl){
       *           //найдем на всплывающей панели выпадающий список
       *           var dropdown = linkedControl.getFloatArea().getChildControlByName('Группа');
       *           //если значение у списка не установлено, то установим и выполним фильтрацию
       *           if (dropdown.getValue() === '') {
       *              dropdown.setValue('Семья');
       *              linkedControl.applyFilter();
       *           } else {
       *              //сбросим фильтр
       *              linkedControl.resetFilter();
       *           }
       *           return linkedControl;
       *        });
       *     });
       * </pre>
       * @see onResetFilter
       */
      resetFilter: function(){
         this._clearFromCrossButton = true;
         this._clearControlsValues(true);
         var nonCleanableFilter = {},
            stringFilter = {};
         this._getFilters({}, stringFilter, nonCleanableFilter);
         for(var key in stringFilter){
            if(stringFilter.hasOwnProperty(key) && !nonCleanableFilter.hasOwnProperty(key)){
               delete stringFilter[key];
            }
         }
         var filter = this._applyFilter({}, stringFilter, nonCleanableFilter);
         $ws.helpers.callbackWrapper(filter, function(filter){
            var prevFilter = this._filter,
                pathFilter = {};
            //Если есть связанный хлебный фильтр, то его значения не очищаются по клику на крестик
            if (this._pathFilter) {
               pathFilter = this._pathFilter.getQuery();
               filter = $ws.core.merge(filter, pathFilter);
            }
            this._filter = pathFilter;
            this._setQuery(filter, prevFilter);
            return filter;
         }.bind(this));
         return true;
      },
      /**
       * <wiTag group="Управление">
       * Применить фильтр
       * @param {Boolean} [noLoad] - не вызывать перезагрузку у браузера. Просто пересчитать все значения с внутренних
       * контролов на панели
       * @return {Boolean} Возвращает признак успешности применения фильтра.
       * Возможные значения:
       * <ol>
       *    <li>true - фильтр применился;</li>
       *    <li>false - фильтр не применился.</li>
       * </ol>
       * @command
       * @example
       * Если значение выпадающего списка на панели с фильтром не установлено, то установить его и выполнить фильтрацию,
       * иначе сбросить фильтр:
       * <pre>
       *     btn.subscribe('onActivated', function (eventObject) {
       *        $ws.single.ControlStorage.waitWithParentName(filterButton).addCallback(function(linkedControl){
       *           //найдем на всплывающей панели выпадающий список
       *           var dropdown = linkedControl.getFloatArea().getChildControlByName('Группа');
       *           //если значение у списка не установлено, то установим и выполним фильтрацию
       *           if (dropdown.getValue() === '') {
       *              dropdown.setValue('Семья');
       *              //применим фильтр
       *              linkedControl.applyFilter();
       *           } else {
       *              linkedControl.resetFilter();
       *           }
       *           return linkedControl;
       *        });
       *     });
       * </pre>
       * @see resetFilter
       */
      applyFilter: function(noLoad){
         var self = this;
         this._clearFromCrossButton = false;
         noLoad = typeof noLoad === 'boolean' ? noLoad : undefined;
         if(!this._floatAreaDeferred){
            this._createFloatArea();
         }
         this._floatAreaReady.wait(new $ws.proto.Deferred().addCallback(function(floatArea){
            var filter = {},
               stringFilter = {},
               nonCleanableFilter = {};
            self._getFilters(filter, stringFilter, nonCleanableFilter).addCallback(function(){
               filter = self._applyFilter(filter, stringFilter, nonCleanableFilter, noLoad);
               $ws.helpers.callbackWrapper(filter, function(filter){
                  //запомним предыдущее состояние фильтра
                  var prevFilter = $ws.core.merge({}, self._filter);
                  self._rememberValues();
                  // передадим предыдущее состояние фильтра для того, чтобы корректно почистить контекст
                  if (!noLoad) {
                     self._setQuery(filter, prevFilter);
                  }
                  return filter;
               });
            });
            return floatArea;
         }));
         return true;
      },
      /**
       * Применяет фильтр и скрывает панель
       * @private
       */
      _applyFilterAndClose: function(){
         if( this._floatArea && this._floatArea.validate() ){
            //Применяем фильтр после закрытия панели, чтобы запросы и перестроения во всяких браузерах, подписанных
            //на изменения фильтра, не тормозили бы его анимацию
            this._floatArea.once('onAfterClose', this.applyFilter.bind(this));
            this._floatArea.hide();
         }
      },
      /**
       * Обработка нажатий клавиш клавиатуры. Так как обрабатываем всего 2 клавиши - пробел и enter, то можно обойтись вообще без условий
       * @private
       */
      _keyboardHover: function(){
         this.toggleFloatArea();
      },
      /**
       * <wiTag noShow>
       * Меняет текущий браузер
       * @deprecated Не использовать с 3.6
       * @param {$ws.proto.DataView|$ws.proto.DataViewAbstract} browser Браузер, который нужно выбрать
       */
      setBrowser: function(browser){
         this.setLinkedView(browser);
      },
      /**
       * <wiTag group="Управление">
       * Установить/сменить текущее связанное представление данных.
       * В качестве связанного представления данных могут выступать следующие контролы:
       * <ol>
       *    <li><a href='http://wi.sbis.ru/demo/TreeView'>дерево</a>;</li>
       *    <li><a href='http://wi.sbis.ru/demo/TableView'>табличное представление</a>;</li>
       *    <li><a href='http://wi.sbis.ru/demo/HierarchyView'>иерархическое представление</a>;</li>
       *    <li><a href='http://wi.sbis.ru/demo/CustomView'>произвольное представление</a>.</li>
       * </ol>
       * @param {$ws.proto.DataView|$ws.proto.DataViewAbstract} browser Браузер, который нужно выбрать.
       * @example
       * По готовности панели с фильтром установить связанные представление данных и хлебный фильтр:
       * <pre>
       *     filterButton.subscribe('onReady', function (eventObject) {
       *        //Устанавливаем связанное представление данных
       *        $ws.single.ControlStorage.waitWithParentName(browser).addCallback(function(linkedControl){
       *           this.setLinkedView(linkedControl);
       *           return linkedControl;
       *        });
       *        $ws.single.ControlStorage.waitWithParentName(pathFilter).addCallback(function(linkedControl){
       *           this.setLinkedPathFilter(linkedControl);
       *           return linkedControl;
       *        });
       *     });
       * </pre>
       * @see browserId
       * @see getBrowser
       */
      setLinkedView: function(browser){
         if(browser !== this._browser){
            if(this._browser){
               this._clearBrowser();
            }

            var prevBrowser = !!this._browser;
            this._browser = browser;
            if (browser) {
               this._filterSetted = false;
               browser.subscribe('onFilterChange', this._filterChangeHandlerBrowser);

               if (browser.isHierarchyMode() && browser.hasEvent('onConvert')) {
                  browser.subscribe('onConvert', this._onConvertHandler);
               }

               browser.subscribe('onDestroy', this._destroyHandler);
               if (this._areaContext) {
                  this._areaContext.setPrevious(browser.getLinkedContext());
               }
               if (browser.recordSetReady().isReady() || prevBrowser) {
                  var filter = browser.getQuery();
                  this._changeFilter(filter);
                  this._setPathFilter(filter, true);
               }
               this._restructHistory();
            }
         }
      },
      _restructHistory: function() {},
      /**
       * <wiTag group="Управление">
       * Установить/сменить связанный хлебный фильтр.
       * @param {$ws.proto.PathFilter} linkedPathFilter Хлебный фильтр, который нужно выбрать.
       * @example
       * По готовности панели с фильтром установить связанные представление данных и хлебный фильтр:
       * <pre>
       *     filterButton.subscribe('onReady', function (eventObject) {
       *        $ws.single.ControlStorage.waitWithParentName(browser).addCallback(function(linkedControl){
       *           this.setLinkedView(linkedControl);
       *           return linkedControl;
       *        });
       *        //Устанавливаем связанный хлебный фильтр
       *        $ws.single.ControlStorage.waitWithParentName(pathFilter).addCallback(function(linkedControl){
       *           this.setLinkedPathFilter(linkedControl);
       *           return linkedControl;
       *        });
       *     });
       * </pre>
       * @see pathFilterId
       */
      setLinkedPathFilter: function(linkedPathFilter){
         if(linkedPathFilter !== this._pathFilter){
            if(this._pathFilter){
               this._clearPathFilter();
            }
            this._pathFilter = linkedPathFilter;

            if(linkedPathFilter){
               linkedPathFilter.subscribe('onFilterChange', this._filterChangeHandlerPathFilter);

               this._filterPath = linkedPathFilter.getQuery();
               this._changeFilter(this._filterPath);
            }
         }
      },
      /**
       * Очищает браузер
       */
      _clearBrowser: function(){
         this._browser.unsubscribe('onFilterChange', this._filterChangeHandlerBrowser);
         this._browser.unsubscribe('onDestroy', this._destroyHandler);
         if (this._browser.hasEvent('onConvert')) {
            this._browser.unsubscribe('onConvert', this._onConvertHandler);
         }
         this._browser = undefined;
      },
      _clearPathFilter: function(){
         this._pathFilter.unsubscribe('onFilterChange', this._filterChangeHandlerPathFilter);
         this._pathFilter = undefined;
      },
      /**
       * <wiTag group="Управление">
       * Установить/заменить шаблон, который будет показан в панели фильтров.
       * @param {String} templateName Название шаблона.
       * @example
       * Если шаблон для кнопки фильтров не установлен, то установим его
       * <pre>
       *     filterButton.subscribe('onReady', function (eventObject) {
       *        if (this.getTemplateName() === '') {
       *           //устанавливаем шаблон
       *           this.setTemplate('СправочникАбонентов');
       *        }
       *     });
       * </pre>
       * @see template
       * @see getTemplateName
       */
      setTemplate: function(templateName){
         this._options.template = templateName;
         if(this._floatArea){
            var self = this,
               deferred = new $ws.proto.Deferred();
            this._floatAreaReady.push(deferred);
            this._floatAreaDeferred.addCallback(function(floatArea){
               self._floatAreaDeferred = new $ws.proto.Deferred();
               self._floatArea.getChildControlByName('filtersTemplate')
                  .setTemplate(self._options.template)
                  .addCallback($.proxy(self._initTemplatedArea, self))
                  .addCallback(deferred.callback.bind(deferred));
               return floatArea;
            });
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить связанную шаблонную область.
       * @returns {null|*} Возвращает экземпляр класса $ws.proto.TemplatedArea или null, если не найдёт.
       * @example
       * <pre>
       *     filterButton.subscribe('onBeforeShow', function (eventObject) {
       *        //Получаем фильтр связанного представления
       *        var filter = this.getBrowser().getQuery();
       *        if (filter && filter['Группа'] === 'Семья') {
       *           //Установим значение связанному хлебному фильтру
       *           this.getPathFilter().setFilter('Группа', 'Семья');
       *        } else {
       *           //Иначе на всплывающей панели найдем строку ввода и скроем ее
       *           this.getFloatArea().getChildControlByName('Абонент').hide();
       *        }
       *     });
       * </pre>
       */
      getFloatArea: function() {
         return this._floatArea;
      },
      /**
       * <wiTag group="Данные">
       * Получить имя текущего шаблона панели фильтров.
       * @return {String} Возвращает имя шаблона.
       * @example
       * Если шаблон для кнопки фильтров не установлен, то установим его
       * <pre>
       *     filterButton.subscribe('onReady', function (eventObject) {
       *        //проверяем имя текущего шаблона
       *        if (this.getTemplateName() === '') {
       *           this.setTemplate('СправочникАбонентов');
       *        }
       *     });
       * </pre>
       * @see setTemplate
       */
      getTemplateName: function(){
         return this._options.template;
      },
      /**
       * <wiTag group="Данные">
       * Получить текущее связанное представление данных.
       * В качестве связанного представления данных могут выступать следующие контролы:
       * <ol>
       *    <li><a href='http://wi.sbis.ru/demo/TreeView'>дерево</a>;</li>
       *    <li><a href='http://wi.sbis.ru/demo/TableView'>табличное представление</a>;</li>
       *    <li><a href='http://wi.sbis.ru/demo/HierarchyView'>иерархическое представление</a>;</li>
       *    <li><a href='http://wi.sbis.ru/demo/CustomView'>произвольное представление</a>.</li>
       * </ol>
       * @return {$ws.proto.DataViewAbstract|undefined} Возвращает экземпляр класса.
       * @example
       * <pre>
       *     filterButton.subscribe('onBeforeShow', function (eventObject) {
       *        //Получаем фильтр связанного представления
       *        var filter = this.getBrowser().getQuery();
       *        if (filter && filter['Группа'] === 'Семья') {
       *           //Установим значение связанному хлебному фильтру
       *           this.getPathFilter().setFilter('Группа', 'Семья');
       *        } else {
       *           //Иначе на всплывающей панели найдем строку ввода и скроем ее
       *           this.getFloatArea().getChildControlByName('Абонент').hide();
       *        }
       *     });
       * </pre>
       * @see browserId
       * @see setLinkedView
       */
      getBrowser: function(){
         return this._browser;
      },
      /**
       * <wiTag group="Данные">
       * Получить свзанный хлебный фильтр.
       * @return {$ws.proto.PathFilter|undefined} Возвращает связанный хлебный фильтр.
       * @example
       * <pre>
       *     filterButton.subscribe('onBeforeShow', function (eventObject) {
       *        //Получаем фильтр связанного представления
       *        var filter = this.getBrowser().getQuery();
       *        if (filter && filter['Группа'] === 'Семья') {
       *           //Установим значение связанному хлебному фильтру
       *           this.getPathFilter().setFilter('Группа', 'Семья');
       *        } else {
       *           //Иначе на всплывающей панели найдем строку ввода и скроем ее
       *           this.getFloatArea().getChildControlByName('Абонент').hide();
       *        }
       *     });
       * </pre>
       * @see setLinkedPathFilter
       */
      getPathFilter: function(){
         return this._pathFilter;
      }
   });

   return $ws.proto.FilterButton;

});
