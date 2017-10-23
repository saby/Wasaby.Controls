define('js!SBIS3.CONTROLS.Utils.PrintDialogHTMLView', [
   'Core/core-merge',
   'Core/moduleStubs'
], function (cMerge, moduleStubs) {
   /**
    * Показывает стандартный платформенный диалог печати.
    * @remark
    * Создание диалога производится на основе класса {@link SBIS3.CONTROLS.PrintDialog}.
    * @param {Object} cfg набор опций для диалога печати
    *
    * @param {Number} [cfg.maxHTMLLength] Максимально допустимая длина html для отображения (в символах)
    * @param {String} [cfg.htmlText] html-текст, который нужно показать в окне предварительного просмотра при печати.
    *
    * @returns {Core/Deferred} стреляет созданным окном предварительного просмотра
    */
   return function showHTMLForPrint(cfg){

      var options = cfg || {};

      //Устанавливаем неустановленные опции в дефолтные значения
      cMerge(options, {
         resizable: false,
         visible: false,
         isStack: true,
         task_1174068748: true,
         template: 'js!SBIS3.CONTROLS.PrintDialogTemplate',
         minWidth: options.minWidth,
         componentOptions: {
            minWidth: options.minWidth,
            htmlText: options.htmlText
         }
      }, {preferSource: true});

      return moduleStubs.require(['js!SBIS3.CORE.Dialog']).addCallback(function(result) {
         new result[0](options);
      });
   }
});