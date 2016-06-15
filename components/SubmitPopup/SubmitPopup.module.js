define('js!SBIS3.CONTROLS.SubmitPopup', [
      'js!SBIS3.CONTROLS.InformationPopup',
      'html!SBIS3.CONTROLS.SubmitPopup/resources/contentTpl',
      'js!SBIS3.CONTROLS.Button'
   ],
   function(InformationPopup, contentTpl){
      'use strict';
      var module = InformationPopup.extend({
         $protected: {
            _options: {
               /**
                * @cfg {String} Состояние окна.
                * @variant default  Окно подтверждения. Содержит кнопки "Да", "Нет" и может содержать кнопку "Отмена"
                * @variant success  Окно успешного выполения команды. Содержит одну кнопку "Ок"
                * @variant error    Окно ошибки. Содержит одну кнопку "Ок"
                * @variant warning  Окно предупреждения. Содержит одну кнопку "Ок"
                */
               state: 'default',

               /**
                * @cfg {String} Отображаемое сообщение.
                */
               message: '',

               /**
                * @cfg {String} Отображаемое сообщение, отображается под основным сообщением.
                */
               details: '',

               /**
                * @cfg {Boolean} Использовать ли кнопку Отмена. Опция актуальна только для окна подтверждения.
                */
               threeButton: false,

               /*
                * @noShow
                */
               contentTemplate: contentTpl
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