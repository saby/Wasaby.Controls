define('js!SBIS3.CONTROLS.Utils.InformationPopupManager',
   [
      'js!SBIS3.CONTROLS.SubmitPopup',
      'js!SBIS3.CONTROLS.NotificationPopup',
      'browser!js!SBIS3.CONTROLS.Utils.NotificationStackManager'
   ],

   /**
    * Интерфейс для работы с информационными окнами.
    * Содержит функции для показа информационных окон и нотификационных уведомелений в области уведомлений.
    * @class SBIS3.CONTROLS.Utils.InformationPopupManager
    * @author Степин П.В.
    * @public
    */
   function(SubmitPopup, NotificationPopup, NotificationManager){
      'use strict';

      var showSubmitDialog = function(config, positiveHandler, negativeHandler, cancelHandler){
         var popup = new SubmitPopup($ws.core.merge(config, {
            element: $('<div></div>'),
            isModal: true
         }));

         popup.subscribeOnceTo(popup, 'onChoose', function(e, res){
            var handler;
            switch(res){
               case true: handler = positiveHandler; break;
               case false: handler = negativeHandler; break;
               default: handler = cancelHandler; break;
            }

            if(handler && typeof handler === 'function'){
               handler();
            }
         });

         popup.show();
         popup.setActive(true);
         return popup;
      };

      return /** @lends SBIS3.CONTROLS.Utils.InformationPopupManager.prototype */{
         /**
          * Показать диалог с кнопками "Да", "Нет" и (опционально) "Отмена"
          * @param {Configuration} Устанавливает конфигурацию для окна - {@link SBIS3.CONTROLS.SubmitPopup}
          * @param {Function} positiveHandler Обработчик нажатия на кнопку "Да"
          * @param {Function} negativeHandler Обработчик нажатия на кнопку "Нет"
          * @param {Function} [cancelHandler] Обработчик нажатия на кнопку "Отмена"
          * @returns {SBIS3.CONTROLS.SubmitPopup} экземпляр диалога
          */
         showConfirmDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            return showSubmitDialog($ws.core.merge(config, {
               status: 'confirm'
            }), positiveHandler, negativeHandler, cancelHandler);
         },

         /**
          * Показать диалог с сообщением и 1 кнопкой. Диалог может иметь одно из состояний: "Ошибка" / "Успешно" / "Предупреждение"
          * @param {Configuration} Устанавливает конфигурацию для окна - {@link SBIS3.CONTROLS.SubmitPopup}
          * @param {Function} handler Обработчик нажатия на кнопку "Ок"
          * @returns {SBIS3.CONTROLS.SubmitPopup} экземпляр диалога
          */
         showMessageDialog: function(config, handler){
            return showSubmitDialog(config, null, null, handler);
         },

         /**
          * Показать нотификационное сообщение
          * @param {Configuration} Устанавливает конфигурацию для окна - {@link SBIS3.CONTROLS.NotificationPopup}
          * @param {Boolean} notHide Не прятать окно по истичению времени жизни
          * @returns {SBIS3.CONTROLS.NotificationPopup} экземпляр нотификационного сообщения
          */
         showNotification: function(config, notHide){
            var popup = new NotificationPopup($ws.core.merge({
               element: $('<div></div>')
            }, config));

            NotificationManager.showNotification(popup, notHide);

            return popup;
         },

         /**
          * Показать произвольное нотификационное сообщение
          * @param inst Экземпляр окна
          * @param {Boolean} notHide Не прятать окно по истичению времени жизни
          */
         showCustomNotification: function(inst, notHide){
            NotificationManager.showNotification(inst, notHide);
            return popup;
         }
      };
   }
);