/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.LoadingIndicator', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, представляющий из себя диалоговое окно с рисунком или анимацией, визуально отображающей процесс прохождения какой-либо длительной операции
    * @class SBIS3.CONTROLS.LoadingIndicator
    * @author Крайнов Дмитрий Олегович
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.PopupMixin
    */

   var LoadingIndicator = Control.Control.extend( /** @lends SBIS3.CONTROLS.LoadingIndicator.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String}  Сообщение при закгрузке
             */
            message: '',
            /**
             * @typedef {Object} LoadingModeEnum
             * @variant progress Шкала с процентами
             * @variant infinity Крутящийся индикатор
             */
            /**
             * @cfg {LoadingModeEnum} Вид индикатора загрузки
             */
            type: 'infinity',
            /**
             * @cfg {Boolean} Отображать или нет проценты
             */
            percents: false
         }
      },

      $constructor: function() {

      },

      /**
       * Установить сообщение
       * @param {String} message
       */
      setMessage: function(message) {

      },

      /**
       * Установить процентное состояние процесса загрузки
       * @param {Number} percents
       */
      setProgress: function(percents) {

      }
   });

   return LoadingIndicator;

});