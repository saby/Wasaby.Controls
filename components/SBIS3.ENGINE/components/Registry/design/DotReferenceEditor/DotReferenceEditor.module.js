define('js!genie.DotReferenceEditor',
   [
      'js!genie.PropertyEditorSimple',
      'html!genie.DotReferenceEditor',
      'js!SBIS3.CONTROLS.TextBox',
      'css!genie.DotReferenceEditor'
   ],
   function (PropertyEditorSimple, dotTplFn) {
      'use strict';
      var DotReferenceEditor = PropertyEditorSimple.extend({
         _dotTplFn: dotTplFn,
         initDot: function () {
         },
         initEditor: function () {
            var val = this.getConfig().getValue() || '';
            val = val.replace(/{{@(.*)}}/, '$1');
            this.getInput().setValue(val);
         },
         setValue: function (value) {
            var val = (/^{{@(.*)}}$/.exec(value) || [])[1] || '';
            this.getInput().setValue(val);
         },
         emitValue: function (value) {
            var resVal = value ? ['{{@', value, '}}'].join('') : '';
            this.getConfig().setValue(resVal);
         }
      });
      return DotReferenceEditor;
   });