/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 08.11.12
 * Time: 11:57
 * To change this template use File | Settings | File Templates.
 */

define("js!SBIS3.CORE.CopyPlugin", [ "js!SBIS3.CORE.DataViewAbstract" ], function(DataViewAbstract) {

/**
 * @class   $ws.proto.DataViewAbstract.CopyPlugin
 * @extends $ws.proto.DataViewAbstract
 * @plugin
 */
$ws.proto.DataViewAbstract.CopyPlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.CopyPlugin.prototype */{
   /**
    * @event onBeforeCopy Перед копированием записи
    * <wiTag class=TableView page=5>
    * Обработка результата:
    *    Если вернуть false, то копирование будет отменено
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {$ws.proto.Record} record Запись, которую собираются копировать
    * @example
    * <pre>
    *    dataView.subscribe('onBeforeCopy', function(event, record){
    *       if(record.get('Удален') === true)
    *          event.setResult(false);
    *    });
    * </pre>
    */
   $protected: {
      _options: {
         /**
          * @cfg {Boolean} Разрешено копирование записей
          * <wiTag class=TableView group="Данные" page=5>
          * <wiTag group="Данные">
          * Возможно ли в данном табличном браузере копирование записей.
          * @group Record Actions
          */
         useCopyRecords: false
      },
      _menuButtons: {
         'copy' : ['Копировать запись (Shift+F5)', 'sprite:icon-16 icon-Copy icon-primary', 'copy']
      },
      _isCopy: false
   },
   $condition: function(){
      return this._options.useCopyRecords && !this._options.display.readOnly;
   },
   $constructor: function(){
      this._publish('onBeforeCopy');
      $ws.single.CommandDispatcher.declareCommand(this, 'copy', this.copy);
      this._keysWeHandle[$ws._const.key.f5] = true;
      this._notify("onNewAction", {
         title: "Копировать запись (Shift+F5)",
         icon: $ws._const.theme ? "sprite:icon-16 icon-Copy icon-primary" : "copy.png",
         name: "copy",
         callback: "copy",
         weight: 50
      });
   },
   /**
    * <wiTag class=TableView page=5 group="Управление">
    * Инициирует копирование переданной записи.
    * Если никакую запись не передали, то копируется текущая активная запись.
    * @param {$ws.proto.Record} [rec=this.getActiveRecord()] Запись, которую нужно копировать.
    * @command
    * @example
    * <pre>
    *    dataView.copy(dataView.getRecordSet().getRecordByPrimaryKey('123'));
    * </pre>
    */
   copy: function(rec){
      var nowRecord = rec && rec instanceof $ws.proto.Record ? rec : this.getActiveRecord(),
          self = this;
      (function () {
         var allowCopy = self._notify('onBeforeCopy', nowRecord);
         if (allowCopy instanceof $ws.proto.Deferred) {
            return allowCopy;
         } else if (allowCopy === false) {
            return new $ws.proto.Deferred().errback();
         } else {
            return new $ws.proto.Deferred().callback(allowCopy instanceof $ws.proto.Record ? allowCopy : nowRecord);
         }
      })().addCallback(function (record) {
         var recordKey = record.getKey(),
             isBranch = self.isHierarchyMode() ? record.get(self._hierColumnIsLeaf) : false,
             editTemplate = isBranch ? self._options.editBranchDialogTemplate : self._options.editDialogTemplate,
             editMode = isBranch ? self._options.editBranchMode : self._options.editMode;
         if(editTemplate !== ''){
            if(editMode == 'newWindow' || editMode == 'thisWindow'){
               self._isCopy = true;
               self._openEditWindow(recordKey, isBranch);
               return;
            } else if(editMode == 'thisPage'){
               self._isCopy = true;
               var topParent = self.getTopParent();
               $ws.single.GlobalContext.setValue('editParams', self.generateEditPageURL(recordKey, isBranch));
               if($ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.AreaAbstract'))
                  $ws.core.bootup(editTemplate, undefined, undefined, topParent.getTemplateName());
               return;
            }
            self._useKeyboard = true;
            $ws.core.setCursor(false);
            self._currentRecordSet.copyRecord(recordKey, self._options.dataSource.readerParams.format).addBoth(function(record){
               $ws.core.setCursor(true);
               return record;
            }).addCallback(function(record){
               var flag = self._notify('onBeforeUpdate', record),
                   editFullScreenTemplate;
               if(typeof(flag) == 'string')
                  editTemplate = flag;
               else if(typeof(flag) == 'object'){
                  editTemplate = flag.editTemplate;
                  editFullScreenTemplate = flag.editFullScreenTemplate ? flag.editFullScreenTemplate : editFullScreenTemplate;
               }
               if(record instanceof $ws.proto.Record){
                  self._showDialog(editTemplate, record, undefined, editMode === 'newDialog' ? 'DialogRecord' : 'RecordFloatArea', editFullScreenTemplate);
               }
            }).addErrback(function(error){
               $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
            });
         }
      }).addErrback(function(){
         });
   },
   _prepareEditParams: function(params, viewEditParams){
      viewEditParams['copy'] = this._isCopy;
      this._isCopy = false;
      return viewEditParams;
   },
   /**
    * Вычитывает или создаёт запись с указанными параметрами
    * @param {String|undefined} recordId Идентфикатор записи. Если undefined - создаём запись
    * @return {$ws.proto.Deferred} Деферред готовности записи, он передаёт первым параметром запись
    */
   _readRecord: function(recordId){
      if (this._isCopy) {
         this._isCopy = false;
         return this._currentRecordSet.copyRecord(recordId, this._options.dataSource.readerParams.format);
      } else {
         return arguments[arguments.length - 1];
      }
   },
   _keyboardHover: function(e, res){
      if(this.isActive() && !e.ctrlKey && !e.altKey && e.shiftKey && e.which === $ws._const.key.f5){
         this.copy();
         return false;
      }
      return res;
   },
   _initActionsFlags: function(){
      var vtHier = this.isHierarchyMode() || this._turn !== '',
         isEditBranch = this._options.editBranchDialogTemplate,
         isEdit = this._options.editDialogTemplate,
         self = this;
      this._actions = this._actions || {};
      this._actions["copy"] = (isEdit || (vtHier && isEditBranch)) && function(row){
         if(row instanceof Object && 'jquery' in row)
            row = self._currentRecordSet.getRecordByPrimaryKey(row.attr("rowkey"));
         self.copy(row);
      };
   }
});

});