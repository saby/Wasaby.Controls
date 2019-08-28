import Control = require('Core/Control');
import Env = require('Env/Env');
import template = require('wml!Controls/_popupTemplate/Notification/Base/Base');
import 'css!theme?Controls/popupTemplate';
      /**
       * Базовый шаблон <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/#template'>окна уведомления</a>.
       *
       * @class Controls/_popupTemplate/Notification/Base
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @author Красильников А.С.
       * @mixes Controls/_popupTemplate/Notification/NotificationStyles
       * @demo Controls-demo/NotificationDemo/NotificationTemplate
       */
      /*
       * Base template of notification popup.
       *
       * @class Controls/_popupTemplate/Notification/Base
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @author Красильников А.С.
       * @mixes Controls/_popupTemplate/Notification/NotificationStyles
       * @demo Controls-demo/NotificationDemo/NotificationTemplate
       */

      var Notification = Control.extend({
         _template: template,

         _timerId: null,

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
 * @name Controls/_popupTemplate/Notification/Base#autoClose
 * @cfg {Number} Устанавливает интервал, по истечении которого окно закроется автоматически.
 */
/*
 * @name Controls/_popupTemplate/Notification/Base#autoClose
 * @cfg {Number} Close by timeout after open.
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#style
 * @cfg {String} Устанавливает стиль отображения окна уведомления.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 */
/*
 * @name Controls/_popupTemplate/Notification/Base#style
 * @cfg {String} Notification display style.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#closeButtonVisibility
 * @cfg {Boolean} Устанавливает видимость кнопки, закрывающей окно.
 * @default true
 */
/*
 * @name Controls/_popupTemplate/Notification/Base#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 * @default true
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#bodyContentTemplate
 * @cfg {function|String} Определяет основной контент окна уведомления.
 */
/*
 * @name Controls/_popupTemplate/Notification/Base#bodyContentTemplate
 * @cfg {function|String} Main content.
 */
