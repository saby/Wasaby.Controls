/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Record'
], function(Control, Dialog, Record) {

   var MoveDialog = Control.extend({

      $protected: {
         _options: {
            linkedView: undefined
         },
         _treeView: undefined,
         _moveButton: undefined,
         _dialog: undefined
      },

      $constructor: function() {
         this.showDialog();
      },
      showDialog: function() {
         var
            self = this,
            selectedCount =  this._options.linkedView.getSelectedKeys().length;
         this._dialog = new Dialog ({
            template: 'js!SBIS3.CONTROLS.MoveDialogTemplate',
            resizable: false,
            title: 'Переместить ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + ' в',
            handlers: {
               onBeforeShow: function(){
                  console.log('onBeforeShow');
               },
               onReady : function() {
                  var linkedView = self._options.linkedView;
                  self._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGrid');
                  self._moveButton = this.getChildControlByName('MoveDialogTemplate-moveButton');
                  self._moveButton.subscribe('onActivated', self._moveRecords.bind(self));
                  self._treeView.subscribe('onDataLoad', self._onDataLoadHandler.bind(self));
                  self._treeView.setHierField(linkedView._options.hierField);
                  self._treeView.setColumns([{ field: linkedView._options.displayField }]);
                  self._treeView.setDataSource(linkedView._dataSource);
                  self._treeView.openNode(0);
               }
            }
         });
      },
      //Добавляем корень
      _onDataLoadHandler: function(event, dataSet) {
         var
            hierField = this._options.linkedView._options.hierField,
            raw;
         dataSet.each(function(record) {
            if (!record.get(hierField)) {
               record.set(hierField, 0);
            }
         });
         raw = {id: 0, title: 'Корень'};
         raw[hierField] = null;
         raw[hierField + '@'] = true;
         var record = new Record({
            strategy: dataSet.getStrategy(),
            raw: raw,
            keyField: dataSet._keyField
         });
         dataSet.push(record);
         event.setResult(dataSet);
      },
      _moveRecords: function() {
         var
            records,
            linkedView = this._options.linkedView,
            moveTo = this._treeView.getSelectedKeys()[0];
         if (moveTo !== undefined) {
            records = linkedView.getSelectedKeys();
            this._move(records, moveTo);
            linkedView.removeItemsSelectionAll();
            linkedView.openNode(moveTo);
         }
         this._dialog.close();
      },
      _move: function(records, moveTo) {
         var
            record,
            linkedView = this._options.linkedView;
         for (var i = 0; i < records.length; i++) {
            record = linkedView._dataSet.getRecordByKey(records[i]);
            linkedView._dataSource.move(record, linkedView._options.hierField, moveTo || null);
         }
      }
   });

   return MoveDialog;

});