/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMove', [
   'js!SBIS3.CONTROLS.Link'
], function(Link) {

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
             */
            title: 'Перенести отмеченные',
            /**
             * @cfg {String} Текст на кнопке
             * @example
             * <pre>
             *     <option name="caption">Перенести записи</option>
             * </pre>
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