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
      },
      //Добавляем корень
      _onDataLoadHandler: function(event, dataSet) {
         var
            hierField = this._options.linkedView._options.hierField,
            raw;
         dataSet.each(function(record) {
            if (record.get(hierField)[0] === null) {
               record.set(hierField, [0]);
            }
         });
         raw = {
            d: [[0], [null], true, null, "Корень", false, false, null],
            s: [
               {n: "@Номенклатура",t: "Идентификатор"},
               {n: "Раздел",s: "Иерархия",t: "Идентификатор"},
               {n: "Раздел@",s: "Иерархия",t: "Логическое"},
               {n: "Раздел$",s: "Иерархия",t: "Логическое"},
               {n: "Наименование", t: "Текст"},
               {n: "Опубликовано", t: "Логическое"},
               {n: "Deleted",t: "Логическое"},
               {n: "DisplayStyle",t: "Число целое"}
            ]
         };
         var record = new Record({
            /*TODO разобраться со стратегией и форматами*/
            strategy: dataSet.getStrategy(),
            raw: raw,
            keyField: dataSet._keyField
         });
         dataSet.push(record);
         this._treeView.openNode(0);
         event.setResult(dataSet);
      },
      _moveRecords: function() {
         var
            records,
            linkedView = this._options.linkedView,
            moveTo = this._treeView.getSelectedKeys()[0] || null;
         if (moveTo !== undefined) {
            records = linkedView.getSelectedKeys();
            this._move(records, moveTo).getResult().addCallback(function() {
               linkedView.removeItemsSelectionAll();
               linkedView.openNode(moveTo);
            });
         }
         this.close();
      },
      _move: function(records, moveTo) {
         var
            record,
            deferred = new $ws.proto.ParallelDeferred(),
            linkedView = this._options.linkedView,
            hierField = linkedView._options.hierField;
         for (var i = 0; i < records.length; i++) {
            record = linkedView._dataSet.getRecordByKey(records[i]);
            deferred.push(linkedView._dataSource.move(record, hierField, [moveTo]));
         }
         return deferred.done();
      }
   });

   return MoveDialog;

});