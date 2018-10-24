define('SBIS3.CONTROLS/Utils/OpenErrorsReportDialog', [
   'Core/WindowManager'
], function(windowManager) {

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
         errorsText = [],
         errors = cfg.errors || [];

      for (var i = 0, len = errors.length; i < len; i++) {
         var text = errors[i] instanceof Error ? errors[i].message : errors[i];
         if (errorsText.indexOf(text) === -1) {
            errorsText.push(text);
            if (errorsText.length > 5) {
               break;
            }
         }
      }

      require(['Controls/Popup/Opener/Dialog', 'Core/Control'], function(PopupOpener, Control) {
         var popupOpener = Control.createControl(PopupOpener, {
            popupOptions: {
               isModal: true,
               template: 'Controls/Utils/ErrorsReportDialog/ErrorsReportDialog',
               opener: windowManager && windowManager.getActiveWindow(),
               templateOptions: {
                  operationsCount: cfg.numSelected || 0,
                  operationsSuccess: cfg.numSuccess || 0,
                  errors: errorsText,
                  title: cfg.title
               }
            }
         }, document.createElement('div'));
         popupOpener.open();
      });
   };
});
