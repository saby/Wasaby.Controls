define('Controls/Popup/Templates/Notification/Compatible',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!Controls/Popup/Templates/Notification/Compatible',
      'css!Controls/Popup/Templates/Notification/Compatible'
   ],
   function(Control, template) {

      var Compatible = Control.extend({
         _dotTplFn: template,

         close: function() {
            this._options._opener.close();
         }
      });

      return Compatible;
   }
);
