/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.PasswordTextBox', ['js!SBIS3.CONTROLS.TextBox', 'html!SBIS3.CONTROLS.PasswordTextBox'], function (TextBox, dotTplFn) {

   'use strict';
   /**
    * Ввод пароля.
    * Сделан отдельным компонентом для того, чтобы не наследовать опцию текстового поля во все дочерние компоненты
    * @class SBIS3.CONTROLS.PasswordTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @category Inputs
    */
   var PasswordTextBox;
   PasswordTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.PasswordTextBox.prototype */ {
      _dotTplFn: dotTplFn,
      $constructor: function() {
         //TODO: избавиться от фикса высоты поля ввода пароля в IE>8
         this.getContainer().find('.controls-TextBox__field').addClass('controls-TextBox__field__fixIE');
      }
   });

   return PasswordTextBox;

});