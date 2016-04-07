define('js!SBIS3.CONTROLS.FormController', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CORE.LoadingIndicator', 'i18n!SBIS3.CONTROLS.FormController'],
   function(CompoundControl, LoadingIndicator, rk) {
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
         this._publish('onSubmit', 'onFail', 'onSuccess');
         $ws.single.CommandDispatcher.declareCommand(this, 'submit', this.submit);
         this._panel = this.getTopParent();
         if (this._options.dataSource){
            this._runQuery();
         } else {
            this._setContextRecord(this._options.record);
         }

         //Выписал задачу, чтобы при событии onBeforeClose стрелял метод у floatArea, который мы бы переопределили здесь,
         //чтобы не дергать getTopParent
         this._panel.subscribe('onBeforeClose', function(event){
            //Если попали сюда из метода _saveRecord, то this._saving = true и мы просто закрываем панель
            if (this._saving || !(this._options.record && this._options.record.isChanged())){
               this._saving = false;
               return;
            }
            event.setResult(false);
            this._saveRecord();
         }.bind(this));

         this._panel.subscribe('onAfterShow', this._updateIndicatorZIndex.bind(this));
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
         var errorMessage = rk('Некорректно заполнены обязательные для заполнения поля!'),
             self = this,
             def;
         if (this.validate()) {
            def = this._options.dataSource.update(this._options.record);
            this._showLoadingIndicator();
            dResult.dependOn(def.addCallbacks(function (result) {
               self._notify('onSuccess', result);
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

      _readRecord: function(key){
         return this._options.dataSource.read(key);
      },

      _setContextRecord: function(record){
         this.getLinkedContext().setValue('record', record);               
      },
      /**
       * Показывает индикатор загрузки
       */
      _showLoadingIndicator: $ws.helpers.forAliveOnly(function(message){
         var self = this;
         this._showedLoading = true;
         if(this._loadingIndicator && !this._loadingIndicator.isDestroyed()){
            setTimeout(function(){
               if (self._showedLoading) {
                  self._loadingIndicator.show(self._options.indicatorSavingMessage);
               }
            }, 750);
         } else {
            this._loadingIndicator = new LoadingIndicator({
               parent: this._panel,
               showInWindow: true,
               modal: true,
               message: message !== undefined ? message : this._options.indicatorSavingMessage,
               name: this.getId() + '-LoadingIndicator'
            });
         }
      }),
      /**
       * Скрывает индикатор загрузки
       */
      _hideLoadingIndicator: $ws.helpers.forAliveOnly(function(){
         if(this._loadingIndicator) {
            this._showedLoading = false;
            this._loadingIndicator.hide();
         }
      }),
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
               $ws.helpers.message(eMessage);
            }
         }
         e.processed = true;
         return e;
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
         this._runQuery();
      },
      /**
       * Установаливает запись диалогу редактирования
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @see record
       */
      setRecord: function(record){
         this._options.record = this._panel._record = record;
         this._setContextRecord(record);
      },

      _runQuery: function() {
         var self = this,
            hdl;
         this._showLoadingIndicator(rk('Загрузка'));
         if (this._options.key) {
            hdl = this._readRecord(this._options.key);
         }
         else {
            hdl = this._options.dataSource.create(this._options.initValues);
         }
         hdl.addCallback(function(record){
            self.setRecord(record);
         });
         hdl.addBoth(function(r){
            self._hideLoadingIndicator();
            return r;
         });
      }
   });

   return FormController;

});