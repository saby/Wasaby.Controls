/**
 * Модуль "Компонент RecordArea".
 *
 * @description
 */
define("js!SBIS3.CORE.RecordArea", ["js!SBIS3.CORE.TemplatedArea", "js!SBIS3.CORE.DialogRecord"], function( TemplatedArea, DialogRecord ) {

   "use strict";

   /**
    * Для описания событий и методов можно посмотреть DialogRecord
    *
    * @class $ws.proto.RecordArea
    * @extends $ws.proto.TemplatedArea
    */
   $ws.proto.RecordArea = TemplatedArea.extend(/** @lends $ws.proto.RecordArea.prototype */{
      $protected: {
         _options: {
            readOnly: false,
            isNewRecord: false,
            reports: {}
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
            _titleBar : false
         }
      },
      $constructor: function(){
         this._publish('onBeforeDelete', 'onRecordDeleted', 'onBeforeSave', 'onSave', 'onSuccess', 'onFail', 'onRecordUpdate',
            'onAfterClose', 'onBeforeClose', 'onBeforeShowPrintReports', 'onPrepareReportData', 'onSelectReportTransform');

         if(this.getReports().length !== 0)
            this._reportPrinter = new $ws.proto.ReportPrinter({});

         DialogRecord.prototype.subscribeOnBeforeUnload.apply(this);
         $ws.single.CommandDispatcher.declareCommand(this, 'ok', function(){
            DialogRecord.prototype.ok.apply(this, []);
         });
         $ws.single.CommandDispatcher.declareCommand(this, 'close', function(){
            DialogRecord.prototype.close.apply(this, []);
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

         if(this._options.readOnly){
            var self = this;
            this._dChildReady.getResult().addCallback(function(){
               self._setEnabledForChildControls(false);
            });
         }
      },
      isRecordSaved: function(){
         return this._recordSaved;
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
      addPendingOperation: function() {
         return DialogRecord.prototype.addPendingOperation.apply(this, arguments);
      },
      waitAllPendingOperations: function() {
         return DialogRecord.prototype.waitAllPendingOperations.apply(this, arguments);
      },
      _checkPendingOperations: function() {
         return DialogRecord.prototype._checkPendingOperations.apply(this, arguments);
      },
      save: function(){
         return DialogRecord.prototype.save.apply(this, arguments);
      },
      _openConfirmDialog: function(){
         return DialogRecord.prototype._openConfirmDialog.apply(this, arguments);
      },
      _processError: function(error){
         DialogRecord.prototype._processError.apply(this, [error]);
      },
      close: function(){
         DialogRecord.prototype.close.apply(this, arguments);
      },
      _dialogRecordSuperClassClose: function(){
         DialogRecord.prototype._dialogRecordSuperClassClose.apply(this, arguments);
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
      _hideWindow: function(){},
      getRecord : function(){
         return this.getLinkedContext().getRecord();
      },
      _getTitle: function(){
         return document.title;
      },
      setReadOnly: function(){
         DialogRecord.prototype.setReadOnly.apply(this, arguments);
      },
      isReadOnly: function(){
         return DialogRecord.prototype.isReadOnly.apply(this, arguments);
      },
      isNewRecord: function(){
         return DialogRecord.prototype.isNewRecord.apply(this, arguments);
      },
      _prepareCloseButton: function(){
         //на мобильном устройстве не создаем крестик закрытия области редактирования записи
         if(!($ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid)){
            $ws.proto.RecordArea.superclass._prepareCloseButton.apply(this, arguments);
         }
      }
   });

   return $ws.proto.RecordArea;

});