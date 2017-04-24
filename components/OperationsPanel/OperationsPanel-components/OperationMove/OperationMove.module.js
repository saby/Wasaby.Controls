/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMove', [
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Action.List.InteractiveMove',
   'i18n!SBIS3.CONTROLS.OperationMove'
], function(Link, InteractiveMove) {
   /**
    * Операция перемещения.
    *
    * SBIS3.CONTROLS.OperationMove
    * @class SBIS3.CONTROLS.OperationMove
    * @extends SBIS3.CONTROLS.Link
    * @author Сухоручкин Андрей Сергеевич
    * @public
    */
   var OperationMove = Link.extend(/** @lends SBIS3.CONTROLS.OperationMove.prototype */{

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
             * @cfg {SBIS3.CONTROLS.Action.List.InteractiveMove} Экшен который будет перемещать записи
             */
            action: undefined
         }
      },

      _modifyOptions: function(cfg) {
         cfg = cfg||{};
         if (!cfg.action) {
            cfg.action = new InteractiveMove({
               linkedObject: cfg.linkedView
            });
         }
      },
      init: function () {
         OperationMove.superclass.init.call(this);
         if (this._options.linkedView) {
            this.subscribeTo(this._options.linkedView, 'onKeyPressed', this._viewKeyPressed.bind(this));
         }
      },
      _clickHandler: function() {
         this._options.action.execute();
      },
      _viewKeyPressed: function (e) {
         switch (e.which) {
            case constants.key.m:
               e.ctrlKey && this.execute();
               break;
         }
      }
   });

   return OperationMove;

});