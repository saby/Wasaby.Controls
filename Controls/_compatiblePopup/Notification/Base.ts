import {Notification} from 'Controls/popupTemplate';
import template = require('wml!Controls/_compatiblePopup/Notification/Base') ;
import {Notification} from '../../popupTemplate';

var NotificationPopup = Notification.extend({
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

      return NotificationPopup.superclass._beforeMount.apply(_this, arguments);
   }
});

export default NotificationPopup;
