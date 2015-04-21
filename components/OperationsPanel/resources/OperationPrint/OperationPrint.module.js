/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Printer',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function(PrintUnloadBase, Dialog, Printer, StaticSource, ArrayStrategy) {

   var OperationPrint = PrintUnloadBase.extend({

      $protected: {
         _options: {
            items: [
               {
                  icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
                  title: 'Распечатать',
                  linkText: 'Распечатать',
                  caption: 'Распечатать'
               }
            ],
            icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
            title: 'Распечатать',
            linkText: 'Распечатать',
            caption: 'Распечатать'
         },
         _view : undefined
      },

      $constructor: function() {
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
        this._view = this.getParent().getLinkedView();
      },
      _clickHandler: function() {
         //var selectedItems = this._view.getSelectedItems(),
         //      records = selectedItems.length ? selectedItems : this._view._dataSet._indexId,
         //      self = this;
         //if (!selectedItems.length) {
         //   //Показать диалог выбора записей
         //   new Dialog ({
         //      template: 'js!SBIS3.CONTROLS.PrintMassSelectorDialog',
         //      caption : 'Что напечатать',
         //      resizable: false,
         //      handlers: {
         //         onBeforeShow: function(){
         //            var dialog = this;
         //            //this.getLinkedContext().setValue('NumOfRecords', self._view._dataSet.getCount()); Хочется, чтобы было так
         //            //TODO Но пришлось сделать так:
         //            this.getChildControlByName('controls-PrintMassSelectorDialog').getContext().setValue('NumOfRecords', self._view._dataSet.getCount());
         //            this.getChildControlByName('controls-buttonPrint').subscribe('onActivated', function(){
         //
         //               if(dialog.validate()){
         //                  self.callPrinter();
         //                  dialog.ok();
         //               }
         //            });
         //         },
         //         onAfterClose : function(){
         //
         //         }
         //      }
         //   });
         //} else {
         //   var items = [],
         //         selected = this._view.getSelectedItems(),
         //         record;
         //   for (var i = 0, len = selected.length; i < len; i++) {
         //      record = this._view._dataSet.getRecordByKey(selected[i]);
         //      items.push(record);
         //   }
         //   //debugger;
         //   this._printItems(items/*, record.getKeyField()*/);
         //}
         this._prepareOperation('Что напечатать');
      },
      _printItems: function(items){
         var dataSource = new StaticSource({
               data: [],
               strategy: new ArrayStrategy(),
               keyField: 'id' //Найти в записи
            }),
            self = this;
         dataSource.query(undefined, undefined, 0).addCallback(function (dataSet) {
            //TODO должна быть другая возможность создать подВхождение датаСета
            dataSet.setRecords(items);
            self.callPrinter(dataSet);
         });
      },
      applyOperation: function(dataSet){

         var p = new Printer({
            dataSet : dataSet || this._view._dataSet,
//                                    xsl: 'default-list-transform.xsl',
            columns: this._view.getColumns()
         });
         p.print();
      }
   });

   return OperationPrint;

});