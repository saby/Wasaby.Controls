define('SBIS3.CONTROLS/PrintDialogTemplate',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!SBIS3.CONTROLS/PrintDialogTemplate/PrintDialogTemplate',
      'Core/Deferred',
      'Lib/Control/LoadingIndicator/LoadingIndicator',
      'Core/CommandDispatcher',
      'css!SBIS3.CONTROLS/PrintDialogTemplate/PrintDialogTemplate'
   ], function(CompoundControl, template, Deferred, LoadingIndicator, CommandDispatcher) {
      "use strict";

      var PrintDialogTemplate = CompoundControl.extend({
         _dotTplFn: template,
         $protected: {
            _options: {
               autoWidth: true,
               needShowReportDialog: true,
               minHeight: 384,
               maxHTMLLength: 10*1000*1000
            },
            _readyDeferred: undefined
         },

         $constructor: function() {
            this._readyDeferred = new Deferred();
         },

         getReadyDeferred: function() {
            return this._readyDeferred;
         },

         init: function() {
            PrintDialogTemplate.superclass.init.apply(this, arguments);

            var
               htmlView = this.getChildControlByName('controls-PrintDialog-print-report'),
               self = this;

            CommandDispatcher.declareCommand(this, 'startPrint', function() {
               htmlView.print();
            });

            htmlView.once('onContentReady', function() {
               LoadingIndicator.toggleIndicator(false);
               self._readyDeferred.callback();
               if (self._options.needShowReportDialog) {
                  //Блокируем навигацию по клику на ссылки
                  $(htmlView.getIframeDocument()).delegate('a', 'click', function(event) {
                     event.preventDefault();
                  });
               } else {
                  htmlView.print().addCallback(function() {
                     self.sendCommand('close');
                  });
               }
            });

            if (!htmlView.setHTML(this._options.htmlText, this._options.maxHTMLLength)) {
               // Длина документа превысила установленное значение, диалог показан не будет, отменяем печать.
               LoadingIndicator.toggleIndicator(false);
               // Закрываем диалог печати.
               this.sendCommand('close');
            }
         }
      });

      return PrintDialogTemplate;
   });
