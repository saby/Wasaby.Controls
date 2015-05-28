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
            template: 'js!SBIS3.CONTROLS.MoveDialogTemplate'
         },
         _treeView: undefined
      },

      $constructor: function() {
         this.subscribe('onReady', this._onReady.bind(this));
      },
      _onReady: function() {
         var
            linkedView = this._options.linkedView,
            selectedCount = linkedView.getSelectedKeys().length;
         this.setTitle('Перенести ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + ' в');
         this.getChildControlByName('MoveDialogTemplate-moveButton')
            .subscribe('onActivated', this._moveRecords.bind(this));
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGrid')
            .subscribe('onDataLoad', this._onDataLoadHandler.bind(this));
         this._treeView.setHierField(linkedView._options.hierField);
         this._treeView.setColumns([{ field: linkedView._options.displayField }]);
         this._treeView.setDataSource(linkedView._dataSource);
         this._treeView.openNode(0);
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
            /*TODO разобраться со стратегией и форматами*/
            strategy: new ArrayStrategy(),
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
         this.close();
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