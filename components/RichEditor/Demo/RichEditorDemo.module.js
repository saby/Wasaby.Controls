define('js!SBIS3.CONTROLS.Demo.RichEditorDemo',
[
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.RichEditorDemo',
   'js!SBIS3.CONTROLS.RichEditor',
], function(CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.FREditor.prototype */{
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});