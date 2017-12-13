define('js!Controls/Windows/Submit', [
      'Core/Control',
      'tmpl!Controls/Windows/Submit/Submit',
      'WS.Data/Type/descriptor',
      'Core/constants',

      'css!Controls/Windows/Submit/Submit',
      'js!Controls/Button'
   ], function (Control,
                template,
                types,
                constants) {

      'use strict';

      /**
       * Класс контрола "Окно подтверждения". В зависимости от состояния (см. {@link status}), может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
       * Для вызова контрола рекомендуется использовать {@link SBIS3.CONTROLS.Utils.InformationPopupManager}.
       * @class Controls/Windows/Submit
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
       * @name Controls/Windows/Submit#status
       * @cfg {SubmitPopupStatus} Устанавливает состояние диалога. От состояния зависит цвет линии в шапке и набор кнопок
       */

      /**
       * @name Controls/Windows/Submit#message
       * @cfg {String} Устанавливает сообщение
       * @see details
       */

      /**
       * @name Controls/Windows/Submit#details
       * @cfg {String} Устанавливает детали сообщения
       * @see message
       */

      /**
       * @name Controls/Windows/Submit#positiveButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Да". Применяется для диалогов со статусом confirm
       * @see status
       * @see negativeButton
       * @see cancelButton
       * @see submitButton
       */

      /**
       * @name Controls/Windows/Submit#negativeButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Нет". Применяется для диалогов со статусом confirm
       * @see status
       * @see positiveButton
       * @see cancelButton
       * @see submitButton
       */

      /**
       * @name Controls/Windows/Submit#cancelButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Отмена". Применяется для диалогов со статусом confirm
       * @see status
       * @see positiveButton
       * @see negativeButton
       * @see submitButton
       */

      /**
       * @name Controls/Windows/Submit#submitButton
       * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "ОК". Применяется для диалогов со статусом default, success  и error
       * @see status
       * @see positiveButton
       * @see negativeButton
       * @see cancelButton
       */

      /**
       * @name Controls/Windows/Submit#hasCancelButton
       * @cfg {Boolean} Устанавливает использование кнопки "Отмена". Опция актуальна только для диалогов со статусом confirm
       * @see status
       */

      /**
       * @name Controls/Windows/Submit#messageTemplate
       * @cfg {Function} Устанавливает шаблон отображения сообщения (см. {@link message})
       * @see detailsTemplate
       */

      /**
       * @name Controls/Windows/Submit#detailsTemplate
       * @cfg {Function} Устанавливает шаблон отображения деталей сообщения(см. {@link details})
       * @see messageTemplate
       */

      /**
       * @name Controls/Windows/Submit#messageTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения сообщения (см. {@link message})
       * @see detailsTemplateOptions
       */

      /**
       * @name Controls/Windows/Submit#detailsTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения деталей (см. {@link message})
       * @see messageTemplateOptions
       */

      /**
       * @name Controls/Windows/Submit#messageMaxLength
       * cfg {Number} Устанавливает максимальный размер сообщения, превышая который, окно увеличит свой размер.
       * @see detailsMaxLength
       */

      /**
       * @name Controls/Windows/Submit#detailsMaxLength
       * cfg {Number} Устанавливает максимальный размер описания, превышая который, окно увеличит свой размер.
       * @see messageMaxLength
       */

      /**
       * @name Controls/Windows/Submit#useConfirmButtons
       * cfg {Boolean} Использовать ли кнопки подтверждения. Применяется для диалогов со статусом default, success  и error.
       */

      /**
       * @name Controls/Windows/Submit#autoWidth
       * cfg {Boolean} Включить автоширину. В таком случае фиксация ширина окна ложитсья на сторону пользователя.
       */

      //Эмуляция tab или shift + tab
      var fireTab = function (target, shift) {
         var emulatedTabEvent = new KeyboardEvent('keydown');
         emulatedTabEvent.initKeyboardEvent(
            /* type         */ 'keydown',
            /* bubbles      */ true,
            /* cancelable   */ false,
            /* view         */ window,
            /* keyIdentifier*/ '',
            /* keyLocation  */ 0,
            /* ctrlKey      */ false,
            /* altKey       */ false,
            /* shiftKey     */ shift,
            /* metaKey      */ false,
            /* altGraphKey  */ false
         );
         var getterCode = {
            get: function () {
               return constants.key.tab
            }
         };
         Object.defineProperties(emulatedTabEvent, {
            which: getterCode,
            keyCode: getterCode
         });
         target.dispatchEvent(emulatedTabEvent);
      };

      var Submit = Control.extend({
         _controlName: 'Controls/Windows/Submit',
         _template: template,

         _sendResult: function (e, res) {
            this._notify('sendResult', res);
            this._notify('close');
         },

         _keyPressed: function (e) {
            e.stopPropagation();

            switch (e.nativeEvent.keyCode) {
               case constants.key.esc:
                  this._options.hasCancelButton && this._sendResult();
                  break;
               case constants.key.left:
                  //TODO Эмулируем shift+tab https://online.sbis.ru/opendoc.html?guid=069b986f-fd53-4ac8-a7ef-0a5834f41a8e
                  fireTab(e.target, true);
                  break;
               case constants.key.right:
                  //TODO Эмулируем tab https://online.sbis.ru/opendoc.html?guid=069b986f-fd53-4ac8-a7ef-0a5834f41a8e
                  fireTab(e.target, false);
                  break;
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
            autoWidth: false
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