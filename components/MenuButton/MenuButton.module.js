/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.MenuButton', ['js!SBIS3.CONTROLS.ToggleButton'], function(ToggleButton) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.ToggleButton
    * @mixes SBIS3.CONTROLS._PickerMixin
    * @control
    * @category Navigation
    */

   var MenuButton = ToggleButton.extend( /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return MenuButton;

});