define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', '!html!SBIS3.CONTROLS.FormattedTextBox', 'css!SBIS3.CONTROLS.FormattedTextBox'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    */

   var FormattedTextBox = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS.FormattedTextBox.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: 'd(ddd)ddd-dd-dd'
         }
      },

      $constructor: function () {
         this._initializeComponents();
      }
});

   return FormattedTextBox;
});