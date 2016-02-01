define('js!genie.OperationPanelMarkEditor',
   [
      'js!genie.OperationPanelCustomEditor',
      'js!genie.OperationPanelCustomOperations'
   ],
   function (parent, editor) {
      var OperationPanelMarkEditor = parent.extend({
         getPopupConstructor: function () {
            return editor;
         },
         getPopupConfig: function () {
            return {
               filteredOpts: {
                  selectCurrentPage: true,
                  removeSelection: true,
                  invertSelection: true,
                  showSelection: true
               }
            }
         }
      });
      return OperationPanelMarkEditor;
   });