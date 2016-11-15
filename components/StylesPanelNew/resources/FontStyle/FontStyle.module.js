define('js!SBIS3.CONTROLS.FontStyle', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FontStyle',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.ToggleButton',
   'js!SBIS3.CONTROLS.ComboBox'
], function(CompoundControl, dotTplFn) {

   'use strict';

   var FontStyle = CompoundControl.extend(/** @lends SBIS3.CONTROLS.StylesPanel.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            style: undefined
         }
      },

      init: function () {
         FontStyle.superclass.init.call(this);
      }
   });

   return FontStyle;

});