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
      };

      return /** @lends SBIS3.CONTROLS.Utils.InformationPopupManager.prototype */{
         /**
          * @typedef {Object} ConfirmCfg
          * @property {String} message Отображаемое сообщение.
          * @property {String} details Детали сообщения, отображаются под основным сообщением.
          * @property {Boolean} hasCancelButton Использовать ли кнопку "Отмена".
          */
         /**
          * @typedef {Object} OneButtonDialogCfg
          * @property {String} message Отображаемое сообщение.
          * @property {String} details Детали сообщения, отображаются под основным сообщением.
          */

         /**
          * @typedef {String} NotificationStatus
          * @variant default  Окно без состояния. Цвет линии в шапке - синий, иконка по умолчанию не задана.
          * @variant success  "Успешно". Цвет линии в шапке - зеленый, иконка - зелёная галка.
          * @variant error    "Ошибка". Цвет линии в шапке - красный, иконка - треугольник с воскл.знаком.
          * @variant warning  "Предупреждение". Цвет линии в шапке - оранжевый, иконка по умолчанию не задана.
          */

         /**
          * @typedef {Object} NotificationCfg
          * @property {String} caption Заголовок (основной текст) информационного окна.
          * @property {NotificationStatus} status Состояние окна. От состояния заивисит цвет линии в шапке и иконка по умолчанию.
          * @property {Function} [template] Шаблон содержимого информационного окна. Используется для персонализированных уведомлений.
          */

         /**
          * Показать диалог с кнопками "Да", "Нет" и (опционально) "Отмена"
          * @param {ConfirmCfg} config Настройки для SBIS3.CONTROLS.SubmitPopup
          * @param {Function} positiveHandler Обработчик нажатия на кнопку "Да"
          * @param {Function} negativeHandler Обработчик нажатия на кнопку "Нет"
          * @param {Function} [cancelHandler] Обработчик нажатия на кнопку "Отмена"
          */
         showConfirmDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            showSubmitDialog($ws.core.merge(config, {
               status: 'confirm'
            }), positiveHandler, negativeHandler, cancelHandler);
         },

         /**
          * Показать диалог с состоянием "Ошибка"
          * @param {OneButtonDialogCfg} config Объект настроек диалога
          * @param {Function} handler Обработчик нажатия на кнопку "Ок"
          */
         showMessageDialog: function(config, handler){
            showSubmitDialog(config, null, null, handler);
         },

         /**
          * Показать нотификационное сообщение
          * @param {NotificationCfg} config Объект настроек для SBIS3.CONTROLS.NotificationPopup
          */
         showNotification: function(config){
            var popup = new NotificationPopup($ws.core.merge({
               element: $('<div></div>')
            }, config));

            NotificationManager.showNotification(popup);
         }
      };
   }
);