/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.PasswordTextBox', ['js!SBIS3.CONTROLS.TextBox', 'html!SBIS3.CONTROLS.PasswordTextBox'], function (TextBox, dotTplFn) {

   'use strict';
   /**
    * Поле ввода пароля.
    * @class SBIS3.CONTROLS.PasswordTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @demo SBIS3.Demo.Control.MyPasswordTextBox
    * @public
    * @category Inputs
    * @ignoreOptions independentContext contextRestriction isContainerInsideParent owner stateKey subcontrol
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment
    */
   var PasswordTextBox;
   PasswordTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.PasswordTextBox.prototype */ {
      _dotTplFn: dotTplFn,
      $constructor: function() {
         //TODO: избавиться от фикса высоты поля ввода пароля в IE>8
         if ($ws._const.browser.isIE) {
            this.getContainer().find('.controls-TextBox__field').addClass('controls-TextBox__field__fixIE');
         }
      }
   });

   return PasswordTextBox;

});