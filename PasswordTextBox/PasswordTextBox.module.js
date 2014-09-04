define('js!SBIS3.CONTROLS.PasswordTextBox', ['js!SBIS3.CONTROLS.TextBox'], function(TextBox) {

   'use strict';
   /**
    * Ввод пароля.
    * Сделан отдельным компонентом для того, чтобы не наследовать опцию текстового поля во все дочерние компоненты
    * @class SBIS3.CONTROLS.PasswordTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    */

   var PasswordTextBox = TextBox.extend( /** @lends SBIS3.CONTROLS.PasswordTextBox.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return PasswordTextBox;

});