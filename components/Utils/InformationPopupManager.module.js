define('js!SBIS3.CONTROLS.Utils.InformationPopupManager',
   [
      'js!SBIS3.CONTROLS.SubmitPopup',
      'js!SBIS3.CONTROLS.NotificationPopup',
      'js!SBIS3.CONTROLS.Utils.NotificationStackManager'
   ],
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
      };

      /**
       * Интерфейс для работы с информационными окнами.
       * Содержит функции для показа информационных окон и нотификационных уведомелений в области уведомлений.
       * @class SBIS3.CONTROLS.Utils.InformationPopupManager
       * @author Степин П.В.
       * @public
       */
      return {
         /**
          * Показать диалог с кнопками Да, Нет и Отмена (опционально)
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.SubmitPopup
          * @property {String} message Отображаемое сообщение.
          * @property {String} details Детали сообщения, отображаются под основным сообщением.
          * @property {Boolean} hasCancelButton Использовать ли кнопку Отмена.
          * @param positiveHandler Обработчик нажатия на кнопку Да
          * @param negativeHandler Обработчик нажатия на кнопку Нет
          * @param cancelHandler Обработчик нажатия на кнопку Отмена
          */
         showConfirmDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'default'
            }), positiveHandler, negativeHandler, cancelHandler)
         },

         /**
          * Показать диалог с состоянием "Ошибка"
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.SubmitPopup
          * @property {String} message Отображаемое сообщение.
          * @property {String} details Детали сообщения, отображаются под основным сообщением.
          * @param handler Обработчик нажатия на кнопку Ок
          */
         showErrorDialog: function(config, handler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'error'
            }), null, null, handler)
         },

         /**
          * Показать диалог с состоянием "Успешно"
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.SubmitPopup
          * @property {String} message Отображаемое сообщение.
          * @property {String} details Детали сообщения, отображаются под основным сообщением.
          * @param handler Обработчик нажатия на кнопку Ок
          */
         showSuccessDialog: function(config, handler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'success'
            }), null, null, handler)
         },

         /**
          * Показать диалог с состоянием "Предупреждение"
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.SubmitPopup
          * @property {String} message Отображаемое сообщение.
          * @property {String} details Детали сообщения, отображаются под основным сообщением.
          * @param handler Обработчик нажатия на кнопку Ок
          */
         showWarningDialog: function(config, handler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'warning'
            }), null, null, handler)
         },

         /**
          * Показать нотификационное сообщение
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.NotificationPopup
          * @property {String} caption Заголовок. Отображается в шапке.
          */
         showNotification: function(config){
            var popup = new NotificationPopup($ws.core.merge({
               element: $('<div></div>')
            }, config));

            NotificationManager.showNotification(popup);
         },

         /**
          * Показать нотификационное окно с состоянием "Успешно"
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.NotificationPopup
          * @property {String} caption Заголовок. Отображается в шапке.
          */
         showSuccessNotification: function(config){
            this.showNotification($ws.core.merge(config, {
               state: 'success'
            }));
         },

         /**
          * Показать нотификационное окно с состоянием "Ошибка"
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.NotificationPopup
          * @property {String} caption Заголовок. Отображается в шапке.
          */
         showErrorNotification: function(config){
            this.showNotification($ws.core.merge(config, {
               state: 'error'
            }));
         },

         /**
          * Показать нотификационное окно с состоянием "Предупреждение"
          * @typedef {Object} config Настройки для SBIS3.CONTROLS.NotificationPopup
          * @property {String} caption Заголовок. Отображается в шапке.
          */
         showWarningNotification: function(config){
            this.showNotification($ws.core.merge(config, {
               state: 'warning'
            }));
         }
      };
   }
);