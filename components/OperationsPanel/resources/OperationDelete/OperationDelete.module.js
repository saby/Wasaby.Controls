/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationDelete', [
      'js!SBIS3.CONTROLS.Link'
], function(Link) {

   var OperationDelete = Link.extend({

      $protected: {
         _options: {
             /**
              * @noShow
              */
            linkedView: undefined,
             /**
              * @cfg {String} Иконка кнопки удаления
              * @editor icon ImageEditor
              */
            icon: 'sprite:icon-24 action-hover icon-Erase icon-error'
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         var view = this._options.linkedView,
            selectedItems = view.getSelectedItems(),
            records = selectedItems.length ? selectedItems : view._dataSet._indexId;
         view.deleteRecords(records);
      }
   });

   return OperationDelete;

});