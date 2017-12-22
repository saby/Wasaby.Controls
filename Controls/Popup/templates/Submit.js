define('js!Controls/Popup/templates/Submit', [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Core/constants',
      'tmpl!Controls/Popup/templates/Submit/body',
      'tmpl!Controls/Popup/templates/Submit/footer',
      'tmpl!Controls/Popup/templates/Submit/message',
      'tmpl!Controls/Popup/templates/Submit/details',
      'tmpl!Controls/Popup/templates/Submit/Submit',


      'css!Controls/Popup/templates/Submit/Submit',
      'Controls/Button'
   ], function (Control,
                types,
                constants,
                bodyTemplate,
                footerTemplate,
                messageTemplate,
                detailsTemplate,
                template) {

      'use strict';

      /**
       * Класс контрола "Окно подтверждения". В зависимости от состояния (см. {@link status}), может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
       * Для вызова контрола рекомендуется использовать {@link SBIS3.CONTROLS.Utils.InformationPopupManager}.
       * @class Controls/Popup/templates/Submit
       * @extends Controls/Control
       * @control
       * @public
       * @author Степин Павел Владимирович
       */

      /**
       * @typedef {String} SubmitPopupStatus
       * @variant confirm  Диалог подтверждения. Имеет кнопки "Да", "Нет" и "Отмена" (опционально). Цвет диалога - синий
       * @variant default  "По умолчанию". Имеет кнопку "ОК". Цвет диалога - синий
       * @variant success  "Успешно". Имеет кнопку "ОК". Цвет диалога - зеленый
       * @variant error    "Ошибка". Имеет кнопку "ОК". Цвет диалога - красный
       */

      /**
       * @typedef {Boolean|undefined} ChosenStatus
       * @variant true Нажата кнопка "Да"
       * @variant false Нажата кнопка "Нет"
       * @variant undefined Нажата кнопка "ОК" или "Отмена"
       */

      /**
       * @event sendResult Происходит при нажатии на кнопку диалога
       * @param {Core/EventObject} eventObject Дескриптор события
       * @param {ChosenStatus} Вариант диалога, выбранный нажатием соответствующей кнопки
       * @variant
       */

      /**
       * @typedef {Object} ButtonConfig
       * @property {Boolean} isLink Показать кнопку-ссылку вместо обычной кнопки
       * @property {String} caption Текст кнопки
       */

      /**
       * @name Controls/Popup/templates/Submit#status
       * @cfg {SubmitPopupStatus} Устанавливает состояние диалога. От состояния зависит цвет линии в шапке и набор кнопок
       */

      /**
       * @name Controls/Popup/templates/Submit#message
       * @cfg {String} Устанавливает сообщение
       * @see details
       */

      /**
       * @name Controls/Popup/templates/Submit#details
       * @cfg {String} Устанавливает детали сообщения
       * @see message
       */

      /**
       * @name Controls/Popup/templates/Submit#positiveButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Да". Применяется для диалогов со статусом confirm
       * @see status
       * @see negativeButton
       * @see cancelButton
       * @see submitButton
       */

      /**
       * @name Controls/Popup/templates/Submit#negativeButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Нет". Применяется для диалогов со статусом confirm
       * @see status
       * @see positiveButton
       * @see cancelButton
       * @see submitButton
       */

      /**
       * @name Controls/Popup/templates/Submit#cancelButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Отмена". Применяется для диалогов со статусом confirm
       * @see status
       * @see positiveButton
       * @see negativeButton
       * @see submitButton
       */

      /**
       * @name Controls/Popup/templates/Submit#submitButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "ОК". Применяется для диалогов со статусом default, success  и error
       * @see status
       * @see positiveButton
       * @see negativeButton
       * @see cancelButton
       */

      /**
       * @name Controls/Popup/templates/Submit#hasCancelButton
       * @cfg {Boolean} Устанавливает использование кнопки "Отмена". Опция актуальна только для диалогов со статусом confirm
       * @see status
       */

      /**
       * @name Controls/Popup/templates/Submit#messageTemplate
       * @cfg {Function} Устанавливает шаблон отображения сообщения (см. {@link message})
       * @see detailsTemplate
       */

      /**
       * @name Controls/Popup/templates/Submit#detailsTemplate
       * @cfg {Function} Устанавливает шаблон отображения деталей сообщения(см. {@link details})
       * @see messageTemplate
       */

      /**
       * @name Controls/Popup/templates/Submit#messageTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения сообщения (см. {@link message})
       * @see detailsTemplateOptions
       */

      /**
       * @name Controls/Popup/templates/Submit#detailsTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения деталей (см. {@link message})
       * @see messageTemplateOptions
       */

      /**
       * @name Controls/Popup/templates/Submit#messageMaxLength
       * cfg {Number} Устанавливает максимальный размер сообщения, превышая который, окно увеличит свой размер.
       * @see detailsMaxLength
       */

      /**
       * @name Controls/Popup/templates/Submit#detailsMaxLength
       * cfg {Number} Устанавливает максимальный размер описания, превышая который, окно увеличит свой размер.
       * @see messageMaxLength
       */

      /**
       * @name Controls/Popup/templates/Submit#useConfirmButtons
       * cfg {Boolean} Использовать ли кнопки подтверждения. Применяется для диалогов со статусом default, success  и error.
       */

      /**
       * @name Controls/Popup/templates/Submit#autoWidth
       * cfg {Boolean} Включить автоширину. В таком случае фиксация ширина окна ложитсья на сторону пользователя.
       */

      var Submit = Control.extend({
         _controlName: 'Controls/Popup/templates/Submit',
         _template: template,

         _sendResult: function (e, res) {
            this._notify('sendResult', res);
            this._notify('close');
         },

         _keyPressed: function (e) {
            e.stopPropagation();

            if(e.nativeEvent.keyCode === constants.key.esc){
               this._options.hasCancelButton && this._sendResult();
            }
         }
      });

      Submit.getDefaultOptions = function () {
         return {
            status: 'default',
            positiveButton: {
               caption: rk('Да'),
               isLink: false
            },
            negativeButton: {
               caption: rk('Нет'),
               isLink: false
            },
            cancelButton: {
               caption: rk('Отмена'),
               isLink: false
            },
            submitButton: {
               caption: rk('ОК'),
               isLink: false
            },
            hasCancelButton: false,
            messageMaxLength: 100,
            detailsMaxLength: 160,
            useConfirmButtons: false,
            autoWidth: false,
            bodyTemplate: bodyTemplate,
            footerTemplate: footerTemplate,
            messageTemplate: messageTemplate,
            detailsTemplate: detailsTemplate
         };
      };

      Submit.getOptionTypes = function () {
         return {
            status: types(String).oneOf([
               'default',
               'success',
               'error',
               'confirm'
            ]),
            hasCancelButton: types(Boolean),
            messageMaxLength: types(Number),
            detailsMaxLength: types(Number),
            useConfirmButtons: types(Boolean),
            autoWidth: types(Boolean)
         };
      };

      return Submit;
   }
);