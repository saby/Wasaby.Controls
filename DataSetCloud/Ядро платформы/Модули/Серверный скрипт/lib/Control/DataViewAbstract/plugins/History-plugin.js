/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 06.11.12
 * Time: 16:17
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.HistoryPlugin", [ "js!SBIS3.CORE.DataViewAbstract", "js!SBIS3.CORE.Dialog" ], function(DataViewAbstract, Dialog) {

/**
 * @class   $ws.proto.DataViewAbstract.HistoryPlugin
 * @extends $ws.proto.DataViewAbstract
 * @plugin
 */
$ws.proto.DataViewAbstract.HistoryPlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.HistoryPlugin.prototype */{
   $protected: {
      _options: {
         display: {
            /**
             * @cfg {Boolean} Отображать историю изменения записи
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag group="Данные">
             * Имеет ли пользователь возможность просмотра истории изменения записей в табличном браузере.
             */
            showHistory: false
         },
         _menuButtons:{
            'history' : ['Показать историю изменений (Ctrl+Н)', 'sprite:icon-16 icon-History icon-primary', 'history']
         }
      }
   },
   $condition: function(){
      return this._options.display.showHistory === true;
   },
   $constructor: function(){
      $ws.single.CommandDispatcher.declareCommand(this, 'history', this.showHistoryForActiveRecord);
      this._keysWeHandle[$ws._const.key.h] = true;
      this._notify("onNewAction", {
         title: "История записи (Ctrl+H)",
         icon: $ws._const.theme ? "sprite:icon-16 icon-History icon-primary" : "history.png",
         name: "history",
         callback: "history",
         weight: 80
      });
   },
   /**
    * <wiTag class=TableView page=5>
    * Выводит историю изменений записи с указанным идентификатором.
    * При запросе истории изменений возможна передача требуемых параметров.
    * @param {Number} key Ключ записи, для которой будет показана история.
    * @param {Object} [params] Хэш-мэп дополнительных параметров для получения истории.
    * @example
    * <pre>
    *    //123 - ключ записи
    *    dataView.showHistory('123');
    * </pre>
    */
   showHistory: function(key, params){
      $ws.core.setCursor(false);
      this._useKeyboard = true;
      var browserSource = $ws.core.merge({}, this._initialSource),
          dataSource = {
             readerType: browserSource.readerType || "ReaderUnifiedSBIS",
             filterParams: params ? params : {},
             hierarchyField: "",
             readerParams: browserSource.readerParams,
             firstRequest: true,
             usePages: 'full',
             rowsPerPage: 100
          },
          self = this;
      dataSource.filterParams["ИдО"] = key;
      dataSource.readerParams["queryName"] = "История";
      $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function(instance){
         new Dialog({
            template: 'historyDialog',
            handlers: {
               onReady: function(){
                  this.getChildControlByName('ws-browser-history').subscribe('onReady', function(){
                     var self = this;
                     if(instance.getRecordCount() === 0 )
                        instance.subscribe('onAfterLoad', function(){
                           self.setData(instance);
                        });
                     else
                        this.setData(instance);
                  });
               },
               onAfterShow: function(){
                  $ws.core.setCursor(true);
               },
               onAfterClose:$.proxy(self._mouseMonitor, self)
            }
         });
      }).addErrback(function(){
            $ws.core.setCursor(true);
         });
   },
   /**
    * <wiTag class=TableView page=5>
    * Выводит на экран историю изменения текущей активной записи.
    * @command history
    * @example
    * <pre>
    *    dataView.showHistoryForActiveRecord();
    * </pre>
    */
   showHistoryForActiveRecord: function(){
      this.showHistory(this.getActiveRecord().getKey());
   },
   _keyboardHover: function(e, res){
      if(this.isActive() && this._isCtrl(e) && e.which === $ws._const.key.h){
         this.showHistoryForActiveRecord();
         return false;
      }
      return res;
   },
   _initActionsFlags: function(){
      this._actions = this._actions || {};
      this._actions["history"] = $.proxy(this.showHistoryForActiveRecord, this);
   }
});

});