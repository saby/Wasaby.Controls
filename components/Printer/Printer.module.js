/**
 * Created by ad.chistyakova on 14.04.2015.
 */
define('js!SBIS3.CONTROLS.Printer', [  'js!SBIS3.CORE.LoadingIndicator'
], function(LoadingIndicator) {

   $ws.proto.Printer = function(config){
      return new Printer(config);
   };
   var Printer = $ws.core.extend($ws.proto.Printer, {

      $protected: {
         _options: {
            dataSet: undefined,
            report: undefined
         }
      },

      $constructor: function() {
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
      },
      showReport: function(xsl){
         xsl =   this._getTransform(idReport, object, xsl, isReportsForList);
      },
      _showReport:function(idReport, object, xsl, isReportsForList){
         xsl = this._getTransform(idReport, object, xsl, isReportsForList);
         var rp = this._reportPrinter,
               rootNode = this.isHierarchyMode() ? this._currentRootId : undefined,
               xslDoc = new $ws.proto.XMLDocument({ name: xsl }).getDocument(),
               xmlDoc = $ws.single.RecordSetToXMLSerializer.serialize(object, rp.getColumns(), rp.getTitleColumn(), rootNode),
               self = this,
               columns;
         this._useKeyboard = true;
         columns = this._notify('onBeforeTransform', xmlDoc, xslDoc);
         rp.setColumns(typeof columns === 'array' ? columns : this._columnMap);
         rp.prepareReport(object, xslDoc, rootNode, xmlDoc).addCallback(function(reportText){
            $ws.helpers.showHTMLForPrint({
               htmlText: reportText,
               opener: self,
               handlers: {
                  onInit: function() {
                     self._loadIndicator.getWindow().moveToTop();
                  },

                  onAfterClose: function() {
                     self._destroyLoadIndicator();
                  }
               }
            }).addCallback(function(printDialog){
               self._destroyLoadIndicator();
               printDialog.subscribe('onAfterClose', $.proxy(self._mouseMonitor, self));
               self.removeSelection();
            });
         }).addErrback(function(error){
            $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
         }).addBoth(function(){
            $ws.core.setCursor(true);
         });
      },
      _getTransform: function(idReport, object, xsl, isReportsForList, fileType) {
         var transform,
               res;

         fileType = fileType ? fileType.toLowerCase() : undefined;

         if (typeof idReport === 'undefined') {
            transform = $ws._const.wsRoot + 'res/xsl/' + xsl;
         } else {
            res = this._notify('onSelectReportTransform', idReport, object, xsl, isReportsForList, fileType);
            if (typeof res === 'string') {
               xsl = res;
            }

            transform = $ws._const.resourceRoot + xsl;
         }

         return transform;
      },
      _createLoadIndicator: function (message) {
         this._loadIndicator = new LoadingIndicator({
            'message': message,
            'name': 'ws-load-indicator'
         });
      }
      //if (!noIndicator) {
      //self._createLoadIndicator('Печать записей...');
      //}
   });

   //return Printer;
   return $ws.proto.Printer;

});