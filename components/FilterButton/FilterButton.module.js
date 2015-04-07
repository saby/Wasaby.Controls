/**
 * Created by as.suhoruchkin on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButton', [
   'js!SBIS3.CORE.CompoundControl'
], function(CompoundControl) {

   var OperationDelete = CompoundControl.extend({

      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Erase icon-error'
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         var view = this.getParent().getLinkedView(),
            selectedItems = view.getSelectedItems(),
            records = selectedItems.length ? selectedItems : view._dataSet._indexId;
         view.deleteRecords(records);
      }
   });

   return OperationDelete;

});