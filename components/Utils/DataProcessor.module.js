/**
 * Created by ad.chistyakova on 14.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DataProcessor', [
   'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer',
   'js!SBIS3.CORE.LoadingIndicator'
], function(Serializer, LoadingIndicator) {

   return $ws.core.extend({}, {

      $protected: {
         _options: {
            dataSet: undefined,
            report: undefined,
            xsl : 'default-list-transform.xsl', //что делать с item  ?
            columns: []
         },
         _reportPrinter : null,
         _loadIndicator: undefined
      },

      $constructor: function() {
      },
      print: function () {
         var self = this;
         this._createLoadIndicator('Печать записей...');
         var serializer = new Serializer({
            columns: this._options.columns,
            report: this._options.report
         });
         serializer.prepareReport(this._options.xsl, this._options.dataSet).addCallback(function(reportText){
            $ws.helpers.showHTMLForPrint({
               htmlText: reportText,
               //opener: self,
               handlers: {
                  onAfterClose: function() {
                     self._destroyLoadIndicator();
                  }
               }
            }).addCallback(function(printDialog){
               self._destroyLoadIndicator();
            });
         });
      },
      unload: function (fileType) {
         var self = this;
         this._createLoadIndicator('Сохранение в ...');
         var serializer = new Serializer({
            columns: this._options.columns,
            report: this._options.report
         });
         serializer.prepareReport(this._options.xsl, this._options.dataSet).addCallback(function(reportText){
            //(object, methodName, params, url)
            $ws.helpers.saveToFile(fileType, {
               htmlText: reportText,
               //opener: self,
               handlers: {
                  onAfterClose: function() {
                     self._destroyLoadIndicator();
                  }
               }
            }).addCallback(function(printDialog){
               self._destroyLoadIndicator();
            });
         });
      },
      _createLoadIndicator: function (message) {
         this._loadIndicator = new LoadingIndicator({
            'message': message,
            'name': 'ws-load-indicator'
         });
      },
      _destroyLoadIndicator: function ( ) {
         if (this._loadIndicator) {
            this._loadIndicator.hide();
            this._loadIndicator.destroy();
            this._loadIndicator = undefined;
         }
      }
   });
});

