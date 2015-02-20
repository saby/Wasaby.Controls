/**
 * Модуль "Компонент SimpleDialogAbstract".
 *
 * @description
 */
define('js!SBIS3.CORE.DialogRecord', ['js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.LoadingIndicator'], function( Dialog, LoadingIndicator ) {

   'use strict';

   $ws._const.DialogRecord = {
      savingMessage: 'Подождите, идёт сохранение'
   };

   /**
    * Модальный диалог редактирования записи
    *
    * @class $ws.proto.DialogRecord
    * @extends $ws.proto.Dialog
    * @control
    */
   $ws.proto.DialogRecord = Dialog.extend(/** @lends $ws.proto.DialogRecord.prototype */{
      /**
       * @event onBeforeSave Перед сохранением записи
       * Событие происходит перед сохранением записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @returns {$ws.proto.Deferred|Boolean} Для отмены сохранения изменений на диалоге редактирования нужно вернуть
       * false/чтобы Deferred вернул false.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onBeforeSave', function(event){
       *       //кем бы ты ни был раньше, теперь ты Иванов
       *       this.getRecord().set('Фамилия', 'Иванов');
       *       event.setResult(true);
       *    });
       * </pre>
       */
      /**
       * @event onSave Для замены штатной процедуры сохранения
       * Событие, предназначенное для замены штатной процедуры сохранения.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @returns {$ws.proto.Deferred|Boolean} Обработка возвращаемых значений:
       * <ol>
       *    <li>false - отмена сохранения целиком,</li>
       *    <li>Deferred - своя процедура сохранения,</li>
       *    <li>любое другое - штатная процедура.</li>
       * </ol>
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onSave', function(event){
       *       //не будем сохранять
       *       event.setResult(false);
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
       * @event onRecordUpdate В момент отправки записи на сервер
       * Событие, происходящее в момент успешной отправки записи на сервер (когда сохранение уже произошло).
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number} id Идентификтор созданной/редактируемой записи.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onRecordUpdate', function(event){
       *      $ws.core.alert('Мы начали сохранять запись. Пожалуйста, не выключайте питание компьютера!');
       *    });
       * </pre>
       */
      /**
       * @event onBeforeDelete Перед удалением записи
       * Событие, происходящее перед удалением записи с диалога редактирования.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onBeforeDelete', function(event){
       *       //Если запись изменена (а значит не сохранена), запрещаем удаление
       *       event.setResult(!this.getRecord().isChanged()); //this - контрол, на который подписались - диалог редактирования
       *    });
       * </pre>
       */
      /**
       * @event onRecordDeleted После удаления записи
       * Событие, происходящее после удаления записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onRecordDeleted', function(event){
       *      $ws.core.alert('AAA! Запись удалилась и данные не вернуть!');
       *    });
       * </pre>
       */
      /**
       * @event onBeforeShowConfirmDialog Перед показом диалога подтверждения сохранения
       * Событие срабатывает перед показом диалога подтверждения сохранения.
       * Диалог подтверждения появляется при закрытии диалога редактирования, если изменённые данные не были предварительно сохранены.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Редактируемая запись.
       * @return {Boolean} Для отмены показа диалога подтверждения сохранения нужно вернуть false, запись при этом сохранится.
       * @example
       * <pre>
       *    //btn - кнопка на диалоге редактирования
       *    btn.getTopParent().subscribe('onBeforeShowConfirmDialog', function(event, record) {
       *        event.setResult(record.isChanged())
       *     });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Только для чтения
             * <wiTag group="Управление">
             * При включении режима "Только для чтения" данные диалога редактирования доступны только на просмотр.
             * @example
             * //пользователь не может менять значения контролов на диалоге редактирования
             * <pre>
             *    <option name="readOnly">true</option>
             * </pre>
             */
            readOnly: false,
            /**
             * @cfg {Boolean} Является ли запись только что созданной
             * <wiTag group="Данные">
             * @example
             * <pre>
             *     <option name="isNewRecord">true</option>
             * </pre>
             * @see isNewRecord
             */
            isNewRecord: false,
            reports: {}
         },
         /**
          * @cfg {$ws.proto.Record} record Запись, отображаемая в диалоге
          * <wiTag group="Данные">
          * Все контролы, названия которых будут совпадать с полями записи, возьмут себе значения из этой записи.
          * @example
          * <pre>
          *    var recSet;
          *    $ws.helpers.newRecordSet('Абонент', 'СписокАбонентов', undefined, 'ReaderUnifiedSBIS', false).addCallback(function (recordSet) {
          *       recSet = recordSet;
          *       recordSet.createRecord({
          *          'Имя': 'Иван',
          *          'Отчество': 'Иванич',
          *          'Фамилия': 'Ивановов'
          *       });
          *    });
          *    //record: recSet.getRecords()[0];
          * </pre>
          */
         _record: null,
         _recordSaved: false,
         _loadingIndicator: undefined, //Индикатор загрузки
         _saving: false,               //Сохраняется ли в данный момент
         _reportPrinter: null,
         _printMenu: null,
         _printMenuIsShow: false,
         _lastMenuItemList: []
      },
      $constructor: function(){
         $ws.single.CommandDispatcher.declareCommand(this, 'save', this.save);
         $ws.single.CommandDispatcher.declareCommand(this, 'delete', this.delRecord);
         $ws.single.CommandDispatcher.declareCommand(this, 'print', this.print);
         $ws.single.CommandDispatcher.declareCommand(this, 'printReport', this.printReport);

         this._publish('onBeforeDelete', 'onRecordDeleted', 'onBeforeSave', 'onSave', 'onSuccess', 'onFail',
               'onRecordUpdate', 'onBeforeShowPrintReports', 'onPrepareReportData',
               'onSelectReportTransform', 'onBeforeShowConfirmDialog');
         if(!(this._options.record instanceof $ws.proto.Record)) {
            throw new Error('Valid record required to build DialogRecord');
         } else {
            this._options.isNewRecord = this._options.record.getKey() === null || this._options.isNewRecord;
         }

         if (this.getReports().length !== 0) {
            this._reportPrinter = new $ws.proto.ReportPrinter({});
         }

         if(this._options.readOnly){
            var self = this;
            this._dRender.addCallback(function(){
               self._setEnabledForChildControls(false);
            });
         }
      },
      /**
       * Делает неизменяемыми дочерние контролы диалога
       * @param {Boolean} isEnabled
       */
      _setEnabledForChildControls: function(isEnabled){
         var childControls = this.getImmediateChildControls(),
            control;
         for(var i = 0, len = childControls.length; i < len; ++i){
            control = childControls[i];
            if (typeof(control.setReadOnly) == 'function') {
               control.setReadOnly(!isEnabled);
            } else {
               control.setEnabled(isEnabled);
            }
         }
      },
      /**
       * <wiTag noShow>
       * Уничтожение диалога с откатыванием всех изменений.
       * @see close
       */
      destroy: function(){
         this.getRecord().rollback();
         $ws.proto.DialogRecord.superclass.destroy.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Метод удаления записи с возможностью выбора закрывать ли после диалог редактирования.
       * @param withoutClose Признак закрывать ли диалог после выполнения удаления.
       * @returns {$ws.proto.Deferred}
       * @command delete
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    this.delRecord(true);
       * </pre>
       */
      delRecord: function(withoutClose){
         var self = this,
            dResult = new $ws.proto.Deferred(),
            result = self._notify('onBeforeDelete');
         if (result !== false) {
            $ws.helpers.question(typeof(result) == 'string' ? result : 'Вы действительно хотите удалить эту запись?', {}, self).addCallback(function(result){
               if (result) {
                  dResult.dependOn(self.getRecord().destroy().addCallbacks(function(r){
                     self._recordSaved = true;
                     self._notify('onSuccess', r);
                     self._notify('onRecordDeleted');
                     if (withoutClose !== true) {
                        self.ok();
                     }
                     return r;
                  }, $.proxy(self._processError, self)));
               } else {
                  dResult.callback();
               }
            });
         }
         return dResult;
      },
      /**
       * <wiTag group="Данные">
       * Метод получения записи из диалога редактирования.
       * @returns {$ws.proto.Record} Запись данного диалога.
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    this.getRecord();
       * </pre>
       */
      getRecord: function(){
         return this.getLinkedContext().getRecord();
      },
      /**
       * <wiTag group="Данные">
       * Сохраняет запись и закрывает диалог.
       * При выполнении команды save запускаются команды {@link updateRecord} и {@link ok}.
       * @param {Object} [options]
       * @param {Boolean} [options.notifyMe] Deferred, состояние которого будет зависеть от сохранения записи.
       * @param {Boolean} [options.withoutClose] Если установлен в true, то диалог не будет закрыт после сохранения.
       * @param {Boolean} [options.checkChanges] Если установлен в true, то сохранение пройдет с проверкой на версию изменений записи.
       * @param {Boolean} [options.diffOnly] Сохранять только измененные поля.
       * @return {$ws.proto.Deferred} Результат сохранения записи.
       * @command
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    this.save(undefined, true);
       * </pre>
       * @see isSaved
       */
      save: function(options) {
         var dResult = new $ws.proto.Deferred(),
            notifyMe, withoutClose, checkChanges, diffOnly;
         if (options && arguments.length == 1 && !(options instanceof $ws.proto.Deferred)){
            notifyMe = options.notifyMe;
            withoutClose = options.withoutClose;
            checkChanges = options.checkChanges;
            diffOnly = options.diffOnly;
         } else {
            notifyMe = arguments[0];
            withoutClose = arguments[1];
            checkChanges = arguments[2];
         }
         if(!this._saving){
            var self = this;
            if(this._options.readOnly){
               dResult.errback('Вы пытаетесь сохранить запись, открытую только на просмотр!');
               if (notifyMe instanceof $ws.proto.Deferred){
                  notifyMe.errback('Вы пытаетесь сохранить запись, открытую только на просмотр!');
               }
               if(withoutClose !== true) {
                  this.ok();
               }
            }
            else{
               var dWaitPending = new $ws.proto.Deferred();
               this.waitAllPendingOperations(dWaitPending);
               dWaitPending.addCallback(function(){
                  self._saving = true;
                  dResult.dependOn(
                     (function(dUpd){
                        if (notifyMe instanceof $ws.proto.Deferred) {
                           return notifyMe.dependOn(dUpd);
                        } else {
                           return dUpd;
                        }
                     })(self.updateRecord({checkChanges: checkChanges, diffOnly: diffOnly}))
                        .addBoth(function(result){
                           self._saving = false;
                           return result;
                        })
                        .addCallback(function(res){
                           if (withoutClose !== true) {
                              self.ok();
                           }
                           return res;
                        })
                  );
               });
            }
         } else {
            dResult.errback('Запись уже сохранена!');
            if(notifyMe instanceof $ws.proto.Deferred) {
               notifyMe.errback('Запись уже сохранена!');
            }
         }
         return dResult;
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
               $ws.helpers.message(eMessage, {}, this);
            }
         }
         e.processed = true;
         return e;
      },
      /**
       * Показывает индикатор загрузки
       */
      _showLoadingIndicator: $ws.helpers.forAliveOnly(function(){
         if(this._loadingIndicator){
            this._loadingIndicator.show($ws._const.DialogRecord.savingMessage);
         } else {
            this._loadingIndicator = new LoadingIndicator({
               parent: this,
               showInWindow: true,
               modal: true,
               message: $ws._const.DialogRecord.savingMessage,
               name: this.getId() + '-LoadingIndicator'
            });
         }
      }),
      /**
       * Скрывает индикатор загрузки
       */
      _hideLoadingIndicator: $ws.helpers.forAliveOnly(function(){
         if(this._loadingIndicator) {
            this._loadingIndicator.hide();
         }
      }),
      /**
       * <wiTag group="Данные">
       * Инициирует процесс обновления записи на сервере.
       * В случае успеха выполняет {@link onRecordUpdate} + {@link onSuccess}, в случае ошибки {@link onFail}.
       * @param {Object} [options]
       * @param {Boolean} [options.checkChanges] Если установлен в true, то при сохранении записи выполнится проверка версии изменений
       * @param {Boolean} [options.diffOnly] Сохранять только измененные поля
       * @returns {$ws.proto.Deferred}
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    this.updateRecord();
       * </pre>
       * @see onSuccess
       * @see onFail
       * @see onRecordUpdate
       * @see onBeforeSave
       * @see onSave
       * @see save
       */
      updateRecord: function(options) {
         var
            dResult = new $ws.proto.Deferred(),
            self = this,
            checkChanges = (options instanceof Object) ? options.checkChanges : arguments[0],
            diffOnly = (options instanceof Object) ? options.diffOnly : arguments[1],
            processingResult = function(param){
               if(param === false){
                  dResult.errback('Сохранение записи отменено в обработчике на событие onBeforeSave');
               }
               else{
                  if(self.validate()) {
                     // В этой точке потенциально начались долгие асинхронные операции...
                     self._showLoadingIndicator();
                     var oSr = self._notify('onSave'),
                        record = self.getRecord();
                     if(oSr === false) {
                        dResult.errback('Сохранение записи отменено в обработчике на событие onSave');
                     } else {
                        var saveDeferred = (oSr instanceof $ws.proto.Deferred) ? oSr : record.update({
                           consistencyCheck: checkChanges || false,
                           diffOnly: diffOnly || false
                        });
                        dResult.dependOn(saveDeferred.addCallbacks(function(result){
                           var key = record.getKey();
                           if(typeof(key) === 'number'){
                              self.getLinkedContext().setValue(record.getKeyField(), key);
                           }
                           self._notify('onRecordUpdate', result);
                           self._recordSaved = true;
                           self._options.isNewRecord = false;
                           self._notify('onSuccess', result);
                           return result;
                        }, function(error){
                           self._processError(error);
                           return error;
                        }));
                     }
                     // При любом раскладе убираем индикатор загрузки
                     dResult.addBoth(function(r){
                        self._hideLoadingIndicator();
                        return r;
                     });
                  } else {
                     dResult.errback('Некорректно заполнены обязательные для заполнения поля!');
                  }
               }
            },
            processError = function(err){
               self._processError(err);
               dResult.errback(err);
            };
         if(this._options.readOnly){
            //Логичнее кидаться errback'ом (пытались обновить запись в read-only диалоге и т д), но могут быть обработчики, которые на errback могут валить разного рода ошибки
            dResult.callback();
         }
         else{
            try{
               var oBSr = this._notify('onBeforeSave');
               if(oBSr instanceof $ws.proto.Deferred){
                  oBSr
                     .addCallback(function(res){
                        processingResult(res);
                        return res;
                     })
                     .addErrback(function(e){
                        processError(e.message);
                        return e;
                     });
               }
               else{
                  processingResult(oBSr);
               }
            } catch(e){
               processError(e);
            }
         }

         return dResult;
      },
      _openConfirmDialog:function(noHide, retDeferred){
         var retResult = true,
               result = 'noButton',
               deferred = new $ws.proto.Deferred(),
               dialog,
               record = this.getRecord();
         if (this._notify('onBeforeShowConfirmDialog', record) === false) {
            deferred.callback('yesButton');
         } else if (!this._options.readOnly && (record.isChanged() || this.isNewRecord())){
            var escPressed = false,
                  hide = noHide ? !noHide : true;
            retResult = false;
            new Dialog({
               opener: this,
               template: 'confirmRecordActionsDialog',
               resizable: false,
               handlers: {
                  onReady : function(){
                     var children = this.getChildControls();
                     dialog = this;
                     for (var i = 0, len = children.length; i < len; i++){
                        if (children[i].hasEvent('onActivated')) {
                           children[i].subscribe('onActivated', function(event){
                              dialog.getLinkedContext().setValue('result', this.getName());
                              dialog.close();
                           });
                        }
                     }
                  },
                  onKeyPressed : function (event, result){
                     if(result.keyCode == $ws._const.key.esc){
                        escPressed = true;
                        hide = false;
                        this.getLinkedContext().setValue('result', 'cancelButton');
                     }
                  },
                  onAfterClose: function(){
                     result = this.getLinkedContext().getValue('result');
                  },
                  onDestroy:function(){
                     if (!deferred.isReady()) {
                        deferred.callback(result);
                     }
                  }
               }
            });
         }
         else {
            deferred.callback(result);
         }
         return retDeferred ? deferred : retResult;
      },
      /**
       * <wiTag group="Управление">
       * Закрытие диалога.
       * @param {Boolean} success Параметр управляет поведением при закрытии диалога. Возможные значения:
       * <ol>
       *    <li>true - закрытие без сохранения изменений;</li>
       *    <li>false - закрытие с диалогом подтверждения сохранения записи при наличии изменений.</li>
       * </ol>
       * @command
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    this.close();
       * </pre>
       */
      close: function(success){
         var self = this;
         this.waitAllPendingOperations(new $ws.proto.Deferred().addCallback(function(){
            if(!this._options.readOnly && !success && this.getRecord().isChanged()){ // Запрашиваем подтверждение если сделали close() или cancel()
               var retResult = new $ws.proto.Deferred().addCallback(function(result){
                  if (result){
                     self._dialogRecordSuperClassClose([ result ]);
                  }
               });
               self._openConfirmDialog(false, true).addCallback(function(result){
                  switch (result) {
                     case 'yesButton' : {
                        self.updateRecord().addCallback(function(){
                           retResult.callback(true);
                        }).addErrback(function(){
                              retResult.callback(false);
                        });
                        break;
                     }
                     case 'noButton' : {
                        self.getRecord().rollback();
                        retResult.callback(true);
                        break;
                     }
                     default : {
                        retResult.callback(false);
                     }
                  }
               });
            } else {
               self._dialogRecordSuperClassClose([success]);
            }
         }.bind(this)));
      },
      _dialogRecordSuperClassClose : function(){
         $ws.proto.DialogRecord.superclass.close.apply(this, arguments[0]);
      },
      /**
       * <wiTag group="Данные">
       * Признак была ли запись сохранена.
       * @returns {Boolean} Возможные значения:
       * <ol>
       *    <li>true - запись сохранилась успешно;</li>
       *    <li>false - запись не сохранилась.</li>
       * </ol>
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this;
       *    if (!dialog.isSaved())
       *       dialog.save();
       * </pre>
       * @see save
       */
      isSaved: function(){
         //Если запись уже была сохранена, но после этого ее изменили, вернем false
         if (this._recordSaved && this.getRecord().isChanged()){
            return false;
         }
         return this._recordSaved;
      },
      /**
       * <wiTag group="Данные">
       * Признак режима "Только для чтения" - нельзя менять данные диалога редактирования.
       * @returns {Boolean} Возможные значения:
       * <ol>
       *    <li>true - режим "Только для чтения" включен;</li>
       *    <li>false - выключен.</li>
       * </ol>
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this;
       *    if (!dialog.isReadOnly())
       *       dialog.save();
       * </pre>
       * @see readOnly
       * @see setReadOnly
       */
      isReadOnly: function(){
         return this._options.readOnly;
      },
      /**
       * <wiTag group="Управление">
       * Изменяет состояние режима диалога редактирования "Только для чтения".
       * @param {Boolean} isReadOnly Текущее состояние параметра "Только для чтения".
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this;
       *    dialog.setReadOnly(!dialog.isReadOnly());
       * </pre>
       */
      setReadOnly: function(isReadOnly){
         this._options.readOnly = !!isReadOnly;
         this._setEnabledForChildControls(!isReadOnly);
      },
      /**
       * <wiTag group="Данные">
       * Признак является ли запись, редактируемая диалогом, только что созданной.
       * @returns {Boolean} Возможные значения:
       * <ol>
       *    <li>true - диалог редактирования открыт для только что созданной записи;</li>
       *    <li>false - диалог редактирования открыт для уже существующей записи.</li>
       * </ol>
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this;
       *    if (!dialog.isNewRecord())
       *       dialog.save();
       * </pre>
       */
      isNewRecord: function(){
         return this._options.isNewRecord;
      },
      /**
       * <wiTag group="Данные">
       * Получение списка имён всех доступных отчетов для печати.
       * @returns {Array} Возвращает список имён отчётов для печати.
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this,
       *       reports = dialog.getReports() || [];
       *    if (reports.length > 0)
       *       dialog.printReport(reports[0]);
       * </pre>
       */
      getReports: function(){
         var reports = [];
         for(var i in this._options.reports){
            if (this._options.reports.hasOwnProperty(i) && this._options.reports[i] !== undefined) {
               reports.push(i);
            }
         }
         return reports;
      },
      _printMenuItemsIsChanged: function(newItems){
         if (this._lastMenuItemList.length !== newItems.length) {
            return true;
         }
         for(var i = 0, l = newItems.length; i < l; i++){
            if (this._lastMenuItemList[i] !== newItems[i]) {
               return true;
            }
         }
         return false;
      },
      _createPrintMenu: function(reportsList){
         var self = this;
         if (!reportsList || !(reportsList instanceof Array)) {
            reportsList = this.getReports();
         }

         if(reportsList.length > 1 && ( this._printMenu === null || this._printMenuItemsIsChanged(reportsList) )){
            this._lastMenuItemList = reportsList;
            if(self._printMenu !== null){
               self._printMenu.destroy();
               self._printMenu = null;
            }
            return $ws.helpers.newContextMenu(reportsList, function(id, elem){
               self.printReport.apply(self, [elem.caption]);
            }).addCallback(function(instance){
                  self._printMenu = instance;
                  return instance;
               });
         } else {
            return new $ws.proto.Deferred().callback(this._printMenu);
         }
      },
      /**
       * <wiTag group="Данные">
       * Показать меню со списком доступных отчетов.
       * Вызывается из команды  или метода {@link print}.
       * @param e - event
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this,
       *       reports = dialog.getReports() || [];
       *    if (reports.length > 0)
       *       dialog.showReportList();
       *
       * </pre>
       * @see print
       */
      showReportList: function(e){
         if (Object.isEmpty(this._options.reports)) {
            return;
         }
         var data = this.getRecord(),
            list = this.getReports(),
            self = this,
            reports;

         reports = this._notify('onBeforeShowPrintReports', list, data, false);
         if(reports !== false){
            var reportsList;
            if(reports instanceof Array){
               reportsList = reports;
               if(reports.length == 1) {
                  reports = reports[0];
               }
            } else {
               reportsList = typeof(reports) === 'string' ? [] : '';
            }

            this._createPrintMenu(reportsList).addCallback(function(instance){
               if(self._printMenu === null){
                  if (reports === undefined) {
                     reports = list[0];
                  }
                  if (typeof(reports) == 'string') {
                     self.printReport(reports);
                  }
               } else {
                  try{
                     self._printMenu.show(e);
                     self._printMenuIsShow = true;
                  } catch(error){
                     self._printMenu.subscribe('onReady', function(){
                        self._printMenu.show(e);
                        self._printMenuIsShow = true;
                     });
                  }
               }
               return instance;
            });
         }
      },
      /**
       * <wiTag group="Данные">
       * Вывод заданного отчета на печать.
       * @param idReport Идентификатор отчёта печати.
       * @command
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this,
       *       reports = dialog.getReports() || [];
       *    if (reports.length > 0)
       *       dialog.printReport(reports[0]);
       *       // или
       *       dialog.sendCommand('printReport', reports[0]);
       * </pre>
       */
      printReport: function(idReport){
         if (Object.isEmpty(this._options.reports)) {
            return;
         }
         var object = this.getRecord(),
             transform = '',
             self = this,
             eventResult;
         $ws.core.setCursor(false);
         if(self._printMenu !== null && self._printMenuIsShow){
            //self._printMenu.show();
            self._printMenu.destroy(); // это придрот =( пока не написано нормально меню...
            self._printMenu = null;
            self._printMenuIsShow = false;
         }
         if(idReport !== undefined){
            transform = this._options.reports[idReport];
            eventResult = this._notify('onPrepareReportData', idReport, object);
            if(eventResult !== false){
               if(eventResult instanceof $ws.proto.Deferred){
                  eventResult.addCallback(function(result){
                     if (result instanceof $ws.proto.Record || result instanceof $ws.proto.RecordSet || result instanceof Array) {
                        self._showReport(idReport, result, transform);
                     }
                  });
               } else {
                  if (eventResult instanceof $ws.proto.Record || eventResult instanceof $ws.proto.RecordSet || eventResult instanceof Array) {
                     object = eventResult;
                  }
                  this._showReport(idReport, object, transform);
               }
            } else {
               $ws.core.setCursor(true);
            }
         }
      },
      _showReport: function(idReport, object, transform){
         var eventResult = '',
            self = this;
         if(idReport !== undefined){
            eventResult = this._notify('onSelectReportTransform', idReport, object, transform);
            if (typeof(eventResult) === 'string') {
               transform = eventResult;
            }
            transform = $ws._const.resourceRoot + transform;
            self._reportPrinter.prepareReport(object, transform).addCallback(function(reportText){
               $ws.helpers.showHTMLForPrint(reportText).addCallback(function(instance){
                  instance.subscribe('onReady', function(){
                     this.getChildControlByName('ws-dataview-print-report').subscribe('onContentSet', function(){
                        $ws.core.setCursor(true);
                     });
                  });
               });
            }).addErrback(function(error){
                  $ws.core.setCursor(true);
                  $ws.core.alert(error.message);
               });
         }
      },
      /**
       * <wiTag group="Данные">
       * Создание\открытие меню выбора отчетов на печать + печать выбранного отчета.
       * Если не заданы отчеты для печати, ничего не делает.
       * @param event
       * @command
       * @example
       * <pre>
       *    //this - диалог редактирования
       *    var dialog = this;
       *       dialog.print();
       *       // или
       *       dialog.sendCommand('print');
       * </pre>
       * @see showReportList
       */
      print: function(event){
         if (Object.isEmpty(this._options.reports)) {
            return;
         }
         this.showReportList(event);
      },
      _unbindBeforeUnload: function() {
         $ws._const.$win.unbind('beforeunload');
      },
      //Функция подписывается и отписывается на событие onbeforeunload в зависимости от того, был ли изменён документ
      subscribeOnBeforeUnload: function() {
         var self = this;
         $ws._const.$win.bind('beforeunload', function() {
            if (!self.isDestroyed() && ((self.getRecord().isChanged() && !self.isRecordSaved()) || self._recordIsChanged)) {
               return 'Вы покидаете редактируемый документ, все несохраненные данные будут потеряны';
            }
         });
         this.subscribe('onAfterClose', this._unbindBeforeUnload);
      },
      unsubscribeOnBeforeUnload: function(){
         this.unsubscribe('onAfterClose', this._unbindBeforeUnload);
         this._unbindBeforeUnload();
      }
   });

   return $ws.proto.DialogRecord;

});