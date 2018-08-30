define('SBIS3.CONTROLS/NotificationPopup', [
      'SBIS3.CONTROLS/InformationPopup',
      'tmpl!SBIS3.CONTROLS/NotificationPopup/resources/template',
      'tmpl!SBIS3.CONTROLS/NotificationPopup/resources/headerTpl',
      'Core/detection',
      'css!SBIS3.CONTROLS/NotificationPopup/NotificationPopup'
   ],

   /**
    * Класс контрола "Всплывающее нотификационное уведомление", для которого можно установить иконку (см. {@link icon}), заголовок (см. {@link caption}) и шаблоны (см. {@link headerTemplate}, {@link bodyTemplate} и {@link footerTemplate}).
    * Для вызова контрола рекомендуется использовать {@link SBIS3.CONTROLS/Utils/InformationPopupManager}.
    * @class SBIS3.CONTROLS/NotificationPopup
    * @extends SBIS3.CONTROLS/InformationPopup
    * @control
    * @public
    * @author Красильников А.С.
    *
    * @ignoreOptions contextRestriction independentContext modal validateIfHidden
    *
    * @ignoreMethod activateFirstControl activateLastControl addPendingOperation destroyChild detectNextActiveChildControl disableActiveCtrl
    * @ignoreMethods getAllPendingInfo getImmediateChildControls getNamedGroup getNearestChildControlByName getResizer getToolBarCount
    * @ignoreMethods hasActiveChildControl increaseToolBarCount isAllReady isModal isPage moveToTop setEnabled setSize waitAllPendingOperations
    *
    * @ignoreMethods _destroySuperClass _getControlsToBuild _isActiveByTabindex _keyboardHover _loadDescendents _onClickHandler
    * @ignoreMethods _subscribeToWindowResize _templateInnerCallbackBeforeReady
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onReady onResize
    *
    */
   function(InformationPopup, template, headerTpl, detection){
      'use strict';

      var ICONS = {
         success: 'icon-size icon-24 icon-Yes icon-done',
         error: 'icon-size icon-24 icon-Alert icon-error',
         warning: 'icon-size icon-24 icon-Alert icon-attention',
         'default': ''
      };

      var NotificationPopup = InformationPopup.extend( /** @lends SBIS3.CONTROLS/NotificationPopup.prototype */ {
         $protected: {
            _options: {
               /**
                * @cfg {Function} Устанавливает шаблон шапки нотификационного уведомления.
                * @remark
                * По умолчанию используется шаблон с иконкой и заголовком.
                * Внутри шаблона объект it возвращает опции класса.
                * Чтобы при создании headerTemplate иконка, отображающая статус процесса, менялась, нужно элементу с иконкой добавить класс controls-NotificationPopup__header_icon.
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
                * По умолчанию отображается в шапке нотификационного сообщения и зависит от значения опции {@link SBIS3.CONTROLS/InformationPopup#status}.
                * Список иконок доступен <a href='/docs/icons/'>здесь</a>.
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
               /**
                * @noShow
                */
               template: template,
               /**
                * @noShow
                */
               activableByClick: false,
               /**
                * @noShow
                */
               additionalClass: 'controls-NotificationPopup_popup',
               closeButton: true,
               crossStyle: 'light'
            },

            _customIcon: false
         },

         init : function() {
            NotificationPopup.superclass.init.call(this);

            var self = this;

            if (this._options.icon){
               this.setIcon(this._options.icon);
            }
            else{
               this.setStatus(this._options.status);
            }

            //По свайпу будем закрывать окно.
            if(detection.isMobilePlatform) {
               this.getContainer().on('swipe', function(){
                  self.close();
               });
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
          * @param {String} icon Иконка. Список иконок доступен <a href='/docs/icons/'>здесь</a>.
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
         },

         destructor: function(){
            if(detection.isMobilePlatform) {
               this.getContainer().off('swipe');
            }

            NotificationPopup.superclass.destructor.call(this);
         }
      });
      return NotificationPopup;
   }
);