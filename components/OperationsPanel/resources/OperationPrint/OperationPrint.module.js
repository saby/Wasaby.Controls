/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Printer'
], function(Link, Dialog, Printer) {

   var OperationPrint = Link.extend({

      $protected: {
         _options: {
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
         var selectedItems = this._view.getSelectedItems(),
               records = selectedItems.length ? selectedItems : this._view._dataSet._indexId,
               self = this;
         if (!selectedItems.length) {
            //Показать диалог выбора записей
            new Dialog ({
               template: 'js!SBIS3.CONTROLS.PrintMassSelectorDialog',
               caption : 'Что напечатать',
               resizable: false,
               handlers: {
                  onBeforeShow: function(){
                     var dialog = this;
                     //this.getLinkedContext().setValue('NumOfRecords', self._view._dataSet.getCount()); Хочется, чтобы было так
                     //Но пришлось сделать так:
                     this.getChildControlByName('controls-PrintMassSelectorDialog').getContext().setValue('NumOfRecords', self._view._dataSet.getCount());
                     this.getChildControlByName('controls-buttonPrint').subscribe('onActivated', function(){
                        debugger;
                        if(dialog.validate()){
                           self.callPrinter();
                           dialog.ok();
                        }
                     });
                  },
                  onAfterClose : function(){

                  }
               }
            });
         }
         //Printer
         //this.getParent().getLinkedView().printReport(/*idReport, isReportForList, data*/);
      },
      _printNumOfRecords: function(num){
         
      },
      callPrinter: function(dataSet){

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