define('js!WSControls/Containers/Blackbox',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!WSControls/Containers/Blackbox'
   ],
   function(CompoundControl,
            template) {
      var Blackbox = CompoundControl.extend({
         _dotTplFn: template
      });

      return Blackbox;
   });