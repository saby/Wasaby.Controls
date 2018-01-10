/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Delete', [
   'SBIS3.CONTROLS/Button/IconButton'
], function(IconButton) {
   /**
    * Операция удаления.
    *
    * SBIS3.CONTROLS/OperationsPanel/Delete
    * @class SBIS3.CONTROLS/OperationsPanel/Delete
    * @extends SBIS3.CONTROLS/Button/IconButton
    * @author Сухоручкин А.С.
    * @public
    */
   var OperationDelete = IconButton.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Delete.prototype */{

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
            icon: 'sprite:icon-24 icon-Erase icon-error',
            caption: rk('Удалить')
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         var view = this._options.linkedView,
            selectedKeys = view.getSelectedKeys(),
            keys = selectedKeys.length ? selectedKeys : this._getAllKeys();
         view.deleteRecords(keys);
      },
      _getAllKeys: function() {
         //Элементы могут иметь одинаковые ключи, поэтому сначала добавляем их в объект и возвращаем массив, сделанный из этого объекта
         var keys = {},
            view = this._options.linkedView;
         view.getItems().each(function(item) {
            keys[item.getId()] = 1;
         });
         return Object.keys(keys);
      }
   });

   return OperationDelete;

});