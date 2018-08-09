define('SBIS3.CONTROLS/FormController', [
   'Core/Context',
   'Core/core-clone',
   'Core/core-merge',
   'Core/CommandDispatcher',
   'Core/EventBus',
   'Core/Deferred',
   'Core/IoC',
   'Core/core-instance',
   'Core/helpers/Function/forAliveOnly',
   'Core/helpers/Hcontrol/doAutofocus',
   'Core/helpers/Object/isEmpty',
   'Lib/Control/CompoundControl/CompoundControl',
   'Core/Indicator',
   'WS.Data/Entity/Record',
   'WS.Data/Source/SbisService',
   'SBIS3.CONTROLS/Utils/InformationPopupManager',
   'SBIS3.CONTROLS/Action/Utils/OpenDialogUtil',
   'SBIS3.CONTROLS/TitleManager',
   'i18n!SBIS3.CONTROLS/FormController',
   'css!SBIS3.CONTROLS/FormController/FormController'
],
function(cContext, coreClone, cMerge, CommandDispatcher, EventBus, Deferred, IoC, cInstance, forAliveOnly, doAutofocus, isEmpty, CompoundControl, cIndicator, Record, SbisService, InformationPopupManager, OpenDialogUtil, TitleManager) {
   /**
    * Компонент, на основе которого создают диалог, данные которого инициализируются по записи.
    * В частном случае компонент применяется для создания <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/'>диалогов редактирования записи</a>.
    *
    * @class SBIS3.CONTROLS/FormController
    * @extends Lib/Control/CompoundControl/CompoundControl
    * @public
    * @author Красильников А.С.
    *
    * @ignoreEvents onAfterLoad onChange onStateChange
    * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
    */
   'use strict';

   var FormController = CompoundControl.extend([], /** @lends SBIS3.CONTROLS/FormController.prototype */ {
      /**
       * @typedef {Object} dataSource
       * @property {WS.Data/Source/ISource/Binding/typedef[]} [Binding] Соответствие методов CRUD+ контракту.
       * @property {WS.Data/Source/ISource/Endpoint/typedef[]} [endpoint] Конечная точка, обеспечивающая доступ клиента к функциональным возможностям источника данных.
       * @property {String} [model=source.sbis-service] Название зависимости, или конструктор объекта, или экземпляр объекта.
       * @property {String} [idProperty] Имя поля записи, которое содержит первичный ключ.
       * Если значение не установлено, используется первое поле записи.
       */
      /**
       * @event onFail Происходит в случае ошибки при сохранении или чтении записи из источника данных.
       * @remark
       * Событие не происходит, когда опция *hideErrorDialog* (см. команды {@link create}, {@link update}, {@link read} и {@link destroy}) установлена в значение true.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Object} error Описание ошибки. В свойстве message хранится текст ошибки, который можно использовать для вывода в пользовательском интерфейсе.
       */
      /**
       * @event onReadModel Происходит после чтения записи из источника данных.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Полученная запись.
       * @param {Object} additionalData Метаданные. Служебная информация, необходимая для синхронизации Действия.
       * @param {String} additionalData.idProperty Имя поля записи, в котором хранится первичный ключ. Значение параметра извлекается из опции {@link idProperty}.
       * @param {Boolean} additionalData.isNewRecord Признак "Новая запись", который означает, что запись инициализирована в источнике данных, но не сохранена.
       */
      /**
       * @event onAfterFormLoad Происходит после того, как отображён диалог с данными, которые полученны из редактируемой записи (см. {@link record}).
       * @remark
       * Событие происходит после открытия диалога или при изменении редактируемой записи (см. {@link setRecord}).
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
      /**
       * @event onBeforeUpdateModel Происходит перед сохранением записи в источнике данных.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Сохраняемая запись.
       * @returns {Boolean|Error|Deferred} Чтобы прервать сохранение записи, из обработчика события можно вернуть один из следующих результатов:
       * <ul>
       *    <li><b>false</b> (тип Boolean);</li>
       *    <li><b>экземпляр объекта Error</b> . Текст сообщения об ошибке соответствует error.message</li>
       *    <li>экземпляр класса {@link Core/Deferred}. Сохранение записи приостановится до тех пор, пока deferred не завершит выполнение. В callback отдается так же false|Error для того, чтобы прервать сохранение.</li>
       * </ul>
       */
      /**
       * @event onUpdateModel Происходит после сохранения записи в источнике данных.
       * @remark
       * Перед данным событием происходит {@link onBeforeUpdateModel}.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Сохранённая запись.
       * @param {Object} additionalData Метаданные. Служебная информация, необходимая для синхронизации Действия.
       * @param {String} additionalData.key Идентификатор сохранённой записи.
       * @param {String} additionalData.idProperty Имя поля записи, в котором хранится первичный ключ. Значение параметра извлекается из опции {@link idProperty}.
       * @param {Boolean} additionalData.isNewRecord Признак "Новая запись", который означает, что запись инициализирована в источнике данных, но не сохранена.
       */
      /**
       * @event onDestroyModel Происходит после удаления записи из источника данных.
       * @remark
       * Конфигурацию источника данных устанавливают в опции {@link dataSource}.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Удаленная запись.
       * @param {Object} additionalData Метаданные. Служебная информация, необходимая для синхронизации Действия.
       * @param {String} additionalData.idProperty Имя поля записи, в котором хранится первичный ключ. Значение параметра извлекается из опции {@link idProperty}.
       * @param {Boolean} additionalData.isNewRecord Признак "Новая запись", который означает, что запись инициализирована в источнике данных, но не сохранена.
       */
      /**
       * @event onCreateModel Происходит после создания новой записи в источнике данных.
       * @remark
       * Конфигурацию источника данных устанавливают в опции {@link dataSource}.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Новая запись. Значения её полей можно предустановить в опции {@link initValues}.
       * @param {Object} additionalData Метаданные. Служебная информация, необходимая для синхронизации Действия.
       * @param {String} additionalData.idProperty Имя поля записи, в котором хранится первичный ключ. Значение параметра извлекается из опции {@link idProperty}.
       * @param {Boolean} additionalData.isNewRecord Признак "Новая запись", который означает, что запись инициализирована в источнике данных, но не сохранена.
       */
      $protected: {
         _updateDeferred: undefined,
         _panel: undefined,
         _newRecord: false, //true - если запись создана, но еще не сохранена
         _activateChildControlDeferred: undefined,
         _previousDocumentTitle: undefined,
         _dataSource: null,
         _confirmDialog: false,
         _syncOperationCallback: undefined,
         _panelReadyDeferred: undefined,
         _overlay: undefined,
         _onBeforeCloseHandler: undefined,
         _onAfterShowHandler: undefined,
         _onRecordChangeHandler: undefined,
         _needUpdateAlways: false, //Сохранять запись всегда, даже когда не было изменений
         _options: {

            /**
             * @cfg {String} Устанавливает первичный ключ записи {@link record}.
             * @see record
             * @see dataSource
             */
            key: null,

            /**
             * @cfg {String} Поле записи, которое является идентификатором записи.
             */
            idProperty: undefined,

            /**
             * @cfg {String} Поле записи, в котором хранится ссылка на текущую страницу.
             */
            urlProperty: undefined,

            /**
             * @cfg {WS.Data/Entity/Model} Устанавливает запись, по которой произведена инициализация данных диалога.
             * @see setRecord
             * @see getRecord
             * @see dataSource
             * @see key
             */
            record: null,

            /**
             * @cfg {Boolean} Устанавливает сохранение только изменённых полей.
             */
            diffOnly: false,

            /**
             * @cfg {Object} Устанавливает ассоциативный массив, который используют только при создании новой записи для инициализации её начальными значениями.
             */
            initValues: null,

            /**
             * @cfg {Object} Дополнительные мета-данные, которые будут переданы в метод прочитать
             */
            readMetaData: null,

            /**
             * @cfg {String} Устанавливает текст, отображаемый рядом с индикатором при сохранении записи командной {@link update}.
             * @translatable
             * @see update
             * @see submit
             * @see onUpdateModel
             */
            indicatorSavingMessage: rk('Подождите, идёт сохранение'),

            /**
             * @cfg {dataSource} Конфигурация источника данных диалога.
             * @remark
             * В качестве источника используется {@link WS.Data/Source/SbisService}.
             * @example
             * <pre>
             * _options: {
             *    dataSource: {
             *       endpoint: 'Склад', // Объект бизнес-логики
             *       binding: { // CRUD-методы
             *          read: 'ПрочитатьТовар',
             *          query: 'СписокТоваров'
             *       },
             *       idProperty: '@Товар'
             *    }
             * }
             * </pre>
             * @see getDataSource
             */
            dataSource: {
            }
         }
      },

      $constructor: function() {
         this._publish('onFail', 'onReadModel', 'onBeforeUpdateModel', 'onUpdateModel', 'onDestroyModel', 'onCreateModel', 'onAfterFormLoad');
         this._declareCommands();

         // ищем панель как ближайший предок LikeWindowMixin, именно он является панелью, а не getTopParent.
         // у панели может быть задан parent и getTopParent вернет не то что надо
         this._panel = this.findParent(function(parent) {
            return cInstance.instanceOfMixin(parent, 'Lib/Mixins/LikeWindowMixin');
         }) || this._options._compoundArea || this.getTopParent();
         this._initHandlers();
         this._subscribeToEvents();

         this._updateDocumentData();
         this._setDefaultContextRecord();
         this._setPanelRecord(this.getRecord());

         this._newRecord = this._options.isNewRecord;
         this._panelReadyDeferred = new Deferred();

         if (this._getDelayedRemoteWayDeferred()) {
            this._processingRecordDeferred();
         } else {
            //Если не дожидаемся ответа от БЛ, то до показа панели покажем оверлей
            this._toggleOverlay(true);
         }

         //TODO в рамках совместимости
         this._dataSource = this._options.source;
         var dataSource = this._options.dataSource;
         if (dataSource && dataSource.endpoint) {
            
            // Установка режима dataSource.updateOnlyChanged происходит, только если он не задан напрямую в опциях
            dataSource.options = dataSource.options || {};
            if (dataSource.options.updateOnlyChanged === undefined) {
               dataSource.options.updateOnlyChanged = !!this._options.diffOnly;
            }
            
            this._dataSource = this._dataSource || FormController.prototype.createDataSource(this._options);
            if (!this._options.record && !cInstance.instanceOfModule(this._options._receiptRecordDeferred, 'Core/Deferred')) {
               this._getRecordFromSource({});
            }
         }
      },

      _initHandlers: function() {
         this._onBeforeCloseHandler = this._onBeforeClose.bind(this);
         this._onAfterShowHandler = this._onAfterShow.bind(this);
         this._onRecordChangeHandler = this._onRecordChange.bind(this);
         this._onBeforeNavigateHandler = this._onBeforeNavigate.bind(this);
         this._onBeforeUnloadHandler = this._onBeforeUnload.bind(this);
      },

      _subscribeToEvents: function() {
         this.subscribeTo(EventBus.channel('navigation'), 'onBeforeNavigate', this._onBeforeNavigateHandler);
         window.addEventListener('beforeunload', this._onBeforeUnloadHandler);
         this._panel.subscribe('onBeforeClose', this._onBeforeCloseHandler);
         this._panel.subscribe('onAfterShow', this._onAfterShowHandler);
         this._subscribeToRecordChange();
      },

      _declareCommands: function() {
         CommandDispatcher.declareCommand(this, 'read', this._read);
         CommandDispatcher.declareCommand(this, 'update', this.update);
         CommandDispatcher.declareCommand(this, 'destroy', this._destroyModel);
         CommandDispatcher.declareCommand(this, 'create', this._create);
         CommandDispatcher.declareCommand(this, 'notify', this._actionNotify);
         CommandDispatcher.declareCommand(this, 'activateChildControl', this._createChildControlActivatedDeferred);
      },

      _processingRecordDeferred: function() {
         var receiptRecordDeferred = this._getDelayedRemoteWayDeferred(),
            needUpdateKey = !this._options.key,
            eventName = needUpdateKey ? 'onCreateModel' : 'onReadModel',
            config = {
               hideIndicator: true,
               eventName: eventName
            },
            self = this;
         if (receiptRecordDeferred) {
            receiptRecordDeferred.addCallback(function(record) {
               self.setRecord(record, needUpdateKey);
               return record;
            });
            this._prepareSyncOperation(receiptRecordDeferred, config, {});
         }
      },

      _getDelayedRemoteWayDeferred: function() {
         var receiptRecordDeferred = this._options._receiptRecordDeferred;
         return cInstance.instanceOfModule(receiptRecordDeferred, 'Core/Deferred') ? receiptRecordDeferred : null;
      },

      _onBeforeUnload: function(e) {
         //Если рекорд был изменен и пытаются уйти со страницы - задаем вопрос, чтобы пользователь мог сохранить отредактированные данные.
         //рекорда может и не быть, это штатная ситуация
         if (this.getRecord() && this.getRecord().isChanged()) {
            //Почти во всех браузер была убрана возможность настраивать кастомный текст для диалогового окна https://www.chromestatus.com/feature/5349061406228480
            //Для того чтобы показать вопрос - из события нужно вернуть строку. Содержание строки будет проигнорировано https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
            var message = 'Редактируемая запись была изменена';
            e.returnValue = message;
            return message;
         }

         //Нужно вернуть undefined, любой другой результат ie воспримет как текст для окна с вопросом
         return undefined;
      },

      _onAfterShow: function() {
         //Если не дожидаемся ответа от БЛ, то после показа панели скрываем оверлей
         if (!this._getDelayedRemoteWayDeferred()) {
            this._toggleOverlay(false);
         }
         this._notifyOnAfterFormLoadEvent();
      },

      _notifyOnAfterFormLoadEvent: function() {
         //Если у нас показалась панель и есть рекорд, то в этом случае верстка по установленной записи уже построена и мы просто кидаем событие
         //Если же записи нет, дожидаемся, когда получим ее с БЛ.
         if (this.getRecord()) {
            this._actionNotify('onAfterFormLoad');
         } else {
            this._panelReadyDeferred.callback();
         }
      },

      _onBeforeClose: function(event, result) {
         //Обработчик _onBeforeClose универсален: при фактической операции закрытия панели мы можем попасть сюда несколько раз, т.к.
         //при определенных условиях прерываем логику закрытия панели и/или сами вызываем команду на закрытие.
         //Есть 2 типовых операции, когда мы попадаем сюда несколько раз, прежде чем закрыться:
         //1: Открыли существующую запись, изменили в ней поля, пытаемся закрыться по крестику. Сначала мы прервем логику закрытия, чтобы показать диалог о сохранении.
         //Когда пользователь даст ответ сохранять или нет - сами вызовем метод закрытия и вернемся сюда.
         //2: Открыли новую запись, далее так же как и в п.1. после вопроса о сохранении приходим сюда, если выполняются условия для дестроя - прерываем логику закрытия,
         //ждем когда задестроится запись и после этого сами вызываем закрытие панели.
         //TODO: Сейчас нет механизма, позволяющего работать с панелью не через события и влиять на ее работу. хорошо бы такой иметь

         var self = this,
            record = self.getRecord(),
            closeAfterConfirmDialogHandler = self._isConfirmDialogShowed();

         if (!record || (record.getState() === Record.RecordState.DELETED)) {
            //Если нет записи или она была удалена, то закрываем панель
         }

         //Если запись еще сохраняется, то отменяем закрытие (защита от множественного вызова закрытия панели)
         else if (self._isRecordSaving()) {
            event.setResult(false);
         } else if (result !== undefined || !record.isChanged() && !self._panel.getChildPendingOperations().length) {
            if (self._needDestroyModel(closeAfterConfirmDialogHandler, result)) {
               self._destroyModel({
                  closeResult: result
               }).addBoth(function() {
                  self._closePanel(result);
               });
               event.setResult(false);
            }
         } else {
            event.setResult(false);
            if (!closeAfterConfirmDialogHandler) {
               self._showConfirmDialog();
            }
         }
      },

      _needDestroyModel: function(closeAfterConfirmDialogHandler, closeResult) {
         //Дестроим запись, когда выполнены три условия
         //1. если это было создание
         //2. если есть ключ (метод создать его вернул)
         //3. ничего не поменяли в рекорде, но закрывают либо поменяли, но нажали нет
         return this.isNewRecord() && this._getRecordId() && (!closeAfterConfirmDialogHandler && !this.getRecord().isChanged() || closeResult === false);
      },

      _onBeforeNavigate: function(event, activeElement, isIconClick) {
         //Если показан диалог о сохранении, то не даем перейти в другой раздел аккордеона, пока его не закроют
         if (!isIconClick) {
            event.setResult(!this._isConfirmDialogShowed());
         }
      },

      _isConfirmDialogShowed: function() {
         return !!this._confirmDialog;
      },

      _isRecordSaving: function() {
         return !!this._updateDeferred;
      },

      _setDefaultContextRecord: function() {
         var ctx = cContext.createContext(this, {restriction: 'set'}, this.getLinkedContext());
         ctx.setValue('record', this._options.record || new Record());
         this._context = ctx;
      },

      _updateDocumentData: function() {
         var record = this._options.record,
            newUrl = record && record.get(this._options.urlProperty),
            newTitle = record && record.get('title');
         if (newTitle) {
            TitleManager.set(newTitle, this);
         }
         if (newUrl) {
            try {
               if (!this._defaultUrl) {
                  this._defaultUrl = window.location.pathname + window.location.search + window.location.hash;
               }
               history.pushState(null, null, newUrl);
            } catch (e) {
               this._defaultUrl = undefined;
            }
         }
      },

      _resetUrl: function() {
         if (this._defaultUrl) {
            history.pushState(null, null, this._defaultUrl);
         }
      },

      _subscribeToRecordChange: function() {
         var record = this.getRecord();
         if (record) {
            this.subscribeTo(record, 'onPropertyChange', this._onRecordChangeHandler);
         }
      },

      _unsubscribeFromRecordChange: function() {
         var record = this.getRecord();
         if (record) {
            this.unsubscribeFrom(record, 'onPropertyChange', this._onRecordChangeHandler);
         }
      },

      _onRecordChange: function(event, fields) {
         //Если изменился title - обновим заголовок вкладки браузера
         //Если fields пустой, значит установили новые сырые данные (вызывали setRawData)
         if (fields.title || isEmpty(fields)) {
            this._updateDocumentData();
         }
      },

      _setContextRecord: function(record) {
         this.getLinkedContext().setValue('record', record);
      },

      /**
       * Показывает индикатор загрузки
       */
      _showLoadingIndicator: forAliveOnly(function(message) {
//todo поправить LoadingIndicator
         cIndicator.setMessage(message || this._options.indicatorSavingMessage, true);
      }),

      /**
       * Скрывает индикатор загрузки
       */
      _hideLoadingIndicator: function() {
         cIndicator.hide();
      },
      _processError: function(e, hideErrorDialog, eventName) {
         var eResult = this._notify('onFail', e, eventName),
            eMessage = typeof eResult === 'string' ? eResult : e.message,
            self = this;
         if (!hideErrorDialog && eResult !== false) {
            //Не показываем сообщение, если запрос был прерван
            //В новом ff при переходе по ссылке обрываются все активные xhr => показываются ненужные алерты о том, что запрос был прерван
            if (eMessage && eMessage !== 'Cancel') {
               InformationPopupManager.showMessageDialog({
                  message: eMessage,
                  status: 'error'
               }, function() {
                  if (e.httpError === 403) {
                     self._closePanel();
                  }
               });
            }
         }
         e.processed = true;
         return e;
      },

      /**
       * Закрываем панель, в которой лежит formController
       * @param {*} result "Результат" закрытия панели - передаётся в соответствующее событие (onBeforeClose, onAfterClose).
       * @private
       */
      _closePanel: function(result) {
         //Если задача открыта в новом окне, то FormController лежит не во floatArea => нет панели, которую нужно закрывать
         if (!this.isDestroyed()) {
            if (this._panel.close) {
               this._panel.close(result);
            }
         }
         
      },

      /**
       * Возвращает источник данных диалога редактирования.
       * @return {Object} Объект с конфигурацией источника данных.
       * @remark
       * Также для диалога редактирования может быть по умолчанию установлен источник данных. Это происходит при его вызове через {@link SBIS3.CONTROLS/Action/DialogActionBase}.
       * @example
       * В примере продемонстрирована задача изменения списочного метода источника данных
       * <pre>
       * var dataSource = this.getDataSource(); // Получаем объект источника данных
       * dataSource.setBindings({ // Устанавливаем метод чтения записи
       *    read: 'ПрочитатьКарточкуСотрудника'
       * });
       * </pre>
       * @see dataSource
       */
      getDataSource: function() {
         return this._dataSource;
      },

      /**
       * Возвращает признак: новая запись или нет.
       * @returns {Boolean} true - запись создана, но не сохранена в источнике данных диалога.
       */
      isNewRecord: function() {
         return this._newRecord;
      },
      setDataSource: function(source, config) {
         throw new Error('FormController: Задавать источник данных необходимо через опцию dataSource. Подробнее /doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/create/');
      },

      /**
       * Устанавливает запись, по данным которой производится инициализация данных диалога.
       * @remark
       * Запись будет добавлена в контекст диалога в свойство "record".
       * @param {WS.Data/Entity/Model} record Экземпляр записи.
       * @param {Boolean} [updateKey=false] Нужно ли обновить значение опции {@link key} при изменении записи.
       * @see record
       * @see key
       * @see getRecord
       */
      setRecord: function(record, updateKey) {
         var newKey;
         this._unsubscribeFromRecordChange(); // отписываемся от отслеживания изменений старой записи
         this._options.record = record;
         this._setPanelRecord(record);
         if (updateKey) {
            newKey = this._getRecordId();
            this._options.key = newKey;
            this._newRecord = true;
         }
         this._subscribeToRecordChange();
         this._updateDocumentData();
         this._setContextRecord(record);
         var self = this;
         this._panelReadyDeferred.addCallback(function() {
            self._actionNotify('onAfterFormLoad');
         });
      },
      _setPanelRecord: function(record) {
         //Запоминаем запись на панели, т.к. при повторном вызове execute, когда уже есть открытая панель,
         //текущая панель закрывается и открывается новая. В dialogActionBase в подписке на onAfterClose ссылка на панель будет не актуальной,
         //т.к. ссылается на только что открытую панель. Поэтому берем редактируемую запись с самой панели.
         this._panel._record = record;
      },

      /**
       * Возвращает запись, по данным которой произведена инициализация данных диалога.
       * @reaturn {WS.Data/Entity/Model}
       * @see record
       * @see key
       * @see setRecord
       */
      getRecord: function() {
         return this._options.record;
      },


      _getRecordId: function() {
         if (this._options.idProperty) {
            return this.getRecord().get(this._options.idProperty);
         }
         return this.getRecord().getId();
      },

      _getRecordFromSource: function(config) {
         if (this._options.key) {
            return this._read(config);
         }
         return this._create(config);
      },

      /**
       * Создаёт новую запись в источнике данных диалога.
       * @param {Object} [config] Конфигурация команды.
       * @param {Boolean} [config.hideErrorDialog=false] Не показывать сообщение при ошибке.
       * @param {Boolean} [config.hideIndicator=false] Не показывать индикатор.
       * @remark
       * При создании записи часть полей могут быть инициализированы значениями, которые установлены в опции {@link initValues}.
       * При успешном создании записи происходит событие {@link onCreateModel}, а при ошибке - событие {@link onFail}.
       * После создания записи фокус будет установлен на первый дочерний контрол диалога.
       * Созданная запись будет помещена в контекст диалога в поле "record".
       * Источник данных диалога устанавливают с помощью опции {@link dataSource}.
       * @returns {WS.Data/Entity/Record|Deferred} Созданная запись либо результат выполнения команды.
       * @command create
       * @see read
       * @see update
       * @see destroy
       * @see notify
       * @see onCreateModel
       * @see dataSource
       */
      _create: function(config) {
         var createConfig = {
               indicatorText: rk('Загрузка'),
               eventName: 'onCreateModel'
            },
            self = this,
            createDeferred = this._dataSource.create(this._options.initValues);

         createDeferred.addCallback(function(record) {
            self.setRecord(record, true);
            return record;
         }).addBoth(function(data) {
            self._activateChildControlAfterLoad();
            return data;
         });
         return this._prepareSyncOperation(createDeferred, config, createConfig);
      },

      /**
       * Удаляет запись из источника данных диалога.
       * @param {Object} [config] Конфигурация команды.
       * @param {Boolean} [config.hideIndicator=false] Не показывать индикатор.
       * @param {Boolean} [config.closePanelAfterSubmit=true] Закрывать диалог после выполнения команды.
       * @param {Boolean} [config.hideErrorDialog=true] Не показывать сообещние при ошибке.
       * @param {Object} [config.destroyMeta] Дополнительные мета данные, которые будут переданы при удалении модели из источника данных
       * @remark
       * При удалении происходит событие {@link onDestroyModel}.
       * Источник данных диалога устанавливают с помощью опции {@link dataSource}.
       * @command destroy
       * @see update
       * @see read
       * @see create
       * @see notify
       * @see onDestroyModel
       * @see dataSource
       */
      _destroyModel: function(cfg) {
         var record = this._options.record,
            config = cfg || {},
            self = this,
            destroyConfig = {
               hideIndicator: config.hideIndicator !== undefined ? config.hideIndicator : true,
               eventName: 'onDestroyModel',
               hideErrorDialog: config.hideErrorDialog !== undefined ? config.hideErrorDialog : true
            },
            def = this._dataSource.destroy(this._getRecordId(), config.destroyMeta);

         return this._prepareSyncOperation(def, config, destroyConfig).addBoth(function(data) {
            self._newRecord = false;
            record.setState(Record.RecordState.DELETED);
            if (config.closePanelAfterSubmit) {
               self._closePanel(true);
            }
            return data;
         });
      },

      /**
       * Производит чтение записи из источника данных диалога.
       * @param {Object} config Параметры команды.
       * @param {Number|String} config.key Первичный ключ, по которому производится чтение записи.
       * @param {Boolean} [config.hideErrorDialog=false] Не показывать сообещние при ошибке.
       * @param {Boolean} [config.hideIndicator=false] Не показывать индикатор.
       * @remark
       * В случае успешного чтения записи происходит событие {@link onReadModel}, а в случае ошибки - {@link onFail}.
       * Прочитанная запись будет установлена в контекст диалога.
       * При успешном чтении записи фокус будет установлен на первый дочерний контрол диалога.
       * Прочитанная запись будет помещена в контекст диалога в поле "record".
       * Источник данных диалога устанавливают с помощью опции {@link dataSource}.
       * @returns {Deferred} Объект deferred, который возвращает результат чтения записи из источника.
       * @command read
       * @see update
       * @see destroy
       * @see create
       * @see notify
       * @see onReadModel
       * @see onFail
       * @see dataSource
       */
      _read: function(config) {
         var readConfig = {
               indicatorText: rk('Загрузка'),
               eventName: 'onReadModel'
            },
            self = this,
            readDeferred;
         this._options.key = (config && config.key) || this._options.key;

         readDeferred = this._dataSource.read(this._options.key, this._options.readMetaData).addCallback(function(record) {
            self._newRecord = false;
            self.setRecord(record);
            return record;
         }).addBoth(function(data) {
            self._activateChildControlAfterLoad();
            return data;
         });
         return this._prepareSyncOperation(readDeferred, config, readConfig);
      },

      /**
       * Сохранить запись в источнике данных диалога редактирования.
       * @param {Object} [config] Параметры команды.
       * @param {Boolean} [config.closePanelAfterSubmit=false] Закрывать диалог после сохранения.
       * @param {Boolean} [config.hideErrorDialog=false] Не показывать сообщение при ошибке.
       * @param {Boolean} [config.hideIndicator=false] Не показывать индикатор сохранения.
       * @remark
       * При сохранении записи происходит проверка всех <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/validation/'>валидаторов</a> диалога.
       * Если на одном из полей ввода валидация будет не пройдена, то сохранение записи отменяется, и пользователь увидит сообщение "Некорректно заполнены обязательные поля.".
       * Если процесс сохранения записи происходит длительное время, то в пользовательском интерфейсе будет выведено сообщение "Подождите, идёт сохранение". Текст сообщения можно конфигурировать с помощью опции {@link indicatorSavingMessage}.
       * При успешном сохранении записи происходит событие {@link onUpdateModel}, а в случае ошибки - {@link onFail}.
       * Источник данных для диалога редактирования устанавливают с помощью опции {@link dataSource}.
       * @returns {WS.Data/Entity/Record|Deferred} Созданная запись либо результат выполнения команды.
       * @example
       * В следующем примере организовано сохранение редактируемой записи по нажатию на кнопку:
       * <pre>
       * this.getChildControlByName('Сохранить').subscribe('onActivated', function() {
       *    this.sendCommand('update', {closePanelAfterSubmit: true});
       * });
       * </pre>
       * @command update
       * @see read
       * @see destroy
       * @see create
       * @see notify
       * @see onUpdateModel
       * @see onFail
       * @see dataSource
       */
      update: function(config) {
         return this._prepareUpdatingRecord(config || {});
      },

      _showConfirmDialog: function() {
         this._confirmDialog = InformationPopupManager.showConfirmDialog({
            message: rk('Сохранить изменения?'),
            details: rk('Чтобы продолжить редактирование, нажмите "Отмена".'),
            hasCancelButton: true,
            opener: this
         },
         this._confirmDialogHandler.bind(this, true),
         this._confirmDialogHandler.bind(this, false),
         this._confirmDialogHandler.bind(this)
         );
      },

      _prepareUpdatingRecord: function(config) {
         var error = new Error(rk('Некорректно заполнены обязательные поля.')),
            self = this,
            updateDeferred = new Deferred(),
            onBeforeUpdateData;

         updateDeferred.addErrback(function(e) {
            return e;
         });

         if (this.validate()) {
            //Событие onBeforeUpdateModel необходимо для пользовательской валидации.
            //Из события можно вернуть как Boolean(либо Error, который приравнивается к false), так и Deferred
            //FormController не продолжает сохранение записи, если пользовательский результат будет равен false (либо Error)
            //В случае, если пользователь вернул Error, текст ошибки будет взят из error.message.
            onBeforeUpdateData = this._prepareOnBeforeUpdateResult(this._notify('onBeforeUpdateModel', this.getRecord()));
            if (onBeforeUpdateData.result instanceof Deferred) {
               onBeforeUpdateData.result.addBoth(function(result) {
                  onBeforeUpdateData = self._prepareOnBeforeUpdateResult(result);
                  if (onBeforeUpdateData.result !== false) {
                     updateDeferred.dependOn(self._updateRecord(config));
                  } else {
                     updateDeferred.errback(onBeforeUpdateData.errorMessage);
                  }
               });
               return updateDeferred;
            } else if (onBeforeUpdateData.result === false) {
               return Deferred.fail(onBeforeUpdateData.errorMessage);
            }
            return this._updateRecord(config);
         }

         this._processError(error, config.hideErrorDialog, 'onUpdateModel'); //Если валидация не прошла
         return Deferred.fail(error);
      },

      _updateRecord: function(config) {
         var dResult = new Deferred(),
            updateConfig = {
               indicatorText: this._options.indicatorSavingMessage,
               eventName: 'onUpdateModel',
               additionalData: {}
            },
            self = this;

         if (this._options.record.isChanged() || self._newRecord || this._needUpdateAlways) {
            this._updateDeferred = this._dataSource.update(this._options.record).addCallback(function(key) {
               updateConfig.additionalData.key = key;
               self._newRecord = false;
               return key;
            }).addErrback(function(error) {
               self._updateDeferred = false;
               return error;
            });
            dResult.dependOn(this._prepareSyncOperation(this._updateDeferred, config, updateConfig));
         } else {
            dResult.callback();
         }
         dResult.addCallback(function(result) {
            self._updateDeferred = false; //в 230+ версии можно перенести в колбэк самого _updateDeferred, когда выпилится опция source
            if (config.closePanelAfterSubmit) {
               self._closePanel(true);
            }
            return result;
         });
         return dResult;
      },

      _confirmDialogHandler: function(result) {
         this._confirmDialog = undefined;
         if (result) {
            this._prepareUpdatingRecord({
               closePanelAfterSubmit: true
            });
         } else if (result === false) {
            this._closePanel(false);
         } else {
            this._panel.onBringToFront();
         }
      },

      _prepareOnBeforeUpdateResult: function(result) {
         var errorMessage = 'updateModel canceled from onBeforeUpdateModel event';
         if (result instanceof Error) {
            errorMessage = result.message;
            result = false;
         }
         return {
            errorMessage: errorMessage,
            result: result
         };
      },

      _prepareSyncOperation: function(operation, commonConfig, operationConfig) {
         var self = this,
            config = coreClone(commonConfig || {});
         config = cMerge(commonConfig, operationConfig);

         if (!config.hideIndicator) {
            this._showLoadingIndicator(config.indicatorText);
         }
         if (!config.additionalData) {
            config.additionalData = {};
         }
         config.additionalData.idProperty = this._options.idProperty;
         config.additionalData.isNewRecord = this._newRecord;

         this._toggleOverlay(true);
         this._addSyncOperationPending();

         operation.addCallback(function(data) {
            self._notify(config.eventName, self._options.record, config.additionalData);
            return data;
         }).addErrback(function(err) {
            //Не показываем ошибку, если было прервано соединение с интернетом. просто скрываем индикатор и оверлей
            if ((err instanceof Error) && !err._isOfflineMode) {
               self._processError(err, config.hideErrorDialog, config.eventName);
            }
            return err;
         }).addBoth(function(result) {
            self._removeSyncOperationPending();
            self._hideLoadingIndicator();
            self._toggleOverlay(false);
            return result;
         });
         return operation;
      },

      _toggleOverlay: function(show) {
         if (!this._overlay) {
            this._overlay = $('<div class="controls-FormController-overlay ws-hidden"></div>').appendTo(this.getContainer());
         }
         this._overlay.toggleClass('ws-hidden', !show);
      },

      _addSyncOperationPending: function() {
         this._removeSyncOperationPending();
         this._syncOperationCallback = new Deferred();
         this._panel.addPendingOperation(this._syncOperationCallback);
      },
      _removeSyncOperationPending: function() {
         if (this._syncOperationCallback && !this._syncOperationCallback.isReady()) {
            this._syncOperationCallback.callback();
         }
      },

      /**
       * Оповещает экземпляр класса действия (см. {@link SBIS3.CONTROLS/Action/List/OpenEditDialog}) о произошедшем событии.
       * @remark
       * Логика обработки такого события, которая по умолчанию предопределена классом SBIS3.CONTROLS/FormController, не будет выполнена.
       * Например,
       * <pre>
       *     // отменяется логика сохранения записи, предустановленная в FormController
       *     this.sendCommand('notify', 'onUpdateModel', someParams);
       * </pre>
       * Логика обработки события должна быть определена разработчиком в SBIS3.CONTROLS/Action/List/OpenEditDialog, о чем подробнее вы можете прочитать в <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/synchronization/'>этом разделе</a>.
       * @param {String} eventName Имя события: onUpdateModel, onReadModel,onCreateModel или onDestroyModel.
       * @param {*} additionalData Данные, которые должны быть переданы в качестве аргументов события.
       * @command notify
       * @see read
       * @see create
       * @see update
       * @see destroy
       */
      _actionNotify: function(eventName, additionalData) {
         this._notify(eventName, this._options.record, additionalData || {});
      },

      /**
       * Устанавливает фокус на дочерний контрол диалога при окончании чтения/создания записи в источнике данных диалога.
       * @returns {Deferred}
       * @remark
       * По умолчанию после создания или чтения записи (из источника данных диалога) фокус будет установлен на первый дочерний контрол диалога.
       * Вы можете изменить контрол, на который будет установлен фокус.
       * @example
       * В следующем примере организован переход фокуса после загрузки диалога на компонент textBox:
       * <pre>
       *    this.sendCommand('activateChildControl').addCallback(function(){
       *       textBox.getContainer().focus();
       *    });
       * </pre>
       * @command activateChildControl
       * @see dataSource
       */
      _createChildControlActivatedDeferred: function() {
         this._activateChildControlDeferred = (new Deferred()).addCallback(function() {
            doAutofocus(this._container);
         }.bind(this));
         return this._activateChildControlDeferred;
      },
      _activateChildControlAfterLoad: function() {
         if (this._activateChildControlDeferred instanceof Deferred) {
            this._activateChildControlDeferred.callback();
            this._activateChildControlDeferred = undefined;
         } else {
            doAutofocus(this._container);
         }
      },

      destroy: function() {
         this._panel.unsubscribe('onAfterShow', this._onAfterShowHandler);
         this._panel.unsubscribe('onBeforeClose', this._onBeforeCloseHandler);
         this.unsubscribeFrom(EventBus.channel('navigation'), 'onBeforeNavigate', this._onBeforeNavigateHandler);
         window.removeEventListener('beforeunload', this._onBeforeUnloadHandler);
         this._resetUrl();
         this._unsubscribeFromRecordChange();
         FormController.superclass.destroy.apply(this, arguments);
      }
   });

      //Функционал, позволяющий с прототипа компонента вычитать запись до инициализации компонента и прокинуть ее в опции. Сделано в рамках ускорения
   FormController.prototype.getRecordFromSource = function(opt) {
      var options = this.getComponentOptions(opt),
         dataSource,
         result;

         //TODO в рамках совместимости
      if (isEmpty(options.dataSource) && !options.source) {
         IoC.resolve('ILogger').error('SBIS3.CONTROLS/FormController', 'Необходимо задать опцию dataSource');
         return false;
      }

      options.source = this.createDataSource(options);

      if (options.key) {
         result = options.source.read(options.key, options.readMetaData);
      } else {
         result = options.source.create(options.initValues);
      }
      return result;
   };

   FormController.prototype.createDataSource = function(options) {
      if (!cInstance.instanceOfModule(options.source, 'WS.Data/Source/Base')) {
         return new SbisService(options.dataSource);
      }
      return options.source;
   };

   FormController.prototype.getComponentOptions = function(mergeOptions) {
      return OpenDialogUtil.getOptionsFromProto(this, mergeOptions);
   };
   return FormController;

});
