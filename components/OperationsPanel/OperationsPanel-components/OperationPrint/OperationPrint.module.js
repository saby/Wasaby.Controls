/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.Utils.DataProcessor',
   'i18n!SBIS3.CONTROLS.OperationPrint'
], function(PrintUnloadBase, Dialog, Printer) {
   /**
    * Контрол для печати подготовленных данных
    * @class SBIS3.CONTROLS.OperationPrint
    * @extends SBIS3.CONTROLS.PrintUnloadBase
    * @author Сухоручкин Андрей Сергеевич
    * @public
    */
   var OperationPrint = PrintUnloadBase.extend(/** @lends SBIS3.CONTROLS.OperationPrint.prototype */{

      $protected: {
         _options: {
            /**
             * @typedef {Object} OperationPrintItem
             * @property {String} icon
             * @property {String} title
             * @property {String} linkText
             * @property {String} caption
             * @translatable caption title
             */
            /**
             * @cfg {Array.<OperationPrintItem>}
             */
            items: [
               {
                  icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
                  title: rk('Распечатать'),
                  linkText: rk('Распечатать'),
                  caption: rk('Распечатать')
               }
            ],
             /**
              * @cfg {String}
              */
            icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
            /**
             * @cfg {String}
             */
            title: rk('Распечатать'),
            /**
             * @cfg {String}
             */
            linkText:  rk('Распечатать'),
            /**
             * @cfg {String}
             */
            caption: rk('Распечатать'),
            /**
             * @cfg {String}
             */
            xsl : undefined,
            /**
             * @cfg (number) Минимальная ширина предварительного окна печати
             */
            minPrintWindowWidth: 0
         }
      },

      $constructor: function() {
      },

      _onOperationActivated: function() {
         this._prepareOperation(rk('Что напечатать'));
      },

      /**
       * @param columns
       * @private
       */
      _notifyOnApply : function(columns, data){
         return this._notify('onApplyOperation', 'print', columns, data);
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