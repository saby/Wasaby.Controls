define('js!SBIS3.CONTROLS.NotificationPopup', [
      'js!SBIS3.CONTROLS.InformationPopup',
      'html!SBIS3.CONTROLS.NotificationPopup/resources/template',
      'html!SBIS3.CONTROLS.NotificationPopup/resources/headerTpl'
   ],

   /**
    * Всплывающее нотификационное уведомление с иконкой, заголовком и дополнительным содержимым.
    * @class SBIS3.CONTROLS.NotificationPopup
    * @extends SBIS3.CONTROLS.InformationPopup
    * @control
    * @author Степин П.В.
    */
   function(InformationPopup, template, headerTpl){
      'use strict';

      var ICONS = {
         success: 'icon-24 icon-Yes icon-done',
         error: 'icon-24 icon-Alert icon-error',
         warning: '',
         default: ''
      };

      var NotificationPopup = InformationPopup.extend( /** @lends SBIS3.CONTROLS.NotificationPopup.prototype */ {
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
                * По умолчанию иконка зависит от опции status.
                */
               icon: null,

               /**
                * @cfg {String} Заголовок. Отображается в шапке.
                * @translatable
                */
               caption: null,

               /*
                * @noShow
                */
               template: template,

               /*
                * @noShow
                */
               activableByClick: false
            },

            _customIcon: false
         },
         $constructor : function(){
         },

         init : function() {
            NotificationPopup.superclass.init.call(this);

            if (this._options.icon){
               this.setIcon(this._options.icon);
            }
            else{
               this.setStatus(this._options.status);
            }
         },

         /**
          * Установить заголовок
          * @param {String} caption Новый заголовок
          */
         setCaption: function(caption){
            if(typeof caption === 'string'){
               this.getContainer().find('.controls-NotificationPopup__header_caption').text(caption);
            }
         },

         /**
          * Установить иконку
          * @param {String} icon Новая иконка
          */
         setIcon: function(icon){
            if(typeof icon === 'string'){
               this._setIcon(icon);
               this._customIcon = true;
            }
         },

         /**
          * Установить новое состояние
          * @param {InformationPopupStatus} status
          */
         setStatus: function(status){
            if(!this._customIcon){
               this._setIcon(ICONS[status] || '');
               this._customIcon = false;
            }

            NotificationPopup.superclass.setStatus.call(this, status);
         },

         _setIcon: function(icon){
            this.getContainer().find('.controls-NotificationPopup__header_icon').removeClass(this._options.icon).addClass(icon);
            this._options.icon = icon;
         }
      });
      return NotificationPopup;
   }
);