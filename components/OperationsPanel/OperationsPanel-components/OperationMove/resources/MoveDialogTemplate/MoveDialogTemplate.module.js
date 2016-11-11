/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "html!SBIS3.CONTROLS.MoveDialogTemplate",
   "Core/core-instance",
   "html!SBIS3.CONTROLS.MoveDialogTemplate/resources/FolderTitleTpl",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.TreeDataGridView",
   "i18n!SBIS3.CONTROLS.MoveDialogTemplate"
], function( CommandDispatcher,Control, dotTplFn, cInstance) {

   var MoveDialogTemplate = Control.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'moveDialog',
            autoHeight: false,
            width: '400px',
            height: '400px',
            resizable: false,
            linkedView: undefined,
            records: undefined,
            cssClassName: 'controls-MoveDialog',
            dataSource: undefined
         },
         treeView: undefined
      },
      $constructor: function() {
         this._publish('onPrepareFilterOnMove', 'onMove');
         this._container.removeClass('ws-area');
         this.subscribe('onReady', this._onReady.bind(this));
         CommandDispatcher.declareCommand(this, 'applyMove', this._onMoveButtonActivated.bind(this));
      },
      _onReady: function() {
         var
             filter;
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGridView');
         //TODO: Избавиться от этого события в .100 версии. Придрот для выпуска .20 чтобы подменить фильтр в диалоге перемещения. Необходимо придумать другой механизм.
         filter = this._notify('onPrepareFilterOnMove', this._options.records) || {};
         if (cInstance.instanceOfModule(this.getDataSource(), 'SBIS3.CONTROLS.SbisServiceSource') || cInstance.instanceOfModule(this.getDataSource(),'WS.Data/Source/SbisService')) {
            filter['ВидДерева'] = "Только узлы";
            //TODO: костыль написан специально для нуменклатуры, чтобы не возвращалась выборка всех элементов при заходе в пустую папку
            filter['folderChanged'] = true;
         }
         this._treeView.setFilter(filter, true);
         this._treeView.setDataSource(this.getDataSource());
      },
      _onMoveButtonActivated: function() {
         var moveTo = this._treeView.getSelectedKey();
         if (moveTo !== null) {
            moveTo = this._treeView.getItems().getRecordById(moveTo);
         }
         this._notify('onMove', this._options.records, moveTo);
         this.sendCommand('close');
      },

      getDataSource: function() {
         if (this._options.linkedView) {
            return this._options.linkedView.getDataSource();
         }

         if (this._options.dataSource) {
            return this._options.dataSource;
         }

         throw Error('data sourse is undefined');
      }
   });

   return MoveDialogTemplate;
});