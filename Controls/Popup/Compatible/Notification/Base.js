define('Controls/Popup/Compatible/Notification/Base',
   [
      'Controls/Popup/Templates/Notification/Base',
      'wml!Controls/Popup/Compatible/Notification/Base'
   ],
   function(NotificationBase, template) {

      var Notification = NotificationBase.extend({
         _template: template,

         _beforeMount: function(options) {
            var _this = this;

            _this._contentTemplateOptions = options.contentTemplateOptions;

            /**
             * После показа размеры контента изменяться, нужно сказать об этом потомкам.
             */
            _this._contentTemplateOptions.handlers = {
               onAfterShow: function() {
                  _this._notify('controlResize', [], {bubbling: true});
               }
            };
         }
      });

      return Notification;
   }
);
