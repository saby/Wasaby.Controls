/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.MoveDialog',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CORE.DialogConfirm',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.TreeDataGrid'
], function(Control, dotTplFn, Record, DialogConfirm) {

   var MoveDialog = Control.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'moveDialog',
            verticalAlignment: 'Top',
            height: 'auto',
            width: 'auto'
         },
         _linkedView: undefined,
         _treeView: undefined,
         _moveButton: undefined,
         _dialog: undefined
      },

      $constructor: function() {
      },
      init: function(){
         var self = this;
         MoveDialog.superclass.init.call(this);
         this._dialog = this.getParent();
         this._linkedView = this.getParent().getOpener();
         this._treeView = this.getChildControlByName('MoveDialog-TreeDataGrid');
         this._moveButton = this.getChildControlByName('MoveDialog-moveButton');
         this._moveButton.subscribe('onActivated', self._moveRecords.bind(self));
         this._treeView.subscribe('onDataLoad', this._onDataLoadHandler.bind(this));
         this._treeView.setHierField(this._linkedView._options.hierField);
         this._treeView.setColumns([{ field: this._linkedView._options.displayField }]);
         this._treeView.setDataSource(this._linkedView._dataSource);

      },
      _onDataLoadHandler: function(event, dataSet) {
         dataSet.each(function(record) {
            if (!record.get('par')) {
               record.set('par', 0);
            }
         });
         var record = new Record({
            strategy: dataSet.getStrategy(),
            raw: { id: 0, title: 'Корень', 'par@': true, par: null },
            keyField: dataSet._keyField
         });
         dataSet.push(record);
         console.log(dataSet);
         event.setResult(dataSet);
      },
      _moveRecords: function() {
         var
            records,
            moveTo = this._treeView.getSelectedKeys()[0];
         if (moveTo !== undefined) {
            records = this._linkedView.getSelectedKeys();
            this._move(records, moveTo);
            this._linkedView.removeItemsSelectionAll();
            this._linkedView.openNode(moveTo);
         }
         this._dialog.close();
      },
      _move: function(records, moveTo) {
         var record;
         for (var i = 0; i < records.length; i++) {
            record = this._linkedView._dataSet.getRecordByKey(records[i]);
            this._linkedView._dataSource.move(record, this._linkedView._options.hierField, moveTo || null);
         }
      }
   });

   return MoveDialog;
});