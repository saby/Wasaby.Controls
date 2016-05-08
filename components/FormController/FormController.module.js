define('js!SBIS3.CONTROLS.FormController', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CORE.LoadingIndicator', 'js!SBIS3.CONTROLS.Data.Record', 'i18n!SBIS3.CONTROLS.FormController'],
   function(CompoundControl, LoadingIndicator, Record) {
   /**
    * Компонент, на основе которого создают диалоги редактирования записей
    *
    * Он позволяет решить задачу открытия диалога редактирования в новой вкладке веб-браузера.
    * Ранее задача решалась крайне сложным образом, что требовало создания нового подхода.
    * Теперь для диалога редактирования можно указать источник, который будет соответствовать источнику представления данных.
    * Поэтому теперь для открытия в новой вкладке требуется передать всего лишь идентификатор записи, которая будет подгружена из источника.
    *
    * @class SBIS3.CONTROLS.FormController
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   'use strict';

   var FormController = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.FormController.prototype */ {
      /**
       * @event onFail При неудачном сохранении записи
       * Событие, происходящее в случае неудачного сохранения записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} error Ошибка.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onFail', function(event, error){
       *       $ws.core.alert('Все сломалось потому, что ' + error.message);
       *    });
       * </pre>
       */
      /**
       * @event onSuccess При успешном сохранении записи
       * Событие в случае успешного сохранения записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean} result Результат выполнения операции.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onSuccess', function(event, result){
       *      if (result)
       *        $ws.core.message('Все хорошо!');
       *    });
       * </pre>
       */
      $protected: {
         _record: null,
         _saving: false,
         _loadingIndicator: undefined,
         _panel: undefined,
         _needDestroyRecord: false,
         _simpleKey: undefined,
         _options: {
            /**
             * @cfg {DataSource} Источник данных для диалога редактирования записи
             * Его нужно настроить так же, как и источник представления данных.
             * Из него по первичному ключу, переданному в опции {@link key}, подгружается запись при редактировании.
             * Имеет приоритет над записью, переданной в опции {@link record}.
             * Если источник не задан, то диалог сможет отобразить только запись из опции {@link record}.
             * @example
             * Зазадим в качестве источника данных БЛ:
             * <pre>
             *    // инициализируем источник данных БЛ
             *    var dataSource = new SbisService ({
             *       endpoint: 'Товар'
             *    });
             *    this.setDataSource(dataSource); // устанавливаем источник данных
             * </pre>
             * @see setDataSource
             */
            dataSource: null,
            /**
             * @cfg {String} Первичный ключ редактируемой записи
             * По данному ключу будет подгружена запись из источника данных, который задан опцией {@link dataSource}.
             * Если ключ не передан (null), то этот сценарий означает создание новой записи.
             * Передать ключ можно, например, в обработчике события onItemActivate при запуске редактирования записи:
             * <pre>
             * myView.subscrive('onItemActivate', function(eventObject, meta) {
             *    myOpener.execute(meta); // это opener, который управляет открытием диалога редактирования
             *    // meta - это объект, в котором присутствует id редактируемой записи
             * });
             * </pre>
             *
             */
            key: null,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Model} Редактируемая запись
             * Используется в случае, когда не задан источник данных в опции {@link dataSource}.
             */
            record: null,
            /**
             * @cfg {Object} Ассоциативный массив, который используют только при создании новой записи для инициализации её начальными значениями.
             * При редактировании существующей записи (первичный ключ не задан) опция будет проигнорирована.
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
             * @cfg {Boolean} Является ли запись только что созданной
             */
            newModel: false,
            /**
             * @cfg {String} Текст рядом с индикатором сохранения записи
             * @example
             * <pre>
             *     <option name="indicatorSavingMessage">Занят важным делом - сохраняю ваши данные.</option>
             * </pre>
             * @translatable
             */
            indicatorSavingMessage:  rk('Подождите, идёт сохранение')
         }
      },

      $constructor: function() {
         this._publish('onSubmit', 'onFail', 'onSuccess', 'onReadModel', 'onUpdateModel', 'onDestroyModel', 'onCreateModel');
         $ws.single.CommandDispatcher.declareCommand(this, 'submit', this.submit);
         $ws.single.CommandDispatcher.declareCommand(this, 'read', this._read);
         $ws.single.CommandDispatcher.declareCommand(this, 'update', this.update);
         $ws.single.CommandDispatcher.declareCommand(this, 'destroy', this._destroyModel);
         $ws.single.CommandDispatcher.declareCommand(this, 'create', this._create);
         $ws.single.CommandDispatcher.declareCommand(this, 'notify', this._actionNotify);
         this._setDefaultContextRecord();
         this._panel = this.getTopParent();
         //В рамках fc мы работаем с простым ключом. Запоминаем составной ключ, чтобы была возможность синхронизации модели со связным списком
         this._simpleKey = this._getSimpleKey(this._options.key);
         if (this._options.dataSource){
            this._runQuery();
         }
         var loadingTime = new Date();
         this.subscribe('onAfterShow', function(){
            $ws.single.ioc.resolve('ILogger').log('FormController', 'Время загрузки ' + (new Date() - loadingTime) + 'мс');
         });
         //Выписал задачу, чтобы при событии onBeforeClose стрелял метод у floatArea, который мы бы переопределили здесь,
         //чтобы не дергать getTopParent
         this._panel.subscribe('onBeforeClose', function(event, result){
            //Если попали сюда из метода _saveRecord, то this._saving = true и мы просто закрываем панель
            if (this._saving || !(this._options.record && this._options.record.isChanged() || this.isNewModel())){
               if (this._needDestroyRecord && this._options.record && (!this._saving && !this._options.record.isChanged() || result === false)){
                  this._destroyModel();
               }
               this._saving = false;
               return;
            }
            event.setResult(false);
            this._saveRecord();
         }.bind(this));

         this._panel.subscribe('onAfterShow', this._updateIndicatorZIndex.bind(this));
      },
      _setDefaultContextRecord: function(){
         var ctx = new $ws.proto.Context({restriction: 'set'}).setPrevious(this.getLinkedContext());
         ctx.setValue('record', this._options.record || new Record());
         this._context = ctx;
      },
      /**
       * Сохраняет редактируемую или создаваемую запись
       * Чтобы в связанном представлении отобразить сохраненную запись, нужно его перезагрузить с помощью метода {@link SBIS3.CONTROLS.ListView#reload}.
       * @command
       * @example
       * Сохранение записи по нажатию кнопки:
       * <pre>
       * this.getChildControlByName('Сохранить').subscribe('onActivated', function() {
       *    this.sendCommand('submit');
       * });
       * </pre>
       */
      submit: function(closePanelAfterSubmit){
        $ws.single.ioc.resolve('ILogger').info('FormController', 'Command "submit" is deprecated and will be removed in 3.7.4. Use sendCommand("update")');
        return this.update(closePanelAfterSubmit);
      },
      /**
       * Action: сохранение записи
       */
      update: function(closePanelAfterSubmit){
         return this._saveRecord(true, closePanelAfterSubmit);
      },

      _saveRecord: function(hideQuestion, closePanelAfterSubmit){
         var self = this,
             dResult = new $ws.proto.Deferred(),
             questionConfig;

         questionConfig = {
            useCancelButton: true,
            invertDefaultButton: true,
            detail: rk('Чтобы продолжить редактирование, нажмите "Отмена".')
         };
         this._saving = true;

         //Если пришли из submit'a
         if (hideQuestion){
            return this._updateRecord(dResult, closePanelAfterSubmit);
         }
         else{
            $ws.helpers.question(rk('Сохранить изменения?'), questionConfig, this).addCallback(function(result){
               if (typeof result === 'string'){
                  self._saving = false;
                  return;
               }
               if (result){
                  self._updateRecord(dResult, true);
               }
               else{
                  dResult.callback();
                  self._panel.cancel();
               }
            });
         }
         return dResult;
      },

      _updateRecord: function(dResult, closePanelAfterSubmit){
         var errorMessage = rk('Некорректно заполнены обязательные поля!'),
             self = this,
             isNewModel,
             def;
         if (this.validate()) {
            def = this._options.dataSource.update(this._options.record);
            this._showLoadingIndicator();
            dResult.dependOn(def.addCallbacks(function (result) {
               isNewModel = self._options.newModel;
               self._options.newModel = false;
               self._notify('onUpdateModel', self._options.record, self._options.key, isNewModel);
               if (closePanelAfterSubmit) {
                  self._panel.ok();
               }
               else {
                  self._saving = false;
               }
               return result;
            }, function (error) {
               self._processError(error);
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
       * Action: Подгружаем запись из источника данных по ключу
       * @param {String} key Первичный ключ записи
       * @returns {$ws.proto.Deferred} Окончание чтения
       * @example
       * <pre>
       *   control.sendCommand('read').addBoth(function(){
       *      console.log('запись прочитана');
       *   })
       * </pre>
       * @command
       */
      _read: function (key) {
         var self = this;
         key = key || this._simpleKey;
         this._showLoadingIndicator(rk('Загрузка'));
         return this._options.dataSource.read(key).addCallback(function (record) {
            self._notify('onReadModel', record);
            self.setRecord(record);
            return record;
         }).addErrback(function (error) {
               self._processError(error);
               return error;
            }).addBoth(function (r) {
               self._hideLoadingIndicator();
               self.activateFirstControl();
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
      /**
       * Признак, является ли запись, редактируемая диалогом, только что созданной.
       * @returns {Boolean} Возможные значения:
       * <ol>
       *    <li>true - диалог редактирования открыт для только что созданной записи;</li>
       *    <li>false - диалог редактирования открыт для уже существующей записи.</li>
       * </ol>
       */
      isNewModel: function(){
         return this._options.newModel;
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
                     this._panel.close();
                  }
               }.bind(this));
            }
         }
         e.processed = true;
         return e;
      },
      _getSimpleKey: function(key){
         return key && key.toString().split(',')[0];
      },
      /**
       * Получает источник данных диалога редактирования
       */
      getDataSource: function(){
         return this._options.dataSource;
      },
      /**
       * Устанавливает источник данных диалогу редактирования
       * @param {DataSource} source Источник данных
       * @see dataSource
       * @example
       * Зазадим в качестве источника данных БЛ:
       * <pre>
       *    // инициализируем источник данных БЛ
       *    var dataSource = new SbisService ({
       *       endpoint: 'Товар'
       *    });
       *    this.setDataSource(dataSource); // устанавливаем источник данных
       * </pre>
       */
      setDataSource: function(source){
         this._options.dataSource = source;
         return this._runQuery();
      },
      /**
       * Установаливает запись диалогу редактирования
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @param {Boolean} updateKey
       * @see record
       */
      setRecord: function(record, updateKey){
         var newKey;
         this._options.record = this._panel._record = record;
         if (updateKey){
            newKey = record.getKey();
            this._options.key = newKey;
            this._simpleKey = this._getSimpleKey(newKey);
         }
         this._needDestroyRecord = false;
         this._setContextRecord(record);
      },

      /**
       * Action: дестрой записи
       */
      _destroyModel: function(){
         this._options.dataSource.destroy(this._options.record.getId());
         this._notify('onDestroyModel', this._options.record)
      },

      _runQuery: function() {
         if (this._simpleKey) {
            return this._read();
         }
         return this._create();
      },
      /**
       * Action: создать запись
       */
      _create: function(){
         var self = this,
            def;
         this._showLoadingIndicator(rk('Загрузка'));
         def = this._options.dataSource.create(this._options.initValues).addCallback(function(record){
            self._notify('onCreateModel', record);
            self.setRecord(record, true);
            self._options.newModel = record.getKey() === null || self._options.newModel;
            if (record.getKey()){
               self._needDestroyRecord = true;
            }
            return record;
         });
         def.addBoth(function(record){
            self._hideLoadingIndicator();
            self.activateFirstControl();
            return record;
         });
         return def;
      },
      /**
       * Action, который пробрасывает событие до dialogActionBase в обход базовой логики
       */
      _actionNotify: function(eventName){
         this._notify(eventName, this._options.record);
      }
   });

   return FormController;

});