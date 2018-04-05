define('SBIS3.CONTROLS/StylesPanelNew/resources/FontStyle/FontStyle', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/StylesPanelNew/resources/FontStyle/FontStyle',
   'SBIS3.CONTROLS/Button/IconButton',
   'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
   'SBIS3.CONTROLS/ComboBox',
   'css!SBIS3.CONTROLS/Button/ToggleButton/resources/ToggleButton__square'
], function(CompoundControl, dotTplFn) {

   'use strict';
   
   function fontSizesConvert(fontSize) {
      var result = {};

      result.key = fontSize;
      result.value = fontSize + 'px';
      return result;
   }

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
      },

      _modifyOptions: function(options) {
         FontStyle.superclass._modifyOptions.call(this, options);
         options._fontSizesConvert = fontSizesConvert;

         return options;
      }
   });

   return FontStyle;

});
