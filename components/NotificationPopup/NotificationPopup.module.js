define('js!SBIS3.CONTROLS.NotificationPopup', [
      'js!SBIS3.CONTROLS.InformationPopup',
      'html!SBIS3.CONTROLS.NotificationPopup/resources/template',
      'html!SBIS3.CONTROLS.NotificationPopup/resources/headerTpl',
      'css!SBIS3.CONTROLS.NotificationPopup'
   ],

   /**
    * Класс контрола "Всплывающее нотификационное уведомление", для которого можно установить иконку (см. {@link icon}), заголовок (см. {@link caption}) и шаблоны (см. {@link headerTemplate}, {@link bodyTemplate} и {@link footerTemplate}).
    * Для вызова контрола рекомендуется использовать {@link SBIS3.CONTROLS.Utils.InformationPopupManager}.
    * @class SBIS3.CONTROLS.NotificationPopup
    * @extends SBIS3.CONTROLS.InformationPopup
    * @control
    * @public
    * @author Степин Павел Владимирович
    */
   function(InformationPopup, template, headerTpl){
      'use strict';

      var ICONS = {
         success: 'icon-size icon-24 icon-Yes icon-done',
         error: 'icon-size icon-24 icon-Alert icon-error',
         warning: '',
         'default': ''
      };

      var NotificationPopup = InformationPopup.extend( /** @lends SBIS3.CONTROLS.NotificationPopup.prototype */ {
         $protected: {
            _options: {
               /**
                * @cfg {Function} Устанавливает шаблон шапки нотификационного уведомления.
                * @remark
                * По умолчанию используется шаблон с иконкой и заголовком.
                * Внутри шаблона объект it возвращает опции класса.
                * @see bodyTemplate
                * @see footerTemplate
                * @see icon
                */
               headerTemplate: headerTpl,
               /**
                * @cfg {Function} Устанавливает шаблон для содержимого нотификационного уведомления.
                * @remark
                * Внутри шаблона объект it возвращает опции класса.
                * @see headerTemplate
                * @see footerTemplate
                */
               bodyTemplate: null,
               /**
                * @cfg {Function} Устанавливает шаблон футера нотификационного уведомления.
                * @remark
                * Внутри шаблона объект it возвращает опции класса.
                * @see headerTemplate
                * @see bodyTemplate
                */
               footerTemplate: null,
               /**
                * @cfg {String} Устанавливает иконку в заголовке нотификационного уведомления.
                * @remark
                * По умолчанию отображается в шапке нотификационного сообщения и зависит от значения опции {@link SBIS3.CONTROLS.InformationPopup#status}.
                * Список иконок доступен <a href='https://wi.sbis.ru/docs/icons/'>здесь</a>.
                * @see setIcon
                */
               icon: null,
               /**
                * @cfg {String} Устанавливает текст заголовка нотификационного уведомления.
                * @remark
                * По умолчанию отображается в шапке нотификационного сообщения.
                * @translatable
                * @see setCaption
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
          * Установливает заголовок нотификационного уведомления.
          * @param {String} caption Текст заголовка.
          * @see caption
          */
         setCaption: function(caption){
            if(typeof caption === 'string'){
               this.getContainer().find('.controls-NotificationPopup__header_caption').text(caption);
            }
         },
         /**
          * Установливает иконку в заголовке нотификационного уведомления.
          * @param {String} icon Иконка. Список иконок доступен <a href='https://wi.sbis.ru/docs/icons/'>здесь</a>.
          * @see icon
          */
         setIcon: function(icon){
            if(typeof icon === 'string'){
               this._setIcon(icon);
               this._customIcon = true;
            }
         },
         setStatus: function(status){
            if(!this._customIcon){
               this._setIcon(ICONS[status] || '');
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