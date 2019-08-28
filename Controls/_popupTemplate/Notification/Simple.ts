import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Notification/Simple/Simple');
      /**
       * Базовый шаблон <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/'>простого окна уведомления</a>.
       *
       * @class Controls/_popupTemplate/Notification/Simple
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @demo Controls-demo/NotificationDemo/NotificationTemplate
       * @author Красильников А.С.
       */
      /*
       * Template (WML) of simple notification.
       *
       * @class Controls/_popupTemplate/Notification/Simple
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @demo Controls-demo/NotificationDemo/NotificationTemplate
       * @author Красильников А.С.
       */

      var Notification = Control.extend({
         _template: template,

         _timerId: null,
         _iconStyle: null,
         _beforeMount: function() {
            this._iconStyle = {
               warning: 'attention',
               attention: 'attention',
               success: 'done',
               done: 'done',
               danger: 'error',
               error: 'error',
               primary: 'primary'
            };
         },

         _closeClick: function() {
            this._notify('close', []);
         }
      });

      Notification.getDefaultOptions = function() {
         return {
            style: 'primary',
            autoClose: true,
            closeButtonVisibility: true
         };
      };

      export = Notification;


/**
 * @name Controls/_popupTemplate/Notification/Simple#autoClose
 * @cfg {Number} Устанавливает интервал, по истечении которого окно закроется автоматически.
 * @default true
 */
/*
 * @name Controls/_popupTemplate/Notification/Simple#autoClose
 * @cfg {Number} Close by timeout after open
 * @default true
 */

/**
 * @name Controls/_popupTemplate/Notification/Simple#style
 * @cfg {String} Устанавливает стиль отображения окна уведомления.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 * @default primary
 */
/*
 * @name Controls/_popupTemplate/Notification/Simple#style
 * @cfg {String} Notification display style.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 * @default primary
 */

/**
 * @name Controls/_popupTemplate/Notification/Simple#closeButtonVisibility
 * @cfg {Boolean} Устанавливает видимость кнопки, закрывающей окно.
 * @default true
 */
/*
 * @name Controls/_popupTemplate/Notification/Simple#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 * @default true
 */

/**
 * @name Controls/_popupTemplate/Notification/Simple#icon
 * @cfg {Object} Устанавливает значок сообщения окна уведомления.
 */
/*
 * @name Controls/_popupTemplate/Notification/Simple#icon
 * @cfg {Object} Notification message icon.
 */

/**
 * @name Controls/_popupTemplate/Notification/Simple#text
 * @cfg {String} Устанавливает текст уведомления.
 */
/*
 * @name Controls/_popupTemplate/Notification/Simple#text
 * @cfg {String} Notification message.
 */
