define('js!SBIS3.CONTROLS.Demo.RichEditorDemo', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.RichEditorDemo', 'js!SBIS3.CONTROLS.RichEditor','js!SBIS3.CONTROLS.TextBox'], function(CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.FREditor.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
         },
         RichEditor: undefined
      },
      $constructor: function() {

      },

      init: function() {
         moduleClass.superclass.init.call(this);
         this.RichEditor = this.getChildControlByName('RichEditorDemo');
         this.TextBox = this.getChildControlByName('TextBox');
      }
   });
   return moduleClass;
});