/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 07.11.12
 * Time: 9:34
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.MergePlugin", [ "js!SBIS3.CORE.DataViewAbstract", "js!SBIS3.CORE.Dialog", "js!SBIS3.CORE.LoadingIndicator" ], function(DataViewAbstract, Dialog, LoadingIndicator) {

/**
 * @class   $ws.proto.DataViewAbstract.MergePlugin
 * @extends $ws.proto.DataViewAbstract
 * @plugin
 */
$ws.proto.DataViewAbstract.MergePlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.MergePlugin.prototype */{
   /**
    * @event onMergeStart Перед началом объединения записей
    * Событие происходит перед началом объединения записей, после определения "главной записи".
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @param {$ws.proto.Record[]} data Массив записей, предполагаемых к удалению.
    * @return {Boolean|String|$ws.proto.Deferred|*} Если передать:
    * <ol>
    * <li>false - отказ от удаления записей, для пользователя ничего не произойдет.</li>
    * <li>String - воспринимаем как новый текст подтверждения объединения.</li>
    * <li>$ws.proto.Deferred - ждем, когда закончится асинхронное событие, и только после его успешного завершения
    * продолжаем объединение.</li>
    * <li>Любой другой тип данных - записи объединяются стандартным образом.</li>
    * </ol>
    * @example
    * Boolean:
    * <pre>
    *    dataView.subscribe('onMergeStart', function(event, data){
       *       if(data.length > 10){
       *          event.setResult(false);
       *          $ws.core.alert("Вы не можете объединять более 10 записей.");
       *       }
       *    });
    * </pre>
    * String:
    * <pre>
    *    dataView.subscribe('onMergeStart', function(event, data){
       *       event.setResult("Вы уверены, что хотите объединить эти записи?");
       *    });
    * </pre>
    */
    /**
    * @event onBeforeDialogShow Перед открытием диалога объединения
    * Событие происходит перед открытием диалога объединения.
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @return {Function} Function является функцией рендера элементов группы радиокнопок.
    * @example
    * Boolean:
    * <pre>
    *    dataView.subscribe('onBeforeDialogShow', function(event){
       *       var render = function(data){
       *          return $('<h2>'+data.label+'</h2>');
       *       }
       *       event.setResult(render);
       *    });
    * </pre>
    */
   $withoutCondition: [ '_initActionsFlags' ],
   $protected: {
      _options: {
         /**
          * @cfg {Boolean} Разрешено объединение записей
          * <wiTag class=TableView group="Данные" page=5>
          * <wiTag group="Данные">
          * Возможно ли в данном табличном браузере объединение записей.
          * @group Record Actions
          */
         useMergeRecords: false,
         /**
          * @cfg {Boolean} Показывать диалог подтверждения объединения
          * Будет ли показан диалог подтверждения объединения.
          */
         useConfirmDialog: false,
         display: {
            viewColumnName: ""
         }
      }
   },
   $condition: function(){
      return this._options.useMergeRecords === true && !this._options.display.readOnly;
   },
   $constructor: function(){
      this._publish('onMergeStart', 'onBeforeDialogShow');
      this._keysWeHandle[$ws._const.key.o] = true;
   },
   getTitleName: function(){
      if (this.isHierarchyMode()) {
         return this._options.display.titleColumn;
      } else if (this._options.display.viewColumnName) {
         return this._options.display.viewColumnName;
      } else {
         var columnName = "",
             i = 0,
             l = this._columnMap.length,
             fieldName = "";
         while (!columnName && i < l) {
            fieldName = this._columnMap[i].field;
            if (fieldName) {
               columnName = fieldName;
            }
            i++;
         }
         return columnName;
      }
   },
   _initActionsFlags: function(){
      this._actions.merge = this._options.useMergeRecords && !this._options.display.readOnly && this.mergeSelectedRecords.bind(this);
   },
   /**
    * <wiTag class=TableView page=5>
    * Инициирует объединение выделенных записей с текущей активной записью.
    * @example
    * <pre>
    *    dataView.mergeSelectedRecords();
    * </pre>
    */
   mergeSelectedRecords: function(){
      var selectedRecords = this.getSelection(true),
          l = selectedRecords.length,
          self = this;
      if (l > 1) {
         new Dialog({
            template : "selectMergeRecord",
            disableActions: true,
            resizable: false,
            handlers: {
               'onReady': function(){
                  var cancelButton = this.getChildControlByName("cancelButton"),
                      mergeButton = this.getChildControlByName("mergeButton"),
                      radio = this.getChildControlByName("recordsRadio"),
                      dialog = this,
                      data = [],
                      beforeMerge,
                      mergeRecords;
                  for (var i = 0; i < l; i++) {
                     data.push({
                        name: selectedRecords[i].getKey(),
                        value: selectedRecords[i].get(self.getTitleName())
                     });
                  }
                  radio.setUserRender(this._notify('onBeforeDialogShow'));
                  radio.setData(data);
                  cancelButton.subscribe("onActivated", function(){
                     dialog.destroy();
                  });
                  mergeButton.subscribe("onActivated", function(){
                     self._onMergeStartHandler(beforeMerge, selectedRecords);
                  });
                  mergeRecords = function(){
                     dialog.hide();
                     var indicator = new LoadingIndicator({
                           showInWindow: true,
                           message: "Объединение записей...",
                           name: 'ws-browser-merge-indicator'
                        }),
                        dMergeResult = new $ws.proto.ParallelDeferred(),
                        mergeKey = radio.getStringValue(),
                        recordKeys = [],
                        errors = [];
                     for (var i = 0; i < l; i++) {
                        var key = selectedRecords[i].getKey();
                        if (key !== mergeKey) {
                           recordKeys.push(key);
                        }
                     }
                     dMergeResult.push(self.getRecordSet().mergeRecords(mergeKey, recordKeys).addErrback(function (error) {
                        errors.push(error.message);
                     }));
                     dMergeResult.done();
                     dMergeResult.getResult().addBoth(function () {
                        indicator.hide();
                        indicator.destroy();
                        dialog.destroy();
                        self.reload();
                        if (errors.length !== 0) {
                           $ws.helpers.alert('В процессе объединения записей возникли ошибки: \n ' + errors.join(' ;\n '), {}, self);
                        } else {
                           var newActiveRow = self._body.find('[rowkey=' + mergeKey + ']'),
                              parentId;
                           for (var i = 0; i < l; i++) {
                              if (mergeKey === selectedRecords[i].getKey()) {
                                 parentId = selectedRecords[i].getParentKey();
                                 break;
                              }
                           }
                           if (self.isHierarchyMode() && self.getCurrentRootNode() !== parentId) {
                              var afterLoad = function () {
                                 if (self.getCurrentRootNode() === parentId) {
                                    newActiveRow = self._body.find('[rowkey=' + mergeKey + ']');
                                    self.unsubscribe("onAfterLoad", afterLoad);
                                    self.setActiveRow(newActiveRow);
                                 }
                              };
                              self.subscribe("onAfterLoad", afterLoad);
                              self.showBranch(parentId);
                           } else
                              self.setActiveRow(newActiveRow);
                        }
                        self.removeSelection();
                     });
                  };
                  beforeMerge = function(message) {
                     $ws.core.setCursor(false);
                     self._useKeyboard = true;
                     if (this._options.useConfirmDialog) {
                        $ws.helpers.question(message ? message : "Объединить выбранные записи?", {'detail': 'Внимание! Операция необратима.'}, self).addCallback(function (res) {
                           if (res) {
                              mergeRecords();
                           }
                        });
                     } else {
                        mergeRecords();
                     }
                     self.setActive(true);
                     $ws.core.setCursor(true);
                     self._useKeyboard = false;
                     var row = self.getActiveElement();
                     if (row) {
                        row.focus();
                     }
                  };
               }
            }
         });
      }
   },
   _onMergeStartHandler: function(callback, records){
      var eventRes = this._notify('onMergeStart', records);
      if (typeof eventRes === 'string') { // строка - свое сообщение в диалоге, вся логика штатная
         callback.apply(this, [eventRes]);
      } else if (eventRes instanceof $ws.proto.Deferred) { // Deferred - дождались success, пошли дальше
         eventRes.addCallback(callback);
      } else if (eventRes !== false) { // false - отмена штатной логики
         callback.apply(this);  // любой другой результат - штатная логика без изменений.
      }
   },
   _keyboardHover: function(e, res){
      if(this.isActive() && e.ctrlKey && e.altKey && e.shiftKey && e.which === $ws._const.key.o){
         this.mergeSelectedRecords();
         return false;
      }
      return res;
   }
});

});