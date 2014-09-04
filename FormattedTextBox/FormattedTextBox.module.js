define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FormattedTextBox = Control.Control.extend(/** @lends SBIS3.CONTROLS.FormattedTextBox.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {RegExp} формат ввода, всё что не подходит нельзя ввести
             */
            pattern: ''
         }
      },

      $constructor: function() {

      }

   });

   return FormattedTextBox;

});