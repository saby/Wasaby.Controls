define('js!SBIS3.CONTROLS.NumberTextBox', ['js!SBIS3.CONTROLS.TextBox'], function(TextBox) {

   'use strict';

   /**
    * Поле ввода, куда можно вводить только числовые значения
    * @class SBIS3.CONTROLS.NumberTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    */

   var NumberTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.NumberTextBox.prototype */{
      $protected: {
         _options: {

            /**
             * @cfg {Boolean} Можно вводить только положительыне
             */
            onlyPositive: false,

            /**
             * @cfg {Boolean} Можно вводить только целые
             */
            onlyInteger: false,

            /**
             * @cfg {Number} Количество знаков после запятой
             */
            numberFractDigits: null
         }
      },

      $constructor: function() {

      }

   });

   return NumberTextBox;

});