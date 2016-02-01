define('js!genie.HandlersArrayEditor',
   [
      'js!genie.PropertyEditorStandardArray',
      'js!genie.PropertyGridEditor'
   ], function (arrayEditor, PGEditor) {
      return arrayEditor.extend({
         getPopupConstructor: function () {
            return PGEditor;
         }
      });
   });