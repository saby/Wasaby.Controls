define('js!WSControls/Containers/Blackbox',
   [
      'Core/Control',
      'tmpl!WSControls/Containers/Blackbox'
   ],
   function(Control,
            template) {
      var Blackbox = Control.extend({
         _template: template,

         _shouldUpdate: function() {
            return false;
         }
      });

      return Blackbox;
   });