define('Controls/Popup/Opener/Confirmation/Dialog', [
   'Core/Control',
   'WS.Data/Type/descriptor',
   'Core/constants',
   'wml!Controls/Popup/Opener/Confirmation/Dialog/content',
   'wml!Controls/Popup/Opener/Confirmation/Dialog/footer',
   'wml!Controls/Popup/Opener/Confirmation/Dialog/message',
   'wml!Controls/Popup/Opener/Confirmation/Dialog/details',
   'wml!Controls/Popup/Opener/Confirmation/Dialog/Dialog',
   'css!Controls/Popup/Opener/Confirmation/Dialog/Dialog'
], function(Control,
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
       * @class Controls/Popup/Opener/Confirmation/Dialog
       * @control
       * @private
       * @author Красильников А.С.
       * @mixin Controls/Popup/Opener/Confirmation/Dialog/DialogStyles
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#type
       * @cfg {String} Тип диалога
       * @variant ok Диалог с кнопкой "Ок"
       * @variant yesno Диалог с кнопками "Да" и "Нет"
       * @variant yesnocancel Диалог с кнопками "Да", "Нет" и "Отмена"
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#style
       * @cfg {String} Стилевое оформление диалога
       * @variant default По умоланию
       * @variant success Успех
       * @variant error Ошибка
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#message
       * @cfg {String} Устанавливает сообщение
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#details
       * @cfg {String} Устанавливает детали сообщения
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#yesCaption
       * @cfg {String} Устанавливает текст кнопки yes
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#noCaption
       * @cfg {String} Устанавливает текст кнопки no
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#cancelCaption
       * @cfg {String} Устанавливает текст кнопки cancel
       */

   /**
       * @name Controls/Popup/Opener/Confirmation/Dialog#okCaption
       * @cfg {String} Устанавливает текст кнопки ok
       */

   /**
       * @typedef {Boolean|undefined} Result
       * @variant true Нажата кнопка "Да"
       * @variant false Нажата кнопка "Нет"
       * @variant undefined Нажата кнопка "ОК" или "Отмена"
       */

   /**
       * @event Controls/Popup/Opener/Confirmation/Dialog#sendResult Происходит при нажатии на кнопку диалога
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

      _sendResult: function(e, res) {
         this._options.closeHandler(res);
         this._notify('close');
      },

      _keyPressed: function(e) {
         if (e.nativeEvent.keyCode === constants.key.esc) {
            // for 'ok' and 'yesnocancel' type value equal undefined
            var result = this._options.type === 'yesno' ? false : undefined;
            this._sendResult(null, result);
            e.stopPropagation();
         }
      }
   });

   Submit.getDefaultOptions = function() {
      return {
         type: 'yesno',
         style: 'default',
         yesCaption: rk('Да'),
         noCaption: rk('Нет'),
         cancelCaption: rk('Отмена'),
         okCaption: rk('ОК')
      };
   };

   Submit.getOptionTypes = function() {
      return {
         type: types(String).oneOf([
            'ok',
            'yesno',
            'yesnocancel'
         ]),
         style: types(String).oneOf([
            'default',
            'secondary',
            'success',
            'done',
            'error',
            'danger'
         ])
      };
   };

   return Submit;
}
);
