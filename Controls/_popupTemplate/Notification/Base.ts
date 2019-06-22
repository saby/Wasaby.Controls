import Control = require('Core/Control');
import Env = require('Env/Env');
import template = require('wml!Controls/_popupTemplate/Notification/Base/Base');
import 'css!theme?Controls/popupTemplate';
      /**
       * Base template of notification popup.
       *
       * @class Controls/_popupTemplate/Notification/Base
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @author Красильников А.С.
       * @mixes Controls/_popupTemplate/Notification/NotificationStyles
       * @demo Controls-demo/Popup/Templates/NotificationTemplatePG
       */

      var Notification = Control.extend({
         _template: template,

         _timerId: null,
         _style: null,

         _closeClick: function() {
            this._notify('close', []);
         }
      });

      Notification.getDefaultOptions = function() {
         return {
            style: 'primary',
            autoClose: true
         };
      };

      export = Notification;


/**
 * @name Controls/_popupTemplate/Notification/Base#autoClose
 * @cfg {Number} Close by timeout after open.
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#style
 * @cfg {String} Notification display style.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#bodyContentTemplate
 * @cfg {function|String} Main content.
 */
