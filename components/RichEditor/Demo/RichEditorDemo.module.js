define('js!SBIS3.CONTROLS.Demo.RichEditorDemo',
[
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.RichEditorDemo',
   'js!SBIS3.CONTROLS.RichEditor',
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.RichTextArea',
   'js!SBIS3.CONTROLS.RichEditorRoundToolbar'
], function(CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      init: function(){
         moduleClass.superclass.init.call(this);
         this._textArea = this.getChildControlByName('RichTextArea');
         this._toolbar = this.getChildControlByName('RichEditorRoundToolbar');
         this._toolbar2 = this.getChildControlByName('RichEditorRoundToolbar2');
         // Связываем тулбар с полем ввода
         this._toolbar.setLinkedEditor(this._textArea);
         this._toolbar2.setLinkedEditor(this._textArea);
      }
   });
   return moduleClass;
});