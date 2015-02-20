/**
 * Created with JetBrains PhpStorm.
 * User: ad.Chistyakova
 * Date: 24.05.13
 * Time: 12:41
 * To change this template use File | Settings | File Templates.
 */
/**
 * Модуль "Компонент RecordFloatArea".
 *
 * @description
 */
define('js!SBIS3.CORE.RecordFloatArea', ['js!SBIS3.CORE.DialogRecord','js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.FloatArea', 'js!SBIS3.CORE.ModalOverlay',
   'css!SBIS3.CORE.RecordFloatArea'], function( DialogRecord, Dialog, FloatArea, ModalOverlay ) {

   'use strict';

   $ws.single.DependencyResolver.register('SBIS3.CORE.RecordFloatArea', [], 'SBIS3.CORE.FloatArea');

   var globalChannel = $ws.single.EventBus.globalChannel();
   /**
    * Для описания событий и методов можно посмотреть FloatArea
    *
    * @class $ws.proto.RecordFloatArea
    * @extends $ws.proto.FloatArea
    */
   $ws.proto.RecordFloatArea = FloatArea.extend(/** @lends $ws.proto.RecordFloatArea.prototype */{
      /**
       * @event onChangeRecord Срабатывает при проставлении(изменении записи) в контекст. Нужен вместо onDataBind
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record - запись, на которую изменили.
       * @param {$ws.proto.Record} oldRecord - старая запись.
       */
      /**
       * @event onConfirmDialogSelect При выборе значения в методе {@link openConfirmDialog}
       * @param {$ws.proto.EventObject}   eventObject 
       * @param {Boolean}                 leavePage   Пользователь покидает страницу
       * @see openConfirmDialog
       */
      $protected: {
         _options: {
            readOnly: false,
            isNewRecord: false,
            reports: {},
            doNotLossFocus: false,
            editFullScreenTemplate: '',
            /**
             * @cfg {Boolean} Отслеживает скролл
             * Если  = false, то не движется по окну за скроллом. - где выехали, там и остались
             */
            catchScroll: true,

            /**
             * @cfg {Boolean} autoCloseOnHide В классе RecordFloatArea опция autoCloseOnHide по умолчанию включена,
             * а значит, метод hide работает так же, как и метод close, закрывая панель, и удалая её после закрытия
             */
            autoCloseOnHide: true,
            /**
             * @cfg {Boolean} clearContext Опция задает поведение работы панели с контекстом при переключении в реестре
             * (изменении записи c помощью {@link setRecord})
             * false - заменять только запись в контексте, другие поля не трогает
             * true - полностью заменяет(очищает) контекст и проставляет в него запись
             */
            clearContext : false
         },
         _pending: [],
         _waiting: [],
         _record: null,
         _recordSaved: false,
         _loadingIndicator: undefined, //Индикатор загрузки
         _saving: false,               //Сохраняется ли в данный момент
         _reportPrinter: null,
         _printMenu: null,
         _printMenuIsShow: false,
         _lastMenuItemList: [],
         _window: {
            remove : function(){},
            hide: function(){},
            _titleBar : true
         },
         _isClosed : true,
         _standartYOffset : 1,
         _standartWindowOffset: 64,
         _onFocusOutElements: null,
         _recordIsChanged: false
      },
      $constructor: function(){
         this._publish('onBeforeDelete', 'onRecordDeleted', 'onBeforeSave', 'onSave', 'onSuccess', 'onFail', 'onRecordUpdate', 'onConfirmDialogSelect',
               'onAfterClose', 'onBeforeClose', 'onBeforeShowPrintReports', 'onPrepareReportData', 'onSelectReportTransform', 'onChangeRecord',
               'onBeforeShowConfirmDialog');

         DialogRecord.prototype.subscribeOnBeforeUnload.apply(this);
         if(this.getReports().length !== 0) {
            this._reportPrinter = new $ws.proto.ReportPrinter({});
         }
         this.subscribe('onBeforeClose', function(){
            this._isClosed = true;
         });
         this.subscribe('onReady', this._onReady);
         //Подписались на клики по аккордеону
         $ws.single.EventBus.channel('navigation').subscribe('onBeforeNavigate', this._onBeforeNavigate, this);
         this.subscribe('onAfterShow', function(){
            this._isClosed = false;
         });
         this.subscribe('onBeforeShow', function(){
            this._isClosed = false;
            if(this._options.readOnly) {
               this._setEnabledForChildControls(false);
            }
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'ok', function(){
            DialogRecord.prototype.ok.apply(this, []);
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'cancel', function(){
            DialogRecord.prototype.cancel.apply(this, []);
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'save', function(){
            DialogRecord.prototype.save.apply(this, arguments);
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'delete', function(){
            DialogRecord.prototype.delRecord.apply(this, arguments);
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'print', function(event){
            DialogRecord.prototype.print.apply(this, [event]);
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'printReport', function(reportName){
            DialogRecord.prototype.printReport.apply(this, [reportName]);
         });
      },
      _onBeforeNavigate: function(event){
         var noOpen = this.isDestroyed() || !$ws.helpers.instanceOfModule(this, 'SBIS3.CORE.RecordFloatArea');
         event.setResult(noOpen || this.openConfirmDialog());
      },
      _createTitle: function(){
         //Важно, чтобы сначала отработал createTitle от FA!
         $ws.proto.RecordFloatArea.superclass._createTitle.apply(this, arguments);

         //Снимаем верхний бордер
         this.getContainer().parent().addClass('ws-record-float-area-border');

         if (this._needNewPageLink()) {
            var icon = $('<div class="ws-record-float-area-icon icon-16 icon-NewTab icon-disabled action-hover"></div>');
            this._title.append(icon)
               .hover(function(){
                  icon.toggleClass('icon-hover');
               });
         }
      },

      _needNewPageLink: function() {
         return this._options.editFullScreenTemplate &&
                $ws.helpers.instanceOfModule(this.getOpener(), 'SBIS3.CORE.DataViewAbstract');
      },

      _setTitleContainer: function() {
         $ws.proto.RecordFloatArea.superclass._setTitleContainer.apply(this, arguments);

         //Если шаблон не задали - не создаем ссылку для открытия в новой вкладке
         if (this._needNewPageLink()) {
            var self = this;
            this._title.addClass('ws-record-float-area-title');
            this._title.bind('click', function(event){
               var record =  self.getRecord(),
                   columns = record.getColumns(),
                   changedParams = {},
                   recordConfig = {
                      id: record.getKey(),
                      parentId: record.getParentKey(),
                      isBranch: record.isBranch()
                   },
                   opener = self.getOpener(),
                   url;
               //TODO перевести на record.getChangedFields() - только сначала доделать саму функцию getChangedFields
               for (var i = 0, len = columns.length; i < len; i++){
                  if (record.isChanged(columns[i])){
                     changedParams[columns[i]] = record.get(columns[i]);
                  }
               }
               url = opener.isHierarchyMode() ?  opener.generateEditPageURL(recordConfig.id, recordConfig.isBranch, null, false, undefined, changedParams, self._options.editFullScreenTemplate) :
                     opener.generateEditPageURL(recordConfig.id, undefined, changedParams, self._options.editFullScreenTemplate);
               opener.openWindowRecord(recordConfig, url);
               self.hide();
               event.stopImmediatePropagation();
               return false;
            });
         }
      },
      setOpener: function(opener) {
         if (this.getOpener()) {
            this.getOpener().unsubscribe('onFocusOut', this._getOnFocusOutHandler());
         }

         $ws.proto.RecordFloatArea.superclass.setOpener.call(this, opener);

         if (this.getOpener()) {
            this.getOpener().subscribe('onFocusOut', this._getOnFocusOutHandler());
         }
      },


      _getOnFocusOutHandler: function() {
         if (!this._onFocusOutElements) {
            var self = this;
            this._onFocusOutElements = function(event, destroyed, focusedControl){
               var parentWindow = focusedControl ? focusedControl.getParentWindow() : undefined,
                  myContainer = self.getContainer(),
                  topParent = focusedControl ? focusedControl.getTopParent() : undefined,
                  temp = focusedControl;
               //Есди клик был по аккордену - не обрабатываем потерю фокуса
               if ($ws.helpers.instanceOfModule(focusedControl, 'SBIS3.Navigation.LeftNavigation')) {
                  return;
               }
               if (focusedControl === self.getOpener()){
                  self.moveToTop();
                  return;
               }
               while (temp) {
                  if (temp === self) {
                     return;
                  }
                  temp = temp.getParent() || (temp.getOpener && temp.getOpener());
               }

               var opener = self.getOpener(),
                   openerContainer = opener && opener.getContainer(),
                   focusedContainer = focusedControl && focusedControl.getContainer();

               if (!self._isClosed && self._state !== 'hide' && !destroyed &&
                   focusedControl && openerContainer && openerContainer.find(focusedContainer).length < 1 &&
                   myContainer && myContainer.find(focusedContainer).length < 1 &&
                   !focusedControl.getTopParent().isModal() &&
                   opener !== focusedControl &&
                   topParent !== this.getTopParent() &&
                   topParent.getOpener() !== this &&
                   topParent !== self)
               {
                  var parentWinOpener = parentWindow && parentWindow.getOpener(),
                     parentWinOpenerContainer = parentWinOpener && parentWinOpener.getContainer();

                  if ((!parentWindow || !parentWinOpener) ||
                      (parentWinOpener && myContainer && myContainer.find(parentWinOpenerContainer) < 1))
                  {
                     self.hide();
                  }
               }
            };
         }
         return this._onFocusOutElements;
      },

      _onReady : function(){
         if (!this._options.doNotLossFocus) {
            return true;
         }

         var handler = this._getOnFocusOutHandler();

         //На всякий случай отпишем обработчик, потому что _onReady может быть вызвана из-за переустановки шаблона - второй раз
         globalChannel.unsubscribe('onFocusOut', handler, this);
         globalChannel.subscribe('onFocusOut', handler, this);
      },

      destroy: function(){
         globalChannel.unsubscribe('onFocusOut', this._getOnFocusOutHandler(), this);
         $ws.single.EventBus.channel('navigation').unsubscribe('onBeforeNavigate', this._onBeforeNavigate, this);
         $ws.proto.RecordFloatArea.superclass.destroy.apply(this, arguments);
      },

      /**
       * открыть специальный диалог подтверждения изменения записи (по макету)
       * @param {Boolean} noHide - не закрывать панель после закрытия диалога
       * @returns {$ws.proto.Deferred || Boolean} true - если теперь можно менять запись, false в противном случае (пользователь пожелал остаться)//
       * @see onConfirmDialogSelect
       */
      openConfirmDialog : function(noHide){
         var self = this,
             deferred = new $ws.proto.Deferred();
         deferred.addCallback(function(result){
            self._notify('onConfirmDialogSelect', result);
            return result;
         });
         if (this.getRecord().isChanged() || this.isNewRecord()) {
            this._openConfirmDialog(false, true).addCallback(function(result){
               switch (result) {
                  case 'yesButton' : {
                     self._result = true;
                     self.updateRecord().addCallback(function(){
                        self._confirmDialogToCloseActions(deferred, noHide);
                     }).addErrback(function(){
                        deferred.callback(false);
                     });
                     break;
                  }
                  case 'noButton' : {
                     self._result = false;
                     /**
                      * Если откатить изменения в записи, поля связи, которые с ней связанны, начнут обратно вычитываться, если были изменены, а это уже не нужно
                      * self.getRecord().rollback();
                      */
                     self._confirmDialogToCloseActions(deferred, noHide);
                     break;
                  }
                  default : {
                     deferred.callback(false);
                  }
               }
            });
         }
         else {
            self._confirmDialogToCloseActions(deferred, noHide);
         }
         return deferred;
      },
      _confirmDialogToCloseActions: function(deferred, noHide) {
         $ws.single.EventBus.channel('navigation').unsubscribe('onBeforeNavigate', this._onBeforeNavigate, this);
         deferred.callback(true);
         if (!noHide) {
            $ws.proto.RecordFloatArea.superclass.close.apply(this, arguments);
         }   
      },
      _openConfirmDialog:function(){
         return DialogRecord.prototype._openConfirmDialog.apply(this, arguments);
      },
      /**
       * Была ли сохранена запись
       * @deprecated Будет удален полностью в 3.7, используйте {@link $ws.proto.RecordFloatArea#isSaved}
       */
      isRecordSaved: function(){
         return this.isSaved();
      },
      isSaved: function(){
         return DialogRecord.prototype.isSaved.apply(this, []);
      },
      _unbindBeforeUnload: function() {
         DialogRecord.prototype._unbindBeforeUnload.apply(this);
      },
      unsubscribeOnBeforeUnload: function(){
         DialogRecord.prototype.unsubscribeOnBeforeUnload.apply(this);
      },
      updateRecord: function(){
         return DialogRecord.prototype.updateRecord.apply(this, arguments);
      },
      _checkPendingOperations: function() {
         return DialogRecord.prototype._checkPendingOperations.apply(this, arguments);
      },
      save: function(){
         return DialogRecord.prototype.save.apply(this, arguments);
      },
      _processError: function(error){
         DialogRecord.prototype._processError.apply(this, [error]);
      },
      /**
       * Может ли панель менять запись
       * @returns {Boolean}
       */
      isReadOnly: function(){
         return this._options.readOnly;
      },
      ok: function(){
         DialogRecord.prototype.ok.apply(this, arguments);
      },
      _setEnabledForChildControls: function(){
         DialogRecord.prototype._setEnabledForChildControls.apply(this, arguments);
      },
      _showLoadingIndicator: function(){
         DialogRecord.prototype._showLoadingIndicator.apply(this, arguments);
      },
      _hideLoadingIndicator: function(){
         DialogRecord.prototype._hideLoadingIndicator.apply(this, arguments);
      },
      isAllReady: function(){
         return DialogRecord.prototype.isAllReady.apply(this, arguments);
      },
      getChildControls: function(){
         return DialogRecord.prototype.getChildControls.apply(this, arguments);
      },
      getReports: function(){
         return DialogRecord.prototype.getReports.apply(this, arguments);
      },
      _printMenuItemsIsChanged: function(){
         return DialogRecord.prototype._printMenuItemsIsChanged.apply(this, arguments);
      },
      _createPrintMenu: function(reportsList){
         return DialogRecord.prototype._createPrintMenu.apply(this, arguments);
      },
      showReportList: function(e){
         return DialogRecord.prototype.showReportList.apply(this, arguments);
      },
      printReport: function(isReport){
         return DialogRecord.prototype.printReport.apply(this, arguments);
      },
      _showReport: function(idReport, data, transform){
         return DialogRecord.prototype._showReport.apply(this, arguments);
      },
      print: function(event){
         return DialogRecord.prototype.print.apply(this, arguments);
      },
      _hideWindow: function(){
      },
      getRecord : function(){
         return DialogRecord.prototype.getRecord.apply(this, arguments);
      },
      _getTitle: function(){
         return document.title;
      },
      /**
       * Изменяет состояние диалога "только для чтения"
       * @param {Boolean} isReadOnly
       */
      setReadOnly: function(isReadOnly){
         DialogRecord.prototype.setReadOnly.apply(this, arguments);
      },
      /**
       * Изменить поведение метода {@link setRecord}
       * @param {String} clearContext {@link clearContext}
       *  Возможные значения
       * false - не очищать контекст, а только поменять запись
       * true - очищать контекст
       * @see clearContext
       * @see setRecord
       */
      setClearContext: function(clearContext) {
         this._options.clearContext = !!clearContext;
      },
      getClearContext: function(){
         return this._options.clearContext;
      },
      /**
       * Проверка записи - новая она или мы просто редактируем старую
       * @returns {Boolean}
       */
      isNewRecord: function(){
         return DialogRecord.prototype.isNewRecord.apply(this, arguments);
      },
      setRecord : function(record, noConfirm){
         var self = this;
         if (!noConfirm) {
            this.openConfirmDialog(true).addCallback(function(result){
               if (result) {
                  self._setRecord(record);
               }
            });
         }
         else {
            this._setRecord(record);
         }
      },
      _setRecord: function(record) {
         var oldRecord = this.getRecord(),
             context = this.getLinkedContext();
         if (this._options.clearContext) {
            context.setContextData(record);
         } else {
            context.replaceRecord(record);
         }
         if(this.isNewRecord()){
            this._options.isNewRecord = record.getKey() === null;
         }
         this._notify('onChangeRecord', record, oldRecord);//Отдаем запись, хотя здесь ее можно получить простым getRecord + старая запись
      },

      /**
       * Скрывает контрол, в самом конце скрытия удаляет область.
       * @returns {Boolean}
       */
      _hideInner: function() {
         var self = this,
             args = arguments,
             hideSuper = $ws.proto.RecordFloatArea.superclass._hideInner;

         return this.waitAllPendingOperations(new $ws.proto.Deferred().addCallback(function(){
            //мы должны убедиться, что запись не просто поменяли, а еще и не сохранили
            if (!self.isDestroyed() && ((self.getRecord().isChanged() && !self.isSaved()) || self._recordIsChanged)){
               return self.openConfirmDialog(true).addCallback(function(result){
                  return result ? hideSuper.apply(self, args) : false;
               });
            } else {
               return hideSuper.apply(self, args);
            }
         }));
      },
      /**
       * Заставить при закрытии спросить о сохранении, но только если запись была только что создана
       * @param {Boolean} status - если true, то спрашивать
       */
      setChanged: function(status) {
         this._recordIsChanged = !!status;
      }
   });

   return $ws.proto.RecordFloatArea;
});
