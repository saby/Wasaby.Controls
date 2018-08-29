define('SBIS3.CONTROLS/Utils/PrintDialogHTMLView', [
   'Core/core-merge',
   'Core/Deferred',
   'Core/moduleStubs'
], function (cMerge, Deferred, moduleStubs) {
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

      return moduleStubs.require(['SBIS3.CONTROLS/Action/OpenDialog']).addCallback(function(result) {
         var
            def = new Deferred(),
            action;

         //Устанавливаем неустановленные опции в дефолтные значения
         cMerge(options, {
            resizable: false,

            //на vdom не работает опция visible у диалогов. Поэтому сами будем скрывать окно печати стилями.
            className: 'controls-PrintDialog__invisible',
            isStack: true,
            task_1174068748: true,
            template: 'SBIS3.CONTROLS/PrintDialogTemplate',
            minWidth: minWidth,
            componentOptions: {
               minWidth: minWidth,
               htmlText: options.htmlText,
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
