define('js!SBIS3.CONTROLS.SubmitPopup', [
   "Core/constants",
   "js!SBIS3.CONTROLS.InformationPopup",
   "html!SBIS3.CONTROLS.SubmitPopup/resources/template",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.Link",
   'css!SBIS3.CONTROLS.SubmitPopup'
],

   /**
    * Класс контрола "Окно подтверждения". В зависимости от состояния (см. {@link status}), может быть диалогом подтверждения, с кнопками "Да", "Нет" и "Отмена" (опционально), или диалогом с кнопкой "Ок".
    * Для вызова контрола рекомендуется использовать {@link SBIS3.CONTROLS.Utils.InformationPopupManager}.
    * @class SBIS3.CONTROLS.SubmitPopup
    * @extends SBIS3.CONTROLS.InformationPopup
    * @control
    * @public
    * @author Степин Павел Владимирович
    */
   function( constants,InformationPopup, template){
      'use strict';

      var SubmitPopup = InformationPopup.extend(/** @lends SBIS3.CONTROLS.SubmitPopup.prototype */ {
         /**
          * @typedef {String} SubmitPopupStatus
          * @variant confirm  Диалог подтверждения. Имеет кнопки "Да", "Нет" и "Отмена" (опционально). Цвет диалога - синий.
          * @variant default  "По умолчанию". Имеет кнопку "ОК". Цвет диалога - синий.
          * @variant success  "Успешно". Имеет кнопку "ОК". Цвет диалога - зеленый.
          * @variant error    "Ошибка". Имеет кнопку "ОК". Цвет диалога - красный.
          */
         /**
          * @typedef {Boolean|undefined} ChosenStatus
          * @variant true Нажата кнопка "Да".
          * @variant false Нажата кнопка "Нет".
          * @variant undefined Нажата кнопка "ОК" или "Отмена".
          */
         /**
          * @event onChoose Происходит при нажатии на кнопку диалога.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {ChosenStatus} Вариант диалога, выбранный нажатием соответствующей кнопки.
          * @variant
          */
         /**
          * @typedef {Object} ButtonConfig
          * @property {Boolean} isLink Показать кнопку-ссылку вместо обычной кнопки.
          * @property {String} caption Текст кнопки.
          */
         $protected: {
            _options: {
               /**
                * @name SBIS3.CONTROLS.SubmitPopup#opener
                * @cfg {undefined|$ws.proto.Control} Устанавливает контрол, который будет считаться инициатором открытия диалога.
                */
               /**
                * @cfg {SubmitPopupStatus} Устанавливает состояние диалога. От состояния зависит цвет линии в шапке и набор кнопок.
                */
               status: 'default',
               /**
                * @cfg {String} Устанавливает отображаемое в диалоге сообщение.
                * @see details
                */
               message: '',
               /**
                * @cfg {String} Устанавливает детали сообщения, которые отображаются под основным сообщением (см. {@link message}).
                * @see message
                */
               details: '',
               /**
                * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Да". Применяется для диалогов со статусом confirm.
                * @see status
                * @see negativeButton
                * @see cancelButton
                * @see submitButton
                */
               positiveButton: {
                  caption: rk('Да'),
                  isLink: false
               },
               /**
                * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Нет". Применяется для диалогов со статусом confirm.
                * @see status
                * @see positiveButton
                * @see cancelButton
                * @see submitButton
                */
               negativeButton: {
                  caption: rk('Нет'),
                  isLink: false
               },
               /**
                * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "Отмена". Применяется для диалогов со статусом confirm.
                * @see status
                * @see positiveButton
                * @see negativeButton
                * @see submitButton
                */
               cancelButton: {
                  caption: rk('Отмена'),
                  isLink: false
               },
               /**
                * @cfg {ButtonConfig} Устанавливает конфигурацию кнопки "ОК". Применяется для диалогов со статусом default, success  и error.
                * @see status
                * @see positiveButton
                * @see negativeButton
                * @see cancelButton
                */
               submitButton: {
                  caption: rk('ОК'),
                  isLink: false
               },

               /**
                * @cfg {Boolean} Устанавливает использование кнопки "Отмена". Опция актуальна только для диалогов со статусом confirm.
                * @see status
                */
               hasCancelButton: false,

               /**
                * @cfg {Function} Устанавливает шаблон отображения сообщения (см. {@link message}).
                * @see detailsTemplate
                */
               messageTemplate: null,

               /**
                * @cfg {Function} Устанавливает шаблон отображения деталей сообщения(см. {@link details}).
                * @see messageTemplate
                */
               detailsTemplate: null,

               /*
                * @noShow
                */
               template: template,

               /*
                * cfg {Number} Устанавливает максимальный размер сообщения, превышая который, окно увеличит свой размер.
                * @see detailsMaxLength
                */
               messageMaxLength: 100,

               /*
                * cfg {Number} Устанавливает максимальный размер описания, превышая который, окно увеличит свой размер.
                * @see messageMaxLength
                */
               detailsMaxLength: 160,
               /**
                * cfg {Boolean} Устанавливает тип диалога: модальный или немодальный.
                */
               isModal: true,
               /**
                * cfg {Boolean} Использовать ли кнопки подтверждения. Применяется для диалогов со статусом default, success  и error.
                */
               useConfirmButtons: false,
               /**
                * cfg {Boolean} Включить автоширину. В таком случае фиксация ширина окна ложитсья на сторону пользователя.
                */
               autoWidth: false,
               additionalClass: 'controls-SubmitPopup_popup'
            },

            _buttons: []
         },
         $constructor : function(){
            this._publish('onChoose');
         },

         init : function() {
            SubmitPopup.superclass.init.call(this);

            var self = this;

            if(this._options.status === 'confirm' || this._options.useConfirmButtons){
               this._registerButton(this.getChildControlByName('positiveButton'), true);
               this._registerButton(this.getChildControlByName('negativeButton'), false);

               if(this._options.hasCancelButton){
                  this._registerButton(this.getChildControlByName('cancelButton'));
               }
            }
            else {
               this._registerButton(this.getChildControlByName('okButton'));
            }

            //По esc закрываем диалог. Кидаем событие со значением undefined.
            this.subscribe('onKeyPressed', function(e, event){
               if(event.which === constants.key.esc){
                  self._choose();
               }
            });
         },

         /*
          * @private
          */
         _choose: function(value){
            this._notify('onChoose', value);
            this.close();
         },

         _switchButton: function(index, next){
            var newActiveButtonIndex = (index + (next ? 1 : -1) + this._buttons.length) % this._buttons.length;
            this._buttons[newActiveButtonIndex].setActive(true);
         },

         _registerButton: function(inst, eventValue){
            var self = this;
            var index = this._buttons.length;

            this._buttons.push(inst);

            this.subscribeTo(inst, 'onActivated', function(){
               self._choose(eventValue);
            });

            this.subscribeTo(inst, 'onKeyPressed', function(e, event){
               switch(event.which){
                  case constants.key.left: self._switchButton(index, false); break;
                  case constants.key.right: self._switchButton(index, true); break;
               }
            });
         }
      });
      return SubmitPopup;
   }
);