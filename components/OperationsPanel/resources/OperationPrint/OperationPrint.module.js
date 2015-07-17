/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Utils.DataProcessor'
], function(PrintUnloadBase, Dialog, Printer) {

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
            caption: 'Распечатать',
            xsl : undefined
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         this._prepareOperation('Что напечатать');
      },
      /**
       * @param columns
       * @private
       */
      _notifyOnApply : function(columns){
         return this._notify('onApplyOperation', 'print', columns);
      },
      applyOperation: function(dataSet, cfg){

         var p = new Printer(cfg);
         p.print();
      }
   });

   return OperationPrint;

});