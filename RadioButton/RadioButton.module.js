/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.RadioButton', ['js!SBIS3.CONTROLS.RadioButtonBase'], function(RadioButtonBase) {

   'use strict';

   /**
    * Контрол, отображающий стандартный радиобаттон. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.RadioButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @control
    */

   var RadioButton = RadioButtonBase.extend( /** @lends SBIS3.CONTROLS.RadioButton.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return RadioButton;

});