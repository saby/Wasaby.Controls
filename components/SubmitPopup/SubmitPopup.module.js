define('js!SBIS3.CONTROLS.SubmitPopup', [
      'js!SBIS3.CONTROLS.InformationPopup',
      'html!SBIS3.CONTROLS.SubmitPopup/resources/template',
      'js!SBIS3.CONTROLS.Button'
   ],

   /**
    * Информационное окно.
    * В зависимости от состояния, может быть диалогом подтверждения, с кнопками "Да", "Нет" и (опционально) "Отмена",
    * или диалогом с кнопкой "Ок".
    * @class SBIS3.CONTROLS.SubmitPopup
    * @extends SBIS3.CONTROLS.InformationPopup
    * @control
    * @author Степин П.В.
    */
   function(InformationPopup, template){
      'use strict';
      var SubmitPopup = InformationPopup.extend( /** @lends SBIS3.CONTROLS.SubmitPopup.prototype */ {
         /**
          * @typedef {String} SubmitPopupStatus
          * @variant confirm  Диалог подтверждения. Имеет кнопки "Да", "Нет" и (опционально) "Отмена". Цвет диалога - синий.
          * @variant success  "Успешно". Имеет кнопку "ОК". Цвет диалога - зеленый.
          * @variant error    "Ошибка". Имеет кнопку "ОК". Цвет диалога - красный.
          * @variant warning  "Предупреждение". Имеет кнопку "ОК". Цвет диалога - оранжевый.
          */

         /**
          * @typedef {Boolean|undefined} ChosenStatus
          * @variant true Нажата кнопка "Да"
          * @variant false Нажата кнопка "Нет"
          * @variant undefined Нажата кнопка "ОК" или "Отмена"
          */
         /**
          * @event onChoose Событие нажатия на кнопку в окне.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {ChosenStatus} Вариант диалога, выбранный нажатием соответствующей кнопки
          * @variant
          */
         $protected: {
            _options: {

               /**
                * @cfg {SubmitPopupStatus} Состояние диалога. От состояния заивисит цвет линии в шапке и набор кнопок.
                */
               status: 'default',
               /**
                * @cfg {String} Отображаемое сообщение.
                */
               message: '',

               /**
                * @cfg {String} Детали сообщения, отображаются под основным сообщением.
                */
               details: '',

               /**
                * @cfg {Boolean} Использовать ли кнопку Отмена. Опция актуальна только для окна подтверждения.
                */
               hasCancelButton: false,

               /*
                * @noShow
                */
               template: template,

               isModal: true
            }
         },
         $constructor : function(){
            this._publish('onChoose');
         },

         init : function() {
            SubmitPopup.superclass.init.call(this);

            var self = this;

            if(this._options.status === 'confirm'){
               this.subscribeTo(this.getChildControlByName('positiveButton'), 'onActivated', function(){
                  self._choose(true);
               });
               this.subscribeTo(this.getChildControlByName('negativeButton'), 'onActivated', function(){
                  self._choose(false);
               });

               if(this._options.hasCancelButton){
                  this.subscribeTo(this.getChildControlByName('cancelButton'), 'onActivated', function(){
                     self._choose();
                  });
               }
            }
            else {
               this.subscribeTo(this.getChildControlByName('okButton'), 'onActivated', function(){
                  self._choose();
               });
            }
         },

         /*
          * @private
          */
         _choose: function(value){
            this._notify('onChoose', value);
            this.close();
         }
      });
      return SubmitPopup;
   }
);