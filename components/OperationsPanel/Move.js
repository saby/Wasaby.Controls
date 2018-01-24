/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Move', [
   'SBIS3.CONTROLS/Link',
   'i18n!SBIS3.CONTROLS/OperationsPanel/Move'
], function(Link) {
   /**
    * Операция перемещения.
    *
    * SBIS3.CONTROLS/OperationsPanel/Move
    * @class SBIS3.CONTROLS/OperationsPanel/Move
    * @extends SBIS3.CONTROLS/Link
    * @author Сухоручкин А.С.
    * @public
    */
   var OperationMove = Link.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Move.prototype */{

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
            title: rk('Перенести отмеченные'),
            /**
             * @cfg {String} Текст на кнопке
             * @example
             * <pre>
             *     <option name="caption">Перенести записи</option>
             * </pre>
             * @translatable
             */
            caption: rk('Перенести'),
            /**
             * @cfg {SBIS3.CONTROLS/Action/List/InteractiveMove} Action, который будет перемещать записи.
             */
            action: undefined
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         if (this._options.action) {
            this._options.action.execute();
         } else {
            this._options.linkedView.moveRecordsWithDialog();
         }
      }
   });

   return OperationMove;

});