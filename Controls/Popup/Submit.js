define('js!Controls/Popup/Submit', [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Core/constants',
      'tmpl!Controls/Popup/Submit/body',
      'tmpl!Controls/Popup/Submit/footer',
      'tmpl!Controls/Popup/Submit/message',
      'tmpl!Controls/Popup/Submit/details',
      'tmpl!Controls/Popup/Submit/Submit',


      'css!Controls/Popup/Submit/Submit',
      'js!Controls/Button'
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
       * Класс контрола "Окно подтверждения". В зависимости от типа, может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
       * @class Controls/Popup/Submit
       * @extends Controls/Control
       * @control
       * @public
       * @author Степин Павел Владимирович
       */

      /**
       * @name Controls/Popup/Submit#type
       * @cfg {String} Тип диалога
       * @variant confirm Окно подтверждения с кнопками "Да", "Нет" и "Отмена"
       * @variant info Ифнормационное окно с кнопкой "Ок"
       */

      /**
       * @name Controls/Popup/Submit#style
       * @cfg {String} Стилевое оформление диалога
       * @variant default По умоланию
       * @variant success Успех
       * @variant error Ошибка
       */

      /**
       * @name Controls/Popup/Submit#message
       * @cfg {String} Устанавливает сообщение
       */

      /**
       * @name Controls/Popup/Submit#details
       * @cfg {String} Устанавливает детали сообщения
       */

      /**
       * @typedef {Object} ButtonLabels
       * @property {String} yes Текст кнопки "Да"
       * @property {String} no Текст кнопки "Нет"
       * @property {String} cancel Текст кнопки "Отмена"
       * @property {String} ok Текст кнопки "Ок"
       */

      /**
       * @name Controls/Popup/Submit#buttonLabels
       * @cfg {ButtonLabels} Устанавливает текст на кнопках
       */

      /**
       * @name Controls/Popup/Submit#hasCancelButton
       * @cfg {Boolean} Устанавливает использование кнопки "Отмена". Опция актуальна только для диалогов со статусом confirm
       */

      /**
       * @name Controls/Popup/Submit#bodyTemplate
       * @cfg {Function} Устанавливает шаблон отображения тела диалога
       */

      /**
       * @name Controls/Popup/Submit#footerTemplate
       * @cfg {Function} Устанавливает шаблон отображения футера диалога
       */

      /**
       * @name Controls/Popup/Submit#bodyTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения сообщения
       */

      /**
       * @name Controls/Popup/Submit#footerTemplateOptions
       * @cfg {Object} Устанавливает опции для шаблона отображения деталей
       */

      /**
       * @name Controls/Popup/Submit#disableStandardWidth
       * cfg {Boolean} Отключить применение стандартной ширины
       */

      /**
       * @typedef {Boolean|undefined} Result
       * @variant true Нажата кнопка "Да"
       * @variant false Нажата кнопка "Нет"
       * @variant undefined Нажата кнопка "ОК" или "Отмена"
       */

      /**
       * @event Controls/Popup/Submit#sendResult Происходит при нажатии на кнопку диалога
       * @param {Core/EventObject} eventObject Дескриптор события
       * @param {Result} Результат
       */

      var Submit = Control.extend({
         _template: template,
         _messageMaxLength: 100,
         _detailsMaxLength: 160,
         _messageTemplate: messageTemplate,
         _detailsTemplate: detailsTemplate,

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
            type: 'confirm',
            style: 'default',
            buttonLabels: {
               yes: rk('Да'),
               no: rk('Нет'),
               cancel: rk('Отмена'),
               ok: rk('ОК')
            },
            hasCancelButton: false,
            disableStandardWidth: false,
            bodyTemplate: bodyTemplate,
            footerTemplate: footerTemplate
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