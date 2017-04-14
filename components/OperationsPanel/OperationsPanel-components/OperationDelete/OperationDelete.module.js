/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationDelete', [
      'js!SBIS3.CONTROLS.IconButton'
], function(IconButton) {
   /**
    * Операция удаления.
    *
    * SBIS3.CONTROLS.OperationDelete
    * @class SBIS3.CONTROLS.OperationDelete
    * @extends SBIS3.CONTROLS.IconButton
    * @author Сухоручкин Андрей Сергеевич
    * @public
    */
   var OperationDelete = IconButton.extend(/** @lends SBIS3.CONTROLS.OperationDelete.prototype */{

      constructor: function(cfg) {
         cfg.caption = cfg.caption || rk('Удалить');
         cfg.icon = cfg.icon || 'sprite:icon-24 icon-Erase icon-error';
         OperationDelete.superclass.constructor.call(this, cfg);
      },

      _clickHandler: function() {
         var view = this._options.linkedView,
            selectedKeys = view.getSelectedKeys(),
            keys = selectedKeys.length ? selectedKeys : this._getAllKeys();
         view.deleteRecords(keys);
      },
      _getAllKeys: function() {
         var keys = [],
             view = this._options.linkedView;
         view.getItems().each(function(item) {
            keys.push(item.getId());
         });
         return keys;
      }
   });

   return OperationDelete;

});