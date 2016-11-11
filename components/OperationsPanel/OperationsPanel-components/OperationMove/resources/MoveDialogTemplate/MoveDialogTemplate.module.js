/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "html!SBIS3.CONTROLS.MoveDialogTemplate",
   "Core/core-instance",
   "Core/helpers/collection-helpers",
   "html!SBIS3.CONTROLS.MoveDialogTemplate/resources/FolderTitleTpl",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.TreeDataGridView",
   "i18n!SBIS3.CONTROLS.MoveDialogTemplate"
], function( CommandDispatcher,Control, dotTplFn, cInstance, colHelpers) {

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
            dataSource: undefined,
            partialyReload: undefined,
            displayField: undefined,
            filter: undefined
         },
         treeView: undefined
      },
      $constructor: function() {
         this._publish('onPrepareFilterOnMove', 'onMove');
         this._container.removeClass('ws-area');
         this.subscribe('onReady', this._onReady.bind(this));
         this._synchProperties();
         CommandDispatcher.declareCommand(this, 'applyMove', this._onMoveButtonActivated.bind(this));
      },
      _onReady: function() {
         var
             filter = this._options.filter || {};
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGridView');
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
      },
      /**
       * Синхронизириует набор опций с листвью
       * @private
       */
      _synchProperties: function() {
         var properties = ['displayField', 'partialyReload', 'keyField', 'hierField'],
            listView = this._options.listView;
         if (listView) {
            colHelpers.forEach(properties, function (property) {
               if (!this.getProperty(property)) {
                  this.setProperty(listView.getProperty(property));
               }
            }, this);
         }
      }
   });

   return MoveDialogTemplate;
});