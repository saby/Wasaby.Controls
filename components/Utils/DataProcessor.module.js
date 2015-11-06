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
         this._prepareSerializer('Печать записей...').addCallback(function(reportText){
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
      unload: function (fileType, methodName, fileName, useGET) {
         var self = this,
             uniqueToken = ('' + Math.random()).substr(2)* 10;
         //fileName = idReport ? idReport : (isSaveColumns ? 'Выбранные столбцы' : 'Как на экране'), ??
         this._prepareSerializer('Подождите, идет выгрузка данных в ' + fileType).addCallback(function(reportText){
            $ws.helpers.saveToFile(fileType, methodName, {
               'html': reportText,
               'Название': fileName,//idReport || Standart
               'fileDownloadToken': uniqueToken
            }, undefined, useGET).addErrback(function(error){
               return error;
            }).addBoth(function(){
               self._destroyLoadIndicator();
            });
         });
      },
      _prepareSerializer: function(title){
         var serializer = new Serializer({
                  columns: this._options.columns,
                  report: this._options.report
               });
         this._createLoadIndicator(title);
         return serializer.prepareReport(this._options.xsl, this._options.dataSet);
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

