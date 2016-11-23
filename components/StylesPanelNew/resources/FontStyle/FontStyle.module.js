define('js!SBIS3.CONTROLS.FontStyle', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FontStyle',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.ToggleButton',
   'js!SBIS3.CONTROLS.ComboBox'
], function(CompoundControl, dotTplFn) {

   'use strict';

   var FontStyle = CompoundControl.extend( /** @lends SBIS3.CONTROLS.StylesPanel.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            style: undefined,
            fontSizes: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
         }
      },

      init: function() {
         FontStyle.superclass.init.call(this);
      }
   });

   return FontStyle;

});
