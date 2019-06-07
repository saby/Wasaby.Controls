import {Notification} from 'Controls/popupTemplate';
import template = require('wml!Controls/_compatiblePopup/Notification/Base');

var NotificationBase = Notification.extend({
   _template: template,

   _beforeMount: function(options) {
      var _this = this;

      _this._contentTemplateOptions = options.contentTemplateOptions;

      /**
       * После показа размеры контента изменяться, нужно сказать об этом потомкам.
       */
      _this._contentTemplateOptions.handlers = {
         onAfterShow: function() {
            _this._notify('controlResize', [], { bubbling: true });
         }
      };

      return NotificationBase.superclass._beforeMount.apply(_this, arguments);
   }
});

export default NotificationBase;
