define('js!Controls/Popup/Confirm', [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Core/constants',
      'tmpl!Controls/Popup/Confirm/content',
      'tmpl!Controls/Popup/Confirm/footer',
      'tmpl!Controls/Popup/Confirm/message',
      'tmpl!Controls/Popup/Confirm/details',
      'tmpl!Controls/Popup/Confirm/Confirm',


      'css!Controls/Popup/Confirm/Confirm',
      'js!Controls/Button'
   ], function (Control,
                types,
                constants,
                contentTemplate,
                footerTemplate,
                messageTemplate,
                detailsTemplate,
                template) {

      'use strict';

      /**
       * Класс контрола "Окно подтверждения". В зависимости от типа, может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
       * @class Controls/Popup/Confirm
       * @extends Controls/Control
       * @control
       * @public
       * @author Степин Павел Владимирович
       */

      /**
       * @name Controls/Popup/Confirm#type
       * @cfg {String} Тип диалога
       * @variant confirm Окно подтверждения с кнопками "Да", "Нет" и "Отмена"
       * @variant info Ифнормационное окно с кнопкой "Ок"
       */

      /**
       * @name Controls/Popup/Confirm#style
       * @cfg {String} Стилевое оформление диалога
       * @variant default По умоланию
       * @variant success Успех
       * @variant error Ошибка
       */

      /**
       * @name Controls/Popup/Confirm#message
       * @cfg {String} Устанавливает сообщение
       */

      /**
       * @name Controls/Popup/Confirm#details
       * @cfg {String} Устанавливает детали сообщения
       */

      /**
       * @name Controls/Popup/Confirm#buttonConfig
       * @cfg {Object} Устанавливает текст на кнопках
       */

      /**
       * @name Controls/Popup/Confirm#hasCancelButton
       * @cfg {Boolean} Устанавливает использование кнопки "Отмена". Опция актуальна только для диалогов со статусом confirm
       */

      /**
       * @name Controls/Popup/Confirm#contentTemplate
       * @cfg {Function} Устанавливает шаблон отображения тела диалога
       */

      /**
       * @name Controls/Popup/Confirm#contentTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения сообщения
       */

      /**
       * @name Controls/Popup/Confirm#disableStandardWidth
       * cfg {Boolean} Отключить применение стандартной ширины
       */

      /**
       * @typedef {Boolean|undefined} Result
       * @variant true Нажата кнопка "Да"
       * @variant false Нажата кнопка "Нет"
       * @variant undefined Нажата кнопка "ОК" или "Отмена"
       */

      /**
       * @event Controls/Popup/Confirm#sendResult Происходит при нажатии на кнопку диалога
       * @param {Core/EventObject} eventObject Дескриптор события
       * @param {Result} Результат
       */

      var Submit = Control.extend({
         _template: template,
         _messageMaxLength: 100,
         _detailsMaxLength: 160,
         _messageTemplate: messageTemplate,
         _detailsTemplate: detailsTemplate,
         _footerTemplate: footerTemplate,

         _sendResult: function (e, res) {
            this._notify('sendResult', res);
            this._notify('close');
         },

         _keyPressed: function (e) {
            e.stopPropagation();

            if(e.nativeEvent.keyCode === constants.key.esc){
               (this._options.type === 'info' || this._options.hasCancelButton) && this._sendResult();
            }
         }
      });

      Submit.getDefaultOptions = function () {
         return {
            type: 'confirm',
            style: 'default',
            buttonConfig: {
               yes: {
                  caption: rk('Да'),
                  isLink: false
               },
               no: {
                  caption: rk('Нет'),
                  isLink: false
               },
               cancel: {
                  caption: rk('Отмена'),
                  isLink: false
               },
               ok: {
                  caption: rk('ОК'),
                  isLink: false
               }
            },
            hasCancelButton: false,
            disableStandardWidth: false,
            contentTemplate: contentTemplate
         };
      };

      Submit.getOptionTypes = function () {
         return {
            type: types(String).oneOf([
               'confirm',
               'info'
            ]),
            style: types(String).oneOf([
               'default',
               'success',
               'error'
            ]),
            hasCancelButton: types(Boolean),
            disableStandardWidth: types(Boolean)
         };
      };

      return Submit;
   }
);