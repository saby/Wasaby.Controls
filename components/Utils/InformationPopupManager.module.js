define('js!SBIS3.CONTROLS.Utils.InformationPopupManager',
   [
   "Core/core-merge",
   "js!SBIS3.CONTROLS.SubmitPopup",
   "js!SBIS3.CONTROLS.NotificationPopup",
   "browser!js!SBIS3.CONTROLS.Utils.NotificationStackManager"
],

   /**
    * Интерфейс для работы с информационными окнами.
    * Содержит функции для показа информационных окон и нотификационных уведомелений в области уведомлений.
    * @class SBIS3.CONTROLS.Utils.InformationPopupManager
    * @author Степин П.В.
    * @public
    */
   function( cMerge,SubmitPopup, NotificationPopup, NotificationManager){
      'use strict';

      var showSubmitDialog = function(config, positiveHandler, negativeHandler, cancelHandler){
         var popup = new SubmitPopup(cMerge(config, {
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
          * Открывает диалог с кнопками "Да", "Нет" и "Отмена" (опционально).
          * @param {Object} Объект конфигурацией открываемого диалога - {@link SBIS3.CONTROLS.SubmitPopup}.
          * @param {Function} positiveHandler Обработчик нажатия на кнопку "Да".
          * @param {Function} negativeHandler Обработчик нажатия на кнопку "Нет".
          * @param {Function} [cancelHandler] Обработчик нажатия на кнопку "Отмена".
          * @returns {SBIS3.CONTROLS.SubmitPopup} Экземпляр класса диалога.
          * @example
          * <pre>
          * InformationPopupManager.showConfirmDialog(
          *    {
          *       message: 'Сохранить изменения?',
          *       details: 'Чтобы продолжить редактирование нажмите, «Отмена».',
          *       opener: self
          *    },
          *    myPositiveHandler, myNegativeHandler
          * );
          * </pre>
          * @see showMessageDialog
          */
         showConfirmDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            return showSubmitDialog(cMerge(config, {
               status: 'confirm'
            }), positiveHandler, negativeHandler, cancelHandler);
         },

         /**
          * Открывает диалог с сообщением и одной кнопкой "Ок". Диалог может находиться в одном из трёх состояний: "Ошибка" , "Успешно" или "Предупреждение".
          * @param {Object} Объект конфигурацией открываемого диалога - {@link SBIS3.CONTROLS.SubmitPopup}.
          * @param {Function} handler Обработчик нажатия на кнопку "Ок".
          * @returns {SBIS3.CONTROLS.SubmitPopup} Экземпляр класса диалога.
          * @example
          * <pre>
          * InformationPopupManager.showMessageDialog(
          *    {
          *       message: 'Изменения были сохранены',
          *       opener: self
          *    },
          *    myOkHandler
          * );
          * </pre>
          * @see showConfirmDialog
          */
         showMessageDialog: function(config, handler){
            return showSubmitDialog(config, null, null, handler);
         },

         /**
          * Показывает нотификационное сообщение.
          * @param {Object} Объект конфигурацией открываемого окна - {@link SBIS3.CONTROLS.NotificationPopup}.
          * @param {Boolean} notHide true - не скрывать окно по истичению времени жизни.
          * @returns {SBIS3.CONTROLS.NotificationPopup} Экземпляр класса окна нотификационного сообщения.
          * @example
          * <pre>
          * InformationPopupManager.showNotification(
          *    {
          *       icon: 'icon-24 icon-Chat icon-primary',
          *       caption: 'Новое уведомление',
          *       bodyTemplate: myTpl,
          *       opener: self
          *    },
          *    true
          * );
          * </pre>
          * @see showCustomNotification
          */
         showNotification: function(config, notHide){
            var popup = new NotificationPopup(cMerge({
               element: $('<div></div>')
            }, config));

            NotificationManager.showNotification(popup, notHide);

            return popup;
         },

         /**
          * Показывает произвольное нотификационное сообщение.
          * @param {SBIS3.CONTROLS.PopupMixin|*} inst Экземпляр класса окна. Это может быть любое окно, созданное на основе указанного миксина.
          * @param {Boolean} notHide true - не скрывать окно по истичению времени жизни.
          * @see showNotification
          */
         showCustomNotification: function(inst, notHide){
            NotificationManager.showNotification(inst, notHide);
            return inst;
         }
      };
   }
);