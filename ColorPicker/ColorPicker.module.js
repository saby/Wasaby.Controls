define('js!SBIS3.CONTROLS.ColorPicker', ['js!SBIS3.CONTROLS.TextBox'], function(TextBox) {

   'use strict';

   /**
    * Контрол, позволяющий выбрать цвет. Можно задать как шестадцатеричный код в виде текста, так и выбрать из выпадающего блока
    * @class SBIS3.CONTROLS.ColorPicker
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS._PickerMixin
    * @control
    */

   var ColorPicker = TextBox.extend(/** @lends SBIS3.CONTROLS.ColorPicker.prototype */{
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return ColorPicker;

});