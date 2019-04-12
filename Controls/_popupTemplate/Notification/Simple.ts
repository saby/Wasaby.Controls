import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Notification/Simple/Simple');
      /**
       * Template (WML) of simple notification.
       *
       * @class Controls/Popup/Templates/Notification/Simple
       * @extends Core/Control
       * @control
       * @public
       * @category popup
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
            autoClose: true
         };
      };

      export = Notification;


/**
 * @name Controls/Popup/Templates/Notification/Simple#autoClose
 * @cfg {Number} Close by timeout after open
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#style
 * @cfg {String} Notification display style.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#icon
 * @cfg {Object} Notification message icon.
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#text
 * @cfg {String} Notification message.
 */
