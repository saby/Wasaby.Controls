/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationDelete', [
      'js!SBIS3.CONTROLS.Link'
], function(Link) {
   /**
    * Операция удаления.
    *
    * SBIS3.CONTROLS.OperationDelete
    * @class SBIS3.CONTROLS.OperationDelete
    * @extends SBIS3.CONTROLS.Link
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationDelete'>
    *
    * </component>
    */
   var OperationDelete = Link.extend(/** @lends SBIS3.CONTROLS.OperationDelete.prototype */{

      $protected: {
         _options: {
             /**
              * @cfg {String} Иконка кнопки удаления
              * @editor icon ImageEditor
              */
            icon: 'sprite:icon-24 icon-Erase icon-error',
            command: 'deleteItems'
         }
      }
   });

   return OperationDelete;

});