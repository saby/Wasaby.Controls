define('SBIS3.CONTROLS/Utils/OpenErrorsReportDialog', [
   'require',
   'Core/Deferred',
   'Core/WindowManager',
   'Core/Context',
   'Core/moduleStubs'
], function(require, Deferred, windowManager, Context, moduleStubs) {

   /**
    * Модуль, в котором описана функция <b>openErrorsReportDialog(cfg)</b>.
    *
    * Открывает диалог с результатами выполнения массовых операций.
    *
    * <h2>Параметры функции</h2>
    * <ul>
    *     <li><b>cfg</b> {Object} - конфигурация.</li>
    * </ul>
    *
    * <h2>Пример использования</h2>
    * <pre>
    *    require(['SBIS3.CONTROLS/Utils/openErrorsReportDialog'], function(helpers) {
     *       helpers.openErrorsReportDialog({
     *
     *          // Количество обработанных\выделенных записей
     *          'numSelected': cntSelected,
     *
     *          // Количество успешно выполненных операций
     *          'numSuccess': cntSuccess,
     *
     *          // Array, Список всех ошибок.
     *          'errors': errors,
     *
     *          // Заголовок - опция для вывода названия операции, которая выполнялась
     *          'title': 'Итоги операции: "Отправить"'
     *       });
     *    });
    * </pre>
    *
    * @class SBIS3.CONTROLS/Utils/openErrorsReportDialog
    * @public
    * @author Сухоручкин А.С.
    */
   return function(cfg) {
      var
         numSelected = cfg.numSelected || 0,
         numSuccess = cfg.numSuccess || 0,
         numErrors = numSelected - numSuccess,
         errors = cfg.errors || [],
         finishContextDfr = new Deferred(),
         context = Context.createContext(finishContextDfr),
         errorsText = [];

      context.setValue('Отмечено', numSelected);
      context.setValue('Обработано', numSuccess);
      context.setValue('НеВыполнено', numErrors);
      for (var i = 0, len = errors.length; i < len; i++) {
         var text = errors[i] instanceof Error ? errors[i].message : errors[i];
         if (errorsText.indexOf(text) === -1) {
            errorsText.push(text);
            if (errorsText.length > 5) {
               break;
            }
         }
      }

      context.setValue('ТекстОшибки', errorsText.join('<br>'));
      moduleStubs.require(['SBIS3.CONTROLS/Action/OpenDialog']).addCallback(function(result) {
         var action  = new result[0]({
            template: 'Deprecated/res/wsmodules/ErrorsReportDialog/ErrorsReportDialog',
            dialogOptions: {
               cssClassName: 'ws-errorsReportDialog',
               context: context,
               resizable: false,
               isReadOnly: true,
               caption: cfg.title || '',
               opener: windowManager && windowManager.getActiveWindow(),
               handlers: {
                  'onAfterLoad': function() {
                     $('.ws-errorsReportDialog-errorsDescription', this.getContainer()).html('<div style="overflow: auto;">' + errorsText.join('<br>') + '</div>');
                     if (numErrors === 0) {
                        this.getContainer().find('.ws-errorsReportDialog-process-panel').css('display', 'none');
                     }
                  },
                  'onDestroy': function() {
                     finishContextDfr.callback();
                  }
               }
            }
         });

         action.execute();
      });
   };
});
