define('SBIS3.CONTROLS/PrintDialogTemplate',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!SBIS3.CONTROLS/PrintDialogTemplate/PrintDialogTemplate',
      'Core/SessionStorage',
      'Core/detection',
      'Lib/Control/LoadingIndicator/LoadingIndicator',
      'Core/CommandDispatcher',
      'css!SBIS3.CONTROLS/PrintDialogTemplate/PrintDialogTemplate'
   ], function(CompoundControl, template, SessionStorage, detection, LoadingIndicator, CommandDispatcher) {
      "use strict";

      var autoTestsConfig = SessionStorage.get('autoTestConfig');

      //retailOffline неожиданно превратился в chrome, в котором нет нативного диалога предпросмотра. Будем показывать свой.
      var needShowReportDialog = !detection.chrome || detection.retailOffline || autoTestsConfig && autoTestsConfig.showPrintReportForTests;

      var PrintDialogTemplate = CompoundControl.extend({
         _dotTplFn: template,
         $protected: {
            _options: {
               autoWidth: true,
               caption: needShowReportDialog ? rk('Предварительный просмотр') : '',
               minHeight : 384,
               maxHTMLLength: 3*1000*1000
            }
         },

         init: function() {
            PrintDialogTemplate.superclass.init.apply(this, arguments);

            var
               htmlView = this.getChildControlByName('controls-PrintDialog-print-report'),
               self = this;

            CommandDispatcher.declareCommand(this, 'startPrint', function() {
               htmlView.print();
            });

            htmlView.once('onContentReady', function(){
               LoadingIndicator.toggleIndicator(false);
               if (needShowReportDialog) {
                  //Блокируем навигацию по клику на ссылки
                  $(htmlView.getIframeDocument()).delegate('a', 'click', function(event) {
                     event.preventDefault();
                  });
                  self.getParent().show();
               } else {
                  //Если не нужно показывать наш диалог перед печатью, то скроем окно диалога и сразу отправим данные на печать
                  //Вешать класс ws-hidden нельзя, иначе в 59 хроме начинаются баги, подробности в ошибке
                  //https://online.sbis.ru/opendoc.html?guid=ebadd542-85a6-4b65-bfca-c7487c6a6299
                  self.getParent().getContainer().css('visibility', 'hidden');
                  //Из-за того, что нельзя навесить ws-hidden, нужно сдвинуть окно в левый верхний угол, чтобы оно не растягивало
                  //боди и на нем не появлялся скролл
                  var window = self.getParent()._window;
                  if (window) {
                     window.css({'top': 0, 'left': 0});
                  }
                  htmlView.print().addCallback(function () {
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
