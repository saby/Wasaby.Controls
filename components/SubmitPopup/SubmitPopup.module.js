define('js!SBIS3.CONTROLS.SubmitPopup', [
      'js!SBIS3.CONTROLS.InformationPopup',
      'html!SBIS3.CONTROLS.SubmitPopup/resources/template',
      'js!SBIS3.CONTROLS.Button'
   ],

   /**
    * Информационный окно.
    * В зависимости от состояния, может быть диалогом подтверждения, с кнопками "Да", "Нет", "Отмена" (опционально),
    * и диалогами с кнопкой "Ок".
    * @class SBIS3.CONTROLS.InformationPopup
    * @extends SBIS3.CONTROLS.FloatArea
    * @control
    * @author Степин П.В.
    */
   function(InformationPopup, template){
      'use strict';
      var module = InformationPopup.extend( /** @lends SBIS3.CONTROLS.SubmitPopup.prototype */ {
         $protected: {
            _options: {
               /**
                * @cfg {String} Состояние окна.
                * @variant default  Окно подтверждения. Содержит кнопки "Да", "Нет", "Отмена" (опционально) и синию линию сверху.
                * @variant success  Окно успешного выполения команды. Содержит одну кнопку "Ок" и зеленую линию сверху.
                * @variant error    Окно ошибки. Содержит одну кнопку "Ок" и красную линию сверху.
                * @variant warning  Окно предупреждения. Содержит одну кнопку "Ок" и оранжевую линию сверху.
                */
               state: 'default',

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
            this._publish('onChoose')
         },

         init : function() {
            module.superclass.init.call(this);

            var self = this;

            if(this._options.state === 'default'){
               this.subscribeTo(this.getChildControlByName('positiveButton'), 'onActivated', function(){
                  self._choose(true);
               });
               this.subscribeTo(this.getChildControlByName('negativeButton'), 'onActivated', function(){
                  self._choose(false);
               });

               if(this._options.threeButton){
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

         _choose: function(value){
            this._notify('onChoose', value);
            this.close();
         }
      });
      return module;
   }
);