define('js!genie.OperationPanelSelectedEditor',
   [
      'js!genie.OperationPanelCustomEditor',
      'js!genie.OperationPanelCustomOperations'
   ],
   function (parent, editor) {
      var OperationPanelSelectedEditor = parent.extend({
         getPopupConstructor: function () {
            return editor;
         },
         getPopupConfig: function () {
            return {
               filteredOpts: {
                  'save': true,
                  'print': true,
                  'delete': true,
                  'sum': true,
                  'merge': true,
                  'move': true
               }
            }
         }
      });
      return OperationPanelSelectedEditor;
   });