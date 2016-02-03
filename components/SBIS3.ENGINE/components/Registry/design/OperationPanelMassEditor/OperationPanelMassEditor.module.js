define('js!genie.OperationPanelMassEditor',
   [
      'js!genie.OperationPanelCustomEditor',
      'js!genie.OperationPanelCustomOperations'
   ],
   function (parent, editor) {
      var OperationPanelMassEditor = parent.extend({
         getPopupConstructor: function () {
            return editor;
         },
         getPopupConfig: function () {
            return {
               filteredOpts: {
                  'save': true,
                  'print': true,
                  'delete': true,
                  'sum': true
               }
            }
         }
      });
      return OperationPanelMassEditor;
   });