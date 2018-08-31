define('SBIS3.CONTROLS/Utils/PrintDialogHTMLView', [
   'Core/core-merge',
   'Core/Deferred',
   'Core/moduleStubs',
   'Core/SessionStorage',
   'Core/detection'
], function(cMerge, Deferred, moduleStubs, SessionStorage, detection) {

   var autoTestsConfig = SessionStorage.get('autoTestConfig');

   //retailOffline неожиданно превратился в chrome, в котором нет нативного диалога предпросмотра. Будем показывать свой.
   var needShowReportDialog = !detection.chrome || detection.retailOffline || autoTestsConfig && autoTestsConfig.showPrintReportForTests;

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

      var
         options = cfg || {},
         minWidth = cfg.minWidth || 398;

      //minWidth передаем только в componentOptions, в опциях диалога он не нужен, т.к. ширина будет расчитана по контенту.
      //В popup на vdom есть ошибка, что если задать minWidth, то ширина окна ограничивается этим minWidth, выписана задача
      //на исправление https://online.sbis.ru/opendoc.html?guid=22280db9-fa89-45e0-8b33-2ea0a4251fc5
      delete cfg.minWidth;

      return moduleStubs.require(['SBIS3.CONTROLS/Action/OpenDialog']).addCallback(function(result) {
         var
            def = new Deferred(),
            action;

         //Устанавливаем неустановленные опции в дефолтные значения
         cMerge(options, {
            resizable: false,

            //на vdom не работает опция visible у диалогов. Поэтому сами будем скрывать окно печати стилями.
            className: !needShowReportDialog ? 'controls-PrintDialog__invisible' : '',
            isStack: true,
            task_1174068748: true,
            template: 'SBIS3.CONTROLS/PrintDialogTemplate',
            componentOptions: {
               minWidth: minWidth,
               htmlText: options.htmlText,
               needShowReportDialog: needShowReportDialog,
               handlers: {
                  onAfterShow: function() {
                     def.callback();
                  },
                  onDestroy: function() {
                     action.destroy();
                  }
               }
            }
         }, {preferSource: true});

         action = new result[0]({
            template: options.template,
            dialogOptions: options,
            componentOptions: options.componentOptions
         });

         action.execute();
         return def;
      });
   };
});
