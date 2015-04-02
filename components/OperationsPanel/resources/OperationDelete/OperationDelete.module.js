/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationDelete', [
      'js!SBIS3.CONTROLS.MenuLink'
], function(MenuLink) {

   var OperationDelete = MenuLink.extend({

      $protected: {
         _options: {
            name: 'delete',
            icon: 'sprite:icon-24 action-hover icon-Erase icon-error'
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         var view = this.getParent().getLinkedView(),
            selectedItems = view.getSelectedItems(),
            records = selectedItems.length ? selectedItems : view._dataSet._indexId;
         view._dataSet.removeRecord(records);
         view._dataSource.sync(view._dataSet);
      }
   });

   return OperationDelete;

});