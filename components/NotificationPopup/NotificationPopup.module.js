define('js!SBIS3.CONTROLS.NotificationPopup', [
      'js!SBIS3.CONTROLS.Popup',
      'html!SBIS3.CONTROLS.NotificationPopup/resources/contentTpl',
      'html!SBIS3.CONTROLS.NotificationPopup/resources/headerTpl'
   ],
   function(Popup, contentTpl, headerTpl){
      'use strict';
      var module = Popup.extend({
         $protected: {
            _options: {

               /**
                * @cfg {Function} Шаблон шапки. По умолчанию используется шаблон с иконкой и заголовком.
                */
               headerTemplate: headerTpl,

               /**
                * @cfg {Function} Шаблон для содержимого
                */
               bodyTemplate: null,

               /**
                * @cfg {Function} Шаблон для нижней части
                */
               footerTemplate: null,

               /**
                * @cfg {String} Иконка. Отображается в шапке.
                * По умолчанию иконка завимсит от опции state.
                */
               icon: null,

               /**
                * @cfg {String} Заголовок. Отображается в шапке.
                */
               caption: null,

               /**
                * @cfg {String} Состояние окна.
                * @variant default  Цвет линии в шапке будет синим.
                * @variant success  Цвет линии в шапке будет зеленым.
                * @variant error    Цвет линии в шапке будет красным.
                * @variant warning  Цвет линии в шапке будет оранжевым.
                */
               state: 'default',

               contentTemplate: contentTpl
            }
         },
         $constructor : function(){
         },

         init : function() {
            module.superclass.init.call(this);

            if(!this._options.icon){
               switch(this._options.state){
                  case 'success':
                     this.setIcon('icon-24 icon-Yes icon-done');
                     break;
                  case 'error':
                     this.setIcon('icon-24 icon-Alert icon-error');
                     break;
               }
            }
         },

         /**
          * Установить заголовок
          * @param caption
          */
         setCaption: function(caption){
            if(typeof caption === 'string'){
               this.getContainer().find('.NotificationPopup__header_caption').text(caption);
            }
         },

         /**
          * Установить иконку
          * @param icon
          */
         setIcon: function(icon){
            if(typeof icon === 'string'){
               this.getContainer().find('.NotificationPopup__header_icon').removeClass(this._options.icon).addClass(icon);
               this._options.icon = icon;
            }
         }
      });
      return module;
   }
);