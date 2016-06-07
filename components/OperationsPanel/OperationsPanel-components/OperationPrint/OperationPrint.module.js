/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Utils.DataProcessor',
   'i18n!SBIS3.CONTROLS.OperationPrint'
], function(PrintUnloadBase, Dialog, Printer, rk) {
   /**
    * Контрол для печати подготовленных данных
    * @class SBIS3.CONTROLS.OperationPrint
    * @extends SBIS3.CONTROLS.PrintUnloadBase
    * @author Крайнов Дмитрий Олегович
    * @control
    * @public
    */
   var OperationPrint = PrintUnloadBase.extend(/** @lends SBIS3.CONTROLS.OperationPrint.prototype */{

      $protected: {
         _options: {
            items: [
               {
                  icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
                  title: rk('Распечатать'),
                  linkText: rk('Распечатать'),
                  caption: rk('Распечатать')
               }
            ],
            icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
            title: rk('Распечатать'),
            linkText:  rk('Распечатать'),
            caption: rk('Распечатать'),
            xsl : undefined,
            /**
             * @cfg (number) Минимальная ширина предварительного окна печати
             */
            minPrintWindowWidth: 0
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
      applyOperation: function(cfg){
         var p;
         cfg.minWidth = this._options.minPrintWindowWidth;
         if (this._options.xsl) {
            cfg.xsl = this._options.xsl;
            cfg.report = true;
         }
         p = new Printer(cfg);
         p.print();
      }
   });

   return OperationPrint;

});