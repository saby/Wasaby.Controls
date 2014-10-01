/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.PasswordTextBox', ['js!SBIS3.CONTROLS.TextBox'], function (TextBox) {

   'use strict';
   /**
    * Ввод пароля.
    * Сделан отдельным компонентом для того, чтобы не наследовать опцию текстового поля во все дочерние компоненты
    * @class SBIS3.CONTROLS.PasswordTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    */
   var PasswordTextBox;
   PasswordTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.PasswordTextBox.prototype */ {
      $protected: {
         _options: {
            inputType: 'password'
         }
      },
      $constructor: function() {
         this.getContainer().addClass('controls-PasswordTextBox');
         //TODO: избавиться от фикса высоты поля ввода пароля в IE>8
         if ($ws._const.browser.isIE && ($ws._const.browser.isIE8 || $ws._const.browser.isIE9 || $ws._const.browser.isIE10 || $ws._const.browser.isModernIE)) {
            this.getContainer().find('.controls-TextBox__field').addClass('controls-TextBox__field__fixIE');
         }
      }
   });

   return PasswordTextBox;

});