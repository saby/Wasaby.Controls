define('js!SBIS3.CONTROLS.FormController', [
   "Core/Context",
   "Core/core-functions",
   "Core/core-merge",
   "Core/CommandDispatcher",
   "Core/EventBus",
   "Core/Deferred",
   "Core/IoC",
   "Core/ConsoleLogger",
   "Core/helpers/fast-control-helpers",
   "Core/core-instance",
   "Core/helpers/functional-helpers",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CORE.LoadingIndicator",
   "js!WS.Data/Entity/Record",
   "js!WS.Data/Entity/Model",
   "js!WS.Data/Source/SbisService",
   "js!SBIS3.CONTROLS.Utils.InformationPopupManager",
   "js!SBIS3.CONTROLS.Utils.OpenDialog",
   "js!SBIS3.CONTROLS.OpenDialogAction",
   "i18n!SBIS3.CONTROLS.FormController",
   'css!SBIS3.CONTROLS.FormController'
],
   function( cContext, cFunctions, cMerge, CommandDispatcher, EventBus, Deferred, IoC, ConsoleLogger, fcHelpers, cInstance, fHelpers, CompoundControl, LoadingIndicator, Record, Model, SbisService, InformationPopupManager, OpenDialogUtil) {
   /**
    * Компонент, на основе которого создают диалог, данные которого инициализируются по записи.
    * В частном случае компонент применяется для создания <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/'>диалогов редактирования записи</a>.
    *
    * @class SBIS3.CONTROLS.FormController
    * @extends $ws.proto.CompoundControl
    * @public
    * @author Красильников Андрей Сергеевич
    *
    * @ignoreEvents onAfterLoad onChange onStateChange
    * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
    */
   'use strict';

   var FormController = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.FormController.prototype */ {
      /**
       * @typedef {Object} dataSource
       * @property {WS.Data/Source/ISource/Binding/typedef[]} [Binding] Соответствие методов CRUD+ контракту.
       * @property {WS.Data/Source/ISource/Endpoint/typedef[]} [endpoint] Конечная точка, обеспечивающая доступ клиента к функциональным возможностям источника данных.
       * @property {String} [model=source.sbis-service] Название зависимости, или конструктор объекта или инстанс объекта.
       */
      /**
       * @event onFail Происходит в случае ошибки при сохранении или чтении записи из источника данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} error Объект с описанием ошибки. В свойстве message хранится текст ошибки, например для вывода в пользовательский интерфейс.
       * @see submit
       * @see update
       * @see read
       * @see onCreateModel
       * @see onUpdateModel
       * @see onDestroyModel
       */
      /**
       * @event onReadModel Происходит при чтении записи из источника данных диалога редактирования.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Запись, прочитанная из источника данных (см. {@link dataSource}).
       * @see read
       * @see dataSource
       * @see onCreateModel
       * @see onUpdateModel
       * @see onDestroyModel
       * @see onFail
       */
      /**
       * @event onAfterFormLoad Происходит при показе панели с построеной версткой по установленной записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @see read
       * @see dataSource
       * @see onCreateModel
       * @see onUpdateModel
       * @see onDestroyModel
       * @see onFail
       */
      /**
       * @event onBeforeUpdateModel Происходит перед сохранением записи в источнике данных диалога.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Сохраняемая запись.
       * @see submit
       * @see update
       * @see onCreateModel
       * @see onDestroyModel
       * @see onReadModel
       * @see onFail
       */
      /**
       * @event onUpdateModel Происходит при сохранении записи в источнике данных диалога.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Сохраняемая запись.
       * @param {String} key Первичный ключ сохраняемой записи.
       * @see submit
       * @see update
       * @see onCreateModel
       * @see onDestroyModel
       * @see onReadModel
       * @see onFail
       */
      /**
       * @event onDestroyModel Происходит при удалении записи из источника данных диалога.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Запись, которая была удалена из источника данных (см. {@link dataSource}).
       * @see destroy
       * @see dataSource
       * @see onCreateModel
       * @see onUpdateModel
       * @see onReadModel
       * @see onFail
       */
      /**
       * @event onCreateModel Происходит при создании записи в источнике данных диалога редактирования.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Model} record Запись, которая была создана в источнике данных.
       * При создании часть полей может быть предустановлена с помощью опции {@link initValues}.
       * @see create
       * @see onDestroyModel
       * @see onUpdateModel
       * @see onReadModel
       * @see onFail
       */
      $protected: {
         _updateDeferred: undefined,
         _loadingIndicator: undefined,
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
         _options: {
            /**
             * @cfg {String} Устанавливает первичный ключ записи {@link record}.
             * @see record
             * @see dataSource
             */
            key: null,
            /**
             * @cfg {String} Поле записи, которое является идентификатором записи
             */
            idProperty: undefined,
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
            indicatorSavingMessage:  rk('Подождите, идёт сохранение'),
            /**
             * @cfg {dataSource} Устанавливает конфигурацию источника данных диалога.
             * @remark
             * Сейчас допускается установить конфигурацию класса {@link WS.Data/Source/SbisService}. Однако в общем случае это может быть любой источник данных.
             * @example
             * <pre>
             * _options: {
             *    dataSource: {
             *       endpoint: 'Склад', // Объект бизнес-логики
             *       binding: { // CRUD-методы
             *          read: 'ПрочитатьТовар',
             *          query: 'СписокТоваров'
             *       }
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
         this._subscribeToGlobalEvents();

         this._updateDocumentTitle();
         this._setDefaultContextRecord();

         this._newRecord = this._options.isNewRecord;
         this._panelReadyDeferred = new Deferred();
         this._panel = this.getTopParent();
         this._onBeforeCloseHandler = this._onBeforeClose.bind(this);
         this._onAfterShowHandler = this._onAfterShow.bind(this);
         this._panel.subscribe('onBeforeClose', this._onBeforeCloseHandler);
         this._panel.subscribe('onAfterShow', this._onAfterShowHandler);
         this._setPanelRecord(this.getRecord());

         if (this._getDelayedRemoteWayDeferred()) {
            this._processingRecordDeferred();
         }
         else {
            //Если не дожидаемся ответа от БЛ, то до показа панели покажем оверлей
            this._toggleOverlay(true);
         }

         //TODO в рамках совместимости
         this._dataSource = this._options.source;
         if (this._options.dataSource && this._options.dataSource.endpoint) {
            this._dataSource = this._dataSource || FormController.prototype.createDataSource(this._options);
            if (!this._options.record && !cInstance.instanceOfModule(this._options._receiptRecordDeferred, 'Core/Deferred')) {
               this._getRecordFromSource({});
            }
         }
      },

      _subscribeToGlobalEvents: function(){
         this._onBeforeNavigateHandler = this._onBeforeNavigate.bind(this);
         this._onBeforeUnloadHandler = this._onBeforeUnload.bind(this);
         this.subscribeTo(EventBus.channel('navigation'), 'onBeforeNavigate', this._onBeforeNavigateHandler);
         window.addEventListener("beforeunload", this._onBeforeUnloadHandler);
      },

      _declareCommands: function(){
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
            receiptRecordDeferred.addCallback(function (record) {
               self.setRecord(record, needUpdateKey);
               return record;
            });
            this._prepareSyncOperation(receiptRecordDeferred, config, {});
         }
      },

      _getDelayedRemoteWayDeferred: function(){
         var receiptRecordDeferred = this._options._receiptRecordDeferred;
         return cInstance.instanceOfModule(receiptRecordDeferred, 'Core/Deferred') ? receiptRecordDeferred : null;
      },

      _onBeforeUnload: function(e) {
         //Если рекорд был изменен и пытаются уйти со страницы - задаем вопрос, чтобы пользователь мог сохранить отредактированные данные.
         if (this.getRecord().isChanged()) {
            //Почти во всех браузер была убрана возможность настраивать кастомный текст для диалогового окна https://www.chromestatus.com/feature/5349061406228480
            //Для того чтобы показать вопрос - из события нужно вернуть строку. Содержание строки будет проигнорировано https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
            var message = "Редактируемая запись была изменена";
            e.returnValue = message;
            return message;
         }
         return null;
      },

      _onAfterShow: function() {
         //Если не дожидаемся ответа от БЛ, то после показа панели скрываем оверлей
         if (!this._getDelayedRemoteWayDeferred()) {
            this._toggleOverlay(false);
         }
         this._updateIndicatorZIndex();
         this._notifyOnAfterFormLoadEvent();
      },

      _notifyOnAfterFormLoadEvent: function(){
         //Если у нас показалась панель и есть рекорд, то в этом случае верстка по установленной записи уже построена и мы просто кидаем событие
         //Если же записи нет, дожидаемся, когда получим ее с БЛ.
         if (this.getRecord()){
            this._actionNotify('onAfterFormLoad');
         }
         else{
            this._panelReadyDeferred.callback();
         }
      },

      _onBeforeClose: function(event, result){
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
         //Если нет записи или она была удалена, то закрываем панель
         if (!record || (record.getState() === Record.RecordState.DELETED)){
            return;
         }
         //Если запись еще сохраняется, то отменяем закрытие (защита от множественного вызова закрытия панели)
         if (self._isRecordSaving()){
            event.setResult(false);
            return;
         }
         if (result !== undefined || !record.isChanged() && !self._panel.getChildPendingOperations().length){
            //Дестроим запись, когда выполнены три условия
            //1. если это было создание
            //2. если есть ключ (метод создать его вернул)
            //3. ничего не поменяли в рекорде, но закрывают либо поменяли, но нажали нет
            if (self.isNewRecord() && self._getRecordId() && (!closeAfterConfirmDialogHandler && !record.isChanged() || result === false)){
               self._destroyModel().addBoth(function(){
                  self._closePanel(result);
               });
               event.setResult(false);
            }
            self._resetTitle();
            return;
         }
         event.setResult(false);
         if (!closeAfterConfirmDialogHandler) {
            self._showConfirmDialog();
         }
      },

      _onBeforeNavigate: function(event, activeElement, isIconClick){
         //Если показан диалог о сохранении, то не даем перейти в другой раздел аккордеона, пока его не закроют
         if (!isIconClick) {
            event.setResult(!this._isConfirmDialogShowed());
         }
      },

      _isConfirmDialogShowed: function(){
         return this._confirmDialog && this._confirmDialog.isVisible();
      },

      _isRecordSaving: function(){
         return !!this._updateDeferred;
      },

      _setDefaultContextRecord: function(){
         var ctx = new cContext({restriction: 'set'}).setPrevious(this.getLinkedContext());
         ctx.setValue('record', this._options.record || new Record());
         this._context = ctx;
      },

      _updateDocumentTitle: function () {
         var record = this._options.record,
             newTitle = record && record.get('title');
         if (newTitle) {
            if (!this._previousDocumentTitle){
               this._previousDocumentTitle = document.title;
            }
            document.title = newTitle;
         }
      },

      _resetTitle: function(){
         if (this._previousDocumentTitle){
            document.title = this._previousDocumentTitle;
         }
      },

      _getRecordForUpdate: function () {
         if (!this._options.diffOnly){
            return this._options.record;
         }

         var record = this._options.record,
            changedRec = new Model({
               idProperty: record.getIdProperty(),
               adapter: record.getAdapter()
            }),
            changedFields = record.getChanged();
         if (changedFields.indexOf(record.getIdProperty()) === -1){
            changedFields.push(record.getIdProperty());
         }

         $.each(changedFields, function(i, key){
            var formatIndex = record.getFormat().getFieldIndex(key);
            if (formatIndex > -1) {
               changedRec.addField(record.getFormat().at(formatIndex), undefined, record.get(key));
               if (cInstance.instanceOfModule(record.getAdapter(), 'WS.Data/Adapter/Sbis')) {
                  var newFormatIndex = changedRec.getFormat().getFieldIndex(key);
                  //todo сделать нормальную сериализацию формата, щас не сериализуется поле связь и при копировании уходит как строка
                  changedRec.getRawData().s[newFormatIndex] = cFunctions.clone(record.getRawData().s[formatIndex]);
               }
            }
         });

         record.acceptChanges();
         return changedRec;
      },

      _setContextRecord: function(record){
         this.getLinkedContext().setValue('record', record);
      },
      /**
       * Показывает индикатор загрузки
       */
      _showLoadingIndicator: fHelpers.forAliveOnly(function(message){
         var self = this;
         message = message !== undefined ? message : this._options.indicatorSavingMessage;
         this._showedLoading = true;
         setTimeout(function(){
            if (self._showedLoading) {
               if (self._loadingIndicator && !self._loadingIndicator.isDestroyed()) {
                  self._loadingIndicator.setMessage(message);
               } else {
                  self._loadingIndicator = new LoadingIndicator({
                     parent: self._panel,
                     showInWindow: true,
                     modal: true,
                     message: message,
                     name: self.getId() + '-LoadingIndicator'
                  });
               }
            }
         }, 750);
      }),
      /**
       * Скрывает индикатор загрузки
       */
      _hideLoadingIndicator: function(){
         this._showedLoading = false;
         if(!this.isDestroyed() && this._loadingIndicator) {
            this._loadingIndicator.hide();
         }
      },
      _updateIndicatorZIndex: function(){
         var indicatorWindow = this._loadingIndicator && this._loadingIndicator.getWindow();
         if (indicatorWindow && this._loadingIndicator.isVisible()){
            indicatorWindow._updateZIndex();
         }
      },
      _processError: function(e) {
         var
            eResult = this._notify('onFail', e),
            eMessage = e && e.message;
         if(eResult || eResult === undefined) { // string, undefined
            if(typeof eResult == 'string') {
               eMessage = eResult;
            }
            if(eMessage) {
               fcHelpers.alert(eMessage).addCallback(function(result){
                  if (e.httpError == 403){
                     this._closePanel();
                  }
               }.bind(this));
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
      _closePanel: function(result){
         //Если задача открыта в новом окне, то FormController лежит не во floatArea => нет панели, которую нужно закрывать
         if (this._panel.close){
            this._panel.close(result);
         }
      },
      /**
       * Возвращает источник данных диалога редактирования.
       * @deprecated
       * @return {Object} Объект с конфигурацией источника данных.
       * @remark
       * Также для диалога редактирования может быть по умолчанию установлен источник данных. Это происходит при его вызове через {@link SBIS3.CONTROLS.DialogActionBase}.
       * @example
       * В примере продемонстрирована задача изменения списочного метода источника данных
       * <pre>
       * var dataSource = this.getDataSource(); // Получаем объект источника данных
       * dataSource.setBindings({ // Устанавливаем метод чтения записи
       *    read: 'ПрочитатьКарточкуСотрудника'
       * });
       * </pre>
       * @see dataSource
       * @see getDataSource
       */
      getDataSource: function(){
         return this._dataSource;
      },
      /**
       * Возвращает признак: новая запись или нет.
       * @returns {Boolean} true - запись создана, но не сохранена в источнике данных диалога.
       */
      isNewRecord: function(){
         return this._newRecord;
      },
      setDataSource: function (source, config) {
         throw new Error('FormController: Задавать источник данных необходимо через опцию dataSource. Подробнее https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/create/');
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
      setRecord: function(record, updateKey){
         var newKey;
         this._options.record = record;
         this._setPanelRecord(record);
         if (updateKey){
            newKey = this._getRecordId();
            this._options.key = newKey;
            this._newRecord = true;
         }
         this._updateDocumentTitle();
         this._setContextRecord(record);
         var self = this;
         this._panelReadyDeferred.addCallback(function(){
            self._actionNotify('onAfterFormLoad');
         });
      },
      _setPanelRecord: function(record){
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
      getRecord: function(){
        return this._options.record;
      },


      _getRecordId: function(){
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
      _create: function(config){
         var createConfig = {
               indicatorText: rk('Загрузка'),
               eventName: 'onCreateModel'
            },
            self = this,
            createDeferred = this._dataSource.create(this._options.initValues);

         createDeferred.addCallback(function(record){
            self.setRecord(record, true);
            return record;
         }).addBoth(function(data){
            self._activateChildControlAfterLoad();
            return data;
         });
         return this._prepareSyncOperation(createDeferred, config, createConfig);
      },
      /**
       * Удаляет запись из источника данных диалога.
       * @param {Object} [config] Конфигурация команды.
       * @param {Boolean} [config.hideIndicator=false] Не показывать индикатор.
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
      _destroyModel: function(cfg){
         var record = this._options.record,
            config = cfg || {},
            self = this,
            destroyConfig = {
               hideIndicator: config.hideIndicator ? config.hideIndicator : true,
               eventName: 'onDestroyModel',
               hideErrorDialog: true
            },
            def = this._dataSource.destroy(this._getRecordId());

         return this._prepareSyncOperation(def, config, destroyConfig).addBoth(function(data){
            self._newRecord = false;
            record.setState(Record.RecordState.DELETED);
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
      _read: function (config) {
         var readConfig = {
               indicatorText: rk('Загрузка'),
               eventName: 'onReadModel'
            },
            self = this,
            key = (config && config.key) || this._options.key,
            readDeferred;

         readDeferred = this._dataSource.read(key, this._options.readMetaData).addCallback(function(record){
            self.setRecord(record);
            return record;
         }).addBoth(function(data){
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
       * При сохранении записи происходит проверка всех <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/validation/'>валидаторов</a> диалога.
       * Если на одном из полей ввода валидация будет не пройдена, то сохранение записи отменяется, и пользователь увидит сообщение "Некорректно заполнены обязательные поля!".
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

      _showConfirmDialog: function(){
         this._confirmDialog = InformationPopupManager.showConfirmDialog({
               message: rk('Сохранить изменения?'),
               details: rk('Чтобы продолжить редактирование, нажмите "Отмена".'),
               hasCancelButton: true
            },
            this._confirmDialogHandler.bind(this, true),
            this._confirmDialogHandler.bind(this, false),
            this._confirmDialogHandler.bind(this)
         );
      },

      _prepareUpdatingRecord: function(config){
         var error = new Error(rk('Некорректно заполнены обязательные поля!')),
             self = this,
             updateDeferred = new Deferred(),
             onBeforeUpdateData;

         updateDeferred.addErrback(function (e) {
            return e;
         });

         if (this.validate()) {
            //Событие onBeforeUpdateModel необходимо для пользовательской валидации.
            //Из события можно вернуть как Boolean(либо Error, который приравнивается к false), так и Deferred
            //FormController не продолжает сохранение записи, если пользовательский результат будет равен false (либо Error)
            //В случае, если пользователь вернул Error, текст ошибки будет взят из error.message.
            onBeforeUpdateData = this._prepareOnBeforeUpdateResult(this._notify('onBeforeUpdateModel', this.getRecord()));
            if (onBeforeUpdateData.result instanceof Deferred){
               onBeforeUpdateData.result.addBoth(function(result){
                  onBeforeUpdateData = self._prepareOnBeforeUpdateResult(result);
                  if (onBeforeUpdateData.result !== false){
                     updateDeferred.dependOn(self._updateRecord(config));
                  }
                  else{
                     updateDeferred.errback(onBeforeUpdateData.errorMessage);
                  }
               });
               return updateDeferred;
            }
            else if (onBeforeUpdateData.result === false) {
               return Deferred.fail(onBeforeUpdateData.errorMessage);
            }
            return this._updateRecord(config);
         }

         //Если валидация не прошла
         if (!config.hideErrorDialog) {
            this._processError(error);
         }
         return Deferred.fail(error);
      },

      _updateRecord: function(config){
         var dResult = new Deferred(),
             updateConfig = {
               indicatorText: this._options.indicatorSavingMessage,
               eventName: 'onUpdateModel',
               additionalData: {
                  isNewRecord: this._newRecord
               }
            },
            self = this;

         if (this._options.record.isChanged() || self._newRecord) {
            this._updateDeferred = this._dataSource.update(this._getRecordForUpdate()).addCallback(function (key) {
               updateConfig.additionalData.key = key;
               self._newRecord = false;
               return key;
            }).addErrback(function (error) {
               self._updateDeferred = false;
               return error;
            });
            dResult.dependOn(this._prepareSyncOperation(this._updateDeferred, config, updateConfig));
         } else {
            dResult.callback();
         }
         dResult.addCallback(function (result) {
            self._updateDeferred = false; //в 230+ версии можно перенести в колбэк самого _updateDeferred, когда выпилится опция source
            if (config.closePanelAfterSubmit) {
               self._closePanel(true);
            }
            return result;
         });
         return dResult;
      },

      _confirmDialogHandler: function (result) {
         if (result) {
            this._prepareUpdatingRecord({
               closePanelAfterSubmit: true
            })
         }
         else if (result === false) {
            this._closePanel(false);
         } else {
            this._panel.onBringToFront();
         }
      },

      _prepareOnBeforeUpdateResult: function(result){
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

      _prepareSyncOperation: function(operation, commonConfig, operationConfig){
         var self = this,
             config = cFunctions.clone(commonConfig || {});
         config = cMerge(commonConfig, operationConfig);

         if (!config.hideIndicator){
            this._showLoadingIndicator(config.indicatorText);
         }
         if (!config.additionalData){
            config.additionalData = {};
         }
         config.additionalData.idProperty = self._options.idProperty;
         this._toggleOverlay(true);
         this._addSyncOperationPending();

         operation.addCallback(function(data){
            self._notify(config.eventName, self._options.record, config.additionalData);
            return data;
         }).addErrback(function(err){
               //Не показываем ошибку, если было прервано соединение с интернетом. просто скрываем индикатор и оверлей
               if (!config.hideErrorDialog && (err instanceof Error) && !err._isOfflineMode){
                  self._processError(err);
               }
               return err;
         }).addBoth(function(result){
               self._removeSyncOperationPending();
               self._hideLoadingIndicator();
               self._toggleOverlay(false);
               return result;
         });
         return operation;
      },

      _toggleOverlay: function(show){
         if (!this._overlay){
            this._overlay = $('<div class="controls-FormController-overlay ws-hidden"></div>').appendTo(this.getContainer());
         }
         this._overlay.toggleClass('ws-hidden', !show);
      },

      _addSyncOperationPending: function(){
         this._removeSyncOperationPending();
         this._syncOperationCallback = new Deferred();
         this._panel.addPendingOperation(this._syncOperationCallback);
      },
      _removeSyncOperationPending: function(){
         if (this._syncOperationCallback && !this._syncOperationCallback.isReady()){
            this._syncOperationCallback.callback();
         }
      },
      /**
       * Производит оповещение о том, что произошло событие диалога. Логика обработки события будет произведена на стороне {@link SBIS3.CONTROLS.OpenDialogAction}, а не в диалоге.
       * @remark
       * Подрообнее об этом вы можете прочитать в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/synchronization/#event-processing'>Обработка события диалога редактирования в SBIS3.CONTROLS.OpenDialogAction</a>.
       * @param {String} eventName Имя события.
       * @param {*} additionalData Данные, которые должны быть переданы в качестве аргументов события.
       * @command notify
       * @see read
       * @see create
       * @see update
       * @see destroy
       */
      _actionNotify: function(eventName, additionalData){
         additionalData = additionalData || {};
         this._notify(eventName, this._options.record, additionalData);
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
      _createChildControlActivatedDeferred: function(){
         this._activateChildControlDeferred = (new Deferred()).addCallback(function(){
            this.activateFirstControl();
         }.bind(this));
         return this._activateChildControlDeferred;
      },
      _activateChildControlAfterLoad: function(){
         if (this._activateChildControlDeferred instanceof Deferred){
            this._activateChildControlDeferred.callback();
            this._activateChildControlDeferred = undefined;
         }
         else{
            this.activateFirstControl();
         }
      },

      destroy: function(){
         this._panel.unsubscribe('onAfterShow', this._onAfterShowHandler);
         this._panel.unsubscribe('onBeforeClose', this._onBeforeCloseHandler);
         this.unsubscribeFrom(EventBus.channel('navigation'), 'onBeforeNavigate', this._onBeforeNavigateHandler);
         window.removeEventListener('beforeunload', this._onBeforeUnloadHandler);
         FormController.superclass.destroy.apply(this, arguments);
      }
   });
      //Функционал, позволяющий с прототипа компонента вычитать запись до инициализации компонента и прокинуть ее в опции. Сделано в рамках ускорения
      FormController.prototype.getRecordFromSource = function (opt) {
         var options = this.getComponentOptions(opt),
             dataSource,
             result;

         //TODO в рамках совместимости
         if (Object.isEmpty(options.dataSource) && !options.source){
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.FormController', 'Необходимо задать опцию dataSource');
            return false;
         }

         options.source = this.createDataSource(options);

         if (options.key){
            result = options.source.read(options.key, options.readMetaData);
         }
         else{
            result = options.source.create(options.initValues);
         }
         return result;
      };

      FormController.prototype.createDataSource = function(options){
         if (!cInstance.instanceOfModule(options.source, 'WS.Data/Source/Base')) {
            return new SbisService(options.dataSource);
         }
         return options.source;
      };

      FormController.prototype.getComponentOptions = function(mergeOptions) {
         return OpenDialogUtil.getOptionsFromProto(this, mergeOptions)
      };
   return FormController;

});