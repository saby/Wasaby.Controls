/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialog', [
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function(Dialog, Record, ArrayStrategy) {

   var MoveDialog = Dialog.extend({

      $protected: {
         _options: {
            linkedView: undefined,
            records: undefined,
            template: 'js!SBIS3.CONTROLS.MoveDialogTemplate',
            cssClassName: 'controls-MoveDialog'
         },
         _treeView: undefined,
         _rootBlock: undefined
      },
      $constructor: function() {
         this.subscribe('onReady', this._onReady.bind(this));
      },
      _onReady: function() {
         var
            self = this,
            linkedView = this._options.linkedView,
            selectedCount = this._options.records.length,
            filter;
         this.setTitle('Перенести ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + ' в');
         this.getChildControlByName('MoveDialogTemplate-moveButton')
            .subscribe('onActivated', this._onMoveButtonActivated.bind(this));
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGridView')
            .subscribe('onDataLoad', this._onDataLoadHandler.bind(this));
         this._treeView.setHierField(linkedView._options.hierField);
         this._treeView.setColumns([{ field: linkedView._options.displayField, className: 'controls-DataGridView-cell-overflow-ellipsis' }]);
         this._treeView.subscribe('onDrawItems', function() {
            self._createRoot();
         });
         filter = $ws.core.clone(linkedView.getFilter());
         //Чтобы получить всю выборку папок, проставим в поле иерархии null
         filter[linkedView._options.hierField] = null;
         if ($ws.helpers.instanceOfModule(linkedView._dataSource, 'SBIS3.CONTROLS.SbisServiceSource')) {
            filter['ВидДерева'] = "Только узлы";
            //TODO: костыль написан специально для нуменклатуры, чтобы не возвращалась выборка всех элементов при заходе в пустую папку
            filter['folderChanged'] = true;
         }
         this._treeView.setFilter(filter, true);
         this._treeView.setDataSource(linkedView._dataSource);
      },
      _onMoveButtonActivated: function() {
         var
            moveTo = this._treeView.getSelectedKey();
         if (moveTo !== null) {
            moveTo = this._treeView._dataSet.getRecordByKey(moveTo);
         }
         if (this._treeView._checkRecordsForMove(this._options.records, moveTo)) {
            this._options.linkedView._move(this._options.records, moveTo);
         }
         this.close();
      },
      /*TODO тут добавить корень в дерево*/
      _onDataLoadHandler: function(event, dataSet) {
         event.setResult(dataSet);
      },
      _createRoot: function() {
         this._rootBlock = $('<tr class="controls-DataGridView__tr controls-ListView__item controls-ListView__folder" style="" data-id="null"><td class="controls-DataGridView__td controls-MoveDialog__root"><div class="controls-TreeView__expand js-controls-TreeView__expand has-child controls-TreeView__expand__open"></div>Корень</td></tr>');
         this._rootBlock.bind('click', this._onRootClick.bind(this));
         this._rootBlock.prependTo(this._treeView._container.find('tbody'));
         this._treeView.setSelectedKey(null);
      },
      _onRootClick: function(event) {
         this._treeView._container.find('.controls-ListView__folder').toggleClass('ws-hidden');
         this._rootBlock.toggleClass('ws-hidden').find('.controls-TreeView__expand').toggleClass('controls-TreeView__expand__open');
         this._treeView.setSelectedKey(null);
         event.stopPropagation();
      }
   });

   return MoveDialog;

});