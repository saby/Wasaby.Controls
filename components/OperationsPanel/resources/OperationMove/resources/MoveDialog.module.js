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
            template: 'js!SBIS3.CONTROLS.MoveDialogTemplate',
            cssClassName: 'controls-MoveDialog'
         },
         _treeView: undefined
      },
      $constructor: function() {
         this.subscribe('onReady', this._onReady.bind(this));
      },
      _onReady: function() {
         var
            self = this,
            linkedView = this._options.linkedView,
            selectedCount = linkedView.getSelectedKeys().length;
         this.setTitle('Перенести ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + ' в');
         this.getChildControlByName('MoveDialogTemplate-moveButton')
            .subscribe('onActivated', this._onMoveButtonActivated.bind(this));
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGrid')
            .subscribe('onDataLoad', this._onDataLoadHandler.bind(this));
         this._treeView.setHierField(linkedView._options.hierField);
         this._treeView.setColumns([{ field: linkedView._options.displayField }]);
         this._treeView.subscribe('onDrawItems', function() {
            self._createRoot();
         });
         this._treeView.setDataSource(linkedView._dataSource);
         /*TODO cуперкостыль для того, чтобы если папка пустая БЛ не возвращала выборку из её предка*/
         this._treeView._filter['folderChanged'] = true;
      },
      _onMoveButtonActivated: function() {
         var
            moveTo = this._treeView.getSelectedKey();
         this._options.linkedView.selectedMoveTo(moveTo);
         this.close();
      },
      /*TODO тут добавить корень в дерево*/
      _onDataLoadHandler: function(event, dataSet) {
         event.setResult(dataSet);
      },
      _createRoot: function() {
         var tr = $('<tr class="controls-DataGrid__tr controls-ListView__item controls-ListView__folder" style="" data-id="null"><td class="controls-DataGrid__td controls-MoveDialog__root"><div class="controls-TreeView__expand js-controls-TreeView__expand has-child controls-TreeView__expand__open"></div>Корень</td></tr>');
         tr.prependTo(this._treeView._container.find('tbody'));
         this._treeView.setSelectedKey(null);
      }
   });

   return MoveDialog;

});