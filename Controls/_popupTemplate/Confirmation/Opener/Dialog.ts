import Control = require('Core/Control');
import entity = require('Types/entity');
import Env = require('Env/Env');
import {Converter as MarkupConverter} from 'Controls/decorator';
import contentTemplate = require('wml!Controls/_popupTemplate/Confirmation/Opener/Dialog/content');
import footerTemplate = require('wml!Controls/_popupTemplate/Confirmation/Opener/Dialog/footer');
import messageTemplate = require('wml!Controls/_popupTemplate/Confirmation/Opener/Dialog/message');
import detailsTemplate = require('wml!Controls/_popupTemplate/Confirmation/Opener/Dialog/details');
import template = require('wml!Controls/_popupTemplate/Confirmation/Opener/Dialog/Dialog');
import 'css!theme?Controls/popupTemplate';


   /**
       * Класс контрола "Окно подтверждения". В зависимости от типа, может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
       * @class Controls/_popupTemplate/Confirmation/Opener/Dialog
       * @control
       * @private
       * @author Красильников А.С.
       * @mixes Controls/_popupTemplate/Confirmation/Opener/Dialog/DialogStyles
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#type
       * @cfg {String} Тип диалога
       * @variant ok Диалог с кнопкой "Ок"
       * @variant yesno Диалог с кнопками "Да" и "Нет"
       * @variant yesnocancel Диалог с кнопками "Да", "Нет" и "Отмена"
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#style
       * @cfg {String} Стилевое оформление диалога
       * @variant default По умоланию
       * @variant success Успех
       * @variant error Ошибка
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#message
       * @cfg {String} Устанавливает сообщение
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#details
       * @cfg {String} Устанавливает детали сообщения
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#yesCaption
       * @cfg {String} Устанавливает текст кнопки yes
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#noCaption
       * @cfg {String} Устанавливает текст кнопки no
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#cancelCaption
       * @cfg {String} Устанавливает текст кнопки cancel
       */

   /**
       * @name Controls/_popupTemplate/Confirmation/Opener/Dialog#okCaption
       * @cfg {String} Устанавливает текст кнопки ok
       */

   /**
       * @typedef {Boolean|undefined} Result
       * @remark
       * true - Нажата кнопка "Да"
       * false - Нажата кнопка "Нет"
       * undefined - Нажата кнопка "ОК" или "Отмена"
       */

   /**
       * @event Controls/_popupTemplate/Confirmation/Opener/Dialog#sendResult Происходит при нажатии на кнопку диалога
       * @param {Env/Event:Object} eventObject Дескриптор события
       * @param {Result} Результат
       */

   var _private = {
      keyPressed: function(e) {
         if (e.nativeEvent.keyCode === Env.constants.key.esc) {
            // for 'ok' and 'yesnocancel' type value equal undefined
            var result = this._options.type === 'yesno' ? false : undefined;
            this._sendResult(result);
            e.stopPropagation();
         }
      }
   };

   var Submit = Control.extend({
      _template: template,
      _messageMaxLength: 100,
      _detailsMaxLength: 160,
      _messageTemplate: messageTemplate,
      _detailsTemplate: detailsTemplate,
      _contentTemplate: contentTemplate,
      _footerTemplate: footerTemplate,

      _isEscDown: false,

      _sendResultHandler: function(e, res) {
         this._sendResult(res);
      },

      _sendResult: function(res) {
         this._options.closeHandler(res);
         this._notify('close');
      },

      _keyDown: function(event) {
         if (event.nativeEvent.keyCode === Env.constants.key.esc) {
            this._isEscDown = true;
         }
      },

      _keyPressed: function(e) {
         /**
          * Старая панель по событию keydown закрывается и блокирует всплытие события. Новая панель делает
          * тоже самое, но по событию keyup. Из-за этого возникает следующая ошибка.
          * https://online.sbis.ru/opendoc.html?guid=0e4a5c02-f64c-4c7d-88b8-3ab200655c27
          *
          * Что бы не трогать старые окна, мы добавляем поведение на закрытие по esc. Закрываем только в том случае,
          * если новая панель поймала событие keydown клавиши esc.
          */
         if (this._isEscDown) {
            this._isEscDown = false;
            _private.keyPressed.call(this, e);
         }
      },
      _getMessage: function() {
         if (this._hasMarkup()) {
            Env.IoC.resolve('ILogger').error('Confirmation', 'В тексте сообщения присутствует ссылка. Вывод html-тегов должен реализовываться через задание шаблона.');
            return MarkupConverter.htmlToJson('<span>' + this._options.message + '</span>');
         }
         return this._options.message;
      },
      _getSize: function() {
         if (this._options.size) {
            return this._options.size;
         }
         if ((this._options.message && this._options.message.length) > this._messageMaxLength ||
            (this._options.details && this._options.details.length) > this._detailsMaxLength) {
            return 'l';
         }
         return 'm';
      },
      _hasMarkup: function() {
         var message = this._options.message;
         return typeof message === 'string' && message.indexOf('<a') > -1 && message.indexOf('</a>') > -1;
      },

      _onTriggerHandler: function() {
         if (this._options.primaryAction === 'no') {
            this._sendResult(false);
         } else {
            this._sendResult(true);
         }
      }
   });

   Submit.getDefaultOptions = function() {
      return {
         type: 'yesno',
         style: 'default',
         primaryAction: 'yes',
         yesCaption: rk('Да'),
         noCaption: rk('Нет'),
         cancelCaption: rk('Отмена'),
         okCaption: rk('ОК')
      };
   };

   Submit.getOptionTypes = function() {
      return {
         type: entity.descriptor(String).oneOf([
            'ok',
            'yesno',
            'yesnocancel'
         ]),
         style: entity.descriptor(String).oneOf([
            'default',
            'secondary',
            'success',
            'done',
            'error',
            'danger'
         ])
      };
   };

   export = Submit;

