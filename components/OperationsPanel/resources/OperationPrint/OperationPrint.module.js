/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.Link'
], function(Link) {

   var OperationPrint = Link.extend({

      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
            title: 'Распечатать',
            linkText: 'Распечатать',
            caption: 'Распечатать'
         }
      },

      $constructor: function() {
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
      },
      _clickHandler: function() {
/*
         var view = this.getParent().getLinkedView(),
               selectedItems = view.getSelectedItems(),
               records = selectedItems.length ? selectedItems : view._dataSet._indexId;
         //view.deleteRecords(records);
         //_printReport: function(idReport, isReportForList) {
            var view = this._currentView,
                  data;

            if (!view.getPagingMode() || (view.isHierarchy() && view.getTurn())) {
               data = view.getRecordSet();
            }
*/
         this.getParent().getLinkedView().printReport(/*idReport, isReportForList, data*/);
      }
   });

   return OperationPrint;

});