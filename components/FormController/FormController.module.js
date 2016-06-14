define('js!SBIS3.CONTROLS.FormController', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CORE.LoadingIndicator', 'js!SBIS3.CONTROLS.Data.Record', 'js!SBIS3.CONTROLS.Data.Source.SbisService', 'i18n!SBIS3.CONTROLS.FormController'],
   function(CompoundControl, LoadingIndicator, Record, SbisService) {
   /**
    * Компонент, на основе которого создают диалоги редактирования записей.
    * Подробнее о создании диалогов вы можете прочитать в разделе документации <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/">Диалоги редактирования</a>.
    *
    * @class SBIS3.CONTROLS.FormController
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @author Красильников Андрей Сергеевич
    */
   'use strict';

   var FormController = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.FormController.prototype */ {
      /**
       * @typedef {Object} dataSource
       * @property {SBIS3.CONTROLS.Data.Source.ISource/Binding.typedef[]} [Binding] Соответствие методов CRUD+ контракту
       * @property {SBIS3.CONTROLS.Data.Source.ISource/Endpoint.typedef[]} [endpoint] Конечная точка, обеспечивающая доступ клиента к функциональным возможностям источника данных
       * @property {String} [model=source.sbis-service] Название зависимости, или конструктор объекта или инстанс объекта
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
       * @param {SBIS3.CONTROLS.Data.Record} record Запись, прочитанная из источника данных (см. {@link dataSource}).
       * @see read
       * @see dataSource
       * @see onCreateModel
       * @see onUpdateModel
       * @see onDestroyModel
       * @see onFail
       */
      /**
       * @event onUpdateModel Происходит при сохранении записи в источнике данных диалога редактирования.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Record} record Сохраняемая запись.
       * @param {String} key Первичный ключ сохраняемой записи.
       * @see submit
       * @see update
       * @see onCreateModel
       * @see onDestroyModel
       * @see onReadModel
       * @see onFail
       */
      /**
       * @event onDestroyModel Происходит при удалении записи из источника данных диалога редактирования.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Record} record Запись, которая была удалена из источника данных (см. {@link dataSource}).
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
       * @param {SBIS3.CONTROLS.Data.Record} record Запись, которая была создана в источнике данных.
       * При создании часть полей может быть предустановлена с помощью опции {@link initValues}.
       * @see create
       * @see onDestroyModel
       * @see onUpdateModel
       * @see onReadModel
       * @see onFail
       */
      $protected: {
         _record: null,
         _saving: false,
         _loadingIndicator: undefined,
         _panel: undefined,
         _newRecord: false, //true - если запись создана, но еще не сохранена
         _activateChildControlDeferred: undefined,
         _previousDocumentTitle: undefined,
         _dataSource: null,
         _options: {
            /**
             * @cfg {String} Устанавливает первичный ключ записи, редактируемой на диалоге.
             * @remark
             * По данному ключу будет подгружена запись из источника данных, установленного опцией {@link dataSource}.
             * Если ключ не передан (null), то этот сценарий означает создание новой записи.
             * Ключ устанавливается при вызове диалога редактирования через {@link SBIS3.CONTROLS.DialogActionBase}.
             * Подробнее об этом вы можете прочитать в разделе документации <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component-control/">Управление диалогом редактирования списка</a>.
             * </pre>
             * @see record
             * @see dataSource
             */
            key: null,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Record} Устанавливает запись, редактируемую на диалоге.
             * @remark
             * Опция используется в том случае, когда не установлен источник данных диалога в опции {@link dataSource}.
             * Чтобы установить запись, используют метод {@link setRecord}.
             * @see setRecord
             * @see key
             * @see dataSource
             */
            record: null,
            /**
             * @cfg {Object} Устанавливает ассоциативный массив, который используют только при создании новой записи для инициализации её начальными значениями.
             * @remark
             * При редактировании существующей записи (первичный ключ не задан) опция будет проигнорирована.
             * Данные для инициализации могут быть переданы со стороны {@link SBIS3.CONTROLS.DialogActionBase} при вызове диалога редактирования.
             * Подробнее об этом вы можете прочитать в разделе документации <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component-control/">Управление диалогом редактирования списка</a>.
             * @example
             * Дополним создаваемую карточку товаров информация, что это новинка:
             * <pre>
             * _options: {
             *    initValue: {
             *       'Новинка': true
             *    }
             * }
             * </pre>
             * Или через вёрстку
             * <pre>
             * <options name="columns" type="array">
             *    <option name="Новинка" type="boolean">true</option>
             * </options>
             * </pre>
             */
            initValues: null,
             /**
             * @cfg {String} Устанавливает текст, отображаемый рядом с индикатором при сохранении записи.
             * @remark
             * Опция актуальна для события {@link onUpdateModel}.
             * @translatable
             * @see update
             * @see submit
             * @see onUpdateModel
             */
            indicatorSavingMessage:  rk('Подождите, идёт сохранение'),
            /**
             * @cfg {dataSource} Соответствие методов CRUD+ методам БЛ.
             */
            dataSource: {
            }
         }
      },

      $constructor: function() {
         this._publish('onFail', 'onReadModel', 'onUpdateModel', 'onDestroyModel', 'onCreateModel');
         $ws.single.CommandDispatcher.declareCommand(this, 'submit', this.submit);
         $ws.single.CommandDispatcher.declareCommand(this, 'read', this._read);
         $ws.single.CommandDispatcher.declareCommand(this, 'update', this.update);
         $ws.single.CommandDispatcher.declareCommand(this, 'destroy', this._destroyModel);
         $ws.single.CommandDispatcher.declareCommand(this, 'create', this._create);
         $ws.single.CommandDispatcher.declareCommand(this, 'notify', this._actionNotify);
         $ws.single.CommandDispatcher.declareCommand(this, 'activateChildControl', this._createChildControlActivatedDeferred);
         this._updateDocumentTitle();
         this._setDefaultContextRecord();
         this._panel = this.getTopParent();
         //для совместимости со старыми формами создает источник данных только если в опциях на прототипе есть данные об источнике данных
         //в противном случае люди сами устанавливать источник
         this._dataSource = this._options.source;
         if(this._options.dataSource && this._options.dataSource.endpoint) {
            this._dataSource = this._dataSource || FormController.prototype.createDataSource(this._options);
            if (!this._options.record){
               this._getRecordFromSource({});
            }
         }
         var loadingTime = new Date();
         this.subscribe('onAfterShow', function(){
            $ws.single.ioc.resolve('ILogger').log('FormController', 'Время загрузки ' + (new Date() - loadingTime) + 'мс');
         });
         //Выписал задачу, чтобы при событии onBeforeClose стрелял метод у floatArea, который мы бы переопределили здесь,
         //чтобы не дергать getTopParent
         this._panel.subscribe('onBeforeClose', function(event, result){
            var record = this._options.record;
            //Если попали сюда из метода _saveRecord, то this._saving = true и мы просто закрываем панель
            if (this._saving || !(record && record.isChanged())){
               //Дестроим запись, когда выполнены три условия
               //1. если это было создание
               //2. если есть ключ (метод создать его вернул)
               //3. ничего не поменяли в рекорде, но закрывают либо поменяли, но нажали нет
               if (this._newRecord && record.getKey() && (!this._saving && !record.isChanged() || result === false)){
                  this._destroyModel();
               }
               this._saving = false;
               this._resetTitle();
               return;
            }
            event.setResult(false);
            this._saveRecord({});
         }.bind(this));

         this._panel.subscribe('onAfterShow', this._updateIndicatorZIndex.bind(this));
      },
      _setDefaultContextRecord: function(){
         var ctx = new $ws.proto.Context({restriction: 'set'}).setPrevious(this.getLinkedContext());
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

      /**
       * Используйте команду update
       * @command
       * @see update
       * @deprecated
       */
      submit: function(closePanelAfterSubmit){
        $ws.single.ioc.resolve('ILogger').info('FormController', 'Command "submit" is deprecated and will be removed in 3.7.4. Use sendCommand("update")');
        return this.update(closePanelAfterSubmit);
      },
      /**
       * Сохранить запись в источнике данных диалога редактирования.
       * @param {Object} config
       *    Структура конфига:
       *    {
       *      closePanelAfterSubmit: Boolean,      //Закрывать панель после сохранения
       *      hideErrorDialog: Boolean,            //Не показывать сообещние при ошибке
       *      hideIndicator: Boolean               //Не показывать индикатор
       *     }
       * @remark
       * При сохранении записи происходит проверка всех валидаторов диалога редактирования.
       * Если на одном из полей ввода валидация будет не пройдена, то сохранение записи отменяется, и пользователь увидит сообщение "Некорректно заполнены обязательные поля!".
       * Подробнее о настройке валидаторов для полей ввода диалога редактирования вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/validation/">Валидация вводимых данных</a>.
       * <br/>
       * Если процесс сохранения записи происходит длительное время, то в пользовательском интерфейсе будет выведено сообщение "Подождите, идёт сохранение". Текст сообщения можно конфигурировать с помощью опции {@link indicatorSavingMessage}.
       * <br/>
       * При успешном сохранении записи происходит событие {@link onUpdateModel}, а в случае ошибки - {@link onFail}.
       * <br/>
       * Источник данных для диалога редактирования устанавливают с помощью опции {@link dataSource}.
       * @param {Boolean} [closePanelAfterSubmit=false] Признак, по которому устанавливают закрытие диалога редактирования после сохранения записи в источнике данных. В значении true диалог редактирования будет закрыт.
       * @example
       * В следующем примере организовано сохранение редактируемой записи по нажатию на кнопку:
       * <pre>
       * this.getChildControlByName('Сохранить').subscribe('onActivated', function() { // Создаём обработчик нажатися на кнопку сохранения на кнопку
       *    this.sendCommand('update'); // Отправляем команду для сохранения диалога редактирования
       * });
       * </pre>
       * @command
       * @see read
       * @see destroy
       * @see create
       * @see notify
       * @see onUpdateModel
       * @see onFail
       * @see dataSource
       */
      update: function(config){
         if (typeof(config) !== 'object'){
            config = {
               closePanelAfterSubmit: config
            };
            $ws.single.ioc.resolve('ILogger').log('FormController', 'команда update в качестве аргумента принимает объект');
         }
         config.hideQuestion = true;
         return this._saveRecord(config);
      },

      _saveRecord: function(config){
         var self = this,
             dResult = new $ws.proto.Deferred(),
             questionConfig;

         questionConfig = {
            useCancelButton: true,
            invertDefaultButton: true,
            detail: rk('Чтобы продолжить редактирование, нажмите "Отмена".')
         };
         this._saving = true;

         //Если пришли из update
         if (config.hideQuestion){
            return this._updateRecord(dResult, config);
         }
         else{
            $ws.helpers.question(rk('Сохранить изменения?'), questionConfig, this).addCallback(function(result){
               if (typeof result === 'string'){
                  self._saving = false;
                  return;
               }
               if (result){
                  config.closePanelAfterSubmit = true;
                  self._updateRecord(dResult, config);
               }
               else{
                  dResult.callback();
                  self._closePanel(false);
               }
            });
         }
         return dResult;
      },

      _updateRecord: function(dResult, config){
         var errorMessage = rk('Некорректно заполнены обязательные поля!'),
             self = this,
             def;
         if (this.validate()) {
            def = this._dataSource.update(this._options.record);
            if (!config.hideIndicator){
               this._showLoadingIndicator();
            }
            dResult.dependOn(def.addCallbacks(function (result) {
               self._notify('onUpdateModel', self._options.record, self._newRecord);
               self._newRecord = false;
               if (config.closePanelAfterSubmit) {
                  self._closePanel(true);
               }
               else {
                  self._saving = false;
               }
               return result;
            }, function (error) {
               if (!config.hideErrorDialog){
                  self._processError(error);
               }
               self._saving = false;
               return error;
            }));
            dResult.addBoth(function (r) {
               self._hideLoadingIndicator();
               return r;
            });
         }
         else {
            dResult.errback(errorMessage);
            this._saving = false;
         }
         return dResult;
      },
      /**
       * Прочитать запись по первичному ключу из источника данных диалога редактирования.
       * @param {Object} config
       *    Структура конфига:
       *    {
       *      key: String,                         //Ключ записи
       *      hideErrorDialog: Boolean,            //Не показывать сообещние при ошибке
       *      hideIndicator: Boolean               //Не показывать индикатор
       *     }
       * @remark
       * В случае успешного чтения записи из источника происходит событие {@link onReadModel}, а в случае ошибки - {@link onFail}. Прочитанная запись устанавливается в контекст диалога редактирования.
       * <br/>
       * Вне зависимости от результата прочтения записи из источника, фокус будет установлен на первый дочерний контрол диалога редактирования.
       * <br/>
       * Источник данных для диалога редактирования устанавливают с помощью опции {@link dataSource}.
       * @param {String} key Первичный ключ записи, которую нужно прочитать из источника данных.
       * @returns {$ws.proto.Deferred} Объект deferred, который возвращает результат чтения записи из источника.
       * @command
       * @see update
       * @see destroy
       * @see create
       * @see notify
       * @see onReadModel
       * @see onFail
       * @see dataSource
       */
      _read: function (config) {
         var self = this,
             key;
         if (typeof(config) !== 'object'){
            key = config;
            config = {};
            $ws.single.ioc.resolve('ILogger').log('FormController', 'команда read в качестве аргумента принимает объект');
         }
         else {
            key = config.key;
         }
         key = key || this._options.key;
         if (!config.hideIndicator){
            this._showLoadingIndicator(rk('Загрузка'));
         }
         return this._dataSource.read(key).addCallback(function (record) {
            self.setRecord(record);
            self._notify('onReadModel', record);
            self._newRecord = false;
            return record;
         }).addErrback(function (error) {
               if (!config.hideErrorDialog){
                  self._processError(error);
               }
               return error;
            }).addBoth(function (r) {
               self._hideLoadingIndicator();
               self._activateChildControlAfterLoad();
               return r;
            });
      },

      _setContextRecord: function(record){
         this.getLinkedContext().setValue('record', record);
      },
      /**
       * Показывает индикатор загрузки
       */
      _showLoadingIndicator: $ws.helpers.forAliveOnly(function(message){
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
               $ws.helpers.message(eMessage).addCallback(function(result){
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
       * @remark
       * Чтобы установить источник данных, используют метод {@link setDataSource}.
       * Также для диалога редактирования может быть по умолчанию установлен источник данных. Это происходит при его вызове через {@link SBIS3.CONTROLS.DialogActionBase}.
       * @example
       * В примере продемонстрирована задача изменения списочного метода источника данных
       * <pre>
       * var dataSource = this.getDataSource(); // Получаем объект источника данных
       * dataSource.setBindings({ // Устанавливаем метод чтения записи
       *    read: 'ПрочитатьКарточкуСотрудника'
       * });
       * @see dataSource
       * @see getDataSource
       */
      getDataSource: function(){
         return this._dataSource;
      },
      /**
       * Устанавливает источник данных диалогу редактирования.
       * @remark
       * Для диалога редактирования может быть по умолчанию установлен источник данных. Это происходит при вызове диалога через {@link SBIS3.CONTROLS.DialogActionBase}.
       * Чтобы получить объект источника данных, используют метод {@link getDataSource}.
       * @param {DataSource} source Источник данных.
       * @param {Object} config
       *    Структура конфига:
       *    {
       *      hideErrorDialog: Boolean,            //Не показывать сообещние при ошибке
       *      hideIndicator: Boolean               //Не показывать индикатор
       *    }
       * @example
       * <pre>
       *    var dataSource = new SbisService({ // Инициализация источника данных
       *       endpoint: 'Товар' // Устанавливаем объект бизнес-логики
       *    });
       *    this.setDataSource(dataSource); // Устанавливаем источник данных диалогу редактирования
       * </pre>
       * @see dataSource
       * @see getDataSource
       */
      setDataSource: function(source, config){
         $ws.single.ioc.resolve('ILogger').log('FormController', 'Метод setDataSource в скором времени будет удален, задать источник данных необходимо через конфигурацию dataSource');
         this._dataSource = source;
         return this._getRecordFromSource(config)
      },
      _setDataSource: function(source){
         this._dataSource = source;
      },
      /**
       * Устанавливает запись диалогу редактирования.
       * @remark
       * Новая запись будет добавление в контекст диалога редактирования в свойство "record".
       * @param {SBIS3.CONTROLS.Data.Model} record Запись источника данных.
       * @param {Boolean} [updateKey=false] Признак, по которому устанавливают необходимость обновления значения опции {@link key}.
       * @see record
       * @see key
       */
      setRecord: function(record, updateKey){
         var newKey;
         this._options.record = this._panel._record = record;
         if (updateKey){
            newKey = record.getKey();
            this._options.key = newKey;
         }
         this._updateDocumentTitle();
         this._setContextRecord(record);
      },
      /**
       * Удалить запись из источника данных диалога редактирования.
       * @remark
       * При удалении происходит событие {@link onDestroyModel}.
       * <br/>
       * Источник данных для диалога редактирования устанавливают с помощью опции {@link dataSource}.
       * @command
       * @see update
       * @see read
       * @see create
       * @see notify
       * @see onDestroyModel
       * @see dataSource
       */
      _destroyModel: function(){
         this._dataSource.destroy(this._options.record.getId());
         this._notify('onDestroyModel', this._options.record)
      },

      _getRecordFromSource: function(config) {
         if (this._options.key) {
            return this._read(config);
         }
         return this._create(config);
      },
      /**
       * Создать новую запись в источнике данных диалога редактирования.
       * @param {Object} config
       *    Структура конфига:
       *    {
       *      hideErrorDialog: Boolean,            //Не показывать сообещние при ошибке
       *      hideIndicator: Boolean               //Не показывать индикатор
       *     }
       * @remark
       * В новой записи часть полей может быть предустановлена с помощью опции {@link initValues}.
       * <br/>
       * В случае успешного создания записи в источнике данных происходит событие {@link onCreateModel}. Созданная запись устанавливается в контекст диалога редактирования.
       * <br/>
       * После создания новой записи фокус будет установлен на первый дочерний контрол диалога редактирования.
       * <br/>
       * Источник данных для диалога редактирования устанавливают с помощью опции {@link dataSource}.
       * @returns {SBIS3.CONTROLS.Data.Record|$ws.proto.Deferred} Созданная запись либо результат выполнения команды.
       * @command
       * @see read
       * @see update
       * @see destroy
       * @see notify
       * @see onCreateModel
       * @see onFail
       * @see dataSource
       */
      _create: function(config){
         var self = this,
            def;
         config = config || {};
         if (!config.hideIndicator){
            this._showLoadingIndicator(rk('Загрузка'));
         }
         def = this._dataSource.create(this._options.initValues).addCallback(function(record){
            self._notify('onCreateModel', record);
            self.setRecord(record, true);
            self._newRecord = true;
            return record;
         });
         def.addBoth(function(r){
            if (!config.hideErrorDialog && (r instanceof Error)){
               self._processError(r);
            }
            self._hideLoadingIndicator();
            self._activateChildControlAfterLoad();
            return r;
         });
         return def;
      },
      /**
       * Инициировать событие без выполнения базовой логики диалога редактирования.
       * @remark
       * Команда применяется для того, чтобы логика обработки события производилась на стороне {@link SBIS3.CONTROLS.DialogActionBase}.
       * @param {String} eventName Имя события, о котором нужно оповестить {@link SBIS3.CONTROLS.DialogActionBase}.
       * @param {*} additionalData Данные, которые должны быть проброшены в событие {@link SBIS3.CONTROLS.DialogActionBase}.
       * @command
       * @see read
       * @see create
       * @see update
       * @see destroy
       */
      _actionNotify: function(eventName, additionalData){
         this._notify(eventName, this._options.record, additionalData);
      },
      /**
       * Action, который позволяет выставить активность дочернего контрола после загрузки
       * @returns {$ws.proto.Deferred} Окончание чтения/создания модели
       */
      _createChildControlActivatedDeferred: function(){
         this._activateChildControlDeferred = (new $ws.proto.Deferred()).addCallback(function(){
            this.activateFirstControl();
         }.bind(this));
         return this._activateChildControlDeferred;
      },
      _activateChildControlAfterLoad: function(){
         if (this._activateChildControlDeferred instanceof $ws.proto.Deferred){
            this._activateChildControlDeferred.callback();
            this._activateChildControlDeferred = undefined;
         }
         else{
            this.activateFirstControl();
         }
      }
   });
      //todo Костыль, позволяющий с прототипа компонента вычитать запись до инициализации компонента и прокинуть ее в опции. Сделано в рамках ускорения
      FormController.prototype.getRecordFromSource = function (opt) {
         var prototypeProtectedData = {};
         this._initializer.call(prototypeProtectedData); //На прототипе опции не доступны, получаем их через initializer
         var options = prototypeProtectedData._options;
         $ws.core.merge(options, opt);
         if (!$ws.helpers.instanceOfModule(options.source, 'SBIS3.CONTROLS.Data.Source.Base')) {
            options.source = opt.source = this.createDataSource(options);
         }
         if (options.key){
            return options.source.read(options.key);
         }
         else{
            return options.source.create(options.initValues);
         }
      };

      FormController.prototype.createDataSource = function(options){
         if (!$ws.helpers.instanceOfModule(options.source, 'SBIS3.CONTROLS.Data.Source.Base')) {
            return new SbisService(options.dataSource);
         }
      };
   return FormController;

});