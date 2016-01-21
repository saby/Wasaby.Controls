/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMove', [
   'js!SBIS3.CONTROLS.Link'
], function(Link) {
   /**
    * Операция перемещения.
    *
    * SBIS3.CONTROLS.OperationMove
    * @class SBIS3.CONTROLS.OperationMove
    * @extends SBIS3.CONTROLS.Link
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationMove'>
    *
    * </component>
    */
   var OperationMove = Link.extend({

      $protected: {
         _options: {
            /**
             * @noShow
             */
            linkedView: undefined,
            /**
             * @cfg {String} Иконка кнопки перемещения
             * @editor icon ImageEditor
             */
            icon: 'sprite:icon-24 icon-Move icon-primary action-hover',
            /**
             * @cfg {String} Всплывающая подсказка кнопки перемещения
             * @example
             *  <pre>
             *     <option name="title">Перенести отмеченные записи</option>
             * </pre>
             * @translatable
             */
            title: 'Перенести отмеченные',
            /**
             * @cfg {String} Текст на кнопке
             * @example
             * <pre>
             *     <option name="caption">Перенести записи</option>
             * </pre>
             * @translatable
             */
            caption: 'Перенести'
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         this._options.linkedView.moveRecordsWithDialog();
      }
   });

   return OperationMove;

});