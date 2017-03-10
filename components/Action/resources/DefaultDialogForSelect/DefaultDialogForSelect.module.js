define('js!SBIS3.CONTROLS.DefaultDialogForSelect', [
   "Core/CommandDispatcher",
   'js!SBIS3.CONTROLS.SelectorController',
   "html!SBIS3.CONTROLS.DefaultDialogForSelect",
   "Core/core-instance",
   "html!SBIS3.CONTROLS.DefaultDialogForSelect/resources/FolderTitleTpl",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.TreeDataGridView",
   "i18n!SBIS3.CONTROLS.DefaultDialogForSelect",
   'css!SBIS3.CONTROLS.DefaultDialogForSelect'
], function(CommandDispatcher, SelectorController, dotTplFn, cInstance) {

   var DefaultDialogForSelect = SelectorController.extend({
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
            dataSource: undefined,
            partialyReload: undefined,
            displayProperty: undefined,
            filter: undefined,
            infiniteScroll: null,
            pageSize: undefined,
            buttonCaption: 'Перенести'
         },
         treeView: undefined
      },
      $constructor: function() {
         this._publish('onPrepareFilterOnMove', 'onMove');
         
         this.subscribe('onReady', this._onReady.bind(this));
         CommandDispatcher.declareCommand(this, 'applyMove', this._onMoveButtonActivated.bind(this));
      },
      _onReady: function() {
         var
             filter = this._options.filter || {};
         this._treeView = this.getChildControlByName('DefaultDialogForSelect-TreeDataGridView');
         if (cInstance.instanceOfModule(this.getDataSource(), 'SBIS3.CONTROLS.SbisServiceSource') || cInstance.instanceOfModule(this.getDataSource(),'WS.Data/Source/SbisService')) {
            filter['ВидДерева'] = "Только узлы";
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
         return this._options.dataSource;
      }

   });

   return DefaultDialogForSelect;
});