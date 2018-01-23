define('js!Controls/ConfirmationWindow/Dialog', [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Core/constants',
      'tmpl!Controls/ConfirmationWindow/Dialog/content',
      'tmpl!Controls/ConfirmationWindow/Dialog/footer',
      'tmpl!Controls/ConfirmationWindow/Dialog/message',
      'tmpl!Controls/ConfirmationWindow/Dialog/details',
      'tmpl!Controls/ConfirmationWindow/Dialog/Dialog',

      'css!Controls/ConfirmationWindow/Dialog/Dialog',
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
       * @class Controls/ConfirmationWindow/Dialog
       * @extends Controls/Control
       * @control
       * @public
       * @author Степин Павел Владимирович
       */

      /**
       * @name Controls/ConfirmationWindow/Dialog#type
       * @cfg {String} Тип диалога
       * @variant ok Диалог с кнопкой "Ок"
       * @variant yesno Диалог с кнопками "Да" и "Нет"
       * @variant yesnocancel Диалог с кнопками "Да", "Нет" и "Отмена"
       */

      /**
       * @name Controls/ConfirmationWindow/Dialog#style
       * @cfg {String} Стилевое оформление диалога
       * @variant default По умоланию
       * @variant success Успех
       * @variant error Ошибка
       */

      /**
       * @name Controls/ConfirmationWindow/Dialog#message
       * @cfg {String} Устанавливает сообщение
       */

      /**
       * @name Controls/ConfirmationWindow/Dialog#details
       * @cfg {String} Устанавливает детали сообщения
       */

      /**
       * @typedef {Boolean|undefined} Result
       * @variant true Нажата кнопка "Да"
       * @variant false Нажата кнопка "Нет"
       * @variant undefined Нажата кнопка "ОК" или "Отмена"
       */

      /**
       * @event Controls/ConfirmationWindow/Dialog#sendResult Происходит при нажатии на кнопку диалога
       * @param {Core/EventObject} eventObject Дескриптор события
       * @param {Result} Результат
       */

      var Submit = Control.extend({
         _template: template,
         _messageMaxLength: 100,
         _detailsMaxLength: 160,
         _messageTemplate: messageTemplate,
         _detailsTemplate: detailsTemplate,
         _contentTemplate: contentTemplate,
         _footerTemplate: footerTemplate,

         _sendResult: function (e, res) {
            this._notify('sendResult', [res]);
            this._notify('close');
         },

         _keyPressed: function (e) {
            if(e.nativeEvent.keyCode === constants.key.esc){
               (this._options.type === 'ok' || this._options.type === 'yesnocancel') && this._sendResult();
            }
         }
      });

      Submit.getDefaultOptions = function () {
         return {
            type: 'yesno',
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
            }
         };
      };

      Submit.getOptionTypes = function () {
         return {
            type: types(String).oneOf([
               'ok',
               'yesno',
               'yesnocancel'
            ]),
            style: types(String).oneOf([
               'default',
               'success',
               'error'
            ])
         };
      };

      return Submit;
   }
);